import React, { useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import * as THREE from 'three';
import { Bus, MapPin, Sparkles } from 'lucide-react';

// Lightweight 3D road with coconut palm silhouettes
const TravelRoad3D: React.FC = () => {
  const roadRef = React.useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!roadRef.current) return;
    roadRef.current.position.z += delta * 8;
    if (roadRef.current.position.z > 10) {
      roadRef.current.position.z = 0;
    }
  });

  return (
    <group ref={roadRef}>
      {/* Red Mud Road Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[8, 50]} />
        <meshStandardMaterial color="#c2410c" roughness={0.9} />
      </mesh>

      {/* Green Paddy Fields along side */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, -0.65, 0]}>
        <planeGeometry args={[14, 50]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.65, 0]}>
        <planeGeometry args={[14, 50]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </mesh>

      {/* Palm Trees along horizon */}
      {[-16, -8, 0, 8, 16].map((z, idx) => (
        <group key={idx}>
          {/* Left Palm */}
          <mesh position={[-4.5, 2.0, z]}>
            <cylinderGeometry args={[0.15, 0.25, 4.0, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[-4.5, 4.2, z]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>

          {/* Right Palm */}
          <mesh position={[4.5, 2.0, z]}>
            <cylinderGeometry args={[0.15, 0.25, 4.0, 6]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[4.5, 4.2, z]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const TravelTransition3D: React.FC = () => {
  const { currentVillage, setScreen, resetToArena } = useGameStore();

  useEffect(() => {
    soundManager.startFestiveDrums(130);
    soundManager.playKombuHorn();

    const timer = setTimeout(() => {
      resetToArena();
    }, 2800);

    return () => clearTimeout(timer);
  }, [resetToArena]);

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#2e170c] via-[#1a0f0a] to-[#120B09] text-white overflow-hidden select-none">
      {/* 3D Road Animation Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2.2, 6], fov: 50 }}>
          <ambientLight intensity={0.9} color="#fff1e6" />
          <directionalLight position={[5, 8, 4]} intensity={1.4} color="#fed7aa" />
          <fog attach="fog" args={['#2e170c', 8, 30]} />
          <TravelRoad3D />
        </Canvas>
      </div>

      {/* Destination Village Arrival Card Overlay */}
      <div className="relative z-10 my-auto bg-black/80 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-6 text-center shadow-2xl max-w-md w-full space-y-3 animate-fadeIn">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400 flex items-center justify-center text-3xl">
          🚍
        </div>

        <div>
          <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
            TRAVELING • பயணம்
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-display mt-1">
            {currentVillage.name} ({currentVillage.tamilName})
          </h2>
          <p className="text-xs text-amber-200 font-bold mt-0.5">
            {currentVillage.district} Circuit
          </p>
          <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
            {currentVillage.description}
          </p>
        </div>

        {/* Prize Preview */}
        <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
          <span className="text-gray-400">Festival Grand Prize:</span>
          <span className="font-bold text-amber-300 flex items-center gap-1 text-sm">
            <span>{currentVillage.prize.icon}</span>
            <span>{currentVillage.prize.name}</span>
          </span>
        </div>

        <div className="text-[11px] text-amber-400/80 font-mono animate-pulse">
          Entering Vaadivasal arena gates...
        </div>
      </div>
    </div>
  );
};
