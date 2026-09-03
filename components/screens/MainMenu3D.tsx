import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Sparkles, Utensils, MapPin, Volume2, VolumeX, Moon, Sun, Trophy, Award } from 'lucide-react';

export const MainMenu3D: React.FC = () => {
  const {
    setScreen,
    resetToArena,
    soundMuted,
    toggleMute,
    currentVillage,
    isNightJallikattu,
    toggleNightMode,
    currentReputation,
    careStats,
  } = useGameStore();

  const handleStartArena = () => {
    soundManager.playThavilSnap(0.8);
    resetToArena();
  };

  const handleStartTrainBull = () => {
    soundManager.playThavilSnap(0.8);
    setScreen('bull_selection');
  };

  const handleOpenWorldMap = () => {
    soundManager.playThavilSnap(0.8);
    setScreen('world_map');
  };

  const handleOpenTrophyHall = () => {
    soundManager.playThavilSnap(0.8);
    setScreen('trophy_hall');
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-between p-4 md:p-6 bg-gradient-to-b from-[#2D1B16] via-[#1a0f0a] to-[#120B09] text-center overflow-hidden">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Bar with Location, Meta Stats, and Sound */}
      <div className="relative z-10 w-full max-w-3xl flex justify-between items-center border-b border-white/10 pb-3">
        {/* Current Circuit & Map */}
        <button
          onClick={handleOpenWorldMap}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentVillage.name} ({currentVillage.tamilName})</span>
        </button>

        {/* Top-Right Meta Stats & Controls */}
        <div className="flex items-center space-x-2">
          {/* Reputation & Bull Care Readout */}
          <div className="hidden sm:flex items-center space-x-2 text-[11px] bg-black/60 px-3 py-1 rounded-xl border border-white/10">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Trophy className="w-3 h-3" />
              <span>Rep: {currentReputation}</span>
            </span>
            <span className="text-gray-500">|</span>
            <span className="font-bold text-emerald-400">
              Care: {Math.round((careStats.hunger + careStats.hydration + careStats.health) / 3)}%
            </span>
          </div>

          {/* Trophy Hall Quick Button */}
          <button
            onClick={handleOpenTrophyHall}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30 text-xs font-bold transition-all"
            title="Trophy Hall"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hall</span>
          </button>

          {/* Day / Night Toggle */}
          <button
            onClick={toggleNightMode}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
              isNightJallikattu
                ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
                : 'bg-amber-950/80 border-amber-400 text-amber-200'
            }`}
          >
            {isNightJallikattu ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/15 text-xs text-gray-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <div className="relative z-10 space-y-1 my-auto max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display">
          வாடிவாசல் 3D
        </h1>
        <p className="text-xs text-gray-300 max-w-md mx-auto">
          Choose your heritage path: raise a champion Kangayam bull or enter the arena as Participant #07.
        </p>

        {/* Dual Visual Preview Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-left">
          {/* Option 1: Train the Bull (Owner + Bull Preview) */}
          <div className="bg-black/75 border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl group">
            {/* Visual Preview Banner */}
            <div className="h-20 rounded-xl bg-gradient-to-r from-amber-950 to-stone-900 border border-amber-500/30 flex items-center justify-around p-2 mb-3">
              <span className="text-3xl">👨‍🌾</span>
              <span className="text-xs text-amber-300 font-bold font-mono">PADDOCK CARE</span>
              <span className="text-3xl">🐂</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white font-display">
                காளை வளர்ப்பு • BULL OWNER
              </h3>
              <p className="text-[11px] text-gray-300">
                Paddock diet, pond endurance, log sprint track, flag reaction, and growth tiers.
              </p>
            </div>

            <button
              onClick={handleStartTrainBull}
              className="mt-3 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>BULL TURNTABLE & CARE</span>
            </button>
          </div>

          {/* Option 2: Enter the Arena (Tamer #07 + Charging Bull Preview) */}
          <div className="bg-black/75 border-2 border-tamil-saffron/50 hover:border-tamil-saffron rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xl group">
            {/* Visual Preview Banner */}
            <div className="h-20 rounded-xl bg-gradient-to-r from-orange-950 to-stone-900 border border-tamil-saffron/40 flex items-center justify-around p-2 mb-3">
              <span className="text-3xl">🏃‍♂️</span>
              <span className="text-xs text-orange-300 font-bold font-mono">VAADIVASAL GATE</span>
              <span className="text-3xl">⚡</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white font-display">
                வாடிவாசல் களம் • ENTER ARENA
              </h3>
              <p className="text-[11px] text-gray-300">
                Enter as #{useGameStore.getState().players.find(p=>p.isUser)?.bib || '07'}, flank charging bull, and hold for 10s honorably!
              </p>
            </div>

            <button
              onClick={handleStartArena}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-tamil-saffron to-amber-400 text-black font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENTER 3D ARENA</span>
            </button>
          </div>
        </div>

        {/* World Map CTA Link */}
        <div className="pt-2">
          <button
            onClick={handleOpenWorldMap}
            className="text-xs text-amber-300 hover:text-white font-bold underline underline-offset-4 flex items-center justify-center mx-auto gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Explore 5-Village Championship World Map (உலக வரைபடம்)</span>
          </button>
        </div>
      </div>

      {/* Footer Cultural Notice */}
      <div className="relative z-10 text-[11px] text-gray-400">
        Non-violent cultural heritage simulation • Zero animal harm • Pure skill & timing
      </div>
    </div>
  );
};
