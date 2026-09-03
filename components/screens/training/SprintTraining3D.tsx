import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bull3D } from '../../three/3DModels';
import { useGameStore } from '../../../store/useGameStore';
import { soundManager } from '../../../utils/soundSynthesizer';
import * as THREE from 'three';
import { Zap, ArrowLeft, Sparkles } from 'lucide-react';

// Log Dragging and Striped Milestone Posts Component
const SprintTrackEnvironment3D: React.FC<{ progress: number }> = ({ progress }) => {
  const trackGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!trackGroupRef.current) return;
    trackGroupRef.current.position.z = -(progress / 100) * 30;
  });

  return (
    <group ref={trackGroupRef}>
      {/* Dirt Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 15]}>
        <planeGeometry args={[14, 60]} />
        <meshStandardMaterial color="#c2410c" roughness={0.8} />
      </mesh>

      {/* Heavy Drag Log behind Bull */}
      <group position={[0, -0.4, 2.2]}>
        {/* Wooden Log Cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 2.0, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        {/* Metal Chain connecting log to bull */}
        <mesh position={[0, 0.2, -1.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.2, 6]} />
          <meshStandardMaterial color="#71717a" metalness={0.8} />
        </mesh>
      </group>

      {/* Colored Striped Milestone Distance Markers along side of track */}
      {[0, 10, 20, 30, 40].map((z, idx) => (
        <group key={idx} position={[-4.5, 0, z]}>
          {/* Milestone Base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.6, 1.2, 0.4]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Red Stripe */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.62, 0.3, 0.42]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* Yellow Distance Marker on top */}
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

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
              completeTraining('speed', 8, 'Paddock Log Sprint (கட்டை இழுக்கும் ஓட்டம்)');
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
            <span>PADDOCK LOG SPRINT TRAINING</span>
          </div>
          <div className="text-sm font-black text-amber-300">
            Distance: {Math.round(sprintProgress)}%
          </div>
        </div>
      </div>

      {/* 3D Straight Track Scene with Log and Milestone Posts */}
      <div className="relative z-10 flex-1 my-2 rounded-2xl bg-black/40 border border-amber-500/20 overflow-hidden shadow-2xl flex items-center justify-center">
        <Canvas camera={{ position: [0, 2.5, 5.5], fov: 45 }}>
          <ambientLight intensity={0.9} color="#fff1e6" />
          <directionalLight position={[6, 8, 4]} intensity={1.5} color="#ffedd5" />
          <pointLight position={[0, 2, -2]} intensity={0.8} color="#f59e0b" />
          <fog attach="fog" args={['#29180c', 8, 30]} />

          <SprintTrackEnvironment3D progress={sprintProgress} />
          <Bull3D position={[0, -0.6, 0]} isReleased={true} />
        </Canvas>

        {/* Speedometer overlay */}
        <div className="absolute top-4 right-4 bg-black/70 border border-amber-500/40 rounded-xl px-3 py-1.5 text-center shadow-lg">
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
            <span>Sprint Progress (Milestones)</span>
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
          <span>{isHolding ? 'DRAGGING LOG AT SPEED...' : 'PRESS & HOLD TO SPRINT'}</span>
        </button>
      </div>
    </div>
  );
};
