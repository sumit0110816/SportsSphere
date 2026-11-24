import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type {
  AdminUser,
  CoachApplication,
  OrganizerApplication,
  TournamentEvent,
  ModerationItem,
  PerformanceClaim,
  ReportComplaint,
  PaymentRecord,
  AdminNotification,
  AuditLog,
  PlatformStats,
} from '../types/admin';
import type { UserRole } from '../types/auth';

// In-Memory fallback & initial seed storage for instant responsive UI
let cachedUsers: AdminUser[] = [
  {
    uid: 'usr_001',
    email: 'rohit.sharma@iitd.ac.in',
    fullName: 'Rohit Sharma',
    college: 'IIT Delhi',
    roles: ['student', 'coach'],
    status: 'active',
    createdAt: '2026-09-12T10:30:00Z',
    phone: '+91 98765 43210',
    bio: 'Varsity Sprinter and Junior Track Coach',
    lastLogin: '2026-11-24T08:15:00Z',
  },
  {
    uid: 'usr_002',
    email: 'ananya.iyer@bits-pilani.ac.in',
    fullName: 'Ananya Iyer',
    college: 'BITS Pilani',
    roles: ['student', 'organizer'],
    status: 'active',
    createdAt: '2026-08-20T14:45:00Z',
    phone: '+91 98111 22334',
    bio: 'Sports Council Secretary & Tournament Director',
    lastLogin: '2026-11-23T19:40:00Z',
  },
  {
    uid: 'usr_003',
    email: 'vikram.singh@delhiathletics.org',
    fullName: 'Vikram Singh',
    college: 'Delhi University',
    roles: ['coach'],
    status: 'active',
    createdAt: '2026-07-15T09:00:00Z',
    phone: '+91 99223 34455',
    bio: 'Certified AFI Level-2 Track & Field Head Coach',
    lastLogin: '2026-11-24T06:50:00Z',
  },
  {
    uid: 'usr_004',
    email: 'priya.nair@annauniv.edu',
    fullName: 'Priya Nair',
    college: 'Anna University',
    roles: ['student'],
    status: 'active',
    createdAt: '2026-10-02T11:20:00Z',
    phone: '+91 97444 55667',
    bio: 'National 400m Hurdler',
    lastLogin: '2026-11-22T16:10:00Z',
  },
  {
    uid: 'usr_005',
    email: 'karan.malhotra@spit.ac.in',
    fullName: 'Karan Malhotra',
    college: 'SPIT Mumbai',
    roles: ['student', 'coach', 'organizer'],
    status: 'active',
    createdAt: '2026-06-11T16:15:00Z',
    phone: '+91 98333 44556',
    bio: 'Badminton Captain & Inter-collegiate Fest Head',
    lastLogin: '2026-11-24T07:22:00Z',
  },
  {
    uid: 'usr_006',
    email: 'tarun.verma@spammed.org',
    fullName: 'Tarun Verma',
    college: 'Apex Tech Institute',
    roles: ['organizer'],
    status: 'suspended',
    createdAt: '2026-11-01T12:00:00Z',
    phone: '+91 91234 56789',
    bio: 'Unverified unofficial sports committee account',
    verificationNotes: 'Flagged for fraudulent fee collection claim',
    lastLogin: '2026-11-18T10:00:00Z',
  },
  {
    uid: 'usr_007',
    email: 'meera.patel@nirmauni.ac.in',
    fullName: 'Meera Patel',
    college: 'Nirma University',
    roles: ['student'],
    status: 'pending',
    createdAt: '2026-11-22T15:00:00Z',
    phone: '+91 98777 88990',
    bio: 'State level Table Tennis player',
    lastLogin: '2026-11-22T15:00:00Z',
  },
];

