import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UsersRound,
  CalendarRange,
  Trophy,
  CreditCard,
  MapPin,
  Megaphone,
  FileCheck,
  BarChart3,
  Settings,
  ChevronDown,
  Shield,
  LifeBuoy,
  MessageSquare,
  X,
  LogOut
} from 'lucide-react';
import { ViewId } from '../../types';
import { getLoggedInOrganizer } from '../../utils/userSession';

interface SidebarProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  onOpenSupportModal: () => void;
  pendingApprovalsCount: number;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  id: ViewId;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenSupportModal,
  pendingApprovalsCount,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const organizer = getLoggedInOrganizer();
  const navItems: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'My Events', icon: Calendar },
    {
      id: 'registrations',
      label: 'Registrations',
      icon: Users,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { id: 'teams', label: 'Teams & Athletes', icon: UsersRound },
    { id: 'fixtures', label: 'Fixtures & Schedule', icon: CalendarRange },
    { id: 'scores', label: 'Scores & Results', icon: Trophy },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'venues', label: 'Venues & Resources', icon: MapPin },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'certificates', label: 'Certificates', icon: FileCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: ViewId) => {
    onNavigate(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto">
      <div className="p-3">
        {/* Mobile Header in Drawer */}
        <div className="md:hidden flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              SS
            </div>
            <span className="font-bold text-slate-900 text-sm">Navigation Menu</span>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 active:scale-90"
              aria-label="Close navigation drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Organization Selector Card */}
        <button
          onClick={() => handleItemClick('settings')}
          className="btn-press w-full mb-4 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 group-hover:bg-amber-500/25 transition-all duration-200">
              <Shield className="w-4 h-4 text-amber-700" strokeWidth={2.2} />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-900 transition-colors">
                {organizer.org || 'Sports Association'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {organizer.title || 'Event Organizer'}
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:text-slate-700 group-hover:translate-y-0.5 transition-all duration-200" />
        </button>

        {/* Navigation Menu Links */}
        <nav className="space-y-0.5 text-xs font-medium text-slate-600">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-lg transition-all duration-150 cursor-pointer text-left group active:scale-[0.98] ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    strokeWidth={isActive ? 2.2 : 2}
                  />
                  <span className="transition-colors">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-600 text-white leading-none shadow-2xs group-hover:scale-105 transition-transform">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Support Box */}
      <div className="p-3 border-t border-slate-200">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5 transition-transform duration-300 hover:rotate-45" strokeWidth={2} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Need Help?</div>
              <div className="text-[11px] text-slate-500">Contact our support team</div>
            </div>
          </div>
          <button
            onClick={() => {
              onOpenSupportModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="btn-interactive mt-3 w-full py-1.5 px-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
            <span className="group-hover:text-slate-900 transition-colors">Contact Support</span>
          </button>

          <button
            onClick={() => {
              try {
                localStorage.removeItem('sportsphere_organizer_user');
                localStorage.removeItem('sportsphere_auth_user');
                sessionStorage.clear();
              } catch {}
              if (onCloseMobile) onCloseMobile();
              setTimeout(() => {
                window.location.href = 'http://localhost:3003';
              }, 300);
            }}
            className="btn-interactive mt-2 w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop & Drawer */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Pane */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col transform transition-transform duration-300 ease-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
