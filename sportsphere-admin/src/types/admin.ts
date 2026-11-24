import type { UserRole } from './auth';

export type AdminSection =
  | 'overview'
  | 'users'
  | 'coach-verification'
  | 'organizer-verification'
  | 'events'
  | 'moderation'
  | 'performance'
  | 'reports'
  | 'payments'
  | 'notifications'
  | 'analytics'
  | 'audit-logs'
  | 'settings';

export interface AdminUser {
  uid: string;
  email: string;
  fullName: string;
  college?: string;
  roles: UserRole[];
  status: 'active' | 'suspended' | 'pending' | 'flagged';
  createdAt: string;
  avatar?: string;
  lastLogin?: string;
  phone?: string;
  bio?: string;
  verificationNotes?: string;
}

export interface VerificationDocument {
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'doc';
  size?: string;
}

export interface CoachApplication {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  sport: string;
  collegeOrOrg: string;
  experienceYears: string;
  certification: string;
  licenseNo: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected' | 'more_info';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface OrganizerApplication {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  collegeName: string;
  studentId: string;
  collegeEmail: string;
  department: string;
  nocLetterUrl: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface TournamentEvent {
  id: string;
  title: string;
  sport: string;
  organizerId: string;
  organizerName: string;
  college: string;
  venue: string;
  city: string;
  dates: {
    start: string;
    end: string;
  };
  circuitTier: 'University' | 'State' | 'National' | 'District';
  registrationFee: number;
  prizePool: string;
  maxTeams: number;
  registeredCount: number;
  posterUrl: string;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'rejected' | 'cancelled';
  submittedAt: string;
  rejectionReason?: string;
  isAiSanctioned?: boolean;
}

export interface ModerationItem {
  id: string;
  type: 'video' | 'image' | 'profile' | 'comment';
  authorId: string;
  authorName: string;
  authorRole: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  flagReason: string;
  reportedBy: string;
  reportedCount: number;
  status: 'pending' | 'approved' | 'removed' | 'warning_issued';
  createdAt: string;
}

export interface PerformanceClaim {
  id: string;
  athleteId: string;
  athleteName: string;
  college: string;
  sport: string;
  event: string;
  claimedValue: string;
  timingMethod: 'FAT' | 'Hand-Timed';
  windAssist?: string;
  coachSignoffId: string;
  coachName: string;
  venue: string;
  date: string;
  status: 'pending' | 'verified' | 'disputed' | 'rejected';
  disputeReason?: string;
  verifiedAt?: string;
}

export interface ReportComplaint {
  id: string;
  category:
    | 'fake_tournament'
    | 'fraudulent_organizer'
    | 'fake_profile'
    | 'misleading_record'
    | 'inappropriate_media'
    | 'harassment';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  reporterName: string;
  reporterEmail: string;
  targetEntityId: string;
  targetEntityName: string;
  description: string;
  evidenceUrls?: string[];
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  gatewayId: string;
  payerName: string;
  payerEmail: string;
  eventId: string;
  eventTitle: string;
  amount: number;
  currency: string;
  platformFee: number;
  organizerPayout: number;
  status: 'captured' | 'pending' | 'failed' | 'refunded';
  method: 'upi' | 'card' | 'netbanking';
  createdAt: string;
  refundReason?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all' | 'athletes' | 'coaches' | 'organizers';
  type: 'announcement' | 'approval' | 'rejection' | 'security' | 'urgent';
  sentAt: string;
  sentBy: string;
  readCount: number;
}

export interface AuditLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action:
    | 'ROLE_CHANGE'
    | 'COACH_APPROVAL'
    | 'COACH_REJECTION'
    | 'ORGANIZER_APPROVAL'
    | 'ORGANIZER_REJECTION'
    | 'EVENT_APPROVAL'
    | 'EVENT_REJECTION'
    | 'EVENT_SUSPENSION'
    | 'CONTENT_TAKEDOWN'
    | 'ACCOUNT_SUSPENSION'
    | 'ACCOUNT_REACTIVATION'
    | 'PERFORMANCE_VERIFICATION'
    | 'REFUND_PROCESSED'
    | 'BROADCAST_NOTIFICATION'
    | 'SETTINGS_UPDATE';
  targetType: 'User' | 'Coach' | 'Organizer' | 'Event' | 'Media' | 'Record' | 'Payment' | 'System';
  targetId: string;
  targetName: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalAthletes: number;
  totalCoaches: number;
  totalOrganizers: number;
  pendingVerifications: number;
  totalPublishedEvents: number;
  pendingEventApprovals: number;
  totalRegistrations: number;
  totalPaymentsCount: number;
  totalRevenue: number;
  totalHighlights: number;
  reportedContentCount: number;
}