let cachedCoachApps: CoachApplication[] = [
  {
    id: 'capp_101',
    uid: 'usr_101',
    fullName: 'Arjun Rathore',
    email: 'arjun.rathore@sportsauthority.in',
    sport: 'Track & Field / Athletics',
    collegeOrOrg: 'National Institute of Sports (NIS) Patiala',
    experienceYears: '8 years',
    certification: 'AFI Level-2 & World Athletics Certified Coach',
    licenseNo: 'WA-IND-2022-891',
    documents: [
      { name: 'NIS_Patiala_Diploma.pdf', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '2.4 MB' },
      { name: 'AFI_Level2_Credential.pdf', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '1.8 MB' },
    ],
    status: 'pending',
    submittedAt: '2026-11-22T14:30:00Z',
  },
  {
    id: 'capp_102',
    uid: 'usr_102',
    fullName: 'Sunita D Souza',
    email: 'sunita.dsouza@stxaviers.edu',
    sport: 'Basketball',
    collegeOrOrg: "St. Xavier's College, Mumbai",
    experienceYears: '6 years',
    certification: 'FIBA Coach Level 1 Certification',
    licenseNo: 'FIBA-ASIA-2023-412',
    documents: [
      { name: 'FIBA_Coaching_Certificate.pdf', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '3.1 MB' },
      { name: 'College_Deputation_Letter.pdf', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '1.2 MB' },
    ],
    status: 'pending',
    submittedAt: '2026-11-23T09:15:00Z',
  },
  {
    id: 'capp_103',
    uid: 'usr_003',
    fullName: 'Vikram Singh',
    email: 'vikram.singh@delhiathletics.org',
    sport: 'Sprints & Relays',
    collegeOrOrg: 'Delhi University Sports Board',
    experienceYears: '11 years',
    certification: 'AFI Senior Coach & Masters in Physical Education',
    licenseNo: 'AFI-DL-2018-099',
    documents: [
      { name: 'AFI_Master_Coach.pdf', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '4.5 MB' },
    ],
    status: 'approved',
    submittedAt: '2026-07-15T09:00:00Z',
    reviewedAt: '2026-07-16T11:00:00Z',
  },
];

