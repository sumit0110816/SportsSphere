import React from 'react';
import { getLoggedInStudent } from '../utils/userSession';

interface AthleteCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const AthleteCvModal: React.FC<AthleteCvModalProps> = ({ isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  const student = getLoggedInStudent();
  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                Official Athlete Profile & CV
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Federation Verification ID: AFI-2023-KA-8492
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-5 space-y-5">
          {/* Profile Card Top */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100">
            {student.avatar ? (
              <img
                alt={`${student.name} Profile`}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-sm"
                src={student.avatar}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center ring-2 ring-blue-500/40 shadow-sm shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-base text-slate-900">{student.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{student.sport} • {student.title || 'Student Athlete'}</p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-500">
                <span>{student.city}</span>
                <span>•</span>
                <span>@{student.handle}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">PB (400m)</span>
              <p className="text-lg font-black text-blue-600 mt-0.5">46.82s</p>
              <span className="text-[10px] text-emerald-600 font-medium">Top 2% National</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">PB (200m)</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">21.14s</p>
              <span className="text-[10px] text-slate-500 font-medium">State Gold</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Scout Index</span>
              <p className="text-lg font-black text-teal-700 mt-0.5">94 / 100</p>
              <span className="text-[10px] text-teal-600 font-medium">Elite Tier</span>
            </div>
          </div>

          {/* Career Highlights */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Recent Highlights & Badges
            </h5>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">military_tech</span>
                  <span className="font-semibold text-slate-800">
                    Gold Medal - All India Inter-University 400m (2024)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Feb 2024</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">verified</span>
                  <span className="font-semibold text-slate-800">
                    Silver Medal - Karnataka State Athletics Open (2024)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Aug 2024</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600 text-[18px]">speed</span>
                  <span className="font-semibold text-slate-800">
                    AFI Electronic Timing Standard Cleared (46.82s)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Sep 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              showToast(`Copied public Athlete CV URL: sportsphere.io/cv/${student.handle}`);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy Public CV Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
