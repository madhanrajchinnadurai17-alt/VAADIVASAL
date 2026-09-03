import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Sparkles, Utensils, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export const MainMenu3D: React.FC = () => {
  const { setScreen, resetToArena, soundMuted, toggleMute } = useGameStore();

  const handleStartArena = () => {
    soundManager.playThavilSnap(0.8);
    resetToArena();
  };

  const handleStartTrainBull = () => {
    soundManager.playThavilSnap(0.8);
    setScreen('bull_dashboard');
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#2D1B16] via-[#1a0f0a] to-[#120B09] text-center overflow-hidden">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Sound Bar */}
      <div className="relative z-10 w-full max-w-2xl flex justify-between items-center border-b border-white/10 pb-3">
        <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
          Avaniyapuram Circuit • Round 1
        </span>
        <button
          onClick={toggleMute}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-black/40 border border-white/15 text-xs text-gray-300 hover:text-white"
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{soundMuted ? 'Muted' : 'Sound ON'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="relative z-10 space-y-2 my-auto max-w-xl">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-tamil-saffron font-display">
          வாடிவாசல் 3D
        </h1>
        <p className="text-xs md:text-sm text-gray-300 max-w-md mx-auto">
          Choose your heritage path: raise and train a champion Kangayam bull or enter the arena as Participant #07.
        </p>

        {/* Dual Paths Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {/* Path 1: Train the Bull */}
          <div className="bg-black/60 border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 text-left flex flex-col justify-between transition-all shadow-xl">
            <div className="space-y-1.5">
              <span className="text-2xl">🌾</span>
              <h3 className="text-base font-black text-white font-display">
                காளை வளர்ப்பு
              </h3>
              <p className="text-xs text-amber-200/80 font-bold">
                PATH 1: TRAIN THE BULL
              </p>
              <p className="text-[11px] text-gray-300">
                Feed traditional millet, river baths, pond water training, and grow a champion Kangayam.
              </p>
            </div>
            <button
              onClick={handleStartTrainBull}
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>FARM DASHBOARD</span>
            </button>
          </div>

          {/* Path 2: Enter the Arena */}
          <div className="bg-black/60 border-2 border-tamil-saffron/50 hover:border-tamil-saffron rounded-2xl p-4 text-left flex flex-col justify-between transition-all shadow-xl">
            <div className="space-y-1.5">
              <span className="text-2xl">🏟️</span>
              <h3 className="text-base font-black text-white font-display">
                வாடிவாசல் களம்
              </h3>
              <p className="text-xs text-amber-200/80 font-bold">
                PATH 2: ENTER THE ARENA
              </p>
              <p className="text-[11px] text-gray-300">
                Enter the 3D arena as Participant #07, flank the charging bull, and hold for 10 seconds!
              </p>
            </div>
            <button
              onClick={handleStartArena}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-tamil-saffron to-amber-400 text-black font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENTER 3D ARENA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Cultural Notice */}
      <div className="relative z-10 text-[11px] text-gray-400">
        Non-violent cultural heritage simulation • Zero animal harm • Pure skill & timing
      </div>
    </div>
  );
};
