import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield, Sparkles, Check, GraduationCap, Building2, Dumbbell, Loader2 } from 'lucide-react';
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

  const handleFillDemo = (demoRole: UserRole) => {
    onSelectRole(demoRole);
    if (demoRole === 'student') {
      setEmail('alex.striker@sportsphere.edu');
      setPassword('Athlete2026!');
    } else if (demoRole === 'organizer') {
      setEmail('director@nationalleagues.org');
      setPassword('Organizer2026!');
    } else {
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
    <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
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
            marginBottom: '16px',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={16} />
          Change Role ({config.title})
        </button>
      )}

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="glass-card"
        style={{
          padding: '36px 32px',
          boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Role Pill Switcher (especially prominent in Login mode) */}
        {mode === 'login' && (
          <div style={{ marginBottom: '24px' }}>
            <label className="field-label" style={{ marginBottom: '8px' }}>
              Select Active Dashboard:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                background: '#F1F5F9',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <button
                type="button"
                onClick={() => onSelectRole('student')}
                style={{
                  padding: '9px 6px',
                  borderRadius: '9px',
                  border: role === 'student' ? '1px solid rgba(8, 145, 178, 0.3)' : '1px solid transparent',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: role === 'student' ? '#FFFFFF' : 'transparent',
                  color: role === 'student' ? '#0891B2' : '#64748B',
                  boxShadow: role === 'student' ? '0 2px 6px rgba(8, 145, 178, 0.15)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <GraduationCap size={14} />
                Student
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('organizer')}
                style={{
                  padding: '9px 6px',
                  borderRadius: '9px',
                  border: role === 'organizer' ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid transparent',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: role === 'organizer' ? '#FFFFFF' : 'transparent',
                  color: role === 'organizer' ? '#D97706' : '#64748B',
                  boxShadow: role === 'organizer' ? '0 2px 6px rgba(217, 119, 6, 0.15)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Building2 size={14} />
                Organizer
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('coach')}
                style={{
                  padding: '9px 6px',
                  borderRadius: '9px',
                  border: role === 'coach' ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  background: role === 'coach' ? '#FFFFFF' : 'transparent',
                  color: role === 'coach' ? '#7C3AED' : '#64748B',
                  boxShadow: role === 'coach' ? '0 2px 6px rgba(124, 58, 237, 0.15)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Dumbbell size={14} />
                Coach
              </button>
            </div>
          </div>
        )}

        {/* Header inside Card */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: config.accentBg,
              border: `1px solid ${config.color}30`,
              color: config.color,
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={12} />
            {config.title} • PORT {config.port}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 6px',
            }}
          >
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            {mode === 'signup'
              ? 'Powered by Firebase Auth & Cloud Firestore'
              : `Sign in to enter the ${config.title} dashboard`}
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onGoogleSignIn(role)}
          style={{
            width: '100%',
            padding: '11px 16px',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#1E293B',
            fontSize: '14px',
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '18px',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
            transition: 'all 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Or with email
          </span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Error message */}
        {displayError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Shield size={14} />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email field */}
          <div>
            <label className="field-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sportsphere.org"
                className={`auth-input ${config.inputClass}`}
                style={{ paddingLeft: '40px' }}
                autoComplete="email"
                disabled={isLoading}
                required
              />
              <Mail
                size={17}
                color="#64748B"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="field-label">Password</label>
              {mode === 'login' && (
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link will be sent to your registered Firebase email.');
                  }}
                  style={{
                    fontSize: '11px',
                    color: config.color,
                    textDecoration: 'none',
                    fontWeight: 700,
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
                className={`auth-input ${config.inputClass}`}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                disabled={isLoading}
                required
              />
              <Lock
                size={17}
                color="#64748B"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
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
                  className={`auth-input ${config.inputClass}`}
                  style={{ paddingLeft: '40px' }}
                  autoComplete="new-password"
                  disabled={isLoading}
                  required
                />
                <Lock
                  size={17}
                  color="#64748B"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          )}

          {/* Checkbox (Remember me or Terms) */}
          {mode === 'login' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className="custom-checkbox"
                style={{
                  borderColor: rememberMe ? config.color : '#CBD5E1',
                  background: rememberMe ? config.accentBg : '#FFFFFF',
                }}
              >
                {rememberMe && <Check size={12} color={config.color} />}
              </div>
              <span
                onClick={() => setRememberMe(!rememberMe)}
                style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', userSelect: 'none', fontWeight: 500 }}
              >
                Keep me signed in to {config.title}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
              By registering, you agree to the SportSphere Code of Conduct & athletic verification rules.
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary ${config.btnClass}`}
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Connecting to Firebase...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signup'
                    ? 'Continue to Profile Setup'
                    : `Launch ${config.title} Dashboard`}
                </span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials shortcut */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Quick Fill Demo:
            </span>
            <button
              type="button"
              onClick={() => handleFillDemo(role)}
              style={{
                fontSize: '12px',
                color: config.color,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
            >
              Fill {config.title} Demo
            </button>
          </div>
        </div>

        {/* Toggle between Login and Signup */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'signup' ? 'login' : 'signup')}
              style={{
                background: 'none',
                border: 'none',
                color: config.color,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              {mode === 'signup' ? 'Sign In' : 'Sign Up for SportSphere'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
