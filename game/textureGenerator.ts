import Phaser from 'phaser';

export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene) {
    if (scene.textures.exists('bull_perspective')) return;

    this.generateBullTop(scene);
    this.generateBullSide(scene);
    this.generateBullPerspective(scene);
    this.generatePlayerBackPerspective(scene);
    this.generateAIPerspective(scene);
    this.generateVaadivasalArchFront(scene);
    this.generateSpectatorGallery(scene);
    this.generateDustParticle(scene);
    this.generateMarigoldParticle(scene);
    this.generateWaterParticle(scene);
    this.generateArenaGround(scene);
    this.generatePondTile(scene);
    this.generateFieldObstacle(scene);
    this.generateVillageLandscape(scene);
  }

  // 1. Perspective Front-Facing Charging Bull (as seen in the reference)
  private static generateBullPerspective(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const w = 180;
    const h = 180;

    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(90, 160, 110, 30);

    // Muscular Legs
    g.fillStyle(0x1e1e1e, 1);
    g.fillRoundedRect(55, 110, 20, 50, 5);
    g.fillRoundedRect(105, 110, 20, 50, 5);

    // Hooves
    g.fillStyle(0x000000, 1);
    g.fillRoundedRect(53, 152, 24, 12, 3);
    g.fillRoundedRect(103, 152, 24, 12, 3);

    // Powerful Chest & Torso
    g.fillStyle(0x282828, 1);
    g.fillEllipse(90, 95, 95, 80);

    // Prominent Hump (திமில்) rising above shoulders
    g.fillStyle(0x1c1c1c, 1);
    g.fillEllipse(90, 55, 52, 44);
    g.fillStyle(0x3a3a3a, 0.9);
    g.fillEllipse(90, 50, 36, 30);

    // White/Black dappled hide markings
    g.fillStyle(0xf3f4f6, 0.85);
    g.fillCircle(75, 88, 16);
    g.fillCircle(108, 92, 14);
    g.fillCircle(90, 78, 10);

    // Bull Head
    g.fillStyle(0x181818, 1);
    g.fillEllipse(90, 85, 48, 55);

    // White blaze on forehead
    g.fillStyle(0xffffff, 0.95);
    g.fillTriangle(90, 65, 82, 85, 98, 85);
    g.fillCircle(90, 88, 6);

    // Nostrils & Snout
    g.fillStyle(0x111111, 1);
    g.fillRoundedRect(72, 102, 36, 26, 8);
    g.fillStyle(0xff3333, 1);
    g.fillCircle(80, 115, 4);
    g.fillCircle(100, 115, 4);

    // Eyes
    g.fillStyle(0xf59e0b, 1);
    g.fillCircle(73, 80, 4.5);
    g.fillCircle(107, 80, 4.5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(73, 80, 2.5);
    g.fillCircle(107, 80, 2.5);

    // Massive Sharp Curved Horns
    g.lineStyle(9, 0xfef08a, 1);
    // Left horn
    g.beginPath();
    g.moveTo(76, 70);
    g.lineTo(48, 48);
    g.lineTo(44, 20);
    g.strokePath();

    // Right horn
    g.beginPath();
    g.moveTo(104, 70);
    g.lineTo(132, 48);
    g.lineTo(136, 20);
    g.strokePath();

    // Red Kunkumam tips on horns
    g.fillStyle(0xd90429, 1);
    g.fillCircle(44, 20, 6.5);
    g.fillCircle(136, 20, 6.5);

    // Ears
    g.fillStyle(0x222222, 1);
    g.fillEllipse(60, 75, 18, 10);
    g.fillEllipse(120, 75, 18, 10);

    g.generateTexture('bull_perspective', w, h);
    g.destroy();
  }

  // 2. Player Perspective (View from behind wearing Yellow "JALLIKATTU 07" Jersey)
  private static generatePlayerBackPerspective(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const w = 140;
    const h = 180;

    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(70, 172, 85, 20);

    // Athletic bare legs in ready stance
    g.fillStyle(0x8d5524, 1);
    // Left leg
    g.fillRoundedRect(35, 115, 18, 55, 4);
    // Right leg
    g.fillRoundedRect(85, 115, 18, 55, 4);
    // Feet
    g.fillStyle(0x78350f, 1);
    g.fillRoundedRect(30, 165, 26, 10, 3);
    g.fillRoundedRect(85, 165, 26, 10, 3);

    // Black athletic shorts
    g.fillStyle(0x18181b, 1);
    g.fillRoundedRect(42, 95, 56, 32, 4);

    // Yellow "JALLIKATTU 07" Jersey
    g.fillStyle(0xeab308, 1); // Bright Gold/Yellow
    g.fillRoundedRect(35, 45, 70, 58, 8);

    // Green Collar/Trims
    g.fillStyle(0x15803d, 1);
    g.fillRoundedRect(52, 42, 36, 10, 4);
    g.fillRoundedRect(32, 60, 8, 18, 2);
    g.fillRoundedRect(100, 60, 8, 18, 2);

    // "07" Bib Number on back
    g.fillStyle(0x18181b, 1);
    // 0
    g.fillRect(56, 62, 11, 20);
    g.fillStyle(0xeab308, 1);
    g.fillRect(59, 66, 5, 12);
    // 7
    g.fillStyle(0x18181b, 1);
    g.fillRect(72, 62, 13, 5);
    g.fillRect(80, 67, 5, 15);

    // Athletic Arms outstretched
    g.fillStyle(0x8d5524, 1);
    g.fillRoundedRect(18, 55, 18, 45, 4);
    g.fillRoundedRect(104, 55, 18, 45, 4);
    // Hands
    g.fillStyle(0xa16838, 1);
    g.fillCircle(25, 102, 7);
    g.fillCircle(115, 102, 7);

    // Head (back view with short cropped black hair)
    g.fillStyle(0x09090b, 1);
    g.fillCircle(70, 30, 18);
    // Sun-kissed neck
    g.fillStyle(0x78350f, 1);
    g.fillRect(63, 40, 14, 12);

    g.generateTexture('player_back_perspective', w, h);
    g.destroy();
  }

  // 3. AI Tamer Perspective (Yellow Jersey athletes running/flanking)
  private static generateAIPerspective(scene: Phaser.Scene) {
    const bibs = ['01', '02', '03', '04', '05'];

    bibs.forEach((bib, idx) => {
      const g = scene.make.graphics({ x: 0, y: 0 });
      const w = 100;
      const h = 130;

      // Shadow
      g.fillStyle(0x000000, 0.35);
      g.fillEllipse(50, 122, 60, 14);

      // Legs in running stride
      g.fillStyle(0x8d5524, 1);
      g.fillRoundedRect(30, 80, 12, 40, 3);
      g.fillRoundedRect(58, 80, 12, 40, 3);

      // Shorts
      g.fillStyle(0x18181b, 1);
      g.fillRoundedRect(30, 68, 40, 22, 3);

      // Yellow Jersey
      g.fillStyle(0xeab308, 1);
      g.fillRoundedRect(28, 30, 44, 42, 6);

      // Black Bib number
      g.fillStyle(0x18181b, 1);
      g.fillRect(44, 42, 12, 14);

      // Head
      g.fillStyle(0x09090b, 1);
      g.fillCircle(50, 20, 12);

      // Arms
      g.fillStyle(0x8d5524, 1);
      g.fillRoundedRect(16, 36, 12, 30, 3);
      g.fillRoundedRect(72, 36, 12, 30, 3);

      g.generateTexture(`ai_perspective_${idx + 1}`, w, h);
      g.destroy();
    });
  }

  // 4. Authentic Vaadivasal Front Arch with Tamil Boards ("வாடிவாசல்", "அன்பே", "அறம்")
  private static generateVaadivasalArchFront(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const w = 480;
    const h = 320;

    // Stone Pillars with Red/White Stripes
    const drawStripedPillar = (x: number) => {
      g.fillStyle(0xf8fafc, 1);
      g.fillRect(x, 40, 60, 280);
      g.fillStyle(0xdc2626, 1); // Red stripes
      g.fillRect(x, 70, 60, 35);
      g.fillRect(x, 140, 60, 35);
      g.fillRect(x, 210, 60, 35);
      g.fillRect(x, 280, 60, 40);
    };

    drawStripedPillar(40);
    drawStripedPillar(380);

    // Arch Beam across top
    g.fillStyle(0xf8fafc, 1);
    g.fillRect(30, 20, 420, 50);
    g.fillStyle(0xdc2626, 1);
    g.fillRect(30, 15, 420, 8);

    // Center Gate Entrance opening (dark tunnel where bull emerges)
    g.fillStyle(0x0a0503, 0.95);
    g.fillRect(100, 70, 280, 250);

    // Blue Iron Gate Barricades
    g.lineStyle(4, 0x2563eb, 0.9);
    for (let x = 110; x <= 370; x += 18) {
      g.strokeLineShape(new Phaser.Geom.Line(x, 80, x, 320));
    }
    g.strokeRect(102, 75, 276, 245);

    // Tamil Banner Boards on gate:
    // 1. Center: "வாடிவாசல்"
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(160, 30, 160, 30, 5);
    g.lineStyle(2, 0xdc2626, 1);
    g.strokeRoundedRect(160, 30, 160, 30, 5);

    // 2. Left Yellow Board: "அன்பே"
    g.fillStyle(0xfef08a, 1);
    g.fillRoundedRect(95, 75, 65, 30, 4);
    g.lineStyle(2, 0x15803d, 1);
    g.strokeRoundedRect(95, 75, 65, 30, 4);

    // 3. Right Yellow Board: "அறம்"
    g.fillStyle(0xfef08a, 1);
    g.fillRoundedRect(320, 75, 65, 30, 4);
    g.lineStyle(2, 0x15803d, 1);
    g.strokeRoundedRect(320, 75, 65, 30, 4);

    g.generateTexture('vaadivasal_arch_front', w, h);
    g.destroy();
  }

  // 5. Spectator Gallery & Double Barricades
  private static generateSpectatorGallery(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const w = 800;
    const h = 180;

    // Blue perimeter fence
    g.lineStyle(3, 0x3b82f6, 0.9);
    for (let x = 0; x < w; x += 15) {
      g.strokeLineShape(new Phaser.Geom.Line(x, 90, x, 180));
    }
    g.strokeLineShape(new Phaser.Geom.Line(0, 90, w, 90));
    g.strokeLineShape(new Phaser.Geom.Line(0, 135, w, 135));

    // Crowd silhouettes sitting and standing on wooden tiers
    g.fillStyle(0x1e1b18, 0.9);
    for (let x = 5; x < w; x += 12) {
      const y = 35 + Math.sin(x * 0.1) * 8 + (x % 7);
      g.fillCircle(x, y, 7);
      g.fillRect(x - 5, y + 7, 10, 45);
    }

    g.generateTexture('spectator_gallery', w, h);
    g.destroy();
  }

  // Existing asset generators preserved
  private static generateBullTop(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const size = 120;
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(60, 68, 55, 90);
    g.fillStyle(0x222222, 1);
    g.fillEllipse(60, 60, 42, 75);
    g.fillStyle(0x181818, 1);
    g.fillEllipse(60, 42, 28, 30);
    g.fillStyle(0x242424, 1);
    g.fillEllipse(60, 20, 24, 28);
    g.lineStyle(5, 0xefd8a1, 1);
    g.beginPath();
    g.moveTo(52, 20);
    g.lineTo(32, 12);
    g.lineTo(30, -2);
    g.strokePath();
    g.beginPath();
    g.moveTo(68, 20);
    g.lineTo(88, 12);
    g.lineTo(90, -2);
    g.strokePath();
    g.fillStyle(0xd90429, 1);
    g.fillCircle(30, -2, 4);
    g.fillCircle(90, -2, 4);
    g.generateTexture('bull_top', size, size + 10);
    g.destroy();
  }

  private static generateBullSide(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const width = 340;
    const height = 240;
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(170, 220, 160, 35);
    g.fillStyle(0x222222, 1);
    g.fillEllipse(100, 130, 75, 55);
    g.fillStyle(0x282828, 1);
    g.fillEllipse(160, 130, 85, 60);
    g.fillStyle(0x181818, 1);
    g.fillEllipse(190, 80, 48, 42);
    g.lineStyle(3, 0xffd700, 0.7);
    g.strokeEllipse(190, 80, 48, 42);
    g.fillStyle(0x262626, 1);
    g.fillEllipse(250, 105, 45, 38);
    g.lineStyle(8, 0xf0e2b6, 1);
    g.beginPath();
    g.moveTo(250, 85);
    g.lineTo(270, 40);
    g.lineTo(260, 12);
    g.strokePath();
    g.fillStyle(0xd90429, 1);
    g.fillCircle(260, 12, 7);
    g.generateTexture('bull_side', width, height);
    g.destroy();
  }

  private static generatePlayerTop(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const size = 64;
    g.fillStyle(0x000000, 0.35);
    g.fillEllipse(32, 38, 22, 28);
    g.fillStyle(0x8d5524, 1);
    g.fillEllipse(32, 30, 20, 24);
    g.fillStyle(0xeab308, 1);
    g.fillRoundedRect(22, 34, 20, 14, 3);
    g.fillStyle(0x703d15, 1);
    g.fillCircle(32, 18, 9);
    g.generateTexture('player_top', size, size);
    g.destroy();
  }

  private static generateAITamersTop(scene: Phaser.Scene) {
    const colors = [0x2a9d8f, 0x3a86ff, 0x8338ec, 0xf4a261];
    colors.forEach((color, idx) => {
      const g = scene.make.graphics({ x: 0, y: 0 });
      const size = 64;
      g.fillStyle(0x000000, 0.3);
      g.fillEllipse(32, 38, 20, 26);
      g.fillStyle(0x7d4b1f, 1);
      g.fillEllipse(32, 30, 19, 23);
      g.fillStyle(color, 1);
      g.fillRoundedRect(23, 34, 18, 13, 3);
      g.fillStyle(0x653b17, 1);
      g.fillCircle(32, 18, 8.5);
      g.generateTexture(`ai_tamer_top_${idx + 1}`, size, size);
      g.destroy();
    });
  }

  private static generateDustParticle(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xe2b97f, 0.7);
    g.fillCircle(8, 8, 7);
    g.generateTexture('particle_dust', 16, 16);
    g.destroy();
  }

  private static generateMarigoldParticle(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xff9e00, 0.9);
    g.fillCircle(6, 6, 5);
    g.generateTexture('particle_marigold', 12, 12);
    g.destroy();
  }

  private static generateWaterParticle(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x70d6ff, 0.85);
    g.fillCircle(6, 6, 5);
    g.generateTexture('particle_water', 12, 12);
    g.destroy();
  }

  private static generateArenaGround(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    const size = 512;
    g.fillStyle(0xdeb887, 1);
    g.fillRect(0, 0, size, size);
    g.fillStyle(0xc89b65, 0.5);
    for (let i = 0; i < 300; i++) {
      g.fillCircle(Math.random() * size, Math.random() * size, 1 + Math.random() * 3);
    }
    g.generateTexture('arena_ground', size, size);
    g.destroy();
  }

  private static generatePondTile(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x1d4ed8, 0.85);
    g.fillRect(0, 0, 512, 512);
    g.generateTexture('pond_water', 512, 512);
    g.destroy();
  }

  private static generateFieldObstacle(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xd97706, 1);
    g.fillRoundedRect(8, 12, 48, 40, 6);
    g.generateTexture('field_obstacle', 64, 64);
    g.destroy();
  }

  private static generateVillageLandscape(scene: Phaser.Scene) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x166534, 1);
    g.fillRect(0, 240, 800, 280);
    g.generateTexture('village_landscape', 800, 520);
    g.destroy();
  }
}
