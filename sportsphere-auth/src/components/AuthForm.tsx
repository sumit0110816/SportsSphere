import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, Check, GraduationCap, Building2, Dumbbell, Loader2, Zap } from 'lucide-react';
import { ROLE_CONFIG, type UserRole, type BaseCredentials } from '../types/auth';

interface AuthFormProps {
  mode: 'signup' | 'login';
  role: UserRole;
  onSelectRole: (role: UserRole) => void;
  onSwitchMode: (mode: 'signup' | 'login') => void;
  onBackToRoles: () => void;
  onSubmitSignupCredentials: (creds: BaseCredentials) => void;
  onSubmitLogin: (role: UserRole, creds: BaseCredentials) => void;
  onGoogleSignIn: (role: UserRole) => void;
  isLoading?: boolean;
  externalError?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  role,
  onSelectRole,
  onSwitchMode,
  onBackToRoles,
  onSubmitSignupCredentials,
  onSubmitLogin,
  onGoogleSignIn,
  isLoading = false,
  externalError = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState('');

  const config = ROLE_CONFIG[role];
  const displayError = externalError || localError;

  const handleFillDemo = (demoType: 'student' | 'organizer_approved' | 'organizer_pending' | 'coach_approved' | 'coach_pending') => {
    if (demoType === 'student') {
      onSelectRole('student');
      setEmail('alex.striker@sportsphere.edu');
      setPassword('Athlete2026!');
    } else if (demoType === 'organizer_approved') {
      onSelectRole('organizer');
      setEmail('ananya.iyer@bits-pilani.ac.in');
      setPassword('Organizer2026!');
    } else if (demoType === 'organizer_pending') {
      onSelectRole('organizer');
      setEmail('director@nationalleagues.org');
      setPassword('Organizer2026!');
    } else if (demoType === 'coach_approved') {
      onSelectRole('coach');
      setEmail('vikram.singh@delhiathletics.org');
      setPassword('Coach2026!');
    } else if (demoType === 'coach_pending') {
      onSelectRole('coach');
      setEmail('coach.rodriguez@eliteacademy.com');
      setPassword('Coach2026!');
    }
    setLocalError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please provide a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      onSubmitSignupCredentials({ email, password });
    } else {
      onSubmitLogin(role, { email, password, rememberMe });
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}>
      {/* Back button (only in signup mode) */}
      {mode === 'signup' && (
        <button
          onClick={onBackToRoles}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '14px',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={15} />
          Change Account Type ({config.title})
        </button>
      )}

