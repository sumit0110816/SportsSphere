export type ViewId =
  | 'overview'
  | 'events'
  | 'registrations'
  | 'teams'
  | 'fixtures'
  | 'scores'
  | 'payments'
  | 'venues'
  | 'announcements'
  | 'certificates'
  | 'analytics'
  | 'settings';

export type UserRole = 'Athlete' | 'Organizer' | 'Coach';

export interface SportEvent {
  id: string;
  title: string;
  subtitle: string;
  sport: 'Football' | 'Badminton' | 'Basketball' | 'Athletics' | string;
  date: string;
  daysLeft: number;
  daysLeftColor?: 'red' | 'blue';
  venue: string;
  registeredCount: number;
  totalCapacity: number;
  status: 'Open' | 'Draft' | 'Completed' | 'In Progress';
}

export interface RegistrationApplicant {
  id: string;
  name: string;
  tournament: string;
  sport: string;
  teamOrCollege: string;
  documentsStatus: string;
  feeAmount: number;
  feeStatus: 'Paid' | 'Pending' | 'Waived';
  status: 'Pending' | 'Approved' | 'Declined';
  appliedAt: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  timeAgo: string;
  type: 'registration' | 'payment' | 'venue' | 'schedule';
}

export interface TeamRoster {
  id: string;
  initials: string;
  colorClass: string;
  name: string;
  coach: string;
  athleteCount: number;
  sportsBreakdown: { sport: string; count: number }[];
}

export interface MatchScore {
  id: string;
  title: string;
  venueCourt: string;
  teamA: string;
  scoreA: number;
  teamB: string;
  scoreB: number;
  status: 'Live' | 'Scheduled' | 'Completed';
  round: string;
}

export interface VenueResource {
  id: string;
  name: string;
  status: 'In Use' | 'Available' | 'Maintenance';
  description: string;
  currentBooking: string;
  utilizationPercent: number;
}
