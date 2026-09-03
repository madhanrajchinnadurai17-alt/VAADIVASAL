import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/soundSynthesizer';
import {
  Heart,
  Zap,
  Hand,
  Award,
  HelpCircle,
  Info,
  Settings,
  Compass,
  X,
  Shield,
  Eye,
  Activity,
  Play,
  Pause,
} from 'lucide-react';

export const GameHUDOverlay: React.FC = () => {
  const {
    screen,
    currentVillage,
    timerSeconds,
    score,
    teamName,
    rivalTeamName,
    players,
    playerHealth,
    playerMaxHealth,
    playerStamina,
    playerMaxStamina,
    playerGripStrength,
    currentReputation,
    maxReputation,
    controlPhase,
    gripSkillPercent,
    timingWindowSeconds,
    showPathVisualization,
    activePathRouteName,
    togglePathVisualization,
    isAIInteractionActive,
    activeAIName,
    activeAIBib,
    playerCoords,
    bullCoords,
    aiCoords,
    showHelpModal,
    showInfoModal,
    showSettingsModal,
    setShowHelpModal,
    setShowInfoModal,
    setShowSettingsModal,
    isPaused,
    togglePause,
    triggerAction,
    setIsSprinting,
    setJoystick,
  } = useGameStore();

  const isFinalArena = currentVillage.id === 'championship' || screen === 'grand_final';

  // 1. Dynamic Top-Center Title Bar
  const getContextTitle = () => {
    if (isAIInteractionActive) {
      return `AI COMPETITION INTERACTION • ${activeAIName || 'AI TAMER'} (#${activeAIBib || '18'})`;
    }
    if (screen === 'arena_entrance') {
      return 'ARENA MODE ENTRANCE';
    }
    if (screen === 'vaadivasal_release') {
      return `${currentVillage.name.toUpperCase()} VAADIVASAL • RELEASE`;
    }
    if (isFinalArena) {
      return `GRAND FINAL: ${teamName} vs ${rivalTeamName}`;
    }
    return `${currentVillage.name.toUpperCase()} VAADIVASAL`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 md:p-4 select-none font-sans overflow-hidden">
      {/* ================= 1. TOP BAR ================= */}
      <div className="flex items-start justify-between gap-2">
        {/* Top-Left: Player Avatar + 3 Stat Bars + Reputation Card */}
        <div className="pointer-events-auto flex flex-col gap-1.5 max-w-[240px] md:max-w-[270px]">
          {/* Avatar & 3 Stacked Bars */}
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md p-2 rounded-2xl border border-white/15 shadow-xl">
            {/* Circular Player Avatar */}
            <div className="relative w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-full bg-[#18100c] flex items-center justify-center text-center">
                <span className="text-[10px] font-black text-amber-300 font-mono">
                  #07
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-amber-500 text-[8px] font-black text-black">
                YOU
              </div>
            </div>

            {/* 3 Horizontal Stat Bars */}
            <div className="flex-1 space-y-1">
              {/* Health */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <Heart className="w-3 h-3 text-red-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${(playerHealth / playerMaxHealth) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-white text-[9px] w-6 text-right">
                  {playerHealth}
                </span>
              </div>

              {/* Stamina */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <Zap className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${(playerStamina / playerMaxStamina) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-white text-[9px] w-6 text-right">
                  {playerStamina}
                </span>
              </div>

              {/* Grip Strength */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <Hand className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${(playerGripStrength / 30) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-white text-[9px] w-6 text-right">
                  {playerGripStrength}
                </span>
              </div>
            </div>
          </div>

          {/* Reputation Progress Card */}
          <div className="bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15 shadow-xl flex items-center justify-between gap-2">
            <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              <span>REPUTATION</span>
            </span>
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden mx-1">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
                style={{ width: `${(currentReputation / maxReputation) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-amber-300 font-mono">
              {currentReputation}
            </span>
          </div>
        </div>

        {/* Top-Center: Context-Sensitive Title Bar */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div
            className={`px-4 py-1.5 rounded-2xl border-2 backdrop-blur-md shadow-2xl flex items-center space-x-2 transition-all ${
              isAIInteractionActive
                ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                : isFinalArena
                ? 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-amber-500/30'
                : 'bg-black/80 border-tamil-saffron/80 text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] md:text-xs font-black tracking-widest font-display uppercase">
              {getContextTitle()}
            </span>
          </div>

          {/* Round Timer Badge */}
          <div className="mt-1 px-3 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-black font-mono text-white flex items-center gap-1.5">
            <span>ROUND {useGameStore.getState().round}</span>
            <span>|</span>
            <span className="text-amber-400">00:{timerSeconds.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Top-Right: Utility Row & Scoreboard */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          {/* Utility Icon Row */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.5);
                setShowHelpModal(true);
              }}
              className="w-7 h-7 rounded-full bg-black/75 hover:bg-black border border-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs transition-colors shadow-md"
              title="Help"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.5);
                setShowInfoModal(true);
              }}
              className="w-7 h-7 rounded-full bg-black/75 hover:bg-black border border-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs transition-colors shadow-md"
              title="Arena Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.5);
                setShowSettingsModal(true);
              }}
              className="w-7 h-7 rounded-full bg-black/75 hover:bg-black border border-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs transition-colors shadow-md"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundManager.playThavilSnap(0.5);
                togglePause();
              }}
              className="w-7 h-7 rounded-full bg-black/75 hover:bg-black border border-white/20 text-amber-300 hover:text-white flex items-center justify-center text-xs transition-colors shadow-md"
              title="Pause"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Score & Players Board */}
          <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 shadow-xl text-right">
            <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
              SCORE: <span className="text-amber-300 font-mono font-black">{score}</span>
            </div>
            <div className="text-[9px] text-gray-300 font-bold">
              TEAM: <span className="text-cyan-300">{teamName}</span> (#07)
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. CENTER OVERLAY (Dynamic Path Visualization) ================= */}
      {showPathVisualization && (
        <div className="self-center bg-black/80 border-2 border-red-500 rounded-2xl px-4 py-2 text-center shadow-2xl animate-pulse pointer-events-auto">
          <div className="text-[10px] font-black text-red-400 tracking-widest uppercase flex items-center justify-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>DYNAMIC PATH VISUALIZATION</span>
          </div>
          <div className="text-xs font-black text-white mt-0.5">
            {activePathRouteName}
          </div>
        </div>
      )}

      {/* ================= 3. BOTTOM BAR ================= */}
      <div className="flex items-end justify-between gap-2">
        {/* Bottom-Left: Context-Sensitive Control Prompt Card */}
        <div className="pointer-events-auto max-w-xs w-full">
          <div className="bg-black/80 backdrop-blur-md border-2 border-amber-400/80 rounded-2xl p-3 shadow-2xl space-y-1.5">
            <div className="text-[9px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>ACTION PROMPT</span>
              <span className="text-gray-400 font-normal">TIMING: {timingWindowSeconds}s</span>
            </div>

            {/* Phase 1: Approach */}
            {screen === 'arena_interaction' && (
              <div className="space-y-1">
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px]">
                    [X]
                  </span>
                  <span>Flank Charging Bull & Close In</span>
                </div>
                <div className="text-[10px] text-gray-300">
                  Approach Vadivasal • Time Approach
                </div>
              </div>
            )}

            {/* Phase 2: Closing-in / Active Grip */}
            {screen === 'taming_minigame' && (
              <div className="space-y-1.5">
                <div className="text-xs font-black text-emerald-300 flex items-center justify-between">
                  <span>PRESS [X] TO GRAB HUMP</span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Grip Skill: {gripSkillPercent}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="bg-emerald-950/60 border border-emerald-500/40 rounded px-1.5 py-0.5 text-emerald-200 font-bold">
                    [X] GRAB (Hold X)
                  </div>
                  <div className="bg-red-950/60 border border-red-500/40 rounded px-1.5 py-0.5 text-red-200 font-bold">
                    [B] AVOID
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom-Right: 2D Live Minimap + Dynamic Path Toggle + Virtual Controls */}
        <div className="pointer-events-auto flex items-end gap-2.5">
          {/* Path Toggle Button */}
          <button
            onClick={() => {
              soundManager.playThavilSnap(0.6);
              togglePathVisualization();
            }}
            className={`p-2 rounded-2xl border backdrop-blur-md text-xs font-bold transition-all shadow-xl flex flex-col items-center justify-center gap-1 ${
              showPathVisualization
                ? 'bg-red-500/30 border-red-400 text-red-200'
                : 'bg-black/75 border-white/20 text-gray-300 hover:text-white'
            }`}
            title="Toggle Dynamic Path Visualization"
          >
            <Compass className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase">PATH</span>
          </button>

          {/* 2D Live Minimap */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-black/85 border-2 border-white/20 backdrop-blur-md p-1 shadow-2xl relative flex items-center justify-center overflow-hidden">
            {/* Arena Oval Outline SVG */}
            <svg className="w-full h-full" viewBox="-12 -15 24 30">
              {/* Outer Fence Oval */}
              <ellipse
                cx="0"
                cy="0"
                rx="9"
                ry="13"
                fill="#1c120c"
                stroke="#3b82f6"
                strokeWidth="0.8"
              />
              {/* Center Kolam Ring */}
              <circle
                cx="0"
                cy="-2"
                r="3"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.5"
                strokeDasharray="1,1"
                opacity="0.6"
              />

              {/* AI Competitors (Yellow Dots) */}
              {aiCoords.map((ai) => (
                <circle
                  key={ai.id}
                  cx={ai.x}
                  cy={ai.z}
                  r="0.8"
                  fill="#facc15"
                />
              ))}

              {/* Bull Position (Red Dot) */}
              <circle
                cx={bullCoords.x}
                cy={bullCoords.z}
                r="1.2"
                fill="#ef4444"
                className="animate-ping"
              />
              <circle
                cx={bullCoords.x}
                cy={bullCoords.z}
                r="1.0"
                fill="#dc2626"
              />

              {/* Player Position (Green Dot #07) */}
              <circle
                cx={playerCoords.x}
                cy={playerCoords.z}
                r="1.1"
                fill="#22c55e"
              />
            </svg>

            {/* Minimap Label */}
            <div className="absolute top-1 left-1.5 text-[8px] font-black text-gray-400">
              MAP
            </div>
          </div>

          {/* Virtual Action Buttons (Run, Dive, Grab) */}
          <div className="flex flex-col gap-1.5">
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
              className="w-11 h-11 rounded-2xl bg-cyan-600/80 hover:bg-cyan-500 border border-cyan-300 text-white font-black text-xs flex flex-col items-center justify-center active:scale-95 shadow-xl transition-all"
            >
              <span>🏃</span>
              <span className="text-[8px]">RUN</span>
            </button>

            <button
              onClick={() => {
                soundManager.playThavilSnap(0.8);
                triggerAction('DIVE');
                setTimeout(() => triggerAction(null), 600);
              }}
              className="w-11 h-11 rounded-2xl bg-amber-600/80 hover:bg-amber-500 border border-amber-300 text-white font-black text-xs flex flex-col items-center justify-center active:scale-95 shadow-xl transition-all"
            >
              <span>🤸</span>
              <span className="text-[8px]">DIVE</span>
            </button>

            <button
              onClick={() => {
                soundManager.playGripSuccess(1);
                triggerAction('GRAB');
                setTimeout(() => triggerAction(null), 400);
              }}
              className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-300 text-white font-black text-xs flex flex-col items-center justify-center active:scale-95 shadow-2xl transition-all ring-2 ring-emerald-400/50"
            >
              <span>✋</span>
              <span className="text-[8px]">GRAB</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#1a0f0a] border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-3 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-sm font-black text-amber-300 uppercase">
                How to Play Vaadivasal
              </h3>
              <button onClick={() => setShowHelpModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <p>• <strong>Flank Approach:</strong> Move alongside the bull using joystick or WASD.</p>
              <p>• <strong>Timing Lock:</strong> Tap <strong>GRAB</strong> when close to the hump.</p>
              <p>• <strong>Hold for 10s:</strong> Maintain grip without causing harm.</p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs"
            >
              GOT IT!
            </button>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#1a0f0a] border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-3 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-sm font-black text-amber-300 uppercase">
                {currentVillage.name} Circuit Info
              </h3>
              <button onClick={() => setShowInfoModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <p><strong>District:</strong> {currentVillage.district}</p>
              <p><strong>Grand Prize:</strong> {currentVillage.prize.name}</p>
              <p>{currentVillage.description}</p>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#1a0f0a] border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-3 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-sm font-black text-amber-300 uppercase">
                Game Settings
              </h3>
              <button onClick={() => setShowSettingsModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between items-center p-2 rounded-lg bg-black/40">
                <span>Sound Synthesizer</span>
                <span className="text-emerald-400 font-bold">Web Audio Active</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-black/40">
                <span>Rendering Engine</span>
                <span className="text-cyan-400 font-bold">Three.js + R3F PBR</span>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