      {/* Main Professional Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="glass-card"
        style={{
          padding: '32px 28px',
          borderRadius: '16px',
        }}
      >
        {/* Role Selector Segmented Control (in Login mode) */}
        {mode === 'login' && (
          <div style={{ marginBottom: '22px' }}>
            <label className="field-label" style={{ marginBottom: '8px' }}>
              Select Active Dashboard:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '4px',
                background: '#F1F5F9',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
              }}
            >
              <button
                type="button"
                onClick={() => onSelectRole('student')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: role === 'student' ? '#FFFFFF' : 'transparent',
                  color: role === 'student' ? '#0284C7' : '#64748B',
                  boxShadow: role === 'student' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <GraduationCap size={14} />
                <span>Athlete</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('organizer')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: role === 'organizer' ? '#FFFFFF' : 'transparent',
                  color: role === 'organizer' ? '#D97706' : '#64748B',
                  boxShadow: role === 'organizer' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Building2 size={14} />
                <span>Organizer</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('coach')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: role === 'coach' ? '#FFFFFF' : 'transparent',
                  color: role === 'coach' ? '#4F46E5' : '#64748B',
                  boxShadow: role === 'coach' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Dumbbell size={14} />
                <span>Coach</span>
              </button>
            </div>
          </div>
        )}

        {/* Card Heading */}
        <div style={{ marginBottom: '22px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}
          >
            {mode === 'signup' ? `Create ${config.title} Account` : 'Sign In to SportSync'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            {mode === 'signup'
              ? 'Enter your varsity email and credentials to begin.'
              : `Enter your credentials to access the ${config.title} workspace.`}
          </p>
        </div>

        {/* Verification Policy Notice */}
        {role === 'organizer' && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              fontSize: '12px',
              color: '#92400E',
              lineHeight: 1.45,
              marginBottom: '16px',
            }}
          >
            <strong>🏛️ Organizer Governance:</strong> Access requires verified College Email, Contact Number, College ID Card & Dean NOC Letter approved by Platform Admin.
          </div>
        )}

        {role === 'coach' && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              fontSize: '12px',
              color: '#3730A3',
              lineHeight: 1.45,
              marginBottom: '16px',
            }}
          >
            <strong>🏅 Coach Accreditation:</strong> Access requires verified Professional Email, Contact Number, Coach Certificate (AFI/FIBA/NIS) approved by Platform Admin.
          </div>
        )}

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={() => onGoogleSignIn(role)}
          disabled={isLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px 16px',
            borderRadius: '10px',
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#1E293B',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
            marginBottom: '18px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F8FAFC';
            e.currentTarget.style.borderColor = '#94A3B8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
        >
          {/* Official Google 'G' icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Error notice */}
        {displayError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500,
            }}
          >
            <Shield size={14} color="#DC2626" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Email input */}
          <div>
            <label className="field-label">Varsity Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@university.edu"
                className="auth-input"
                style={{ paddingLeft: '38px' }}
                autoComplete="email"
                disabled={isLoading}
                required
              />
              <Mail
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="field-label" style={{ margin: 0 }}>Password</label>
              {mode === 'login' && (
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocalError('Password reset link dispatched to varsity email.');
                  }}
                  style={{
                    fontSize: '11px',
                    color: '#2563EB',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="auth-input"
                style={{ paddingLeft: '38px', paddingRight: '38px' }}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                disabled={isLoading}
                required
              />
              <Lock
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '11px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (only in signup mode) */}
          {mode === 'signup' && (
            <div>
              <label className="field-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="auth-input"
                  style={{ paddingLeft: '38px' }}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
                <Lock
                  size={16}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          )}

          {/* Checkbox (Remember me or Terms) */}
          {mode === 'login' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className="custom-checkbox"
                style={{
                  borderColor: rememberMe ? '#1D4ED8' : '#CBD5E1',
                  background: rememberMe ? '#1D4ED8' : '#FFFFFF',
                }}
              >
                {rememberMe && <Check size={12} color="#FFFFFF" />}
              </div>
              <span
                onClick={() => setRememberMe(!rememberMe)}
                style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', userSelect: 'none', fontWeight: 500 }}
              >
                Keep me signed in to this device
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.45, marginTop: '2px' }}>
              By registering, you agree to the SportSync Code of Conduct and AIU Sanctioned rules.
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary ${config.btnClass}`}
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating with Cloud...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? 'Continue to Profile Setup'
                    : `Sign In to ${config.title}`}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials shortcut */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} color="#F59E0B" />
              Quick Demo Accounts (Test Verification Flow):
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('student')}
              title="Immediate access to Student Dashboard :3000"
              style={{
                fontSize: '11px',
                color: '#0284C7',
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Athlete (Instant :3000)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('organizer_approved')}
              title="Verified Organizer - immediate access to :3001"
              style={{
                fontSize: '11px',
                color: '#047857',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Organizer (Approved :3001)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('organizer_pending')}
              title="Pending Organizer - triggers Admin Review gate"
              style={{
                fontSize: '11px',
                color: '#B45309',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Organizer (Pending Review)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('coach_approved')}
              title="Verified Coach - immediate access to :3002"
              style={{
                fontSize: '11px',
                color: '#4338CA',
                background: '#EEF2FF',
                border: '1px solid #C7D2FE',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Coach (Approved :3002)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('coach_pending')}
              title="Pending Coach - triggers Admin Review gate"
              style={{
                fontSize: '11px',
                color: '#B45309',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Coach (Pending Review)
            </button>
          </div>
        </div>

        {/* Toggle between Login and Signup */}
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'signup' ? 'login' : 'signup')}
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
              {mode === 'signup' ? 'Sign In' : 'Create an Account'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
