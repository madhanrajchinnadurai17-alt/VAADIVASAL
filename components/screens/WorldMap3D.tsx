import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { TAMIL_VILLAGES, VillageEvent } from '../../game/villageSystem';
import { soundManager } from '../../utils/soundSynthesizer';
import { MapPin, Lock, CheckCircle, ArrowRight, ArrowLeft, Moon, Sun, Trophy, Bus } from 'lucide-react';

export const WorldMap3D: React.FC = () => {
  const {
    unlockedVillageIndex,
    currentVillage,
    isNightJallikattu,
    toggleNightMode,
    travelToVillage,
    setScreen,
  } = useGameStore();

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#22130d] via-[#170c08] to-[#0e0705] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-3">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.5);
            setScreen('main_menu');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Day / Night Toggle */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.6);
              toggleNightMode();
            }}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isNightJallikattu
                ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
                : 'bg-amber-950/80 border-amber-400 text-amber-200'
            }`}
          >
            {isNightJallikattu ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{isNightJallikattu ? 'Night Jallikattu' : 'Day Jallikattu'}</span>
          </button>
        </div>
      </div>

      {/* World Map Title & Circuit Description */}
      <div className="relative z-10 text-center my-1 space-y-1">
        <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display">
          தமிழ்நாடு ஜல்லிக்கட்டுப் பயணம் • WORLD JOURNEY
        </h2>
        <p className="text-xs text-gray-300 max-w-lg mx-auto">
          Travel across Tamil Nadu&apos;s 5 legendary arenas from Avaniyapuram to the State Grand Championship!
        </p>
      </div>

      {/* 5-Village Interactive Roadmap Nodes */}
      <div className="relative z-10 my-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[340px] pr-1">
        {TAMIL_VILLAGES.map((v, idx) => {
          const isUnlocked = idx <= unlockedVillageIndex;
          const isCurrent = v.id === currentVillage.id;

          return (
            <div
              key={v.id}
              className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400'
                  : isUnlocked
                  ? 'bg-black/60 border-amber-500/40 hover:border-amber-400'
                  : 'bg-black/40 border-white/10 opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    STAGE 0{idx + 1} • {v.district}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                <h3 className="text-sm font-black text-white font-display mt-1">
                  {v.name} ({v.tamilName})
                </h3>
                <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">
                  {v.description}
                </p>

                {/* Grand Prize Card */}
                <div className="mt-2 p-2 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-gray-400 text-[10px]">Grand Prize:</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                    <span>{v.prize.icon}</span>
                    <span>{v.prize.name}</span>
                  </span>
                </div>
              </div>

              {/* Travel Button */}
              <div className="mt-3 pt-2 border-t border-white/10">
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      soundManager.playThavilSnap(0.8);
                      travelToVillage(v);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>பயணம் • TRAVEL HERE</span>
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-gray-500 font-bold py-1">
                    🔒 Win previous arena to unlock
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status */}
      <div className="relative z-20 pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/10">
        <span>Current Arena: <strong className="text-amber-300">{currentVillage.name} ({currentVillage.tamilName})</strong></span>
        <span>Mode: <strong className={isNightJallikattu ? 'text-indigo-300' : 'text-amber-300'}>{isNightJallikattu ? 'Night Jallikattu' : 'Day Jallikattu'}</strong></span>
      </div>
    </div>
  );
};
