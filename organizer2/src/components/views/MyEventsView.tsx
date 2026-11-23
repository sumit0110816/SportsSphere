import React, { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users, ChevronRight, Flame, Trophy, Clock } from 'lucide-react';
import { SportEvent, ViewId } from '../../types';

interface MyEventsViewProps {
  events: SportEvent[];
  onOpenCreateModal: () => void;
  onNavigate: (view: ViewId) => void;
  onPublishEvent: (id: string) => void;
  showToast: (msg: string) => void;
}

const SPORT_COLORS: Record<string, { bg: string; text: string }> = {
  Football: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Badminton: { bg: 'bg-sky-100', text: 'text-sky-700' },
  Basketball: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Athletics: { bg: 'bg-violet-100', text: 'text-violet-700' },
};

export const MyEventsView: React.FC<MyEventsViewProps> = ({
  events,
  onOpenCreateModal,
  onNavigate,
  onPublishEvent,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Draft'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = events.filter(e => e.status === 'Open').length;
  const draftCount = events.filter(e => e.status === 'Draft').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">My Events</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, organize, and monitor all tournaments.</p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="btn-interactive btn-shine inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Event
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: events.length, icon: Trophy, color: 'blue' },
          { label: 'Open', value: openCount, icon: Flame, color: 'emerald' },
          { label: 'Draft', value: draftCount, icon: Clock, color: 'amber' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`bg-white rounded-xl border border-slate-200 p-3 sm:p-4 flex items-center gap-3 shadow-2xs`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              color === 'blue' ? 'bg-blue-100 text-blue-600' :
              color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
              'bg-amber-100 text-amber-600'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">{value}</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(['All', 'Open', 'Draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-400 outline-hidden hover:border-slate-300 transition-colors w-48"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((ev) => {
          const sportStyle = SPORT_COLORS[ev.sport] || { bg: 'bg-slate-100', text: 'text-slate-700' };
          const fillPct = Math.min(100, Math.round((ev.registeredCount / ev.totalCapacity) * 100));
          return (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg shadow-2xs transition-all group flex flex-col overflow-hidden"
            >
              {/* Card header band */}
              <div className={`h-1.5 ${ev.status === 'Open' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-orange-400'}`} />

              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Badges row */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${sportStyle.bg} ${sportStyle.text}`}>
                    {ev.sport}
                  </span>
                  {ev.status === 'Open' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Draft
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ev.subtitle}</p>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{ev.date}</span>
                    <span className={`ml-auto font-bold text-[10px] ${ev.daysLeftColor === 'red' ? 'text-rose-500' : 'text-blue-500'}`}>
                      {ev.daysLeft}d left
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>

                {/* Registration fill bar */}
                <div className="mt-auto pt-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {ev.registeredCount} / {ev.totalCapacity} Teams
                    </span>
                    <span className="text-slate-700 font-bold">{fillPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        fillPct > 80 ? 'bg-rose-500' : fillPct > 50 ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="px-4 pb-4">
                {ev.status === 'Draft' ? (
                  <button
                    onClick={() => onPublishEvent(ev.id)}
                    className="btn-interactive w-full py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer shadow-sm shadow-blue-600/25 flex items-center justify-center gap-1.5"
                  >
                    Publish Event
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('fixtures')}
                    className="btn-interactive w-full py-2 text-xs font-bold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                  >
                    View Bracket
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 text-sm">No events found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or create a new event.</p>
            <button
              onClick={onOpenCreateModal}
              className="mt-4 btn-interactive px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
            >
              + Create Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
