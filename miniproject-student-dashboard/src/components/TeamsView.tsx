import React from 'react';
import { TEAMMATES } from '../mockData';
import { getLoggedInStudent } from '../utils/userSession';

interface TeamsViewProps {
  showToast: (msg: string) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({ showToast }) => {
  const student = getLoggedInStudent();
  const studentFirstName = student.name.split(' ')[0] || 'Athlete';
  const displayTeammates = TEAMMATES.map((tm) =>
    tm.id === 'tm-1'
      ? { ...tm, name: `${student.name} (You)`, avatar: student.avatar || tm.avatar }
      : tm
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white mb-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                Varsity Division 1
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                South Zone Rank #1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {student.city} Varsity 4x400m Relay Squad
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Team Captain: {student.name} • Head Coach: Satish Somani (AFI Master Coach). Current season squad record: 3:08.41.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => showToast('Team practice scheduled for 06:00 AM tomorrow at Kanteerava Outer Track')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">schedule</span>
              <span>Schedule Drill</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Exported team roster & baton exchange split sheet')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">share</span>
              <span>Roster Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4x400m Baton Exchange Order */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[22px]">swap_horiz</span>
            <h2 className="text-lg font-bold text-slate-900">4x400m Relay Leg Order & Exchange Matrix</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Baton acceleration zone: 30m standard</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayTeammates.slice(0, 4).map((tm, idx) => (
            <div
              key={tm.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-500/50 transition-all flex flex-col justify-between relative group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  0{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  PB: {tm.pb}
                </span>
              </div>

              <div className="flex items-center gap-3 my-2">
                <img
                  alt={tm.name}
                  src={tm.avatar}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200 shadow-xs"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {tm.name}
                  </h4>
                  <span className="text-[11px] text-slate-500 block truncate">{tm.specialty}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-semibold flex items-center justify-between">
                <span>{tm.role.split('•')[0]}</span>
                <span className="text-emerald-700 font-bold">Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Squad Table & Training Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900">Sprint Roster & Biometric Readiness</h3>
            <span className="text-xs text-slate-500">5 Registered Athletes</span>
          </div>

          <div className="divide-y divide-slate-100">
            {displayTeammates.map((tm) => (
              <div key={tm.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    alt={tm.name}
                    src={tm.avatar}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{tm.name}</h4>
                    <span className="text-[11px] text-slate-500">{tm.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="hidden sm:block text-right">
                    <span className="font-mono font-bold text-slate-900">{tm.pb}</span>
                    <span className="text-[10px] text-slate-400 block">Personal Best</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {tm.attendance}
                  </span>

                  <button
                    type="button"
                    onClick={() => showToast(`Sent direct drill ping to ${tm.name}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Direct Message"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coach Strategy Notes */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">lightbulb</span>
              <h3 className="font-bold text-base text-slate-900">Coach Strategy Bulletin</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="font-bold text-amber-900 block mb-0.5">Curve Stagger Focus</span>
                <p>
                  Ensure Leg 2 (Rohan) cuts into inside lane at 100m cone without clip hazard. Practice blind handoff at top velocity.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                <span className="font-bold text-blue-900 block mb-0.5">Anchor Acceleration Zone</span>
                <p>
                  {studentFirstName} to begin acceleration when Naveen hits the 20-meter yellow check-mark. Goal: Sub-45.5s flying split.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast('Acknowledged Coach Strategy notes')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Acknowledge Directives
          </button>
        </div>
      </div>
    </div>
  );
};
