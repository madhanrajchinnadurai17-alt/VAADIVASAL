import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { Trophy, ChevronLeft, ChevronRight, Award, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  tamilName: string;
  icon: string;
  category: string;
  description: string;
}

const SEASON_REWARDS: RewardItem[] = [
  {
    id: 'double_kalash_pot',
    name: 'Double-Kalash Brass Trophy Pot',
    tamilName: 'இரட்டை கலச பித்தளை பித்தளை பாணை',
    icon: '🏺',
    category: 'Sacred Trophy',
    description: 'Traditional heavy brass double-kalash pot engraved with sacred Kolam patterns.',
  },
  {
    id: 'hero_motorcycle',
    name: 'Hero Sports Motorcycle',
    tamilName: 'வீர ஸ்போர்ட்ஸ் மோட்டார் பைக்',
    icon: '🏍️',
    category: 'Grand Prize',
    description: 'Premier grand prize awarded to top participant of the arena circuit.',
  },
  {
    id: 'ceremonial_lamp',
    name: 'Sacred Kuthu Vilakku Lamp',
    tamilName: 'மங்கல குத்து விளக்கு',
    icon: '🪔',
    category: 'Heritage Honor',
    description: 'Five-wick auspicious temple brass lamp symbolizing heritage victory.',
  },
  {
    id: 'trophy_showcase',
    name: 'Village Showcase Trophy Case',
    tamilName: 'சாம்பியன் கண்ணாடி பேழை',
    icon: '🏆',
    category: 'Hall of Fame',
    description: 'Displayed in the village community center honoring participant bravery.',
  },
];

export const SeasonReward3D: React.FC = () => {
  const { currentVillage, score, setScreen, resetToArena } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    soundManager.stopFestiveDrums();
    soundManager.playVictoryFanfare();

    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA000', '#F26A1B', '#00F5D4'],
    });
  }, []);

  const handlePrev = () => {
    soundManager.playThavilSnap(0.5);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : SEASON_REWARDS.length - 1));
  };

  const handleNext = () => {
    soundManager.playThavilSnap(0.5);
    setCurrentIndex((prev) => (prev < SEASON_REWARDS.length - 1 ? prev + 1 : 0));
  };

  const currentReward = SEASON_REWARDS[currentIndex];

  return (
    <div className="relative w-full h-full min-h-[520px] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden select-none">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-[#2a1710] via-[#1a0f0a] to-[#120B09] p-6 text-center shadow-2xl space-y-4">
        <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

        <div className="relative z-10 space-y-3">
          {/* Top Banner */}
          <div>
            <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-400/50">
              {currentVillage.name.toUpperCase()} JALLIKATTU – SEASON CHAMPION REWARD
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display mt-1">
              வெற்றி விருதுகள் • SEASON PRIZES
            </h2>
            <p className="text-xs text-amber-200 font-bold">
              WINNER – PARTICIPANT #07 • {currentVillage.district} CIRCUIT
            </p>
          </div>

          {/* 4-Reward Horizontal Carousel */}
          <div className="relative bg-black/60 border border-white/10 rounded-2xl p-4 shadow-xl">
            {/* Left / Right Nav Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/80 hover:bg-amber-500 hover:text-black border border-white/20 text-white transition-all shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/80 hover:bg-amber-500 hover:text-black border border-white/20 text-white transition-all shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Current Selected Reward Card */}
            <div className="max-w-xs mx-auto space-y-2">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-pulse">
                {currentReward.icon}
              </div>

              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">
                  {currentReward.category} ({currentIndex + 1}/4)
                </span>
                <h3 className="text-base font-black text-white">
                  {currentReward.name}
                </h3>
                <div className="text-xs text-amber-300 font-tamil font-bold">
                  {currentReward.tamilName}
                </div>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  {currentReward.description}
                </p>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {SEASON_REWARDS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-amber-400 w-4' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('world_map');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-amber-200"
            >
              <MapPin className="w-4 h-4" />
              <span>CONTINUE TO WORLD MAP (அடுத்த களம்)</span>
            </button>

            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('trophy_hall');
              }}
              className="py-3.5 px-4 rounded-2xl bg-black/60 hover:bg-black border border-white/20 text-xs font-bold text-gray-300 hover:text-white transition-all"
            >
              Trophy Hall ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
