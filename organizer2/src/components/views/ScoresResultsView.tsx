import React, { useState } from 'react';
import { Trophy, CheckCircle, Radio, Clock, ShieldCheck, Flame } from 'lucide-react';
import { MatchScore } from '../../types';

interface ScoresResultsViewProps {
  initialScores: MatchScore[];
  showToast: (msg: string) => void;
}

export const ScoresResultsView: React.FC<ScoresResultsViewProps> = ({
  initialScores,
  showToast,
}) => {
  const [scores, setScores] = useState<MatchScore[]>(initialScores);

  const handleScoreChange = (id: string, field: 'scoreA' | 'scoreB', val: number) => {
    setScores((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live Match Score Entry</h2>
          <p className="text-xs text-slate-500">
            Submit verified referee scores, point adjustments, and foul tallies to the public leaderboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>2 COURTS ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Grid of Match Consoles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scores.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-blue-600">{match.title}</span>
                {match.status === 'Live' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                    LIVE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    FINAL
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mb-4">{match.venueCourt}</div>

              <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2">
                    {match.teamA}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleScoreChange(match.id, 'scoreA', Math.max(0, match.scoreA - 1))}
                      className="btn-interactive w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer shadow-2xs flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={match.scoreA}
                      onChange={(e) =>
                        handleScoreChange(match.id, 'scoreA', parseInt(e.target.value, 10) || 0)
                      }
                      className="w-14 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg py-1 text-slate-900 focus:border-blue-500 outline-hidden"
                    />
                    <button
                      onClick={() => handleScoreChange(match.id, 'scoreA', match.scoreA + 1)}
                      className="btn-interactive w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold hover:bg-blue-100 cursor-pointer shadow-2xs flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2">
                    {match.teamB}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleScoreChange(match.id, 'scoreB', Math.max(0, match.scoreB - 1))}
                      className="btn-interactive w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer shadow-2xs flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={match.scoreB}
                      onChange={(e) =>
                        handleScoreChange(match.id, 'scoreB', parseInt(e.target.value, 10) || 0)
                      }
                      className="w-14 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg py-1 text-slate-900 focus:border-blue-500 outline-hidden"
                    />
                    <button
                      onClick={() => handleScoreChange(match.id, 'scoreB', match.scoreB + 1)}
                      className="btn-interactive w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold hover:bg-blue-100 cursor-pointer shadow-2xs flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => showToast(`Updated scores published for ${match.title}`)}
                className="btn-interactive btn-shine flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                Publish Result
              </button>
              <button
                onClick={() => showToast(`Final score ratified & locked into official record!`)}
                className="btn-interactive px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                Verify &amp; End
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
