import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './config';
import type { UserRole, StudentProfileData, OrganizerProfileData, CoachProfileData } from '../types/auth';

export interface AuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string;
    displayName?: string | null;
  };
  role?: UserRole;
  profile?: StudentProfileData | OrganizerProfileData | CoachProfileData | null;
  error?: string;
}

/**
 * Format raw Firebase errors into human-readable user guidance
 */
export const formatFirebaseError = (error: unknown): string => {
  if (typeof error !== 'object' || !error) return 'An unknown error occurred';
  const err = error as { code?: string; message?: string };

  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify and try again.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet.';
    case 'auth/operation-not-allowed':
      return 'Email/Password or Google sign-in is not enabled in your Firebase console.';
    default:
      return err.message || 'Authentication failed. Please try again.';
  }
};

/**
 * Register a new user account with Email and Password
 */
export const registerWithEmail = async (
  email: string,
  pass: string,
  role: UserRole
): Promise<AuthResult> => {
  if (!isFirebaseConfigured() || !auth || !db) {
    // Graceful offline/demo mode simulation
    return {
      success: true,
      user: {
        uid: 'demo-' + Math.random().toString(36).substring(2, 9),
        email,
      },
      role,
      profile: null,
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Initialize base user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || email,
      },
      role,
      profile: null,
    };
  } catch (error) {
    return {
      success: false,
      error: formatFirebaseError(error),
    };
  }
};

/**
 * Sign in existing user with Email and Password
 */
export const loginWithEmail = async (
  email: string,
  pass: string,
  fallbackRole: UserRole
): Promise<AuthResult> => {
  if (!isFirebaseConfigured() || !auth || !db) {
    // Offline / Demo mode simulation
    return {
      success: true,
      user: {
        uid: 'demo-' + Math.random().toString(36).substring(2, 9),
        email,
      },
      role: fallbackRole,
      profile: null,
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Retrieve user's role and profile from Cloud Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    let assignedRole: UserRole = fallbackRole;
    let savedProfile = null;

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      if (data.role) assignedRole = data.role as UserRole;
      if (data.profile) savedProfile = data.profile;
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName,
      },
      role: assignedRole,
      profile: savedProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: formatFirebaseError(error),
    };
  }
};

/**
 * Sign in with Google Popup
 */
export const loginWithGoogle = async (
  preferredRole: UserRole
): Promise<AuthResult> => {
  if (!isFirebaseConfigured() || !auth || !db || !googleProvider) {
    // Demo mode simulation
    return {
      success: true,
      user: {
        uid: 'demo-google-' + Math.random().toString(36).substring(2, 9),
        email: 'google.athlete@sportsphere.org',
        displayName: 'Google Demo User',
      },
      role: preferredRole,
      profile: null,
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    let role: UserRole = preferredRole;
    let profile = null;

    if (!userDocSnap.exists()) {
      // First time Google login -> assign role & create record
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: preferredRole,
        createdAt: serverTimestamp(),
      });
    } else {
      const data = userDocSnap.data();
      if (data.role) role = data.role as UserRole;
      if (data.profile) profile = data.profile;
    }

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
      },
      role,
      profile,
    };
  } catch (error) {
    return {
      success: false,
      error: formatFirebaseError(error),
    };
  }
};

/**
 * Save / Update role-specific profile data in Cloud Firestore
 */
export const saveProfileToFirestore = async (
  uid: string,
  role: UserRole,
  profile: StudentProfileData | OrganizerProfileData | CoachProfileData
): Promise<{ success: boolean; error?: string }> => {
  if (!isFirebaseConfigured() || !db) {
    // Save locally for demo mode
    try {
      localStorage.setItem(`sportsphere_profile_${uid}`, JSON.stringify({ role, profile }));
    } catch {
      // ignore
    }
    return { success: true };
  }

  try {
    // Update main user record
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        role,
        profile,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Also write to role-specific collection for indexed querying
    const collectionName = role === 'student' ? 'athletes' : role === 'organizer' ? 'organizers' : 'coaches';
    await setDoc(doc(db, collectionName, uid), {
      uid,
      ...profile,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: formatFirebaseError(error),
    };
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  if (isFirebaseConfigured() && auth) {
    await signOut(auth);
  }
};

/**
 * Subscribe to Firebase Auth state changes
 */
export const subscribeToAuth = (callback: (user: User | null) => void): (() => void) => {
  if (isFirebaseConfigured() && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
};
