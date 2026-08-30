import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { BullPersonality, getRandomBullPersonality } from '../bullPersonality';

interface AICompetitor {
  sprite: Phaser.GameObjects.Image;
  speed: number;
  offsetAngle: number;
  name: string;
  distanceScore: number;
  timingScore: number;
  positionScore: number;
  angleScore: number;
  totalScore: number;
}

export class ArenaScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private bull!: Phaser.GameObjects.Image;
  private aiCompetitors: AICompetitor[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private personality!: BullPersonality;

  // Bull AI state
  private bullVelocity = new Phaser.Math.Vector2(0, 0);
  private bullTargetAngle = 0;
  private nextVeerTime = 0;
  private bullSpeed = 160;

  // Proximity phase timing
  private phaseDuration = 4500; // 4.5 seconds
  private phaseTimer = 0;
  private isPhaseActive = false;
  private retryCount = 0;

  // Player continuous scoring factors
  private playerScores = {
    distance: 0,
    timing: 0,
    position: 0,
    angle: 0,
    total: 0,
  };
  private playerCloseTime = 0;

  // Visual cues & HUD
  private proximityRing!: Phaser.GameObjects.Graphics;
  private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private countdownText!: Phaser.GameObjects.Text;
  private factorsHudText!: Phaser.GameObjects.Text;
  private personalityBadgeText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'ArenaScene' });
  }

  init(data: { retryCount?: number; personality?: BullPersonality }) {
    this.retryCount = data.retryCount || 0;
    this.personality = data.personality || getRandomBullPersonality();
    this.playerCloseTime = 0;
    this.bullSpeed = this.personality.speed;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);

    // Continuous arena drum ambiance
    soundManager.startFestiveDrums(145);

    // Arena Floor
    const ground = this.add.tileSprite(width / 2, height / 2, width, height, 'arena_ground');
    ground.setTint(0xdfbe93);

    // Festive Kolam (sacred rangoli patterns) at arena center
    const kolamGraphics = this.add.graphics();
    kolamGraphics.lineStyle(2, 0xffffff, 0.4);
    kolamGraphics.strokeCircle(width / 2, height / 2, 110);
    kolamGraphics.strokeCircle(width / 2, height / 2, 180);
    for (let deg = 0; deg < 360; deg += 45) {
      const rad = Phaser.Math.DegToRad(deg);
      kolamGraphics.strokeLineShape(new Phaser.Geom.Line(
        width / 2, height / 2,
        width / 2 + Math.cos(rad) * 180,
        height / 2 + Math.sin(rad) * 180
      ));
    }

    // Arena Boundary Fences (bamboo barricades)
    const fenceG = this.add.graphics();
    fenceG.lineStyle(8, 0x8b4513, 0.9);
    fenceG.strokeRect(20, 20, width - 40, height - 40);
    fenceG.lineStyle(2, 0xffd700, 0.5);
    fenceG.strokeRect(26, 26, width - 52, height - 52);

    // Crowd silhouettes on top & bottom perimeter
    this.add.image(width / 2, 15, 'crowd_silhouette').setScale(1.2, 0.6).setAlpha(0.7);
    this.add.image(width / 2, height - 15, 'crowd_silhouette').setScale(1.2, -0.6).setAlpha(0.7);

    // Particle Emitter for Sprinting Dust
    this.dustParticles = this.add.particles(0, 0, 'particle_dust', {
      lifespan: 400,
      scale: { start: 0.8, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      speed: { min: 20, max: 80 },
      emitting: false,
    });

    // Proximity indicator ring graphics
    this.proximityRing = this.add.graphics();

    // 1. Spawn Bull at top-center (emerging from Vaadivasal)
    this.bull = this.add.image(width / 2, 80, 'bull_top');
    this.bull.setScale(1.0);
    this.bull.setAngle(90); // Facing downwards
    this.bullVelocity.set(0, this.bullSpeed);

    // 2. Spawn Player near bottom
    this.player = this.add.image(width / 2, height - 100, 'player_top');
    this.player.setScale(1.1);

    // 3. Spawn 4 AI Competitors in semicircle formation
    this.aiCompetitors = [];
    const aiNames = ['Velan', 'Muthu', 'Kannan', 'Marudhu'];
    const aiStartPositions = [
      { x: width * 0.22, y: height - 130 },
      { x: width * 0.38, y: height - 85 },
      { x: width * 0.62, y: height - 85 },
      { x: width * 0.78, y: height - 130 },
    ];

    aiStartPositions.forEach((pos, idx) => {
      const aiSprite = this.add.image(pos.x, pos.y, `ai_tamer_top_${idx + 1}`);
      aiSprite.setScale(1.0);
      this.aiCompetitors.push({
        sprite: aiSprite,
        speed: 125 + Math.random() * 25,
        offsetAngle: (Math.random() - 0.5) * 0.8,
        name: aiNames[idx],
        distanceScore: 0,
        timingScore: 0,
        positionScore: 0,
        angleScore: 0,
        totalScore: 0,
      });
    });

    // Setup Keyboard Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    // Pointer / Touch support for mobile & mouse drag
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && this.isPhaseActive) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        this.player.x += Math.cos(angle) * 4.2;
        this.player.y += Math.sin(angle) * 4.2;
        this.player.rotation = angle + Math.PI / 2;
        this.dustParticles.emitParticleAt(this.player.x, this.player.y, 1);
      }
    });

    // TOP HUD: Bull Personality Badge & Countdown
    const hudTopContainer = this.add.container(width / 2, 38);
    const hudBg = this.add.rectangle(0, 0, 520, 56, 0x120b09, 0.85);
    hudBg.setStrokeStyle(1.5, Phaser.Display.Color.HexStringToColor(this.personality.color).color);

    this.personalityBadgeText = this.add.text(
      0,
      -12,
      `BULL: ${this.personality.badge} • ${this.personality.description}`,
      {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '12px',
        color: this.personality.color,
        fontStyle: 'bold',
      }
    ).setOrigin(0.5);

    this.countdownText = this.add.text(0, 10, 'FLANK THE HUMP FROM THE SIDE! (4s)', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '15px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    hudTopContainer.add([hudBg, this.personalityBadgeText, this.countdownText]);

    // Live 4-Factor Scoring HUD Bar (Distance, Timing, Position, Angle)
    this.factorsHudText = this.add.text(width / 2, 78, 'Distance: 0% | Timing: 0% | Position: 0% | Angle: 0%', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#00F5D4',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.phaseTimer = this.phaseDuration;
    this.isPhaseActive = true;
    this.nextVeerTime = this.time.now + (this.personality.veerIntervalMin + Math.random() * (this.personality.veerIntervalMax - this.personality.veerIntervalMin));
  }

  update(time: number, delta: number) {
    if (!this.isPhaseActive) return;

    const { width, height } = this.scale;
    const dt = delta / 1000;

    // --- 1. PARTICIPANT DETECTION & REACTIVE BULL AI ---
    // Detect closest participant approaching the bull (Player or AI)
    let closestParticipantDist = Infinity;
    let closestParticipantAngle = 0;

    const checkDist = (x: number, y: number) => {
      const d = Phaser.Math.Distance.Between(this.bull.x, this.bull.y, x, y);
      if (d < closestParticipantDist) {
        closestParticipantDist = d;
        closestParticipantAngle = Phaser.Math.Angle.Between(x, y, this.bull.x, this.bull.y);
      }
    };

    checkDist(this.player.x, this.player.y);
    this.aiCompetitors.forEach((ai) => checkDist(ai.sprite.x, ai.sprite.y));

    // Dynamic veer timing based on Personality
    if (time > this.nextVeerTime) {
      const margin = 90;
      let desiredAngle = this.bullTargetAngle + (Math.random() - 0.5) * this.personality.veerAngleMagnitude;

      // Evasive reaction: steer away from closest participant if within evasion radius
      if (closestParticipantDist < this.personality.evasionRadius) {
        const evadeWeight = this.personality.evasionStrength;
        desiredAngle = Phaser.Math.Angle.RotateTo(desiredAngle, closestParticipantAngle, evadeWeight);
      }

      // Avoid arena walls
      if (this.bull.x < margin) desiredAngle = 0; // Turn right
      else if (this.bull.x > width - margin) desiredAngle = Math.PI; // Turn left
      else if (this.bull.y < margin) desiredAngle = Math.PI / 2; // Turn down
      else if (this.bull.y > height - margin) desiredAngle = -Math.PI / 2; // Turn up

      this.bullTargetAngle = desiredAngle;
      
      // Calculate next veer interval
      const interval = this.personality.veerIntervalMin + Math.random() * (this.personality.veerIntervalMax - this.personality.veerIntervalMin);
      this.nextVeerTime = time + interval;
      soundManager.playThavilBass(0.35);
    }

    // Smoothly rotate bull towards target angle
    const turnRate = this.personality.type === 'Aggressive' || this.personality.type === 'Highly Reactive' ? 4.8 : 3.2;
    const currentBullAngle = Phaser.Math.DegToRad(this.bull.angle - 90);
    const newBullAngle = Phaser.Math.Angle.RotateTo(currentBullAngle, this.bullTargetAngle, turnRate * dt);
    this.bull.angle = Phaser.Math.RadToDeg(newBullAngle) + 90;

    // Move bull forward
    this.bull.x += Math.cos(newBullAngle) * this.bullSpeed * dt;
    this.bull.y += Math.sin(newBullAngle) * this.bullSpeed * dt;

    // Clamp bull in arena
    this.bull.x = Phaser.Math.Clamp(this.bull.x, 60, width - 60);
    this.bull.y = Phaser.Math.Clamp(this.bull.y, 60, height - 60);

    // Bull dust trails
    if (Math.random() < 0.4) {
      this.dustParticles.emitParticleAt(this.bull.x, this.bull.y, 1);
    }

    // --- 2. PLAYER CONTROLS (WASD & ARROWS) ---
    const playerSpeed = 220;
    let moveX = 0;
    let moveY = 0;

    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasdKeys.A?.isDown) moveX -= 1;
      if (this.cursors.right.isDown || this.wasdKeys.D?.isDown) moveX += 1;
      if (this.cursors.up.isDown || this.wasdKeys.W?.isDown) moveY -= 1;
      if (this.cursors.down.isDown || this.wasdKeys.S?.isDown) moveY += 1;
    }

    if (moveX !== 0 || moveY !== 0) {
      const moveVec = new Phaser.Math.Vector2(moveX, moveY).normalize();
      this.player.x += moveVec.x * playerSpeed * dt;
      this.player.y += moveVec.y * playerSpeed * dt;

      const targetRotation = Math.atan2(moveVec.y, moveVec.x) + Math.PI / 2;
      this.player.rotation = Phaser.Math.Angle.RotateTo(this.player.rotation, targetRotation, 10 * dt);

      this.dustParticles.emitParticleAt(this.player.x, this.player.y + 10, 1);
    }

    // Clamp player in bounds
    this.player.x = Phaser.Math.Clamp(this.player.x, 40, width - 40);
    this.player.y = Phaser.Math.Clamp(this.player.y, 40, height - 40);

    // --- 3. AI TAMERS INTERACTION ---
    this.aiCompetitors.forEach((ai) => {
      // Predict bull position slightly ahead
      const targetX = this.bull.x + Math.cos(newBullAngle + ai.offsetAngle) * 40;
      const targetY = this.bull.y + Math.sin(newBullAngle + ai.offsetAngle) * 40;

      const angleToTarget = Phaser.Math.Angle.Between(ai.sprite.x, ai.sprite.y, targetX, targetY);
      ai.sprite.x += Math.cos(angleToTarget) * ai.speed * dt;
      ai.sprite.y += Math.sin(angleToTarget) * ai.speed * dt;
      ai.sprite.rotation = angleToTarget + Math.PI / 2;

      // Calculate AI's 4 Continuous Scoring Factors
      const dist = Phaser.Math.Distance.Between(ai.sprite.x, ai.sprite.y, this.bull.x, this.bull.y);
      ai.distanceScore = Math.max(0, Math.min(100, Math.round((220 - dist) / 1.8)));

      const aiAngleToBull = Phaser.Math.Angle.Between(ai.sprite.x, ai.sprite.y, this.bull.x, this.bull.y);
      const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(aiAngleToBull - newBullAngle));
      ai.positionScore = Math.round(Math.sin(angleDiff) * 100);
      ai.angleScore = Math.max(0, Math.round((1 - Math.abs(angleDiff - Math.PI / 2) / (Math.PI / 2)) * 100));
      ai.timingScore = Math.min(100, Math.round((1 - this.phaseTimer / this.phaseDuration) * 70 + Math.random() * 30));

      ai.totalScore = Math.round(
        ai.distanceScore * 0.35 +
        ai.timingScore * 0.20 +
        ai.positionScore * 0.25 +
        ai.angleScore * 0.20
      );
    });

    // --- 4. CALCULATE PLAYER'S 4 CONTINUOUS SCORING FACTORS ---
    const playerDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bull.x, this.bull.y);
    
    // Factor 1: Distance (0 - 100)
    const distScore = Math.max(0, Math.min(100, Math.round((220 - playerDist) / 1.8)));

    // Factor 2: Timing / Sustained close pacing
    if (playerDist < 140) {
      this.playerCloseTime += dt * 35;
    }
    const timingScore = Math.min(100, Math.round(this.playerCloseTime));

    // Factor 3: Position Relative to Bull (Flank vs Head-on vs Tail)
    const angleToBull = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.bull.x, this.bull.y);
    const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(angleToBull - newBullAngle));
    const positionScore = Math.round(Math.sin(angleDiff) * 100);

    // Factor 4: Approach Angle alignment
    const playerHeading = this.player.rotation - Math.PI / 2;
    const headingDiff = Math.abs(Phaser.Math.Angle.Wrap(playerHeading - newBullAngle));
    const angleScore = Math.max(0, Math.min(100, Math.round((1 - headingDiff / Math.PI) * 100)));

    // Composite Total Score
    const totalScore = Math.round(
      distScore * 0.35 +
      timingScore * 0.20 +
      positionScore * 0.25 +
      angleScore * 0.20
    );

    this.playerScores = {
      distance: distScore,
      timing: timingScore,
      position: positionScore,
      angle: angleScore,
      total: totalScore,
    };

    // Update Live 4-Factor HUD Text
    this.factorsHudText.setText(
      `Distance: ${distScore}% | Timing: ${timingScore}% | Position: ${positionScore}% | Angle: ${angleScore}%`
    );

    const hudColor = totalScore > 65 ? '#00F5D4' : (totalScore > 40 ? '#FFD700' : '#FFA000');
    this.factorsHudText.setColor(hudColor);

    // --- 5. PROXIMITY HUD & RINGS ---
    this.proximityRing.clear();
    const ringColor = playerDist < 90 ? 0x00ff88 : (playerDist < 160 ? 0xffbb00 : 0xff4444);
    this.proximityRing.lineStyle(3, ringColor, 0.75);
    this.proximityRing.strokeCircle(this.bull.x, this.bull.y, 80);

    // Draw connection line to player
    this.proximityRing.lineStyle(1.5, ringColor, 0.5);
    this.proximityRing.lineBetween(this.player.x, this.player.y, this.bull.x, this.bull.y);

    // --- 6. TIMER & PHASE RESOLUTION ---
    this.phaseTimer -= delta;
    const secondsLeft = Math.max(0, Math.ceil(this.phaseTimer / 1000));
    this.countdownText.setText(`FLANK THE HUMP FROM THE SIDE! (${secondsLeft}s)`);

    if (this.phaseTimer <= 0) {
      this.resolveProximityPhase();
    }
  }

  // Calculate winner based on continuous 4-factor scores with 3rd-attempt player guarantee
  private resolveProximityPhase() {
    this.isPhaseActive = false;
    const { width, height } = this.scale;

    let bestAIScore = 0;
    let closestAIName = 'Velan';

    this.aiCompetitors.forEach((ai) => {
      if (ai.totalScore > bestAIScore) {
        bestAIScore = ai.totalScore;
        closestAIName = ai.name;
      }
    });

    const playerTotal = this.playerScores.total;

    // Guaranteed win by 3rd attempt (retryCount >= 2), or when player scores well
    const playerWon = (playerTotal >= bestAIScore - 15) || (this.playerScores.distance > 60) || (this.retryCount >= 2);

    if (playerWon) {
      soundManager.playCrowdCheer(4);
      soundManager.playGripSuccess(2);

      const banner = this.add.container(width / 2, height / 2);
      const bg = this.add.rectangle(0, 0, 450, 120, 0x120b09, 0.95);
      bg.setStrokeStyle(3, 0x00f5d4);
      const txt1 = this.add.text(0, -26, 'பிடி கிடைத்தது! GRIP SECURED!', {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '24px',
        color: '#00F5D4',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const txt2 = this.add.text(0, 6, `Flank Approach Score: ${Math.max(playerTotal, 78)}% vs ${this.personality.badge}`, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '14px',
        color: '#FFD700',
        fontStyle: '600',
      }).setOrigin(0.5);
      const txt3 = this.add.text(0, 30, 'Holding the hump! Ready for the rhythm lock...', {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '13px',
        color: '#FFFFFF',
      }).setOrigin(0.5);

      banner.add([bg, txt1, txt2, txt3]);
      banner.setScale(0);

      this.tweens.add({
        targets: banner,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: 'Back.easeOut',
      });

      this.time.delayedCall(1600, () => {
        this.cameras.main.fade(400, 18, 11, 9);
        this.time.delayedCall(450, () => {
          this.scene.start('TamingScene', {
            attempts: this.retryCount + 1,
            personality: this.personality,
          });
        });
      });

    } else {
      soundManager.playGripMiss();

      const banner = this.add.container(width / 2, height / 2);
      const bg = this.add.rectangle(0, 0, 470, 130, 0x120b09, 0.95);
      bg.setStrokeStyle(3, 0xf77f00);
      const txt1 = this.add.text(0, -30, 'வேகம் போதவில்லை! TOO FAR / OFF-ANGLE!', {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '20px',
        color: '#F77F00',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const txt2 = this.add.text(0, 2, `${closestAIName} outpaced you against the ${this.personality.badge} bull (${bestAIScore}% vs ${playerTotal}%)!`, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '12px',
        color: '#FFFFFF',
      }).setOrigin(0.5);
      const txt3 = this.add.text(0, 28, `Attempt ${this.retryCount + 1}/3 • Repositioning for next charge!`, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '13px',
        color: '#FFD700',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      banner.add([bg, txt1, txt2, txt3]);
      banner.setScale(0);

      this.tweens.add({
        targets: banner,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: 'Back.easeOut',
      });

      this.time.delayedCall(2200, () => {
        this.cameras.main.fade(350, 18, 11, 9);
        this.time.delayedCall(400, () => {
          this.scene.restart({ retryCount: this.retryCount + 1, personality: this.personality });
        });
      });
    }
  }
}
