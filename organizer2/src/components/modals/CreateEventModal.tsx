import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Trophy, Sparkles } from 'lucide-react';
import { SportEvent } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Omit<SportEvent, 'id'>) => void;
  showToast: (msg: string) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
  showToast,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState("Men's & Women's • Intercollege");
  const [sport, setSport] = useState('Football');
  const [circuitTier, setCircuitTier] = useState<'District' | 'State' | 'National' | 'University'>('District');
  const [district, setDistrict] = useState('Belagavi');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Belagavi');
  const [venue, setVenue] = useState('Main Ground JCER');
  const [capacity, setCapacity] = useState('16');
  const [date, setDate] = useState('Dec 15, 2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateEvent({
      title: title.trim(),
      subtitle,
      sport,
      circuitTier,
      district,
      state,
      city: city || district,
      date,
      daysLeft: 14,
      daysLeftColor: 'blue',
      venue,
      registeredCount: 0,
      totalCapacity: parseInt(capacity, 10) || 16,
      status: 'pending',
    });

    showToast(`"${title}" submitted for Admin Sanction (:3003)!`);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in text-xs">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Trophy className="w-4 h-4 animate-bounce" style={{ animationIterationCount: 2 }} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Create New Sports Tournament</h3>
            </div>
            <button
              onClick={onClose}
              className="btn-press p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tournament Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Inter-College Table Tennis Championship"
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sport Discipline <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-blue-500 outline-hidden transition-colors"
                >
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Volleyball">Volleyball</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category / Division
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Men's • Intercollegiate"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Circuit Level / Tier <span className="text-rose-500">*</span>
                </label>
                <select
                  value={circuitTier}
                  onChange={(e) => setCircuitTier(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white focus:border-blue-500 outline-hidden transition-colors font-medium"
                >
                  <option value="District">District Level</option>
                  <option value="State">State Level</option>
                  <option value="National">National Level</option>
                  <option value="University">University Level</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category / Division
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Men's • Intercollegiate"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Belagavi"
                  required
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  required
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City / Zone
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Belagavi"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Venue <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Main Ground JCER"
                  required
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Max Slots / Teams
                </label>
                <input
                  type="number"
                  min="2"
                  max="128"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tournament Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Dec 15, 2026"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-2.5 text-[11px] text-amber-800">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>🛡️ Platform Admin Review:</strong> All events undergo administrative sanctioning on Port 3003. Once approved, the event will instantly appear for Athlete (:3000) & Coach (:3002) registration.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="btn-interactive px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-interactive btn-shine px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <span>Submit for Admin Sanction</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
