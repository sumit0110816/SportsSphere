import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Calendar,
  MapPin,
  Users,
  Share2,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TOURNAMENTS_DATA, ATHLETES_DATA } from '../../data/mockData';
import { SportCategory, Tournament } from '../../types/sports';
import { getLoggedInCoach } from '../../utils/userSession';

interface TournamentsViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  initialTournamentId?: string;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  onShowToast,
  initialTournamentId,
}) => {
  const coach = getLoggedInCoach();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportCategory>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPrepDrawerOpen, setIsPrepDrawerOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAssignRosterModalOpen, setIsAssignRosterModalOpen] = useState(false);

  // Roster assignment selection
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>(['leo-sterling', 'marcus-rivera']);

  // Filters state in modal
  const [filterAge, setFilterAge] = useState<string>('U19');
  const [filterFormat, setFilterFormat] = useState<string>('all'); // all, free, paid
  const [nearbyFilter, setNearbyFilter] = useState<'all' | 'nearby' | '15' | '30' | '50'>('all');
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [coachLocation, setCoachLocation] = useState<string>('Dallas-Fort Worth Base (TX)');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [venuePreviewModal, setVenuePreviewModal] = useState<Tournament | null>(null);

  const [tournaments, setTournaments] = useState<Tournament[]>(TOURNAMENTS_DATA);

  const sportsList: { key: SportCategory; label: string; count?: number }[] = [
    { key: 'all', label: 'All Sports', count: 28 },
    { key: 'football', label: 'Football' },
    { key: 'cricket', label: 'Cricket' },
    { key: 'athletics', label: 'Athletics' },
    { key: 'basketball', label: 'Basketball' },
    { key: 'badminton', label: 'Badminton' },
    { key: 'volleyball', label: 'Volleyball' },
    { key: 'tennis', label: 'Tennis' },
    { key: 'swimming', label: 'Swimming' },
  ];

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setIsDetectingLocation(false);
      setCoachLocation('Dallas Metroplex High Performance Hub (GPS Detected)');
      setNearbyFilter('nearby');
      onShowToast('GPS Location Detected', 'Sorted by proximity to Dallas Training Center (< 25 mi)', 'success');
    }, 600);
  };

  const filteredTournaments = useMemo(() => {
    let list = tournaments.filter((t) => {
      if (selectedSport !== 'all' && t.sport !== selectedSport) return false;
      if (selectedLevel !== 'all' && !t.level.toLowerCase().includes(selectedLevel.toLowerCase())) return false;
      if (filterFormat === 'free' && !t.fee.includes('$0') && !t.fee.toLowerCase().includes('free')) return false;
      if (filterFormat === 'paid' && (t.fee.includes('$0') || t.fee.toLowerCase().includes('free'))) return false;

      // Nearby Distance filtering
      if (nearbyFilter === 'nearby' && t.distanceMiles !== undefined && t.distanceMiles > 25) return false;
      if (nearbyFilter === '15' && t.distanceMiles !== undefined && t.distanceMiles > 15) return false;
      if (nearbyFilter === '30' && t.distanceMiles !== undefined && t.distanceMiles > 30) return false;
      if (nearbyFilter === '50' && t.distanceMiles !== undefined && t.distanceMiles > 50) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.venue.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          (t.city && t.city.toLowerCase().includes(q)) ||
          t.sport.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortByDistance || nearbyFilter !== 'all') {
      list = [...list].sort((a, b) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999));
    }

    return list;
  }, [tournaments, selectedSport, selectedLevel, filterFormat, nearbyFilter, sortByDistance, searchQuery]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t))
    );
    const target = tournaments.find((t) => t.id === id);
    if (target?.isBookmarked) {
      onShowToast('Removed from Prep List', 'Tournament unbookmarked', 'info');
    } else {
      onShowToast('Added to Prep List', 'Tournament saved for squad scouting', 'success');
    }
  };

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    onShowToast('Tournament Link Copied', `Share link for "${title}" copied to clipboard`, 'success');
  };

  const handleRegisterConfirm = () => {
    if (!selectedTournament) return;
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === selectedTournament.id
          ? { ...t, registeredSlots: Math.min(t.maxSlots, t.registeredSlots + 1) }
          : t
      )
    );
    setIsRegisterModalOpen(false);
    onShowToast('Registration Submitted', `Application sent to ${selectedTournament.title} organizers`, 'success');
  };

  const bookmarkedCount = tournaments.filter((t) => t.isBookmarked).length;

  return (
    <div className="flex flex-col w-full pb-28 max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Search & Tactical Control Bar */}
      <section className="pt-2 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments, venues, federations..."
              className="w-full h-11 pl-9 pr-8 rounded-xl bg-white text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 border border-slate-200/80 shadow-xs focus:outline-none focus:border-blue-600 transition-all font-['Inter']"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Modal Trigger */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="h-11 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer text-xs font-semibold font-['Plus_Jakarta_Sans']"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden xs:inline">Filters</span>
            <span className="w-4 h-4 rounded-full bg-white text-blue-700 text-[10px] font-extrabold flex items-center justify-center tabular-nums">
              3
            </span>
          </button>

          {/* Reset Filters Button */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSport('all');
              setSelectedLevel('all');
              setFilterFormat('all');
              onShowToast('Filters Reset', 'Displaying all available tournaments', 'info');
            }}
            className="h-11 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium active:scale-95 transition-colors shrink-0"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>

        {/* Active Filter Summary Metric Row */}
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Showing {filteredTournaments.length} tournaments {nearbyFilter !== 'all' ? `(Within ${nearbyFilter === 'nearby' ? '25' : nearbyFilter} miles)` : ''}
            </span>
          </div>
          <button
            onClick={() => setSortByDistance(!sortByDistance)}
            className={`font-bold text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              sortByDistance ? 'bg-blue-100 text-blue-700 font-extrabold' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{sortByDistance ? 'Sorted by Proximity' : 'Sort by Distance'}</span>
          </button>
        </div>

        {/* Coach GPS & Proximity Bar */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-emerald-50/60 border border-blue-200/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Coach Location Base
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-xs text-slate-700 font-semibold truncate">
                {coachLocation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-blue-200/80 shadow-2xs flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isDetectingLocation ? 'Detecting...' : 'Detect GPS Base'}</span>
            </button>

            {/* Quick Radius Toggles */}
            <div className="flex items-center bg-white/80 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setNearbyFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  nearbyFilter === 'all' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setNearbyFilter('nearby');
                  onShowToast('Nearby Filter', 'Showing tournaments within 25 miles of base', 'info');
                }}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                  nearbyFilter === 'nearby' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📍 Nearby (&lt; 25 mi)</span>
              </button>
              <button
                onClick={() => setNearbyFilter('15')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  nearbyFilter === '15' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                &lt; 15 mi
              </button>
              <button
                onClick={() => setNearbyFilter('50')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  nearbyFilter === '50' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                &lt; 50 mi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Sport Category Strip */}
      <section className="py-1">
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center py-1">
          {sportsList.map((sport) => {
            const isActive = selectedSport === sport.key;
            return (
              <button
                key={sport.key}
                onClick={() => setSelectedSport(sport.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span>{sport.label}</span>
                {sport.count && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sport.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary Quick-Filters */}
      <section className="py-1">
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center text-xs">
          <button
            onClick={() => setSelectedLevel(selectedLevel === 'all' ? 'State' : 'all')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
              selectedLevel === 'State'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Level: {selectedLevel === 'all' ? "All (State, Nat'l)" : 'State Level'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onShowToast('Filter Applied', 'Showing events in the next 30 days', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold shrink-0 border border-blue-100"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Next 30 Days</span>
          </button>

          <button
            onClick={() => setFilterFormat(filterFormat === 'free' ? 'all' : 'free')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
              filterFormat === 'free'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-teal-50 text-teal-800 border border-teal-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>Open / Free Entry</span>
          </button>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 font-semibold shrink-0 hover:bg-slate-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>
      </section>

      {/* Tournament Feed & Rich Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {filteredTournaments.map((tourney) => {
          const filledPercent = Math.round((tourney.registeredSlots / tourney.maxSlots) * 100);

          return (
            <article
              key={tourney.id}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 transition-all hover:shadow-md hover:border-slate-300"
            >
              {/* Media Header */}
              <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                <img
                  src={tourney.image}
                  alt={tourney.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Top Badges Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {tourney.sport} · {tourney.level}
                  </span>
                  <button
                    onClick={(e) => toggleBookmark(tourney.id, e)}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    aria-label="Bookmark Tournament"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${tourney.isBookmarked ? 'fill-blue-400 text-blue-400' : ''}`}
                    />
                  </button>
                </div>

                {/* Bottom Scrim Info */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between text-white">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] font-medium opacity-90 truncate max-w-[200px]">
                      {tourney.venue}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase font-['Plus_Jakarta_Sans']">
                    {tourney.tag}
                  </span>
                </div>
              </div>

              {/* Card Core Information */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tourney.urgency}
                    </span>

                    {tourney.distanceMiles !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs ${
                        tourney.distanceMiles <= 15
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : tourney.distanceMiles <= 30
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{tourney.distanceMiles} mi away · {tourney.driveTime || 'Nearby'}</span>
                      </span>
                    )}

                    <span className="text-slate-400 text-[11px]">· {tourney.scoutPresence}</span>
                  </div>

                  <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
                    {tourney.title}
                  </h2>

                  {/* Location & Calendar Grid */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-start gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Dates</span>
                        <span className="font-semibold text-slate-800 truncate">{tourney.dates}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {tourney.city || 'Venue'}
                        </span>
                        <span className="font-semibold text-slate-800 truncate" title={`${tourney.location} (${tourney.venue})`}>
                          {tourney.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Criteria Note if present */}
                  {tourney.criteria && (
                    <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/60 text-xs text-slate-600 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong className="text-slate-900 font-semibold">Criteria: </strong>
                        {tourney.criteria}
                      </p>
                    </div>
                  )}

                  {/* Meta & Quota Capacity */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{tourney.eligibility}</span>
                      </div>
                      <span className="font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                        {tourney.fee}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Registration Status</span>
                        <span className="font-bold text-blue-700 font-mono tabular-nums">
                          {tourney.registeredSlots} / {tourney.maxSlots} Slots Filled ({filledPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${filledPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coach Action Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setVenuePreviewModal(tourney)}
                    className="h-10 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-emerald-200/80 active:scale-95"
                    title="Directions & Venue Map"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Directions</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(tourney.title, e)}
                    className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shrink-0"
                    title="Share Tournament"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTournament(tourney);
                      setIsAssignRosterModalOpen(true);
                    }}
                    className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors flex-1"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Assign Roster</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTournament(tourney);
                      setIsRegisterModalOpen(true);
                    }}
                    className="h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all flex-1"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Interactive Coach Scouting Prep Bottom Drawer Floating Banner */}
      <aside className="fixed bottom-20 left-4 right-4 z-30 max-w-md mx-auto">
        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate font-['Plus_Jakarta_Sans']">
                  My Prep List
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold tabular-nums">
                  {bookmarkedCount} Saved
                </span>
              </div>
              <span className="text-[11px] text-slate-300 truncate">
                {selectedAthletes.length} Assigned Athletes Eligible
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsPrepDrawerOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-white text-blue-700 text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1 shrink-0 active:scale-95 transition-transform shadow-sm"
          >
            <span>Manage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Quick Filter Slide-up Backdrop Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsFilterModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto sm:hidden" />

            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Tournament Filters
                </h3>
                <span className="text-xs text-slate-500">
                  Tailor scouting opportunities for your roster
                </span>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Age Brackets */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Age Brackets</span>
              <div className="flex flex-wrap gap-2">
                {['U15', 'U17', 'U19', 'Senior College'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setFilterAge(age)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      filterAge === age
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Sanctioning Tier */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Sanctioning Body & Scope</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'District', 'State', 'National'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedLevel(tier)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedLevel === tier
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tier === 'all' ? 'All Tiers' : tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry Format */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Entry Format</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilterFormat('free')}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    filterFormat === 'free'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Free / Sponsored</span>
                  {filterFormat === 'free' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
                <button
                  onClick={() => setFilterFormat('paid')}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    filterFormat === 'paid'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Paid Entry</span>
                  {filterFormat === 'paid' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* Proximity & Distance Radius */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coach Proximity Radius (from {coachLocation})</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'all', label: 'All Distances' },
                  { key: '15', label: 'Within 15 Miles' },
                  { key: 'nearby', label: 'Within 25 Miles (Nearby)' },
                  { key: '50', label: 'Within 50 Miles' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setNearbyFilter(item.key as any)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      nearbyFilter === item.key
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {nearbyFilter === item.key && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3">
              <button
                onClick={() => {
                  setSelectedSport('all');
                  setSelectedLevel('all');
                  setFilterFormat('all');
                  setFilterAge('U19');
                  setIsFilterModalOpen(false);
                }}
                className="h-11 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex-1"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setIsFilterModalOpen(false);
                  onShowToast('Filters Applied', `Updated view (${filteredTournaments.length} events)`, 'success');
                }}
                className="h-11 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold flex-1 shadow-sm"
              >
                Apply ({filteredTournaments.length} Events)
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Roster Assignment Modal */}
      {isAssignRosterModalOpen && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAssignRosterModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Assign Athletes to Roster
                </h3>
                <p className="text-xs text-slate-500 truncate">{selectedTournament.title}</p>
              </div>
              <button
                onClick={() => setIsAssignRosterModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700">Squad Members Available:</span>
              <div className="space-y-2">
                {ATHLETES_DATA.map((ath) => {
                  const isChecked = selectedAthletes.includes(ath.id);
                  return (
                    <div
                      key={ath.id}
                      onClick={() => {
                        setSelectedAthletes((prev) =>
                          isChecked ? prev.filter((id) => id !== ath.id) : [...prev, ath.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ath.avatar}
                          alt={ath.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {ath.name}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {ath.number} · {ath.position} · Rating {ath.overallRating}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsAssignRosterModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAssignRosterModalOpen(false);
                  onShowToast(
                    'Roster Updated',
                    `${selectedAthletes.length} athletes assigned to ${selectedTournament.title}`,
                    'success'
                  );
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Save Roster ({selectedAthletes.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsRegisterModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Confirm Tournament Registration
                </h3>
                <p className="text-xs text-slate-500">{selectedTournament.title}</p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Coach in Charge:</span>
                <span className="font-semibold text-slate-800">{coach.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roster Capacity:</span>
                <span className="font-semibold text-slate-800">
                  {selectedAthletes.length} Athletes Selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Entry Fee:</span>
                <span className="font-bold text-blue-700">{selectedTournament.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sanction Status:</span>
                <span className="text-emerald-700 font-semibold">{selectedTournament.tag}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleRegisterConfirm}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prep Drawer Modal */}
      {isPrepDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsPrepDrawerOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Coach Preparation & Watchlist
                </h3>
                <span className="text-xs text-slate-500">
                  {bookmarkedCount} Tournaments Bookmarked for 2025/26 Cycle
                </span>
              </div>
              <button
                onClick={() => setIsPrepDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {tournaments
                .filter((t) => t.isBookmarked)
                .map((tourney) => (
                  <div
                    key={tourney.id}
                    className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate font-['Plus_Jakarta_Sans']">
                        {tourney.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {tourney.dates} · {tourney.venue}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleBookmark(tourney.id)}
                      className="text-xs text-red-600 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}

              {bookmarkedCount === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No tournaments saved to prep list yet. Click the bookmark icon on any card!
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPrepDrawerOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Venue Directions & Map Preview Modal */}
      {venuePreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setVenuePreviewModal(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                    Venue & Proximity Route
                  </h3>
                  <p className="text-xs text-slate-500">From: {coachLocation}</p>
                </div>
              </div>
              <button
                onClick={() => setVenuePreviewModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Travel Summary */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Distance</span>
                <p className="text-lg font-extrabold text-emerald-950 font-['Plus_Jakarta_Sans']">
                  {venuePreviewModal.distanceMiles ?? '12'} miles
                </p>
                <span className="text-[11px] text-emerald-700">~{venuePreviewModal.distanceKm ?? '19'} km</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Est. Travel Time</span>
                <p className="text-lg font-extrabold text-emerald-950 font-['Plus_Jakarta_Sans']">
                  {venuePreviewModal.driveTime || '20 mins drive'}
                </p>
                <span className="text-[11px] text-emerald-700">Light traffic · Direct route</span>
              </div>
            </div>

            {/* Facility Details */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{venuePreviewModal.venue}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    {venuePreviewModal.city || 'Local Arena'}
                  </span>
                </div>
                <p className="text-slate-600">{venuePreviewModal.location}</p>
                <p className="text-slate-500 text-[11px]">
                  Scout Facility Parking: Zone B & C (Gate 3 Entry) · Locker Rooms: East Wing
                </p>
              </div>

              {/* Simulated Map Visual */}
              <div className="h-32 w-full rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                <div className="relative flex flex-col items-center text-center p-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce mb-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-slate-800 font-['Plus_Jakarta_Sans']">
                    {venuePreviewModal.venue}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    GPS Coordinates: 32.7767° N, 96.7970° W
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setVenuePreviewModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${venuePreviewModal.venue} ${venuePreviewModal.location}`
                    )}`,
                    '_blank'
                  );
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>Open in Maps Navigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
