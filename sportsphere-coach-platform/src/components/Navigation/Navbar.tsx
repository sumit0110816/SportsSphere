import React from 'react';
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Trophy,
  Newspaper,
  Radar,
  UserCheck,
  Award,
  Video,
  Users,
} from 'lucide-react';
import { TabView } from '../../types/sports';
import { getLoggedInCoach } from '../../utils/userSession';

interface NavbarProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  const [coach, setCoach] = React.useState(() => getLoggedInCoach());
  React.useEffect(() => {
    const handleUpdate = () => setCoach(getLoggedInCoach());
    window.addEventListener('coach-profile-updated', handleUpdate);
    return () => window.removeEventListener('coach-profile-updated', handleUpdate);
  }, []);
  const initials = coach.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CP';
  const navItems: { key: TabView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'tournaments', label: 'Tournaments', icon: Trophy },
    { key: 'news', label: 'Sports News', icon: Newspaper },
    { key: 'radar', label: 'Radar', icon: Radar },
    { key: 'profile', label: 'Profile', icon: UserCheck },
    { key: 'rankings', label: 'Rankings', icon: Award },
    { key: 'highlights', label: 'Highlights', icon: Video },
    { key: 'network', label: 'Network', icon: Users },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#FAF8FF]/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Zone 1: Menu toggle + Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2 text-left group"
          >
            {/* SportSync Emblem */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0037B0] to-[#1D4ED8] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm tracking-tight">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-base tracking-tight text-[#131B2E]">
                SportSync
              </span>
              <span className="hidden sm:inline text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-none">
                Coach Platform
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Action Affordances */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Universal Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Search (athletes, tournaments, tactics)"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Logged in Coach Avatar with status dot */}
          <button
            onClick={() => onTabChange('profile')}
            className="relative shrink-0 ml-1 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full cursor-pointer"
            title={`${coach.name} (Profile)`}
          >
            {coach.avatar && coach.avatar.startsWith('http') ? (
              <img src={coach.avatar} alt={coach.name} className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0037B0] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              try {
                localStorage.removeItem('sportsphere_coach_user');
                localStorage.removeItem('sportsphere_auth_user');
                sessionStorage.clear();
              } catch {}
              setTimeout(() => {
                window.location.href = 'http://localhost:3004';
              }, 300);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer active:scale-95 shadow-2xs ml-1"
            title="Log out of Coach Platform"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Navigation Ribbon (matches Athlete Dashboard) */}
      <div className="border-t border-slate-200/70 bg-[#FAF8FF]/95 backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
          <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
