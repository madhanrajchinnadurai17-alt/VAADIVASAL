import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import { Pause, Play, Check } from 'lucide-react';

export const GameHUDOverlay: React.FC = () => {
  const {
    timerSeconds,
    score,
    bullName,
    bullStamina,
    targetObjective,
    players,
    isPaused,
    togglePause,
    triggerAction,
    setIsSprinting,
    setJoystick,
  } = useGameStore();

  // Interactive Virtual Touch Joystick
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    setJoystick({ x: 0, y: 0 });
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxDist = 38;
    const dist = Math.min(maxDist, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);

    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;

    setKnobPos({ x, y });
    setJoystick({ x: x / maxDist, y: y / maxDist });
  };

  // Keyboard controls listener (WASD / Arrows)
  useEffect(() => {
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      let jx = 0;
      let jy = 0;
      if (keys['w'] || keys['W'] || keys['ArrowUp']) jy -= 1;
      if (keys['s'] || keys['S'] || keys['ArrowDown']) jy += 1;
      if (keys['a'] || keys['A'] || keys['ArrowLeft']) jx -= 1;
      if (keys['d'] || keys['D'] || keys['ArrowRight']) jx += 1;
      setJoystick({ x: jx, y: jy });
      setKnobPos({ x: jx * 30, y: jy * 30 });

      if (e.key === ' ' || e.key === 'x' || e.key === 'X') {
        soundManager.playGripSuccess(1);
        triggerAction('GRAB');
      }
      if (e.key === 'Shift') {
        setIsSprinting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
      let jx = 0;
      let jy = 0;
      if (keys['w'] || keys['W'] || keys['ArrowUp']) jy -= 1;
      if (keys['s'] || keys['S'] || keys['ArrowDown']) jy += 1;
      if (keys['a'] || keys['A'] || keys['ArrowLeft']) jx -= 1;
      if (keys['d'] || keys['D'] || keys['ArrowRight']) jx += 1;
      setJoystick({ x: jx, y: jy });
      setKnobPos({ x: jx * 30, y: jy * 30 });

      if (e.key === 'Shift') {
        setIsSprinting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setJoystick, setIsSprinting, triggerAction]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-5 select-none font-sans overflow-hidden">
      {/* ================= 1. TOP HUD matching Image 1 ================= */}
      <div className="flex items-start justify-between">
        {/* Top-Left: Pause Button + Bull Info Card + Target Objective Card */}
        <div className="pointer-events-auto flex flex-col gap-2">
          {/* Top Row: Pause Button + Bull Info Card */}
          <div className="flex items-center gap-2">
            {/* Pause Button [ || ] */}
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.5);
                togglePause();
              }}
              className="w-10 h-10 rounded-md bg-black/90 border border-white/30 text-white flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95"
              title="Pause"
            >
              {isPaused ? <Play className="w-5 h-5 text-amber-400" /> : <Pause className="w-5 h-5" />}
            </button>

            {/* Bull Info Card */}
            <div className="bg-black/90 border border-white/20 px-3 py-1.5 rounded-md shadow-xl flex items-center gap-2.5 min-w-[170px]">
              {/* Bull Icon */}
              <div className="text-white text-xl">
                🐂
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">
                  BULL
                </div>
                <div className="text-xs font-black text-white uppercase tracking-wide">
                  {bullName}
                </div>
                {/* Bright Green Vital Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-sm overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-[#22c55e] transition-all duration-300 shadow-[0_0_8px_#22c55e]"
                    style={{ width: `${bullStamina}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Target Objective Card */}
          <div className="bg-black/90 border border-white/20 px-3 py-2 rounded-md shadow-xl max-w-[190px]">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              TARGET
            </div>
            <div className="text-xs font-black text-[#facc15] uppercase tracking-wide mt-0.5 leading-tight">
              {targetObjective}
            </div>
          </div>
        </div>

        {/* Top-Center: Hexagonal Gold-Trimmed Timer Badge */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div className="relative px-6 py-1.5 bg-black/90 border-2 border-[#eab308] rounded-md shadow-2xl text-center transform -skew-x-6">
            <div className="text-[10px] font-black text-gray-300 uppercase tracking-wider transform skew-x-6">
              ROUND 1
            </div>
            <div className="text-xl md:text-2xl font-black text-white font-mono tracking-widest transform skew-x-6 leading-none mt-0.5">
              00:{timerSeconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Top-Right: Score Card + Players Leaderboard Card */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          {/* Score Card */}
          <div className="bg-black/90 border border-white/20 px-4 py-1.5 rounded-md shadow-xl text-right">
            <span className="text-xs font-black text-white uppercase">SCORE : </span>
            <span className="text-sm font-black text-[#facc15] font-mono">{score}</span>
          </div>

          {/* Players Leaderboard Card matching image */}
          <div className="bg-black/90 border border-white/20 p-2 rounded-md shadow-xl w-36 md:w-44 text-xs space-y-1">
            <div className="text-[10px] font-black text-white uppercase tracking-wider border-b border-white/10 pb-1">
              PLAYERS : 6
            </div>

            {players.map((p) => {
              if (p.isUser) {
                return (
                  <div
                    key={p.id}
                    className="bg-[#facc15] text-black font-black px-2 py-0.5 rounded-sm flex items-center justify-between text-[11px]"
                  >
                    <span>06 YOU</span>
                  </div>
                );
              }
              return (
                <div
                  key={p.id}
                  className="text-white font-bold px-2 py-0.5 flex items-center justify-between text-[11px]"
                >
                  <span>{p.bib} {p.name}</span>
                  <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 2. BOTTOM HUD matching Image 1 ================= */}
      <div className="flex items-end justify-between">
        {/* Bottom-Left: Circular Virtual Touch Joystick */}
        <div className="pointer-events-auto p-2">
          <div
            ref={joystickRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-black/80 border-2 border-white/40 shadow-2xl flex items-center justify-center cursor-pointer touch-none"
          >
            {/* 4 Directional White Arrows */}
            <div className="absolute top-2 text-white text-xs font-black">▲</div>
            <div className="absolute bottom-2 text-white text-xs font-black">▼</div>
            <div className="absolute left-2 text-white text-xs font-black">◀</div>
            <div className="absolute right-2 text-white text-xs font-black">▶</div>

            {/* Inner Center Knob */}
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-none transition-transform duration-75"
              style={{
                transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              }}
            />
          </div>
        </div>

        {/* Bottom-Right: 3 Action Buttons (RUN, DIVE, GRAB) arranged in Triangle */}
        <div className="pointer-events-auto relative w-48 h-40 md:w-56 md:h-44">
          {/* Top Button: RUN (🏃) */}
          <button
            onPointerDown={() => {
              soundManager.playThavilSnap(0.7);
              triggerAction('RUN');
              setIsSprinting(true);
            }}
            onPointerUp={() => {
              triggerAction(null);
              setIsSprinting(false);
            }}
            className="absolute top-0 right-4 w-16 h-16 md:w-18 md:h-18 rounded-full bg-black/85 border-2 border-white/80 text-white flex flex-col items-center justify-center active:scale-90 shadow-2xl transition-all"
          >
            <span className="text-2xl">🏃</span>
            <span className="text-[10px] font-black uppercase tracking-wider">RUN</span>
          </button>

          {/* Bottom Left Button: DIVE (🤸) */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.8);
              triggerAction('DIVE');
              setTimeout(() => triggerAction(null), 600);
            }}
            className="absolute bottom-1 left-2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/85 border-2 border-white/80 text-white flex flex-col items-center justify-center active:scale-90 shadow-2xl transition-all"
          >
            <span className="text-xl">🤸</span>
            <span className="text-[9px] font-black uppercase tracking-wider">DIVE</span>
          </button>

          {/* Bottom Right Button: GRAB (✋) */}
          <button
            onClick={() => {
              soundManager.playGripSuccess(1);
              triggerAction('GRAB');
              setTimeout(() => triggerAction(null), 400);
            }}
            className="absolute bottom-1 right-2 w-16 h-16 md:w-18 md:h-18 rounded-full bg-black/85 border-2 border-white/80 text-white flex flex-col items-center justify-center active:scale-90 shadow-2xl transition-all"
          >
            <span className="text-2xl">✋</span>
            <span className="text-[10px] font-black uppercase tracking-wider">GRAB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
