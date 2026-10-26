import React, { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SportEvent, ViewId } from '../../types';

interface MyEventsViewProps {
  events: SportEvent[];
  onOpenCreateModal: () => void;
  onNavigate: (view: ViewId) => void;
  onPublishEvent: (id: string) => void;
  showToast: (msg: string) => void;
}

export const MyEventsView: React.FC<MyEventsViewProps> = ({
  events,
  onOpenCreateModal,
  onNavigate,
  onPublishEvent,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Draft'>('All');

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tournament Directory</h2>
          <p className="text-xs text-slate-500">
            Manage, organize, and monitor all campus tournaments and varsity championships.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments, sports..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-hidden hover:border-slate-300 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-hidden hover:border-slate-300 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Draft">Draft</option>
          </select>
          <button
            onClick={onOpenCreateModal}
            className="btn-interactive btn-shine px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Grid of Tournament Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors">
                  {ev.sport}
                </span>
                {ev.status === 'Open' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    Open
                  </span>
                ) : ev.status === 'Draft' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                    Draft
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {ev.status}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{ev.title}</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                {ev.date} • {ev.venue}
              </p>

              <div className="mt-3 p-2 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-slate-800">{ev.subtitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enrolled:</span>
                  <span className="font-bold text-slate-900">
                    {ev.registeredCount} / {ev.totalCapacity}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {ev.registeredCount} / {ev.totalCapacity} Teams
              </span>
              {ev.status === 'Draft' ? (
                <button
                  onClick={() => onPublishEvent(ev.id)}
                  className="btn-press text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                >
                  Publish Now →
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('fixtures')}
                  className="btn-press text-blue-600 hover:text-blue-800 font-bold cursor-pointer flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>View Brackets</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
