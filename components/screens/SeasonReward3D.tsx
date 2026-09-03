import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronRight, MapPin, Trophy, Heart, Zap, Hand, HelpCircle, Info, Settings } from 'lucide-react';

interface RewardCard {
  id: string;
  name: string;
  tamilName: string;
  icon: string;
  category: string;
}

const REWARDS_LIST: RewardCard[] = [
  {
    id: 'gold_necklace',
    name: 'Gold Veera Malai',
    tamilName: 'வீரத் தங்க மாலை',
    icon: '📿',
    category: 'Sacred Honor',
  },
  {
    id: 'hero_motorcycle',
    name: 'Royal Sports Motorcycle',
    tamilName: 'வீர மோட்டார் பைக்',
    icon: '🏍️',
    category: 'Grand Prize',
  },
  {
    id: 'kuthu_vilakku',
    name: 'Brass Kuthu Vilakku',
    tamilName: 'மங்கலக் குத்து விளக்கு',
    icon: '🪔',
    category: 'Heritage Trophy',
  },
  {
    id: 'showcase_case',
    name: 'Showcase Trophy Cabinet',
    tamilName: 'வெற்றிக் கண்ணாடிப் பேழை',
    icon: '🏆',
    category: 'Hall of Fame',
  },
];

export const SeasonReward3D: React.FC = () => {
  const {
    currentVillage,
    setScreen,
    playerHealth,
    playerStamina,
    playerGripStrength,
    currentReputation,
    gripSkillPercent,
  } = useGameStore();

  const [activeIdx, setActiveIdx] = useState(1); // Default to motorcycle

  useEffect(() => {
    soundManager.stopFestiveDrums();
    soundManager.playVictoryFanfare();

    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#FFD700', '#FFA000', '#F26A1B', '#00F5D4', '#FFFFFF'],
    });
  }, []);

  const handlePrev = () => {
    soundManager.playThavilSnap(0.5);
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : REWARDS_LIST.length - 1));
  };

  const handleNext = () => {
    soundManager.playThavilSnap(0.5);
    setActiveIdx((prev) => (prev < REWARDS_LIST.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-3 md:p-5 bg-gradient-to-b from-[#2e170c] via-[#1a0e08] to-[#0f0704] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-15" />

      {/* ================= 1. TOP HUD matching Image 4 ================= */}
      <div className="relative z-20 flex items-start justify-between">
        {/* Top-Left: Player Stats & Reputation */}
        <div className="flex flex-col gap-1 max-w-[240px]">
          <div className="flex items-center gap-2 bg-[#1b120c]/90 border border-amber-500/40 p-2 rounded-2xl shadow-xl">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-[#20130c] flex items-center justify-center font-mono font-black text-amber-300 text-xs">
              #07
            </div>
            <div className="flex-1 space-y-1 text-[9px] font-bold">
              <div className="flex justify-between text-red-300">
                <span>❤️ Health</span>
                <span>{playerHealth}</span>
              </div>
              <div className="flex justify-between text-cyan-300">
                <span>⚡ Stamina</span>
                <span>{playerStamina}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>✋ Grip</span>
                <span>{playerGripStrength}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1b120c]/90 border border-amber-500/40 px-2.5 py-1 rounded-xl shadow-xl flex justify-between items-center text-[9px] text-amber-300 font-bold">
            <span>CURRENT REPUTATION</span>
            <span>{currentReputation}</span>
          </div>
        </div>

        {/* Top-Center: Arena Header */}
        <div className="text-center">
          <h2 className="text-base md:text-lg font-black text-[#f5ebe0] font-serif uppercase tracking-widest">
            {currentVillage.name.toUpperCase()} VADIVASA
          </h2>
        </div>

        {/* Top-Right Utility Row */}
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-[#1b120c] border border-amber-500/40 text-amber-200 flex items-center justify-center text-xs">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="w-7 h-7 rounded-full bg-[#1b120c] border border-amber-500/40 text-amber-200 flex items-center justify-center text-xs">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="w-7 h-7 rounded-full bg-[#1b120c] border border-amber-500/40 text-amber-200 flex items-center justify-center text-xs">
            <Settings className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* ================= 2. CENTER STADIUM REWARD CAROUSEL matching Image 4 ================= */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-1 space-y-2">
        {/* Overarching Ribbon Banner matching Image 4 */}
        <div className="bg-gradient-to-r from-transparent via-[#451f12] to-transparent border-y-2 border-amber-400 py-1.5 px-6 rounded-md shadow-2xl max-w-xl w-full">
          <h3 className="text-sm md:text-lg font-black text-amber-200 font-serif tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {currentVillage.name.toUpperCase()} JALLIKATTU – SEASON CHAMPION REWARD
          </h3>
        </div>

        {/* 4 3D Reward Cards in Carousel */}
        <div className="relative flex items-center justify-center gap-2 md:gap-4 w-full max-w-3xl my-2">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/80 hover:bg-amber-500 hover:text-black border border-amber-400/50 text-white transition-all shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Row */}
          <div className="flex items-center justify-center gap-2 md:gap-3 overflow-hidden py-2">
            {REWARDS_LIST.map((reward, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <div
                  key={reward.id}
                  onClick={() => {
                    soundManager.playThavilSnap(0.6);
                    setActiveIdx(idx);
                  }}
                  className={`relative rounded-2xl border-2 transition-all cursor-pointer p-3 flex flex-col items-center justify-between shadow-2xl ${
                    isSelected
                      ? 'w-36 md:w-44 h-48 md:h-56 bg-[#2b170e] border-amber-400 scale-105 ring-2 ring-amber-400/50 shadow-amber-500/30'
                      : 'w-28 md:w-32 h-36 md:h-44 bg-black/60 border-amber-500/30 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="text-[9px] font-bold text-amber-300 font-serif uppercase">
                    {reward.category}
                  </div>
                  <div className="text-4xl md:text-5xl my-auto animate-pulse">
                    {reward.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-black text-white font-serif">
                      {reward.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-tamil font-bold">
                      {reward.tamilName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/80 hover:bg-amber-500 hover:text-black border border-amber-400/50 text-white transition-all shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Winner Ribbon matching Image 4 */}
        <div className="bg-[#1b1008]/90 border border-amber-400 px-8 py-1 rounded-full text-xs font-serif font-black tracking-widest text-amber-300 uppercase shadow-2xl">
          WINNER – PARTICIPANT #07
        </div>
      </div>

      {/* ================= 3. BOTTOM BAR matching Image 4 ================= */}
      <div className="relative z-20 flex items-end justify-between gap-2">
        {/* Bottom-Left Action Card */}
        <div className="bg-[#1b120c]/90 border border-amber-500/50 rounded-2xl p-2.5 shadow-xl text-xs space-y-1 max-w-[190px]">
          <div className="flex items-center gap-1.5 text-white font-bold font-serif">
            <span className="w-4 h-4 rounded-full border border-cyan-400 flex items-center justify-center text-[9px] text-cyan-300 font-mono">
              X
            </span>
            <span>GRAB (Hold X)</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-300 font-bold font-serif">
            <span className="w-4 h-4 rounded-full border border-red-400 flex items-center justify-center text-[9px] text-red-300 font-mono">
              B
            </span>
            <span>AVOID</span>
          </div>
          <div className="text-amber-300 text-[10px] font-mono">
            ⏱ Grip Skill ({gripSkillPercent}%)
          </div>
        </div>

        {/* Center CTA to Proceed to Next Arena */}
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            setScreen('world_map');
          }}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 border border-amber-200 font-serif"
        >
          <MapPin className="w-4 h-4" />
          <span>PROCEED TO WORLD MAP (அடுத்த களம்)</span>
        </button>

        {/* Bottom-Right Oval Minimap */}
        <div className="w-24 h-16 md:w-32 md:h-20 rounded-2xl bg-[#120a06]/95 border border-amber-500/60 p-1 shadow-2xl flex items-center justify-center">
          <svg className="w-full h-full" viewBox="-16 -10 32 20">
            <rect x="-14" y="-8" width="28" height="16" rx="7" fill="#2e1910" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="1.5" fill="#22c55e" />
          </svg>
        </div>
      </div>
    </div>
  );
};