let cachedOrgApps: OrganizerApplication[] = [
  {
    id: 'orgapp_201',
    uid: 'usr_201',
    fullName: 'Kavita Sundaram',
    email: 'kavita.s@iitm.ac.in',
    phone: '+91 94440 12345',
    collegeName: 'IIT Madras',
    studentId: 'ED22B045',
    collegeEmail: 'kavita.sundaram@smail.iitm.ac.in',
    department: 'Sports Organizing Committee (Saarang Sports)',
    nocLetterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    documents: [
      { name: 'IITM_Dean_NOC_Authorization.pdf', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '2.1 MB' },
      { name: 'Student_ID_Scan.jpg', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', type: 'image', size: '950 KB' },
    ],
    status: 'pending',
    submittedAt: '2026-11-23T11:00:00Z',
  },
  {
    id: 'orgapp_202',
    uid: 'usr_202',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.d@coep.ac.in',
    phone: '+91 97654 32109',
    collegeName: 'COEP Technological University Pune',
    studentId: '112103042',
    collegeEmail: 'deshmukhr21.mech@coep.ac.in',
    department: 'COEP Zest Annual Sports Festival',
    nocLetterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    documents: [
      { name: 'Sports_Advisor_Signed_NOC.pdf', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '1.9 MB' },
    ],
    status: 'pending',
    submittedAt: '2026-11-22T17:45:00Z',
  },
  {
    id: 'orgapp_203',
    uid: 'usr_002',
    fullName: 'Ananya Iyer',
    email: 'ananya.iyer@bits-pilani.ac.in',
    phone: '+91 98111 22334',
    collegeName: 'BITS Pilani',
    studentId: '2023A7PS0102P',
    collegeEmail: 'f20230102@pilani.bits-pilani.ac.in',
    department: 'BOSM Sports Council',
    nocLetterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    documents: [
      { name: 'BITS_BOSM_Authorization.pdf', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', type: 'pdf', size: '3.4 MB' },
    ],
    status: 'approved',
    submittedAt: '2026-08-20T14:45:00Z',
    reviewedAt: '2026-08-21T10:00:00Z',
  },
];

let cachedEvents: TournamentEvent[] = [
  {
    id: 'evt_301',
    title: 'All-India Inter-University Athletics Championship 2026',
    sport: 'Track & Field / Athletics',
    organizerId: 'usr_002',
    organizerName: 'Ananya Iyer (BITS Pilani)',
    college: 'BITS Pilani',
    venue: 'BITS Central Sports Complex Stadium',
    city: 'Pilani, Rajasthan',
    dates: { start: '2026-12-10', end: '2026-12-14' },
    circuitTier: 'National',
    registrationFee: 1500,
    prizePool: '₹2,50,000',
    maxTeams: 64,
    registeredCount: 48,
    posterUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    submittedAt: '2026-10-15T10:00:00Z',
    isAiSanctioned: true,
  },
  {
    id: 'evt_302',
    title: 'Inter-Collegiate Invitational Basketball Cup 2026',
    sport: 'Basketball',
    organizerId: 'usr_005',
    organizerName: 'Karan Malhotra',
    college: 'SPIT Mumbai',
    venue: 'Andheri Sports Arena Court 1',
    city: 'Mumbai, Maharashtra',
    dates: { start: '2026-12-18', end: '2026-12-20' },
    circuitTier: 'University',
    registrationFee: 2000,
    prizePool: '₹1,00,000',
    maxTeams: 32,
    registeredCount: 16,
    posterUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    submittedAt: '2026-11-23T14:00:00Z',
    isAiSanctioned: false,
  },
  {
    id: 'evt_303',
    title: 'Delhi State Inter-College Badminton Smashdown',
    sport: 'Badminton',
    organizerId: 'usr_001',
    organizerName: 'Rohit Sharma',
    college: 'IIT Delhi',
    venue: 'Mittal Indoor Sports Complex',
    city: 'New Delhi',
    dates: { start: '2026-12-05', end: '2026-12-07' },
    circuitTier: 'State',
    registrationFee: 800,
    prizePool: '₹75,000',
    maxTeams: 64,
    registeredCount: 64,
    posterUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    submittedAt: '2026-10-20T08:00:00Z',
    isAiSanctioned: true,
  },
  {
    id: 'evt_304',
    title: 'South Zone Collegiate Football Trophy',
    sport: 'Football',
    organizerId: 'usr_201',
    organizerName: 'Kavita Sundaram',
    college: 'IIT Madras',
    venue: 'IITM Main Football Ground',
    city: 'Chennai, Tamil Nadu',
    dates: { start: '2026-12-22', end: '2026-12-27' },
    circuitTier: 'National',
    registrationFee: 2500,
    prizePool: '₹1,50,000',
    maxTeams: 24,
    registeredCount: 0,
    posterUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    submittedAt: '2026-11-24T05:30:00Z',
    isAiSanctioned: false,
  },
];

let cachedModeration: ModerationItem[] = [
  {
    id: 'mod_401',
    type: 'video',
    authorId: 'usr_004',
    authorName: 'Priya Nair',
    authorRole: 'student',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-running-on-a-running-track-40348-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    caption: '100m sprint training round - Clocked 11.2s at morning trials!',
    flagReason: 'Suspicious timing claim without official electronic FAT timing sensor proof',
    reportedBy: 'Coach Vikram Singh',
    reportedCount: 3,
    status: 'pending',
    createdAt: '2026-11-23T18:20:00Z',
  },
  {
    id: 'mod_402',
    type: 'comment',
    authorId: 'usr_999',
    authorName: 'Anonymous_User',
    authorRole: 'student',
    mediaUrl: '',
    caption: 'Fake tournament alert! Do not pay registration fees to Tarun Verma.',
    flagReason: 'Targeted harassment and unverified allegations',
    reportedBy: 'Tarun Verma',
    reportedCount: 1,
    status: 'pending',
    createdAt: '2026-11-22T21:10:00Z',
  },
];

let cachedClaims: PerformanceClaim[] = [
  {
    id: 'clm_501',
    athleteId: 'usr_001',
    athleteName: 'Rohit Sharma',
    college: 'IIT Delhi',
    sport: 'Track & Field',
    event: '100m Men Senior Sprint',
    claimedValue: '10.58s',
    timingMethod: 'FAT',
    windAssist: '+1.4 m/s (Legal)',
    coachSignoffId: 'usr_003',
    coachName: 'Coach Vikram Singh',
    venue: 'Jawaharlal Nehru Stadium, Delhi',
    date: '2026-11-10',
    status: 'pending',
  },
  {
    id: 'clm_502',
    athleteId: 'usr_004',
    athleteName: 'Priya Nair',
    college: 'Anna University',
    sport: 'Track & Field',
    event: '400m Hurdles Women',
    claimedValue: '57.82s',
    timingMethod: 'FAT',
    windAssist: 'N/A',
    coachSignoffId: 'usr_003',
    coachName: 'Coach Vikram Singh',
    venue: 'Jawaharlal Nehru Stadium, Chennai',
    date: '2026-10-28',
    status: 'verified',
    verifiedAt: '2026-10-29T14:00:00Z',
  },
  {
    id: 'clm_503',
    athleteId: 'usr_789',
    athleteName: 'Aditya Roy',
    college: 'SRM Institute',
    sport: 'Swimming',
    event: '50m Freestyle Men',
    claimedValue: '22.10s',
    timingMethod: 'Hand-Timed',
    coachSignoffId: 'unverified_coach',
    coachName: 'Self-Claimed',
    venue: 'Local Gym Pool',
    date: '2026-11-20',
    status: 'disputed',
    disputeReason: 'National record level time claimed with stop-watch hand-timing without referee',
  },
];

let cachedReports: ReportComplaint[] = [
  {
    id: 'rep_601',
    category: 'fraudulent_organizer',
    priority: 'urgent',
    reporterName: 'Manish Kumar',
    reporterEmail: 'manish.k@iitd.ac.in',
    targetEntityId: 'usr_006',
    targetEntityName: 'Tarun Verma (Apex Tech)',
    description: 'Organizer posted unofficial Inter-University Cup and accepted ₹20,000 in personal UPI without college sports director permission.',
    evidenceUrls: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'],
    status: 'investigating',
    adminNotes: 'Contacted Apex Tech sports dean. Dean confirmed no authorization was granted.',
    createdAt: '2026-11-19T09:40:00Z',
  },
  {
    id: 'rep_602',
    category: 'misleading_record',
    priority: 'medium',
    reporterName: 'Coach Sunita D Souza',
    reporterEmail: 'sunita.dsouza@stxaviers.edu',
    targetEntityId: 'clm_503',
    targetEntityName: 'Aditya Roy 50m Free Record',
    description: 'Suspicious 22.10s hand-clocked time submitted to platform leaderboard without certified timekeepers.',
    status: 'open',
    createdAt: '2026-11-21T13:15:00Z',
  },
];

let cachedPayments: PaymentRecord[] = [
  {
    id: 'pay_701',
    gatewayId: 'pay_rzp_live_992182741',
    payerName: 'Rohit Sharma (IIT Delhi Team)',
    payerEmail: 'rohit.sharma@iitd.ac.in',
    eventId: 'evt_301',
    eventTitle: 'All-India Inter-University Athletics Championship 2026',
    amount: 1500,
    currency: 'INR',
    platformFee: 75,
    organizerPayout: 1425,
    status: 'captured',
    method: 'upi',
    createdAt: '2026-11-20T11:22:10Z',
  },
  {
    id: 'pay_702',
    gatewayId: 'pay_rzp_live_992182855',
    payerName: 'Karan Malhotra (SPIT Mumbai)',
    payerEmail: 'karan.malhotra@spit.ac.in',
    eventId: 'evt_303',
    eventTitle: 'Delhi State Inter-College Badminton Smashdown',
    amount: 800,
    currency: 'INR',
    platformFee: 40,
    organizerPayout: 760,
    status: 'captured',
    method: 'card',
    createdAt: '2026-11-21T14:45:00Z',
  },
  {
    id: 'pay_703',
    gatewayId: 'pay_rzp_live_992183102',
    payerName: 'Aakash Verma',
    payerEmail: 'aakash.v@gmail.com',
    eventId: 'evt_301',
    eventTitle: 'All-India Inter-University Athletics Championship 2026',
    amount: 1500,
    currency: 'INR',
    platformFee: 75,
    organizerPayout: 1425,
    status: 'refunded',
    method: 'upi',
    refundReason: 'Event schedule conflict reported before cutoff date',
    createdAt: '2026-11-18T16:00:00Z',
  },
];

let cachedNotifications: AdminNotification[] = [
  {
    id: 'notif_801',
    title: 'Winter 2026 National Inter-University Circuit Registration Open',
    body: 'Registrations are now live for the All-India Athletics and Badminton tournaments. All student athletes are invited to sign up through their verified institution IDs.',
    targetAudience: 'all',
    type: 'announcement',
    sentAt: '2026-11-20T10:00:00Z',
    sentBy: 'admin_master@sportsync.io',
    readCount: 1420,
  },
  {
    id: 'notif_802',
    title: 'New AFI Electronic FAT Timing Mandate for Records',
    body: 'Effective December 1st 2026, all track and field performance claims exceeding state standards must be validated with FAT electronic telemetry and certified coach signoff.',
    targetAudience: 'coaches',
    type: 'security',
    sentAt: '2026-11-22T14:30:00Z',
    sentBy: 'admin_master@sportsync.io',
    readCount: 84,
  },
];

let cachedAuditLogs: AuditLog[] = [
  {
    id: 'log_901',
    adminUid: 'admin_root_1',
    adminEmail: 'admin@sportsync.io',
    action: 'COACH_APPROVAL',
    targetType: 'Coach',
    targetId: 'usr_003',
    targetName: 'Coach Vikram Singh',
    timestamp: '2026-11-20T15:30:00Z',
    details: 'Verified AFI Level-2 certificate & Delhi University sports board affiliation',
    ipAddress: '103.21.244.18',
  },
  {
    id: 'log_902',
    adminUid: 'admin_root_1',
    adminEmail: 'admin@sportsync.io',
    action: 'EVENT_APPROVAL',
    targetType: 'Event',
    targetId: 'evt_301',
    targetName: 'All-India Inter-University Athletics Championship 2026',
    timestamp: '2026-11-21T09:12:00Z',
    details: 'Verified BITS Pilani venue contract and authorized tournament budget of ₹2.5L',
    ipAddress: '103.21.244.18',
  },
  {
    id: 'log_903',
    adminUid: 'admin_root_1',
    adminEmail: 'admin@sportsync.io',
    action: 'ACCOUNT_SUSPENSION',
    targetType: 'User',
    targetId: 'usr_006',
    targetName: 'Tarun Verma',
    timestamp: '2026-11-22T17:40:00Z',
    details: 'Suspended organizer role pending official college inquiry regarding unverified payment collections',
    ipAddress: '103.21.244.18',
  },
];

// Helper to log admin actions
export const logAdminAudit = async (
  action: AuditLog['action'],
  targetType: AuditLog['targetType'],
  targetId: string,
  targetName: string,
  details: string
): Promise<void> => {
  const newLog: AuditLog = {
    id: `log_${Date.now()}`,
    adminUid: 'admin_super_user',
    adminEmail: 'admin@sportsync.io',
    action,
    targetType,
    targetId,
    targetName,
    timestamp: new Date().toISOString(),
    details,
    ipAddress: '127.0.0.1 (Local Verified)',
  };

  cachedAuditLogs.unshift(newLog);

  if (isFirebaseConfigured() && db) {
    try {
      await addDoc(collection(db, 'adminLogs'), newLog);
    } catch {
      // Keep in local cache
    }
  }
};

// Helper to synchronize with shared cross-port database
export const syncWithSharedDb = async (): Promise<void> => {
  try {
    const res = await fetch('/api/sync/all');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.coachApplications)) {
        for (const app of data.coachApplications) {
          const existing = cachedCoachApps.find((c) => c.id === app.id);
          if (existing) {
            existing.status = app.status;
            existing.rejectionReason = app.rejectionReason;
          } else {
            cachedCoachApps.unshift(app);
          }
        }
      }
      if (Array.isArray(data.organizerApplications)) {
        for (const app of data.organizerApplications) {
          const existing = cachedOrgApps.find((o) => o.id === app.id);
          if (existing) {
            existing.status = app.status;
            existing.rejectionReason = app.rejectionReason;
          } else {
            cachedOrgApps.unshift(app);
          }
        }
      }
      if (Array.isArray(data.users)) {
        for (const user of data.users) {
          const existing = cachedUsers.find(
            (u) => u.uid === user.uid || (u.email && u.email.toLowerCase() === user.email?.toLowerCase())
          );
          if (existing) {
            existing.roles = user.roles || existing.roles;
            existing.status = user.status || existing.status;
          } else {
            cachedUsers.unshift(user);
          }
        }
      }
    }
  } catch {
    // Offline / fallback to in-memory cache
  }
};

