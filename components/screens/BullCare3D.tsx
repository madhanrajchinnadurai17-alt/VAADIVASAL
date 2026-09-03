import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { ArrowLeft, Utensils, Droplets, Heart, Sparkles, Wheat, ShieldCheck } from 'lucide-react';

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

  const [careFeedback, setCareFeedback] = useState<string | null>(null);

  const handleAction = (fn: () => void, text: string) => {
    soundManager.playThavilSnap(0.7);
    fn();
    setCareFeedback(text);
    setTimeout(() => setCareFeedback(null), 1800);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#25150f] via-[#1a0f0a] to-[#120B09] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-3">
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
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            DAILY PADDOCK CARE
          </div>
          <div className="text-sm font-black text-amber-300">
            {bullName}
          </div>
        </div>
      </div>

      {careFeedback && (
        <div className="relative z-30 my-1 p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold text-center animate-pulse shadow-lg">
          {careFeedback}
        </div>
      )}

      {/* Center Section: 3 Stats & 4 Items + Training Mini-Game Launchers */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {/* Left Column: 3 Vital Stats + 4 Selectable Items */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Care Vital Stats (உடல் நலம்)</span>
            </h3>

            {/* 3 Tracked Stats */}
            <div className="space-y-2 mb-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
              {/* Hunger */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Utensils className="w-3 h-3" />
                    <span>Hunger (பசி தணிவு)</span>
                  </span>
                  <span className="font-mono text-white">{careStats.hunger}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-200" style={{ width: `${careStats.hunger}%` }} />
                </div>
              </div>

              {/* Hydration */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Droplets className="w-3 h-3" />
                    <span>Hydration (நீர்ச்சத்து)</span>
                  </span>
                  <span className="font-mono text-white">{careStats.hydration}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full transition-all duration-200" style={{ width: `${careStats.hydration}%` }} />
                </div>
              </div>

              {/* Health */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-0.5">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Heart className="w-3 h-3" />
                    <span>Health (உடல் வலிமை)</span>
                  </span>
                  <span className="font-mono text-white">{careStats.health}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-200" style={{ width: `${careStats.health}%` }} />
                </div>
              </div>
            </div>

            {/* 4 Selectable Care Items */}
            <h4 className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
              Select Feed Item (தீவனம் தேர்வு)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {/* Item 1: Bull Fodder */}
              <button
                onClick={() => handleAction(feedBullFodder, '🌾 Bull Fodder fed! (+30 Hunger)')}
                className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-left active:scale-95 transition-all"
              >
                <div className="text-lg">🌾</div>
                <div className="text-xs font-black text-amber-300">Bull Fodder</div>
                <div className="text-[9px] text-gray-300">+30 Hunger</div>
              </button>

              {/* Item 2: Quality Fodder */}
              <button
                onClick={() => handleAction(feedQualityFodder, '✨ Quality Fodder fed! (+25 Hunger, +15 Health)')}
                className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-left active:scale-95 transition-all"
              >
                <div className="text-lg">⭐</div>
                <div className="text-xs font-black text-emerald-300">Quality Fodder</div>
                <div className="text-[9px] text-gray-300">+25 Hunger, +15 Health</div>
              </button>

              {/* Item 3: Food Grains */}
              <button
                onClick={() => handleAction(feedFoodGrains, '🥣 Food Grains fed! (+15 Hunger)')}
                className="p-2.5 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/40 text-left active:scale-95 transition-all"
              >
                <div className="text-lg">🥣</div>
                <div className="text-xs font-black text-yellow-300">Food Grains</div>
                <div className="text-[9px] text-gray-300">+15 Hunger</div>
              </button>

              {/* Item 4: Fresh Water */}
              <button
                onClick={() => handleAction(giveFreshWater, '💧 Fresh Water given! (+35 Hydration, +5 Health)')}
                className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-left active:scale-95 transition-all"
              >
                <div className="text-lg">💧</div>
                <div className="text-xs font-black text-cyan-300">Fresh Water</div>
                <div className="text-[9px] text-gray-300">+35 Hydration, +5 Health</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Training Mini-Games */}
        <div className="space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Select Training Routine (பயிற்சி முறை)
            </h3>

            {/* 1. Pond Water Training Card */}
            <div
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('training_pond');
              }}
              className="p-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border-2 border-cyan-500/40 hover:border-cyan-400 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl border border-cyan-500/30 group-hover:scale-105 transition-transform">
                  🌊
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-display">
                    Pond Water Resistance (குளத்துப் பயிற்சி)
                  </h4>
                  <p className="text-[10px] text-cyan-200 font-bold">
                    Target: +Stamina • Rhythm Timing
                  </p>
                </div>
              </div>
              <span className="text-xs text-cyan-300 font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
                START ➔
              </span>
            </div>

            {/* 2. Sprint Track Card (with Log Dragging) */}
            <div
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('training_sprint');
              }}
              className="p-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl border border-amber-500/30 group-hover:scale-105 transition-transform">
                  🪵
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-display">
                    Paddock Log Sprint (கட்டை இழுக்கும் ஓட்டம்)
                  </h4>
                  <p className="text-[10px] text-amber-200 font-bold">
                    Target: +Speed • Acceleration Bursts
                  </p>
                </div>
              </div>
              <span className="text-xs text-amber-300 font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30">
                START ➔
              </span>
            </div>

            {/* 3. Reaction Reflex Card (with Flag Waving) */}
            <div
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('training_reaction');
              }}
              className="p-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border-2 border-rose-500/40 hover:border-rose-400 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xl border border-rose-500/30 group-hover:scale-105 transition-transform">
                  🚩
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-display">
                    Flag Reaction Pen (கொடி எதிர்வினை)
                  </h4>
                  <p className="text-[10px] text-rose-200 font-bold">
                    Target: +Aggression & Reflex • Direction Tap
                  </p>
                </div>
              </div>
              <span className="text-xs text-rose-300 font-bold px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30">
                START ➔
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
