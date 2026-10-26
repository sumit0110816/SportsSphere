import React from 'react';
import { Competition } from '../types';

interface SavedViewProps {
  competitions: Competition[];
  onOpenRegisterModal: (comp: Competition) => void;
  onToggleBookmark: (comp: Competition) => void;
  showToast: (msg: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  competitions,
  onOpenRegisterModal,
  onToggleBookmark,
  showToast,
}) => {
  const savedComps = competitions.filter((c) => c.isBookmarked);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-blue-600 text-[24px]">bookmark</span>
        <h1 className="text-2xl font-black text-slate-900">Saved Competitions & Watchlist</h1>
      </div>
      <p className="text-xs sm:text-sm text-slate-500 mb-8">
        Your pinned tournaments and events with automatic deadline alerts
      </p>

      {savedComps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved competitions yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any competition card to pin it here and receive deadline alerts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedComps.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-200 flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div className="relative h-44 w-full">
                <img alt={comp.title} src={comp.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => onToggleBookmark(comp)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark</span>
                </button>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-xs font-semibold text-slate-300 block">{comp.organizer}</span>
                  <h3 className="font-bold text-base">{comp.title}</h3>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Date:</span>
                    <strong className="text-slate-900">{comp.dateRange}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Venue:</span>
                    <strong className="text-slate-900 truncate max-w-[180px]">{comp.venue}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fee:</span>
                    <strong className="text-blue-600">{comp.entryFee}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRegisterModal(comp)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>View Details & Register</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
