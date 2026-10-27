import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Plus, 
  Bell, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { UserRole, ViewId } from '../../types';
import { getLoggedInOrganizer } from '../../utils/userSession';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenCreateModal: () => void;
  onOpenCmdPalette: () => void;
  onNavigate: (view: ViewId) => void;
  showToast: (msg: string) => void;
  pendingApprovalsCount: number;
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenCreateModal,
  onOpenCmdPalette,
  onNavigate,
  showToast,
  pendingApprovalsCount,
  isMobileSidebarOpen = false,
  onToggleMobileSidebar,
}) => {
  const [showCreditsPopover, setShowCreditsPopover] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [organizer, setOrganizer] = useState(() => getLoggedInOrganizer());
  useEffect(() => {
    const handleUpdate = () => setOrganizer(getLoggedInOrganizer());
    window.addEventListener('organizer-profile-updated', handleUpdate);
    return () => window.removeEventListener('organizer-profile-updated', handleUpdate);
  }, []);
  const organizerInitials = organizer.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'OR';

  const creditsRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (creditsRef.current && !creditsRef.current.contains(event.target as Node)) {
        setShowCreditsPopover(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-max">
          {/* Mobile Hamburger Menu Button */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 rounded-lg transition-all cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isMobileSidebarOpen ? (
                <X className="w-5 h-5 text-blue-600" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-hidden cursor-pointer transition-transform duration-200 active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-200">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-[17px] sm:text-[19px] font-bold tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                SportSphere
              </div>
              <div className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide leading-none mt-1">
                Universal Sports &amp; Talent Platform
              </div>
            </div>
          </button>

          {/* Role Switcher Pills */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-full text-xs font-semibold text-slate-600 border border-slate-200/80">
            {(['Athlete', 'Organizer', 'Coach'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  onRoleChange(role);
                  showToast(`Switched to ${role} Portal View`);
                }}
                className={`px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-200 active:scale-95 ${
                  currentRole === role
                    ? 'bg-blue-600 text-white shadow-xs font-semibold scale-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {role}
              </button>
            ))}
          </nav>
        </div>

        {/* Global Search Bar Trigger (Desktop) */}
        <div className="flex-1 max-w-xl mx-2 relative hidden lg:block">
          <div
            onClick={onOpenCmdPalette}
            className="relative flex items-center cursor-pointer group transition-all duration-200 active:scale-[0.99]"
          >
            <span className="absolute left-3.5 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              className="w-full bg-slate-100/80 hover:bg-slate-100 text-xs border border-transparent hover:border-blue-300 transition-all duration-200 rounded-full pl-9 pr-14 py-2 cursor-pointer outline-hidden text-slate-700 placeholder:text-slate-400 shadow-2xs hover:shadow-xs"
              placeholder="Search events, registrations, teams... (Press ⌘K)"
              readOnly
            />
            <span className="absolute right-3 inline-flex items-center px-1.5 py-0.5 border border-slate-300 rounded text-[10px] text-slate-500 font-medium bg-white shadow-2xs pointer-events-none group-hover:border-blue-300 group-hover:text-blue-600 transition-colors">
              ⌘K
            </span>
          </div>
        </div>

        {/* Action Items & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Icon Button */}
          <button
            onClick={onOpenCmdPalette}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-90 rounded-full transition-all cursor-pointer"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Create Event Button with shine and tactile press */}
          <button
            onClick={onOpenCreateModal}
            className="btn-shine btn-interactive btn-pulse inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform duration-200" strokeWidth={2.5} />
            <span className="hidden xs:inline sm:inline">Create Event</span>
            <span className="xs:hidden sm:hidden inline">Create</span>
          </button>

          {/* Organizer Credits Pill with interactive popover */}
          <div className="relative hidden xl:block" ref={creditsRef}>
            <button
              onClick={() => setShowCreditsPopover(!showCreditsPopover)}
              className="btn-press flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 rounded-full text-xs text-slate-700 cursor-pointer transition-all"
            >
              <div className="relative w-4 h-4 flex items-center justify-center text-blue-600">
                <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#bfdbfe"
                    strokeWidth="4"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeDasharray="30, 100"
                    strokeWidth="4"
                  />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-slate-600">
                Organizer Credits <strong className="text-blue-700 font-bold">3 / 10</strong> Events
              </span>
            </button>

            {showCreditsPopover && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-xs z-50 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Campus Enterprise Plan</span>
                </div>
                <p className="text-slate-500 text-[11px] mb-3">
                  7 of 10 annual championship tournament hosting credits remaining for JCER.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-3 space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Used in 2024:</span>
                    <span className="font-semibold text-slate-900">3 events</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Next renewal:</span>
                    <span className="font-semibold text-slate-900">Dec 31, 2024</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('Upgrade request dispatched to JCER Dean of Physical Education');
                    setShowCreditsPopover(false);
                  }}
                  className="btn-interactive w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs"
                >
                  Top-up Event Credits
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell Icon */}
          <div className="relative" ref={notifRef}>
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-90 rounded-full transition-all duration-150 relative cursor-pointer"
            >
              <Bell className="w-5 h-5 transition-transform duration-200 hover:rotate-12" />
              {unreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <button
                    onClick={() => {
                      setUnreadNotifications(false);
                      showToast('All notifications marked as read');
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors active:scale-95"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2">
                  <div
                    onClick={() => {
                      onNavigate('registrations');
                      setShowNotifDropdown(false);
                    }}
                    className="p-2.5 bg-blue-50/70 hover:bg-blue-100/70 active:scale-[0.98] rounded-lg cursor-pointer transition-all duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-slate-900">
                        {pendingApprovalsCount} New Registrations
                      </div>
                      <span className="text-[10px] text-blue-600 font-medium">Just now</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Awaiting clearance for Intercollege Football Cup
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      onNavigate('venues');
                      setShowNotifDropdown(false);
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] rounded-lg cursor-pointer transition-all duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-slate-900">Venue Cleared</div>
                      <span className="text-[10px] text-slate-400">1 hr ago</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Indoor Stadium booked for badminton finals
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      onNavigate('scores');
                      setShowNotifDropdown(false);
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] rounded-lg cursor-pointer transition-all duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-slate-900">Live Score Verified</div>
                      <span className="text-[10px] text-slate-400">3 hrs ago</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Basketball League Match #4 official score approved
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Icon */}
          <button
            onClick={() => showToast('Help Desk: jcer-sports@support.ac.in • Ext: 402')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-90 rounded-full transition-all duration-150 hidden sm:block cursor-pointer"
            title="Help Desk"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative ml-1 pl-1 sm:pl-2 border-l border-slate-200">
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 active:scale-95 transition-all duration-150 focus:outline-hidden text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 border border-slate-300 ring-1 ring-slate-100 shrink-0 group-hover:ring-blue-400 transition-all flex items-center justify-center text-white font-bold text-xs">
                {organizer.avatar && organizer.avatar.startsWith('http') ? (
                  <img
                    alt={organizer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    src={organizer.avatar}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{organizerInitials}</span>
                )}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{organizer.name}</div>
                <div className="text-[10px] text-blue-600 font-medium leading-tight">
                  {organizer.org}
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('sportsphere_organizer_user');
                  localStorage.removeItem('sportsphere_auth_user');
                  sessionStorage.clear();
                } catch {}
                showToast('Signed out of SportSphere Organizer Portal');
                setTimeout(() => {
                  window.location.href = 'http://localhost:3003';
                }, 350);
              }}
              title="Log out from SportSphere"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Role Switcher Bar on Phones */}
      <div className="md:hidden px-3 py-1.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-1 overflow-x-auto">
        <span className="text-[11px] font-semibold text-slate-500 pl-1">Role:</span>
        <div className="flex items-center gap-1">
          {(['Athlete', 'Organizer', 'Coach'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => {
                onRoleChange(role);
                showToast(`Switched to ${role} Portal View`);
              }}
              className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-all duration-150 active:scale-95 ${
                currentRole === role
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