// 1. STATS
export const getPlatformStats = async (): Promise<PlatformStats> => {
  await syncWithSharedDb();
  const totalUsers = cachedUsers.length;
  const totalAthletes = cachedUsers.filter((u) => u.roles.includes('student')).length;
  const totalCoaches = cachedUsers.filter((u) => u.roles.includes('coach')).length;
  const totalOrganizers = cachedUsers.filter((u) => u.roles.includes('organizer')).length;
  const pendingVerifications =
    cachedCoachApps.filter((c) => c.status === 'pending').length +
    cachedOrgApps.filter((o) => o.status === 'pending').length;
  const totalPublishedEvents = cachedEvents.filter((e) => e.status === 'published').length;
  const pendingEventApprovals = cachedEvents.filter((e) => e.status === 'pending').length;
  const totalRegistrations = cachedEvents.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
  const totalPaymentsCount = cachedPayments.length;
  const totalRevenue = cachedPayments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalHighlights = cachedModeration.length + 42; // includes active verified highlights
  const reportedContentCount = cachedModeration.filter((m) => m.status === 'pending').length;

  return {
    totalUsers,
    totalAthletes,
    totalCoaches,
    totalOrganizers,
    pendingVerifications,
    totalPublishedEvents,
    pendingEventApprovals,
    totalRegistrations,
    totalPaymentsCount,
    totalRevenue,
    totalHighlights,
    reportedContentCount,
  };
};

