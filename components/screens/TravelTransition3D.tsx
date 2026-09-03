import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import * as THREE from 'three';

// 3D Countryside Highway with Bullock Cart, Passing Bus, and Temple Gopuram matching Image 1
const ScenicTravelHighway3D: React.FC = () => {
  const roadRef = useRef<THREE.Group>(null);
  const busRef = useRef<THREE.Group>(null);
  const cartRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (roadRef.current) {
      roadRef.current.position.z += delta * 6;
      if (roadRef.current.position.z > 12) {
        roadRef.current.position.z = 0;
      }
    }
    if (busRef.current) {
      busRef.current.position.z -= delta * 12;
      if (busRef.current.position.z < -20) {
        busRef.current.position.z = 25;
      }
    }
    if (cartRef.current) {
      const time = state.clock.getElapsedTime();
      cartRef.current.position.y = Math.sin(time * 6) * 0.04;
    }
  });

  return (
    <group>
      {/* 1. Scrolling Road, Fields, and Trees */}
      <group ref={roadRef}>
        {/* Dirt Country Road */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <planeGeometry args={[9, 50]} />
          <meshStandardMaterial color="#c27803" roughness={0.9} />
        </mesh>

        {/* Green Paddy Fields on Left & Right */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, -0.62, 0]}>
          <planeGeometry args={[14, 50]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[11, -0.62, 0]}>
          <planeGeometry args={[14, 50]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>

        {/* Coconut Palms along Highway */}
        {[-16, -8, 0, 8, 16].map((z, idx) => (
          <group key={idx}>
            <mesh position={[-5.5, 2.0, z]}>
              <cylinderGeometry args={[0.15, 0.25, 4.2, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[-5.5, 4.4, z]}>
              <sphereGeometry args={[1.4, 8, 8]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>

            <mesh position={[5.5, 2.0, z]}>
              <cylinderGeometry args={[0.15, 0.25, 4.2, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[5.5, 4.4, z]}>
              <sphereGeometry args={[1.4, 8, 8]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. Decorated Traditional Bullock Cart with Bull & Flags matching Image 1 */}
      <group ref={cartRef} position={[-2.2, -0.6, 0]}>
        {/* Wooden Cart Base */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.8, 0.4, 3.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Spoked Wooden Wheels */}
        <mesh position={[-1.0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.15, 16]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[1.0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.15, 16]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>

        {/* Bull riding on Cart */}
        <group position={[0, 0.7, 0]} scale={[0.8, 0.8, 0.8]}>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.0, 1.0, 2.0]} />
            <meshStandardMaterial color="#29150d" />
          </mesh>
          {/* Horns */}
          <mesh position={[-0.3, 1.5, -0.8]}>
            <cylinderGeometry args={[0.04, 0.1, 0.8, 6]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
          <mesh position={[0.3, 1.5, -0.8]}>
            <cylinderGeometry args={[0.04, 0.1, 0.8, 6]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
        </group>

        {/* Origin Village Flags on Cart */}
        <mesh position={[-0.8, 1.6, -1.2]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 6]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[-0.8, 2.2, -1.0]}>
          <planeGeometry args={[0.6, 0.35]} />
          <meshStandardMaterial color="#f97316" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3. Passing Village Transport Bus matching Image 1 */}
      <group ref={busRef} position={[2.4, -0.6, 15]}>
        {/* Bus Body */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[2.0, 2.2, 5.5]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
        {/* Bus Windshield */}
        <mesh position={[0, 1.8, -2.76]}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Destination Board ("ALANGANALLUR BOUND") */}
        <mesh position={[0, 2.6, -2.78]}>
          <boxGeometry args={[1.8, 0.35, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 4. Majestic Temple Gopuram Tower in distant Horizon */}
      <group position={[0, 3.5, -28]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 4, 4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[8, 3, 3.5]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0, 6.5, 0]}>
          <coneGeometry args={[2.5, 3, 4]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

export const TravelTransition3D: React.FC = () => {
  const { currentVillage, destinationVillage, resetToArena } = useGameStore();
  const dest = destinationVillage || currentVillage;

  useEffect(() => {
    soundManager.startFestiveDrums(130);
    soundManager.playKombuHorn();

    const timer = setTimeout(() => {
      resetToArena();
    }, 3200);

    return () => clearTimeout(timer);
  }, [resetToArena]);

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#2e170c] via-[#1a0f0a] to-[#120B09] text-white overflow-hidden select-none">
      {/* 3D Scenic Countryside Road Canvas matching Image 1 */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2.5, 7.5], fov: 48 }}>
          <ambientLight intensity={0.9} color="#fff1e6" />
          <directionalLight position={[6, 9, 4]} intensity={1.6} color="#fed7aa" />
          <fog attach="fog" args={['#2e170c', 10, 35]} />
          <ScenicTravelHighway3D />
        </Canvas>
      </div>

      {/* Destination Arrival Announcement Overlay matching Image 1 */}
      <div className="relative z-10 my-auto bg-[#1b100a]/90 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-5 text-center shadow-2xl max-w-md w-full space-y-2.5 animate-fadeIn">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400 flex items-center justify-center text-3xl">
          🚍
        </div>

        <div>
          <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
            TRAVELING ALONG CIRCUIT • பயணம்
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-serif mt-1">
            {dest.name} ({dest.tamilName})
          </h2>
          <p className="text-xs text-amber-200 font-serif italic mt-0.5">
            {dest.district} District Circuit
          </p>
        </div>

        {/* Prize Preview */}
        <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-serif">Festival Grand Prize:</span>
          <span className="font-bold text-amber-300 flex items-center gap-1 font-serif text-sm">
            <span>{dest.prize.icon}</span>
            <span>{dest.prize.name}</span>
          </span>
        </div>

        <div className="text-[11px] text-amber-300 font-mono animate-pulse">
          Arriving at {dest.name} Vaadivasal Gates...
        </div>
      </div>
    </div>
  );
};
