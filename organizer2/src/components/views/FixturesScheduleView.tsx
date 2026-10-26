import React, { useState } from 'react';
import { CalendarRange, Sparkles, Trophy, Shuffle, Clock, MapPin } from 'lucide-react';

interface FixturesScheduleViewProps {
  showToast: (msg: string) => void;
}

export const FixturesScheduleView: React.FC<FixturesScheduleViewProps> = ({
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'Football' | 'Badminton' | 'Basketball'>('Football');

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Knockout Brackets &amp; Fixtures</h2>
          <p className="text-xs text-slate-500">
            Tournament elimination trees, court assignments, and automated seedings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            {(['Football', 'Badminton', 'Basketball'] as const).map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveTab(sport)}
                className={`btn-press px-3 py-1 rounded-md font-semibold cursor-pointer ${
                  activeTab === sport
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
          <button
            onClick={() => showToast('Brackets auto-rebalanced with official campus seeds!')}
            className="btn-interactive btn-shine px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Shuffle className="w-3.5 h-3.5 transition-transform duration-300 hover:rotate-180" />
            <span>Regenerate Brackets</span>
          </button>
        </div>
      </div>

      {/* Tournament Bracket Tree */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] gap-8">
          {/* Quarter Finals */}
          <div className="space-y-6 w-1/3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Quarter-Finals</span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">QF</span>
            </div>

            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs space-y-1.5 hover:border-blue-300 hover:bg-white hover:shadow-2xs transition-all">
              <div className="flex justify-between font-bold text-slate-800">
                <span>St. Xavier Titans</span>
                <span className="text-blue-600 font-extrabold">3</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>KLS Gogte College</span>
                <span>1</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Full Time • Pitch A</span>
              </div>
            </div>

            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs space-y-1.5 hover:border-blue-300 hover:bg-white hover:shadow-2xs transition-all">
              <div className="flex justify-between font-bold text-slate-800">
                <span>JCER Warriors</span>
                <span className="text-blue-600 font-extrabold">2</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Apex Tech</span>
                <span>0</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Full Time • Pitch B</span>
              </div>
            </div>
          </div>

          {/* Semi Finals */}
          <div className="space-y-12 w-1/3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Semi-Finals</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-bold">LIVE DRAW</span>
            </div>

            <div className="p-4 border-2 border-blue-400 bg-blue-50/50 rounded-xl text-xs space-y-2 shadow-xs hover:border-blue-500 transition-colors">
              <div className="flex justify-between font-bold text-slate-900">
                <span>St. Xavier Titans</span>
                <span className="text-blue-700 font-black">VS</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>JCER Warriors</span>
                <span className="text-xs text-rose-600 font-bold">Oct 24, 4:00 PM</span>
              </div>
              <div className="pt-2 border-t border-blue-200/60 flex justify-between items-center text-[11px] text-blue-800">
                <span>Main Stadium Pitch</span>
                <span className="font-semibold text-emerald-700">Referee Cleared</span>
              </div>
            </div>
          </div>

          {/* Finals */}
          <div className="w-1/3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Championship Final</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>

            <div className="p-5 border-2 border-amber-400 bg-amber-50/50 rounded-xl text-xs space-y-2.5 text-center shadow-xs hover:border-amber-500 transition-colors">
              <div className="text-[10px] uppercase font-extrabold text-amber-700 tracking-wider">
                🏆 Grand Finale
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                Winner SF1 vs Winner SF2
              </div>
              <div className="text-slate-500 text-[11px]">
                Oct 26 • Main Campus Ground
              </div>
              <button
                onClick={() => showToast('Championship VIP passes and press credentials configured!')}
                className="btn-interactive btn-shine mt-2 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer shadow-xs"
              >
                Manage Finals Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
