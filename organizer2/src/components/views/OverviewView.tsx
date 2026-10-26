import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Clock,
  CreditCard,
  Calendar,
  ArrowRight,
  Plus,
  CalendarRange,
  Megaphone,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ViewId, SportEvent, RegistrationApplicant, ActivityItem } from '../../types';
import { getLoggedInOrganizer } from '../../utils/userSession';

interface OverviewViewProps {
  events: SportEvent[];
  registrations: RegistrationApplicant[];
  activities: ActivityItem[];
  onNavigate: (view: ViewId) => void;
  onOpenCreateModal: () => void;
  onOpenReviewModal: (applicant: RegistrationApplicant) => void;
  onPublishEvent: (id: string) => void;
  showToast: (msg: string) => void;
  pendingApprovalsCount: number;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  events,
  registrations,
  activities,
  onNavigate,
  onOpenCreateModal,
  onOpenReviewModal,
  onPublishEvent,
  showToast,
  pendingApprovalsCount,
}) => {
  const [sportFilter, setSportFilter] = useState('All');
  const [heroSlide, setHeroSlide] = useState(0);
  const organizer = getLoggedInOrganizer();

  const heroSlides = [
    { title: 'Create Competitions', subtitle: 'Build Communities' },
    { title: 'Scout Top Athletes', subtitle: 'Track Performance Metrics' },
    { title: 'Automate Tournament Draws', subtitle: 'Real-time Leaderboards' },
  ];

  const filteredEvents = events.filter((ev) => {
    if (sportFilter === 'All') return true;
    return ev.sport.toLowerCase() === sportFilter.toLowerCase();
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 min-h-[170px] sm:min-h-[190px] flex items-center justify-between p-4 sm:p-6 md:p-8 bg-slate-900">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2kKYWPvDLt8Opmxf3_N1AOQIkISBdQZ9p4Bi4ZRdoxytIbPDuH_hSGbxznYSdaqrOvnUqtx6xLPfkpoWx7KVFyHFryTdsuGladAI7NPBqwxQL6b1HZGpqqW6g2F8U2IERVyoiH4zfG1iLcC-wc_5t8kta3uW4wtWEs1f0BMNfFAHt3tS29Sy_AnYROMc6j2nZdobrx8HM8d3Ty78UjxA1hnvxqFp7zBI9eb8EM8JHOynyqsTsaW9RaA')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl text-white">
          <div className="text-xs sm:text-sm font-normal text-slate-300">
            Good Evening,
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-0.5 text-white">
            {organizer.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
            Here's what's happening with your events today.
          </p>
          <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[11px] sm:text-xs text-white hover:border-white/30 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-medium text-slate-200">Organizer Dashboard</span>
            <span className="text-slate-400 hidden xs:inline">•</span>
            <span className="text-slate-300 hidden xs:inline truncate">{organizer.org}</span>
          </div>
        </div>

        <div className="relative z-10 hidden lg:flex flex-col items-end text-white">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-base font-bold tracking-tight text-white drop-shadow-sm transition-all duration-300">
                {heroSlides[heroSlide].title}
              </div>
              <div className="text-xs text-slate-200 drop-shadow-sm">
                {heroSlides[heroSlide].subtitle}
              </div>
            </div>
            <button
              onClick={() => {
                const next = (heroSlide + 1) % heroSlides.length;
                setHeroSlide(next);
                showToast(`Showcase view: ${heroSlides[next].title}`);
              }}
              className="btn-interactive w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white cursor-pointer active:scale-90"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4 transition-transform duration-200 hover:translate-x-0.5" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pr-1">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === heroSlide ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* KPI Metrics: 2 columns on phone screens, 4 on desktop */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* TOTAL EVENTS */}
        <div
          onClick={() => onNavigate('events')}
          className="btn-press bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2.5 sm:gap-4 mb-2 sm:mb-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-200">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Total Events
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">12</div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600">
              ↑ 20%
            </span>
            <div className="text-[9px] sm:text-[10px] text-slate-400">vs last sem</div>
          </div>
        </div>

        {/* TOTAL REGISTRATIONS */}
        <div
          onClick={() => onNavigate('registrations')}
          className="btn-press bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2.5 sm:gap-4 mb-2 sm:mb-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-200">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Total Registrations
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">486</div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600">
              ↑ 32%
            </span>
            <div className="text-[9px] sm:text-[10px] text-slate-400">vs last sem</div>
          </div>
        </div>

        {/* PENDING APPROVALS */}
        <div
          onClick={() => onNavigate('registrations')}
          className="btn-press bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2.5 sm:gap-4 mb-2 sm:mb-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-200">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
                Pending Approvals
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {pendingApprovalsCount}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-rose-600">
              ↓ 12%
            </span>
            <div className="text-[9px] sm:text-[10px] text-slate-400">vs last week</div>
          </div>
        </div>

        {/* TOTAL REVENUE */}
        <div
          onClick={() => onNavigate('payments')}
          className="btn-press bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2.5 sm:gap-4 mb-2 sm:mb-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-200">
              <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-purple-600 transition-colors">
                Total Revenue
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                ₹48,500
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600">
              ↑ 28%
            </span>
            <div className="text-[9px] sm:text-[10px] text-slate-400">vs last sem</div>
          </div>
        </div>
      </section>

      {/* Split Layout: Table + Side Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 space-y-5 sm:space-y-6">
          {/* My Events Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">My Events</h2>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-2.5 pr-7 text-slate-700 font-medium cursor-pointer outline-hidden hover:border-slate-300 transition-colors"
                >
                  <option value="All">All Sports</option>
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Athletics">Athletics</option>
                </select>
                <button
                  onClick={() => onNavigate('events')}
                  className="btn-press text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors group"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Table with responsive horizontal scroll wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 sm:px-5">Event</th>
                    <th className="py-3 px-3">Sport</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Venue</th>
                    <th className="py-3 px-3 text-center">Registrations</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredEvents.map((ev) => (
                    <tr
                      key={ev.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-5">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ev.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {ev.subtitle}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{ev.sport}</td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {ev.date}{' '}
                        <span
                          className={`text-[10px] block font-semibold ${
                            ev.daysLeftColor === 'red'
                              ? 'text-rose-500'
                              : 'text-blue-600'
                          }`}
                        >
                          {ev.daysLeft} days left
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">{ev.venue}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                        {ev.registeredCount} / {ev.totalCapacity}
                      </td>
                      <td className="py-3.5 px-3">
                        {ev.status === 'Open' ? (
                          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            Open
                          </span>
                        ) : ev.status === 'Draft' ? (
                          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                            {ev.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ev.status === 'Draft' ? (
                          <button
                            onClick={() => onPublishEvent(ev.id)}
                            className="btn-interactive px-2.5 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md font-semibold cursor-pointer"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate('fixtures')}
                            className="btn-interactive px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-md font-medium cursor-pointer"
                          >
                            Bracket
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom 2-col cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Registrations Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900">
                  Recent Registrations
                </h3>
                <button
                  onClick={() => onNavigate('registrations')}
                  className="btn-press text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-100 mt-1">
                {registrations.slice(0, 2).map((reg) => (
                  <div
                    key={reg.id}
                    className="py-3 flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {reg.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {reg.sport} • {reg.teamOrCollege}
                      </div>
                    </div>
                    {reg.status === 'Pending' ? (
                      <button
                        onClick={() => onOpenReviewModal(reg)}
                        className="btn-interactive px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md cursor-pointer"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-600 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Activity Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900">Latest Activity</h3>
                <button
                  onClick={() => showToast('Activity feed refreshed')}
                  className="btn-press text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-2.5 mt-3">
                {activities.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                  >
                    <span className="text-slate-800 font-medium">
                      {act.text}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap pl-2">
                      {act.timeAgo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Widgets (4 cols) */}
        <div className="xl:col-span-4 space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              QUICK ACTIONS
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                onClick={onOpenCreateModal}
                className="btn-interactive p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-xl flex items-center gap-2.5 text-left cursor-pointer group shadow-2xs hover:shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                  Create Event
                </div>
              </button>

              <button
                onClick={() => onNavigate('registrations')}
                className="btn-interactive p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl flex items-center gap-2.5 text-left cursor-pointer group shadow-2xs hover:shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <Users className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                  Registrations
                </div>
              </button>

              <button
                onClick={() => onNavigate('fixtures')}
                className="btn-interactive p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 rounded-xl flex items-center gap-2.5 text-left cursor-pointer group shadow-2xs hover:shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <CalendarRange className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-purple-900 transition-colors">
                  Fixtures
                </div>
              </button>

              <button
                onClick={() => onNavigate('announcements')}
                className="btn-interactive p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 rounded-xl flex items-center gap-2.5 text-left cursor-pointer group shadow-2xs hover:shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-115 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200 shadow-2xs">
                  <Megaphone className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-amber-900 transition-colors">
                  Broadcast
                </div>
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 pb-3 border-b border-slate-100">
              Upcoming Deadlines
            </h3>
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                <div>
                  <div className="font-bold text-slate-900">Document verification</div>
                  <div className="text-[11px] text-slate-400">
                    12 registrations pending
                  </div>
                </div>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded animate-pulse">Today</span>
              </div>
              <div className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                <div>
                  <div className="font-bold text-slate-900">Payment confirmation</div>
                  <div className="text-[11px] text-slate-400">8 registrations</div>
                </div>
                <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Oct 22</span>
              </div>
            </div>
          </div>

          {/* Venue Utilization */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 pb-3 border-b border-slate-100">
              Venue Utilization
            </h3>
            <div className="space-y-3 mt-3 text-xs">
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Main Ground</span>
                  <span className="font-bold text-slate-900">72%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: '72%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Indoor Stadium</span>
                  <span className="font-bold text-slate-900">48%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: '48%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
