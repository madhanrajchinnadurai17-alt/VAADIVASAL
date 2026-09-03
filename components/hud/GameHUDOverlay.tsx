import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Pause, Play, Check } from 'lucide-react';
import { soundManager } from '../../utils/soundSynthesizer';

export const GameHUDOverlay: React.FC = () => {
  const {
    round,
    timerSeconds,
    score,
    bullName,
    bullStamina,
    targetObjective,
    players,
    isPaused,
    setJoystick,
    setIsSprinting,
    triggerAction,
    togglePause,
  } = useGameStore();

  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard controls listener (WASD, Arrows, Shift, Space, E)
  useEffect(() => {
    const activeKeys: Record<string, boolean> = {};

    const updateFromKeys = () => {
      let x = 0;
      let y = 0;
      if (activeKeys['KeyA'] || activeKeys['ArrowLeft']) x -= 1;
      if (activeKeys['KeyD'] || activeKeys['ArrowRight']) x += 1;
      if (activeKeys['KeyW'] || activeKeys['ArrowUp']) y -= 1;
      if (activeKeys['KeyS'] || activeKeys['ArrowDown']) y += 1;

      if (x !== 0 || y !== 0) {
        const len = Math.hypot(x, y);
        x /= len;
        y /= len;
      }
      setJoystick({ x, y });
      setKnobPos({ x: x * 32, y: y * 32 });
      setIsSprinting(!!activeKeys['ShiftLeft'] || !!activeKeys['ShiftRight']);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      activeKeys[e.code] = true;
      if (e.code === 'KeyE') {
        triggerAction('GRAB');
        soundManager.playThavilSnap(0.8);
      } else if (e.code === 'Space') {
        triggerAction('DIVE');
        soundManager.playThavilBass(0.7);
      }
      updateFromKeys();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys[e.code] = false;
      if (e.code === 'KeyE' || e.code === 'Space') {
        triggerAction(null);
      }
      updateFromKeys();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setJoystick, setIsSprinting, triggerAction]);

  // Touch / Pointer Joystick Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 38;

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });
    setJoystick({ x: knobX / maxRadius, y: knobY / maxRadius });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    setJoystick({ x: 0, y: 0 });
  };

  // Format timer MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-3 md:p-6 font-sans">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-start justify-between w-full">
        {/* TOP-LEFT: Pause + Bull Info Card */}
        <div className="flex items-start space-x-2.5 pointer-events-auto">
          {/* Pause Button */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.5);
              togglePause();
            }}
            className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-black/80 hover:bg-black border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
          </button>

          {/* Bull Info Card */}
          <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-1.5 shadow-xl min-w-[150px] md:min-w-[190px]">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🐂</span>
              <div>
                <div className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  BULL
                </div>
                <div className="text-xs md:text-sm font-black text-white tracking-wide">
                  {bullName}
                </div>
              </div>
            </div>
            {/* Green Stamina / Health Bar */}
            <div className="mt-1.5 w-full h-1.5 md:h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                style={{ width: `${bullStamina}%` }}
              />
            </div>
          </div>
        </div>

        {/* TOP-CENTER: Hexagonal Match Timer (ROUND 1 | 00:54) */}
        <div className="flex flex-col items-center">
          <div className="bg-black/85 backdrop-blur-md border-2 border-amber-400 rounded-xl px-4 md:px-7 py-1 text-center shadow-2xl">
            <div className="text-[10px] md:text-xs font-black text-amber-400 tracking-wider uppercase">
              ROUND {round}
            </div>
            <div className="text-base md:text-2xl font-black text-white font-mono tracking-tight">
              {formatTimer(timerSeconds)}
            </div>
          </div>
        </div>

        {/* TOP-RIGHT: Score & Live Leaderboard */}
        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
          {/* Score Card */}
          <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-3.5 py-1 shadow-lg">
            <span className="text-xs md:text-sm font-black text-amber-300">
              SCORE : {score}
            </span>
          </div>

          {/* Players: 6 Leaderboard Card */}
          <div className="bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-2.5 shadow-2xl w-36 md:w-44 text-[10px] md:text-xs">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1 border-b border-white/10 pb-1">
              PLAYERS : {players.length}
            </div>
            <div className="space-y-1">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between px-2 py-0.5 rounded transition-all ${
                    p.isUser
                      ? 'bg-amber-400 text-black font-black shadow-sm'
                      : 'text-gray-200 font-semibold'
                  }`}
                >
                  <span className="truncate">
                    {p.bib} {p.name}
                  </span>
                  {!p.isUser && (
                    <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MID-LEFT: TARGET OBJECTIVE CARD ================= */}
      <div className="self-start mt-2 pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-md border-2 border-amber-400 rounded-xl px-3.5 py-2 shadow-2xl max-w-[160px] md:max-w-[210px]">
          <div className="text-[9px] md:text-[10px] font-black text-amber-400 uppercase tracking-widest text-center">
            TARGET
          </div>
          <div className="text-[10px] md:text-xs font-black text-white leading-tight text-center mt-0.5 font-display">
            {targetObjective}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM CONTROLS ================= */}
      <div className="flex items-end justify-between w-full">
        {/* BOTTOM-LEFT: Virtual Joystick (Touch + Visualizer) */}
        <div
          ref={joystickBaseRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-black/60 backdrop-blur-md border-2 border-zinc-500 shadow-2xl flex items-center justify-center touch-none pointer-events-auto cursor-grab active:cursor-grabbing"
        >
          {/* Direction indicator triangles */}
          <div className="absolute top-1.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-white/80" />
          <div className="absolute bottom-1.5 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-white/80" />
          <div className="absolute left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-white/80" />
          <div className="absolute right-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white/80" />

          {/* Draggable Knob */}
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white shadow-xl border-2 border-gray-300 transition-transform duration-75 flex items-center justify-center"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            <div className="w-4 h-4 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* BOTTOM-RIGHT: Tactile Action Buttons (RUN, DIVE, GRAB) */}
        <div className="relative w-44 h-44 md:w-48 md:h-48 pointer-events-auto">
          {/* 1. RUN Button (Top Right of cluster) */}
          <button
            onPointerDown={() => {
              setIsSprinting(true);
              soundManager.playThavilSnap(0.5);
            }}
            onPointerUp={() => setIsSprinting(false)}
            onPointerLeave={() => setIsSprinting(false)}
            className="absolute top-0 right-1 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/75 hover:bg-black border-2 border-zinc-400 active:border-amber-400 active:scale-95 shadow-2xl flex flex-col items-center justify-center text-white transition-all"
          >
            <span className="text-lg md:text-xl">🏃</span>
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-200">
              RUN
            </span>
          </button>

          {/* 2. DIVE Button (Bottom Left of cluster) */}
          <button
            onClick={() => {
              triggerAction('DIVE');
              soundManager.playThavilBass(0.8);
            }}
            className="absolute bottom-1 left-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/75 hover:bg-black border-2 border-zinc-400 active:border-cyan-400 active:scale-95 shadow-2xl flex flex-col items-center justify-center text-white transition-all"
          >
            <span className="text-lg md:text-xl">🤸</span>
            <span className="text-[9px] font-black uppercase tracking-wider text-gray-200">
              DIVE
            </span>
          </button>

          {/* 3. GRAB Button (Bottom Right of cluster - Primary Action) */}
          <button
            onClick={() => {
              triggerAction('GRAB');
              soundManager.playGripSuccess(1);
            }}
            className="absolute bottom-0 right-1 w-16 h-16 md:w-18 md:h-18 rounded-full bg-gradient-to-tr from-amber-600/90 to-yellow-500/90 hover:from-amber-500 hover:to-yellow-400 border-2 border-amber-300 active:scale-90 shadow-2xl flex flex-col items-center justify-center text-black font-black transition-all"
          >
            <span className="text-2xl md:text-3xl">✋</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              GRAB
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
