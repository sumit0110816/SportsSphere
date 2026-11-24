import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { OverviewView } from './views/OverviewView';
import { UserManagementView } from './views/UserManagementView';
import { CoachVerificationView } from './views/CoachVerificationView';
import { OrganizerVerificationView } from './views/OrganizerVerificationView';
import { EventApprovalsView } from './views/EventApprovalsView';
import { ContentModerationView } from './views/ContentModerationView';
import { PerformanceVerificationView } from './views/PerformanceVerificationView';
import { ReportsComplaintsView } from './views/ReportsComplaintsView';
import { PaymentManagementView } from './views/PaymentManagementView';
import { NotificationsView } from './views/NotificationsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuditLogsView } from './views/AuditLogsView';
import { SettingsView } from './views/SettingsView';

import type {
  AdminSection,
  AdminUser,
  CoachApplication,
  OrganizerApplication,
  TournamentEvent,
  ModerationItem,
  PerformanceClaim,
  ReportComplaint,
  PaymentRecord,
  AdminNotification,
  AuditLog,
  PlatformStats,
} from '../../types/admin';
import type { UserRole } from '../../types/auth';

import {
  getPlatformStats,
  getUsers,
  updateUserStatus,
  updateUserRoles,
  getCoachApplications,
  approveCoachApplication,
  rejectCoachApplication,
  getOrganizerApplications,
  approveOrganizerApplication,
  rejectOrganizerApplication,
  suspendOrganizerRole,
  getEvents,
  updateEventStatus,
  getModerationItems,
  resolveModerationItem,
  getPerformanceClaims,
  verifyPerformanceClaim,
  disputePerformanceClaim,
  getReports,
  updateReportStatus,
  getPayments,
  processPaymentRefund,
  getNotifications,
  broadcastNotification,
  getAuditLogs,
} from '../../services/adminService';
import { isFirebaseConfigured } from '../../firebase/config';

