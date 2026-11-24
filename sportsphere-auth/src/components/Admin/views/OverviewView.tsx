import React from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Trophy,
  Activity,
  AlertTriangle,
  CreditCard,
  Video,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { PlatformStats, CoachApplication, OrganizerApplication, TournamentEvent } from '../../../types/admin';

interface OverviewViewProps {
  stats: PlatformStats;
  theme: 'light' | 'dark';
  onNavigate: (section: any) => void;
  pendingCoaches: CoachApplication[];
  pendingOrganizers: OrganizerApplication[];
  pendingEvents: TournamentEvent[];
  onApproveCoach: (id: string) => void;
  onApproveOrganizer: (id: string) => void;
  onApproveEvent: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  theme,
  onNavigate,
  pendingCoaches,
  pendingOrganizers,
  pendingEvents,
  onApproveCoach,
  onApproveOrganizer,
  onApproveEvent: _onApproveEvent,
}) => {
  const isDark = theme === 'dark';

  const statCards = [
    {
      label: 'Total Registered Users',
      value: stats.totalUsers,
      sub: `${stats.totalAthletes} Athletes • ${stats.totalCoaches} Coaches`,
      icon: Users,
      color: '#3B82F6',
      section: 'users',
    },
    {
      label: 'Verified Coaches',
      value: stats.totalCoaches,
      sub: `${pendingCoaches.length} verification pending`,
      icon: UserCheck,
      color: '#10B981',
      section: 'coach-verification',
    },
    {
      label: 'Authorized Organizers',
      value: stats.totalOrganizers,
      sub: `${pendingOrganizers.length} approvals pending`,
      icon: Building2,
      color: '#F59E0B',
      section: 'organizer-verification',
    },
    {
      label: 'Sanctioned Tournaments',
      value: stats.totalPublishedEvents,
      sub: `${pendingEvents.length} awaiting sanctioning`,
      icon: Trophy,
      color: '#8B5CF6',
      section: 'events',
    },
    {
      label: 'Athlete Registrations',
      value: stats.totalRegistrations,
      sub: 'Across 42 National Circuits',
      icon: Activity,
      color: '#EC4899',
      section: 'events',
    },
    {
      label: 'Gross Tournament Fee Volume',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      sub: `${stats.totalPaymentsCount} Razorpay transactions`,
      icon: CreditCard,
      color: '#06B6D4',
      section: 'payments',
    },
    {
      label: 'Verified Highlights Uploaded',
      value: stats.totalHighlights,
      sub: '4k HD Video & Photo Reels',
      icon: Video,
      color: '#6366F1',
      section: 'moderation',
    },
    {
      label: 'Triage Reports & Flagged Items',
      value: stats.reportedContentCount,
      sub: 'Content moderation & complaints',
      icon: AlertTriangle,
      color: stats.reportedContentCount > 0 ? '#EF4444' : '#10B981',
      section: 'reports',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Platform Banner */}
      <div
        style={{
          borderRadius: '14px',
          background: isDark
            ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          padding: '24px 28px',
          border: `1px solid ${isDark ? '#334155' : '#BFDBFE'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              <ShieldCheck size={13} />
              AIU SANCTIONED GOVERNANCE
            </span>
            <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#475569', fontWeight: 500 }}>
              Node cluster active • 99.98% uptime
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: isDark ? '#FFFFFF' : '#1E3A8A' }}>
            SportSync Central Admin Workspace
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: isDark ? '#CBD5E1' : '#334155' }}>
            Managing verified inter-collegiate athletes, institutional coach licenses, student organizer NOCs, and automated tournament sanctioning.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('events')}
            style={{
              padding: '9px 16px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Review Pending Events ({pendingEvents.length})
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      {/* 8 Core Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
        }}
      >
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(card.section)}
              style={{
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = isDark
                  ? '0 8px 24px rgba(0,0,0,0.3)'
                  : '0 8px 24px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B' }}>
                  {card.label}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={card.color} />
                </div>
              </div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  marginTop: '12px',
                  lineHeight: 1.1,
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  color: isDark ? '#CBD5E1' : '#64748B',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Approval Queues (Side-by-side) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Pending Coach Applications Quick Queue */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                Coach Accreditation Queue
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Review licenses & institution endorsements
              </p>
            </div>
            <button
              onClick={() => onNavigate('coach-verification')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563EB',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View All ({pendingCoaches.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingCoaches.slice(0, 2).map((coach) => (
              <div
                key={coach.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: isDark ? '#F1F5F9' : '#0F172A' }}>
                    {coach.fullName}
                  </div>
                  <div style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {coach.sport} • {coach.collegeOrOrg}
                  </div>
                  <div style={{ fontSize: '11px', color: '#3B82F6', marginTop: '2px', fontWeight: 500 }}>
                    {coach.licenseNo} • {coach.experienceYears} exp
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onApproveCoach(coach.id)}
                    title="Quick Approve"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
            {pendingCoaches.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: isDark ? '#64748B' : '#94A3B8', fontSize: '13px' }}>
                No coach verification requests pending.
              </div>
            )}
          </div>
        </div>

        {/* Pending Organizer Authorization Quick Queue */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                Organizer Authorization Queue
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Review Dean/Director NOC authorization letters
              </p>
            </div>
            <button
              onClick={() => onNavigate('organizer-verification')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563EB',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View All ({pendingOrganizers.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingOrganizers.slice(0, 2).map((org) => (
              <div
                key={org.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: isDark ? '#F1F5F9' : '#0F172A' }}>
                    {org.fullName} ({org.studentId})
                  </div>
                  <div style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {org.collegeName} • {org.department}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '2px', fontWeight: 500 }}>
                    NOC letter attached & verified college email
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onApproveOrganizer(org.id)}
                    title="Quick Approve"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
            {pendingOrganizers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: isDark ? '#64748B' : '#94A3B8', fontSize: '13px' }}>
                All student organizer applications up to date.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity and Sports Category Breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Sports Category Distribution */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            padding: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Sports Category Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { sport: 'Track & Field / Athletics', share: 44, color: '#3B82F6' },
              { sport: 'Badminton (Men & Women)', share: 22, color: '#10B981' },
              { sport: 'Basketball (5v5 & 3x3)', share: 18, color: '#F59E0B' },
              { sport: 'Football / Soccer', share: 11, color: '#8B5CF6' },
              { sport: 'Swimming & Aquatic Events', share: 5, color: '#EC4899' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500, color: isDark ? '#E2E8F0' : '#334155' }}>{item.sport}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.share}%</span>
                </div>
                <div style={{ height: '7px', borderRadius: '4px', backgroundColor: isDark ? '#334155' : '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ width: `${item.share}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Registration Growth Visual */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Registration & Engagement Growth
            </h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>+34.2% MoM</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '130px', paddingTop: '20px' }}>
            {[
              { month: 'Jun', athletes: 35, tourneys: 4 },
              { month: 'Jul', athletes: 52, tourneys: 7 },
              { month: 'Aug', athletes: 68, tourneys: 11 },
              { month: 'Sep', athletes: 85, tourneys: 16 },
              { month: 'Oct', athletes: 110, tourneys: 24 },
              { month: 'Nov', athletes: 145, tourneys: 32 },
            ].map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px' }}>
                  <div
                    style={{
                      flex: 1,
                      height: `${(d.athletes / 150) * 100}%`,
                      backgroundColor: '#3B82F6',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Athletes: ${d.athletes}`}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: `${(d.tourneys / 40) * 100}%`,
                      backgroundColor: '#10B981',
                      borderRadius: '3px 3px 0 0',
                    }}
                    title={`Tournaments: ${d.tourneys}`}
                  />
                </div>
                <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>{d.month}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '16px', fontSize: '11.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#3B82F6', borderRadius: '2px' }} />
              <span style={{ color: isDark ? '#CBD5E1' : '#475569' }}>Athlete Onboarding</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#10B981', borderRadius: '2px' }} />
              <span style={{ color: isDark ? '#CBD5E1' : '#475569' }}>Sanctioned Tournaments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