// 2. USER MANAGEMENT
export const getUsers = async (): Promise<AdminUser[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        const firestoreUsers = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          const roles: UserRole[] = [];
          if (Array.isArray(data.roles)) {
            data.roles.forEach((r: string) => {
              if (r === 'student' || r === 'coach' || r === 'organizer') roles.push(r as UserRole);
            });
          } else if (data.role) {
            roles.push(data.role as UserRole);
          }
          if (roles.length === 0) roles.push('student');

          return {
            uid: docSnap.id,
            email: data.email || 'user@example.com',
            fullName: data.fullName || data.name || 'Athletic User',
            college: data.college || data.institution || 'State University',
            roles,
            status: data.status || 'active',
            createdAt: data.createdAt || new Date().toISOString(),
            phone: data.phone || '',
            bio: data.bio || '',
            lastLogin: data.lastLogin || '',
          } as AdminUser;
        });

        // Merge firestore with seed users if needed
        const uids = new Set(firestoreUsers.map((u) => u.uid));
        const combined = [...firestoreUsers, ...cachedUsers.filter((u) => !uids.has(u.uid))];
        cachedUsers = combined;
        return cachedUsers;
      }
    } catch {
      // fallback to memory
    }
  }
  return cachedUsers;
};

export const updateUserStatus = async (
  uid: string,
  newStatus: AdminUser['status'],
  reason?: string
): Promise<boolean> => {
  const user = cachedUsers.find((u) => u.uid === uid);
  if (user) {
    user.status = newStatus;
    if (reason) user.verificationNotes = reason;
  }

  if (isFirebaseConfigured() && db) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { status: newStatus, verificationNotes: reason || '' });
    } catch {
      // offline fallback
    }
  }

  await logAdminAudit(
    newStatus === 'suspended' ? 'ACCOUNT_SUSPENSION' : 'ACCOUNT_REACTIVATION',
    'User',
    uid,
    user?.fullName || uid,
    `Status updated to ${newStatus}. ${reason || ''}`
  );

  return true;
};

