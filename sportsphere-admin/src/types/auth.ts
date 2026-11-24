export type UserRole = 'student' | 'organizer' | 'coach';

export type AuthMode = 'signup' | 'login';

export type AuthStep = 'role' | 'credentials' | 'profile' | 'success';

export interface BaseCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface StudentProfileData {
  fullName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  institution: string;
  primarySport: string;
  positionOrEvent: string;
  experienceLevel: string;
  city: string;
  bio: string;
  avatar: string;
}

export interface OrganizerProfileData {
  fullName: string;
  designation: string;
  organizationName: string;
  organizationType: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  bio: string;
  avatar: string;
}

export interface CoachProfileData {
  fullName: string;
  title: string;
  primarySport: string;
  specialization: string;
  yearsOfExperience: string;
  certification: string;
  currentAcademy: string;
  city: string;
  linkedinUrl: string;
  bio: string;
  avatar: string;
}

export interface UserSession {
  role: UserRole;
  email: string;
  name: string;
  profile: StudentProfileData | OrganizerProfileData | CoachProfileData | null;
}

export const ROLE_CONFIG = {
  student: {
    title: 'Student Athlete',
    tagline: 'Compete, track performance & get scouted',
    badge: 'ATHLETE PORTAL',
    color: '#0891B2',
    gradient: 'from-cyan-600 to-blue-600',
    btnClass: 'btn-student',
    borderClass: 'active-student',
    inputClass: 'auth-input-student',
    dotClass: 'step-dot-student',
    dashboardUrl: 'http://localhost:3000',
    port: 3000,
    accentHex: '#0891B2',
    accentBg: 'rgba(8, 145, 178, 0.08)',
    features: ['Tournament registration', 'Live match brackets & scorecards', 'Scout & coach visibility', 'Performance highlights showcase'],
  },
  organizer: {
    title: 'Tournament Organizer',
    tagline: 'Host, schedule & broadcast tournaments',
    badge: 'ORGANIZER STUDIO',
    color: '#D97706',
    gradient: 'from-amber-600 to-orange-600',
    btnClass: 'btn-organizer',
    borderClass: 'active-organizer',
    inputClass: 'auth-input-organizer',
    dotClass: 'step-dot-organizer',
    dashboardUrl: 'http://localhost:3001',
    port: 3001,
    accentHex: '#D97706',
    accentBg: 'rgba(217, 119, 6, 0.08)',
    features: ['Instant tournament creation', 'Automated bracket generation', 'Team & referee assignments', 'Real-time live scoring'],
  },
  coach: {
    title: 'Athletic Coach',
    tagline: 'Scout athletes, events & post highlights',
    badge: 'COACH PRO HUB',
    color: '#7C3AED',
    gradient: 'from-purple-600 to-indigo-600',
    btnClass: 'btn-coach',
    borderClass: 'active-coach',
    inputClass: 'auth-input-coach',
    dotClass: 'step-dot-coach',
    dashboardUrl: 'http://localhost:3002',
    port: 3002,
    accentHex: '#7C3AED',
    accentBg: 'rgba(124, 58, 237, 0.08)',
    features: ['LinkedIn-style coach profile', 'Highlight reels & video posts', 'Local, district & national news', 'Nearby tournament radar'],
  },
} as const;
