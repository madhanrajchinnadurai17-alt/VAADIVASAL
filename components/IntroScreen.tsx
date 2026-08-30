import React from 'react';
import { Shield, Sparkles, Volume2, VolumeX, ArrowRight, Award, Compass, Zap } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface IntroScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleSound,
}) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-tamil-saffron/40 bg-gradient-to-b from-[#2D1B16] via-[#1a0f0a] to-[#120B09] shadow-2xl p-6 md:p-10 festival-glow">
      {/* Background kolam decorative overlay */}
      <div className="absolute inset-0 kolam-pattern pointer-events-none" />

      {/* Top Bar with Cultural Tag & Sound Toggle */}
      <div className="relative z-10 flex items-center justify-between border-b border-tamil-saffron/20 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/40">
            Pongal Heritage • பொங்கல் திருநாள்
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs text-tamil-sand/80 bg-black/40 rounded border border-white/10">
            Ancient Tamil Sangam Tradition
          </span>
        </div>

        <button
          onClick={onToggleSound}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-tamil-saffron/20 text-tamil-gold border border-tamil-saffron/30 transition-all text-xs font-semibold"
          title="Toggle Sound Effects"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          <span>{isMuted ? 'Muted' : 'Sound ON'}</span>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center my-4 space-y-4">
        {/* Tamil Script Title */}
        <div className="space-y-1">
          <p className="text-tamil-marigold text-sm font-semibold tracking-widest uppercase">
            வீர விளையாட்டு • The Ancient Art of Embracing the Bull
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-tamil-marigold to-tamil-saffron font-display tracking-tight drop-shadow-md">
            வாடிவாசல்
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-tamil-sand tracking-wide">
            JALLIKATTU: VAADIVASAL
          </h2>
        </div>

        {/* Respectful Cultural Context Flavored Card */}
        <div className="max-w-2xl mx-auto bg-black/40 border border-tamil-saffron/30 rounded-xl p-4 text-left shadow-inner space-y-2">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-tamil-terracotta/30 text-tamil-gold border border-tamil-saffron/40 mt-1">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-tamil-gold flex items-center gap-1.5">
                <span>Sacred Bond of Valour & Heritage</span>
                <span className="text-[11px] text-tamil-sand/70 font-normal">(ஏறு தழுவுதல்)</span>
              </h3>
              <p className="text-xs md:text-sm text-tamil-sand/90 leading-relaxed mt-1">
                Celebrated for over 2,000 years in Tamil Nadu, <strong>Eru Thazhuvuthal</strong> is not a combat sport, but a revered test of courage and agility. Tamers embrace the mighty Kangayam bull’s hump (திமில்) with mutual respect—without weapons, harm, or restraint.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Step Quick Mechanics Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2 text-left">
          <div className="bg-[#24140e]/80 border border-amber-500/20 p-3 rounded-lg flex items-start space-x-2.5">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">1. Flank the Bull</div>
              <p className="text-[11px] text-tamil-sand/75 mt-0.5">Use WASD/Arrows to approach the hump from the side before AI tamers.</p>
            </div>
          </div>

          <div className="bg-[#24140e]/80 border border-amber-500/20 p-3 rounded-lg flex items-start space-x-2.5">
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">2. Timing Bar Grip</div>
              <p className="text-[11px] text-tamil-sand/75 mt-0.5">Press <kbd className="px-1 py-0.5 bg-black/50 rounded text-amber-300">SPACE</kbd> or click when indicator hits green zone.</p>
            </div>
          </div>

          <div className="bg-[#24140e]/80 border border-amber-500/20 p-3 rounded-lg flex items-start space-x-2.5">
            <div className="p-1.5 rounded bg-orange-500/10 text-orange-400 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-orange-300">3. 4-Stage Lock</div>
              <p className="text-[11px] text-tamil-sand/75 mt-0.5">Maintain 4 consecutive grips while managing stamina to win glory.</p>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4">
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.8);
              onStartGame();
            }}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-black tracking-wider text-black bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-amber-200"
          >
            <Sparkles className="w-5 h-5 mr-2 text-red-950 animate-spin" style={{ animationDuration: '4s' }} />
            <span>வாடிவாசலில் நுழைக • ENTER THE VAADIVASAL</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-tamil-sand/60 mt-2">
            Interactive Hackathon Vertical Slice • Instant Playable Demo
          </p>
        </div>
      </div>
    </div>
  );
};
