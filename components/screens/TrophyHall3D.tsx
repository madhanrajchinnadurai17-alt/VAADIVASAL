import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Award, Trophy, ArrowLeft, Star, Crown, MapPin, Sparkles } from 'lucide-react';

export const TrophyHall3D: React.FC = () => {
  const {
    teamName,
    currentReputation,
    championshipProgress,
    rewardInventory,
    setScreen,
  } = useGameStore();

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#1c120c] via-[#140b07] to-[#0c0704] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-15" />

      {/* Top Header & Legacy Meter */}
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

        {/* Championship Legacy Meter */}
        <div className="flex items-center space-x-2 bg-black/70 px-3.5 py-1.5 rounded-2xl border border-amber-400/40">
          <Trophy className="w-4 h-4 text-amber-400" />
          <div className="text-right">
            <div className="text-[9px] uppercase font-bold text-gray-400">THE CHAMPIONSHIP LEGACY</div>
            <div className="text-xs font-black text-amber-300 font-mono">{championshipProgress}% COMPLETED</div>
          </div>
        </div>
      </div>

      {/* Center Museum Gallery Layout */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 my-2 items-center">
        {/* Left: Framed Poster Art */}
        <div className="bg-black/60 border-2 border-amber-500/40 rounded-2xl p-4 text-center shadow-2xl space-y-2 flex flex-col items-center justify-center h-full max-h-72">
          <div className="w-28 h-36 rounded-xl bg-gradient-to-b from-amber-900 to-black border-2 border-amber-400 p-2 flex flex-col items-center justify-between shadow-inner">
            <span className="text-[9px] font-black text-amber-300 uppercase">VAADIVASAL 3D</span>
            <span className="text-4xl animate-pulse">🐂</span>
            <span className="text-[8px] text-gray-300">HISTORIC TAMIL HERITAGE</span>
          </div>
          <div className="text-[11px] font-bold text-amber-300">
            Framed Festival Archive Poster
          </div>
        </div>

        {/* Center: Trophy Shelf & Nameplate */}
        <div className="bg-black/70 border-2 border-amber-400 rounded-2xl p-5 text-center shadow-2xl space-y-3">
          <div className="flex justify-center items-center gap-3">
            <span className="text-3xl">🏺</span>
            <span className="text-5xl animate-bounce">🏆</span>
            <span className="text-3xl">🪔</span>
          </div>

          {/* Golden Engraved Nameplate */}
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400 p-3 rounded-xl shadow-lg space-y-1">
            <div className="text-[10px] uppercase font-black text-amber-300 tracking-widest flex items-center justify-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              <span>GRAND FINAL CHAMPION</span>
            </div>
            <div className="text-lg font-black text-white font-display">
              TEAM {teamName}
            </div>
            <div className="text-xs text-amber-300 font-mono">
              TAMER PRIZE: PARTICIPANT #07
            </div>
          </div>

          <div className="text-[11px] text-gray-300">
            Reputation Score: <strong className="text-amber-400">{currentReputation} PTS</strong>
          </div>
        </div>

        {/* Right: Village Elders & Community Honors */}
        <div className="bg-black/60 border-2 border-amber-500/40 rounded-2xl p-4 text-center shadow-2xl space-y-3 flex flex-col items-center justify-center h-full max-h-72">
          <div className="flex justify-center gap-2 text-3xl">
            <span>👴🏽</span>
            <span>🙏🏽</span>
            <span>👵🏽</span>
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Village Elders&apos; Blessing
            </h4>
            <div className="text-xs text-amber-200 font-tamil font-bold mt-0.5">
              ஊர்ப் பெரியவர்களின் ஆசி
            </div>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
              Respected elders offer namaskar in honor of discipline, courage, and non-violent bull-embracing sport.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Nav CTA */}
      <div className="relative z-20 pt-2 flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            setScreen('world_map');
          }}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-tamil-saffron text-black font-black text-xs md:text-sm shadow-xl flex items-center justify-center space-x-2"
        >
          <MapPin className="w-4 h-4" />
          <span>VIEW WORLD CIRCUIT MAP</span>
        </button>

        <button
          onClick={() => {
            soundManager.playThavilSnap(0.8);
            setScreen('epilogue');
          }}
          className="py-3 px-5 rounded-xl bg-black/60 hover:bg-black border border-white/20 text-xs font-bold text-gray-300 hover:text-white"
        >
          View Epilogue ➔
        </button>
      </div>
    </div>
  );
};
