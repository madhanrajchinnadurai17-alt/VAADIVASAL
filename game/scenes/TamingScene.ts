import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';

export interface GameResultData {
  success: boolean;
  score: number;
  avgReactionTimeMs: number;
  gripsAchieved: number;
  attemptsUsed: number;
  title: string;
}

export class TamingScene extends Phaser.Scene {
  private bullSprite!: Phaser.GameObjects.Image;
  private tamerSprite!: Phaser.GameObjects.Image;
  private barBg!: Phaser.GameObjects.Rectangle;
  private targetZone!: Phaser.GameObjects.Rectangle;
  private needle!: Phaser.GameObjects.Rectangle;

  // Minigame State
  private needlePos = 0; // 0 to 1
  private needleSpeed = 1.3; // Cycles per sec
  private needleDirection = 1;
  private currentStage = 0; // 0 to 4
  private targetStages = 4;
  private stamina = 100;
  private maxStamina = 100;
  private staminaBarFill!: Phaser.GameObjects.Rectangle;
  private feedbackText!: Phaser.GameObjects.Text;
  private stageCounterText!: Phaser.GameObjects.Text;
  private isRoundOver = false;

  // Scoring
  private reactionTimes: number[] = [];
  private lastTriggerTime = 0;
  private attemptsUsed = 1;

