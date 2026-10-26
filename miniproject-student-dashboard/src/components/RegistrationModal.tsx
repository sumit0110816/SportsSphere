import React, { useState } from 'react';
import { Competition } from '../types';
import { getLoggedInStudent } from '../utils/userSession';

interface RegistrationModalProps {
  competition: Competition | null;
  onClose: () => void;
  onConfirm: (competition: Competition) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  competition,
  onClose,
  onConfirm,
}) => {
  const [agreedWaiver, setAgreedWaiver] = useState(true);
  const student = getLoggedInStudent();

  if (!competition) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">verified</span>
            <h3 className="font-bold text-lg text-slate-900">Competition Registration</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Selected Event
            </span>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{competition.title}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{competition.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-500">Athlete Profile:</span>
              <p className="font-bold text-slate-800">{student.name} ({student.sport})</p>
            </div>
            <div>
              <span className="text-slate-500">Entry Fee:</span>
              <p className="font-bold text-blue-600">{competition.entryFee}</p>
            </div>
            <div>
              <span className="text-slate-500">Scheduled Date:</span>
              <p className="font-bold text-slate-800">{competition.dateRange}</p>
            </div>
            <div>
              <span className="text-slate-500">Venue:</span>
              <p className="font-bold text-slate-800 truncate">{competition.venue.split(',')[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-medium">
            <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0">info</span>
            <span>
              Your AFI electronic timing certification (46.82s) will be automatically synced with the event organizers.
            </span>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreedWaiver}
              onChange={(e) => setAgreedWaiver(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>I acknowledge the medical eligibility and federation anti-doping regulations.</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!agreedWaiver}
            onClick={() => onConfirm(competition)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-95 text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
            <span>Confirm & Generate Bib</span>
          </button>
        </div>
      </div>
    </div>
  );
};
