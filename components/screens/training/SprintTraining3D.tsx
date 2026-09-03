import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bull3D } from '../../three/3DModels';
import { useGameStore } from '../../../store/useGameStore';
import { soundManager } from '../../../utils/soundSynthesizer';
import { Zap, ArrowLeft, Sparkles } from 'lucide-react';

export const SprintTraining3D: React.FC = () => {
  const { completeTraining, setScreen } = useGameStore();

  const [sprintProgress, setSprintProgress] = useState(0);
  const [speedMeter, setSpeedMeter] = useState(30);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isHolding) {
        setSpeedMeter((prev) => Math.min(100, prev + 4));
        setSprintProgress((prev) => {
          const next = prev + (speedMeter > 85 ? 1.5 : (speedMeter > 40 ? 3.5 : 1.0));
          if (next >= 100) {
            clearInterval(interval);
            soundManager.playVictoryFanfare();
            setTimeout(() => {
              completeTraining('speed', 8, 'Paddock Sprint Track (வேக ஓட்டம்)');
            }, 600);
            return 100;
          }
          return next;
        });
      } else {
        setSpeedMeter((prev) => Math.max(10, prev - 3));
      }
    }, 60);

    return () => clearInterval(interval);
  }, [isHolding, speedMeter, completeTraining]);

  const handlePointerDown = () => {
    setIsHolding(true);
    soundManager.playThavilSnap(0.6);
  };

  const handlePointerUp = () => {
    setIsHolding(false);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#2e1c0c] via-[#1a0f0a] to-[#120B09] text-white overflow-hidden select-none">
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-amber-500/20 pb-3">
        <button
          onClick={() => setScreen('bull_care')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-xs text-amber-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Training</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>PADDOCK SPRINT TRAINING</span>
          </div>
          <div className="text-sm font-black text-amber-300">
            Distance: {Math.round(sprintProgress)}%
          </div>
        </div>
      </div>

      {/* 3D Straight Track Scene */}
      <div className="relative z-10 flex-1 my-2 rounded-2xl bg-black/40 border border-amber-500/20 overflow-hidden shadow-2xl flex items-center justify-center">
        <Canvas camera={{ position: [0, 2.5, 5.5], fov: 45 }}>
          <ambientLight intensity={0.9} color="#fff1e6" />
          <directionalLight position={[6, 8, 4]} intensity={1.5} color="#ffedd5" />
          <pointLight position={[0, 2, -2]} intensity={0.8} color="#f59e0b" />
          <fog attach="fog" args={['#29180c', 8, 25]} />

          {/* Dirt Ground Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
            <planeGeometry args={[14, 40]} />
            <meshStandardMaterial color="#c2410c" roughness={0.8} />
          </mesh>

          <Bull3D position={[0, -0.6, 0]} isReleased={true} />
        </Canvas>

        {/* Speedometer overlay */}
        <div className="absolute top-4 right-4 bg-black/70 border border-amber-500/40 rounded-xl px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-300">VELOCITY</div>
          <div className="text-base font-black text-amber-400 font-mono">
            {Math.round(speedMeter * 0.8)} KM/H
          </div>
        </div>
      </div>

      {/* Bottom Acceleration Controls */}
      <div className="relative z-20 space-y-3 max-w-lg mx-auto w-full">
        {/* Track Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-amber-300">
            <span>Sprint Progress</span>
            <span>{Math.round(sprintProgress)}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-amber-500/40">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-100"
              style={{ width: `${sprintProgress}%` }}
            />
          </div>
        </div>

        {/* Hold to Accelerate CTA */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`w-full py-4 rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-2 border ${
            isHolding
              ? 'bg-amber-400 text-black border-white scale-[0.98]'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isHolding ? 'ACCELERATING SPRINT...' : 'PRESS & HOLD TO SPRINT'}</span>
        </button>
      </div>
    </div>
  );
};
