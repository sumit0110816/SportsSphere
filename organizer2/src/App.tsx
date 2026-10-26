import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CalendarRange, 
  Menu,
  ShieldAlert,
  Trophy
} from 'lucide-react';
import { ViewId, UserRole, SportEvent, RegistrationApplicant, ActivityItem } from './types';
import {
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_TEAMS,
  INITIAL_SCORES,
  INITIAL_VENUES,
} from './data/mockData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { CommandPalette } from './components/common/CommandPalette';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { ReviewApplicantModal } from './components/modals/ReviewApplicantModal';
import { SupportModal } from './components/modals/SupportModal';

import { OverviewView } from './components/views/OverviewView';
import { MyEventsView } from './components/views/MyEventsView';
import { RegistrationsView } from './components/views/RegistrationsView';
import { TeamsAthletesView } from './components/views/TeamsAthletesView';
import { FixturesScheduleView } from './components/views/FixturesScheduleView';
import { ScoresResultsView } from './components/views/ScoresResultsView';
import { PaymentsView } from './components/views/PaymentsView';
import { VenuesResourcesView } from './components/views/VenuesResourcesView';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { CertificatesView } from './components/views/CertificatesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('Organizer');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States
  const [events, setEvents] = useState<SportEvent[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<RegistrationApplicant[]>(INITIAL_REGISTRATIONS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Modals & Overlays
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [reviewApplicant, setReviewApplicant] = useState<RegistrationApplicant | null>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdPaletteOpen(false);
        setIsCreateModalOpen(false);
        setIsSupportModalOpen(false);
        setReviewApplicant(null);
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Event Handlers
  const handleCreateEvent = (newEventData: Omit<SportEvent, 'id'>) => {
    const created: SportEvent = {
      ...newEventData,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [created, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        text: `New event published: ${created.title}`,
        timeAgo: 'Just now',
        type: 'schedule',
      },
      ...prev,
    ]);
  };

  const handlePublishEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'Open' } : ev))
    );
    showToast('Event published and opened for athlete registrations!');
  };

  const handleApplicantDecision = (id: string, decision: 'Approved' | 'Declined') => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status: decision } : reg))
    );
    const applicant = registrations.find((r) => r.id === id);
    if (applicant) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          text: `Registration ${decision.toLowerCase()}: ${applicant.name}`,
          timeAgo: 'Just now',
          type: 'registration',
        },
        ...prev,
      ]);
    }
    showToast(
      decision === 'Approved'
        ? 'Registration approved & athlete pass generated!'
        : 'Registration declined.'
    );
  };

  const handleBatchApprove = () => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.status === 'Pending' ? { ...reg, status: 'Approved' } : reg))
    );
    showToast('All pending registrations approved and passes issued!');
  };

  const pendingApprovalsCount = registrations.filter((r) => r.status === 'Pending').length;

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenCmdPalette={() => setIsCmdPaletteOpen(true)}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileSidebarOpen(false);
        }}
        showToast={showToast}
        pendingApprovalsCount={pendingApprovalsCount}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Desktop fixed + Mobile slide-out drawer) */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }}
          onOpenSupportModal={() => setIsSupportModalOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
          isOpenOnMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Area with bottom padding on mobile for the navbar */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-5 pb-24 md:pb-6">
          {/* Active Role Notice if not Organizer */}
          {currentRole !== 'Organizer' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 animate-fade-in">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Viewing platform in <strong>{currentRole} Mode</strong>. All events and rosters reflect live varsity schedules.
                </span>
              </div>
              <button
                onClick={() => {
                  setCurrentRole('Organizer');
                  showToast('Restored Organizer Dashboard');
                }}
                className="btn-interactive text-blue-700 underline font-semibold text-xs ml-2 cursor-pointer shrink-0"
              >
                Return to Organizer
              </button>
            </div>
          )}

          {currentView === 'overview' && (
            <OverviewView
              events={events}
              registrations={registrations}
              activities={activities}
              onNavigate={setCurrentView}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenReviewModal={(applicant) => setReviewApplicant(applicant)}
              onPublishEvent={handlePublishEvent}
              showToast={showToast}
              pendingApprovalsCount={pendingApprovalsCount}
            />
          )}

          {currentView === 'events' && (
            <MyEventsView
              events={events}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onNavigate={setCurrentView}
              onPublishEvent={handlePublishEvent}
              showToast={showToast}
            />
          )}

          {currentView === 'registrations' && (
            <RegistrationsView
              registrations={registrations}
              onDecision={handleApplicantDecision}
              onBatchApprove={handleBatchApprove}
              onOpenReviewModal={(applicant) => setReviewApplicant(applicant)}
              showToast={showToast}
            />
          )}

          {currentView === 'teams' && (
            <TeamsAthletesView
              teams={INITIAL_TEAMS}
              showToast={showToast}
            />
          )}

          {currentView === 'fixtures' && (
            <FixturesScheduleView showToast={showToast} />
          )}

          {currentView === 'scores' && (
            <ScoresResultsView
              initialScores={INITIAL_SCORES}
              showToast={showToast}
            />
          )}

          {currentView === 'payments' && (
            <PaymentsView showToast={showToast} />
          )}

          {currentView === 'venues' && (
            <VenuesResourcesView
              venues={INITIAL_VENUES}
              showToast={showToast}
            />
          )}

          {currentView === 'announcements' && (
            <AnnouncementsView showToast={showToast} />
          )}

          {currentView === 'certificates' && (
            <CertificatesView showToast={showToast} />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView />
          )}

          {currentView === 'settings' && (
            <SettingsView showToast={showToast} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phone-friendly 1-tap thumb navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentView('overview')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'overview'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => setCurrentView('events')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'events'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Events</span>
        </button>

        <button
          onClick={() => setCurrentView('registrations')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors relative cursor-pointer ${
            currentView === 'registrations'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Regs</span>
          {pendingApprovalsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-600" />
          )}
        </button>

        <button
          onClick={() => setCurrentView('fixtures')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'fixtures'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarRange className="w-5 h-5" />
          <span className="text-[10px]">Fixtures</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

      {/* Global Modals & Dialogs */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        showToast={showToast}
      />

      <ReviewApplicantModal
        isOpen={reviewApplicant !== null}
        applicant={reviewApplicant}
        onClose={() => setReviewApplicant(null)}
        onDecision={handleApplicantDecision}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        showToast={showToast}
      />

      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
        onNavigate={setCurrentView}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        pendingCount={pendingApprovalsCount}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} />
    </div>
  );
}
