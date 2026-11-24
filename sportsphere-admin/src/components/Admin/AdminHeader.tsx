import React from 'react';
import {
  Search,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';
import type { AdminSection } from '../../types/admin';

interface AdminHeaderProps {
  currentSection: AdminSection;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLiveDb: boolean;
  onOpenPortal?: () => void;
}

const sectionTitles: Record<AdminSection, { title: string; subtitle: string }> = {
  overview: {
    title: 'Platform Overview',
    subtitle: 'Real-time ecosystem metrics, pending queues, and registration growth',
  },
  users: {
    title: 'User Management',
    subtitle: 'Multi-role profile governance, account states, and institutional affiliations',
  },
  'coach-verification': {
    title: 'Coach Verification',
    subtitle: 'Accreditation verification, AFI/FIBA licenses, and coaching credentials review',
  },
  'organizer-verification': {
    title: 'Organizer Verification',
    subtitle: 'Institutional student ID, sports council letters & college Dean NOC vetting',
  },
  events: {
    title: 'Tournament & Event Approvals',
    subtitle: 'Pre-sanction review, AI circuit rules, entry fee, prize pool & schedule audits',
  },
  moderation: {
    title: 'Content Moderation',
    subtitle: 'Automated & user-reported highlight reels, athlete performance media triage',
  },
  performance: {
    title: 'Athlete Performance Verification',
    subtitle: 'FAT electronic timing telemetry, legal wind assist, and certified coach signoffs',
  },
  reports: {
    title: 'Reports & Complaints',
    subtitle: 'Investigate fraudulent organizers, misleading records, and code-of-conduct violations',
  },
  payments: {
    title: 'Payment Gateway Management',
    subtitle: 'Razorpay settlement pipeline, tournament registration transactions, and refunds',
  },
  notifications: {
    title: 'Announcements & Broadcasts',
    subtitle: 'Send official notifications across athletes, coaches, and organizers',
  },
  analytics: {
    title: 'Analytics & Deep Reports',
    subtitle: 'Inter-collegiate participation rankings, sports distribution, and growth telemetry',
  },
  'audit-logs': {
    title: 'Security & Audit Logs',
    subtitle: 'Immutable record of administrator actions, privilege grants, and enforcement steps',
  },
  settings: {
    title: 'System & Platform Settings',
    subtitle: 'Firebase rules status, Cloudinary storage keys, commission rates, and policies',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSection,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  isLiveDb,
  onOpenPortal,
}) => {
  const currentInfo = sectionTitles[currentSection] || {
    title: 'Dashboard',
    subtitle: 'SportSync Administration',
  };

  const isDark = theme === 'dark';

  return (
    <header
      style={{
        height: '70px',
        padding: '0 28px',
        backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        borderBottom: `1px solid ${isDark ? '#1E293B' : '#E2E8F0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        transition: 'background 0.2s, border 0.2s',
      }}
    >
      {/* Current Title & Subtitle */}
      <div>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: isDark ? '#F8FAFC' : '#0F172A',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {currentInfo.title}
        </h1>
        <p
          style={{
            fontSize: '12px',
            color: isDark ? '#94A3B8' : '#64748B',
            margin: '2px 0 0 0',
          }}
        >
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Search */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: isDark ? '#64748B' : '#94A3B8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search users, events, IDs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '240px',
              height: '36px',
              padding: '0 12px 0 36px',
              fontSize: '13px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
              backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
              color: isDark ? '#F1F5F9' : '#0F172A',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563EB';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? '#334155' : '#CBD5E1';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Database Status Indicator */}
        <div
          title={isLiveDb ? 'Connected to Cloud Firestore' : 'Running on Local Seed Engine'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '999px',
            backgroundColor: isLiveDb
              ? isDark
                ? 'rgba(16, 185, 129, 0.15)'
                : '#ECFDF5'
              : isDark
              ? 'rgba(245, 158, 11, 0.15)'
              : '#FFFBEB',
            border: `1px solid ${
              isLiveDb
                ? isDark
                  ? 'rgba(16, 185, 129, 0.3)'
                  : '#A7F3D0'
                : isDark
                ? 'rgba(245, 158, 11, 0.3)'
                : '#FDE68A'
            }`,
            fontSize: '11.5px',
            fontWeight: 600,
            color: isLiveDb ? '#059669' : '#D97706',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isLiveDb ? '#10B981' : '#F59E0B',
              display: 'inline-block',
            }}
          />
          {isLiveDb ? 'Firestore Live' : 'Active Seed Sync'}
        </div>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Workspace' : 'Switch to Dark Mode'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            color: isDark ? '#F59E0B' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Admin Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 10px 4px 6px',
            borderRadius: '24px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            SA
          </div>
          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: isDark ? '#F1F5F9' : '#0F172A',
              }}
            >
              Super Admin
            </div>
            <div style={{ fontSize: '10.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
              admin@sportsync.io
            </div>
          </div>
        </div>

        {/* View Athlete/Organizer/Coach Live Portals Link */}
        {onOpenPortal && (
          <button
            onClick={onOpenPortal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            <span>Live Portals</span>
            <ExternalLink size={14} />
          </button>
        )}
      </div>
    </header>
  );
};
