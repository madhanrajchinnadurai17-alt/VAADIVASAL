import Phaser from 'phaser';
import { soundManager } from '../../utils/soundSynthesizer';
import { BullPersonality, getRandomBullPersonality } from '../bullPersonality';
import { VillageEvent, TAMIL_VILLAGES } from '../villageSystem';

export interface GameResultData {
  success: boolean;
  score: number;
  avgReactionTimeMs: number;
  gripsAchieved: number;
  attemptsUsed: number;
  title: string;
  bullPersonality: string;
  villageName: string;
  villageTamilName: string;
  wonPrize?: {
    name: string;
    tamilName: string;
    icon: string;
    value: number;
  };
  ownerReward?: {
    name: string;
    tamilName: string;
    icon: string;
    reputationBonus: number;
  };
}

export class TamingScene extends Phaser.Scene {
  private bullSprite!: Phaser.GameObjects.Image;
  private tamerSprite!: Phaser.GameObjects.Image;
  private barBg!: Phaser.GameObjects.Rectangle;
  private targetZone!: Phaser.GameObjects.Rectangle;
  private needle!: Phaser.GameObjects.Rectangle;
  private personality!: BullPersonality;
  private village!: VillageEvent;

  // Minigame State
  private needlePos = 0;
  private needleSpeed = 1.3;
  private needleDirection = 1;
  private currentStage = 0;
  private targetStages = 4;
  private stamina = 100;
  private maxStamina = 100;
  private staminaBarFill!: Phaser.GameObjects.Rectangle;
  private feedbackText!: Phaser.GameObjects.Text;
  private stageCounterText!: Phaser.GameObjects.Text;
  private isRoundOver = false;

