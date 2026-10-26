import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Sparkles, Trophy, Dumbbell, GraduationCap } from 'lucide-react';
import { ROLE_CONFIG, type UserSession } from '../types/auth';

interface SuccessScreenProps {
  session: UserSession;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ session, onReset }) => {
  const { role, name, email, profile } = session;
  const config = ROLE_CONFIG[role];
  const [countdown, setCountdown] = useState(4);
  const [redirectCancelled, setRedirectCancelled] = useState(false);

  // Construct target URL including the logged-in user profile parameters
  const getDestinationUrl = () => {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (email) params.set('email', email);
    if (role) params.set('role', role);

    if (profile) {
      // Don't pass avatar as URL param — it contains '&' chars that break URLSearchParams parsing
      // Avatar is stored in localStorage via the session object instead
      if ('title' in profile && profile.title) params.set('title', profile.title);
      if ('designation' in profile && profile.designation) params.set('title', profile.designation);
      if ('organizationName' in profile && profile.organizationName) params.set('org', profile.organizationName);
      if ('institution' in profile && profile.institution) params.set('org', profile.institution);
      if ('currentAcademy' in profile && profile.currentAcademy) params.set('org', profile.currentAcademy);
      if ('primarySport' in profile && profile.primarySport) params.set('sport', profile.primarySport);
      if ('city' in profile && profile.city) params.set('city', profile.city);
      if ('bio' in profile && profile.bio) params.set('bio', profile.bio);
    }

    const query = params.toString();
    return query ? `${config.dashboardUrl}/?${query}` : config.dashboardUrl;
  };

  const targetUrl = getDestinationUrl();

  useEffect(() => {
    // Store session in localStorage for cross-port reference
    try {
      localStorage.setItem('sportsphere_auth_user', JSON.stringify(session));
    } catch {
      // ignore
    }

    if (redirectCancelled) return;

    if (countdown <= 0) {
      window.location.href = targetUrl;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirectCancelled, targetUrl, session]);

  const handleLaunchNow = () => {
    window.location.href = targetUrl;
  };

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card"
        style={{
          padding: '40px 32px',
          boxShadow: '0 24px 60px -12px rgba(15, 23, 42, 0.1), 0 1px 3px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow backdrop inside */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: config.accentBg,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        {/* Success Pop Icon */}
        <div
          className="success-icon"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: config.accentBg,
            border: `2.5px solid ${config.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: `0 8px 24px ${config.accentHex}30`,
          }}
        >
          <CheckCircle2 size={44} color={config.color} />
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '999px',
            background: config.accentBg,
            border: `1.5px solid ${config.color}40`,
            color: config.color,
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}
        >
          <Sparkles size={13} />
          Profile Activated Successfully
        </div>

        {/* Welcome Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 8px',
          }}
        >
          Welcome, {name || 'SportSphere Member'}!
        </h2>

        <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 24px', lineHeight: 1.5 }}>
          Your {config.title} profile is live. Redirecting you to your workspace at{' '}
          <span style={{ color: config.color, fontWeight: 800 }}>{config.dashboardUrl}</span>
        </p>

        {/* Profile Card Preview */}
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'left',
            marginBottom: '26px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: config.accentBg,
              border: `1.5px solid ${config.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0,
            }}
          >
            {(profile && 'avatar' in profile && profile.avatar) || '⭐'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {name}
              </h4>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: config.color,
                  color: '#FFFFFF',
                }}
              >
                Port {config.port}
              </span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748B' }}>
              {email}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: config.color, fontWeight: 700 }}>
              <span>✓ Verified Profile</span>
              <span>•</span>
              <span>{config.title}</span>
            </div>
          </div>
        </div>

        {/* Countdown Box */}
        <div
          style={{
            background: '#F1F5F9',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '14px',
            marginBottom: '24px',
          }}
        >
          {!redirectCancelled ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: config.color,
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {countdown}
              </div>
              <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                Auto-redirecting to dashboard in {countdown}s...
              </span>
              <button
                type="button"
                onClick={() => setRedirectCancelled(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '11px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
              Auto-redirect paused. Click below whenever you're ready.
            </span>
          )}
        </div>

        {/* Launch Now Button */}
        <button
          onClick={handleLaunchNow}
          className={`btn-primary ${config.btnClass}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '16px',
            marginBottom: '14px',
          }}
        >
          <span>Launch {config.title} (Port {config.port})</span>
          <ExternalLink size={18} />
        </button>

        {/* Secondary options */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
          <button
            onClick={onReset}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ← Switch account or role
          </button>
        </div>
      </motion.div>

      {/* Cross-portal quick switcher for testing convenience */}
      <div style={{ marginTop: '28px' }}>
        <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
          Or Open Other Running Portals Directly:
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {role !== 'student' && (
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#ECFEFF',
                border: '1px solid rgba(8, 145, 178, 0.3)',
                color: '#0891B2',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <GraduationCap size={13} />
              Student Portal :3000
              <ExternalLink size={11} />
            </a>
          )}
          {role !== 'organizer' && (
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#FFFBEB',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                color: '#D97706',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Trophy size={13} />
              Organizer Studio :3001
              <ExternalLink size={11} />
            </a>
          )}
          {role !== 'coach' && (
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#FAF5FF',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: '#7C3AED',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Dumbbell size={13} />
              Coach Platform :3002
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