export const updateUserRoles = async (
  uid: string,
  roles: UserRole[],
  reason?: string
): Promise<boolean> => {
  const user = cachedUsers.find((u) => u.uid === uid);
  if (user) {
    user.roles = roles;
  }

  if (isFirebaseConfigured() && db) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { roles });
    } catch {
      // offline fallback
    }
  }

  await logAdminAudit(
    'ROLE_CHANGE',
    'User',
    uid,
    user?.fullName || uid,
    `Assigned roles: [${roles.join(', ')}]. ${reason || ''}`
  );

  return true;
};

// 3. COACH VERIFICATION
export const getCoachApplications = async (): Promise<CoachApplication[]> => {
  await syncWithSharedDb();
  return cachedCoachApps;
};

export const approveCoachApplication = async (id: string, notes?: string): Promise<boolean> => {
  const app = cachedCoachApps.find((c) => c.id === id);
  if (app) {
    app.status = 'approved';
    app.reviewedAt = new Date().toISOString();

    // Automatically ensure the target user has 'coach' role
    const user = cachedUsers.find((u) => u.uid === app.uid || (u.email && u.email.toLowerCase() === app.email?.toLowerCase()));
    if (user && !user.roles.includes('coach')) {
      user.roles.push('coach');
      user.status = 'active';
    }

    try {
      await fetch('/api/sync/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'coach', notes }),
      });
    } catch {}

    await logAdminAudit(
      'COACH_APPROVAL',
      'Coach',
      app.uid,
      app.fullName,
      `Coach credentials approved (${app.licenseNo}). ${notes || ''}`
    );
  }
  return true;
};

