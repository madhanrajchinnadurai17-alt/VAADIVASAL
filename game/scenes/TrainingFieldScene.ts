import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { BullStats } from '../bullCareSystem';

interface DecoyTrainer {
  sprite: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
}

export class TrainingFieldScene extends Phaser.Scene {
  private bull!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};
  private decoys: DecoyTrainer[] = [];
  private obstacles: Phaser.GameObjects.Image[] = [];
  private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private timerText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;

  private sessionTime = 12000;
  private timeRemaining = 12000;
  private evadesCount = 0;
  private bullStats!: BullStats;
  private isCompleted = false;

  constructor() {
    super({ key: 'TrainingFieldScene' });
  }

  init(data: { bullStats: BullStats }) {
    this.bullStats = data.bullStats;
    this.timeRemaining = this.sessionTime;
    this.evadesCount = 0;
    this.isCompleted = false;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);
    soundManager.startFestiveDrums(140);

    // Sand Ground
    this.add.tileSprite(width / 2, height / 2, width, height, 'arena_ground');

    // Dust particles
    this.dustParticles = this.add.particles(0, 0, 'particle_dust', {
      lifespan: 500,
      scale: { start: 1, end: 0.1 },
      alpha: { start: 0.7, end: 0 },
      speed: { min: 20, max: 70 },
      emitting: false,
    });

    // Place 3 Straw Obstacles
    this.obstacles = [];
    const obsPos = [
      { x: width * 0.35, y: height * 0.35 },
      { x: width * 0.65, y: height * 0.65 },
      { x: width * 0.5, y: height * 0.45 },
    ];
    obsPos.forEach((pos) => {
      const obs = this.add.image(pos.x, pos.y, 'field_obstacle').setScale(1.2);
      this.obstacles.push(obs);
    });

    // Spawn Bull
    this.bull = this.add.image(width * 0.15, height / 2, 'bull_top');
    this.bull.setScale(1.1);

    // Spawn 2 Decoy AI Trainers
    this.decoys = [];
    const decoyColors = ['ai_tamer_top_1', 'ai_tamer_top_2'];
    const decoyStarts = [
      { x: width * 0.5, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.7 },
    ];

    decoyStarts.forEach((pos, idx) => {
      const sprite = this.add.image(pos.x, pos.y, decoyColors[idx]);
      sprite.setScale(1.0);
      this.decoys.push({
        sprite,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
      });
    });

    // Controls
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
    const hudBg = this.add.rectangle(width / 2, 40, 530, 56, 0x120b09, 0.9);
    hudBg.setStrokeStyle(2, 0xf59e0b);

    this.timerText = this.add.text(width / 2, 28, 'ஆள் மிரட்சி & சுறுசுறுப்புப் பயிற்சி • HUMAN REACTION & AGILITY', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '14px',
      color: '#F59E0B',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.progressText = this.add.text(width / 2, 48, 'Sprint and evade decoy trainers! (WASD / Arrows)', {
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
    this.progressText.setText(`Evade decoy trainers & obstacles! Time: ${secondsLeft}s | Evades: ${this.evadesCount}`);

    // Bull movement
    let moveX = 0;
    let moveY = 0;

    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasdKeys.A?.isDown) moveX -= 1;
      if (this.cursors.right.isDown || this.wasdKeys.D?.isDown) moveX += 1;
      if (this.cursors.up.isDown || this.wasdKeys.W?.isDown) moveY -= 1;
      if (this.cursors.down.isDown || this.wasdKeys.S?.isDown) moveY += 1;
    }

    const sprintSpeed = 210;
    if (moveX !== 0 || moveY !== 0) {
      const moveVec = new Phaser.Math.Vector2(moveX, moveY).normalize();
      this.bull.x += moveVec.x * sprintSpeed * dt;
      this.bull.y += moveVec.y * sprintSpeed * dt;

      const targetRotation = Math.atan2(moveVec.y, moveVec.x) + Math.PI / 2;
      this.bull.rotation = Phaser.Math.Angle.RotateTo(this.bull.rotation, targetRotation, 10 * dt);
      this.dustParticles.emitParticleAt(this.bull.x, this.bull.y + 10, 1);
    }

    this.bull.x = Phaser.Math.Clamp(this.bull.x, 50, width - 50);
    this.bull.y = Phaser.Math.Clamp(this.bull.y, 60, height - 60);

    // Decoy movement & evasion check
    this.decoys.forEach((decoy) => {
      decoy.sprite.x += decoy.vx * dt;
      decoy.sprite.y += decoy.vy * dt;

      if (decoy.sprite.x < 80 || decoy.sprite.x > width - 80) decoy.vx *= -1;
      if (decoy.sprite.y < 80 || decoy.sprite.y > height - 80) decoy.vy *= -1;

      const dist = Phaser.Math.Distance.Between(this.bull.x, this.bull.y, decoy.sprite.x, decoy.sprite.y);
      if (dist < 100 && dist > 50) {
        this.evadesCount++;
        soundManager.playThavilSnap(0.4);
      }
    });

    if (this.timeRemaining <= 0) {
      this.finishSession();
    }
  }

  private finishSession() {
    this.isCompleted = true;
    soundManager.stopFestiveDrums();
    soundManager.playGripSuccess(3);

    const bonusAgility = 6;
    const bonusReaction = 5;
    const bonusSpeed = 4;

    const banner = this.add.container(this.scale.width / 2, this.scale.height / 2);
    const bg = this.add.rectangle(0, 0, 460, 140, 0x120b09, 0.95);
    bg.setStrokeStyle(3, 0xf59e0b);

    const t1 = this.add.text(0, -35, 'பயிற்சி நிறைவடைந்தது! AGILITY TRAINING COMPLETE!', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '18px',
      color: '#F59E0B',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const t2 = this.add.text(0, 0, `+${bonusAgility} Agility • +${bonusReaction} Reaction • +${bonusSpeed} Speed`, {
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
        type: 'field',
        agilityGain: bonusAgility,
        reactionGain: bonusReaction,
        speedGain: bonusSpeed,
        energyCost: 20,
      });
    });
  }
}
