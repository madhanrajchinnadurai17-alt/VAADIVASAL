import Phaser from 'phaser';
import { TextureGenerator } from '../textureGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // Generate all procedural textures
    TextureGenerator.generateAll(this);

    // Transition to the release cutscene or wait for event
    this.scene.start('ReleaseScene');
  }
}