  // Particles
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private marigoldEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'TamingScene' });
  }

  init(data: { attempts?: number }) {
    this.attemptsUsed = data.attempts || 1;
    this.currentStage = 0;
    this.stamina = 100;
    this.reactionTimes = [];
    this.isRoundOver = false;
    this.needlePos = 0;
    this.needleSpeed = 1.3;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);
    soundManager.startFestiveDrums(155); // Faster adrenaline rhythm

    // Arena dust background
    const bg = this.add.tileSprite(width / 2, height / 2, width, height, 'arena_ground');
    bg.setTint(0xcc9966);

    // Cheering Crowd in background
    this.add.image(width / 2, 80, 'crowd_silhouette').setScale(1.4, 1).setAlpha(0.65);

    // Dust particles
    this.dustEmitter = this.add.particles(0, 0, 'particle_dust', {
      lifespan: 500,
      scale: { start: 1, end: 0.1 },
      alpha: { start: 0.8, end: 0 },
      speed: { min: 40, max: 130 },
      emitting: false,
    });

    // Marigolds for celebration
    this.marigoldEmitter = this.add.particles(0, 0, 'particle_marigold', {
      lifespan: 2500,
      scale: { start: 1.2, end: 0.4 },
      speedY: { min: 60, max: 150 },
      speedX: { min: -40, max: 40 },
      rotate: { min: 0, max: 360 },
      emitting: false,
    });

    // Central Bull Sprite (Side Profile)
    const centerX = width / 2;
    const centerY = height * 0.48;

    this.bullSprite = this.add.image(centerX + 30, centerY, 'bull_side');
    this.bullSprite.setScale(1.15);

    // Tamer gripping the Hump (திமில்)
    this.tamerSprite = this.add.image(centerX - 10, centerY - 25, 'player_top');
    this.tamerSprite.setScale(1.3).setAngle(-25);

    // Idle galloping bobbing tween
    this.tweens.add({
      targets: [this.bullSprite, this.tamerSprite],
      y: '+=14',
      duration: 260,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // --- TIMING / RHYTHM BAR HUD ---
    const hudY = height - 110;
    const barWidth = Math.min(width - 60, 480);
    const barHeight = 28;

    // Bar Container Background
    const hudContainer = this.add.container(centerX, hudY);
    const hudBg = this.add.rectangle(0, 0, barWidth + 30, 100, 0x120b09, 0.9);
    hudBg.setStrokeStyle(2, 0xffa000);

    this.barBg = this.add.rectangle(0, 5, barWidth, barHeight, 0x2b1e19);
    this.barBg.setStrokeStyle(2, 0x8d5524);

    // Green Grip Target Zone (Shrinks as stage progresses)
    this.targetZone = this.add.rectangle(0, 5, 120, barHeight - 4, 0x2ec4b6, 0.9);
    this.targetZone.setStrokeStyle(2, 0x00f5d4);

    // Moving Needle Indicator
    this.needle = this.add.rectangle(0, 5, 8, barHeight + 12, 0xffd700);
    this.needle.setStrokeStyle(1.5, 0xffffff);

    // Stage Counter Header
    this.stageCounterText = this.add.text(0, -32, `GRIP LOCK: 0 / ${this.targetStages} (திமில் பிடி)`, {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '18px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Action Instruction
    const actionText = this.add.text(0, 32, 'PRESS [SPACE] OR CLICK / TAP WHEN NEEDLE IS IN THE GREEN ZONE!', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#FFFFFF',
      fontStyle: '600',
    }).setOrigin(0.5);

    hudContainer.add([hudBg, this.barBg, this.targetZone, this.needle, this.stageCounterText, actionText]);

    // Feedback Floating Text
    this.feedbackText = this.add.text(centerX, centerY - 110, '', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '28px',
      color: '#00F5D4',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);

    // Top Stamina Bar
    this.createStaminaBar(centerX, 35, width);

    // User Input Listeners (Keyboard & Pointer)
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-SPACE', () => this.handleTameAttempt());
    }
    this.input.on('pointerdown', () => this.handleTameAttempt());

    this.lastTriggerTime = this.time.now;
    this.updateTargetZoneWidth();
  }

  private createStaminaBar(x: number, y: number, screenWidth: number) {
    const barW = Math.min(screenWidth - 80, 420);
    const barH = 16;

    this.add.text(x, y - 16, 'TAMER STAMINA (வீரம்)', {
      fontFamily: "'Mukta Malar', 'Outfit', sans-serif",
      fontSize: '13px',
      color: '#FFA000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stamina outline
    const staminaBg = this.add.rectangle(x, y, barW, barH, 0x1e120d);
    staminaBg.setStrokeStyle(1.5, 0xffa000);

    this.staminaBarFill = this.add.rectangle(x - barW / 2, y, barW, barH - 4, 0x00f5d4);
    this.staminaBarFill.setOrigin(0, 0.5);
  }

  private updateTargetZoneWidth() {
    // Green zone shrinks with each consecutive grip stage: 130 -> 100 -> 75 -> 55
    const widths = [130, 100, 75, 55];
    const newW = widths[Math.min(this.currentStage, widths.length - 1)];
    this.targetZone.setSize(newW, 24);

    // Needle gets slightly faster
    this.needleSpeed = 1.3 + this.currentStage * 0.35;
  }

  update(time: number, delta: number) {
    if (this.isRoundOver) return;

    const dt = delta / 1000;

    // --- Oscillate Needle back and forth (-1 to 1) ---
    this.needlePos += this.needleDirection * this.needleSpeed * dt * 2;
    if (this.needlePos >= 1) {
      this.needlePos = 1;
      this.needleDirection = -1;
    } else if (this.needlePos <= -1) {
      this.needlePos = -1;
      this.needleDirection = 1;
    }

    // Update needle visual X coordinate
    const halfWidth = (this.barBg.width - 20) / 2;
    this.needle.x = this.needlePos * halfWidth;

    // Passive stamina drain (10 per second)
    this.stamina -= dt * 6.5;
    this.updateStaminaDisplay();

    if (this.stamina <= 0) {
      this.handleStaminaExhausted();
    }
  }

  private updateStaminaDisplay() {
    const pct = Phaser.Math.Clamp(this.stamina / this.maxStamina, 0, 1);
    const barW = Math.min(this.scale.width - 80, 420);
    this.staminaBarFill.setSize(barW * pct, 12);

    // Color shift on low stamina
    if (pct < 0.3) {
      this.staminaBarFill.setFillStyle(0xd90429);
    } else if (pct < 0.6) {
      this.staminaBarFill.setFillStyle(0xffa000);
    } else {
      this.staminaBarFill.setFillStyle(0x00f5d4);
    }
  }

  // User Spacebar / Tap Interaction
  private handleTameAttempt() {
    if (this.isRoundOver) return;

    const now = this.time.now;
    const reactionMs = Math.round(now - this.lastTriggerTime);
    this.lastTriggerTime = now;
    this.reactionTimes.push(reactionMs);

    // Calculate distance from needle to target center
    const currentNeedleX = this.needle.x;
    const targetHalfW = this.targetZone.width / 2;

    const isHit = Math.abs(currentNeedleX - this.targetZone.x) <= targetHalfW;

    if (isHit) {
      // SUCCESSFUL HIT
      this.currentStage++;
      soundManager.playGripSuccess(this.currentStage);
      this.dustEmitter.emitParticleAt(this.bullSprite.x, this.bullSprite.y + 40, 6);

      // Camera micro-shake
      this.cameras.main.shake(180, 0.005);

      // Tamil praise feedback
      const tamilPraises = ['பிடி 1: பிடி நன்று!', 'பிடி 2: விடாதே!', 'பிடி 3: வீரம்!', 'பிடி 4: முழு வெற்றி!'];
      const text = tamilPraises[Math.min(this.currentStage - 1, tamilPraises.length - 1)];
      this.showFeedback(text, '#00F5D4');

      this.stageCounterText.setText(`GRIP LOCK: ${this.currentStage} / ${this.targetStages} (திமில் பிடி)`);

      // Restore some stamina reward
      this.stamina = Math.min(this.maxStamina, this.stamina + 12);

      if (this.currentStage >= this.targetStages) {
        this.handleTameVictory();
      } else {
        this.updateTargetZoneWidth();
      }

    } else {
      // MISS / RESISTANCE BUCK
      soundManager.playGripMiss();
      soundManager.playBullSnort();
      this.cameras.main.shake(250, 0.008);

      // Bull buck animation (pulls away)
      this.tweens.add({
        targets: this.bullSprite,
        x: '+=30',
        angle: 8,
        duration: 120,
        yoyo: true,
        ease: 'Quad.easeInOut',
      });

      this.tweens.add({
        targets: this.tamerSprite,
        x: '-=20',
        duration: 120,
        yoyo: true,
        ease: 'Quad.easeInOut',
      });

      this.dustEmitter.emitParticleAt(this.bullSprite.x - 20, this.bullSprite.y + 30, 4);

      // Penalty stamina drain
      this.stamina -= 18;
      this.showFeedback('விலகியது! PULL BACK!', '#F77F00');
    }
  }

  private showFeedback(msg: string, color: string) {
    this.feedbackText.setText(msg);
    this.feedbackText.setColor(color);
    this.feedbackText.setAlpha(1);
    this.feedbackText.setScale(1.2);

    this.tweens.add({
      targets: this.feedbackText,
      scaleX: 1,
      scaleY: 1,
      alpha: 0,
      duration: 900,
      ease: 'Power2',
    });
  }

  // --- VICTORY HANDLER ---
  private handleTameVictory() {
    this.isRoundOver = true;
    soundManager.stopFestiveDrums();
    soundManager.playVictoryFanfare();

    this.marigoldEmitter.start();
    this.dustEmitter.emitParticleAt(this.bullSprite.x, this.bullSprite.y, 25);

    // Compute stats
    const avgReaction = this.reactionTimes.length > 0
      ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
      : 320;
    const finalScore = Math.round((1000 / (avgReaction / 100)) * 10 + (this.stamina * 8));

    const resultData: GameResultData = {
      success: true,
      score: finalScore,
      avgReactionTimeMs: avgReaction,
      gripsAchieved: this.currentStage,
      attemptsUsed: this.attemptsUsed,
      title: 'வீரத் தமிழன் • Valorous Champion',
    };

    // Emit event to React parent container
    this.time.delayedCall(1200, () => {
      this.game.events.emit('game-finished', resultData);
    });
  }

  // --- BULL ESCAPED HANDLER (Stamina out) ---
  private handleStaminaExhausted() {
    this.isRoundOver = true;
    soundManager.stopFestiveDrums();
    soundManager.playBullSnort();

    // Bull gallops away gracefully
    this.tweens.add({
      targets: this.bullSprite,
      x: this.scale.width + 200,
      duration: 1200,
      ease: 'Quad.easeIn',
    });

    const avgReaction = this.reactionTimes.length > 0
      ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
      : 450;

    const resultData: GameResultData = {
      success: false,
      score: Math.round(this.currentStage * 250),
      avgReactionTimeMs: avgReaction,
      gripsAchieved: this.currentStage,
      attemptsUsed: this.attemptsUsed,
      title: 'துணிச்சலான முயற்சி • Brave Contender',
    };

    this.showFeedback('காளை தப்பியது! THE BULL ESCAPED!', '#FFA000');

    this.time.delayedCall(1600, () => {
      this.game.events.emit('game-finished', resultData);
    });
  }
}
