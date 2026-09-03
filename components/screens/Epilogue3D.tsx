import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import {
  Compass,
  Trophy,
  BarChart3,
  RotateCcw,
  Sparkles,
  Home,
  X,
  Lock,
  Heart,
  Award,
} from 'lucide-react';

export const Epilogue3D: React.FC = () => {
  const {
    setScreen,
    resetToArena,
    score,
    currentReputation,
    bullName,
    showComingSoonModal,
    setShowComingSoonModal,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'menu' | 'stats' | 'credits'>('menu');

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#1f110b] via-[#140b07] to-[#0c0604] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-20" />

      {/* Top Banner announcing unlocked replay modes */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest font-display">
            NEW MODE UNLOCKED: &quot;TRAIN THE LEGACY&quot; &amp; &quot;DISTRICT LEAGUE&quot;
          </span>
        </div>

        {/* Quick Unlocked Mode Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.6);
              setShowComingSoonModal('Train the Legacy (காளையினப் பெருக்கம்)');
            }}
            className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[10px] font-black text-amber-300 flex items-center gap-1 transition-all"
          >
            <span>🧬</span>
            <span>Train the Legacy</span>
          </button>
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.6);
              setShowComingSoonModal('District League (மாவட்ட லீக் தொடர்)');
            }}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[10px] font-black text-cyan-300 flex items-center gap-1 transition-all"
          >
            <span>🏟️</span>
            <span>District League</span>
          </button>
        </div>
      </div>

      {/* Center Layout: Left Calm Village Story Narrative + Right 6-Item Side Menu */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-3 items-center">
        {/* Left: Calm Sunset Village Narrative Card */}
        <div className="bg-black/60 border-2 border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Visual Icons: Bull with calf + elder + temple */}
            <div className="flex items-center justify-around text-4xl p-3 rounded-xl bg-gradient-to-r from-orange-950 to-stone-950 border border-amber-500/20">
              <span title="Championship Bull">🐂</span>
              <span title="Young Calf">🐮</span>
              <span title="Village Elder & Children">👨‍👧‍👦</span>
              <span title="Temple Tower">🛕</span>
            </div>

            <h3 className="text-base font-black text-amber-300 font-display">
              அன்பும் வீரமும் நிலைக்கும் நிலம் • THE EPILOGUE
            </h3>
            <p className="text-xs text-gray-200 leading-relaxed">
              As the Pongal festival sunsets across Madurai and Sivagangai, {bullName} grazes peacefully beside its spirited young calf. The village elders share stories of honor, timing, and respectful co-existence with native livestock.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 font-bold text-center">
            &quot;வாடிவாசல் என்பது வீரம் மட்டுமல்ல; மண்ணோடும் உயிர்களோடும் இணைந்த தமிழரின் பண்பாட்டுப் பெருமை.&quot;
          </div>
        </div>

        {/* Right: Exact 6-Item Side Menu Panel */}
        <div className="bg-black/70 border-2 border-amber-400/60 rounded-2xl p-4 shadow-2xl space-y-2">
          <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-2">
            SELECT EPILOGUE DESTINATION
          </h4>

          <div className="space-y-1.5">
            {/* 1. Continue Free Roam */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.7);
                setScreen('world_map');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-left text-xs font-bold text-white flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Continue Free Roam (சுதந்திரப் பயணம்)</span>
              </span>
              <span className="text-amber-300">➔</span>
            </button>

            {/* 2. Visit Trophy Hall */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.7);
                setScreen('trophy_hall');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-left text-xs font-bold text-white flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Visit Trophy Hall (வெற்றி மாடம்)</span>
              </span>
              <span className="text-amber-300">➔</span>
            </button>

            {/* 3. View Statistics */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.7);
                setActiveTab(activeTab === 'stats' ? 'menu' : 'stats');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-left text-xs font-bold text-white flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>View Statistics (விளையாட்டுப் புள்ளிவிவரம்)</span>
              </span>
              <span className="text-amber-300">{activeTab === 'stats' ? '▲' : '▼'}</span>
            </button>

            {/* Stats Sub-view */}
            {activeTab === 'stats' && (
              <div className="p-3 bg-black/80 rounded-xl border border-white/10 text-xs space-y-1 text-gray-300 animate-fadeIn">
                <div className="flex justify-between">
                  <span>Championship Final Score:</span>
                  <strong className="text-amber-300">{score} PTS</strong>
                </div>
                <div className="flex justify-between">
                  <span>Reputation Level:</span>
                  <strong className="text-amber-300">{currentReputation} / 100</strong>
                </div>
                <div className="flex justify-between">
                  <span>Villages Conquered:</span>
                  <strong className="text-emerald-300">5 of 5 Arenas</strong>
                </div>
              </div>
            )}

            {/* 4. Start New Adventure */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                resetToArena();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-left text-xs font-bold text-white flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>Start New Adventure (புதிய பயணம்)</span>
              </span>
              <span className="text-amber-300">➔</span>
            </button>

            {/* 5. Credits */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.7);
                setActiveTab(activeTab === 'credits' ? 'menu' : 'credits');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-left text-xs font-bold text-white flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Credits (பங்களிப்பாளர்கள்)</span>
              </span>
              <span className="text-amber-300">{activeTab === 'credits' ? '▲' : '▼'}</span>
            </button>

            {/* Credits Sub-view */}
            {activeTab === 'credits' && (
              <div className="p-3 bg-black/80 rounded-xl border border-white/10 text-xs space-y-1 text-gray-300 animate-fadeIn">
                <p><strong>Developed by:</strong> Team VAADIVASAL</p>
                <p><strong>Cultural Advisory:</strong> Traditional Tamil Nadu Heritage Records</p>
                <p><strong>Sound Synthesis:</strong> Procedural Web Audio API</p>
                <p><strong>3D Engine:</strong> Three.js + React Three Fiber</p>
              </div>
            )}

            {/* 6. Return to Main Menu */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                setScreen('main_menu');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-tamil-saffron text-black text-left text-xs font-black flex items-center justify-between shadow-lg active:scale-95 transition-all"
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Return to Main Menu (முகப்புப் பக்கம்)</span>
              </span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom-Right Message */}
      <div className="relative z-20 text-right text-xs font-mono text-amber-300/90 border-t border-white/10 pt-2">
        THANK YOU FOR PLAYING! THE JOURNEY LIVES ON. • நன்றி!
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#1a0f0a] border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-3 shadow-2xl text-white text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400 flex items-center justify-center text-3xl">
              🚀
            </div>
            <h3 className="text-base font-black text-amber-300">
              {showComingSoonModal}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              This post-campaign championship league mode is in active development for the next seasonal update!
            </p>
            <button
              onClick={() => setShowComingSoonModal(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs shadow-md"
            >
              GOT IT!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
