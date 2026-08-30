import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { VillageEvent } from '../villageSystem';

export class VillageTravelScene extends Phaser.Scene {
  private village!: VillageEvent;
  private travelCart!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'VillageTravelScene' });
  }

  init(data: { village: VillageEvent }) {
    this.village = data.village;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(500, 18, 11, 9);
    soundManager.startFestiveDrums(120);
    soundManager.playKombuHorn();

    // Panoramic Village Landscape Background
    this.add.image(width / 2, height / 2, 'village_landscape');

    // Temple Gopuram in distance
    const gopuram = this.add.image(width * 0.85, height * 0.42, 'gopuram_silhouette').setScale(0.9).setAlpha(0.6);

    // Destination Card Banner
    const destCard = this.add.container(width / 2, 70);
    const cardBg = this.add.rectangle(0, 0, 560, 80, 0x120b09, 0.9);
    cardBg.setStrokeStyle(2, 0xffa000);

    const t1 = this.add.text(0, -18, `பயணம்: ${this.village.tamilName} • TRAVELING TO ${this.village.name.toUpperCase()}`, {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const t2 = this.add.text(0, 8, `${this.village.district} • ${this.village.description}`, {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#FFFFFF',
    }).setOrigin(0.5);

    const t3 = this.add.text(0, 26, `Festival Grand Prize: ${this.village.prize.icon} ${this.village.prize.name} (${this.village.prize.tamilName})`, {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#00F5D4',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    destCard.add([cardBg, t1, t2, t3]);

    // Animated Traveling Bull & Cart Container
    this.travelCart = this.add.container(-100, height - 100);
    const bullSprite = this.add.image(60, 0, 'bull_top').setScale(0.9).setAngle(90);
    const cartWood = this.add.rectangle(0, 0, 50, 40, 0x78350f);
    cartWood.setStrokeStyle(2, 0xd97706);
    this.travelCart.add([cartWood, bullSprite]);

    // Animate across screen
    this.tweens.add({
      targets: this.travelCart,
      x: width + 120,
      duration: 3500,
      ease: 'Linear',
      onComplete: () => {
        this.cameras.main.fade(500, 18, 11, 9);
        this.time.delayedCall(550, () => {
          this.scene.start('ReleaseScene', { village: this.village });
        });
      },
    });
  }
}
