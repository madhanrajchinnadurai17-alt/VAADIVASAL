import React, { useEffect, useRef, useState } from 'react';
import { GameResultData } from '../game/scenes/TamingScene';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand } from 'lucide-react';

interface GameContainerProps {
  initialScene?: 'ReleaseScene' | 'TrainingPondScene' | 'TrainingFieldScene' | 'VillageTravelScene';
  sceneData?: Record<string, any>;
  onGameFinished: (result: GameResultData) => void;
  onTrainingFinished?: (reward: any) => void;
  onExitToMenu: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  initialScene = 'ReleaseScene',
  sceneData = {},
  onGameFinished,
  onTrainingFinished,
  onExitToMenu,
}) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserInstance = useRef<Phaser.Game | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initPhaser = async () => {
      if (!gameRef.current || phaserInstance.current) return;

      const Phaser = (await import('phaser')).default;
      const { createGameConfig } = await import('../game/config');

      if (!isMounted || !gameRef.current) return;

      const config = createGameConfig(gameRef.current);
      const game = new Phaser.Game(config);
      phaserInstance.current = game;

      // Start custom initial scene if not default ReleaseScene
      game.events.once('ready', () => {
        if (initialScene !== 'ReleaseScene') {
          game.scene.start(initialScene, sceneData);
        } else if (Object.keys(sceneData).length > 0) {
          game.scene.start('ReleaseScene', sceneData);
        }
      });

      setIsLoaded(true);

      // Listen for game finished event
      game.events.on('game-finished', (data: GameResultData) => {
        if (isMounted) {
          onGameFinished(data);
        }
      });

      // Listen for training finished event
      game.events.on('training-finished', (reward: any) => {
        if (isMounted && onTrainingFinished) {
          onTrainingFinished(reward);
        }
      });
    };

    initPhaser();

    return () => {
      isMounted = false;
      if (phaserInstance.current) {
        phaserInstance.current.destroy(true);
        phaserInstance.current = null;
      }
    };
  }, [initialScene, sceneData, onGameFinished, onTrainingFinished]);

  const triggerKeyEvent = (key: string, type: 'keydown' | 'keyup') => {
    const event = new KeyboardEvent(type, { key, code: key === ' ' ? 'Space' : `Key${key.toUpperCase()}`, bubbles: true });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Top Game Controls bar */}
      <div className="w-full flex items-center justify-between px-2 py-2 mb-2 text-xs text-tamil-sand/80">
        <button
          onClick={onExitToMenu}
          className="px-3 py-1 bg-black/40 hover:bg-tamil-saffron/20 border border-tamil-saffron/30 rounded-lg text-tamil-gold transition-colors font-bold"
        >
          ← Main Menu (முகப்பு)
        </button>
        <div className="hidden sm:flex items-center space-x-3 text-xs">
          <span>Move: <strong className="text-tamil-gold">WASD / Arrow Keys</strong></span>
          <span>•</span>
          <span>Action: <strong className="text-tamil-gold">SPACE / Click</strong></span>
        </div>
      </div>

      {/* Phaser Canvas Mount */}
      <div className="relative w-full aspect-[800/520] max-h-[520px] rounded-xl overflow-hidden shadow-2xl border-2 border-tamil-saffron/40 bg-tamil-night flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-tamil-night z-20 space-y-3">
            <div className="w-10 h-10 border-4 border-tamil-saffron border-t-transparent rounded-full animate-spin" />
            <p className="text-tamil-sand font-bold text-sm tracking-wide">
              வாடிவாசல் தயாராகிறது... Preparing Simulation...
            </p>
          </div>
        )}
        <div id="phaser-game-canvas" ref={gameRef} className="w-full h-full" />
      </div>

      {/* Mobile Touch D-Pad & Action Button */}
      <div className="flex items-center justify-between w-full max-w-xl mt-4 px-3 py-2 bg-black/40 border border-tamil-saffron/20 rounded-xl sm:hidden">
        <div className="grid grid-cols-3 gap-1 w-28">
          <div />
          <button
            onTouchStart={() => triggerKeyEvent('ArrowUp', 'keydown')}
            onTouchEnd={() => triggerKeyEvent('ArrowUp', 'keyup')}
            onMouseDown={() => triggerKeyEvent('ArrowUp', 'keydown')}
            onMouseUp={() => triggerKeyEvent('ArrowUp', 'keyup')}
            className="p-2 bg-tamil-earth border border-amber-500/30 rounded active:bg-amber-500/50 flex justify-center text-amber-200"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div />
          <button
            onTouchStart={() => triggerKeyEvent('ArrowLeft', 'keydown')}
            onTouchEnd={() => triggerKeyEvent('ArrowLeft', 'keyup')}
            onMouseDown={() => triggerKeyEvent('ArrowLeft', 'keydown')}
            onMouseUp={() => triggerKeyEvent('ArrowLeft', 'keyup')}
            className="p-2 bg-tamil-earth border border-amber-500/30 rounded active:bg-amber-500/50 flex justify-center text-amber-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onTouchStart={() => triggerKeyEvent('ArrowDown', 'keydown')}
            onTouchEnd={() => triggerKeyEvent('ArrowDown', 'keyup')}
            onMouseDown={() => triggerKeyEvent('ArrowDown', 'keydown')}
            onMouseUp={() => triggerKeyEvent('ArrowDown', 'keyup')}
            className="p-2 bg-tamil-earth border border-amber-500/30 rounded active:bg-amber-500/50 flex justify-center text-amber-200"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onTouchStart={() => triggerKeyEvent('ArrowRight', 'keydown')}
            onTouchEnd={() => triggerKeyEvent('ArrowRight', 'keyup')}
            onMouseDown={() => triggerKeyEvent('ArrowRight', 'keydown')}
            onMouseUp={() => triggerKeyEvent('ArrowRight', 'keyup')}
            className="p-2 bg-tamil-earth border border-amber-500/30 rounded active:bg-amber-500/50 flex justify-center text-amber-200"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onTouchStart={() => triggerKeyEvent(' ', 'keydown')}
          onTouchEnd={() => triggerKeyEvent(' ', 'keyup')}
          onMouseDown={() => triggerKeyEvent(' ', 'keydown')}
          onMouseUp={() => triggerKeyEvent(' ', 'keyup')}
          className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs rounded-xl shadow-lg active:scale-95 border border-emerald-300"
        >
          <Hand className="w-4 h-4" />
          <span>ACTION (SPACE)</span>
        </button>
      </div>
    </div>
  );
};
