import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bull3D } from '../../three/3DModels';
import { useGameStore } from '../../../store/useGameStore';
import { soundManager } from '../../../utils/soundSynthesizer';
import { Waves, ArrowLeft, Sparkles } from 'lucide-react';

// Ancient Temple Tank (Theppakulam) stone steps and backdrop
const TempleTankBackdrop3D: React.FC = () => {
  return (
    <group>
      {/* Shallow Water Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0369a1" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Carved Stone Steps (Theppakulam Mandapam) */}
      {[-1, -2, -3].map((step, idx) => (
        <mesh key={idx} position={[0, -0.6 + idx * 0.25, -6 - idx * 1.5]}>
          <boxGeometry args={[26, 0.5, 1.6]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
      ))}

      {/* Majestic Temple Gopuram Tower in Distance matching Image 4 */}
      <group position={[0, 4, -15]}>
        {/* Tier 1 Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8, 3, 4]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
        </mesh>
        {/* Tier 2 */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6.5, 2.5, 3.5]} />
          <meshStandardMaterial color="#d6d3d1" roughness={0.9} />
        </mesh>
        {/* Tier 3 */}
        <mesh position={[0, 4.5, 0]}>
          <boxGeometry args={[5, 2, 3]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
        </mesh>
        {/* Tier 4 Top Kalasams */}
        <mesh position={[0, 6.2, 0]}>
          <coneGeometry args={[1.8, 2, 4]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
      </group>

      {/* Palm Trees along tank borders */}
      {[-8, 8].map((x, idx) => (
        <group key={idx} position={[x, 0, -8]}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 5, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      ))}

      {/* Trainer wading alongside bull in water holding rope */}
      <group position={[1.4, -0.6, 0]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 1.4, 8]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.18, 10, 10]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Rope to Bull */}
        <mesh position={[-0.7, 0.6, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 1.5, 6]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      </group>
    </group>
  );
};

export const PondTraining3D: React.FC = () => {
  const { completeTraining, setScreen } = useGameStore();

  const [needlePos, setNeedlePos] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const targetCount = 4;
  const needleDirection = useRef(1);

  // Oscillating needle loop
  useEffect(() => {
    let animId: number;
    let pos = 0;
    const animate = () => {
      pos += needleDirection.current * 0.025;
      if (pos >= 1) {
        pos = 1;
        needleDirection.current = -1;
      } else if (pos <= -1) {
        pos = -1;
        needleDirection.current = 1;
      }
      setNeedlePos(pos);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleRhythmTap = () => {
    const isHit = Math.abs(needlePos) < 0.28;
    if (isHit) {
      soundManager.playGripSuccess(successCount + 1);
      const next = successCount + 1;
      setSuccessCount(next);
      setFeedback('✨ நன்று! PERFECT RHYTHM!');

      if (next >= targetCount) {
        soundManager.playVictoryFanfare();
        setTimeout(() => {
          completeTraining('stamina', 8, 'Temple Tank Water Resistance (குளத்துப் பயிற்சி)');
        }, 600);
      }
    } else {
      soundManager.playGripMiss();
      setFeedback('⚠️ MISSED! RETRY...');
    }
    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#1a2d3d] via-[#121c24] to-[#0a1117] text-white overflow-hidden select-none">
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <button
          onClick={() => setScreen('bull_care')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-cyan-500/30 text-xs text-cyan-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Training</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1 font-serif">
            <Waves className="w-3.5 h-3.5" />
            <span>TEMPLE TANK WATER ENDURANCE</span>
          </div>
          <div className="text-sm font-black text-cyan-200 font-mono">
            Rhythm Lock: {successCount} / {targetCount}
          </div>
        </div>
      </div>

      {/* 3D Temple Tank Scene matching Image 4 */}
      <div className="relative z-10 flex-1 my-2 rounded-2xl bg-black/40 border border-cyan-500/20 overflow-hidden shadow-2xl flex items-center justify-center">
        <Canvas camera={{ position: [0, 2.5, 5.5], fov: 45 }}>
          <ambientLight intensity={0.9} color="#cffafe" />
          <directionalLight position={[4, 8, 4]} intensity={1.6} color="#fed7aa" />
          <pointLight position={[0, 2, -2]} intensity={0.9} color="#38bdf8" />
          <fog attach="fog" args={['#082f49', 8, 25]} />

          <TempleTankBackdrop3D />
          <Bull3D position={[0, -0.6, 0]} isReleased={true} />
        </Canvas>

        {feedback && (
          <div className="absolute top-4 px-4 py-1.5 rounded-full bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-black animate-bounce shadow-xl font-serif">
            {feedback}
          </div>
        )}
      </div>

      {/* Bottom Timing Rhythm Bar Control */}
      <div className="relative z-20 space-y-3 max-w-lg mx-auto w-full">
        {/* Timing Bar */}
        <div className="relative w-full h-8 rounded-full bg-zinc-900 border-2 border-cyan-500/50 flex items-center justify-center overflow-hidden shadow-xl">
          {/* Target Green Sweet Spot Zone */}
          <div className="absolute w-28 h-full bg-emerald-500/80 border-x-2 border-emerald-300 rounded" />

          {/* Oscillating Needle Indicator */}
          <div
            className="absolute w-2.5 h-full bg-amber-400 shadow-[0_0_10px_#f59e0b] rounded-full"
            style={{ transform: `translateX(${needlePos * 130}px)` }}
          />
        </div>

        {/* Tap Action CTA */}
        <button
          onClick={handleRhythmTap}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-black text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-2 border border-cyan-300 font-serif"
        >
          <Sparkles className="w-4 h-4" />
          <span>TAP RHYTHM LOCK (SPACE / CLICK)</span>
        </button>
      </div>
    </div>
  );
};