export const rejectCoachApplication = async (id: string, reason: string): Promise<boolean> => {
  const app = cachedCoachApps.find((c) => c.id === id);
  if (app) {
    app.status = 'rejected';
    app.reviewedAt = new Date().toISOString();
    app.rejectionReason = reason;

    try {
      await fetch('/api/sync/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'coach', reason }),
      });
    } catch {}

    await logAdminAudit(
      'COACH_REJECTION',
      'Coach',
      app.uid,
      app.fullName,
      `Rejected reason: ${reason}`
    );
  }
  return true;
};

// 4. ORGANIZER VERIFICATION
export const getOrganizerApplications = async (): Promise<OrganizerApplication[]> => {
  await syncWithSharedDb();
  return cachedOrgApps;
};

export const approveOrganizerApplication = async (id: string, notes?: string): Promise<boolean> => {
  const app = cachedOrgApps.find((o) => o.id === id);
  if (app) {
    app.status = 'approved';
    app.reviewedAt = new Date().toISOString();

    // Ensure user has organizer role
    const user = cachedUsers.find((u) => u.uid === app.uid || (u.email && u.email.toLowerCase() === app.email?.toLowerCase()));
    if (user && !user.roles.includes('organizer')) {
      user.roles.push('organizer');
      user.status = 'active';
    }

    try {
      await fetch('/api/sync/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'organizer', notes }),
      });
    } catch {}

    await logAdminAudit(
      'ORGANIZER_APPROVAL',
      'Organizer',
      app.uid,
      app.fullName,
      `Organizer approved for ${app.collegeName} (${app.studentId}). ${notes || ''}`
    );
  }
  return true;
};

export const rejectOrganizerApplication = async (id: string, reason: string): Promise<boolean> => {
  const app = cachedOrgApps.find((o) => o.id === id);
  if (app) {
    app.status = 'rejected';
    app.reviewedAt = new Date().toISOString();
    app.rejectionReason = reason;

    try {
      await fetch('/api/sync/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type: 'organizer', reason }),
      });
    } catch {}

    await logAdminAudit(
      'ORGANIZER_REJECTION',
      'Organizer',
      app.uid,
      app.fullName,
      `Organizer application rejected: ${reason}`
    );
  }
  return true;
};

export const suspendOrganizerRole = async (id: string, reason: string): Promise<boolean> => {
  const app = cachedOrgApps.find((o) => o.id === id);
  if (app) {
    app.status = 'suspended';

    const user = cachedUsers.find((u) => u.uid === app.uid);
    if (user) {
      user.roles = user.roles.filter((r) => r !== 'organizer');
      if (user.roles.length === 0) user.roles = ['student'];
    }

    await logAdminAudit(
      'ACCOUNT_SUSPENSION',
      'Organizer',
      app.uid,
      app.fullName,
      `Organizer authorization revoked/suspended. Reason: ${reason}`
    );
  }
  return true;
};

// 5. EVENT APPROVALS
export const getEvents = async (): Promise<TournamentEvent[]> => {
  return cachedEvents;
};

export const updateEventStatus = async (
  eventId: string,
  newStatus: TournamentEvent['status'],
  reason?: string
): Promise<boolean> => {
  const ev = cachedEvents.find((e) => e.id === eventId);
  if (ev) {
    ev.status = newStatus;
    if (reason) ev.rejectionReason = reason;

    const actionMap: Record<string, AuditLog['action']> = {
      approved: 'EVENT_APPROVAL',
      published: 'EVENT_APPROVAL',
      rejected: 'EVENT_REJECTION',
      cancelled: 'EVENT_SUSPENSION',
    };

    await logAdminAudit(
      actionMap[newStatus] || 'SETTINGS_UPDATE',
      'Event',
      ev.id,
      ev.title,
      `Event status set to ${newStatus}. ${reason || ''}`
    );
  }
  return true;
};

