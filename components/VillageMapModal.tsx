import React from 'react';
import { TAMIL_VILLAGES, VillageEvent } from '../game/villageSystem';
import { MapPin, Lock, CheckCircle, Trophy, ArrowRight, X } from 'lucide-react';
import { soundManager } from '../utils/soundSynthesizer';

interface VillageMapModalProps {
  unlockedIndex: number;
  currentVillageId: string;
  onSelectVillage: (village: VillageEvent) => void;
  onClose: () => void;
}

export const VillageMapModal: React.FC<VillageMapModalProps> = ({
  unlockedIndex,
  currentVillageId,
  onSelectVillage,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl border-2 border-tamil-saffron/60 bg-[#1f120d] p-6 text-left shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-tamil-saffron/30 pb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-tamil-gold" />
            <h3 className="text-lg font-bold text-tamil-gold font-display">
              Tamil Nadu Jallikattu Circuit • பல ஊர் ஜல்லிக்கட்டுப் பயணம்
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/40 hover:bg-tamil-saffron/20 text-tamil-sand"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-tamil-sand/80">
          Compete across historical Tamil Nadu village arenas. Win prestigious traditional prizes to unlock the next prestigious festival ground!
        </p>

        {/* 5 Village Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {TAMIL_VILLAGES.map((v, idx) => {
            const isUnlocked = idx <= unlockedIndex;
            const isCurrent = v.id === currentVillageId;

            return (
              <div
                key={v.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : isUnlocked
                    ? 'bg-black/40 border-tamil-saffron/30 hover:border-tamil-saffron/70'
                    : 'bg-black/20 border-white/10 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-tamil-gold uppercase">
                      Stage {idx + 1} • {v.district}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  <h4 className="text-base font-extrabold text-white mt-1 font-display">
                    {v.name} ({v.tamilName})
                  </h4>
                  <p className="text-xs text-tamil-sand/75 mt-1 leading-relaxed">{v.description}</p>

                  <div className="mt-3 p-2 rounded-lg bg-black/50 border border-white/10 text-xs flex items-center justify-between">
                    <span className="text-tamil-sand/80">Grand Prize:</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <span>{v.prize.icon}</span>
                      <span>{v.prize.name}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-white/10 flex justify-end">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playThavilSnap(0.8);
                        onSelectVillage(v);
                      }}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gradient-to-r from-tamil-saffron to-tamil-marigold text-black font-black text-xs hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>பயணம் செய்க • TRAVEL HERE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Unlock at Previous Arena</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
