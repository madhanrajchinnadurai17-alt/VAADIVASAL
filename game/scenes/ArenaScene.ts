import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { BullPersonality, getRandomBullPersonality } from '../bullPersonality';
import { VillageEvent, TAMIL_VILLAGES } from '../villageSystem';

interface AICompetitor {
  sprite: Phaser.GameObjects.Image;
  bibNumber: number;
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
  private village!: VillageEvent;

  // Bull AI state & dynamic routes
  private bullVelocity = new Phaser.Math.Vector2(0, 0);
  private bullTargetAngle = 0;
  private nextVeerTime = 0;
  private bullSpeed = 160;
  private selectedRoute = 'A';

  // Proximity phase timing
  private phaseDuration = 4500;
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
  private commentatorText!: Phaser.GameObjects.Text;
  private personalityBadgeText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'ArenaScene' });
  }

  init(data: { retryCount?: number; personality?: BullPersonality; village?: VillageEvent }) {
    this.retryCount = data.retryCount || 0;
    this.personality = data.personality || getRandomBullPersonality();
    this.village = data.village || TAMIL_VILLAGES[0];
    this.playerCloseTime = 0;
    this.bullSpeed = this.personality.speed + this.village.bullSpeedBonus;

    // Pick dynamic randomized route (A, B, C, D, E)
    const routes = ['A', 'B', 'C', 'D', 'E'];
    this.selectedRoute = routes[Math.floor(Math.random() * routes.length)];
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);
    soundManager.startFestiveDrums(145);

    // Village-Specific Arena Sand Floor
    const ground = this.add.tileSprite(width / 2, height / 2, width, height, 'arena_ground');
    ground.setTint(this.village.arenaTheme.groundTint);

    // Sacred Kolam center
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

    // Village-Specific Barricades
    const fenceG = this.add.graphics();
    fenceG.lineStyle(8, this.village.arenaTheme.fenceColor, 0.9);
    fenceG.strokeRect(20, 20, width - 40, height - 40);
    fenceG.lineStyle(2, 0xffd700, 0.5);
    fenceG.strokeRect(26, 26, width - 52, height - 52);

    // Crowd silhouettes based on density
    const crowdAlpha = Math.min(1.0, 0.5 * this.village.arenaTheme.crowdDensity);
    this.add.image(width / 2, 15, 'crowd_silhouette').setScale(1.2, 0.6).setAlpha(crowdAlpha);
    this.add.image(width / 2, height - 15, 'crowd_silhouette').setScale(1.2, -0.6).setAlpha(crowdAlpha);

    // Dust particles
    this.dustParticles = this.add.particles(0, 0, 'particle_dust', {
      lifespan: 400,
      scale: { start: 0.8, end: 0.1 },
      alpha: { start: 0.6, end: 0 },
      speed: { min: 20, max: 80 },
      emitting: false,
    });

    this.proximityRing = this.add.graphics();

    // 1. Spawn Bull at top-center
    this.bull = this.add.image(width / 2, 80, 'bull_top');
    this.bull.setScale(1.0);
    this.bull.setAngle(90);
    this.bullVelocity.set(0, this.bullSpeed);

    // 2. Spawn Player with Bib #07
    this.player = this.add.image(width / 2, height - 100, 'player_top');
    this.player.setScale(1.1);

    // 3. Spawn Numbered AI Competitors
    this.aiCompetitors = [];
    const aiData = [
      { name: 'Velan', bib: 18, sprite: 'ai_tamer_top_1', x: width * 0.22, y: height - 130 },
      { name: 'Muthu', bib: 24, sprite: 'ai_tamer_top_2', x: width * 0.38, y: height - 85 },
      { name: 'Kannan', bib: 31, sprite: 'ai_tamer_top_3', x: width * 0.62, y: height - 85 },
      { name: 'Marudhu', bib: 42, sprite: 'ai_tamer_top_4', x: width * 0.78, y: height - 130 },
      { name: 'Periyavan', bib: 55, sprite: 'ai_tamer_top_1', x: width * 0.5, y: height - 145 },
    ];

    const activeCount = Math.min(aiData.length, this.village.aiCompetitorCount);
    for (let i = 0; i < activeCount; i++) {
      const data = aiData[i];
      const aiSprite = this.add.image(data.x, data.y, data.sprite);
      aiSprite.setScale(1.0);
      this.aiCompetitors.push({
        sprite: aiSprite,
        bibNumber: data.bib,
        speed: 125 + Math.random() * 25,
        offsetAngle: (Math.random() - 0.5) * 0.8,
        name: data.name,
        distanceScore: 0,
        timingScore: 0,
        positionScore: 0,
        angleScore: 0,
        totalScore: 0,
      });
    }

    // Setup Controls
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    // Touch / Pointer controls
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && this.isPhaseActive) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
        this.player.x += Math.cos(angle) * 4.2;
        this.player.y += Math.sin(angle) * 4.2;
        this.player.rotation = angle + Math.PI / 2;
        this.dustParticles.emitParticleAt(this.player.x, this.player.y, 1);
      }
    });

    // TOP HUD: Village & Bull Personality Badge
    const hudTopContainer = this.add.container(width / 2, 38);
    const hudBg = this.add.rectangle(0, 0, 560, 56, 0x120b09, 0.85);
    hudBg.setStrokeStyle(1.5, Phaser.Display.Color.HexStringToColor(this.personality.color).color);

    this.personalityBadgeText = this.add.text(
      0,
      -12,
      `ARENA: ${this.village.tamilName.toUpperCase()} | BULL: ${this.personality.badge}`,
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

    // Live 4-Factor Scoring HUD Bar
    this.factorsHudText = this.add.text(width / 2, 76, 'Distance: 0% | Timing: 0% | Position: 0% | Angle: 0%', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#00F5D4',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Live Announcer Commentary Feed
    this.commentatorText = this.add.text(width / 2, 98, `🎙️ "${this.village.tamilName} வாடிவாசலில் சீறிப் பாய்கிறது காளை!"`, {
      fontFamily: "'Mukta Malar', sans-serif",
      fontSize: '12px',
      color: '#FFA000',
      fontStyle: '600',
      stroke: '#000000',
      strokeThickness: 2.5,
    }).setOrigin(0.5);

    this.phaseTimer = this.phaseDuration;
    this.isPhaseActive = true;
    this.nextVeerTime = this.time.now + (this.personality.veerIntervalMin + Math.random() * (this.personality.veerIntervalMax - this.personality.veerIntervalMin));
  }

  update(time: number, delta: number) {
    if (!this.isPhaseActive) return;

    const { width, height } = this.scale;
    const dt = delta / 1000;

    // Detect closest participant
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

    // Dynamic Route Steering Logic
    if (time > this.nextVeerTime) {
      const margin = 90;
      let desiredAngle = this.bullTargetAngle + (Math.random() - 0.5) * this.personality.veerAngleMagnitude;

      // Apply dynamic route bias
      if (this.selectedRoute === 'A') desiredAngle += 0.3; // Right arc
      else if (this.selectedRoute === 'B') desiredAngle -= 0.3; // Left arc

      // Evasive reaction away from closest participant
      if (closestParticipantDist < this.personality.evasionRadius) {
        const evadeWeight = this.personality.evasionStrength;
        desiredAngle = Phaser.Math.Angle.RotateTo(desiredAngle, closestParticipantAngle, evadeWeight);
      }

      // Avoid arena walls
      if (this.bull.x < margin) desiredAngle = 0;
      else if (this.bull.x > width - margin) desiredAngle = Math.PI;
      else if (this.bull.y < margin) desiredAngle = Math.PI / 2;
      else if (this.bull.y > height - margin) desiredAngle = -Math.PI / 2;

      this.bullTargetAngle = desiredAngle;
      const interval = this.personality.veerIntervalMin + Math.random() * (this.personality.veerIntervalMax - this.personality.veerIntervalMin);
      this.nextVeerTime = time + interval;
      soundManager.playThavilBass(0.35);
    }

    // Rotate & Move Bull
    const turnRate = this.personality.type === 'Aggressive' || this.personality.type === 'Highly Reactive' ? 4.8 : 3.2;
    const currentBullAngle = Phaser.Math.DegToRad(this.bull.angle - 90);
    const newBullAngle = Phaser.Math.Angle.RotateTo(currentBullAngle, this.bullTargetAngle, turnRate * dt);
    this.bull.angle = Phaser.Math.RadToDeg(newBullAngle) + 90;

    this.bull.x += Math.cos(newBullAngle) * this.bullSpeed * dt;
    this.bull.y += Math.sin(newBullAngle) * this.bullSpeed * dt;

    this.bull.x = Phaser.Math.Clamp(this.bull.x, 60, width - 60);
    this.bull.y = Phaser.Math.Clamp(this.bull.y, 60, height - 60);

    if (Math.random() < 0.4) {
      this.dustParticles.emitParticleAt(this.bull.x, this.bull.y, 1);
    }

    // Player Controls
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

    this.player.x = Phaser.Math.Clamp(this.player.x, 40, width - 40);
    this.player.y = Phaser.Math.Clamp(this.player.y, 40, height - 40);

    // AI Tamers Interaction
    this.aiCompetitors.forEach((ai) => {
      const targetX = this.bull.x + Math.cos(newBullAngle + ai.offsetAngle) * 40;
      const targetY = this.bull.y + Math.sin(newBullAngle + ai.offsetAngle) * 40;

      const angleToTarget = Phaser.Math.Angle.Between(ai.sprite.x, ai.sprite.y, targetX, targetY);
      ai.sprite.x += Math.cos(angleToTarget) * ai.speed * dt;
      ai.sprite.y += Math.sin(angleToTarget) * ai.speed * dt;
      ai.sprite.rotation = angleToTarget + Math.PI / 2;

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

    // Player 4-Factor Scoring
    const playerDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bull.x, this.bull.y);
    const distScore = Math.max(0, Math.min(100, Math.round((220 - playerDist) / 1.8)));

    if (playerDist < 140) {
      this.playerCloseTime += dt * 35;
    }
    const timingScore = Math.min(100, Math.round(this.playerCloseTime));

    const angleToBull = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.bull.x, this.bull.y);
    const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(angleToBull - newBullAngle));
    const positionScore = Math.round(Math.sin(angleDiff) * 100);

    const playerHeading = this.player.rotation - Math.PI / 2;
    const headingDiff = Math.abs(Phaser.Math.Angle.Wrap(playerHeading - newBullAngle));
    const angleScore = Math.max(0, Math.min(100, Math.round((1 - headingDiff / Math.PI) * 100)));

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

    this.factorsHudText.setText(
      `Distance: ${distScore}% | Timing: ${timingScore}% | Position: ${positionScore}% | Angle: ${angleScore}%`
    );

    const hudColor = totalScore > 65 ? '#00F5D4' : (totalScore > 40 ? '#FFD700' : '#FFA000');
    this.factorsHudText.setColor(hudColor);

    // Announcer dynamic text
    if (playerDist < 100) {
      this.commentatorText.setText(`🎙️ "வீரர் #07 திமிலை பற்ற மிக அருகில் வந்துவிட்டார்!"`);
    }

    // Proximity Rings
    this.proximityRing.clear();
    const ringColor = playerDist < 90 ? 0x00ff88 : (playerDist < 160 ? 0xffbb00 : 0xff4444);
    this.proximityRing.lineStyle(3, ringColor, 0.75);
    this.proximityRing.strokeCircle(this.bull.x, this.bull.y, 80);
    this.proximityRing.lineStyle(1.5, ringColor, 0.5);
    this.proximityRing.lineBetween(this.player.x, this.player.y, this.bull.x, this.bull.y);

    // Timer
    this.phaseTimer -= delta;
    const secondsLeft = Math.max(0, Math.ceil(this.phaseTimer / 1000));
    this.countdownText.setText(`FLANK THE HUMP FROM THE SIDE! (${secondsLeft}s)`);

    if (this.phaseTimer <= 0) {
      this.resolveProximityPhase();
    }
  }

  private resolveProximityPhase() {
    this.isPhaseActive = false;
    const { width, height } = this.scale;

    let bestAIScore = 0;
    let closestAIName = 'Velan';
    let closestAIBib = 18;

    this.aiCompetitors.forEach((ai) => {
      if (ai.totalScore > bestAIScore) {
        bestAIScore = ai.totalScore;
        closestAIName = ai.name;
        closestAIBib = ai.bibNumber;
      }
    });

    const playerTotal = this.playerScores.total;
    const playerWon = (playerTotal >= bestAIScore - 15) || (this.playerScores.distance > 60) || (this.retryCount >= 2);

    if (playerWon) {
      soundManager.playCrowdCheer(4);
      soundManager.playGripSuccess(2);

      const banner = this.add.container(width / 2, height / 2);
      const bg = this.add.rectangle(0, 0, 470, 124, 0x120b09, 0.95);
      bg.setStrokeStyle(3, 0x00f5d4);
      const txt1 = this.add.text(0, -26, 'வீரர் #07: பிடி கிடைத்தது! GRIP SECURED!', {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '22px',
        color: '#00F5D4',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const txt2 = this.add.text(0, 6, `Participant #07 won opportunity at ${this.village.name} (${Math.max(playerTotal, 78)}% score)`, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '13px',
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
            village: this.village,
          });
        });
      });

    } else {
      soundManager.playGripMiss();

      const banner = this.add.container(width / 2, height / 2);
      const bg = this.add.rectangle(0, 0, 480, 130, 0x120b09, 0.95);
      bg.setStrokeStyle(3, 0xf77f00);
      const txt1 = this.add.text(0, -30, 'வேகம் போதவில்லை! TOO FAR / OFF-ANGLE!', {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '20px',
        color: '#F77F00',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const txt2 = this.add.text(0, 2, `Participant #${closestAIBib} (${closestAIName}) had a closer flank (${bestAIScore}% vs ${playerTotal}%)!`, {
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
          this.scene.restart({ retryCount: this.retryCount + 1, personality: this.personality, village: this.village });
        });
      });
    }
  }
}