  private reactionTimes: number[] = [];
  private lastTriggerTime = 0;
  private attemptsUsed = 1;

  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private marigoldEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'TamingScene' });
  }

  init(data: { attempts?: number; personality?: BullPersonality; village?: VillageEvent }) {
    this.attemptsUsed = data.attempts || 1;
    this.personality = data.personality || getRandomBullPersonality();
    this.village = data.village || TAMIL_VILLAGES[0];
    this.currentStage = 0;
    this.targetStages = this.personality.targetStages;
    this.stamina = 100;
    this.reactionTimes = [];
    this.isRoundOver = false;
    this.needlePos = 0;
    this.needleSpeed = 1.3 * this.personality.needleSpeedMultiplier * this.village.difficultyMultiplier;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.fadeIn(400, 18, 11, 9);
    soundManager.startFestiveDrums(155);

    // Arena dust background with village ground tint
    const bg = this.add.tileSprite(width / 2, height / 2, width, height, 'arena_ground');
    bg.setTint(this.village.arenaTheme.groundTint);

    // Cheering Crowd in background
    this.add.image(width / 2, 80, 'crowd_silhouette').setScale(1.4, 1).setAlpha(0.7);

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

    // Central Bull Sprite
    const centerX = width / 2;
    const centerY = height * 0.48;

    this.bullSprite = this.add.image(centerX + 30, centerY, 'bull_side');
    this.bullSprite.setScale(1.15);

    // Tamer (Bib #07) gripping the Hump
    this.tamerSprite = this.add.image(centerX - 10, centerY - 25, 'player_top');
    this.tamerSprite.setScale(1.3).setAngle(-25);

    this.tweens.add({
      targets: [this.bullSprite, this.tamerSprite],
      y: '+=14',
      duration: 260,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // TIMING BAR HUD
    const hudY = height - 110;
    const barWidth = Math.min(width - 60, 480);
    const barHeight = 28;

    const hudContainer = this.add.container(centerX, hudY);
    const hudBg = this.add.rectangle(0, 0, barWidth + 30, 104, 0x120b09, 0.9);
    hudBg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(this.personality.color).color);

    this.barBg = this.add.rectangle(0, 5, barWidth, barHeight, 0x2b1e19);
    this.barBg.setStrokeStyle(2, 0x8d5524);

    const baseW = Math.round(120 * this.personality.targetZoneMultiplier);
    this.targetZone = this.add.rectangle(0, 5, baseW, barHeight - 4, 0x2ec4b6, 0.9);
    this.targetZone.setStrokeStyle(2, 0x00f5d4);

    this.needle = this.add.rectangle(0, 5, 8, barHeight + 12, 0xffd700);
    this.needle.setStrokeStyle(1.5, 0xffffff);

    this.stageCounterText = this.add.text(
      0,
      -32,
      `PARTICIPANT #07 | ${this.village.name.toUpperCase()} | GRIP LOCK: 0 / ${this.targetStages}`,
      {
        fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
        fontSize: '15px',
        color: this.personality.color,
        fontStyle: 'bold',
      }
    ).setOrigin(0.5);

    const actionText = this.add.text(0, 32, 'PRESS [SPACE] OR CLICK / TAP WHEN NEEDLE IS IN THE GREEN ZONE!', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '12px',
      color: '#FFFFFF',
      fontStyle: '600',
    }).setOrigin(0.5);

    hudContainer.add([hudBg, this.barBg, this.targetZone, this.needle, this.stageCounterText, actionText]);

    this.feedbackText = this.add.text(centerX, centerY - 110, '', {
      fontFamily: "'Mukta Malar', 'Cinzel', sans-serif",
      fontSize: '28px',
      color: '#00F5D4',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);

    this.createStaminaBar(centerX, 35, width);

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

    this.add.text(x, y - 16, 'TAMER FOCUS & BALANCE (கவனக் குவிப்பு)', {
      fontFamily: "'Mukta Malar', 'Outfit', sans-serif",
      fontSize: '13px',
      color: '#FFA000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const staminaBg = this.add.rectangle(x, y, barW, barH, 0x1e120d);
    staminaBg.setStrokeStyle(1.5, 0xffa000);

    this.staminaBarFill = this.add.rectangle(x - barW / 2, y, barW, barH - 4, 0x00f5d4);
    this.staminaBarFill.setOrigin(0, 0.5);
  }

  private updateTargetZoneWidth() {
    const baseWidths = [130, 100, 75, 55, 45];
    const rawW = baseWidths[Math.min(this.currentStage, baseWidths.length - 1)];
    const newW = Math.round(rawW * this.personality.targetZoneMultiplier);
    this.targetZone.setSize(newW, 24);

    this.needleSpeed = (1.3 + this.currentStage * 0.35) * this.personality.needleSpeedMultiplier * this.village.difficultyMultiplier;
  }

  update(time: number, delta: number) {
    if (this.isRoundOver) return;

    const dt = delta / 1000;

    this.needlePos += this.needleDirection * this.needleSpeed * dt * 2;
    if (this.needlePos >= 1) {
      this.needlePos = 1;
      this.needleDirection = -1;
    } else if (this.needlePos <= -1) {
      this.needlePos = -1;
      this.needleDirection = 1;
    }

    const halfWidth = (this.barBg.width - 20) / 2;
    this.needle.x = this.needlePos * halfWidth;

    this.stamina -= dt * (6.5 * this.personality.staminaResistance);
    this.updateStaminaDisplay();

    if (this.stamina <= 0) {
      this.handleStaminaExhausted();
    }
  }

  private updateStaminaDisplay() {
    const pct = Phaser.Math.Clamp(this.stamina / this.maxStamina, 0, 1);
    const barW = Math.min(this.scale.width - 80, 420);
    this.staminaBarFill.setSize(barW * pct, 12);

    if (pct < 0.3) {
      this.staminaBarFill.setFillStyle(0xd90429);
    } else if (pct < 0.6) {
      this.staminaBarFill.setFillStyle(0xffa000);
    } else {
      this.staminaBarFill.setFillStyle(0x00f5d4);
    }
  }

  private handleTameAttempt() {
    if (this.isRoundOver) return;

    const now = this.time.now;
    const reactionMs = Math.round(now - this.lastTriggerTime);
    this.lastTriggerTime = now;
    this.reactionTimes.push(reactionMs);

    const currentNeedleX = this.needle.x;
    const targetHalfW = this.targetZone.width / 2;

    const isHit = Math.abs(currentNeedleX - this.targetZone.x) <= targetHalfW;

    if (isHit) {
      this.currentStage++;
      soundManager.playGripSuccess(this.currentStage);
      this.dustEmitter.emitParticleAt(this.bullSprite.x, this.bullSprite.y + 40, 6);
      this.cameras.main.shake(180, 0.005);

      const tamilPraises = [
        'பிடி 1: பிடி நன்று!',
        'பிடி 2: விடாதே!',
        'பிடி 3: வீரம்!',
        'பிடி 4: அருமை!',
        'பிடி 5: முழு வெற்றி!',
      ];
      const text = tamilPraises[Math.min(this.currentStage - 1, tamilPraises.length - 1)];
      this.showFeedback(text, '#00F5D4');

      this.stageCounterText.setText(
        `PARTICIPANT #07 | ${this.village.name.toUpperCase()} | GRIP LOCK: ${this.currentStage} / ${this.targetStages}`
      );

      this.stamina = Math.min(this.maxStamina, this.stamina + 12);

      if (this.currentStage >= this.targetStages) {
        this.handleTameVictory();
      } else {
        this.updateTargetZoneWidth();
      }

    } else {
      soundManager.playGripMiss();
      soundManager.playBullSnort();
      this.cameras.main.shake(250, 0.008);

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
      this.stamina -= 16 * this.personality.staminaResistance;
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

  private handleTameVictory() {
    this.isRoundOver = true;
    soundManager.stopFestiveDrums();
    soundManager.playVictoryFanfare();

    this.marigoldEmitter.start();
    this.dustEmitter.emitParticleAt(this.bullSprite.x, this.bullSprite.y, 25);

    const avgReaction = this.reactionTimes.length > 0
      ? Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length)
      : 320;
    const finalScore = Math.round((1000 / (avgReaction / 100)) * 10 + (this.stamina * 8) + (this.village.prize.value / 10));

    const resultData: GameResultData = {
      success: true,
      score: finalScore,
      avgReactionTimeMs: avgReaction,
      gripsAchieved: this.currentStage,
      attemptsUsed: this.attemptsUsed,
      title: `வெற்றி வீரர் #07 (${this.village.tamilName} Champion)`,
      bullPersonality: `${this.personality.badge} (${this.personality.tamilName})`,
      villageName: this.village.name,
      villageTamilName: this.village.tamilName,
      wonPrize: this.village.prize,
    };

    this.time.delayedCall(1200, () => {
      this.game.events.emit('game-finished', resultData);
    });
  }

  private handleStaminaExhausted() {
    this.isRoundOver = true;
    soundManager.stopFestiveDrums();
    soundManager.playBullSnort();

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
      title: `துணிச்சலான முயற்சி (vs ${this.personality.badge})`,
      bullPersonality: `${this.personality.badge} (${this.personality.tamilName})`,
      villageName: this.village.name,
      villageTamilName: this.village.tamilName,
      ownerReward: this.village.ownerReward,
    };

    this.showFeedback('காளை தப்பியது! THE BULL ESCAPED!', '#FFA000');

    this.time.delayedCall(1600, () => {
      this.game.events.emit('game-finished', resultData);
    });
  }
}
