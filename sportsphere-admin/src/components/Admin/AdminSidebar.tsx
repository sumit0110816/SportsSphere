import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Trophy,
  ShieldAlert,
  Activity,
  AlertTriangle,
  CreditCard,
  Bell,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
} from 'lucide-react';
import type { AdminSection } from '../../types/admin';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onExitAdmin?: () => void;
  pendingBadges?: {
    coaches?: number;
    organizers?: number;
    events?: number;
    moderation?: number;
    reports?: number;
  };
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  badge?: number;
  badgeColor?: string;
  category?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  onExitAdmin,
  pendingBadges = {},
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users, category: 'GOVERNANCE' },
    {
      id: 'coach-verification',
      label: 'Coach Verification',
      icon: UserCheck,
      badge: pendingBadges.coaches,
      badgeColor: '#F59E0B',
      category: 'GOVERNANCE',
    },
    {
      id: 'organizer-verification',
      label: 'Organizer Verification',
      icon: Building2,
      badge: pendingBadges.organizers,
      badgeColor: '#3B82F6',
      category: 'GOVERNANCE',
    },
    {
      id: 'events',
      label: 'Event Approvals',
      icon: Trophy,
      badge: pendingBadges.events,
      badgeColor: '#10B981',
      category: 'COMPETITIONS'
    },
    {
      id: 'moderation',
      label: 'Content Moderation',
      icon: ShieldAlert,
      badge: pendingBadges.moderation,
      badgeColor: '#EF4444',
      category: 'COMPETITIONS'
    },
    { id: 'performance', label: 'Performance Verification', icon: Activity, category: 'COMPETITIONS' },
    {
      id: 'reports',
      label: 'Reports & Complaints',
      icon: AlertTriangle,
      badge: pendingBadges.reports,
      badgeColor: '#DC2626',
      category: 'INTEGRITY'
    },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard, category: 'FINANCIAL' },
    { id: 'notifications', label: 'Announcements', icon: Bell, category: 'ENGAGEMENT' },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3, category: 'INTELLIGENCE' },
    { id: 'audit-logs', label: 'Security & Audit Logs', icon: FileText, category: 'SECURITY' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, category: 'SYSTEM' },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '78px' : '280px',
        minWidth: isCollapsed ? '78px' : '280px',
        backgroundColor: '#0F172A',
        color: '#E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1E293B',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '20px 14px' : '20px 20px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Shield size={20} color="#FFFFFF" />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '-0.02em', color: '#F8FAFC' }}>
                  Sport<span style={{ color: '#60A5FA' }}>Sync</span>
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: '#1E293B',
                    color: '#93C5FD',
                    border: '1px solid #334155',
                    letterSpacing: '0.05em',
                  }}
                >
                  Admin
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                Central Governance Console
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: '#1E293B',
            border: '1px solid #334155',
            color: '#94A3B8',
            borderRadius: '8px',
            width: '28px',
            height: '28px',
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '12px 8px' : '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          const showCategory =
            !isCollapsed &&
            item.category &&
            (idx === 0 || navItems[idx - 1]?.category !== item.category);

          return (
            <React.Fragment key={item.id}>
              {showCategory && (
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#475569',
                    letterSpacing: '0.08em',
                    padding: '12px 12px 4px 12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.category}
                </div>
              )}
              <button
                onClick={() => onSelectSection(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isCollapsed ? '0' : '12px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  padding: isCollapsed ? '12px 0' : '10px 14px',
                  borderRadius: '9px',
                  backgroundColor: isActive ? '#1E293B' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  border: isActive ? '1px solid #334155' : '1px solid transparent',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '13.5px',
                  position: 'relative',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#172033';
                    e.currentTarget.style.color = '#F1F5F9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: isCollapsed ? '2px' : '0',
                      top: '20%',
                      bottom: '20%',
                      width: '3.5px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#3B82F6',
                    }}
                  />
                )}
                <Icon
                  size={19}
                  style={{
                    color: isActive ? '#60A5FA' : '#64748B',
                    flexShrink: 0,
                  }}
                />
                {!isCollapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && item.badge > 0 ? (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      backgroundColor: item.badgeColor || '#3B82F6',
                      color: '#FFFFFF',
                      lineHeight: '1',
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Cross-Port Live Ecosystem Jump Links */}
      {!isCollapsed && (
        <div
          style={{
            margin: '0 12px 10px 12px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(30, 41, 59, 0.35)',
            border: '1px solid #1E293B',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em', marginBottom: '8px', textTransform: 'uppercase' }}>
            Live Portals Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Athlete Portal (:3000)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px',
                borderRadius: '6px',
                background: '#131B2E',
                color: '#93C5FD',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: 600,
                border: '1px solid #1E293B',
                gap: '2px',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span>:3000</span>
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Organizer Studio (:3001)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px',
                borderRadius: '6px',
                background: '#131B2E',
                color: '#FCD34D',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: 600,
                border: '1px solid #1E293B',
                gap: '2px',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span>:3001</span>
            </a>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Coach Hub (:3002)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px',
                borderRadius: '6px',
                background: '#131B2E',
                color: '#C4B5FD',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: 600,
                border: '1px solid #1E293B',
                gap: '2px',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span>:3002</span>
            </a>
            <a
              href="http://localhost:3004"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Login / Auth Portal (:3004)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px',
                borderRadius: '6px',
                background: '#131B2E',
                color: '#34D399',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: 600,
                border: '1px solid #1E293B',
                gap: '2px',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span>:3004</span>
            </a>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div
        style={{
          padding: isCollapsed ? '12px 8px' : '14px 16px',
          borderTop: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#94A3B8',
              borderRadius: '8px',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {onExitAdmin && (
          <button
            onClick={onExitAdmin}
            title={isCollapsed ? 'Exit to Auth Portal' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              width: '100%',
              padding: isCollapsed ? '10px 0' : '9px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#F87171',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
          >
            <ExternalLink size={16} />
            {!isCollapsed && <span>Switch to Auth Portal</span>}
          </button>
        )}

        {!isCollapsed && (
          <div
            style={{
              fontSize: '11px',
              color: '#475569',
              textAlign: 'center',
              paddingTop: '4px',
            }}
          >
            SportSync Core v3.4.1 • Port 3003
          </div>
        )}
      </div>
    </aside>
  );
};
