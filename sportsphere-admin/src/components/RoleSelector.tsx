import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, Dumbbell, CheckCircle2, ArrowRight } from 'lucide-react';
import { ROLE_CONFIG, type UserRole } from '../types/auth';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  onSwitchToLogin: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  onContinue,
  onSwitchToLogin,
}) => {
  const roles: { id: UserRole; icon: React.ReactNode; color: string; badge: string; description: string; highlights: string[] }[] = [
    {
      id: 'student',
      icon: <GraduationCap size={24} color="#0284C7" />,
      color: '#0284C7',
      badge: 'VARSITY ATHLETE',
      description: 'Compete in sanctioned tournaments, build your verified sports CV, and showcase verified trial metrics to university recruiters.',
      highlights: ['Tournament entries & check-in', 'Verified timing & personal records', 'Scout & coach discovery network', 'Media highlight reels feed'],
    },
    {
      id: 'organizer',
      icon: <Building2 size={24} color="#D97706" />,
      color: '#D97706',
      badge: 'MEET DIRECTOR',
      description: 'Sanction and direct varsity competitions, generate automated seedings and brackets, manage team rosters, and publish live results.',
      highlights: ['Meet sanctioning & scheduling', 'Automated bracket generation', 'Referee & field assignments', 'Real-time scorecard publishing'],
    },
    {
      id: 'coach',
      icon: <Dumbbell size={24} color="#4F46E5" />,
      color: '#4F46E5',
      badge: 'VARSITY COACH & SCOUT',
      description: 'Scout verified athletic talent across regional circuits, review tactical match footage, and manage varsity squad depth charts.',
      highlights: ['Athlete scouting radar & telemetry', 'Film sessions & match reviews', 'Roster & depth chart control', 'Sanctioned competition calendar'],
    },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      {/* Header section */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 34px)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 10px',
            color: '#0F172A',
          }}
        >
          Select Your Account Type
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#475569',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          Choose your primary role within the SportSync varsity athletic network to access your dedicated workspace and tools.
        </p>
      </div>

      {/* Role Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        {roles.map(({ id, icon, color, badge, description, highlights }, index) => {
          const config = ROLE_CONFIG[id];
          const isSelected = selectedRole === id;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 * index }}
              onClick={() => onSelectRole(id)}
              className={`role-card ${isSelected ? config.borderClass : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px',
                borderWidth: isSelected ? '2px' : '1.5px',
                borderColor: isSelected ? color : '#E2E8F0',
                background: isSelected ? '#FFFFFF' : '#FFFFFF',
              }}
            >
              {/* Selected badge */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#EFF6FF',
                    border: `1px solid ${color}`,
                    color: color,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Selected</span>
                </div>
              )}

              <div>
                {/* Icon */}
                <div
                  className="icon-orb"
                  style={{
                    background: isSelected ? `${color}15` : '#F8FAFC',
                    border: `1px solid ${isSelected ? `${color}35` : '#E2E8F0'}`,
                  }}
                >
                  {icon}
                </div>

                {/* Role badge */}
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: color,
                    marginBottom: '4px',
                  }}
                >
                  {badge}
                </span>

                {/* Role title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 8px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {config.title}
                </h3>

                {/* Tagline / Description */}
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748B',
                    lineHeight: 1.45,
                    marginBottom: '16px',
                  }}
                >
                  {description}
                </p>

                {/* Features list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {highlights.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: isSelected ? '#1E293B' : '#475569',
                        fontWeight: 500,
                      }}
                    >
                      <div
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination workspace */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                  Workspace: <strong style={{ color: color, fontWeight: 700 }}>{config.badge}</strong>
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                  Direct Access
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={onContinue}
          disabled={!selectedRole}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 32px',
            borderRadius: '10px',
            background: selectedRole ? '#1D4ED8' : '#94A3B8',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: selectedRole ? 'pointer' : 'not-allowed',
            boxShadow: selectedRole ? '0 2px 8px rgba(29, 78, 216, 0.3)' : 'none',
            transition: 'all 0.15s ease',
            opacity: selectedRole ? 1 : 0.6,
          }}
        >
          <span>Continue to Account Credentials</span>
          <ArrowRight size={16} />
        </button>

        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#1D4ED8',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
};
