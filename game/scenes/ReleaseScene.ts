import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';

export class ReleaseScene extends Phaser.Scene {
  private gate!: Phaser.GameObjects.Image;
  private bull!: Phaser.GameObjects.Image;
  private leftGateDoor!: Phaser.GameObjects.Rectangle;
  private rightGateDoor!: Phaser.GameObjects.Rectangle;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'ReleaseScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Start authentic festive drums & kombu horn
    soundManager.startFestiveDrums(140);
    soundManager.playKombuHorn();
    soundManager.playCrowdCheer(7);

    // Warm atmospheric festival sky background
    const bgGradient = this.add.graphics();
    bgGradient.fillGradientStyle(0x78281f, 0x78281f, 0xf77f00, 0xf77f00, 1);
    bgGradient.fillRect(0, 0, width, height);

    // Background Temple Gopuram silhouette
    const gopuram = this.add.image(width * 0.82, height * 0.45, 'gopuram_silhouette');
    gopuram.setScale(1.2).setAlpha(0.65);

    // Sand ground floor
    const ground = this.add.tileSprite(width / 2, height - 80, width, 160, 'arena_ground');
    ground.setTint(0xc49a6c);

    // Cheering Crowd silhouettes
    const crowdLeft = this.add.image(width * 0.25, height - 140, 'crowd_silhouette').setScale(1.1);
    const crowdRight = this.add.image(width * 0.75, height - 140, 'crowd_silhouette').setScale(1.1);

    // Festive Marigold flower particle rain
    if (this.add.particles) {
      const marigoldParticles = this.add.particles(0, 0, 'particle_marigold', {
        x: { min: 0, max: width },
        y: -20,
        lifespan: 3500,
        speedY: { min: 40, max: 90 },
        speedX: { min: -20, max: 20 },
        rotate: { min: 0, max: 360 },
        scale: { start: 1, end: 0.5 },
        frequency: 250,
      });
    }

    // Centered Vaadivasal Gate
    const gateX = width / 2;
    const gateY = height * 0.52;

    this.gate = this.add.image(gateX, gateY, 'vaadivasal_gate').setScale(1.2);

    // Gate Wooden Doors (animated opening)
    this.leftGateDoor = this.add.rectangle(gateX - 48, gateY + 6, 90, 240, 0x3d1d0c);
    this.rightGateDoor = this.add.rectangle(gateX + 48, gateY + 6, 90, 240, 0x3d1d0c);

    // Bull waiting behind gate (hidden at first)
    this.bull = this.add.image(gateX, gateY + 20, 'bull_top');
    this.bull.setScale(0.8).setAlpha(0).setAngle(180);

    // Dust particles when bull charges
    const dustParticles = this.add.particles(0, 0, 'particle_dust', {
      lifespan: 600,
      scale: { start: 1.2, end: 0.1 },
      alpha: { start: 0.8, end: 0 },
      speed: { min: 30, max: 120 },
      emitting: false,
    });
    this.dustEmitter = dustParticles;

    // Cinematic Text Overlay
    const titleText = this.add.text(width / 2, 65, 'வாடிவாசல் திறப்பு | THE RELEASE', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '26px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);

    const subText = this.add.text(width / 2, 100, 'The Kangayam bull enters the sacred arena...', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '16px',
      color: '#FFFFFF',
      fontStyle: '600',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    // Title Fade In
    this.tweens.add({
      targets: [titleText, subText],
      alpha: 1,
      duration: 800,
      ease: 'Power2',
    });

    // Sequence timeline
    // 1. Gate tension vibration (after 1s)
    this.time.delayedCall(1200, () => {
      soundManager.playThavilBass(1.0);
      this.cameras.main.shake(400, 0.006);

      // 2. Gate opens wide (at 2s)
      this.time.delayedCall(1000, () => {
        soundManager.playBullSnort();
        soundManager.playThavilSnap(1.0);

        // Open doors tween
        this.tweens.add({
          targets: this.leftGateDoor,
          scaleX: 0.1,
          x: gateX - 85,
          duration: 900,
          ease: 'Cubic.easeOut',
        });

        this.tweens.add({
          targets: this.rightGateDoor,
          scaleX: 0.1,
          x: gateX + 85,
          duration: 900,
          ease: 'Cubic.easeOut',
        });

        // Reveal bull
        this.bull.setAlpha(1);

        // 3. Bull charges out with camera shake & dust (at 3.2s)
        this.time.delayedCall(1000, () => {
          soundManager.playCrowdCheer(5);
          this.dustEmitter.start();

          this.tweens.add({
            targets: this.bull,
            y: height + 100,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1600,
            ease: 'Quad.easeIn',
            onUpdate: () => {
              this.dustEmitter.emitParticleAt(this.bull.x, this.bull.y - 30, 3);
            },
            onComplete: () => {
              this.dustEmitter.stop();
              // Smooth transition to Arena Scene
              this.cameras.main.fade(500, 18, 11, 9);
              this.time.delayedCall(550, () => {
                this.scene.start('ArenaScene', { retryCount: 0 });
              });
            },
          });

          this.cameras.main.shake(1600, 0.008);
        });
      });
    });
  }
}