interface AdminLayoutProps {
  onExitAdmin?: () => void;
  onOpenPortal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitAdmin, onOpenPortal }) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalAthletes: 0,
    totalCoaches: 0,
    totalOrganizers: 0,
    pendingVerifications: 0,
    totalPublishedEvents: 0,
    pendingEventApprovals: 0,
    totalRegistrations: 0,
    totalPaymentsCount: 0,
    totalRevenue: 0,
    totalHighlights: 0,
    reportedContentCount: 0,
  });

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [coachApps, setCoachApps] = useState<CoachApplication[]>([]);
  const [orgApps, setOrgApps] = useState<OrganizerApplication[]>([]);
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [performanceClaims, setPerformanceClaims] = useState<PerformanceClaim[]>([]);
  const [reports, setReports] = useState<ReportComplaint[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load all data
  const loadData = async () => {
    const [
      s,
      u,
      ca,
      oa,
      ev,
      mod,
      perf,
      rep,
      pay,
      notif,
      logs,
    ] = await Promise.all([
      getPlatformStats(),
      getUsers(),
      getCoachApplications(),
      getOrganizerApplications(),
      getEvents(),
      getModerationItems(),
      getPerformanceClaims(),
      getReports(),
      getPayments(),
      getNotifications(),
      getAuditLogs(),
    ]);

    setStats(s);
    setUsers(u);
    setCoachApps(ca);
    setOrgApps(oa);
    setEvents(ev);
    setModerationItems(mod);
    setPerformanceClaims(perf);
    setReports(rep);
    setPayments(pay);
    setNotifications(notif);
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Actions
  const handleUpdateUserStatus = async (uid: string, status: AdminUser['status'], reason?: string) => {
    await updateUserStatus(uid, status, reason);
    await loadData();
  };

  const handleUpdateUserRoles = async (uid: string, roles: UserRole[], reason?: string) => {
    await updateUserRoles(uid, roles, reason);
    await loadData();
  };

  const handleApproveCoach = async (id: string, notes?: string) => {
    await approveCoachApplication(id, notes);
    await loadData();
  };

  const handleRejectCoach = async (id: string, reason: string) => {
    await rejectCoachApplication(id, reason);
    await loadData();
  };

  const handleApproveOrganizer = async (id: string, notes?: string) => {
    await approveOrganizerApplication(id, notes);
    await loadData();
  };

  const handleRejectOrganizer = async (id: string, reason: string) => {
    await rejectOrganizerApplication(id, reason);
    await loadData();
  };

  const handleSuspendOrganizer = async (id: string, reason: string) => {
    await suspendOrganizerRole(id, reason);
    await loadData();
  };

  const handleUpdateEventStatus = async (id: string, status: TournamentEvent['status'], reason?: string) => {
    await updateEventStatus(id, status, reason);
    await loadData();
  };

  const handleResolveModeration = async (id: string, decision: ModerationItem['status'], comment?: string) => {
    await resolveModerationItem(id, decision, comment);
    await loadData();
  };

  const handleVerifyPerformance = async (id: string, notes?: string) => {
    await verifyPerformanceClaim(id, notes);
    await loadData();
  };

  const handleDisputePerformance = async (id: string, reason: string) => {
    await disputePerformanceClaim(id, reason);
    await loadData();
  };

  const handleUpdateReportStatus = async (id: string, status: ReportComplaint['status'], notes?: string) => {
    await updateReportStatus(id, status, notes);
    await loadData();
  };

  const handleRefundPayment = async (id: string, reason: string) => {
    await processPaymentRefund(id, reason);
    await loadData();
  };

  const handleSendNotification = async (notif: Omit<AdminNotification, 'id' | 'sentAt' | 'readCount'>) => {
    await broadcastNotification(notif);
    await loadData();
  };

  // Pending counts
  const pendingCoaches = coachApps.filter((c) => c.status === 'pending');
  const pendingOrganizers = orgApps.filter((o) => o.status === 'pending');
  const pendingEvents = events.filter((e) => e.status === 'pending');
  const pendingModeration = moderationItems.filter((m) => m.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'open' || r.status === 'investigating');

  const pendingBadges = {
    coaches: pendingCoaches.length,
    organizers: pendingOrganizers.length,
    events: pendingEvents.length,
    moderation: pendingModeration.length,
    reports: pendingReports.length,
  };

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: isDark ? '#0B1120' : '#F8FAFC',
        color: isDark ? '#F1F5F9' : '#0F172A',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onExitAdmin={onExitAdmin}
        pendingBadges={pendingBadges}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          currentSection={currentSection}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLiveDb={isFirebaseConfigured()}
          onOpenPortal={onOpenPortal}
        />

        <main
          style={{
            flex: 1,
            padding: '28px',
            maxWidth: '1440px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {currentSection === 'overview' && (
            <OverviewView
              stats={stats}
              theme={theme}
              onNavigate={setCurrentSection}
              pendingCoaches={pendingCoaches}
              pendingOrganizers={pendingOrganizers}
              pendingEvents={pendingEvents}
              onApproveCoach={handleApproveCoach}
              onApproveOrganizer={handleApproveOrganizer}
              onApproveEvent={(id) => handleUpdateEventStatus(id, 'published')}
            />
          )}

          {currentSection === 'users' && (
            <UserManagementView
              users={users}
              theme={theme}
              onUpdateStatus={handleUpdateUserStatus}
              onUpdateRoles={handleUpdateUserRoles}
            />
          )}

          {currentSection === 'coach-verification' && (
            <CoachVerificationView
              applications={coachApps}
              theme={theme}
              onApprove={handleApproveCoach}
              onReject={handleRejectCoach}
            />
          )}

          {currentSection === 'organizer-verification' && (
            <OrganizerVerificationView
              applications={orgApps}
              theme={theme}
              onApprove={handleApproveOrganizer}
              onReject={handleRejectOrganizer}
              onSuspend={handleSuspendOrganizer}
            />
          )}

          {currentSection === 'events' && (
            <EventApprovalsView
              events={events}
              theme={theme}
              onUpdateStatus={handleUpdateEventStatus}
            />
          )}

          {currentSection === 'moderation' && (
            <ContentModerationView
              items={moderationItems}
              theme={theme}
              onResolve={handleResolveModeration}
            />
          )}

          {currentSection === 'performance' && (
            <PerformanceVerificationView
              claims={performanceClaims}
              theme={theme}
              onVerify={handleVerifyPerformance}
              onDispute={handleDisputePerformance}
            />
          )}

          {currentSection === 'reports' && (
            <ReportsComplaintsView
              reports={reports}
              theme={theme}
              onUpdateStatus={handleUpdateReportStatus}
            />
          )}

          {currentSection === 'payments' && (
            <PaymentManagementView
              payments={payments}
              theme={theme}
              onRefund={handleRefundPayment}
            />
          )}

          {currentSection === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              theme={theme}
              onSend={handleSendNotification}
            />
          )}

          {currentSection === 'analytics' && (
            <AnalyticsView
              stats={stats}
              theme={theme}
            />
          )}

          {currentSection === 'audit-logs' && (
            <AuditLogsView
              logs={auditLogs}
              theme={theme}
            />
          )}

          {currentSection === 'settings' && (
            <SettingsView
              theme={theme}
            />
          )}
        </main>
      </div>
    </div>
  );
};
