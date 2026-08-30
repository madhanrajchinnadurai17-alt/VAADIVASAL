import React from 'react';
import { PlayerTamerAttributes, WonPrize } from '../game/playerProgression';
import { Shield, Award, Trophy, Zap, Activity, Heart, X } from 'lucide-react';

interface TamerProfileModalProps {
  tamer: PlayerTamerAttributes;
  prizes: WonPrize[];
  reputationTitle: string;
  totalMatches: number;
  totalWins: number;
  onClose: () => void;
}

export const TamerProfileModal: React.FC<TamerProfileModalProps> = ({
  tamer,
  prizes,
  reputationTitle,
  totalMatches,
  totalWins,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-tamil-saffron/60 bg-[#1f120d] p-6 text-left shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-tamil-saffron/30 pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-tamil-gold" />
            <h3 className="text-lg font-bold text-tamil-gold font-display">
              Tamer Profile & Prize Cabinet • வீரர் தகுதிகள்
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-black/40 hover:bg-tamil-saffron/20 text-tamil-sand">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Summary */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-tamil-gold/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-tamil-sand/70">Participant Identifier</div>
            <div className="text-lg font-black text-amber-300 font-display">
              வீரர் எண் #{tamer.tamerNumber < 10 ? `0${tamer.tamerNumber}` : tamer.tamerNumber}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-0.5">{reputationTitle}</div>
          </div>

          <div className="text-right text-xs text-tamil-sand/80 space-y-0.5">
            <div>Matches Played: <strong className="text-white">{totalMatches}</strong></div>
            <div>Taming Victories: <strong className="text-amber-300">{totalWins}</strong></div>
          </div>
        </div>

        {/* 8 Tamer Attributes */}
        <div>
          <h4 className="text-xs font-bold text-tamil-gold uppercase tracking-wider mb-2">
            Athletic Skill Attributes (வீரத் திறன்கள்)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Timing (நேரக் கணிப்பு)</div>
              <div className="text-sm font-black text-amber-300">{tamer.timing}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Grip (பிடி பலம்)</div>
              <div className="text-sm font-black text-cyan-300">{tamer.grip}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Reflex (துரிதம்)</div>
              <div className="text-sm font-black text-purple-300">{tamer.reflex}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Balance (சமநிலை)</div>
              <div className="text-sm font-black text-emerald-300">{tamer.balance}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Speed (வேகம்)</div>
              <div className="text-sm font-black text-rose-300">{tamer.speed}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Stamina (திடம்)</div>
              <div className="text-sm font-black text-amber-300">{tamer.stamina}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Courage (துணிவு)</div>
              <div className="text-sm font-black text-orange-300">{tamer.courage}/100</div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <div className="text-[10px] text-tamil-sand/70">Agility (சுறுசுறுப்பு)</div>
              <div className="text-sm font-black text-teal-300">{tamer.agility}/100</div>
            </div>
          </div>
        </div>

        {/* Won Prize Cabinet */}
        <div>
          <h4 className="text-xs font-bold text-tamil-gold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Prize Showcase Trophy Cabinet (வென்ற பரிசுகள்)</span>
          </h4>

          {prizes.length === 0 ? (
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-center text-xs text-tamil-sand/60">
              No tournament prizes won yet. Win Jallikattu rounds at Avaniyapuram, Palamedu, and Alanganallur to collect gold coins, cycles, and trophies!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto pr-1">
              {prizes.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg bg-black/50 border border-tamil-gold/30 flex items-center space-x-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[11px] text-amber-300 font-tamil">{p.tamilName}</div>
                    <div className="text-[10px] text-tamil-sand/60">{p.villageName} • {p.awardedFor}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
