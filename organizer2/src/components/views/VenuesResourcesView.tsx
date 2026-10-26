import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { VenueResource } from '../../types';

interface VenuesResourcesViewProps {
  venues: VenueResource[];
  showToast: (msg: string) => void;
}

export const VenuesResourcesView: React.FC<VenuesResourcesViewProps> = ({
  venues,
  showToast,
}) => {
  const [selectedSlotModal, setSelectedSlotModal] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ground Availability Board</h2>
          <p className="text-xs text-slate-500">
            Real-time schedule for campus pitches, synthetic courts, indoor lighting, and turf maintenance.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedSlotModal('Main Ground');
          }}
          className="btn-interactive btn-shine px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Request Grounds Slot</span>
        </button>
      </div>

      {/* Grid of Venues */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{venue.name}</h3>
                {venue.status === 'In Use' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    In Use
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Available
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{venue.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Current Utilization:</span>
                  <span className="font-bold text-slate-900">{venue.utilizationPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      venue.status === 'In Use' ? 'bg-blue-600' : 'bg-teal-500'
                    }`}
                    style={{ width: `${venue.utilizationPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-700 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {venue.currentBooking}
              </div>
              <button
                onClick={() => {
                  setSelectedSlotModal(venue.name);
                }}
                className="btn-interactive w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Book Practice Slot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Slot Modal */}
      {selectedSlotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedSlotModal(null)}
          />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fade-in text-xs">
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Book Slot: {selectedSlotModal}
              </h3>
              <p className="text-slate-500 text-xs mb-4">
                Reserve training, warmup, or scrimmage time on campus.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Grounds slot reserved for ${selectedSlotModal}!`);
                  setSelectedSlotModal(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Date</label>
                  <input
                    type="date"
                    defaultValue="2024-10-25"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Window</label>
                  <select className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500">
                    <option>06:00 AM - 08:00 AM (Morning Warmup)</option>
                    <option>04:00 PM - 06:00 PM (Varsity Practice)</option>
                    <option>06:00 PM - 08:30 PM (Under Floodlights)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sport / Squad</label>
                  <input
                    type="text"
                    defaultValue="JCER Athletics Team"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlotModal(null)}
                    className="btn-interactive px-3 py-1.5 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-interactive btn-shine px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
