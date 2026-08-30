import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { BullStats } from '../bullCareSystem';

export class TrainingPondScene extends Phaser.Scene {
  private bull!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private waterParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private timerText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;

  private sessionTime = 12000; // 12 seconds session
  private timeRemaining = 12000;
  private staminaGained = 0;
  private lapsCompleted = 0;
  private bullStats!: BullStats;
  private isCompleted = false;

  constructor() {
    super({ key: 'TrainingPondScene' });
  }

  init(data: { bullStats: BullStats }) {
    this.bullStats = data.bullStats;
    this.timeRemaining = this.sessionTime;
    this.staminaGained = 0;
    this.lapsCompleted = 0;
    this.isCompleted = false;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);
    soundManager.startFestiveDrums(110);

    // Pond Water Background
    this.add.tileSprite(width / 2, height / 2, width, height, 'pond_water');

    // Shorelines (Sand banks top & bottom)
    const sandTop = this.add.rectangle(width / 2, 25, width, 50, 0xdeb887);
    const sandBottom = this.add.rectangle(width / 2, height - 25, width, 50, 0xdeb887);
    sandTop.setStrokeStyle(3, 0x78350f);
    sandBottom.setStrokeStyle(3, 0x78350f);

    // Water Splash Particle Emitter
    this.waterParticles = this.add.particles(0, 0, 'particle_water', {
      lifespan: 600,
      scale: { start: 1.0, end: 0.2 },
      alpha: { start: 0.8, end: 0 },
      speed: { min: 30, max: 100 },
      emitting: false,
    });

    // Spawn Bull in shallow water
    this.bull = this.add.image(width * 0.2, height / 2, 'bull_top');
    this.bull.setScale(1.1);

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

    // Top HUD
    const hudBg = this.add.rectangle(width / 2, 40, 520, 56, 0x120b09, 0.9);
    hudBg.setStrokeStyle(2, 0x38bdf8);

    this.timerText = this.add.text(width / 2, 28, 'குளத்துப் பயிற்சி • POND WATER RESISTANCE TRAINING', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '15px',
      color: '#38BDF8',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, 48, 'Swim across the pond! Move with WASD / Arrow Keys (12s)', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#FFFFFF',
    }).setOrigin(0.5);
  }

  update(time: number, delta: number) {
    if (this.isCompleted) return;

    const { width, height } = this.scale;
    const dt = delta / 1000;

    this.timeRemaining -= delta;
    const secondsLeft = Math.max(0, Math.ceil(this.timeRemaining / 1000));
    this.progressText.setText(`Swim through deep water resistance! Time Left: ${secondsLeft}s`);

    // Player controls the bull in water
    let moveX = 0;
    let moveY = 0;

    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasdKeys.A?.isDown) moveX -= 1;
      if (this.cursors.right.isDown || this.wasdKeys.D?.isDown) moveX += 1;
      if (this.cursors.up.isDown || this.wasdKeys.W?.isDown) moveY -= 1;
      if (this.cursors.down.isDown || this.wasdKeys.S?.isDown) moveY += 1;
    }

    // In deep water (center of screen), movement is slower due to drag
    const distFromCenter = Math.abs(this.bull.y - height / 2);
    const waterDrag = distFromCenter < 120 ? 0.65 : 0.9;
    const swimSpeed = 160 * waterDrag;

    if (moveX !== 0 || moveY !== 0) {
      const moveVec = new Phaser.Math.Vector2(moveX, moveY).normalize();
      this.bull.x += moveVec.x * swimSpeed * dt;
      this.bull.y += moveVec.y * swimSpeed * dt;

      const targetRotation = Math.atan2(moveVec.y, moveVec.x) + Math.PI / 2;
      this.bull.rotation = Phaser.Math.Angle.RotateTo(this.bull.rotation, targetRotation, 8 * dt);

      this.waterParticles.emitParticleAt(this.bull.x, this.bull.y + 15, 2);
      this.staminaGained += dt * 0.8;
    }

    this.bull.x = Phaser.Math.Clamp(this.bull.x, 50, width - 50);
    this.bull.y = Phaser.Math.Clamp(this.bull.y, 60, height - 60);

    if (this.timeRemaining <= 0) {
      this.finishSession();
    }
  }

  private finishSession() {
    this.isCompleted = true;
    soundManager.stopFestiveDrums();
    soundManager.playGripSuccess(3);

    const bonusStamina = Math.min(8, Math.max(3, Math.round(this.staminaGained)));
    const bonusStrength = 4;

    const banner = this.add.container(this.scale.width / 2, this.scale.height / 2);
    const bg = this.add.rectangle(0, 0, 460, 140, 0x120b09, 0.95);
    bg.setStrokeStyle(3, 0x38bdf8);

    const t1 = this.add.text(0, -35, 'பயிற்சி நிறைவடைந்தது! POND TRAINING COMPLETE!', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '18px',
      color: '#38BDF8',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const t2 = this.add.text(0, 0, `+${bonusStamina} Stamina • +${bonusStrength} Strength • +15 Hydration`, {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '15px',
      color: '#00F5D4',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const t3 = this.add.text(0, 32, 'Returning to Bull Farm Dashboard...', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '13px',
      color: '#FFFFFF',
    }).setOrigin(0.5);

    banner.add([bg, t1, t2, t3]);
    banner.setScale(0);

    this.tweens.add({
      targets: banner,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      ease: 'Back.easeOut',
    });

    this.time.delayedCall(2200, () => {
      this.game.events.emit('training-finished', {
        type: 'water',
        staminaGain: bonusStamina,
        strengthGain: bonusStrength,
        energyCost: 15,
        hydrationGain: 20,
      });
    });
  }
}
