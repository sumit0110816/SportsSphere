export type UserRole = 'Athlete' | 'Organizer' | 'Coach';

export type NavTabId =
  | 'overview'
  | 'discover'
  | 'map'
  | 'registrations'
  | 'calendar'
  | 'achievements'
  | 'analytics'
  | 'scholarships'
  | 'saved';

export interface UserLocation {
  latitude: number;
  longitude: number;
  cityName: string;
  source: 'gps' | 'preset' | 'default';
  isDetecting?: boolean;
  accuracy?: number;
}

export interface HeroBackground {
  id: string;
  title: string;
  sport: string;
  athleteFocus: string;
  imageUrl: string;
  badgeColor: string;
}

export interface Competition {
  id: string;
  title: string;
  category: 'Football' | 'Badminton' | 'Athletics' | 'Swimming' | 'Volleyball' | 'Basketball';
  circuitTier: 'University' | 'District' | 'State' | 'National' | 'Open';
  organizer: string;
  dateRange: string;
  venue: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  entryFee: string;
  feeAmount: number;
  deadline: string;
  matchScore: number;
  image: string;
  tags: string[];
  eligibility: string;
  description: string;
  registeredCount: number;
  maxSlots: number;
  isBookmarked?: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  month: string;
  day: string;
  dateStr: string;
  venue: string;
  callTime: string;
  status: 'Confirmed' | 'Pending Review' | 'Ticket Ready';
  bibNumber: string;
  heatInfo: string;
  category: string;
  isImportant?: boolean;
}

export interface RegistrationItem {
  id: string;
  competitionTitle: string;
  category: string;
  appliedDate: string;
  eventDate: string;
  venue: string;
  fee: string;
  status: 'Confirmed' | 'Under Review' | 'Waitlisted' | 'Document Required';
  bibNumber?: string;
  laneInfo?: string;
  qrCodeSeed: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  year: string;
  tier: 'National' | 'State' | 'University' | 'Special';
  icon: string;
  verifiedBy: string;
  recordStat?: string;
  description: string;
}

export interface Teammate {
  id: string;
  name: string;
  role: string;
  specialty: string;
  pb: string;
  avatar: string;
  status: 'Active' | 'Injured' | 'In Training';
  attendance: string;
}

export interface VenueSpot {
  id: string;
  name: string;
  category: string;
  distance: string;
  distanceNum: number;
  eventsCount: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  coords: { x: number; y: number };
  image: string;
  features: string[];
}
