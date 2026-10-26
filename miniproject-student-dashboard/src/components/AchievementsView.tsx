import React, { useState } from 'react';
import { ACHIEVEMENTS } from '../mockData';

interface AchievementsViewProps {
  onOpenCvModal: () => void;
  showToast: (msg: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ onOpenCvModal, showToast }) => {
  const [filterTier, setFilterTier] = useState<string>('All');

  const filtered = ACHIEVEMENTS.filter((ach) => {
    if (filterTier === 'All') return true;
    return ach.tier === filterTier;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">workspace_premium</span>
            <h1 className="text-2xl font-black text-slate-900">Verified Achievements & Badges</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Federation verified medals, electronic timing certificates, and national scout rankings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCvModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
            <span>View Full Athlete CV</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Badges</span>
          <p className="text-2xl font-black text-slate-900 mt-0.5">18</p>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Verified</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">National Podiums</span>
          <p className="text-2xl font-black text-blue-600 mt-0.5">4</p>
          <span className="text-[11px] text-slate-500 font-medium">All-India AIU</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">State Titles</span>
          <p className="text-2xl font-black text-teal-700 mt-0.5">7</p>
          <span className="text-[11px] text-slate-500 font-medium">Karnataka Open</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Scout Readiness</span>
          <p className="text-2xl font-black text-amber-600 mt-0.5">94 / 100</p>
          <span className="text-[11px] text-amber-700 font-semibold">Elite Varsity Tier</span>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {['All', 'National', 'State', 'University', 'Special'].map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setFilterTier(tier)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTier === tier
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tier} {tier === 'All' ? '(18)' : ''}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">{ach.icon}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-slate-400">{ach.year}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {ach.tier}
                  </span>
                </div>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {ach.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ach.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Recorded Benchmark</span>
                <span className="font-mono font-bold text-blue-600">{ach.recordStat || 'Verified'}</span>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Verified Certificate ID: AFI-KA-${ach.id}-2024`)}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>{ach.verifiedBy.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
