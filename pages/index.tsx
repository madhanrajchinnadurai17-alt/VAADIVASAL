import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { IntroScreen } from '../components/IntroScreen';
import { ResultModal } from '../components/ResultModal';
import { GameResultData } from '../game/scenes/TamingScene';
import { soundManager } from '../utils/soundSynthesizer';
import { Info, ShieldCheck, Flag } from 'lucide-react';

// Dynamic client-side import for Phaser game container (SSR disabled)
const DynamicGameContainer = dynamic(
  () => import('../components/GameContainer').then((mod) => mod.GameContainer),
  { ssr: false }
);

type GameState = 'intro' | 'playing' | 'result';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [gameResult, setGameResult] = useState<GameResultData | null>(null);
  const [gameSessionId, setGameSessionId] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);

  const handleStartGame = () => {
    setGameSessionId((prev) => prev + 1);
    setGameState('playing');
    setGameResult(null);
  };

  const handleGameFinished = (result: GameResultData) => {
    setGameResult(result);
    setGameState('result');
  };

  // Loops back to Step 1 (Village Intro Screen)
  const handlePlayAgain = () => {
    soundManager.stopFestiveDrums();
    setGameState('intro');
    setGameResult(null);
  };

  const handleExitToMenu = () => {
    soundManager.stopFestiveDrums();
    setGameState('intro');
    setGameResult(null);
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <Head>
        <title>வாடிவாசல் | VAADIVASAL — Ancient Tamil Heritage Bull-Embracing Simulation</title>
        <meta name="description" content="Playable cultural heritage simulation of Eru Thazhuvuthal (Jallikattu) with dynamic proximity angle selection and timing-based hump taming." />
      </Head>

      <main className="min-h-screen bg-tamil-night text-tamil-sand flex flex-col justify-between p-3 md:p-6 selection:bg-tamil-saffron selection:text-black">
        {/* Header Bar */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-3 px-4 rounded-xl bg-black/40 border border-tamil-saffron/30 backdrop-blur-md mb-4 md:mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl md:text-3xl">🐂</span>
            <div>
              <h1 className="text-base md:text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-tamil-gold to-tamil-saffron font-display">
                VAADIVASAL • வாடிவாசல்
              </h1>
              <p className="text-[10px] md:text-xs text-tamil-sand/70">
                Eru Thazhuvuthal (ஏறு தழுவுதல்) • Cultural Heritage Simulation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPitchModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-tamil-saffron/15 hover:bg-tamil-saffron/30 text-tamil-gold border border-tamil-saffron/40 text-xs font-bold transition-all shadow-sm"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Cultural & Design Vision</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center w-full max-w-5xl mx-auto">
          {gameState === 'intro' && (
            <IntroScreen
              onStartGame={handleStartGame}
              isMuted={isMuted}
              onToggleSound={handleToggleSound}
            />
          )}

          {gameState === 'playing' && (
            <DynamicGameContainer
              key={gameSessionId}
              onGameFinished={handleGameFinished}
              onExitToMenu={handleExitToMenu}
            />
          )}

          {gameState === 'result' && gameResult && (
            <>
              {/* Keep canvas mounted in background while displaying result overlay */}
              <DynamicGameContainer
                key={gameSessionId}
                onGameFinished={handleGameFinished}
                onExitToMenu={handleExitToMenu}
              />
              <ResultModal result={gameResult} onPlayAgain={handlePlayAgain} />
            </>
          )}
        </div>

        {/* Cultural & Hackathon Footer */}
        <footer className="w-full max-w-5xl mx-auto mt-4 md:mt-6 pt-3 border-t border-tamil-saffron/20 flex flex-col sm:flex-row items-center justify-between text-xs text-tamil-sand/60 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Non-violent cultural heritage simulation. Zero animal harm, no health bars or combat mechanics.</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>Core Novelty: <strong>Dynamic Proximity & Angle Selection</strong></span>
          </div>
        </footer>

        {/* Hackathon Pitch / Judge Info Modal */}
        {showPitchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-2xl border-2 border-tamil-saffron/60 bg-[#1f120d] p-6 text-left shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-tamil-saffron/30 pb-3">
                <div className="flex items-center space-x-2">
                  <Flag className="w-5 h-5 text-tamil-gold" />
                  <h3 className="text-lg font-bold text-tamil-gold font-display">
                    Cultural Framing & Design Vision
                  </h3>
                </div>
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-black/50 hover:bg-tamil-saffron/30 text-tamil-sand"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3 text-xs md:text-sm text-tamil-sand/90 leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-tamil-gold block mb-1">1. Respectful Cultural Simulation (ஏறு தழுவுதல்)</strong>
                  <p>
                    Recreated as an authentic test of agility, courage, and mutual respect between human and animal. Framing throughout is skill, honor, and timing — never combat or cruelty.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-emerald-400 block mb-1">2. Core Gameplay Innovation: Proximity & Angle Selection</strong>
                  <p>
                    Participants actively flank the bull&apos;s trajectory in a sandy arena. Scoring evaluates four continuous parameters: Distance, Timing, Position relative to the hump, and Approach Angle.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-cyan-400 block mb-1">3. Self-Contained Offline Architecture</strong>
                  <p>
                    Built with Next.js Pages Router, Phaser 3 client-only dynamic import, TypeScript, Tailwind CSS, Web Audio API procedural sound synthesis (Thavil, Kombu, crowd roar), and canvas procedural vector textures. Zero external network calls.
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-tamil-saffron/20">
                  <strong className="text-amber-400 block mb-1">4. Phase 2 Roadmap</strong>
                  <p>
                    Post-hackathon expansion plans: Bull care & indigenous breed preservation, career village progression, multiplayer arena sync, and customizable traditional attire.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="px-5 py-2 rounded-lg bg-tamil-saffron text-black font-bold text-xs hover:bg-tamil-gold transition-colors"
                >
                  Back to Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
