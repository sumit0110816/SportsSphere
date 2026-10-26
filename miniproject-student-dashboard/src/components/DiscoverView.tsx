import React, { useState } from 'react';
import { Competition, UserLocation } from '../types';

interface DiscoverViewProps {
  competitions: Competition[];
  userLocation: UserLocation;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenRegisterModal: (comp: Competition) => void;
  onToggleBookmark: (comp: Competition) => void;
  showToast: (msg: string) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  competitions,
  userLocation,
  searchQuery,
  setSearchQuery,
  onOpenRegisterModal,
  onToggleBookmark,
  showToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'nearest' | 'match' | 'fee'>('nearest');
  const [minMatchScore, setMinMatchScore] = useState<number>(75);
  const [maxFee, setMaxFee] = useState<number>(2500);

  const categories = ['All', 'Athletics', 'Football', 'Badminton', 'Swimming', 'Volleyball'];
  const tiers = ['All', 'University', 'District', 'State', 'National'];

  const filteredCompetitions = competitions
    .filter((comp) => {
      const matchesSearch =
        !searchQuery ||
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.organizer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || comp.category === selectedCategory;

      const matchesTier = selectedTier === 'All' || comp.circuitTier === selectedTier;
      const matchesScore = comp.matchScore >= minMatchScore;
      const matchesFee = comp.feeAmount <= maxFee;

      return matchesSearch && matchesCategory && matchesTier && matchesScore && matchesFee;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') {
        return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
      }
      if (sortBy === 'match') {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === 'fee') {
        return a.feeAmount - b.feeAmount;
      }
      return 0;
    });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>Location Proximity: {userLocation.cityName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover Competitions & Scouting Trials
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Browse through national federations, university sports councils, and district championships. All meets are calibrated with real distance from your current location.
          </p>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 mb-8 space-y-4">
        {/* Top search & quick counts */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by meet name, stadium, or federation..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <span className="text-slate-400 pl-2">Sort:</span>
              <button
                type="button"
                onClick={() => setSortBy('nearest')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  sortBy === 'nearest'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📍 Nearest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('match')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  sortBy === 'match'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Match %
              </button>
              <button
                type="button"
                onClick={() => setSortBy('fee')}
                className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                  sortBy === 'fee'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entry Fee
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedTier('All');
                setSortBy('nearest');
                setMinMatchScore(75);
                setMaxFee(2500);
                setSearchQuery('');
                showToast('Reset all discovery filters to default');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Secondary Category and Tier Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Sports categories */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Sport:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Circuit Tier */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Circuit:
            </span>
            {tiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedTier === tier
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Competitions */}
      {filteredCompetitions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">sports_score</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No competitions found matching your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your sport category, circuit tier, or clearing your search term to see more eligible matches.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedTier('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Show All Competitions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp) => {
            const categoryBadgeBg =
              comp.category === 'Football'
                ? 'bg-blue-600 text-white'
                : comp.category === 'Badminton'
                ? 'bg-teal-700 text-white'
                : comp.category === 'Athletics'
                ? 'bg-amber-600 text-white'
                : 'bg-indigo-600 text-white';

            return (
              <div
                key={comp.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    alt={comp.title}
                    src={comp.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[1.04] contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs ${categoryBadgeBg}`}>
                      {comp.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-800 text-xs font-medium shadow-xs">
                      {comp.circuitTier}
                    </span>
                    {comp.distanceKm !== undefined && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-teal-300 text-xs font-mono font-bold shadow-xs border border-teal-500/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {comp.distanceKm < 1 ? '<1 km' : `${comp.distanceKm} km`}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(comp)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                      comp.isBookmarked
                        ? 'bg-white text-rose-500 shadow-sm'
                        : 'bg-black/40 hover:bg-white text-white hover:text-blue-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {comp.isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-slate-300 block font-medium">{comp.organizer}</span>
                    <span className="text-base font-bold truncate block text-white drop-shadow-sm">
                      {comp.title}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 truncate pr-2">
                        {comp.title}
                      </h3>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                        {comp.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-slate-600 text-xs pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          calendar_month
                        </span>
                        <span className="truncate">{comp.dateRange}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-teal-600">
                          pin_drop
                        </span>
                        <span className="truncate font-medium text-slate-800">
                          {comp.venue.split(',')[0]} ({comp.distanceKm}km)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">
                          payments
                        </span>
                        <span className="font-semibold text-slate-900">{comp.entryFee}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-600">
                          hourglass_bottom
                        </span>
                        <span className="font-semibold text-amber-700">{comp.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 bg-slate-50 -mx-5 -mb-5 p-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{comp.registeredCount} / {comp.maxSlots} Enrolled</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenRegisterModal(comp)}
                      className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>View & Register</span>
                      <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
