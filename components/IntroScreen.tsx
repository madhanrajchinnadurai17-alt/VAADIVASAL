import React from 'react';
import { Shield, Sparkles, Volume2, VolumeX, ArrowRight, Award, Compass, Zap, MapPin, Activity, Utensils } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';
import { VillageEvent } from '../game/villageSystem';
import { BullStats } from '../game/bullCareSystem';

interface IntroScreenProps {
  onStartArena: () => void;
  onOpenBullDashboard: () => void;
  onOpenVillageMap: () => void;
  onOpenTamerProfile: () => void;
  currentVillage: VillageEvent;
  bull: BullStats;
  coins: number;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartArena,
  onOpenBullDashboard,
  onOpenVillageMap,
  onOpenTamerProfile,
  currentVillage,
  bull,
  coins,
  isMuted,
  onToggleSound,
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-tamil-saffron/40 bg-gradient-to-b from-[#2D1B16] via-[#1a0f0a] to-[#120B09] shadow-2xl p-4 md:p-8 festival-glow">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Bar with Village Circuit Location, Coins & Sound Toggle */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-tamil-saffron/20 pb-3 mb-5 gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenVillageMap}
            className="flex items-center space-x-1 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/40 hover:bg-tamil-saffron/30 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentVillage.tamilName} • {currentVillage.name}</span>
          </button>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs text-tamil-sand/80 bg-black/40 rounded border border-white/10">
            Prize: {currentVillage.prize.icon} {currentVillage.prize.name}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-lg bg-black/50 border border-tamil-gold/30 text-tamil-gold text-xs font-bold">
            🪙 {coins} Coins
          </div>
          <button
            onClick={onToggleSound}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 transition-all text-xs font-semibold"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
            <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative z-10 text-center my-3 space-y-3">
        <div className="space-y-1">
          <p className="text-tamil-marigold text-xs md:text-sm font-semibold tracking-widest uppercase">
            JALLIKATTU: THE BULL&apos;S JOURNEY • மாட்டின் பயணம்
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-tamil-marigold to-tamil-saffron font-display tracking-tight drop-shadow-md">
            வாடிவாசல்
          </h1>
          <h2 className="text-xl md:text-2xl font-extrabold text-tamil-sand tracking-wide">
            ANCIENT TAMIL HERITAGE SIMULATION
          </h2>
        </div>

        {/* Current Bull & Tamer Summary Card */}
        <div className="max-w-xl mx-auto bg-black/50 border border-tamil-saffron/30 rounded-xl p-3.5 text-left flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🐂</span>
            <div>
              <div className="text-xs text-tamil-sand/70">Trained Bull:</div>
              <div className="text-sm font-bold text-amber-300 font-display">{bull.name}</div>
              <div className="text-[11px] text-tamil-sand/80">
                {bull.growthStage} • {bull.personality} • Energy: {bull.energy}%
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenTamerProfile}
              className="px-3 py-1.5 rounded-lg bg-tamil-saffron/15 hover:bg-tamil-saffron/30 text-tamil-gold border border-tamil-saffron/40 text-xs font-bold transition-all"
            >
              Tamer #07 Profile
            </button>
          </div>
        </div>

        {/* TWO PRIMARY PATHS (Option 1: Train Bull vs Option 2: Enter Arena) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-3">
          {/* PATH 1: TRAIN THE BULL */}
          <div className="bg-gradient-to-b from-[#2a1710] to-[#1a0f0a] border-2 border-amber-500/40 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-amber-400 transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 text-xl border border-amber-500/30">
                  🌾
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-300 px-2 py-0.5 bg-black/40 rounded">
                  Path 1: Bull Owner
                </span>
              </div>
              <h3 className="text-lg font-black text-white font-display">
                காளை வளர்ப்பு • TRAIN THE BULL
              </h3>
              <p className="text-xs text-tamil-sand/80 leading-relaxed">
                Feed traditional millet, give river baths, and conduct interactive pond water resistance & agility decoy training.
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                onOpenBullDashboard();
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs md:text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <Utensils className="w-4 h-4" />
              <span>பண்ணை & பயிற்சி • OPEN FARM</span>
            </button>
          </div>

          {/* PATH 2: ENTER THE ARENA */}
          <div className="bg-gradient-to-b from-[#2a1710] to-[#1a0f0a] border-2 border-tamil-saffron/40 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-tamil-saffron transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-tamil-saffron/20 text-tamil-gold text-xl border border-tamil-saffron/30">
                  🏟️
                </span>
                <span className="text-[10px] uppercase font-bold text-tamil-gold px-2 py-0.5 bg-black/40 rounded">
                  Path 2: Arena Tamer #07
                </span>
              </div>
              <h3 className="text-lg font-black text-white font-display">
                வாடிவாசல் களம் • ENTER THE ARENA
              </h3>
              <p className="text-xs text-tamil-sand/80 leading-relaxed">
                Enter the {currentVillage.name} arena! Match sprint speed, flank the hump, and lock 4-stage grips for the grand prize.
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                onStartArena();
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-tamil-saffron to-tamil-marigold hover:from-orange-500 hover:to-amber-400 text-black font-black text-xs md:text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5 border border-amber-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>களத்தில் இறங்குக • ENTER ARENA</span>
            </button>
          </div>
        </div>

        {/* Circuit Map CTA */}
        <div className="pt-2">
          <button
            onClick={onOpenVillageMap}
            className="text-xs text-tamil-gold hover:text-white underline underline-offset-4 font-semibold flex items-center justify-center mx-auto gap-1"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View Tamil Nadu Championship Village Circuit ({currentVillage.name})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
