import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ReleaseScene } from './scenes/ReleaseScene';
import { ArenaScene } from './scenes/ArenaScene';
import { TamingScene } from './scenes/TamingScene';

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 800,
    height: 520,
    backgroundColor: '#120B09',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, ReleaseScene, ArenaScene, TamingScene],
  };
}
