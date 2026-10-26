import React, { useState } from 'react';

interface SubmitTrialTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const SubmitTrialTimeModal: React.FC<SubmitTrialTimeModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [eventDistance, setEventDistance] = useState('400m');
  const [recordedTime, setRecordedTime] = useState('46.75');
  const [timingGate, setTimingGate] = useState('Omega Electronic Photofinish');
  const [trackSurface, setTrackSurface] = useState('Mondo Synthetic (Outdoor)');
  const [venue, setVenue] = useState('Sree Kanteerava Outdoor Stadium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    showToast(`Trial time of ${recordedTime}s in ${eventDistance} submitted for AFI verification!`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[22px]">timer</span>
            <h3 className="font-bold text-base text-slate-900">Submit Verified Track Trial Time</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Track Event Category</label>
            <select
              value={eventDistance}
              onChange={(e) => setEventDistance(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
            >
              <option value="400m">400m Flat Sprint</option>
              <option value="200m">200m Sprint</option>
              <option value="100m">100m Dash</option>
              <option value="800m">800m Middle Distance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Electronic Time (seconds)</label>
            <input
              type="text"
              value={recordedTime}
              onChange={(e) => setRecordedTime(e.target.value)}
              placeholder="e.g. 46.82"
              required
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-base text-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Timing Gate Apparatus</label>
            <input
              type="text"
              value={timingGate}
              onChange={(e) => setTimingGate(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Track Venue & Surface</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-[11px] leading-relaxed">
            Organizers will cross-reference the timing stamp with the host federation timing log sheet.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
