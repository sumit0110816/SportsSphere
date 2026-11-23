import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  TrendingDown,
  Bell,
  CheckCircle2,
  Activity,
  Zap,
  BarChart3,
  ChevronRight,
  Camera,
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

const greetingByTime = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

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
    { title: 'Create Competitions', subtitle: 'Build Communities', color: 'from-blue-600 to-indigo-700' },
    { title: 'Scout Top Athletes', subtitle: 'Track Performance Metrics', color: 'from-emerald-600 to-teal-700' },
    { title: 'Automate Tournament Draws', subtitle: 'Real-time Leaderboards', color: 'from-violet-600 to-purple-700' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (sportFilter === 'All') return true;
    return ev.sport.toLowerCase() === sportFilter.toLowerCase();
  });

  const statCards = [
    {
      label: 'Total Events',
      value: events.length,
      trend: '+20%',
      trendUp: true,
      sub: 'vs last sem',
      icon: Sparkles,
      color: 'blue',
      view: 'events' as ViewId,
    },
    {
      label: 'Total Registrations',
      value: 486,
      trend: '+32%',
      trendUp: true,
      sub: 'vs last sem',
      icon: Users,
      color: 'emerald',
      view: 'registrations' as ViewId,
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovalsCount,
      trend: '-12%',
      trendUp: false,
      sub: 'vs last week',
      icon: Clock,
      color: 'amber',
      view: 'registrations' as ViewId,
    },
    {
      label: 'Total Revenue',
      value: '₹48,500',
      trend: '+28%',
      trendUp: true,
      sub: 'vs last sem',
      icon: CreditCard,
      color: 'purple',
      view: 'payments' as ViewId,
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string; hoverBorder: string }> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      hoverBorder: 'hover:border-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      hoverBorder: 'hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      iconBg: 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      hoverBorder: 'hover:border-amber-300',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      iconBg: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      hoverBorder: 'hover:border-purple-300',
    },
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* ── Hero Banner ── */}
      <section className="relative rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[200px] flex items-center justify-between shadow-md border border-slate-800/10">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${organizer.banner || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80'}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />
        {/* Quick Edit Banner Button */}
        <button
          onClick={() => onNavigate('settings')}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Customize Banner in Settings"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Edit Banner</span>
        </button>
        {/* Animated accent gradient */}
        <div className={`absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l ${heroSlides[heroSlide].color} opacity-20 transition-all duration-1000`} />

        {/* Left: Greeting */}
        <div className="relative z-10 px-6 sm:px-8 py-6 sm:py-8 max-w-lg">
          <p className="text-xs sm:text-sm font-normal text-slate-300">{greetingByTime()},</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-0.5 drop-shadow-sm">
            {organizer.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Here's what's happening with your events today.
          </p>
          <div className="mt-4 flex items-center gap-2.5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-semibold">Organizer Dashboard</span>
              <span className="text-slate-400 hidden xs:inline">•</span>
              <span className="text-slate-300 hidden xs:inline truncate max-w-[140px]">{organizer.org}</span>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="btn-interactive btn-shine inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full shadow-md shadow-blue-900/40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Right: Slide content */}
        <div className="relative z-10 hidden md:flex flex-col items-end gap-3 px-8 py-6">
          <div className="text-right">
            <div className="text-lg font-extrabold text-white drop-shadow-sm transition-all duration-500 key={heroSlide}">
              {heroSlides[heroSlide].title}
            </div>
            <div className="text-sm text-slate-300">{heroSlides[heroSlide].subtitle}</div>
          </div>
          {/* Slide indicators */}
          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === heroSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── KPI Stat Cards ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const c = colorMap[stat.color];
          return (
            <button
              key={stat.label}
              onClick={() => onNavigate(stat.view)}
              className={`btn-press bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 ${c.hoverBorder} shadow-2xs hover:shadow-md transition-all group text-left flex flex-col gap-3 cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${c.iconBg}`}>
                  <Icon className="w-5 h-5 transition-all duration-200" />
                </div>
                <div className="text-right">
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                  <div className="text-[10px] text-slate-400">{stat.sub}</div>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-700 transition-colors">
                  {stat.label}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                  {stat.value}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column */}
        <div className="xl:col-span-8 space-y-5 sm:space-y-6">
          {/* My Events Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">My Events</h2>
                  <p className="text-[11px] text-slate-400">Active tournaments & competitions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors group"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="py-3 px-5">Event</th>
                    <th className="py-3 px-3">Sport</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Venue</th>
                    <th className="py-3 px-3 text-center">Regs</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ev.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{ev.subtitle}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">{ev.sport}</span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                        {ev.date}
                        <span className={`text-[10px] block font-bold ${ev.daysLeftColor === 'red' ? 'text-rose-500' : 'text-blue-600'}`}>
                          {ev.daysLeft}d left
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{ev.venue}</td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-slate-900">{ev.registeredCount}/{ev.totalCapacity}</span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-1 bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, (ev.registeredCount / ev.totalCapacity) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        {ev.status === 'Open' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Open
                          </span>
                        ) : ev.status === 'Draft' ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            {ev.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ev.status === 'Draft' ? (
                          <button
                            onClick={() => onPublishEvent(ev.id)}
                            className="btn-interactive px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold cursor-pointer shadow-sm"
                          >
                            Publish
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate('fixtures')}
                            className="btn-interactive px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
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

          {/* Bottom 2-col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Recent Registrations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">Recent Registrations</h3>
                </div>
                <button
                  onClick={() => onNavigate('registrations')}
                  className="btn-press text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5 group"
                >
                  View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {registrations.slice(0, 3).map((reg) => (
                  <div key={reg.id} className="py-3 flex items-center justify-between group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {reg.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{reg.name}</div>
                        <div className="text-[10px] text-slate-400">{reg.sport} • {reg.teamOrCollege}</div>
                      </div>
                    </div>
                    {reg.status === 'Pending' ? (
                      <button
                        onClick={() => onOpenReviewModal(reg)}
                        className="btn-interactive px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg cursor-pointer shrink-0 ml-2"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 rounded-full shrink-0 ml-2">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">Latest Activity</h3>
                </div>
                <button
                  onClick={() => showToast('Activity feed refreshed')}
                  className="btn-press text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-1.5 mt-2">
                {activities.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start justify-between text-xs hover:bg-slate-50 p-2 rounded-lg transition-colors gap-2"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span className="text-slate-700 font-medium leading-relaxed">{act.text}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{act.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-4 sm:space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Create Event', icon: Plus, color: 'blue', action: onOpenCreateModal },
                { label: 'Registrations', icon: Users, color: 'emerald', action: () => onNavigate('registrations') },
                { label: 'Fixtures', icon: CalendarRange, color: 'purple', action: () => onNavigate('fixtures') },
                { label: 'Broadcast', icon: Megaphone, color: 'amber', action: () => onNavigate('announcements') },
              ].map(({ label, icon: Icon, color, action }) => {
                const qc = colorMap[color] || colorMap.blue;
                return (
                  <button
                    key={label}
                    onClick={action}
                    className={`btn-interactive p-3 ${qc.bg} hover:border-current border border-slate-200/80 rounded-xl flex flex-col items-center gap-2 text-center cursor-pointer group shadow-2xs hover:shadow-xs transition-all`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${qc.iconBg}`}>
                      <Icon className="w-4 h-4 transition-all" />
                    </div>
                    <span className={`text-[11px] font-bold ${qc.text} group-hover:opacity-100`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3 mt-3">
              {[
                { title: 'Document verification', sub: '12 registrations pending', badge: 'Today', badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' },
                { title: 'Payment confirmation', sub: '8 registrations', badge: 'Oct 22', badgeClass: 'bg-slate-100 text-slate-600' },
                { title: 'Fixture draw announcement', sub: 'Football Cup bracket', badge: 'Oct 24', badgeClass: 'bg-amber-50 text-amber-700' },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs hover:bg-slate-50 p-2 rounded-lg transition-colors gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{d.title}</div>
                    <div className="text-[10px] text-slate-400">{d.sub}</div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${d.badgeClass}`}>{d.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Utilization */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Venue Utilization</h3>
            </div>
            <div className="space-y-4 mt-3 text-xs">
              {[
                { name: 'Main Ground', pct: 72, color: 'bg-blue-500' },
                { name: 'Indoor Stadium', pct: 48, color: 'bg-teal-500' },
                { name: 'Badminton Court A', pct: 85, color: 'bg-violet-500' },
              ].map((v) => (
                <div key={v.name}>
                  <div className="flex justify-between font-medium text-slate-700 mb-1.5">
                    <span>{v.name}</span>
                    <span className="font-bold text-slate-900">{v.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${v.color} h-1.5 rounded-full transition-all duration-1000`}
                      style={{ width: `${v.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
