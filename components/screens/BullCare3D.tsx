import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { ArrowLeft, Utensils, Droplets, Moon, Waves, Zap, Activity, Check, Sparkles } from 'lucide-react';

export const BullCare3D: React.FC = () => {
  const {
    bullName,
    careStats,
    feedBull,
    waterBull,
    restBull,
    setScreen,
  } = useGameStore();

  const [careFeedback, setCareFeedback] = useState<string | null>(null);

  const handleFeed = () => {
    soundManager.playThavilSnap(0.7);
    feedBull();
    setCareFeedback('🌾 தீவனம் ஊட்டப்பட்டது! (+25 Food)');
    setTimeout(() => setCareFeedback(null), 1800);
  };

  const handleWater = () => {
    soundManager.playGripSuccess(1);
    waterBull();
    setCareFeedback('💧 ஊற்றுத் தண்ணீர் வழங்கப்பட்டது! (+25 Water)');
    setTimeout(() => setCareFeedback(null), 1800);
  };

  const handleRest = () => {
    soundManager.playThavilBass(0.6);
    restBull();
    setCareFeedback('💤 கொட்டிலில் ஓய்வு எடுத்தது! (+30 Rest)');
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

      {/* Center Section: Care Cards + Training Mini-Game Launchers */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {/* Left Column: 3 Vital Care Actions */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3.5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Vital Care (உடல் நலம்)</span>
            </h3>
            <p className="text-[11px] text-gray-300 mb-3">
              Top up Food, Water, and Rest before training to maximize stat gains!
            </p>

            {/* 1. Food Bar & Action */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-amber-300">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Food & Fodder (தீவனம்)</span>
                </span>
                <span className="font-mono text-white">{careStats.food}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-200" style={{ width: `${careStats.food}%` }} />
              </div>
              <button
                onClick={handleFeed}
                className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold active:scale-95 transition-all"
              >
                + Feed Millet & Grass
              </button>
            </div>

            {/* 2. Water Bar & Action */}
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Water Trough (தண்ணீர்)</span>
                </span>
                <span className="font-mono text-white">{careStats.water}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-cyan-400 rounded-full transition-all duration-200" style={{ width: `${careStats.water}%` }} />
              </div>
              <button
                onClick={handleWater}
                className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold active:scale-95 transition-all"
              >
                + Refill Fresh Water
              </button>
            </div>

            {/* 3. Rest Bar & Action */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="flex items-center gap-1 text-purple-300">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Paddock Rest (ஓய்வு)</span>
                </span>
                <span className="font-mono text-white">{careStats.rest}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-purple-400 rounded-full transition-all duration-200" style={{ width: `${careStats.rest}%` }} />
              </div>
              <button
                onClick={handleRest}
                className="w-full py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold active:scale-95 transition-all"
              >
                + Rest in Shaded Paddock
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

            {/* 2. Sprint Track Card */}
            <div
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('training_sprint');
              }}
              className="p-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl border border-amber-500/30 group-hover:scale-105 transition-transform">
                  🏃
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-display">
                    Paddock Sprint Track (வேக ஓட்டம்)
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

            {/* 3. Reaction Reflex Card */}
            <div
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('training_reaction');
              }}
              className="p-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border-2 border-rose-500/40 hover:border-rose-400 cursor-pointer transition-all shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xl border border-rose-500/30 group-hover:scale-105 transition-transform">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-display">
                    Human Reaction Reflex (ஆள் மிரட்சி)
                  </h4>
                  <p className="text-[10px] text-rose-200 font-bold">
                    Target: +Temperament & Reflex • Direction Tap
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
