import React from 'react';
import { BarChart3, TrendingUp, Users, Award, Shield } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900">Campus Sports Analytics</h2>
        <p className="text-xs text-slate-500">
          Participation breakdown across gender diversity, collegiate athletic divisions, and seasonal event turnouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Participation by Sport */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Participation by Sport</span>
            <span className="text-slate-400 font-normal">486 Total Athletes</span>
          </h3>
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Football</span>
                <span className="font-bold text-slate-900">210 athletes (45%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Athletics</span>
                <span className="font-bold text-slate-900">140 athletes (30%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Badminton</span>
                <span className="font-bold text-slate-900">80 athletes (17%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-slate-700">Basketball</span>
                <span className="font-bold text-slate-900">56 athletes (12%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Gender Diversity Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 mb-2">Gender Diversity Ratio</h3>
            <p className="text-slate-400 text-xs">Targeting 50/50 collegiate parity by 2026</p>
          </div>

          <div className="p-6 text-center">
            <div className="text-4xl font-extrabold text-blue-600 tracking-tight">
              62% / 38%
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              Male to Female registered athletes
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mt-4 flex">
              <div className="bg-blue-600 h-3" style={{ width: '62%' }} />
              <div className="bg-rose-500 h-3" style={{ width: '38%' }} />
            </div>

            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 px-1">
              <span>Male (301)</span>
              <span>Female (185)</span>
            </div>

            <p className="text-[11px] text-emerald-600 mt-4 font-semibold inline-flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>↑ 14% higher female participation compared to 2023 season</span>
            </p>
          </div>

          <div className="text-slate-400 text-[11px] text-center border-t border-slate-100 pt-3">
            Source: JCER Sports Registry • AI Studio Analytics
          </div>
        </div>
      </div>
    </div>
  );
};
