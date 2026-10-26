import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  CheckCircle2,
  Share2,
  Video,
  Play,
  Plus,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Building2,
  GraduationCap,
  Award,
  BadgeCheck,
  Edit3,
  Camera,
  Eye,
  TrendingUp,
  Sparkles,
  Bookmark,
  ExternalLink,
  X,
  FileText,
  UserCheck,
  Tag,
  Clock,
  MoreHorizontal,
  Briefcase,
  Users,
} from 'lucide-react';
import { ATHLETES_DATA, HIGHLIGHT_REELS } from '../../data/mockData';
import { HighlightReel, SportCategory, TabView } from '../../types/sports';
import { getLoggedInCoach } from '../../utils/userSession';

interface ProfileViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  onOpenVideo: (reel: HighlightReel) => void;
  onNavigate?: (tab: TabView, targetId?: string) => void;
}

interface CoachPost {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  timestamp: string;
  text: string;
  sport: SportCategory;
  athleteTag?: {
    name: string;
    team: string;
    position: string;
  };
  metricsTag?: string;
  mediaThumbnail?: string;
  videoDuration?: string;
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  repostsCount: number;
  commentsList: Array<{ author: string; role: string; text: string; time: string }>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onShowToast,
  onOpenVideo,
  onNavigate,
}) => {
  const coach = getLoggedInCoach();
  const coachInitials = coach.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'HC';

  // Post Composer Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [postSport, setPostSport] = useState<SportCategory>('football');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('leo-sterling');
  const [postMetric, setPostMetric] = useState('34.8 km/h top speed · 89th min winner');
  const [postVideoUrl, setPostVideoUrl] = useState('');
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [activeCommentDrawer, setActiveCommentDrawer] = useState<string | null>(null);

  // Initial Posts Feed (LinkedIn Activity)
  const [posts, setPosts] = useState<CoachPost[]>([
    {
      id: 'post-1',
      authorName: coach.name,
      authorHeadline: `${coach.title} • ${coach.academy}`,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      timestamp: '2h ago • 🌐',
      text: 'Proud to share state championship match film from yesterday! 17yo prospect Leo Sterling demonstrated world-class acceleration off shoulder marks and curled in this decisive 89th-minute winner. GPS telemetry recorded a 34.8 km/h peak velocity during the transition break. Available for 2026 collegiate & academy scouting evaluations.',
      sport: 'football',
      athleteTag: {
        name: 'Leo Sterling',
        position: 'Forward (#9)',
        team: 'U19 Elite Squad',
      },
      metricsTag: 'Top Speed: 34.8 km/h · Match Impact: 9.4/10',
      mediaThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLD_MY_Op4_eFxmIuGLcaFRh3Rw5WP44RmgLp7NJDpowEWKkiIt8ZGQ9jdq_yCxRaisSZoXoLUlF_pv-8hZEgk3coYOBERKWp1Qb32m_rb8OCqCkAYMIrszE-dfUcPQ6XtKqcP2l0Fulcb5K3DG1aaqwnwGjlFscl5LGpmZxtG42bqtVIrgYy4PDVQVRY7tz2VoN6CotFwUN4UtQH8AOfKnP68KBClj-ezvIvsxl6HWYL13VuYGZpgNg',
      videoDuration: '4:18',
      likesCount: 48,
      isLiked: false,
      commentsCount: 9,
      repostsCount: 14,
      commentsList: [
        {
          author: 'Sarah Jenkins',
          role: 'Lead Talent Scout • NCAA Div I',
          text: 'Sensational spatial awareness. Would love to review his full match telemetry sheet ahead of regional combines.',
          time: '1h ago',
        },
        {
          author: "Coach David O'Connor",
          role: 'Track & Field Director',
          text: 'That deceleration into the cut is textbook biomechanics. Great coaching!',
          time: '30m ago',
        },
      ],
    },
    {
      id: 'post-2',
      authorName: coach.name,
      authorHeadline: `${coach.title} • ${coach.academy}`,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      timestamp: '1d ago • 🌐',
      text: 'New Academy Record! 18yo sprinter Priya Sharma shattered our internal electronic split benchmark with a blazing 11.24s 100m. Notice how her ground contact time remains under 0.088s through the 60-meter transition gate. National Federation qualifiers next month!',
      sport: 'athletics',
      athleteTag: {
        name: 'Priya Sharma',
        position: '100m Sprinter (#2)',
        team: 'National Track Club',
      },
      metricsTag: 'Electronic Split: 11.24s · Reaction Time: 0.138s',
      mediaThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHJkNXPiREGJWyW03oAX4Z-03ZtVmYQ0PpN1scORDPYx5DcC7AkI_uvtbwuvqbJ1wnWWG_QsKxO8oef5JCfPhuC2o2durTvwN5AKa7umE8HdWTIhlvkNR7qjOND2B33vxiDL7RH-gs4JMoZ7yK10HNqYdKX582WK6iHcxSEljnah0zY8Ltl7GRwRA_AwjLu7-kCJTBFLjEprGmAoc4eaptzkBkDwHSrbLhpRXgH9jMo5lhe16ku9VZvQ',
      videoDuration: '0:58',
      likesCount: 82,
      isLiked: true,
      commentsCount: 15,
      repostsCount: 21,
      commentsList: [
        {
          author: 'Marcus Thorne',
          role: 'Senior Scout • Elite Scouting Network',
          text: 'Collegiate coaches are definitely taking note. Bookmarked her profile for the Olympic Path trials.',
          time: '18h ago',
        },
      ],
    },
  ]);

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [
              ...p.commentsList,
              {
                author: coach.name,
                role: `${coach.title || 'Coach'} (You)`,
                text,
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );

    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    onShowToast('Comment Added', 'Your reply has been posted to the activity thread', 'success');
  };

  const handleCreatePost = () => {
    if (!postCaption.trim()) {
      onShowToast('Please enter post text', 'Share a brief breakdown or highlight note', 'warning');
      return;
    }

    const taggedAthlete = ATHLETES_DATA.find((a) => a.id === selectedAthleteId);

    const newPost: CoachPost = {
      id: `post-${Date.now()}`,
      authorName: coach.name,
      authorHeadline: `${coach.title} • ${coach.academy}`,
      authorAvatar: coach.avatar && coach.avatar.startsWith('http')
        ? coach.avatar
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      timestamp: 'Just now • 🌐',
      text: postCaption,
      sport: postSport,
      athleteTag: taggedAthlete
        ? {
            name: taggedAthlete.name,
            position: taggedAthlete.position,
            team: taggedAthlete.team,
          }
        : undefined,
      metricsTag: postMetric,
      mediaThumbnail:
        postVideoUrl ||
        (postSport === 'football'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLD_MY_Op4_eFxmIuGLcaFRh3Rw5WP44RmgLp7NJDpowEWKkiIt8ZGQ9jdq_yCxRaisSZoXoLUlF_pv-8hZEgk3coYOBERKWp1Qb32m_rb8OCqCkAYMIrszE-dfUcPQ6XtKqcP2l0Fulcb5K3DG1aaqwnwGjlFscl5LGpmZxtG42bqtVIrgYy4PDVQVRY7tz2VoN6CotFwUN4UtQH8AOfKnP68KBClj-ezvIvsxl6HWYL13VuYGZpgNg'
          : postSport === 'basketball'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT1yNHm1MAEyoLKQKbyv5gR-xVIr6JcSMJvCybn65ipOqikd7FvUpqGQ8c6KTZSBW92C-u2AUG25fHgciQg8kmoJeL-jAnTpBYPdopjcqmYWWQ4x5DJuJvq2yUsfVd-lG6zHzjbDwJiAw0zWYWeqFTA4a50NZw6NeOWNcBmj5lTDn5bRtp59sUV7ifp7vvNcNReusXylH_y1Cm7xydcC4Gpjd7EUOwPQ0UL3wFXlSomoIh-E92GyWfwQ'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHJkNXPiREGJWyW03oAX4Z-03ZtVmYQ0PpN1scORDPYx5DcC7AkI_uvtbwuvqbJ1wnWWG_QsKxO8oef5JCfPhuC2o2durTvwN5AKa7umE8HdWTIhlvkNR7qjOND2B33vxiDL7RH-gs4JMoZ7yK10HNqYdKX582WK6iHcxSEljnah0zY8Ltl7GRwRA_AwjLu7-kCJTBFLjEprGmAoc4eaptzkBkDwHSrbLhpRXgH9jMo5lhe16ku9VZvQ'),
      videoDuration: '3:20',
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      repostsCount: 0,
      commentsList: [],
    };

    setPosts([newPost, ...posts]);
    setIsPostModalOpen(false);
    setPostCaption('');
    onShowToast('Highlight Shared!', 'Your highlight post is now published to your profile feed', 'success');
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('Profile Link Copied', 'LinkedIn-style coach profile link copied to clipboard', 'success');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto px-4 sm:px-6 space-y-4 font-['Inter']">
      {/* 1. LinkedIn Top Profile Card */}
      <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden relative">
        {/* Cover Banner */}
        <div className="relative h-36 sm:h-52 bg-gradient-to-r from-[#0037B0] via-[#1E40AF] to-[#047857] overflow-hidden">
          {/* Subtle Grid / Pitch pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/30" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onShowToast('Cover Updated', 'Profile banner customized', 'info')}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              title="Edit cover photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 relative">
          {/* Overlapping Avatar */}
          <div className="flex justify-between items-end -mt-16 sm:-mt-24 mb-3">
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#0037B0] to-blue-500 border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] overflow-hidden">
                {coach.avatar && coach.avatar.startsWith('http') ? (
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl">{coach.avatar || coachInitials}</span>
                )}
              </div>
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white" title="Active on SportSphere" />
            </div>

            {/* Quick Edit button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareProfile}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                title="Share profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onShowToast('Profile Settings', 'Coach credential verification is active', 'info')}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                title="Edit profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name, Headline & Affiliation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
                  {coach.name}
                </h1>
                <span className="text-blue-600" title="Verified Head Performance Director">
                  <BadgeCheck className="w-5 h-5 fill-blue-600 text-white" />
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  Coach
                </span>
              </div>

              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug font-['Plus_Jakarta_Sans']">
                {coach.title} at {coach.academy}
              </p>

              <p className="text-xs text-slate-500">
                {coach.sport} • {coach.bio}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {coach.city || 'Regional Sports Complex'}
                </span>
                <span>•</span>
                <button
                  onClick={handleShareProfile}
                  className="font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  Contact info
                </button>
                <span>•</span>
                <span className="font-bold text-blue-700">1,420 connections</span>
              </div>
            </div>

            {/* Right Side Experience Logos (LinkedIn style) */}
            <div className="md:col-span-4 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800 leading-tight">
                  {coach.academy}
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800 leading-tight">
                  Elite Coaching & Sports Science Federation
                </span>
              </div>
            </div>
          </div>

          {/* LinkedIn Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-5">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Post Highlights</span>
            </button>

            <button
              onClick={() => onShowToast('Scouting Availability', 'Status set to: Open for Talent Scouting & Clinic Consultations', 'success')}
              className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold font-['Plus_Jakarta_Sans'] transition-colors cursor-pointer"
            >
              Open to Scouting ▾
            </button>

            <button
              onClick={handleShareProfile}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-['Plus_Jakarta_Sans'] transition-colors cursor-pointer"
            >
              Share Profile
            </button>

            <button
              onClick={() => onShowToast('Exported', 'Coach CV downloaded as PDF', 'success')}
              className="px-3.5 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              More
            </button>
          </div>

          {/* Open to Work / Open to Scouting Banner Card */}
          <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-emerald-50/80 border border-blue-200/60 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Open to Talent Scouting Assignments & Tactical Direction
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  Active
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Consulting for academy talent ID, kinematic sprint biomechanics, and tournament match preparation.
              </p>
            </div>
            <button
              onClick={() => onShowToast('Scouting Preferences', 'Updated coach availability tags', 'info')}
              className="p-1 rounded text-slate-400 hover:text-slate-700"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Analytics & Private Metrics Strip (LinkedIn style) */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Analytics & Performance Reach
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Private to you</span>
          </div>
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1 cursor-pointer">
            View all analytics <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <Eye className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
                2,840
              </p>
              <p className="text-xs text-slate-600 mt-1 font-medium">Profile views</p>
              <span className="text-[10px] text-emerald-600 font-bold">+18.4% past 30 days</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
                912
              </p>
              <p className="text-xs text-slate-600 mt-1 font-medium">Search appearances</p>
              <span className="text-[10px] text-slate-500">Ranked for "High Performance Coach"</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <Video className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
                14.2k
              </p>
              <p className="text-xs text-slate-600 mt-1 font-medium">Highlight reel views</p>
              <span className="text-[10px] text-emerald-600 font-bold">42 Scout bookmarks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Post a Highlight Composer Box (LinkedIn "Start a post" style) */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden">
            {coach.avatar && coach.avatar.startsWith('http') ? (
              <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-bold">{coachInitials}</span>
            )}
          </div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-500 transition-colors cursor-pointer"
          >
            Post an athlete highlight, match film, or tactical report...
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-blue-600 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Video Highlight</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-emerald-600 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Milestone / Metric</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-amber-600 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Scout Film Note</span>
          </button>
        </div>
      </section>

      {/* 4. Activity & Posts Feed (LinkedIn Post Feed) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Activity & Highlight Posts ({posts.length})
            </h2>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden space-y-3 p-4 sm:p-5"
            >
              {/* Post Author Bar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                        {post.authorName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">• 1st</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{post.authorHeadline}</p>
                    <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                  </div>
                </div>

                <button className="text-slate-400 hover:text-slate-600 p-1 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Post Body Text */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-['Inter']">
                {post.text}
              </p>

              {/* Tagged Athlete Pill */}
              {post.athleteTag && (
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {post.athleteTag.name.slice(0, 1)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{post.athleteTag.name}</span>
                      <span className="text-slate-500 text-[11px]"> · {post.athleteTag.position} ({post.athleteTag.team})</span>
                    </div>
                  </div>
                  {post.metricsTag && (
                    <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {post.metricsTag}
                    </span>
                  )}
                </div>
              )}

              {/* Embedded Video/Media Player Card */}
              {post.mediaThumbnail && (
                <div
                  onClick={() => {
                    const matchedReel = HIGHLIGHT_REELS[0];
                    onOpenVideo(matchedReel);
                  }}
                  className="relative rounded-xl overflow-hidden bg-slate-900 h-52 sm:h-72 cursor-pointer group shadow-sm"
                >
                  <img
                    src={post.mediaThumbnail}
                    alt="Highlight media"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-blue-600 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-blue-600 translate-x-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md">
                      🎥 Match Film Reel ({post.videoDuration || '3:20'})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                      4K Telemetry
                    </span>
                  </div>
                </div>
              )}

              {/* Post Engagement Counts */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                    👍
                  </div>
                  <span className="font-medium tabular-nums">{post.likesCount}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>{post.commentsCount} comments</span>
                  <span>•</span>
                  <span>{post.repostsCount} reposts</span>
                </div>
              </div>

              {/* Post Action Buttons (LinkedIn Like, Comment, Repost, Send) */}
              <div className="flex items-center justify-around text-xs font-bold pt-1">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    post.isLiked
                      ? 'text-blue-600 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-blue-600' : ''}`} />
                  <span>Like</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCommentDrawer(activeCommentDrawer === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Comment</span>
                </button>

                <button
                  onClick={() => onShowToast('Reposted', 'Shared to your coaching network feed', 'success')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Repeat2 className="w-4 h-4" />
                  <span>Repost</span>
                </button>

                <button
                  onClick={() => handleShareProfile()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Coach Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={commentInput[post.id] || ''}
                    onChange={(e) =>
                      setCommentInput({ ...commentInput, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    placeholder="Add a scout note or tactical comment..."
                    className="flex-1 h-9 px-3.5 rounded-full bg-slate-100 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Post
                  </button>
                </div>

                {/* Comments List */}
                {post.commentsList.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {post.commentsList.map((cmt, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{cmt.author}</span>
                          <span className="text-[10px] text-slate-400">{cmt.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{cmt.role}</p>
                        <p className="text-slate-700 leading-snug">{cmt.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. LinkedIn About Section */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-3">
        <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
          About & Coaching Philosophy
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {coach.bio || `${coach.title} at ${coach.academy}. Experienced performance coach dedicated to elite athlete development.`}
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Coaching in <strong>{coach.sport}</strong> with expertise in performance analysis, player development, and sports intelligence platforms.
        </p>
      </section>

      {/* 6. LinkedIn Experience Section */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
          Experience
        </h3>

        <div className="space-y-4 divide-y divide-slate-100">
          <div className="flex items-start gap-3 pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-1 text-xs">
              <h4 className="font-bold text-sm text-slate-900">{coach.title}</h4>
              <p className="text-slate-600 font-medium">{coach.academy} · Full-time</p>
              <p className="text-slate-400 text-[11px]">Current · {coach.city || 'Regional Hub'}</p>
              <p className="text-slate-600 pt-1 leading-snug">
                Leading athlete performance, telemetry tracking, and squad development in {coach.sport}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-1 text-xs">
              <h4 className="font-bold text-sm text-slate-900">Lead Tactical Analyst & Combine Coach</h4>
              <p className="text-slate-600 font-medium">State Youth Development Program</p>
              <p className="text-slate-400 text-[11px]">2017 – 2021 · 4 yrs · Austin, TX</p>
              <p className="text-slate-600 pt-1 leading-snug">
                Conducted standardized radar timing, Vo2 max evaluation, and college showcase matches for 250+ prospects annually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Licenses & Certifications */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
          Licenses & Certifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">UEFA Advanced Coaching Diploma</span>
            <span className="text-slate-500 text-[11px] block">UEFA Technical Directorate · Issued 2023</span>
            <span className="text-emerald-700 font-semibold text-[10px]">Credential ID: UEFA-ADV-9821</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">USSF National 'A' Coaching License</span>
            <span className="text-slate-500 text-[11px] block">U.S. Soccer Federation · Issued 2020</span>
            <span className="text-emerald-700 font-semibold text-[10px]">Active Federation Member</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Certified Strength & Conditioning Specialist (CSCS)</span>
            <span className="text-slate-500 text-[11px] block">NSCA · Issued 2018</span>
            <span className="text-emerald-700 font-semibold text-[10px]">Biomechanical Periodization</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">FIFA Youth Talent Identification Credential</span>
            <span className="text-slate-500 text-[11px] block">FIFA Technical Study Group · Issued 2022</span>
            <span className="text-emerald-700 font-semibold text-[10px]">Grassroots Combine Certified</span>
          </div>
        </div>
      </section>

      {/* 8. Skills & Endorsements */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-3">
        <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
          Skills & Endorsements
        </h3>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { name: 'Tactical Periodization', count: 48 },
            { name: 'Athlete Biometrics & Telemetry', count: 42 },
            { name: 'Talent Identification & Scouting', count: 39 },
            { name: 'High Performance Conditioning', count: 34 },
            { name: 'Match Film Kinematics', count: 28 },
            { name: 'Collegiate Scholarship Liaison', count: 25 },
          ].map((skill) => (
            <div
              key={skill.name}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center gap-2 font-semibold text-slate-800"
            >
              <span>{skill.name}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold tabular-nums">
                {skill.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Post Highlight Creation Modal */}
      <AnimatePresence>
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
              onClick={() => setIsPostModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      Post Athlete Highlight Reel
                    </h3>
                    <p className="text-xs text-slate-500">Share match clips & telemetry to your profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPostModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Coach Badge Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 overflow-hidden">
                  {coach.avatar && coach.avatar.startsWith('http') ? (
                    <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{coachInitials}</span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block font-['Plus_Jakarta_Sans']">
                    {coach.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    🌐 Post to Anyone (Public Profile)
                  </span>
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">What would you like to share?</label>
                <textarea
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Share a standout play, biometric breakdown, or tactical accomplishment (e.g., 'Leo Sterling curling finish in the 89th minute, clocked 34.8 km/h peak speed...')"
                  rows={4}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all font-['Inter']"
                />
              </div>

              {/* Select Athlete & Sport */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tag Athlete</label>
                  <select
                    value={selectedAthleteId}
                    onChange={(e) => setSelectedAthleteId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    {ATHLETES_DATA.map((ath) => (
                      <option key={ath.id} value={ath.id}>
                        {ath.name} ({ath.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sport Discipline</label>
                  <select
                    value={postSport}
                    onChange={(e) => setPostSport(e.target.value as SportCategory)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="football">Football</option>
                    <option value="athletics">Athletics / Track</option>
                    <option value="basketball">Basketball</option>
                    <option value="cricket">Cricket</option>
                  </select>
                </div>
              </div>

              {/* Highlight Metric / Telemetry Tag */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Key Highlight Metric / Telemetry</label>
                <input
                  type="text"
                  value={postMetric}
                  onChange={(e) => setPostMetric(e.target.value)}
                  placeholder="e.g. 34.8 km/h top speed · 11.24s split · 28.4% conversion"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Media URL / Preset Selector */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">Media Thumbnail / Video Film URL (Optional)</label>
                <input
                  type="text"
                  value={postVideoUrl}
                  onChange={(e) => setPostVideoUrl(e.target.value)}
                  placeholder="Leave empty to use high-definition match film preset"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsPostModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreatePost}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Highlight</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
