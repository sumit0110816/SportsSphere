import React from 'react';

interface AnalyticsViewProps {
  showToast: (msg: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ showToast }) => {
  const splits = [
    { segment: '0–100m (Acceleration & Drive)', time: '11.18s', speed: '8.94 m/s', effort: '98%' },
    { segment: '100–200m (Transition Pacing)', time: '11.32s', speed: '8.83 m/s', effort: '95%' },
    { segment: '200–300m (Backstretch Curve)', time: '11.72s', speed: '8.53 m/s', effort: '94%' },
    { segment: '300–400m (Home Stretch Drive)', time: '12.60s', speed: '7.94 m/s', effort: '100%' },
  ];

  const progression = [
    { meet: 'State Trials (May 2024)', time: '47.90s', rank: '#4 State' },
    { meet: 'South Zone Games (Jul 2024)', time: '47.45s', rank: '#2 South' },
    { meet: 'AFI Open Invitational (Aug 2024)', time: '47.12s', rank: '#2 State' },
    { meet: 'All-India Inter-University (Sep 2024)', time: '46.82s (PB)', rank: '#1 Gold' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">insights</span>
            <h1 className="text-2xl font-black text-slate-900">Sprint Biometrics & Analytics</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Photofinish gate telemetry, stride frequency, and national scout evaluation indices
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Exported full biomechanical telemetry PDF report')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          <span>Download Telemetry Report</span>
        </button>
      </div>

      {/* Top Biometric Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Peak Top Speed</span>
          <div className="text-2xl font-black text-slate-900 mt-1">10.42 m/s</div>
          <span className="text-xs text-emerald-600 font-semibold">37.5 km/h at 140m mark</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Block Reaction Time</span>
          <div className="text-2xl font-black text-blue-600 mt-1">0.142 s</div>
          <span className="text-xs text-blue-600 font-semibold">Elite Reaction Index</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Stride Length</span>
          <div className="text-2xl font-black text-teal-700 mt-1">2.34 m</div>
          <span className="text-xs text-teal-700 font-semibold">171 Strides across 400m</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Scout Readiness</span>
          <div className="text-2xl font-black text-amber-600 mt-1">94 / 100</div>
          <span className="text-xs text-amber-700 font-semibold">Tier-1 Olympic Pathway</span>
        </div>
      </div>

      {/* 400m Split Times Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Personal Best 400m Split Segment Breakdown (46.82s)
            </h2>
            <p className="text-xs text-slate-500">Recorded with Omega Electronic Gate Sensors</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            ▲ Top 2% National Varsity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {splits.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Split {idx + 1}
                </span>
                <div className="text-2xl font-black text-blue-700 my-1">{s.time}</div>
                <p className="text-xs font-semibold text-slate-700">{s.segment}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Avg Speed: {s.speed}</span>
                <span className="font-bold text-emerald-600">{s.effort} Output</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint Progression Timeline */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-4">Season Pacing Progression</h3>
        <div className="divide-y divide-slate-100">
          {progression.map((p, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">{p.meet}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-blue-600 text-sm">{p.time}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {p.rank}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
