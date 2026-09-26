import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bull3D } from '../three/3DModels';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ArrowLeft, Heart, ShieldCheck, Sun } from 'lucide-react';

// 3D Rural Tamil Village Backdrop with Temple Gopuram, Thatched Huts, and Sugarcane
const VillageTempleBackdrop3D: React.FC = () => {
  return (
    <group>
      {/* Earthen Village Ground with Kolam Pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial color="#c27803" roughness={0.85} />
      </mesh>

      {/* Sacred Floor Kolam Drawing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]}>
        <ringGeometry args={[2.5, 2.7, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]}>
        <ringGeometry args={[1.2, 1.35, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Dravidian Temple Gopuram Silhouette in the Horizon */}
      <group position={[0, 4.0, -14]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[9, 3.5, 4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.8, 0]} castShadow>
          <boxGeometry args={[7, 2.8, 3.5]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
        <mesh position={[0, 5.0, 0]} castShadow>
          <boxGeometry args={[5.2, 2.2, 3]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        {/* Brass Kalasams at the Peak */}
        {[-1.5, 0, 1.5].map((x, i) => (
          <group key={i} position={[x, 6.8, 0]}>
            <mesh>
              <coneGeometry args={[0.25, 0.7, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Village Thatched Huts (கூரை வீடு) on Sides */}
      {[-8, 8].map((x, i) => (
        <group key={i} position={[x, 0, -4]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
          {/* Mud Walls */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[4.5, 1.8, 3.5]} />
            <meshStandardMaterial color="#92400e" roughness={0.9} />
          </mesh>
          {/* Thatched Palm Roof */}
          <mesh position={[0, 2.3, 0]} castShadow>
            <coneGeometry args={[3.4, 1.6, 4]} />
            <meshStandardMaterial color="#b45309" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Harvest Sugarcane Stalks (கரும்பு) & Brass Pongal Pot */}
      <group position={[-2.2, -0.6, -1.5]}>
        {/* Sugarcane Stalks */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 1.5, 0]} rotation={[0, 0, (i - 1) * 0.08]}>
            <cylinderGeometry args={[0.04, 0.05, 3.2, 8]} />
            <meshStandardMaterial color="#4d164d" roughness={0.4} />
          </mesh>
        ))}
        {/* Earthen Clay Pongal Pot with Overflowing Milk Foam */}
        <mesh position={[0, 0.35, 0.4]} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.72, 0.4]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};

export const VillageBlessing3D: React.FC = () => {
  const { currentVillage, setScreen, resetToArena, bullName } = useGameStore();

  const [ritualStage, setRitualStage] = useState<number>(0);
  const [blessingMessage, setBlessingMessage] = useState<string>(
    'The Kangayam bull stands before the village temple for the Mattu Pongal ritual.'
  );

  useEffect(() => {
    soundManager.playTempleBell();
  }, []);

  const handleApplyTilak = () => {
    soundManager.playTempleBell(659.25);
    setRitualStage(1);
    setBlessingMessage(
      '✨ Sacred Vibhuti and Kumkum applied to the cranium and horn tips. The bull is revered as deity and kin.'
    );
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#dc2626', '#fef08a'],
    });
  };

  const handleAdornGarland = () => {
    soundManager.playThavilSnap(0.8);
    soundManager.playTempleBell(783.99);
    setRitualStage(2);
    setBlessingMessage(
      '🌼 Fragrant Sevvanthi (Marigold) garland and brass neck bell adorned. Auspicious festival rhythms begin!'
    );
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#ea580c', '#facc15', '#ffffff'],
    });
  };

  const handleOfferSugarcane = () => {
    soundManager.playBullSnort();
    soundManager.playTempleBell(587.33);
    setRitualStage(3);
    setBlessingMessage(
      '🌾 Sweet sugarcane and green fodder offered with devotion. The bull is strong, calm, and honored!'
    );
  };

  const handleProceedToVaadivasal = () => {
    soundManager.playKombuHorn();
    soundManager.startFestiveDrums(128);
    setScreen('arena_entrance');
  };

  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-4 md:p-6 bg-gradient-to-b from-[#2e150a] via-[#1c0d06] to-[#0d0603] text-white overflow-hidden select-none">
      <div className="absolute inset-0 kolam-pattern pointer-events-none opacity-10" />

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between border-b border-white/10 pb-2.5">
        <button
          onClick={() => {
            soundManager.playThavilSnap(0.5);
            setScreen('main_menu');
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Main Menu</span>
        </button>

        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider font-serif">
            மாட்டுப் பொங்கல் வழிபாடு • PRE-ROUND BLESSING
          </div>
          <div className="text-sm font-black text-amber-200 font-serif">
            {currentVillage.name} ({currentVillage.tamilName})
          </div>
        </div>
      </div>

      {/* 3D Village & Bull Canvas */}
      <div className="relative z-10 flex-1 my-2 rounded-2xl overflow-hidden border border-amber-500/30 bg-black/40 shadow-2xl">
        <Canvas camera={{ position: [0, 2.2, 5.8], fov: 45 }}>
          <ambientLight intensity={0.7} color="#fff1e6" />
          <directionalLight position={[6, 9, 4]} intensity={1.7} color="#fed7aa" castShadow />
          <pointLight position={[0, 3, -1]} intensity={1.2} color="#f59e0b" distance={8} />

          <VillageTempleBackdrop3D />
          <Bull3D position={[0, -0.6, 0]} isReleased={false} />
        </Canvas>

        {/* Floating Cultural Banner over Canvas */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 border border-amber-400/60 backdrop-blur-md text-[11px] text-amber-200 font-serif font-bold shadow-lg flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Mattu Pongal: The bull is honored, not provoked</span>
        </div>
      </div>

      {/* Interactive Ritual Steps & Narrative Card */}
      <div className="relative z-20 space-y-2.5 max-w-2xl mx-auto w-full">
        {/* Dynamic Ritual Narrative Prompt */}
        <div className="bg-[#1a0f09]/90 border border-amber-500/40 rounded-xl p-3 shadow-xl text-center backdrop-blur-md">
          <p className="text-xs md:text-sm text-amber-100 font-serif leading-relaxed">
            &quot;{blessingMessage}&quot;
          </p>
        </div>

        {/* 3 Ritual Beat Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleApplyTilak}
            className={`p-2 rounded-xl border text-center transition-all ${
              ritualStage >= 1
                ? 'bg-red-950/80 border-red-500 text-red-200 ring-1 ring-red-400'
                : 'bg-black/60 border-white/15 text-gray-300 hover:border-red-400/60'
            }`}
          >
            <div className="text-lg">🔴</div>
            <div className="text-[10px] font-black font-serif uppercase mt-0.5">1. Vibhuti &amp; Tilak</div>
          </button>

          <button
            onClick={handleAdornGarland}
            className={`p-2 rounded-xl border text-center transition-all ${
              ritualStage >= 2
                ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                : 'bg-black/60 border-white/15 text-gray-300 hover:border-amber-400/60'
            }`}
          >
            <div className="text-lg">🌼</div>
            <div className="text-[10px] font-black font-serif uppercase mt-0.5">2. Sevvanthi Malai</div>
          </button>

          <button
            onClick={handleOfferSugarcane}
            className={`p-2 rounded-xl border text-center transition-all ${
              ritualStage >= 3
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                : 'bg-black/60 border-white/15 text-gray-300 hover:border-emerald-400/60'
            }`}
          >
            <div className="text-lg">🌾</div>
            <div className="text-[10px] font-black font-serif uppercase mt-0.5">3. Pongal Offering</div>
          </button>
        </div>

        {/* Proceed to Vaadivasal Chute Button */}
        <button
          onClick={handleProceedToVaadivasal}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-tamil-marigold to-tamil-saffron text-black font-black text-xs md:text-sm shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-amber-200 font-serif"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>வாடிவாசல் பிரவேசம் • PROCEED TO VAADIVASAL GATE ➔</span>
        </button>
      </div>
    </div>
  );
};
