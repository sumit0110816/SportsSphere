import React from 'react';
import { SCHOLARSHIPS_DATA } from '../mockData';

interface ScholarshipsViewProps {
  showToast: (msg: string) => void;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({ showToast }) => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">military_tech</span>
            <h1 className="text-2xl font-black text-slate-900">Scholarships & Scouting Trials</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Federation grants, university sports scholarships, and corporate talent incubators
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SCHOLARSHIPS_DATA.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {sch.provider}
              </span>

              <h3 className="font-black text-base text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
                {sch.title}
              </h3>

              <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-[10px] font-bold uppercase text-emerald-800">Grant & Benefits</span>
                <p className="font-extrabold text-sm text-emerald-950 mt-0.5">{sch.grant}</p>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligibility Criteria</span>
                  <span className="font-semibold text-slate-800">{sch.eligibility}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Cutoff</span>
                  <span className="font-semibold text-amber-700">{sch.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Quotas</span>
                  <span className="font-semibold text-slate-800">{sch.slots}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700">{sch.status}</span>
              <button
                type="button"
                onClick={() => showToast(`Applied for ${sch.title}. Credentials linked!`)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
