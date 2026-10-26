import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, Dumbbell, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
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
  const roles: { id: UserRole; icon: React.ReactNode; glowColor: string }[] = [
    {
      id: 'student',
      icon: <GraduationCap size={32} color="#0891B2" />,
      glowColor: 'rgba(8, 145, 178, 0.2)',
    },
    {
      id: 'organizer',
      icon: <Building2 size={32} color="#D97706" />,
      glowColor: 'rgba(217, 119, 6, 0.2)',
    },
    {
      id: 'coach',
      icon: <Dumbbell size={32} color="#7C3AED" />,
      glowColor: 'rgba(124, 58, 237, 0.2)',
    },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      {/* Top headline */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            fontSize: '12px',
            fontWeight: 700,
            color: '#334155',
            marginBottom: '16px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
          }}
        >
          <Sparkles size={14} color="#0891B2" />
          <span>Step 1 of 3: Select Your Ecosystem Role</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
            color: '#0F172A',
          }}
        >
          How will you experience{' '}
          <span className="shimmer-text">SportSphere</span>?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '15px',
            color: '#475569',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          Select your primary identity. We tailor your onboarding, profile credentials, and direct access to your dedicated workspace.
        </motion.p>
      </div>

      {/* Role Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {roles.map(({ id, icon, glowColor }, index) => {
          const config = ROLE_CONFIG[id];
          const isSelected = selectedRole === id;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 * index }}
              onClick={() => onSelectRole(id)}
              className={`role-card ${isSelected ? config.borderClass : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px',
                textAlign: 'left',
                borderWidth: isSelected ? '2px' : '1.5px',
                transform: isSelected ? 'translateY(-4px)' : 'none',
              }}
            >
              {/* Top selected badge */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: config.accentBg,
                    border: `1.5px solid ${config.color}`,
                    color: config.color,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  <CheckCircle2 size={13} />
                  SELECTED
                </div>
              )}

              <div>
                {/* Icon orb */}
                <div
                  className="icon-orb"
                  style={{
                    margin: '0 0 16px 0',
                    background: isSelected ? config.accentBg : '#F8FAFC',
                    border: `1px solid ${isSelected ? config.color : '#E2E8F0'}`,
                    boxShadow: isSelected ? `0 0 20px ${glowColor}` : 'none',
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
                    letterSpacing: '0.06em',
                    color: config.color,
                    marginBottom: '6px',
                  }}
                >
                  {config.badge}
                </span>

                {/* Role title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 8px',
                  }}
                >
                  {config.title}
                </h3>

                {/* Tagline */}
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748B',
                    lineHeight: 1.4,
                    marginBottom: '18px',
                  }}
                >
                  {config.tagline}
                </p>

                {/* Features list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {config.features.map((feat, i) => (
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
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: config.color,
                          flexShrink: 0,
                        }}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Target Dashboard indicator */}
              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '14px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                  Workspace: <strong style={{ color: config.color, fontWeight: 700 }}>Port {config.port}</strong>
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isSelected ? config.color : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isSelected ? 'Ready' : 'Choose'}
                  <ArrowRight size={13} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <button
          disabled={!selectedRole}
          onClick={onContinue}
          className={`btn-primary ${selectedRole ? ROLE_CONFIG[selectedRole].btnClass : ''}`}
          style={{
            maxWidth: '360px',
            opacity: selectedRole ? 1 : 0.45,
            cursor: selectedRole ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>Continue as {selectedRole ? ROLE_CONFIG[selectedRole].title : '...'}</span>
          <ArrowRight size={18} />
        </button>

        <p style={{ fontSize: '13px', color: '#64748B' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#0891B2',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Sign in here
          </button>
        </p>
      </motion.div>
    </div>
  );
};
