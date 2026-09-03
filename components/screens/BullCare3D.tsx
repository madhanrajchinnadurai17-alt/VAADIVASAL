import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { ArrowLeft, Sparkles, ChevronRight, Waves, Zap, Activity } from 'lucide-react';

export const BullCare3D: React.FC = () => {
  const {
    bullName,
    careStats,
    feedBullFodder,
    feedQualityFodder,
    feedFoodGrains,
    giveFreshWater,
    setScreen,
  } = useGameStore();

  const [selectedItem, setSelectedItem] = useState<string>('Quality Fodder');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = (item: string, actionFn: () => void, feedbackText: string) => {
    setSelectedItem(item);
    soundManager.playThavilSnap(0.7);
    actionFn();
    setFeedback(feedbackText);
    setTimeout(() => setFeedback(null), 1800);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#2a170e] via-[#1a0f09] to-[#0f0704] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-10" />

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-2.5">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.5);
            setScreen('bull_selection');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bull Overview</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            VILLAGE COWSHED &amp; PADDOCK
          </div>
          <div className="text-sm font-black text-amber-300 font-serif">
            {bullName}
          </div>
        </div>
      </div>

      {feedback && (
        <div className="relative z-30 my-1 p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold text-center animate-pulse shadow-lg font-serif">
          {feedback}
        </div>
      )}

      {/* Main Cowshed Center Composition matching Image 3 */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 my-2 items-center">
        {/* Left: Quick Training Launchers */}
        <div className="space-y-2 order-3 md:order-1">
          <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1 font-serif">
            TRAINING GROUNDS (பயிற்சிக் களம்)
          </h4>

          {/* Pond Training */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.8);
              setScreen('training_pond');
            }}
            className="w-full p-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-cyan-500/40 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🌊</span>
              <div>
                <div className="text-xs font-black text-white font-serif">Pond Resistance</div>
                <div className="text-[9px] text-cyan-300">+Stamina • Temple Tank</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Sprint Training */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.8);
              setScreen('training_sprint');
            }}
            className="w-full p-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-amber-500/40 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🪵</span>
              <div>
                <div className="text-xs font-black text-white font-serif">Log Sprint Track</div>
                <div className="text-[9px] text-amber-300">+Speed • Heavy Log</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Reaction Training */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.8);
              setScreen('training_reaction');
            }}
            className="w-full p-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-rose-500/40 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🚩</span>
              <div>
                <div className="text-xs font-black text-white font-serif">Flag Reaction Pen</div>
                <div className="text-[9px] text-rose-300">+Aggression &amp; Reflex</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Center: Cowshed Scene Illustration & Bottom-Center Stat Card matching Image 3 */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 order-1 md:order-2">
          {/* Barn Cowshed Hero Graphics */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-tr from-[#381a0e] via-[#1f0f08] to-[#120804] border-2 border-amber-500/40 p-2 shadow-2xl flex flex-col items-center justify-center">
            <span className="text-5xl md:text-6xl animate-pulse">🐂</span>
            <span className="text-[10px] text-amber-300 font-serif mt-1">🌾 Straw Paddock</span>
          </div>

          {/* Bottom-Center Stat Card matching Image 3 */}
          <div className="w-full max-w-[220px] bg-[#1a110c]/90 border-2 border-amber-500/60 rounded-xl p-3 shadow-2xl space-y-2 text-left backdrop-blur-md">
            {/* Hunger */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-amber-200 mb-0.5">
                <span className="font-serif">Hunger</span>
                <span className="font-mono">{careStats.hunger}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${careStats.hunger}%` }}
                />
              </div>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-cyan-200 mb-0.5">
                <span className="font-serif">Hydration</span>
                <span className="font-mono">{careStats.hydration}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${careStats.hydration}%` }}
                />
              </div>
            </div>

            {/* Health */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-orange-200 mb-0.5">
                <span className="font-serif">Health</span>
                <span className="font-mono">{careStats.health}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-300"
                  style={{ width: `${careStats.health}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vertical Floating Selectable Menu matching Image 3 */}
        <div className="order-2 md:order-3">
          <div className="bg-[#1a110c]/90 border-2 border-amber-500/60 rounded-2xl p-2.5 shadow-2xl space-y-1.5 backdrop-blur-md">
            {/* Bull Fodder */}
            <button
              onClick={() => handleAction('Bull Fodder', feedBullFodder, '🌾 Bull Fodder fed! (+30 Hunger)')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                selectedItem === 'Bull Fodder'
                  ? 'bg-amber-500/25 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-black/40 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <span className="text-2xl">🌾</span>
              <div>
                <div className="text-xs font-black text-amber-200 font-serif">Bull Fodder</div>
                <div className="text-[9px] text-gray-400">+30 Hunger</div>
              </div>
            </button>

            {/* Quality Fodder (Highlighted) */}
            <button
              onClick={() => handleAction('Quality Fodder', feedQualityFodder, '✨ Quality Fodder fed! (+25 Hunger, +15 Health)')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                selectedItem === 'Quality Fodder'
                  ? 'bg-amber-500/25 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-black/40 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <span className="text-2xl">🫘</span>
              <div>
                <div className="text-xs font-black text-amber-200 font-serif">Quality Fodder</div>
                <div className="text-[9px] text-emerald-300">+25 Hunger, +15 Health</div>
              </div>
            </button>

            {/* Food Grains */}
            <button
              onClick={() => handleAction('Food Grains', feedFoodGrains, '🥣 Food Grains fed! (+15 Hunger)')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                selectedItem === 'Food Grains'
                  ? 'bg-amber-500/25 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-black/40 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <span className="text-2xl">🥣</span>
              <div>
                <div className="text-xs font-black text-amber-200 font-serif">Food Grains</div>
                <div className="text-[9px] text-gray-400">+15 Hunger</div>
              </div>
            </button>

            {/* Fresh Water */}
            <button
              onClick={() => handleAction('Fresh Water', giveFreshWater, '💧 Fresh Water given! (+35 Hydration, +5 Health)')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                selectedItem === 'Fresh Water'
                  ? 'bg-amber-500/25 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-black/40 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <span className="text-2xl">💧</span>
              <div>
                <div className="text-xs font-black text-amber-200 font-serif">Fresh Water</div>
                <div className="text-[9px] text-cyan-300">+35 Hydration, +5 Health</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cultural Footer */}
      <div className="relative z-20 text-center text-[10px] text-zinc-400 font-sans border-t border-white/10 pt-2">
        Healthy nutrition and fresh spring water maximize the bull&apos;s strength and endurance in the arena!
      </div>
    </div>
  );
};
