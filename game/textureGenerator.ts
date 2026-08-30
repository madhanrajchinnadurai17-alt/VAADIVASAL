import Phaser from 'phaser';

export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene) {
    if (scene.textures.exists('bull_top')) return; // Already generated

    this.generateBullTop(scene);
    this.generateBullSide(scene);
    this.generatePlayerTop(scene);
    this.generateAITamersTop(scene);
    this.generateVaadivasalGate(scene);
    this.generateGopuramSilhouette(scene);
    this.generateCrowdSilhouette(scene);
    this.generateDustParticle(scene);
    this.generateMarigoldParticle(scene);
    this.generateArenaGround(scene);
  }

  // Top-down Bull texture (muscular black/charcoal Kangayam bull with prominent hump and sharp horns)
  private static generateBullTop(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const size = 120;
    
    // Shadow
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(60, 68, 55, 90);

    // Torso / Body (Dark charcoal muscular build)
    g.fillStyle(0x222222, 1);
    g.fillEllipse(60, 60, 42, 75);

    // Muscular flank highlights
    g.fillStyle(0x383838, 1);
    g.fillEllipse(60, 52, 34, 55);

    // Prominent Hump (திமில் / Thimil) - Cultural highlight
    g.fillStyle(0x181818, 1);
    g.fillEllipse(60, 42, 28, 30);
    g.fillStyle(0x4a4a4a, 0.9);
    g.fillEllipse(60, 39, 20, 20);

    // Head
    g.fillStyle(0x242424, 1);
    g.fillEllipse(60, 20, 24, 28);

    // Snout
    g.fillStyle(0x151515, 1);
    g.fillEllipse(60, 10, 16, 12);
    // Nostrils
    g.fillStyle(0x551111, 1);
    g.fillCircle(56, 9, 2);
    g.fillCircle(64, 9, 2);

    // Eyes (fierce reddish/amber)
    g.fillStyle(0xffaa00, 1);
    g.fillCircle(51, 18, 2.5);
    g.fillCircle(69, 18, 2.5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(51, 18, 1.2);
    g.fillCircle(69, 18, 1.2);

    // Sharp Curved Horns (Kangayam trademark)
    g.lineStyle(5, 0xefd8a1, 1);
    // Left horn
    g.beginPath();
    g.moveTo(52, 20);
    g.lineTo(32, 12);
    g.lineTo(30, -2);
    g.strokePath();

    // Right horn
    g.beginPath();
    g.moveTo(68, 20);
    g.lineTo(88, 12);
    g.lineTo(90, -2);
    g.strokePath();

    // Horn Tips (Festival Kunkumam / Kumkum Red)
    g.fillStyle(0xd90429, 1);
    g.fillCircle(30, -2, 4);
    g.fillCircle(90, -2, 4);

    // Neck garland / Bell rope
    g.lineStyle(3, 0xff9f1c, 1);
    g.strokeCircle(60, 30, 16);
    // Brass bell
    g.fillStyle(0xffd700, 1);
    g.fillCircle(60, 32, 4);

    // Legs / Hooves
    g.fillStyle(0x1a1a1a, 1);
    // Front hooves
    g.fillRoundedRect(36, 32, 8, 16, 3);
    g.fillRoundedRect(76, 32, 8, 16, 3);
    // Rear hooves
    g.fillRoundedRect(34, 76, 9, 20, 3);
    g.fillRoundedRect(77, 76, 9, 20, 3);

    // Tail with tuft
    g.lineStyle(2, 0x111111, 1);
    g.beginPath();
    g.moveTo(60, 95);
    g.lineTo(58, 112);
    g.strokePath();
    g.fillStyle(0x000000, 1);
    g.fillEllipse(58, 114, 5, 8);

    g.generateTexture('bull_top', size, size + 10);
    g.destroy();
  }

  // Side view of Bull for Minigame
  private static generateBullSide(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const width = 340;
    const height = 240;

    // Muscular side profile
    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(170, 220, 160, 35);

    // Rear Body
    g.fillStyle(0x222222, 1);
    g.fillEllipse(100, 130, 75, 55);

    // Chest & Core
    g.fillStyle(0x282828, 1);
    g.fillEllipse(160, 130, 85, 60);

    // Prominent HUMP (திமில்) - The core target for taming
    g.fillStyle(0x181818, 1);
    g.fillEllipse(190, 80, 48, 42);
    g.fillStyle(0x3a3a3a, 0.9);
    g.fillEllipse(188, 75, 34, 30);
    // Target glow outline on hump
    g.lineStyle(3, 0xffd700, 0.7);
    g.strokeEllipse(190, 80, 48, 42);

    // Neck & Head
    g.fillStyle(0x262626, 1);
    g.fillEllipse(250, 105, 45, 38);
    // Muzzle
    g.fillStyle(0x161616, 1);
    g.fillRoundedRect(275, 105, 30, 24, 6);
    // Flared nostril
    g.fillStyle(0xff3333, 1);
    g.fillCircle(296, 118, 3.5);

    // Fiery Eye
    g.fillStyle(0xffb703, 1);
    g.fillCircle(265, 96, 4.5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(266, 96, 2.5);

    // Massive Upward Curved Horns
    g.lineStyle(8, 0xf0e2b6, 1);
    g.beginPath();
    g.moveTo(250, 85);
    g.lineTo(270, 40);
    g.lineTo(260, 12);
    g.strokePath();

    // Horn Red Kumkum Tip
    g.fillStyle(0xd90429, 1);
    g.fillCircle(260, 12, 7);

    // Garland around neck
    g.lineStyle(6, 0xf77f00, 1);
    g.beginPath();
    g.arc(225, 125, 24, 0, Math.PI, false);
    g.strokePath();
    // Gold bell
    g.fillStyle(0xffd700, 1);
    g.fillCircle(225, 149, 8);

    // Front Legs
    g.fillStyle(0x202020, 1);
    g.fillRoundedRect(200, 150, 16, 65, 4);
    g.fillRoundedRect(225, 145, 16, 68, 4);
    // Back Legs
    g.fillRoundedRect(65, 140, 18, 75, 4);
    g.fillRoundedRect(95, 145, 18, 72, 4);

    // Tail
    g.lineStyle(4, 0x181818, 1);
    g.beginPath();
    g.moveTo(60, 120);
    g.lineTo(40, 175);
    g.strokePath();
    g.fillStyle(0x000000, 1);
    g.fillEllipse(38, 182, 9, 16);

    g.generateTexture('bull_side', width, height);
    g.destroy();
  }

  // Player top-down sprite (Valorous Tamil Tamer)
  private static generatePlayerTop(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const size = 64;

    // Shadow
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(32, 38, 22, 28);

    // Bare athletic brown torso (Sun-kissed Tamil youth)
    g.fillStyle(0x8d5524, 1);
    g.fillEllipse(32, 30, 20, 24);

    // Traditional red/saffron kacham (shorts)
    g.fillStyle(0xd90429, 1);
    g.fillRoundedRect(22, 34, 20, 14, 3);
    g.fillStyle(0xf77f00, 1);
    g.fillRect(22, 33, 20, 3); // Gold waist belt

    // Head
    g.fillStyle(0x703d15, 1);
    g.fillCircle(32, 18, 9);
    // Yellow festival headband (தலைப்பாகை)
    g.fillStyle(0xffd700, 1);
    g.fillRect(23, 14, 18, 4);

    // Outstretched grasping arms (ready to grip hump)
    g.fillStyle(0x8d5524, 1);
    // Left arm
    g.fillRoundedRect(12, 16, 7, 18, 3);
    // Right arm
    g.fillRoundedRect(45, 16, 7, 18, 3);

    // Hands
    g.fillStyle(0xa16838, 1);
    g.fillCircle(15, 14, 4);
    g.fillCircle(49, 14, 4);

    // Player indicator star/chevron
    g.fillStyle(0x00f5d4, 1);
    g.fillTriangle(32, 0, 26, 7, 38, 7);

    g.generateTexture('player_top', size, size);
    g.destroy();
  }

  // AI Tamers (different colors)
  private static generateAITamersTop(scene: Phaser.Scene) {
    const colors = [0x2a9d8f, 0x3a86ff, 0x8338ec, 0xf4a261];
    
    colors.forEach((color, idx) => {
      const g = scene.make.graphics({ x: 0, y: 0 });
      const size = 64;

      // Shadow
      g.fillStyle(0x000000, 0.3);
      g.fillEllipse(32, 38, 20, 26);

      // Torso
      g.fillStyle(0x7d4b1f, 1);
      g.fillEllipse(32, 30, 19, 23);

      // AI Shorts
      g.fillStyle(color, 1);
      g.fillRoundedRect(23, 34, 18, 13, 3);

      // Head
      g.fillStyle(0x653b17, 1);
      g.fillCircle(32, 18, 8.5);

      // White headband
      g.fillStyle(0xffffff, 0.9);
      g.fillRect(24, 14, 16, 3);

      // Arms
      g.fillStyle(0x7d4b1f, 1);
      g.fillRoundedRect(14, 18, 6, 16, 3);
      g.fillRoundedRect(44, 18, 6, 16, 3);

      g.generateTexture(`ai_tamer_top_${idx + 1}`, size, size);
      g.destroy();
    });
  }

  // Ancient Vaadivasal Entrance Gate
  private static generateVaadivasalGate(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const width = 280;
    const height = 260;

    // Stone / Ancient Brick Pillars
    g.fillStyle(0x8B4513, 1);
    g.fillRect(10, 30, 50, 230);
    g.fillRect(220, 30, 50, 230);

    // Carved Pillar Details
    g.fillStyle(0xA0522D, 1);
    for (let y = 40; y < 250; y += 30) {
      g.fillRect(15, y, 40, 10);
      g.fillRect(225, y, 40, 10);
    }

    // Top Beam Arch
    g.fillStyle(0x65320D, 1);
    g.fillRect(5, 15, 270, 30);
    g.fillStyle(0xDAA520, 1); // Gold Trim
    g.fillRect(5, 10, 270, 5);

    // Mango Leaf & Marigold Garland (Thoranam)
    for (let x = 20; x < 260; x += 18) {
      // Leaf
      g.fillStyle(0x2d6a4f, 1);
      g.fillTriangle(x, 45, x + 8, 45, x + 4, 62);
      // Marigold flower
      g.fillStyle(0xffa200, 1);
      g.fillCircle(x + 4, 45, 5);
    }

    // Heavy Wooden Gate Doors (split in center)
    // Left Door
    g.fillStyle(0x4A2511, 1);
    g.fillRect(60, 45, 78, 205);
    // Right Door
    g.fillRect(142, 45, 78, 205);

    // Brass Studs on Gates
    g.fillStyle(0xffd700, 1);
    for (let gy = 60; gy < 240; gy += 35) {
      g.fillCircle(75, gy, 5);
      g.fillCircle(120, gy, 5);
      g.fillCircle(155, gy, 5);
      g.fillCircle(200, gy, 5);
    }

    // Center latch
    g.fillStyle(0xc0c0c0, 1);
    g.fillRect(130, 130, 20, 14);

    g.generateTexture('vaadivasal_gate', width, height);
    g.destroy();
  }

  // Gopuram Temple Silhouette
  private static generateGopuramSilhouette(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const width = 200;
    const height = 240;

    g.fillStyle(0x1a0f0a, 0.95);
    
    // Tiered Dravidian Gopuram structure
    let currentW = 160;
    let y = 240;
    for (let tier = 0; tier < 7; tier++) {
      const h = 24;
      y -= h;
      g.fillRect((width - currentW) / 2, y, currentW, h);
      // Kalasam crest decorations
      g.fillRect((width - currentW) / 2 - 4, y, 6, 8);
      g.fillRect((width + currentW) / 2 - 2, y, 6, 8);
      currentW -= 18;
    }

    // Top Kalasams (Sacred finials)
    g.fillStyle(0xffd700, 0.8);
    for (let k = -20; k <= 20; k += 10) {
      g.fillTriangle(width / 2 + k - 3, y, width / 2 + k + 3, y, width / 2 + k, y - 18);
      g.fillCircle(width / 2 + k, y - 18, 3);
    }

    g.generateTexture('gopuram_silhouette', width, height);
    g.destroy();
  }

  // Spectator Crowd Silhouette
  private static generateCrowdSilhouette(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const width = 400;
    const height = 90;

    g.fillStyle(0x190c07, 0.9);

    // Random heads and raised cheering hands
    for (let x = 10; x < 390; x += 12) {
      const headY = 40 + Math.sin(x * 0.1) * 8 + (x % 5);
      g.fillCircle(x, headY, 9);
      g.fillRect(x - 8, headY + 8, 16, 45);

      // Raised arms
      if (x % 24 === 0) {
        g.fillRect(x - 12, headY - 14, 5, 20);
        g.fillCircle(x - 10, headY - 14, 3);
      } else if (x % 18 === 0) {
        g.fillRect(x + 8, headY - 14, 5, 20);
        g.fillCircle(x + 10, headY - 14, 3);
      }
    }

    // Festival banners in crowd
    g.fillStyle(0xd90429, 0.85);
    g.fillTriangle(60, 10, 80, 20, 60, 30);
    g.fillStyle(0xffa200, 0.85);
    g.fillTriangle(200, 8, 220, 18, 200, 28);
    g.fillStyle(0x2a9d8f, 0.85);
    g.fillTriangle(330, 12, 350, 22, 330, 32);

    g.generateTexture('crowd_silhouette', width, height);
    g.destroy();
  }

  // Dust Particle
  private static generateDustParticle(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xe2b97f, 0.7);
    g.fillCircle(8, 8, 7);
    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(6, 6, 3);
    g.generateTexture('particle_dust', 16, 16);
    g.destroy();
  }

  // Marigold Particle
  private static generateMarigoldParticle(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xff9e00, 0.9);
    g.fillCircle(6, 6, 5);
    g.fillStyle(0xff0054, 0.9);
    g.fillCircle(6, 6, 2.5);
    g.generateTexture('particle_marigold', 12, 12);
    g.destroy();
  }

  // Arena Sand Ground Texture
  private static generateArenaGround(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const size = 512;

    // Sand background
    g.fillStyle(0xccaa7d, 1);
    g.fillRect(0, 0, size, size);

    // Sand grains & variation
    g.fillStyle(0xbfa070, 0.5);
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * size;
      const ry = Math.random() * size;
      const r = 1 + Math.random() * 3;
      g.fillCircle(rx, ry, r);
    }

    g.fillStyle(0xddbc8d, 0.5);
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * size;
      const ry = Math.random() * size;
      const r = 1 + Math.random() * 2;
      g.fillCircle(rx, ry, r);
    }

    g.generateTexture('arena_ground', size, size);
    g.destroy();
  }
}
