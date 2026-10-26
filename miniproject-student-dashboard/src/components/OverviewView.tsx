import React, { useRef, useState, useEffect } from 'react';
import { Competition, NavTabId, UserLocation } from '../types';
import { HERO_BACKGROUNDS, PRESET_LOCATIONS } from '../mockData';
import { getLoggedInStudent } from '../utils/userSession';

interface OverviewViewProps {
  competitions: Competition[];
  userLocation: UserLocation;
  onDetectLocation: () => void;
  onSelectPresetLocation: (preset: { name: string; lat: number; lng: number }) => void;
  onOpenRegisterModal: (comp: Competition) => void;
  onOpenCvModal: () => void;
  onToggleBookmark: (comp: Competition) => void;
  onSelectNavTab: (tab: NavTabId) => void;
  showToast: (message: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  competitions,
  userLocation,
  onDetectLocation,
  onSelectPresetLocation,
  onOpenRegisterModal,
  onOpenCvModal,
  onToggleBookmark,
  onSelectNavTab,
  showToast,
}) => {
  const student = getLoggedInStudent();
  const studentFirstName = student.name.split(' ')[0] || 'Athlete';
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);

  // Background 5-second cycling state
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [isBgPaused, setIsBgPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);

  // 5-second rotation timer
  useEffect(() => {
    if (isBgPaused) return;

    const interval = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
      setSecondsLeft(5);
    }, 5000);

    const tickInterval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(tickInterval);
    };
  }, [isBgPaused]);

  const currentHeroBg = HERO_BACKGROUNDS[activeBgIndex];

  const handleNextHero = () => {
    setActiveBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    setSecondsLeft(5);
  };

  const handlePrevHero = () => {
    setActiveBgIndex((prev) => (prev - 1 + HERO_BACKGROUNDS.length) % HERO_BACKGROUNDS.length);
    setSecondsLeft(5);
  };

  const slideCarousel = (direction: number) => {
    if (!sliderRef.current) return;
    const itemWidth = 380 + 20; // card min-width + gap
    sliderRef.current.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
    const newIdx = Math.max(0, Math.min(2, activeSlideIndex + direction));
    setActiveSlideIndex(newIdx);
  };

  const goToSlide = (idx: number) => {
    if (!sliderRef.current) return;
    const itemWidth = 380 + 20;
    sliderRef.current.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
    setActiveSlideIndex(idx);
  };

  const handleCircuitClick = (circuit: string) => {
    if (selectedCircuit === circuit) {
      setSelectedCircuit(null);
      showToast('Showing all recommended competitions');
      return;
    }
    setSelectedCircuit(circuit);

    if (circuit === 'Nearby') {
      showToast(`Showing competitions nearest to your location (${userLocation.cityName})`);
    } else if (circuit === 'University') {
      showToast(`Showing University competitions sorted by proximity to ${userLocation.cityName}`);
    } else {
      showToast(`Filtered ${circuit} circuit competitions`);
    }
  };

  // Dynamically compute list of competitions based on selected circuit & location
  let recommendedComps: Competition[] = [];

  if (selectedCircuit === 'Nearby') {
    // Sort all competitions by distance from user location ascending
    recommendedComps = [...competitions].sort(
      (a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999)
    );
  } else if (selectedCircuit === 'University') {
    // Filter to university tier, and sort by distance from user location ascending
    recommendedComps = competitions
      .filter(
        (c) =>
          c.circuitTier === 'University' ||
          c.title.toLowerCase().includes('university') ||
          c.title.toLowerCase().includes('college') ||
          c.organizer.toLowerCase().includes('university') ||
          c.organizer.toLowerCase().includes('aiu')
      )
      .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
  } else if (selectedCircuit) {
    // Other circuits (District, State, National)
    recommendedComps = competitions.filter(
      (c) => c.circuitTier.toLowerCase() === selectedCircuit.toLowerCase()
    );
  } else {
    // Default: Top recommendations
    recommendedComps = competitions.slice(0, 6);
  }

  // Count metrics
  const universityCount = competitions.filter(
    (c) =>
      c.circuitTier === 'University' ||
      c.title.toLowerCase().includes('university') ||
      c.title.toLowerCase().includes('college')
  ).length;

  const nearbyCount = competitions.filter((c) => (c.distanceKm ?? 999) <= 30).length;

  return (
    <div className="w-full">
      {/* 3. HALF-PAGE CINEMATIC ATHLETE HERO WITH AUTOMATIC 5-SEC BACKGROUND CYCLING */}
      <div className="relative w-full h-[54vh] min-h-[480px] max-h-[600px] overflow-hidden" id="hero-container">
        {/* Layered Cycling Background Images with 1s Smooth Cross-Fade */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {HERO_BACKGROUNDS.map((bg, idx) => (
            <div
              key={bg.id}
              className={`absolute inset-0 w-full h-full transform-gpu transition-opacity duration-1000 ease-in-out ${
                activeBgIndex === idx ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                alt={`${bg.sport} - ${bg.athleteFocus}`}
                className="w-full h-full object-cover object-[center_30%] scale-102 brightness-[1.06] contrast-[1.06] saturate-[1.12]"
                src={bg.imageUrl}
              />
            </div>
          ))}
        </div>

        {/* Crisp Stadium Lighting, Selective Text-Protection Gradient, and Soft Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d1e]/80 via-[#070d1e]/30 to-transparent pointer-events-none z-2" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/10 pointer-events-none z-2" />

        {/* Subtle Kinetic Stadium Floodlight Glow Accents */}
        <div className="absolute -top-24 -left-24 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-stadium-glow z-2" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none z-2" />

        {/* Hero Content Inner */}
        <div className="relative z-10 max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 transition-transform duration-300">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex flex-col max-w-3xl">
              {/* Dynamic 5-Second Cycling Sport/Athlete Spotlight Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white border border-white/20 text-xs font-semibold shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                  </span>
                  <span className="text-teal-300 font-bold">Live Sport Spotlight:</span>
                  <span className="text-white font-medium">{currentHeroBg.sport}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-sky-200">{currentHeroBg.athleteFocus}</span>
                </div>

                {/* 5s Carousel mini controllers */}
                <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 text-[10px] text-white/80">
                  <button
                    type="button"
                    onClick={handlePrevHero}
                    title="Previous Sport"
                    className="hover:text-white cursor-pointer px-0.5"
                  >
                    ❮
                  </button>
                  <span className="font-mono text-teal-300 font-bold">{secondsLeft}s</span>
                  <button
                    type="button"
                    onClick={() => setIsBgPaused(!isBgPaused)}
                    title={isBgPaused ? 'Resume auto-cycle (5s)' : 'Pause background'}
                    className="hover:text-white cursor-pointer px-1 font-bold"
                  >
                    {isBgPaused ? '▶' : '⏸'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextHero}
                    title="Next Sport"
                    className="hover:text-white cursor-pointer px-0.5"
                  >
                    ❯
                  </button>
                </div>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/25 backdrop-blur-md text-teal-300 border border-teal-400/40 text-xs font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  Active Athlete Status
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs text-sky-200 bg-blue-600/35 backdrop-blur-md px-3 py-1 rounded-full border border-sky-400/30 font-medium font-mono">
                  {student.sport} • {student.title || 'Student Athlete'}
                </span>
                <span className="text-xs text-emerald-300 bg-emerald-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  Ready for Trials
                </span>
              </div>

              {/* Headline with Gradient Greeting */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-white bg-clip-text text-transparent">
                  {studentFirstName}!
                </span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                Your current sprint index qualifies you for 14 Tier-1 regional and national trials this season. Peak athletic condition recorded.
              </p>

              {/* Live Performance KPI Bar inside Hero */}
              <div className="mt-5 pt-3 border-t border-white/15 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-sky-300 border border-blue-400/30">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                      Personal Best (400m)
                    </div>
                    <div className="text-base text-white font-bold tracking-tight">
                      46.82s <span className="text-emerald-400 text-xs font-semibold ml-1">▲ Top 2%</span>
                    </div>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 backdrop-blur-md flex items-center justify-center text-teal-300 border border-teal-400/30">
                    <span className="material-symbols-outlined text-[20px]">military_tech</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                      Scout Readiness Index
                    </div>
                    <div className="text-base text-teal-200 font-bold tracking-tight">
                      94 / 100 <span className="text-white/70 text-xs font-normal ml-1">(Elite Tier)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Action CTAs */}
            <div className="flex flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  document.getElementById('recommended-section')?.scrollIntoView({ behavior: 'smooth' });
                  showToast(`Viewing curated competitions matching ${studentFirstName}'s profile.`);
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 border border-blue-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">explore</span>
                <span>Explore Competitions</span>
              </button>
              <button
                type="button"
                onClick={onOpenCvModal}
                className="inline-flex items-center justify-center gap-2 glass-card-dark hover:bg-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl transition-all border border-white/25 hover:border-white/40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>Athlete CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CONTENT (FULL WIDTH 1440PX WRAPPER) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 pb-16">
        {/* 4 METRIC STATS KPI CARDS (Glassmorphism Overlapping Hero) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {/* Metric 1: Matching Competitions */}
          <div
            onClick={() => {
              onSelectNavTab('discover');
              showToast(`Filtered 14 Matching Competitions for ${studentFirstName}`);
            }}
            className="glass-card-floating rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 hover:border-blue-500/40 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 rounded-full blur-xl group-hover:bg-blue-600/20 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Matching Competitions
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-xs">
                <span className="material-symbols-outlined text-[20px]">emoji_events</span>
              </div>
            </div>
            <div className="flex flex-col relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">14</span>
                <span className="text-xs font-bold text-blue-600">Matches</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                  <span className="material-symbols-outlined text-[13px] mr-0.5">trending_up</span>+3
                </span>
                <span className="text-xs text-slate-500 font-medium">new this week</span>
              </div>
            </div>
          </div>

          {/* Metric 2: My Applications */}
          <div
            onClick={() => {
              onSelectNavTab('registrations');
              showToast(`Opening ${studentFirstName}'s 4 Active Applications (2 Pending Scout Review)`);
            }}
            className="glass-card-floating rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 hover:border-amber-500/40 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                My Applications
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white shadow-xs">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </div>
            </div>
            <div className="flex flex-col relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">4</span>
                <span className="text-xs font-bold text-amber-700">Active</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center text-amber-800 text-xs bg-amber-100/70 px-2 py-0.5 rounded-full font-semibold">
                  <span className="material-symbols-outlined text-[13px] mr-0.5">hourglass_top</span>
                  2 Pending
                </span>
                <span className="text-xs text-slate-500 font-medium">under review</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Upcoming Events */}
          <div
            onClick={() => {
              document.getElementById('upcoming-section')?.scrollIntoView({ behavior: 'smooth' });
              showToast('Viewing 2 Scheduled Events. Next: Karnataka State Selection Trials (In 4d)');
            }}
            className="glass-card-floating rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 hover:border-teal-500/40 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Upcoming Events
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-700 group-hover:text-white shadow-xs">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
            </div>
            <div className="flex flex-col relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">2</span>
                <span className="text-xs font-bold text-teal-700">Scheduled</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center text-teal-800 text-xs bg-teal-100/70 px-2 py-0.5 rounded-full font-semibold">
                  <span className="material-symbols-outlined text-[13px] mr-0.5">schedule</span>
                  In 4d
                </span>
                <span className="text-xs text-slate-500 font-medium truncate">State Athletic Trials</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Verified Achievements */}
          <div
            onClick={() => {
              onSelectNavTab('achievements');
              showToast('Viewing 18 Verified National & State Badges & Federation Medals');
            }}
            className="glass-card-floating rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200/80 hover:border-blue-400 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-100 rounded-full blur-xl group-hover:bg-blue-200 transition-all" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Verified Achievements
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-blue-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-xs">
                <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              </div>
            </div>
            <div className="flex flex-col relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">18</span>
                <span className="text-xs font-bold text-blue-600">Badges</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-flex items-center text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded-full font-semibold border border-blue-200/60">
                  <span className="material-symbols-outlined text-[13px] mr-0.5">verified</span>
                  National Tier
                </span>
                <span className="text-xs text-slate-500 font-medium">State & National</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOCATION DISCOVERY & GPS CONTROL BAR ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">location_on</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Your Competitive Location:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                  {userLocation.source === 'gps' ? 'Live GPS Active' : 'Active Region'}
                </span>
              </div>
              <p className="text-xs font-bold text-blue-700 mt-0.5">
                {userLocation.cityName}{' '}
                <span className="font-mono text-[11px] text-slate-400 font-normal">
                  ({userLocation.latitude.toFixed(2)}°N, {userLocation.longitude.toFixed(2)}°E)
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onDetectLocation}
              disabled={userLocation.isDetecting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[16px] ${userLocation.isDetecting ? 'animate-spin' : ''}`}>
                my_location
              </span>
              <span>{userLocation.isDetecting ? 'Detecting GPS...' : 'Use My GPS Location'}</span>
            </button>

            {/* Quick Presets Dropdown */}
            <select
              onChange={(e) => {
                const preset = PRESET_LOCATIONS.find((p) => p.name === e.target.value);
                if (preset) {
                  onSelectPresetLocation(preset);
                }
              }}
              value={userLocation.cityName}
              className="h-9 px-3 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:border-blue-600"
            >
              <option disabled value="">
                Switch Regional Hub...
              </option>
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  📍 {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW: FIND YOUR COMPETITION (Category Circuits with Location-Driven Filters) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[22px]">tune</span>
              <h2 className="text-lg font-bold text-slate-900">Find Your Competition</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Browse by competitive circuit tier • Sorted by distance to you
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {/* 1. University (Location-based Collegiate Filter) */}
            <button
              type="button"
              onClick={() => handleCircuitClick('University')}
              className={`bg-white hover:bg-slate-50 rounded-2xl p-4 text-left shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border cursor-pointer ${
                selectedCircuit === 'University'
                  ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-500/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[22px]">school</span>
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">University</span>
                <span className="text-xs text-slate-500 mt-0.5 block">{universityCount} Tournaments</span>
                <span className="text-[10px] text-blue-600 font-semibold block mt-1">
                  Near your campus
                </span>
              </div>
              <div className="mt-3 flex items-center text-blue-600 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                <span>{selectedCircuit === 'University' ? 'Active' : 'Explore'}</span>
                <span className="material-symbols-outlined text-[15px] ml-0.5">arrow_forward</span>
              </div>
            </button>

            {/* 2. District */}
            <button
              type="button"
              onClick={() => handleCircuitClick('District')}
              className={`bg-white hover:bg-slate-50 rounded-2xl p-4 text-left shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border cursor-pointer ${
                selectedCircuit === 'District'
                  ? 'ring-2 ring-teal-600 border-teal-600 bg-teal-50/50'
                  : 'border-slate-200 hover:border-teal-500/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">District</span>
                <span className="text-xs text-slate-500 mt-0.5 block">24 Meets</span>
                <span className="text-[10px] text-teal-700 font-semibold block mt-1">
                  Zonal trials
                </span>
              </div>
              <div className="mt-3 flex items-center text-teal-700 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                <span>{selectedCircuit === 'District' ? 'Active' : 'Explore'}</span>
                <span className="material-symbols-outlined text-[15px] ml-0.5">arrow_forward</span>
              </div>
            </button>

            {/* 3. State */}
            <button
              type="button"
              onClick={() => handleCircuitClick('State')}
              className={`bg-white hover:bg-slate-50 rounded-2xl p-4 text-left shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border cursor-pointer ${
                selectedCircuit === 'State'
                  ? 'ring-2 ring-amber-600 border-amber-600 bg-amber-50/50'
                  : 'border-slate-200 hover:border-amber-500/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[22px]">flag</span>
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">State</span>
                <span className="text-xs text-slate-500 mt-0.5 block">12 Championships</span>
                <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                  Ranking events
                </span>
              </div>
              <div className="mt-3 flex items-center text-amber-700 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                <span>{selectedCircuit === 'State' ? 'Active' : 'Explore'}</span>
                <span className="material-symbols-outlined text-[15px] ml-0.5">arrow_forward</span>
              </div>
            </button>

            {/* 4. National */}
            <button
              type="button"
              onClick={() => handleCircuitClick('National')}
              className={`bg-white hover:bg-slate-50 rounded-2xl p-4 text-left shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group border cursor-pointer ${
                selectedCircuit === 'National'
                  ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-600/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[22px]">military_tech</span>
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">National</span>
                <span className="text-xs text-slate-500 mt-0.5 block">6 Nationals</span>
                <span className="text-[10px] text-blue-700 font-semibold block mt-1">
                  Federation Cup
                </span>
              </div>
              <div className="mt-3 flex items-center text-blue-600 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                <span>{selectedCircuit === 'National' ? 'Active' : 'Explore'}</span>
                <span className="material-symbols-outlined text-[15px] ml-0.5">arrow_forward</span>
              </div>
            </button>

            {/* 5. Nearby (Location-based Nearest Circuit) */}
            <button
              type="button"
              onClick={() => handleCircuitClick('Nearby')}
              className={`bg-white hover:bg-slate-50 rounded-2xl p-4 text-left shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group col-span-2 sm:col-span-1 border cursor-pointer ${
                selectedCircuit === 'Nearby'
                  ? 'ring-2 ring-teal-600 border-teal-600 bg-teal-50/50'
                  : 'border-slate-200 hover:border-teal-600/50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[22px]">near_me</span>
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">Nearby</span>
                <span className="text-xs text-slate-500 mt-0.5 block">{nearbyCount} within 30km</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                  Nearest first
                </span>
              </div>
              <div className="mt-3 flex items-center text-teal-700 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                <span>{selectedCircuit === 'Nearby' ? 'Active' : 'Explore'}</span>
                <span className="material-symbols-outlined text-[15px] ml-0.5">arrow_forward</span>
              </div>
            </button>
          </div>
        </div>

        {/* ROW: RECOMMENDED COMPETITIONS CAROUSEL (Driven by Location) */}
        <div className="mb-10" id="recommended-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedCircuit === 'University'
                    ? `University Competitions (Closest to ${userLocation.cityName})`
                    : selectedCircuit === 'Nearby'
                    ? `Nearby Competitions (Sorted by distance to you)`
                    : 'Recommended Competitions'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  {selectedCircuit ? `${selectedCircuit} Circuit` : 'AI Match Score > 90%'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {selectedCircuit === 'University'
                  ? `Collegiate tournaments & varsity meets located closest to your location.`
                  : selectedCircuit === 'Nearby'
                  ? `Sorted by distance from your coordinates (${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}).`
                  : 'Curated events tailored to your varsity sprint metrics and qualification calendar'}
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-3">
              {selectedCircuit && (
                <button
                  type="button"
                  onClick={() => setSelectedCircuit(null)}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Clear Circuit Filter
                </button>
              )}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => slideCarousel(-1)}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white text-slate-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => slideCarousel(1)}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white text-slate-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectNavTab('discover');
                  showToast('Loading full catalog of 42 eligible sports competitions...');
                }}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group ml-2 cursor-pointer"
              >
                <span>View All Matches</span>
                <span className="material-symbols-outlined text-[17px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Slider Track */}
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto slider-snap pb-4 pt-1 px-1 -mx-1 scrollbar-none"
          >
            {recommendedComps.map((comp) => {
              const categoryBadgeBg =
                comp.category === 'Football'
                  ? 'bg-blue-600 text-white'
                  : comp.category === 'Badminton'
                  ? 'bg-teal-700 text-white'
                  : comp.category === 'Athletics'
                  ? 'bg-amber-600 text-white'
                  : 'bg-indigo-600 text-white';

              const matchBadgeColor =
                comp.matchScore >= 98
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : comp.matchScore >= 95
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-sky-700 bg-sky-50 border-sky-200';

              return (
                <div
                  key={comp.id}
                  className="slider-item min-w-[320px] md:min-w-[380px] flex-1 bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col border border-slate-200 group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      alt={comp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[1.04] contrast-[1.04]"
                      src={comp.image}
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
                      title={comp.isBookmarked ? 'Remove bookmark' : 'Bookmark competition'}
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

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug truncate pr-2">
                          {comp.title}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border shrink-0 ${matchBadgeColor}`}>
                          {comp.matchScore}% Match
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px] text-slate-400">
                            calendar_month
                          </span>
                          <span className="truncate">{comp.dateRange}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px] text-teal-600">
                            pin_drop
                          </span>
                          <span className="truncate font-medium text-slate-800">
                            {comp.venue.split(',')[0]} ({comp.distanceKm}km)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px] text-slate-400">
                            payments
                          </span>
                          <span className="font-semibold text-slate-900">{comp.entryFee}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px] text-amber-600">
                            hourglass_bottom
                          </span>
                          <span className="font-semibold text-amber-700">{comp.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 bg-slate-50 -mx-4 -mb-4 p-3 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">{comp.eligibility}</span>
                      <button
                        type="button"
                        onClick={() => onOpenRegisterModal(comp)}
                        className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl hover:bg-blue-700 transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                  activeSlideIndex === idx ? 'w-7 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-blue-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ROW: 2-COLUMN SPLIT (Registration Closing Soon + My Upcoming Events) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10" id="upcoming-section">
          {/* Left Column: Registration Closing Soon */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-600 text-[22px] animate-pulse">
                    alarm
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Registration Closing Soon</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  Priority Deadlines
                </span>
              </div>

              <div className="space-y-3">
                {/* Item 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-rose-100 text-rose-700 font-mono text-xs font-bold shrink-0">
                      2 Days Left
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          Regional Inter-College 400m Relay
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold shrink-0">
                          Track
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Entries remaining: 6 slots | Entry fee: ₹300</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const item = competitions.find((c) => c.id === 'comp-4') || competitions[0];
                      onOpenRegisterModal(item);
                    }}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Register Now
                  </button>
                </div>

                {/* Item 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold shrink-0">
                      5 Days Left
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          South Zone Open Decathlon Trials
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold shrink-0">
                          Athletics
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Scouts attending: SAI & Army Sports Node | ₹600</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const item = competitions.find((c) => c.id === 'comp-5') || competitions[0];
                      onOpenRegisterModal(item);
                    }}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Register Now
                  </button>
                </div>

                {/* Item 3 */}
                <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-amber-100 text-amber-800 font-mono text-xs font-bold shrink-0">
                      6 Days Left
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          All-Bengaluru 5K Campus Challenge
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-slate-200 text-slate-600 text-[10px] font-semibold shrink-0">
                          Distance
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Fast-track selection for varsity cross-country</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const item = competitions.find((c) => c.id === 'comp-6') || competitions[0];
                      onOpenRegisterModal(item);
                    }}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Automatic reminders enabled for your saved sports
              </span>
              <button
                type="button"
                onClick={() => showToast('Opening notification frequency preferences...')}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Notification Settings
              </button>
            </div>
          </div>

          {/* Right Column: My Upcoming Events */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-700 text-[22px]">event_available</span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">My Upcoming Events</h2>
                </div>
                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-semibold">
                  2 Confirmed Schedule Items
                </span>
              </div>

              <div className="space-y-3">
                {/* Event 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/30 border border-slate-200/80 transition-all flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-wider leading-none">
                        OCT
                      </span>
                      <span className="text-lg leading-tight font-black mt-0.5">28</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        Karnataka State Athletic Selection Trials
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">stadium</span>
                        Kanteerava Outdoor Stadium, Track #3
                      </p>
                      <span className="font-mono text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                        Call Time: 07:30 AM IST
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      Confirmed
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Digital Bib Verified: #KA-400M-8492 (Lane 4)')}
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-0.5 font-semibold hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                      Bib Pass
                    </button>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/30 border border-slate-200/80 transition-all flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 to-teal-900 text-white flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-wider leading-none">
                        NOV
                      </span>
                      <span className="text-lg leading-tight font-black mt-0.5">05</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                        Inter-Zone University Sprint Quarter-Finals
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        Mysore University Athletic Complex
                      </p>
                      <span className="font-mono text-[11px] text-teal-700 font-semibold mt-0.5 block">
                        Heat 2 — Lane 4 Assignment
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                      <span className="material-symbols-outlined text-[13px]">confirmation_number</span>
                      Ticket Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Downloading PDF entry slip with QR accreditation...')}
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-0.5 font-semibold hover:underline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      Entry Slip
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
              <span>Syncing automatically with Apple Calendar & Google</span>
              <button
                type="button"
                onClick={() => showToast('Synced 2 upcoming competitions with Google Calendar')}
                className="text-teal-700 text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">sync</span>
                Sync Calendar
              </button>
            </div>
          </div>
        </div>

        {/* ROW: 2-COLUMN SPLIT (Nearby Map Preview + Recently Added Stream) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Nearby Competitions Map Preview */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[22px]">map</span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Nearby Competitions</h2>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                  <span className="material-symbols-outlined text-teal-700 text-[16px]">my_location</span>
                  <span className="font-mono text-xs text-slate-800 font-semibold truncate max-w-[200px]">
                    {userLocation.cityName.split(',')[0]} (30km Radius)
                  </span>
                </div>
              </div>

              {/* Stylized Interactive Map Preview */}
              <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-inner group border border-slate-200">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 brightness-[1.04] contrast-[1.04]"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0pqlA6GrxqR_evm7z4yG1PpcLYZgycRse9bqBCH63zNrEp2L8ez6YZs4ltiiSXNj2FNPM6wKvlO5idU94Ud1MHouUN5JnVxF5sUisFqyvU5Z_fg5yflTlnWErEL1ONQimcj_agXNCejHLdkZwmp31ae71QAZkJfHsuoXr3JjKBlUMvznRXAzh5UkmusYYDtrrQZA4Mf0fNCWz_iRJCKf0BIwb3VvPGw-QEdoehmw0Hm649KWA6HYTPQ')`,
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/10 pointer-events-none" />

                {/* Map Pin 1: Kanteerava */}
                <div className="absolute top-6 left-12">
                  <div
                    onClick={() => showToast('Venue: Sree Kanteerava Outdoor Stadium')}
                    className="relative flex flex-col items-center group/pin cursor-pointer"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-900 shadow-md text-xs whitespace-nowrap mb-1 font-semibold border border-slate-200">
                      Kanteerava Stadium
                    </span>
                    <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-500/40 flex items-center justify-center animate-bounce">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                  </div>
                </div>

                {/* Map Pin 2: Padukone Sports Centre */}
                <div className="absolute bottom-12 right-16">
                  <div
                    onClick={() => showToast('Venue: Padukone-Dravid Centre for Sports Excellence')}
                    className="relative flex flex-col items-center group/pin cursor-pointer"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-900 shadow-md text-xs whitespace-nowrap mb-1 font-semibold border border-slate-200">
                      Padukone Sports Centre
                    </span>
                    <div className="w-4 h-4 rounded-full bg-teal-700 ring-4 ring-teal-500/40 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar inside Map */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 flex items-center justify-between text-slate-800 border border-white/60 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="text-xs font-semibold">
                      {nearbyCount} tournaments within your region
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectNavTab('map');
                      showToast('Opening full-screen GPS interactive map with directions...');
                    }}
                    className="text-blue-600 text-xs hover:underline flex items-center font-bold cursor-pointer"
                  >
                    View Full Map
                    <span className="material-symbols-outlined text-[14px] ml-0.5">open_in_new</span>
                  </button>
                </div>
              </div>

              {/* Venue Mini Chips List */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => showToast('Kanteerava Complex: 6 upcoming athletic and relay events')}
                  className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200/80 hover:border-blue-500/40 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">stadium</span>
                    <span className="text-xs truncate text-slate-800 font-medium">Kanteerava Complex</span>
                  </div>
                  <span className="font-mono text-[11px] text-blue-600 font-bold shrink-0 bg-blue-50 px-1.5 py-0.5 rounded-md">
                    6 Events
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Padukone Academy: 4 badminton and indoor conditioning events')}
                  className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200/80 hover:border-teal-600/40 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[18px] text-teal-700">sports_tennis</span>
                    <span className="text-xs truncate text-slate-800 font-medium">Padukone Academy</span>
                  </div>
                  <span className="font-mono text-[11px] text-teal-700 font-bold shrink-0 bg-teal-50 px-1.5 py-0.5 rounded-md">
                    4 Events
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recently Added Competition Feed */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[22px]">new_releases</span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Recently Added</h2>
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-semibold">
                  Live updates stream
                </span>
              </div>

              <div className="space-y-3">
                {/* Feed item 1 */}
                <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 hover:border-blue-300 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">directions_run</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          Inter-District Sprint Challenge 2025
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold shrink-0">
                          Eligible
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>Added 2 hours ago</span>
                        <span className="text-slate-300">•</span>
                        <span>Dec 12, 2025</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-800">₹400 Entry</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const item = competitions.find((c) => c.id === 'comp-7') || competitions[0];
                        onToggleBookmark(item);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[19px]">bookmark_border</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const item = competitions.find((c) => c.id === 'comp-7') || competitions[0];
                        onOpenRegisterModal(item);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[19px]">arrow_outward</span>
                    </button>
                  </div>
                </div>

                {/* Feed item 2 */}
                <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 hover:border-teal-300 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">pool</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                          South Zone Aquatics Invitational Meet
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-semibold shrink-0">
                          Open Class
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>Added 5 hours ago</span>
                        <span className="text-slate-300">•</span>
                        <span>Jan 08, 2026</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-emerald-600">Free Entry</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const item = competitions.find((c) => c.id === 'comp-8') || competitions[0];
                        onToggleBookmark(item);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[19px]">bookmark_border</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const item = competitions.find((c) => c.id === 'comp-8') || competitions[0];
                        onOpenRegisterModal(item);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[19px]">arrow_outward</span>
                    </button>
                  </div>
                </div>

                {/* Feed item 3 */}
                <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 hover:border-blue-300 transition-all flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">sports_volleyball</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          Apex State Volleyball Masters Cup
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold shrink-0">
                          Team Entry
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>Added yesterday</span>
                        <span className="text-slate-300">•</span>
                        <span>Jan 14, 2026</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-800">₹2,000 / squad</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const item = competitions.find((c) => c.id === 'comp-9') || competitions[0];
                        onToggleBookmark(item);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[19px]">bookmark_border</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const item = competitions.find((c) => c.id === 'comp-9') || competitions[0];
                        onOpenRegisterModal(item);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[19px]">arrow_outward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
              <span>Want instant alerts for new track and relay meets?</span>
              <button
                type="button"
                onClick={() => showToast('Configured real-time SMS & Push alerts for 400m Track')}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">tune</span>
                Manage Watchlist Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
