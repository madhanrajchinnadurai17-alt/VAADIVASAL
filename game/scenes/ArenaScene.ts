import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { BullPersonality, getRandomBullPersonality } from '../bullPersonality';
import { VillageEvent, TAMIL_VILLAGES } from '../villageSystem';

interface AICompetitor {
  sprite: Phaser.GameObjects.Image;
  bibNumber: number;
  speed: number;
  name: string;
  targetX: number;
  targetY: number;
  totalScore: number;
}

export class ArenaScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private bull!: Phaser.GameObjects.Image;
  private vaadivasalArch!: Phaser.GameObjects.Image;
  private aiCompetitors: AICompetitor[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private actionKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private personality!: BullPersonality;
  private village!: VillageEvent;

  // Bull AI state
  private bullSpeed = 140;
  private bullTargetX = 400;
  private bullTargetY = 260;
  private nextVeerTime = 0;

  // Phase Timing
  private roundTimer = 54;
  private phaseDuration = 4500;
  private phaseTimer = 4500;
  private isPhaseActive = false;
  private retryCount = 0;
  private isSprinting = false;

  // Visuals
  private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'ArenaScene' });
  }

  init(data: { retryCount?: number; personality?: BullPersonality; village?: VillageEvent }) {
    this.retryCount = data.retryCount || 0;
    this.personality = data.personality || getRandomBullPersonality();
    this.village = data.village || TAMIL_VILLAGES[0];
    this.bullSpeed = this.personality.speed * 0.9;
    this.roundTimer = 54;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);
    soundManager.startFestiveDrums(145);

    // 1. Perspective Sandy Arena Floor
    const ground = this.add.tileSprite(width / 2, height / 2, width, height, 'arena_ground');
    ground.setTint(this.village.arenaTheme.groundTint);

    // 2. Spectator Double Barricades on Left & Right
    const galleryLeft = this.add.image(width * 0.15, height * 0.35, 'spectator_gallery').setScale(0.5, 0.9).setAngle(-12);
    const galleryRight = this.add.image(width * 0.85, height * 0.35, 'spectator_gallery').setScale(0.5, 0.9).setAngle(12);

    // 3. Central Vaadivasal Gate Arch with Tamil Signboards ("வாடிவாசல்", "அன்பே", "அறம்")
    this.vaadivasalArch = this.add.image(width / 2, 140, 'vaadivasal_arch_front').setScale(0.85);

    // Text on Vaadivasal Arch
    this.add.text(width / 2, 88, 'வாடிவாசல்', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '14px',
      color: '#DC2626',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2 - 105, 126, 'அன்பே', {
      fontFamily: "'Mukta Malar', sans-serif",
      fontSize: '11px',
      color: '#15803D',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2 + 105, 126, 'அறம்', {
      fontFamily: "'Mukta Malar', sans-serif",
      fontSize: '11px',
      color: '#15803D',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Dust particles
    this.dustParticles = this.add.particles(0, 0, 'particle_dust', {
      lifespan: 500,
      scale: { start: 1.2, end: 0.2 },
      alpha: { start: 0.8, end: 0 },
      speed: { min: 30, max: 100 },
      emitting: false,
    });

    // 4. Perspective Front-Charging Bull emerging from Vaadivasal
    this.bull = this.add.image(width / 2, 190, 'bull_perspective');
    this.bull.setScale(0.9);

    // 5. Player in Third-Person Foreground (Bib #07, Yellow JALLIKATTU Jersey)
    this.player = this.add.image(width * 0.35, height - 110, 'player_back_perspective');
    this.player.setScale(1.0);

    // 6. AI Competitors in Yellow Jerseys across arena (Murugan, Siva, Karthik, Ajith, Dinesh)
    this.aiCompetitors = [];
    const aiList = [
      { name: 'Murugan', bib: 1, x: width * 0.18, y: height * 0.42 },
      { name: 'Siva', bib: 2, x: width * 0.25, y: height * 0.48 },
      { name: 'Karthik', bib: 3, x: width * 0.68, y: height * 0.42 },
      { name: 'Ajith', bib: 4, x: width * 0.76, y: height * 0.48 },
      { name: 'Dinesh', bib: 5, x: width * 0.84, y: height * 0.52 },
    ];

    aiList.forEach((data, idx) => {
      const sprite = this.add.image(data.x, data.y, `ai_perspective_${idx + 1}`);
      sprite.setScale(0.85);
      this.aiCompetitors.push({
        sprite,
        bibNumber: data.bib,
        speed: 120 + Math.random() * 25,
        name: data.name,
        targetX: data.x,
        targetY: data.y,
        totalScore: 0,
      });
    });

    // 7. BUILD SCREENSHOT-ACCURATE HUD OVERLAYS

    // TOP-LEFT: Pause + Bull Info Card + Target Objective
    const pauseBtn = this.add.rectangle(35, 35, 34, 34, 0x120b09, 0.9);
    pauseBtn.setStrokeStyle(2, 0xffffff);
    this.add.text(35, 35, '||', { fontFamily: 'monospace', fontSize: '16px', color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);

    const bullCardBg = this.add.rectangle(170, 35, 170, 38, 0x120b09, 0.9);
    bullCardBg.setStrokeStyle(1.5, 0x3f3f46);
    this.add.text(105, 24, '🐂 BULL', { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#9ca3af', fontStyle: 'bold' });
    this.add.text(105, 36, 'KARUPPAN', { fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: '#FFFFFF', fontStyle: 'bold' });

    // Green Bull Stamina / Vital bar
    const vitalBg = this.add.rectangle(170, 48, 140, 5, 0x27272a);
    const vitalFill = this.add.rectangle(170, 48, 136, 4, 0x22c55e);

    // Target Objective Card
    const targetCardBg = this.add.rectangle(65, 110, 95, 48, 0x120b09, 0.9);
    targetCardBg.setStrokeStyle(1.5, 0xeab308);
    this.add.text(65, 96, 'TARGET', { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#eab308', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(65, 115, 'HOLD THE BULL\nFOR 10 SECONDS', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '8.5px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    // TOP-CENTER: Hexagonal Match Timer (ROUND 1 | 00:54)
    const timerBg = this.add.rectangle(width / 2, 38, 130, 46, 0x120b09, 0.95);
    timerBg.setStrokeStyle(2, 0xeab308);
    this.add.text(width / 2, 26, 'ROUND 1', { fontFamily: "'Outfit', sans-serif", fontSize: '10px', color: '#eab308', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, 44, '00:54', { fontFamily: "'Outfit', sans-serif", fontSize: '17px', color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);

    // TOP-RIGHT: Score & Live Leaderboard (Murugan, Siva, Karthik, Ajith, Dinesh, 06 YOU)
    const scoreBg = this.add.rectangle(width - 70, 25, 110, 26, 0x120b09, 0.9);
    scoreBg.setStrokeStyle(1.5, 0x3f3f46);
    this.add.text(width - 70, 25, 'SCORE : 250', { fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: '#eab308', fontStyle: 'bold' }).setOrigin(0.5);

    const playersBoxBg = this.add.rectangle(width - 65, 105, 115, 125, 0x120b09, 0.92);
    playersBoxBg.setStrokeStyle(1.5, 0x3f3f46);
    this.add.text(width - 65, 52, 'PLAYERS : 6', { fontFamily: "'Outfit', sans-serif", fontSize: '10px', color: '#9ca3af', fontStyle: 'bold' }).setOrigin(0.5);

    const playerRows = [
      { num: '01', name: 'MURUGAN', isYou: false },
      { num: '02', name: 'SIVA', isYou: false },
      { num: '03', name: 'KARTHIK', isYou: false },
      { num: '04', name: 'AJITH', isYou: false },
      { num: '05', name: 'DINESH', isYou: false },
      { num: '06', name: 'YOU #07', isYou: true },
    ];

    playerRows.forEach((p, idx) => {
      const y = 68 + idx * 16;
      if (p.isYou) {
        const youBg = this.add.rectangle(width - 65, y, 110, 14, 0xeab308);
        this.add.text(width - 115, y, `${p.num}  ${p.name}`, { fontFamily: "'Outfit', sans-serif", fontSize: '9.5px', color: '#000000', fontStyle: 'bold' }).setOrigin(0, 0.5);
      } else {
        this.add.text(width - 115, y, `${p.num}  ${p.name}`, { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#e5e7eb', fontStyle: '600' }).setOrigin(0, 0.5);
        this.add.text(width - 20, y, '✓', { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#22c55e', fontStyle: 'bold' }).setOrigin(0.5);
      }
    });

    // BOTTOM-LEFT: Circular Touch Joystick Graphic
    const joyBase = this.add.circle(95, height - 95, 48, 0x120b09, 0.7);
    joyBase.setStrokeStyle(2, 0x71717a);
    const joyThumb = this.add.circle(95, height - 95, 20, 0xffffff, 0.9);

    // Direction indicators
    this.add.triangle(95, height - 130, 0, 8, 8, 8, 4, 0, 0xffffff);
    this.add.triangle(95, height - 60, 0, 0, 8, 0, 4, 8, 0xffffff);
    this.add.triangle(60, height - 95, 8, 0, 8, 8, 0, 4, 0xffffff);
    this.add.triangle(130, height - 95, 0, 0, 0, 8, 8, 4, 0xffffff);

    // BOTTOM-RIGHT: Action Buttons (RUN, DIVE, GRAB)
    // 1. RUN button
    const runBtn = this.add.circle(width - 65, height - 165, 28, 0x18181b, 0.85);
    runBtn.setStrokeStyle(2, 0xa1a1aa);
    this.add.text(width - 65, height - 173, '🏃', { fontSize: '16px' }).setOrigin(0.5);
    this.add.text(width - 65, height - 153, 'RUN', { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);

    // 2. DIVE button
    const diveBtn = this.add.circle(width - 135, height - 65, 32, 0x18181b, 0.85);
    diveBtn.setStrokeStyle(2, 0xa1a1aa);
    this.add.text(width - 135, height - 74, '🤸', { fontSize: '18px' }).setOrigin(0.5);
    this.add.text(width - 135, height - 54, 'DIVE', { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);

    // 3. GRAB button
    const grabBtn = this.add.circle(width - 65, height - 80, 32, 0x18181b, 0.85);
    grabBtn.setStrokeStyle(2, 0xa1a1aa);
    this.add.text(width - 65, height - 89, '✋', { fontSize: '18px' }).setOrigin(0.5);
    this.add.text(width - 65, height - 69, 'GRAB', { fontFamily: "'Outfit', sans-serif", fontSize: '9px', color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);

    // Controls setup
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.actionKeys = {
        SHIFT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      };
    }

    // Touch button interactions
    runBtn.setInteractive().on('pointerdown', () => { this.isSprinting = true; });
    runBtn.on('pointerup', () => { this.isSprinting = false; });
    diveBtn.setInteractive().on('pointerdown', () => { this.triggerDive(); });
    grabBtn.setInteractive().on('pointerdown', () => { this.triggerGrab(); });

    this.phaseTimer = this.phaseDuration;
    this.isPhaseActive = true;
    this.nextVeerTime = this.time.now + 800;
  }

  private triggerDive() {
    soundManager.playThavilSnap(0.7);
    this.tweens.add({
      targets: this.player,
      y: '-=35',
      duration: 160,
      yoyo: true,
      ease: 'Quad.easeInOut',
    });
    this.dustParticles.emitParticleAt(this.player.x, this.player.y + 20, 6);
  }

  private triggerGrab() {
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bull.x, this.bull.y);
    if (dist < 130) {
      this.resolveProximityPhase(true);
    } else {
      soundManager.playGripMiss();
    }
  }

  update(time: number, delta: number) {
    if (!this.isPhaseActive) return;

    const { width, height } = this.scale;
    const dt = delta / 1000;

    // --- 1. PERSPECTIVE BULL AI CHARGE & VEER ---
    if (time > this.nextVeerTime) {
      // Pick dynamic target in the sandy foreground arena
      this.bullTargetX = width * 0.3 + Math.random() * (width * 0.4);
      this.bullTargetY = height * 0.45 + Math.random() * (height * 0.25);
      this.nextVeerTime = time + (this.personality.veerIntervalMin + Math.random() * 600);
      soundManager.playThavilBass(0.35);
    }

    // Move bull toward target position
    const dx = this.bullTargetX - this.bull.x;
    const dy = this.bullTargetY - this.bull.y;
    this.bull.x += dx * 1.8 * dt;
    this.bull.y += dy * 1.8 * dt;

    // Scale bull perspective slightly as it approaches camera
    const scale = Phaser.Math.Clamp(0.75 + (this.bull.y / height) * 0.5, 0.75, 1.25);
    this.bull.setScale(scale);

    // Kicking up sand dust from hooves
    if (Math.random() < 0.4) {
      this.dustParticles.emitParticleAt(this.bull.x, this.bull.y + 60, 2);
    }

    // --- 2. PLAYER THIRD-PERSON MOVEMENT ---
    const sprintMultiplier = (this.actionKeys?.SHIFT?.isDown || this.isSprinting) ? 1.4 : 1.0;
    const playerSpeed = 220 * sprintMultiplier;
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
      this.dustParticles.emitParticleAt(this.player.x, this.player.y + 40, 1);
    }

    this.player.x = Phaser.Math.Clamp(this.player.x, width * 0.15, width * 0.85);
    this.player.y = Phaser.Math.Clamp(this.player.y, height * 0.45, height - 60);

    // --- 3. AI TAMERS POSITIONING ---
    this.aiCompetitors.forEach((ai) => {
      const targetX = this.bull.x + (ai.bibNumber % 2 === 0 ? 50 : -50);
      const targetY = this.bull.y + 20;
      ai.sprite.x += (targetX - ai.sprite.x) * 1.5 * dt;
      ai.sprite.y += (targetY - ai.sprite.y) * 1.5 * dt;
    });

    // --- 4. TIMER & RESOLUTION ---
    this.phaseTimer -= delta;
    if (this.phaseTimer <= 0) {
      this.resolveProximityPhase(false);
    }
  }

  private resolveProximityPhase(manualGrab = false) {
    this.isPhaseActive = false;
    const { width, height } = this.scale;

    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bull.x, this.bull.y);
    const playerWon = manualGrab || dist < 140 || this.retryCount >= 2;

    if (playerWon) {
      soundManager.playCrowdCheer(4);
      soundManager.playGripSuccess(2);

      const banner = this.add.container(width / 2, height / 2);
      const bg = this.add.rectangle(0, 0, 470, 120, 0x120b09, 0.95);
      bg.setStrokeStyle(3, 0x00f5d4);
      const txt1 = this.add.text(0, -26, 'வீரர் #07: பிடி கிடைத்தது! GRIP SECURED!', {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '22px',
        color: '#00F5D4',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const txt2 = this.add.text(0, 6, `You matched speed & flanked the ${this.personality.badge} bull!`, {
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
      const txt1 = this.add.text(0, -30, 'வேகம் போதவில்லை! TOO FAR!', {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '20px',
        color: '#F77F00',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      const txt2 = this.add.text(0, 2, `Participant #01 (MURUGAN) was closer! Repositioning...`, {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '12px',
        color: '#FFFFFF',
      }).setOrigin(0.5);
      const txt3 = this.add.text(0, 28, `Attempt ${this.retryCount + 1}/3 • Sprint & press [DIVE] / [GRAB]!`, {
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
