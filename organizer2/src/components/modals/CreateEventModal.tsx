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
  const [venue, setVenue] = useState('Main Ground');
  const [capacity, setCapacity] = useState('16');
  const [date, setDate] = useState('Nov 15, 2024');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateEvent({
      title: title.trim(),
      subtitle,
      sport,
      date,
      daysLeft: 14,
      daysLeftColor: 'blue',
      venue,
      registeredCount: 0,
      totalCapacity: parseInt(capacity, 10) || 16,
      status: 'Open',
    });

    showToast(`"${title}" published to SportSphere!`);
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
                placeholder="e.g. Nov 15, 2024"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-2.5 text-[11px] text-blue-700">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Uses 1 Organizer Credit. Auto-creates verification queues &amp; bracket slots.</span>
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
                className="btn-interactive btn-shine px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs shadow-blue-600/30 cursor-pointer"
              >
                Publish Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