// 6. CONTENT MODERATION
export const getModerationItems = async (): Promise<ModerationItem[]> => {
  return cachedModeration;
};

export const resolveModerationItem = async (
  id: string,
  decision: ModerationItem['status'],
  adminComment?: string
): Promise<boolean> => {
  const item = cachedModeration.find((m) => m.id === id);
  if (item) {
    item.status = decision;

    await logAdminAudit(
      'CONTENT_TAKEDOWN',
      'Media',
      item.id,
      item.authorName,
      `Moderation action: ${decision}. ${adminComment || ''}`
    );
  }
  return true;
};

// 7. PERFORMANCE CLAIMS
export const getPerformanceClaims = async (): Promise<PerformanceClaim[]> => {
  return cachedClaims;
};

export const verifyPerformanceClaim = async (id: string, notes?: string): Promise<boolean> => {
  const claim = cachedClaims.find((c) => c.id === id);
  if (claim) {
    claim.status = 'verified';
    claim.verifiedAt = new Date().toISOString();

    await logAdminAudit(
      'PERFORMANCE_VERIFICATION',
      'Record',
      claim.id,
      `${claim.athleteName} - ${claim.event}`,
      `Verified performance ${claim.claimedValue} (${claim.timingMethod}). ${notes || ''}`
    );
  }
  return true;
};

export const disputePerformanceClaim = async (id: string, disputeReason: string): Promise<boolean> => {
  const claim = cachedClaims.find((c) => c.id === id);
  if (claim) {
    claim.status = 'disputed';
    claim.disputeReason = disputeReason;

    await logAdminAudit(
      'PERFORMANCE_VERIFICATION',
      'Record',
      claim.id,
      `${claim.athleteName} - ${claim.event}`,
      `Flagged performance dispute: ${disputeReason}`
    );
  }
  return true;
};

// 8. REPORTS & COMPLAINTS
export const getReports = async (): Promise<ReportComplaint[]> => {
  return cachedReports;
};

export const updateReportStatus = async (
  id: string,
  newStatus: ReportComplaint['status'],
  notes?: string
): Promise<boolean> => {
  const rep = cachedReports.find((r) => r.id === id);
  if (rep) {
    rep.status = newStatus;
    if (notes) rep.adminNotes = notes;
  }
  return true;
};

// 9. PAYMENT MANAGEMENT
export const getPayments = async (): Promise<PaymentRecord[]> => {
  return cachedPayments;
};

export const processPaymentRefund = async (paymentId: string, reason: string): Promise<boolean> => {
  const pay = cachedPayments.find((p) => p.id === paymentId);
  if (pay) {
    pay.status = 'refunded';
    pay.refundReason = reason;

    await logAdminAudit(
      'REFUND_PROCESSED',
      'Payment',
      pay.id,
      pay.payerName,
      `Refund of ₹${pay.amount} processed for ${pay.eventTitle}. Reason: ${reason}`
    );
  }
  return true;
};

// 10. NOTIFICATIONS
export const getNotifications = async (): Promise<AdminNotification[]> => {
  return cachedNotifications;
};

export const broadcastNotification = async (
  notif: Omit<AdminNotification, 'id' | 'sentAt' | 'readCount'>
): Promise<AdminNotification> => {
  const newNotif: AdminNotification = {
    ...notif,
    id: `notif_${Date.now()}`,
    sentAt: new Date().toISOString(),
    readCount: 0,
  };

  cachedNotifications.unshift(newNotif);

  if (isFirebaseConfigured() && db) {
    try {
      await addDoc(collection(db, 'adminNotifications'), newNotif);
    } catch {
      // offline fallback
    }
  }

  await logAdminAudit(
    'BROADCAST_NOTIFICATION',
    'System',
    newNotif.id,
    newNotif.title,
    `Broadcast to target: [${newNotif.targetAudience}] - Type: ${newNotif.type}`
  );

  return newNotif;
};

// 11. AUDIT LOGS
export const getAuditLogs = async (): Promise<AuditLog[]> => {
  return cachedAuditLogs;
};
