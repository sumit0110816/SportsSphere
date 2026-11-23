import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { RoleSelector } from './components/RoleSelector';
import { AuthForm } from './components/AuthForm';
import { StudentProfileForm } from './components/ProfileSetup/StudentProfileForm';
import { OrganizerProfileForm } from './components/ProfileSetup/OrganizerProfileForm';
import { CoachProfileForm } from './components/ProfileSetup/CoachProfileForm';
import { SuccessScreen } from './components/SuccessScreen';
import {
  type UserRole,
  type AuthMode,
  type AuthStep,
  type BaseCredentials,
  type StudentProfileData,
  type OrganizerProfileData,
  type CoachProfileData,
  type UserSession,
} from './types/auth';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  saveProfileToFirestore,
  subscribeToAuth,
} from './firebase/authService';

export const App: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<AuthStep>('role');
  const [credentials, setCredentials] = useState<BaseCredentials | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentUid, setCurrentUid] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Subscribe to Firebase auth state if available
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (user && !session) {
        setCurrentUid(user.uid);
      }
    });
    return () => unsubscribe();
  }, [session]);

  // Mode toggle
  const handleToggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setAuthError('');
    if (newMode === 'login') {
      if (!selectedRole) setSelectedRole('student');
      setStep('credentials');
    } else {
      setStep('role');
    }
  };

  const handleContinueFromRole = () => {
    if (!selectedRole) return;
    setAuthError('');
    setStep('credentials');
  };

  // Step 2 Signup -> Calls Firebase Auth to create user account
  const handleSignupCredentials = async (creds: BaseCredentials) => {
    if (!selectedRole) return;
    setIsLoading(true);
    setAuthError('');

    const result = await registerWithEmail(creds.email, creds.password, selectedRole);
    setIsLoading(false);

    if (!result.success) {
      setAuthError(result.error || 'Failed to create Firebase user account');
      return;
    }

    setCredentials(creds);
    if (result.user?.uid) {
      setCurrentUid(result.user.uid);
    }
    setStep('profile');
  };

  // Login -> Authenticates against Firebase Auth & checks Firestore profile
  const handleLoginSubmit = async (role: UserRole, creds: BaseCredentials) => {
    setSelectedRole(role);
    setIsLoading(true);
    setAuthError('');

    const result = await loginWithEmail(creds.email, creds.password, role);
    setIsLoading(false);

    if (!result.success) {
      setAuthError(result.error || 'Failed to log in with Firebase credentials');
      return;
    }

    const assignedRole = result.role || role;
    setSelectedRole(assignedRole);
    if (result.user?.uid) {
      setCurrentUid(result.user.uid);
    }

    // Name derived dynamically from login user's account / profile
    const derivedName =
      (result.profile as { fullName?: string })?.fullName ||
      result.user?.displayName ||
      creds.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const newSession: UserSession = {
      role: assignedRole,
      email: result.user?.email || creds.email,
      name: derivedName,
      profile: result.profile || null,
    };

    setSession(newSession);
    setStep('success');
  };

  // Google Sign In
  const handleGoogleSignIn = async (role: UserRole) => {
    setIsLoading(true);
    setAuthError('');

    const result = await loginWithGoogle(role);
    setIsLoading(false);

    if (!result.success) {
      setAuthError(result.error || 'Google Sign-In failed');
      return;
    }

    const assignedRole = result.role || role;
    setSelectedRole(assignedRole);
    if (result.user?.uid) {
      setCurrentUid(result.user.uid);
    }

    const derivedName =
      result.user?.displayName ||
      (result.profile as { fullName?: string })?.fullName ||
      result.user?.email?.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ||
      'SportSphere Member';

    const newSession: UserSession = {
      role: assignedRole,
      email: result.user?.email || '',
      name: derivedName,
      profile: result.profile || null,
    };

    setSession(newSession);
    setStep('success');
  };

  // Step 3 Profile Submissions -> Writes to Cloud Firestore
  const handleStudentProfileSubmit = async (profile: StudentProfileData) => {
    if (!selectedRole) return;
    setIsLoading(true);

    const uid = currentUid || 'user-' + Date.now();
    await saveProfileToFirestore(uid, 'student', profile);
    setIsLoading(false);

    const newSession: UserSession = {
      role: 'student',
      email: credentials?.email || 'athlete@sportsphere.org',
      name: profile.fullName,
      profile,
    };
    setSession(newSession);
    setStep('success');
  };

  const handleOrganizerProfileSubmit = async (profile: OrganizerProfileData) => {
    if (!selectedRole) return;
    setIsLoading(true);

    const uid = currentUid || 'user-' + Date.now();
    await saveProfileToFirestore(uid, 'organizer', profile);
    setIsLoading(false);

    const newSession: UserSession = {
      role: 'organizer',
      email: credentials?.email || 'organizer@sportsphere.org',
      name: profile.fullName,
      profile,
    };
    setSession(newSession);
    setStep('success');
  };

  const handleCoachProfileSubmit = async (profile: CoachProfileData) => {
    if (!selectedRole) return;
    setIsLoading(true);

    const uid = currentUid || 'user-' + Date.now();
    await saveProfileToFirestore(uid, 'coach', profile);
    setIsLoading(false);

    const newSession: UserSession = {
      role: 'coach',
      email: credentials?.email || 'coach@sportsphere.org',
      name: profile.fullName,
      profile,
    };
    setSession(newSession);
    setStep('success');
  };

  const handleReset = () => {
    setSession(null);
    setCredentials(null);
    setSelectedRole(null);
    setCurrentUid('');
    setAuthError('');
    setMode('signup');
    setStep('role');
  };

  const initialDerivedName = credentials?.email
    ? credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#F8FAFC' }}>
      {/* Background with clean light canvas */}
      <div className="auth-bg" />

      {/* Top Header */}
      <Header currentRole={selectedRole} mode={mode} onToggleMode={handleToggleMode} />

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px 60px',
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}
      >
        {/* Dynamic view based on step & mode */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Role Selection */}
          {mode === 'signup' && step === 'role' && (
            <motion.div
              key="role-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%' }}
            >
              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={(r) => setSelectedRole(r)}
                onContinue={handleContinueFromRole}
                onSwitchToLogin={() => handleToggleMode('login')}
              />
            </motion.div>
          )}

          {/* STEP 2: Credentials (or Login mode) */}
          {(step === 'credentials' || mode === 'login') && step !== 'success' && (
            <motion.div
              key="auth-form-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%' }}
            >
              <AuthForm
                mode={mode}
                role={selectedRole || 'student'}
                onSelectRole={(r) => setSelectedRole(r)}
                onSwitchMode={handleToggleMode}
                onBackToRoles={() => setStep('role')}
                onSubmitSignupCredentials={handleSignupCredentials}
                onSubmitLogin={handleLoginSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                isLoading={isLoading}
                externalError={authError}
              />
            </motion.div>
          )}

          {/* STEP 3: Profile Setup per role */}
          {mode === 'signup' && step === 'profile' && selectedRole === 'student' && (
            <motion.div
              key="student-profile-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%' }}
            >
              <StudentProfileForm
                initialEmail={credentials?.email || ''}
                initialName={initialDerivedName}
                onBack={() => setStep('credentials')}
                onSubmit={handleStudentProfileSubmit}
              />
            </motion.div>
          )}

          {mode === 'signup' && step === 'profile' && selectedRole === 'organizer' && (
            <motion.div
              key="organizer-profile-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%' }}
            >
              <OrganizerProfileForm
                initialEmail={credentials?.email || ''}
                initialName={initialDerivedName}
                onBack={() => setStep('credentials')}
                onSubmit={handleOrganizerProfileSubmit}
              />
            </motion.div>
          )}

          {mode === 'signup' && step === 'profile' && selectedRole === 'coach' && (
            <motion.div
              key="coach-profile-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%' }}
            >
              <CoachProfileForm
                initialEmail={credentials?.email || ''}
                initialName={initialDerivedName}
                onBack={() => setStep('credentials')}
                onSubmit={handleCoachProfileSubmit}
              />
            </motion.div>
          )}

          {/* STEP 4: Success & Dashboard Redirect */}
          {step === 'success' && session && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <SuccessScreen session={session} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Enterprise Footer */}
      <footer
        style={{
          width: '100%',
          padding: '16px 28px',
          borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF',
          fontSize: '12px',
          color: '#64748B',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>© 2026 SportSync Universal Athletics Network • AIU Sanctioned • 256-Bit SSL Encrypted</span>
          <div style={{ display: 'flex', gap: '16px', fontWeight: 500 }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security Overview</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
