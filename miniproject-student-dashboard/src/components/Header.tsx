import React, { useState, useRef, useEffect } from 'react';
import { UserRole, NavTabId } from '../types';
import { NOTIFICATIONS_DATA } from '../mockData';
import { getLoggedInStudent } from '../utils/userSession';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCvModal: () => void;
  onOpenQuickTrialModal: () => void;
  onOpenUploadSprintModal: () => void;
  showToast: (message: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenCvModal,
  onOpenQuickTrialModal,
  onOpenUploadSprintModal,
  showToast,
}) => {
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreNavOpen, setMoreNavOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [unreadCount, setUnreadCount] = useState(3);
  const student = getLoggedInStudent();
  const studentInitials = student.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SA';

  const quickActionRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (quickActionRef.current && !quickActionRef.current.contains(target)) {
        setQuickActionOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreNavOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        showToast('Quick search activated (⌘K)');
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showToast]);

  const handleRoleSwitch = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`Switched active portal view to: ${role}`);
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setNotificationsOpen(false);
    showToast('All notifications marked as read.');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 shadow-xs backdrop-blur-md bg-white/90">
      {/* Primary Top Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Active Context */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <img
              alt="SportSphere Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WYdl4Y14uT03QWUe8uZhlhlYVQvLVYbnw2fxyBfaOwMwPHI6YKz5LXrc_ycX_83O8F_nh5rK8x7CHr9WckYZmICCIFpNP67hUZKRimBBTG2yUT-3z9n2PZMqkoIsHC4ur9v_4y7yHNnOKKjoDO7ASeazac7ZuysUMW3DF-DwJRgwPpq0p8egN46h3DqcZT2qe_zJHOw22Vm0u4cF5HaRuEDbSNY51q536fkq7MtEO_3ps3JoX_9Oyi6Lj4"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
                SportSphere
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {currentRole === 'Athlete' ? 'Pro Athlete' : `${currentRole} Portal`}
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-none">
                Universal Sports & Talent Platform
              </span>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="hidden xl:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['Athlete', 'Organizer', 'Coach'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSwitch(role)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  currentRole === role
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Centered Global Quick Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (activeTab !== 'discover') setActiveTab('discover');
                  showToast(`Searching competitions for: "${searchQuery}"`);
                }
              }}
              placeholder="Search competitions, meets, scouting trials, venues, metrics..."
              className="w-full h-10 pl-10 pr-14 rounded-xl bg-slate-100/90 border border-slate-200/80 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 transition-all shadow-inner"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-400 shadow-xs pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Action Items & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Action CTA & Flyout */}
          <div className="relative" ref={quickActionRef}>
            <button
              type="button"
              onClick={() => {
                setQuickActionOpen(!quickActionOpen);
                setNotificationsOpen(false);
                setProfileOpen(false);
                setMoreNavOpen(false);
              }}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span className="hidden sm:inline">Quick Action</span>
            </button>

            {quickActionOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 font-semibold text-slate-500 uppercase text-[10px]">
                  Instant Actions
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenQuickTrialModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-left transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600">
                    timer
                  </span>
                  <span>Submit Verified Trial Time</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    setActiveTab('discover');
                    showToast('Opening National Scouting Trials filter...');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-teal-600 text-left transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-600">
                    radar
                  </span>
                  <span>Find National Trials</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickActionOpen(false);
                    onOpenUploadSprintModal();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-amber-600 text-left transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-600">
                    videocam
                  </span>
                  <span>Upload Sprint Footage</span>
                </button>
              </div>
            )}
          </div>

          {/* Scouting Credits Badge */}
          <div
            onClick={() => showToast('You have 84 active Scout Credits remaining this month.')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer hover:bg-blue-100/60 transition-colors"
          >
            <span className="material-symbols-outlined text-blue-600 text-[17px]">radar</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-500 font-semibold uppercase leading-none">
                Scout Credits
              </span>
              <span className="text-xs font-bold text-blue-600 leading-tight">84 / 100</span>
            </div>
          </div>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setQuickActionOpen(false);
                setProfileOpen(false);
                setMoreNavOpen(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                </>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <span className="font-bold text-sm text-slate-900">
                    Notifications ({unreadCount} New)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        showToast(`Opened: ${n.title}`);
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-blue-50/70 hover:border-blue-200 flex items-start gap-2.5 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">
                        {n.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-snug">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => showToast('SportSphere Talent Support desk: 24/7 athlete assistance')}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Help & Knowledge Base"
          >
            <span className="material-symbols-outlined text-[22px]">help</span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setQuickActionOpen(false);
                setNotificationsOpen(false);
                setMoreNavOpen(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 text-left cursor-pointer"
            >
              {student.avatar && student.avatar.startsWith('http') ? (
                <img
                  alt={student.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40 shadow-xs"
                  src={student.avatar}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-500/40 shadow-xs">
                  {studentInitials}
                </div>
              )}
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">{student.name.split(' ')[0]} {student.name.split(' ')[1]?.[0]}.</span>
                <span className="text-[10px] text-blue-600 font-semibold leading-none">
                  {student.sport}
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                expand_more
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{student.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{student.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
                    Federation Athlete
                  </div>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenCvModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                    <span>Full Athlete Bio & CV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setActiveTab('analytics');
                      showToast('Opening Performance Analytics Dashboard...');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">insights</span>
                    <span>Sprint Analytics & Telemetry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      showToast('Opening Billing & Scout Credits Wallet...');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Billing & Scouting Credits</span>
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      try {
                        localStorage.removeItem('sportsphere_student_user');
                        localStorage.removeItem('sportsphere_auth_user');
                        sessionStorage.clear();
                      } catch {}
                      showToast('Signed out of SportSphere active athlete session.');
                      setTimeout(() => {
                        window.location.href = 'http://localhost:3003';
                      }, 350);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Horizontal Mega-Navigation Bar */}
      <div className="bg-white/80 border-t border-slate-200/70 overflow-x-auto scrollbar-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-1 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1 py-1.5 flex-nowrap shrink-0">
            {/* 1. Overview */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Overview</span>
            </button>

            {/* 2. Discover Competitions */}
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'discover'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">emoji_events</span>
              <span>Discover Competitions</span>
            </button>

            {/* 3. Nearby Events Map */}
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>Nearby Events Map</span>
            </button>

            {/* 4. My Registrations */}
            <button
              type="button"
              onClick={() => setActiveTab('registrations')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'registrations'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span>My Registrations</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                4
              </span>
            </button>

            {/* 5. Sports Calendar */}
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Sports Calendar</span>
            </button>

            {/* 7. Achievements */}
            <button
              type="button"
              onClick={() => setActiveTab('achievements')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              <span>Achievements</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                18
              </span>
            </button>

            {/* 8. Analytics */}
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">insights</span>
              <span>Analytics</span>
            </button>

            {/* 9. Scholarships & Trials */}
            <button
              type="button"
              onClick={() => setActiveTab('scholarships')}
              className={`hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'scholarships'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
              <span>Scholarships & Trials</span>
            </button>

            {/* 10. Saved */}
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">bookmark</span>
              <span>Saved</span>
            </button>
          </div>

          {/* "More" Dropdown Menu */}
          <div className="relative shrink-0 py-1.5" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreNavOpen(!moreNavOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <span>More</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {moreNavOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('scholarships');
                    setMoreNavOpen(false);
                    showToast('Loading Scholarships & Trials directory...');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">military_tech</span>
                  <span>Scholarships & Trials</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('saved');
                    setMoreNavOpen(false);
                    showToast('Opening Saved Competitions...');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark</span>
                  <span>Saved Opportunities</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMoreNavOpen(false);
                    onOpenCvModal();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                  <span>Public Athlete CV Link</span>
                </button>
                <div className="p-3 mx-2 my-1 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-medium">Scouting Credits</span>
                    <span className="font-bold text-blue-600">84 / 100</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full w-[84%]"></div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreNavOpen(false);
                      showToast('Opening Platform Settings & Notification Preferences...');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    <span>Platform Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
