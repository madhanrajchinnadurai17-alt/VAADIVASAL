import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bull3D } from '../../three/3DModels';
import { useGameStore } from '../../../store/useGameStore';
import { soundManager } from '../../../utils/soundSynthesizer';
import { Activity, ArrowLeft, ArrowUp, ArrowDown, ArrowRight, Sparkles } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const DIRECTIONS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export const ReactionTraining3D: React.FC = () => {
  const { completeTraining, setScreen } = useGameStore();

  const [targetDir, setTargetDir] = useState<Direction>('UP');
  const [successCount, setSuccessCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const targetCount = 4;

  const nextPrompt = useCallback(() => {
    const random = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    setTargetDir(random);
  }, []);

  useEffect(() => {
    nextPrompt();
  }, [nextPrompt]);

  const handleDirectionTap = (dir: Direction) => {
    if (dir === targetDir) {
      soundManager.playGripSuccess(successCount + 1);
      const next = successCount + 1;
      setSuccessCount(next);
      setFeedback('⚡ துரிதம்! FAST REFLEX!');

      if (next >= targetCount) {
        soundManager.playVictoryFanfare();
        setTimeout(() => {
          completeTraining('temperament', 8, 'Human Reaction Reflex (ஆள் மிரட்சி)');
        }, 600);
      } else {
        nextPrompt();
      }
    } else {
      soundManager.playGripMiss();
      setFeedback('⚠️ WRONG DIRECTION! RETRY...');
      nextPrompt();
    }
    setTimeout(() => setFeedback(null), 800);
  };

  // Keyboard arrow listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleDirectionTap('UP');
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleDirectionTap('DOWN');
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleDirectionTap('LEFT');
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleDirectionTap('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#2d1218] via-[#1a0a0f] to-[#120B09] text-white overflow-hidden select-none">
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-rose-500/20 pb-3">
        <button
          onClick={() => setScreen('bull_care')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-rose-500/30 text-xs text-rose-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Training</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            <span>REACTION & REFLEX TRAINING</span>
          </div>
          <div className="text-sm font-black text-rose-300">
            Completed: {successCount} / {targetCount}
          </div>
        </div>
      </div>

      {/* 3D Decoy Reaction Arena */}
      <div className="relative z-10 flex-1 my-2 rounded-2xl bg-black/40 border border-rose-500/20 overflow-hidden shadow-2xl flex items-center justify-center">
        <Canvas camera={{ position: [0, 2.8, 5.2], fov: 45 }}>
          <ambientLight intensity={0.9} color="#ffe4e6" />
          <directionalLight position={[5, 8, 4]} intensity={1.5} color="#fff1f2" />
          <pointLight position={[0, 2, -2]} intensity={0.8} color="#f43f5e" />
          <fog attach="fog" args={['#240a10', 8, 25]} />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#881337" roughness={0.8} />
          </mesh>

          <Bull3D position={[0, -0.6, 0]} isReleased={true} />
        </Canvas>

        {/* Prompt Direction Card Overlay */}
        <div className="absolute top-4 bg-black/80 border-2 border-rose-400 rounded-2xl px-6 py-3 text-center shadow-2xl animate-pulse">
          <div className="text-[10px] font-bold text-gray-300 uppercase">MATCH PROMPT</div>
          <div className="text-2xl md:text-3xl font-black text-rose-400 font-display">
            {targetDir === 'UP' && '▲ TAP UP'}
            {targetDir === 'DOWN' && '▼ TAP DOWN'}
            {targetDir === 'LEFT' && '◀ TAP LEFT'}
            {targetDir === 'RIGHT' && '▶ TAP RIGHT'}
          </div>
        </div>

        {feedback && (
          <div className="absolute bottom-4 px-4 py-1.5 rounded-full bg-rose-500/30 border border-rose-400 text-rose-200 text-xs font-black animate-bounce shadow-xl">
            {feedback}
          </div>
        )}
      </div>

      {/* Bottom Directional Arrow Tap Buttons */}
      <div className="relative z-20 grid grid-cols-3 gap-2 max-w-xs mx-auto w-full">
        <div />
        <button
          onClick={() => handleDirectionTap('UP')}
          className="p-3.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400 rounded-2xl flex justify-center text-white active:scale-90 shadow-xl transition-all"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onClick={() => handleDirectionTap('LEFT')}
          className="p-3.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400 rounded-2xl flex justify-center text-white active:scale-90 shadow-xl transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleDirectionTap('DOWN')}
          className="p-3.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400 rounded-2xl flex justify-center text-white active:scale-90 shadow-xl transition-all"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleDirectionTap('RIGHT')}
          className="p-3.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400 rounded-2xl flex justify-center text-white active:scale-90 shadow-xl transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
