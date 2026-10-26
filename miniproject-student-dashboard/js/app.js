/**
 * SportSphere - Universal Sports & Student Talent Dashboard
 * Built with HTML5, CSS3, Tailwind CSS CDN, and native JavaScript (Fetch API).
 */

import { SportSphereAPI } from './api.js';

// Global Application State
const state = {
  currentRole: 'Athlete',
  activeTab: 'overview', // Default landing view: Overview
  searchQuery: '',
  selectedCategory: 'all',
  selectedTier: 'all',
  sortBy: 'match',
  heroIndex: 0,
  userLocation: {
    latitude: 12.9716,
    longitude: 77.5946,
    cityName: 'Bengaluru Central, Karnataka',
    source: 'default',
    isDetecting: false
  },
  competitions: [],
  venues: [],
  athleteProfile: null,
  scholarships: [],
  highlights: [],
  categories: [],
  savedCompetitions: new Set(['comp-4']),
  selectedVenueId: 'ven-1',
  activeModalComp: null
};

// Hero Carousel Data
const HERO_SLIDES = [
  {
    sport: 'Track & Field • 400m Varsity',
    title: 'Floodlit Stadium Sprint Track',
    focus: 'Varsity Athletics • Championship Circuit',
    badge: 'State Rank #2',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80',
    color: 'from-blue-600/90 to-indigo-900/90'
  },
  {
    sport: 'University Football League',
    title: 'All-India Championship Arena',
    focus: 'Varsity Strikers & Scouting Trials',
    badge: 'AIU Sanctioned',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
    color: 'from-emerald-600/90 to-teal-950/90'
  },
  {
    sport: 'Badminton Championship Cup',
    title: 'Padukone High-Performance Courts',
    focus: 'Collegiate Singles & Doubles Gold Cup',
    badge: 'BWF Scoring',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1600&q=80',
    color: 'from-violet-600/90 to-purple-950/90'
  },
  {
    sport: 'Aquatics 50m Olympic Pool',
    title: 'South Zone Invitational Meet',
    focus: 'High Velocity Freestyle & Touchpad Gates',
    badge: 'SFI Approved',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1600&q=80',
    color: 'from-cyan-600/90 to-blue-950/90'
  }
];

// Preset Indian Cities
const PRESET_CITIES = [
  { name: 'Bengaluru Central, KA', lat: 12.9716, lng: 77.5946 },
  { name: 'Delhi NCR University Hub', lat: 28.6903, lng: 77.2078 },
  { name: 'Mumbai University Campus, MH', lat: 19.0760, lng: 72.8777 },
  { name: 'Hyderabad Gachibowli Hub', lat: 17.4428, lng: 78.3496 },
  { name: 'Chennai Anna University, TN', lat: 13.0102, lng: 80.2355 },
  { name: 'Kolkata Salt Lake Stadium, WB', lat: 22.5697, lng: 88.4069 }
];

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Show Toast Notification
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-slate-900 text-white text-xs font-semibold animate-slide-up transition-all duration-300 z-50`;
  
  let icon = 'check_circle';
  if (type === 'warn') icon = 'warning';
  if (type === 'error') icon = 'error';

  toast.innerHTML = `
    <span class="material-symbols-outlined text-blue-400 text-lg">${icon}</span>
    <span class="flex-1">${message}</span>
    <button class="text-slate-400 hover:text-white" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-base">close</span>
    </button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Update Distances for all Competitions
function updateAllDistances() {
  state.competitions = state.competitions.map(c => ({
    ...c,
    distanceKm: calculateDistanceKm(
      state.userLocation.latitude,
      state.userLocation.longitude,
      c.latitude,
      c.longitude
    )
  }));
}

// Retrieve Logged-In Student from URL query parameters (cross-port redirect) or localStorage
export function getLoggedInStudent() {
  if (typeof window === 'undefined') return null;

  // 1. Check URL query parameters (passed from sportsphere-auth)
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('name');
  if (nameParam) {
    const nameParts = nameParam.trim().split(' ');
    const firstN = nameParts[0] || 'athlete';
    const defaultHandle = firstN.toLowerCase().replace(/[^a-z0-9]/g, '') + '_athlete';
    const studentData = {
      name: nameParam,
      email: params.get('email') || '',
      handle: params.get('handle') || defaultHandle,
      sport: params.get('sport') || 'Athletics',
      city: params.get('city') || 'Regional Hub',
      avatar: params.get('avatar') || '',
      bio: params.get('bio') || '',
      title: params.get('title') || 'Student Athlete',
      org: params.get('org') || 'Varsity Sports Hub',
    };
    try {
      localStorage.setItem('sportsphere_student_user', JSON.stringify(studentData));
    } catch (e) {
      // ignore
    }
    return studentData;
  }

  // 2. Check localStorage for sportsphere_student_user
  try {
    const stored = localStorage.getItem('sportsphere_student_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.name) return parsed;
    }
  } catch (e) {
    // ignore
  }

  // 3. Check localStorage for sportsphere_auth_user
  try {
    const authStored = localStorage.getItem('sportsphere_auth_user');
    if (authStored) {
      const parsed = JSON.parse(authStored);
      if (parsed && (parsed.name || parsed.email)) {
        const pName = parsed.name || parsed.email.split('@')[0];
        const studentData = {
          name: pName,
          email: parsed.email || '',
          handle: pName.toLowerCase().replace(/[^a-z0-9]/g, '') + '_athlete',
          sport: parsed.profile?.primarySport || 'Athletics',
          city: parsed.profile?.city || 'Regional Hub',
          avatar: parsed.profile?.avatar || '',
          bio: parsed.profile?.bio || '',
          title: parsed.profile?.title || parsed.profile?.positionOrEvent || 'Student Athlete',
          org: parsed.profile?.institution || parsed.profile?.organizationName || 'Varsity Sports Hub',
        };
        try {
          localStorage.setItem('sportsphere_student_user', JSON.stringify(studentData));
        } catch (e) {}
        return studentData;
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export function applyLoggedInSessionToProfile(athProfile) {
  const sessionUser = getLoggedInStudent();
  if (!sessionUser || !sessionUser.name) return athProfile;

  if (!athProfile) athProfile = {};
  if (!athProfile.profile) athProfile.profile = {};
  const p = athProfile.profile;

  p.name = sessionUser.name;
  if (sessionUser.handle) p.handle = sessionUser.handle.replace(/^@/, '');

  if (sessionUser.avatar && sessionUser.avatar.startsWith('http')) {
    p.avatar = sessionUser.avatar;
  } else {
    p.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(sessionUser.name)}&background=2563eb&color=fff&size=400&bold=true`;
  }

  const sportName = sessionUser.sport || 'Varsity Athletics';
  const titleName = sessionUser.title || 'Student Athlete';
  const orgName = sessionUser.org || 'Varsity Sports Federation';
  const cityName = sessionUser.city || 'Regional Sports Hub';

  p.role = `${sportName} • ${titleName}`;
  p.headline = `${sportName} Competitor | ${titleName} • ${orgName} | Scout Index: ${p.scoutIndex || 94}/100 | Open for Scouting & Trials`;
  p.institution = orgName;
  p.location = cityName;
  p.bio = sessionUser.bio && sessionUser.bio.trim()
    ? sessionUser.bio
    : `Competitive ${sportName} student athlete representing ${orgName}. Actively training and competing in championship trials.`;

  if (athProfile.experience && Array.isArray(athProfile.experience)) {
    if (athProfile.experience[0]) {
      athProfile.experience[0].role = `Team Athlete • ${sportName}`;
      athProfile.experience[0].organization = orgName;
      athProfile.experience[0].location = cityName;
    }
  }

  if (athProfile.education && Array.isArray(athProfile.education)) {
    if (athProfile.education[0]) {
      athProfile.education[0].institution = orgName;
    }
  }

  if (athProfile.recommendations && Array.isArray(athProfile.recommendations)) {
    athProfile.recommendations.forEach((rec) => {
      if (rec.relation) rec.relation = rec.relation.replace(/Arjun/g, sessionUser.name);
      if (rec.text) rec.text = rec.text.replace(/Arjun/g, sessionUser.name);
    });
  }

  return athProfile;
}

// Initialize Application & Load Data via Fetch API
async function initApp() {
  try {
    // Initial fetch using Fetch API
    const [comps, vens, ath, schs, hls, cats] = await Promise.all([
      SportSphereAPI.getCompetitions(),
      SportSphereAPI.getVenues(),
      SportSphereAPI.getAthleteProfile(),
      SportSphereAPI.getScholarships(),
      SportSphereAPI.getHighlights(),
      SportSphereAPI.getCategories()
    ]);

    state.competitions = comps;
    state.venues = vens;
    state.athleteProfile = applyLoggedInSessionToProfile(ath);
    state.scholarships = schs;
    state.highlights = hls || [];
    state.categories = cats || [];

    updateAllDistances();
    bindGlobalEvents();
    renderNavigation();
    renderSidebar();
    renderActiveTab(); // Overview is rendered first!
    renderHeaderProfile();
    startHeroAutoRotation();

    showToast('Platform loaded with live Fetch API datasets!', 'info');
  } catch (err) {
    console.error('Initialization error:', err);
    showToast('Failed to load some dashboard data. Using local cache.', 'error');
  }
}

// Hero carousel rotation
let heroTimer = null;
function startHeroAutoRotation() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    state.heroIndex = (state.heroIndex + 1) % HERO_SLIDES.length;
    renderHeroSection();
  }, 6000);
}

// Bind Global DOM Event Handlers
function bindGlobalEvents() {
  // Role selector
  const roleSelect = document.getElementById('role-selector');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      state.currentRole = e.target.value;
      showToast(`Role switched to ${state.currentRole}`, 'info');
      renderHeaderProfile();
      renderActiveTab();
    });
  }

  // Location Selector
  const citySelect = document.getElementById('location-city-select');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      const selected = PRESET_CITIES.find(c => c.name === e.target.value);
      if (selected) {
        state.userLocation = {
          latitude: selected.lat,
          longitude: selected.lng,
          cityName: selected.name,
          source: 'preset',
          isDetecting: false
        };
        updateAllDistances();
        showToast(`📍 Location updated to ${selected.name}`, 'info');
        renderActiveTab();
      }
    });
  }

  // GPS Button
  const gpsBtn = document.getElementById('gps-detect-btn');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', handleGPSDetection);
  }

  // Global Search input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      if (state.activeTab !== 'discover') {
        switchTab('discover');
      } else {
        renderDiscoverView();
      }
    });
  }

  // Keyboard Escape listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeModal();
    }
  });
}

// Geolocation Detection via Browser API
function handleGPSDetection() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.', 'warn');
    return;
  }

  showToast('Requesting GPS location from browser...', 'info');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      state.userLocation = {
        latitude,
        longitude,
        cityName: `GPS Live (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`,
        source: 'gps',
        isDetecting: false
      };
      updateAllDistances();
      showToast('📍 Live GPS coordinates synced! Distances updated.', 'info');
      
      const citySelect = document.getElementById('location-city-select');
      if (citySelect) {
        citySelect.innerHTML = `<option value="gps" selected>📍 Live GPS (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)</option>` +
          PRESET_CITIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
      }
      renderActiveTab();
    },
    (err) => {
      showToast('GPS detection denied or unavailable. Retaining current region.', 'warn');
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

// Switch Navigation Tab
export function switchTab(tabId) {
  state.activeTab = tabId;
  closeSidebar();

  // Desktop nav buttons update
  document.querySelectorAll('#desktop-nav-tabs [data-tab]').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all whitespace-nowrap';
    } else {
      btn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all whitespace-nowrap';
    }
  });

  // Mobile nav buttons sync
  document.querySelectorAll('[data-mobile-tab]').forEach(btn => {
    if (btn.getAttribute('data-mobile-tab') === tabId) {
      btn.classList.add('text-blue-600', 'font-bold');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('text-blue-600', 'font-bold');
      btn.classList.add('text-slate-400');
    }
  });

  renderActiveTab();
  renderSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Header profile info and stats
function renderHeaderProfile() {
  const profile = state.athleteProfile?.profile;
  if (!profile) return;

  const profileAvatar = document.getElementById('header-avatar');
  const profileName = document.getElementById('header-name');
  const profileRole = document.getElementById('header-role');

  if (profileAvatar) profileAvatar.src = profile.avatar;
  if (profileName) profileName.textContent = profile.name;
  if (profileRole) profileRole.textContent = `${state.currentRole} • ${profile.institution ? profile.institution.split(' ')[0] : 'Varsity'}`;

  const roleOptionAthlete = document.getElementById('role-option-athlete');
  if (roleOptionAthlete && profile.name) {
    roleOptionAthlete.textContent = `Athlete (${profile.name.split(' ')[0]})`;
  }

  const savedBadge = document.getElementById('saved-count-badge');
  if (savedBadge) {
    savedBadge.textContent = state.savedCompetitions.size;
  }
}

// Render active tab view
function renderActiveTab() {
  const main = document.getElementById('main-content-view');
  if (!main) return;

  switch (state.activeTab) {
    case 'overview':
      main.innerHTML = getOverviewHTML();
      setupOverviewEvents();
      break;
    case 'highlights':
      main.innerHTML = getHighlightsHTML();
      setupHighlightsEvents();
      break;
    case 'profile':
      main.innerHTML = getProfileHTML();
      setupProfileEvents();
      break;
    case 'categories':
      main.innerHTML = getCategoriesHTML();
      setupCategoriesEvents();
      break;
    case 'discover':
      main.innerHTML = getDiscoverHTML();
      setupDiscoverEvents();
      break;
    case 'map':
      main.innerHTML = getMapHTML();
      setupMapEvents();
      break;
    case 'registrations':
      main.innerHTML = getRegistrationsHTML();
      setupRegistrationsEvents();
      break;
    case 'calendar':
      main.innerHTML = getCalendarHTML();
      setupCalendarEvents();
      break;
    case 'achievements':
      main.innerHTML = getAchievementsHTML();
      setupAchievementsEvents();
      break;
    case 'analytics':
      main.innerHTML = getAnalyticsHTML();
      setupAnalyticsEvents();
      break;
    case 'scholarships':
      main.innerHTML = getScholarshipsHTML();
      setupScholarshipsEvents();
      break;
    case 'saved':
      main.innerHTML = getSavedHTML();
      setupSavedEvents();
      break;
    default:
      main.innerHTML = getOverviewHTML();
      setupOverviewEvents();
  }
}

// ==========================================
// VIEW: OVERVIEW (FIRST VIEW SHOWN ON OPEN)
// ==========================================
function getOverviewHTML() {
  const hero = HERO_SLIDES[state.heroIndex];
  const profile = state.athleteProfile?.profile || {};
  const upcoming = state.athleteProfile?.upcomingEvents || [];
  const topComps = state.competitions.slice(0, 4);
  const recentHighlight = state.highlights[0];

  return `
    <div class="space-y-8 animate-fade-in">
      <!-- HERO BANNER -->
      <div id="hero-banner-container" class="relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[440px] flex items-end p-6 sm:p-10 text-white transition-all duration-700">
        <div class="absolute inset-0 bg-cover bg-center transition-all duration-700" style="background-image: url('${hero.image}'); filter: brightness(0.65);"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div class="relative z-10 max-w-3xl space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md">
              ${hero.sport}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
              ${hero.badge}
            </span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            ${hero.title}
          </h1>

          <p class="text-sm sm:text-base text-slate-200 font-medium">
            ${hero.focus}
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-3">
            <button onclick="window.SportSphere.switchTab('discover')" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105">
              <span class="material-symbols-outlined text-base">explore</span>
              Discover Competitions
            </button>
            <button onclick="window.SportSphere.switchTab('highlights')" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105">
              <span class="material-symbols-outlined text-base">play_circle</span>
              Athlete Highlights
            </button>
            <button onclick="window.SportSphere.switchTab('profile')" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-slate-700 transition-all">
              <span class="material-symbols-outlined text-base">badge</span>
              Sports CV (LinkedIn Style)
            </button>
          </div>
        </div>

        <!-- Slide Indicators -->
        <div class="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-2 z-20">
          ${HERO_SLIDES.map((_, idx) => `
            <button onclick="window.SportSphere.setHeroSlide(${idx})" class="h-2 rounded-full transition-all ${idx === state.heroIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/80'}"></button>
          `).join('')}
        </div>
      </div>

      <!-- KEY METRICS GRID -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover-card-elevate">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">AFI Scout Index</span>
            <span class="material-symbols-outlined text-blue-600 text-xl">verified</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900">${profile.scoutIndex || 94}</span>
            <span class="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <p class="text-[11px] text-emerald-600 font-semibold mt-1">Top 2% Varsity Sprinters</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover-card-elevate">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">State Ranking</span>
            <span class="material-symbols-outlined text-amber-500 text-xl">military_tech</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900">#${profile.stateRank || 2}</span>
            <span class="text-xs font-bold text-slate-400">U-23 Men</span>
          </div>
          <p class="text-[11px] text-blue-600 font-semibold mt-1">Personal Best: ${profile.personalBest || '46.82s'}</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover-card-elevate">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Active Entries</span>
            <span class="material-symbols-outlined text-emerald-600 text-xl">app_registration</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900">${state.athleteProfile?.registrations?.length || 4}</span>
            <span class="text-xs font-bold text-slate-400">Confirmed</span>
          </div>
          <p class="text-[11px] text-slate-500 font-semibold mt-1">Next: Oct 28 State Trials</p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover-card-elevate">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider">Nearest Circuit</span>
            <span class="material-symbols-outlined text-purple-600 text-xl">location_on</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900">0.8</span>
            <span class="text-xs font-bold text-slate-400">km</span>
          </div>
          <p class="text-[11px] text-purple-600 font-semibold mt-1">Kanteerava Stadium Track</p>
        </div>
      </div>

      <!-- HIGHLIGHTS SNEAK PEEK & SPORTS CATEGORIES ROW -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Sports Category Cards -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900">Popular Sports Disciplines</h2>
              <p class="text-xs text-slate-500">Quick browse by sports category</p>
            </div>
            <button onclick="window.SportSphere.switchTab('categories')" class="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All Categories →
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${state.categories.slice(0, 6).map(cat => `
              <div onclick="window.SportSphere.openCategory('${cat.slug}')" class="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 cursor-pointer transition-all group">
                <div class="flex items-center gap-2 mb-1.5">
                  <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-lg">${cat.icon}</span>
                  </div>
                  <span class="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">${cat.name.split(' ')[0]}</span>
                </div>
                <div class="text-[11px] text-slate-500 flex justify-between">
                  <span>${cat.activeTournaments} Events</span>
                  <span class="text-blue-600 font-semibold">Explore</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Latest Highlight Teaser -->
        ${recentHighlight ? `
          <div class="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div class="relative z-10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Trending Reel
                </span>
                <span class="text-xs text-slate-400">${recentHighlight.views} Views</span>
              </div>

              <div class="flex items-center gap-3">
                <img src="${recentHighlight.author.avatar}" alt="${recentHighlight.author.name}" class="w-10 h-10 rounded-xl object-cover border border-white/20" />
                <div>
                  <h4 class="text-xs font-bold text-white">${recentHighlight.author.name}</h4>
                  <p class="text-[10px] text-slate-400">${recentHighlight.author.role}</p>
                </div>
              </div>

              <h3 class="text-sm font-bold line-clamp-2">${recentHighlight.title}</h3>
              <p class="text-xs text-slate-300 line-clamp-2">${recentHighlight.caption}</p>
            </div>

            <button onclick="window.SportSphere.switchTab('highlights')" class="relative z-10 mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all">
              <span class="material-symbols-outlined text-base">play_circle</span>
              Watch Highlights & Post Reel
            </button>
          </div>
        ` : ''}
      </div>

      <!-- UPCOMING EVENTS & SCHEDULE -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upcoming Trials -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-600 text-xl">event_available</span>
              <h2 class="text-base font-bold text-slate-900">Confirmed Competition Schedule & Bibs</h2>
            </div>
            <button onclick="window.SportSphere.switchTab('calendar')" class="text-xs font-bold text-blue-600 hover:text-blue-700">
              View Calendar →
            </button>
          </div>

          <div class="space-y-4">
            ${upcoming.map(ev => `
              <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-4 hover:border-blue-300 transition-all">
                <div class="flex items-center gap-4">
                  <div class="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black shadow-sm">
                    <span class="text-[10px] tracking-wider uppercase">${ev.month}</span>
                    <span class="text-xl leading-none">${ev.day}</span>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">${ev.title}</h3>
                    <p class="text-xs text-slate-500 font-medium">${ev.venue}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                        Bib: ${ev.bibNumber}
                      </span>
                      <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ${ev.heatInfo}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:self-center">
                  <span class="text-xs text-slate-500 font-semibold">${ev.callTime}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Biometric Split Snapshot -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-blue-600 text-xl">speed</span>
                <h2 class="text-base font-bold text-slate-900">Sprint Biometrics</h2>
              </div>
              <button onclick="window.SportSphere.switchTab('analytics')" class="text-xs font-bold text-blue-600">Details</button>
            </div>

            <p class="text-xs text-slate-500 mb-4">400m Gold standard splits recorded via electronic Omega photofinish gates.</p>

            <div class="space-y-3">
              ${(state.athleteProfile?.splits || []).map((s, idx) => `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span class="font-bold text-slate-800">Split ${idx + 1}</span>
                    <p class="text-[10px] text-slate-400">${s.segment}</p>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-bold text-blue-600 text-sm">${s.time}</span>
                    <p class="text-[10px] text-emerald-600 font-bold">${s.speed}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <button onclick="window.SportSphere.openModal('uploadSprint')" class="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all">
            <span class="material-symbols-outlined text-base">cloud_upload</span>
            Upload New Sprint Data
          </button>
        </div>
      </div>

      <!-- FEATURED NEARBY COMPETITIONS -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-black text-slate-900">Featured Competitions Near You</h2>
            <p class="text-xs text-slate-500">Sorted by distance from ${state.userLocation.cityName}</p>
          </div>
          <button onclick="window.SportSphere.switchTab('discover')" class="text-xs font-bold text-blue-600 hover:text-blue-700">
            View All (${state.competitions.length}) →
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          ${topComps.map(comp => renderCompetitionCard(comp)).join('')}
        </div>
      </div>
    </div>
  `;
}

function setupOverviewEvents() {}

// ==========================================
// VIEW: HIGHLIGHTS (SEPARATE SECTION)
// ==========================================
function getHighlightsHTML() {
  const highlights = state.highlights || [];

  return `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <!-- Highlight Header & Post Trigger -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-2xl">video_library</span>
            <h1 class="text-2xl font-black text-slate-900">Athletic Highlights & Match Reels</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">Watch verified race finishes, jump smashes, and training clips shared by varsity athletes.</p>
        </div>

        <button onclick="window.SportSphere.openModal('postHighlight')" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-transform hover:scale-105">
          <span class="material-symbols-outlined text-base">add_circle</span>
          Post New Highlight
        </button>
      </div>

      <!-- Highlights Feed -->
      <div class="space-y-6">
        ${highlights.map(hl => `
          <div class="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden hover-card-elevate">
            <!-- Author Header -->
            <div class="p-5 flex items-center justify-between border-b border-slate-100">
              <div class="flex items-center gap-3">
                <img src="${hl.author.avatar}" alt="${hl.author.name}" class="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs" />
                <div>
                  <div class="flex items-center gap-1.5">
                    <h3 class="text-sm font-bold text-slate-900">${hl.author.name}</h3>
                    ${hl.author.verified ? `<span class="material-symbols-outlined text-blue-600 text-base" title="Verified Athlete">verified</span>` : ''}
                    <span class="text-xs text-slate-400 font-medium">${hl.author.handle}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs text-emerald-600 font-semibold">${hl.author.role}</span>
                    <span class="text-slate-300">•</span>
                    <span class="text-[11px] text-slate-400">${hl.timestamp}</span>
                  </div>
                </div>
              </div>

              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                ${hl.sport}
              </span>
            </div>

            <!-- Content Title & Caption -->
            <div class="px-5 pt-4 pb-2 space-y-2">
              <h2 class="text-base font-bold text-slate-900">${hl.title}</h2>
              <p class="text-xs text-slate-600 leading-relaxed">${hl.caption}</p>
            </div>

            <!-- Media Banner (Video/Image showcase) -->
            <div class="relative bg-slate-900 max-h-[460px] overflow-hidden flex items-center justify-center group cursor-pointer" onclick="window.SportSphere.playHighlightMedia('${hl.id}')">
              <img src="${hl.mediaUrl}" alt="${hl.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
              <div class="absolute inset-0 bg-slate-950/30 flex items-center justify-center group-hover:bg-slate-950/15 transition-all">
                <div class="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-115">
                  <span class="material-symbols-outlined text-3xl text-emerald-600">play_arrow</span>
                </div>
              </div>

              <!-- Stat Overlay Tag -->
              <div class="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                <span class="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  ⚡ ${hl.stats.timing}
                </span>
                <span class="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-medium border border-white/20">
                  ${hl.stats.splitTime}
                </span>
              </div>
            </div>

            <!-- Engagement & Actions Bar -->
            <div class="p-4 px-5 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
              <div class="flex items-center gap-6">
                <!-- Like Button -->
                <button onclick="window.SportSphere.likeHighlight('${hl.id}')" class="flex items-center gap-1.5 font-bold hover:text-red-500 transition-colors ${hl.hasLiked ? 'text-red-500' : 'text-slate-600'}">
                  <span class="material-symbols-outlined text-xl ${hl.hasLiked ? 'material-symbols-fill' : ''}">favorite</span>
                  <span>${hl.likes}</span>
                </button>

                <!-- Comment Button -->
                <button onclick="window.SportSphere.openHighlightComments('${hl.id}')" class="flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  <span class="material-symbols-outlined text-xl">chat_bubble</span>
                  <span>${hl.commentsCount}</span>
                </button>

                <!-- Share Button -->
                <button onclick="window.SportSphere.shareHighlight('${hl.id}')" class="flex items-center gap-1.5 font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                  <span class="material-symbols-outlined text-xl">share</span>
                  <span>${hl.shares}</span>
                </button>
              </div>

              <div class="text-[11px] font-semibold text-slate-400">
                ${hl.views} total views
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupHighlightsEvents() {}

// ==========================================
// VIEW: PROFILE (SEPARATE LINKEDIN-STYLE SECTION)
// ==========================================
function getProfileHTML() {
  const profile = state.athleteProfile?.profile || {};
  const experiences = state.athleteProfile?.experience || [];
  const educations = state.athleteProfile?.education || [];
  const skills = state.athleteProfile?.skills || [];
  const recommendations = state.athleteProfile?.recommendations || [];
  const achievements = state.athleteProfile?.achievements || [];

  return `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      <!-- TOP PROFILE HERO CARD (LINKEDIN STYLE) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden relative">
        <!-- Banner Image -->
        <div class="h-48 sm:h-64 bg-cover bg-center relative" style="background-image: url('${profile.banner || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80'}');">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
          
          <button onclick="window.SportSphere.showToast('Banner upload modal opened')" class="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-md">
            <span class="material-symbols-outlined text-base">photo_camera</span>
          </button>
        </div>

        <!-- Profile Content -->
        <div class="px-6 sm:px-8 pb-8 pt-0 relative">
          <!-- Avatar & Status -->
          <div class="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div class="relative inline-block">
              <img src="${profile.avatar}" alt="${profile.name}" class="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl" />
              <span class="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Active on circuit"></span>
            </div>

            <!-- Top Actions: Share CV & PDF -->
            <div class="flex flex-wrap items-center gap-2.5">
              <button onclick="window.SportSphere.shareProfileCV()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all">
                <span class="material-symbols-outlined text-base">share</span>
                Share Sports CV
              </button>
              <button onclick="window.print()" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all">
                <span class="material-symbols-outlined text-base">download</span>
                Download Resume (PDF)
              </button>
              <button onclick="window.SportSphere.openModal('athleteCv')" class="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all" title="View Full Dossier">
                <span class="material-symbols-outlined text-base">more_horiz</span>
              </button>
            </div>
          </div>

          <!-- Name, Headline & Location -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900">${profile.name}</h1>
              <span class="material-symbols-outlined text-blue-600 text-xl" title="AFI Verified Athlete">verified</span>
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">He/Him</span>
            </div>

            <p class="text-sm font-semibold text-slate-700 leading-snug max-w-3xl">
              ${profile.headline}
            </p>

            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-slate-400">school</span>
                ${profile.institution}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-slate-400">location_on</span>
                ${profile.location}
              </span>
              <span class="text-blue-600 font-bold hover:underline cursor-pointer" onclick="window.SportSphere.showToast('Sports network connections: 840+')">
                ${profile.connectionsCount}
              </span>
            </div>
          </div>

          <!-- "Open To Scouting" Badge (LinkedIn Open to Work style) -->
          <div class="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Open to Scouting & Trials
                </span>
                <span class="text-xs font-bold text-slate-900">National Pro & University Circuits</span>
              </div>
              <p class="text-xs text-slate-600 font-medium">
                Roles: ${(profile.scoutingRoles || []).join(' • ')}
              </p>
            </div>

            <button onclick="window.SportSphere.showToast('Recruitment inquiry channel opened!')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm self-start sm:self-auto shrink-0">
              Scout Athlete
            </button>
          </div>

          <!-- Key Athletic Stats Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 text-[10px] font-bold uppercase">Personal Best</span>
              <div class="text-lg font-black text-blue-600 font-mono mt-0.5">${profile.personalBest}</div>
              <span class="text-[10px] text-slate-500">400m Flat Timing</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 text-[10px] font-bold uppercase">Scout Index</span>
              <div class="text-lg font-black text-emerald-600 font-mono mt-0.5">${profile.scoutIndex}/100</div>
              <span class="text-[10px] text-slate-500">Top 2% Varsity Sprinters</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 text-[10px] font-bold uppercase">Reaction Time</span>
              <div class="text-lg font-black text-slate-900 font-mono mt-0.5">${profile.reactionTime}</div>
              <span class="text-[10px] text-slate-500">Block Clearance Speed</span>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-slate-400 text-[10px] font-bold uppercase">Medals Record</span>
              <div class="text-lg font-black text-amber-500 font-mono mt-0.5">${achievements.length} Verified</div>
              <span class="text-[10px] text-slate-500">AIU & State Accreditations</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ABOUT SECTION -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <h2 class="text-lg font-black text-slate-900">About & Athletic Summary</h2>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          ${profile.bio}
        </p>
      </div>

      <!-- ATHLETIC CAREER & EXPERIENCE -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-black text-slate-900">Athletic Career & Leadership Experience</h2>
          <span class="text-xs text-blue-600 font-bold">${experiences.length} Positions</span>
        </div>

        <div class="space-y-6">
          ${experiences.map(exp => `
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <span class="material-symbols-outlined text-2xl">sports_score</span>
              </div>
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-slate-900">${exp.role}</h3>
                <p class="text-xs font-semibold text-slate-700">${exp.organization}</p>
                <p class="text-[11px] text-slate-400 font-medium">${exp.duration} • ${exp.location}</p>
                <p class="text-xs text-slate-600 pt-1 leading-relaxed">${exp.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- EDUCATION SECTION -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 class="text-lg font-black text-slate-900">Education & Academic Record</h2>
        <div class="space-y-4">
          ${educations.map(edu => `
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <span class="material-symbols-outlined text-2xl">school</span>
              </div>
              <div class="space-y-1">
                <h3 class="text-sm font-bold text-slate-900">${edu.degree}</h3>
                <p class="text-xs font-semibold text-slate-700">${edu.institution}</p>
                <p class="text-[11px] text-slate-400">${edu.duration} • ${edu.grade}</p>
                <p class="text-xs text-slate-600 pt-1">${edu.activities}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SKILLS & ENDORSEMENTS -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-black text-slate-900">Athletic Skills & Coach Endorsements</h2>
          <span class="text-xs text-slate-400 font-semibold">${skills.length} Certified Attributes</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${skills.map((sk, idx) => `
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <h4 class="text-xs font-bold text-slate-900">${sk.name}</h4>
                <p class="text-[10px] text-emerald-600 font-bold mt-0.5">${sk.endorsements} endorsements</p>
              </div>

              <button onclick="window.SportSphere.endorseSkill(${idx})" class="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs transition-all active:scale-95">
                + Endorse
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RECOMMENDATIONS SECTION -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 class="text-lg font-black text-slate-900">Coach & Athletic Faculty Recommendations</h2>

        <div class="space-y-6 divide-y divide-slate-100">
          ${recommendations.map(rec => `
            <div class="pt-6 first:pt-0 space-y-3">
              <div class="flex items-center gap-3">
                <img src="${rec.avatar}" alt="${rec.author}" class="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                <div>
                  <h3 class="text-xs font-bold text-slate-900">${rec.author}</h3>
                  <p class="text-[11px] text-blue-600 font-semibold">${rec.role}</p>
                  <p class="text-[10px] text-slate-400">${rec.relation}</p>
                </div>
              </div>
              <p class="text-xs text-slate-600 italic leading-relaxed pl-4 border-l-2 border-blue-500">
                "${rec.text}"
              </p>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

function setupProfileEvents() {}

// ==========================================
// VIEW: CATEGORIES (SEPARATE DEDICATED SECTION)
// ==========================================
function getCategoriesHTML() {
  const categories = state.categories || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600 text-2xl">category</span>
            <h1 class="text-2xl font-black text-slate-900">Sports Categories & Disciplines</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">Browse university championships, state trials, and club meets by athletic discipline.</p>
        </div>

        <button onclick="window.SportSphere.switchTab('discover')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">
          Explore All Competitions
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${categories.map(cat => `
          <div class="bg-white rounded-3xl border border-slate-200 shadow-xs hover-card-elevate overflow-hidden flex flex-col justify-between">
            <div>
              <div class="relative h-44 overflow-hidden bg-slate-900">
                <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                <div class="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-blue-600/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                  <span class="material-symbols-outlined text-xl">${cat.icon}</span>
                </div>

                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <h2 class="text-lg font-black tracking-tight">${cat.name}</h2>
                  <p class="text-xs text-slate-300 font-medium">${cat.tagline}</p>
                </div>
              </div>

              <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-100">
                  <div>
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Active Tournaments</span>
                    <span class="text-base font-black text-blue-600">${cat.activeTournaments} Events</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 font-bold uppercase block">Registered Athletes</span>
                    <span class="text-base font-black text-slate-900">${cat.registeredAthletes}+</span>
                  </div>
                </div>

                <div>
                  <span class="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Top Venues</span>
                  <p class="text-xs text-slate-700 font-semibold flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm text-blue-600">location_on</span>
                    ${cat.topVenue}
                  </p>
                </div>

                <div>
                  <span class="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Key Events</span>
                  <div class="flex flex-wrap gap-1.5">
                    ${(cat.popularEvents || []).map(ev => `
                      <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                        ${ev}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 pt-0">
              <button onclick="window.SportSphere.openCategory('${cat.slug}')" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                <span>Browse ${cat.slug} Tournaments</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupCategoriesEvents() {}

// Category click handler
export function openCategory(categorySlug) {
  state.selectedCategory = categorySlug;
  switchTab('discover');
  showToast(`Filtered tournaments for ${categorySlug}`, 'info');
}

// Endorse skill interaction
export function endorseSkill(idx) {
  if (state.athleteProfile?.skills?.[idx]) {
    state.athleteProfile.skills[idx].endorsements += 1;
    showToast(`You endorsed "${state.athleteProfile.skills[idx].name}"!`, 'info');
    renderActiveTab();
  }
}

// Share profile CV
export function shareProfileCV() {
  const profileUrl = `https://sportsphere.io/athlete/${state.athleteProfile?.profile?.handle || 'student-athlete'}`;
  navigator.clipboard?.writeText(profileUrl);
  showToast(`Sports CV Link copied to clipboard! (${profileUrl})`, 'info');
}

// Highlight interactions
export function likeHighlight(hlId) {
  const hl = state.highlights.find(h => h.id === hlId);
  if (!hl) return;

  if (hl.hasLiked) {
    hl.likes -= 1;
    hl.hasLiked = false;
  } else {
    hl.likes += 1;
    hl.hasLiked = true;
    showToast('Highlight liked! Added to your sports favorites.', 'info');
  }
  renderActiveTab();
}

export function shareHighlight(hlId) {
  const hl = state.highlights.find(h => h.id === hlId);
  if (hl) {
    hl.shares += 1;
    showToast(`Highlight clip "${hl.title}" link copied to clipboard!`, 'info');
    renderActiveTab();
  }
}

export function playHighlightMedia(hlId) {
  showToast('Playing full high-resolution photofinish reel in full-screen player', 'info');
}

export function openHighlightComments(hlId) {
  showToast('Comments thread loaded (34 varsity sprinters discussing pacing)', 'info');
}

// ==========================================
// VIEW: DISCOVER
// ==========================================
function getDiscoverHTML() {
  const categories = ['all', 'Athletics', 'Football', 'Badminton', 'Swimming', 'Volleyball', 'Basketball'];
  const tiers = ['all', 'University', 'State', 'National', 'District'];

  // Filter competitions
  let filtered = state.competitions.filter(comp => {
    const matchesCat = state.selectedCategory === 'all' || comp.category === state.selectedCategory;
    const matchesTier = state.selectedTier === 'all' || comp.circuitTier === state.selectedTier;
    const matchesSearch = !state.searchQuery || 
      comp.title.toLowerCase().includes(state.searchQuery) ||
      comp.city.toLowerCase().includes(state.searchQuery) ||
      comp.venue.toLowerCase().includes(state.searchQuery) ||
      comp.category.toLowerCase().includes(state.searchQuery);
    return matchesCat && matchesTier && matchesSearch;
  });

  // Sort
  if (state.sortBy === 'distance') {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (state.sortBy === 'match') {
    filtered.sort((a, b) => b.matchScore - a.matchScore);
  } else if (state.sortBy === 'slots') {
    filtered.sort((a, b) => (b.maxSlots - b.registeredCount) - (a.maxSlots - a.registeredCount));
  }

  return `
    <div class="space-y-6 animate-fade-in">
      <!-- Top Filter Bar -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Explore Sports Tournaments</h1>
            <p class="text-xs text-slate-500">Discover verified championships, AIU varsity meets, and district trials.</p>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <span class="text-xs font-bold text-slate-500">Sort by:</span>
            <select id="sort-select" class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="match" ${state.sortBy === 'match' ? 'selected' : ''}>Match Score (High to Low)</option>
              <option value="distance" ${state.sortBy === 'distance' ? 'selected' : ''}>Distance (Nearest First)</option>
              <option value="slots" ${state.sortBy === 'slots' ? 'selected' : ''}>Available Slots</option>
            </select>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span class="text-xs font-bold text-slate-400 mr-1">Discipline:</span>
          ${categories.map(cat => `
            <button onclick="window.SportSphere.setFilterCategory('${cat}')" class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${state.selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
              ${cat === 'all' ? 'All Disciplines' : cat}
            </button>
          `).join('')}
        </div>

        <!-- Circuit Tier Filter Pills -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-slate-400 mr-1">Circuit Tier:</span>
          ${tiers.map(tier => `
            <button onclick="window.SportSphere.setFilterTier('${tier}')" class="px-3 py-1 rounded-full text-xs font-medium transition-all ${state.selectedTier === tier ? 'bg-slate-900 text-white font-bold' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}">
              ${tier === 'all' ? 'All Tiers' : tier}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Results Grid -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-slate-500">Showing ${filtered.length} competitions</span>
          ${state.searchQuery ? `<span class="text-xs text-blue-600 font-semibold">Search query: "${state.searchQuery}"</span>` : ''}
        </div>

        ${filtered.length === 0 ? `
          <div class="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
            <h3 class="text-base font-bold text-slate-700">No competitions found</h3>
            <p class="text-xs text-slate-400 mt-1">Try resetting the category filter or searching for another term.</p>
            <button onclick="window.SportSphere.setFilterCategory('all'); window.SportSphere.setFilterTier('all');" class="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
              Reset Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(comp => renderCompetitionCard(comp)).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

function setupDiscoverEvents() {
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderDiscoverView();
    });
  }
}

function renderDiscoverView() {
  const main = document.getElementById('main-content-view');
  if (main && state.activeTab === 'discover') {
    main.innerHTML = getDiscoverHTML();
    setupDiscoverEvents();
  }
}

// Render reusable competition card
function renderCompetitionCard(comp) {
  const isSaved = state.savedCompetitions.has(comp.id);
  const slotsPercent = Math.round((comp.registeredCount / comp.maxSlots) * 100);

  return `
    <div class="group flex flex-col justify-between bg-white rounded-3xl border border-slate-200 shadow-xs hover-card-elevate overflow-hidden transition-all duration-300">
      <div>
        <!-- Card Image & Badges -->
        <div class="relative h-44 overflow-hidden bg-slate-100">
          <img src="${comp.image}" alt="${comp.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

          <!-- Top row tags -->
          <div class="absolute top-3 left-3 flex items-center gap-1.5">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
              ${comp.category}
            </span>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-md">
              ${comp.circuitTier}
            </span>
          </div>

          <!-- Bookmark toggle -->
          <button onclick="window.SportSphere.toggleBookmark('${comp.id}', event)" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md backdrop-blur-md transition-transform active:scale-90">
            <span class="material-symbols-outlined text-base ${isSaved ? 'text-amber-500 material-symbols-fill' : 'text-slate-500'}">
              ${isSaved ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          <!-- Match Score & Distance bottom bar -->
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <span class="flex items-center gap-1 text-[11px] bg-slate-900/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
              <span class="material-symbols-outlined text-xs text-blue-400">location_on</span>
              ${comp.distanceKm} km away
            </span>
            <span class="flex items-center gap-1 text-[11px] bg-emerald-600/90 px-2 py-0.5 rounded-md font-bold">
              ${comp.matchScore}% Match
            </span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>${comp.organizer}</span>
            <span class="text-amber-600 font-bold">${comp.deadline}</span>
          </div>

          <h3 class="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            ${comp.title}
          </h3>

          <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            ${comp.description}
          </p>

          <!-- Slots progress -->
          <div class="space-y-1 pt-1">
            <div class="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Slots: ${comp.registeredCount} / ${comp.maxSlots}</span>
              <span>${slotsPercent}%</span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-blue-600 rounded-full" style="width: ${slotsPercent}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
        <div>
          <span class="text-[10px] text-slate-400 uppercase font-bold">Entry Fee</span>
          <div class="text-xs font-black text-slate-900">${comp.entryFee}</div>
        </div>

        <button onclick="window.SportSphere.openRegistrationModal('${comp.id}')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:shadow-md">
          Register Now
        </button>
      </div>
    </div>
  `;
}

// ==========================================
// VIEW: NEARBY MAP
// ==========================================
function getMapHTML() {
  const selectedVenue = state.venues.find(v => v.id === state.selectedVenueId) || state.venues[0];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Nearby Stadiums & Sports Hubs</h1>
          <p class="text-xs text-slate-500">Explore accredited athletics arenas, turf pitches, and synthetic tracks relative to ${state.userLocation.cityName}.</p>
        </div>

        <button onclick="window.SportSphere.handleGPSDetection()" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">
          <span class="material-symbols-outlined text-base">my_location</span>
          Refresh Live GPS
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Interactive Map Visual Canvas -->
        <div class="lg:col-span-2 bg-slate-900 rounded-3xl p-6 relative overflow-hidden min-h-[460px] shadow-xl flex flex-col justify-between text-white border border-slate-800">
          <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#38bdf8 1px, transparent 1px); background-size: 24px 24px;"></div>
          
          <div class="relative z-10 flex items-center justify-between">
            <div class="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="font-bold">Live GPS Grid: ${state.userLocation.cityName}</span>
            </div>

            <span class="text-xs text-slate-400 font-mono">Radial Range: 30 km</span>
          </div>

          <!-- Stadium Pins on Map -->
          <div class="relative z-10 w-full h-[300px] flex items-center justify-center">
            ${state.venues.map(v => {
              const isSelected = v.id === selectedVenue.id;
              return `
                <button onclick="window.SportSphere.selectVenue('${v.id}')" class="absolute transition-all transform hover:scale-125" style="left: ${v.coords.x}%; top: ${v.coords.y}%;">
                  <div class="flex flex-col items-center">
                    <div class="px-2 py-0.5 rounded-md text-[10px] font-bold ${isSelected ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-800/90 text-slate-300 border border-slate-700'} mb-1 whitespace-nowrap">
                      ${v.name.split(' ')[0]} • ${v.distanceNum}km
                    </div>
                    <span class="material-symbols-outlined text-2xl ${isSelected ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' : 'text-slate-400'}">
                      location_on
                    </span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          <div class="relative z-10 flex items-center justify-between text-xs text-slate-400">
            <span>Click any stadium node to inspect track surface & facilities</span>
            <span class="text-blue-400 font-semibold">${state.venues.length} Facilities in Region</span>
          </div>
        </div>

        <!-- Selected Stadium Card -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div class="space-y-4">
            <div class="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
              <img src="${selectedVenue.image}" alt="${selectedVenue.name}" class="w-full h-full object-cover" />
              <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-md">
                ${selectedVenue.category}
              </div>
              <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                ${selectedVenue.distance}
              </div>
            </div>

            <div>
              <h2 class="text-lg font-bold text-slate-900">${selectedVenue.name}</h2>
              <p class="text-xs text-slate-500 mt-1">${selectedVenue.address}</p>
            </div>

            <div>
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facility Highlights</h3>
              <div class="flex flex-wrap gap-1.5">
                ${selectedVenue.features.map(f => `
                  <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                    ${f}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>

          <button onclick="window.SportSphere.switchTab('discover')" class="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all">
            View ${selectedVenue.eventsCount} Competitions at this Venue
          </button>
        </div>
      </div>
    </div>
  `;
}

function setupMapEvents() {}

// ==========================================
// VIEW: REGISTRATIONS
// ==========================================
function getRegistrationsHTML() {
  const regs = state.athleteProfile?.registrations || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">My Competition Registrations & Bib Passes</h1>
          <p class="text-xs text-slate-500">Official tournament entry records, verification statuses, and digital race credentials.</p>
        </div>

        <button onclick="window.SportSphere.switchTab('discover')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">
          <span class="material-symbols-outlined text-base">add</span>
          New Entry
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${regs.map(reg => `
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover-card-elevate flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${reg.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${reg.status}
                </span>
                <span class="text-xs font-mono text-slate-400">Ref: ${reg.id}</span>
              </div>

              <h2 class="text-base font-bold text-slate-900 leading-snug">${reg.competitionTitle}</h2>
              <p class="text-xs font-semibold text-blue-600">${reg.category}</p>

              <div class="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 text-slate-600">
                <div>
                  <span class="text-[10px] text-slate-400 block">Race Date</span>
                  <span class="font-bold text-slate-800">${reg.eventDate}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block">Registration Fee</span>
                  <span class="font-bold text-slate-800">${reg.fee}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block">Assigned Bib</span>
                  <span class="font-bold text-blue-600 font-mono">${reg.bibNumber || 'Pending'}</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block">Lane / Heat</span>
                  <span class="font-bold text-slate-800">${reg.laneInfo || 'Heat 1'}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500">📍 ${reg.venue}</p>
            </div>

            <div class="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 mt-4">
              <button onclick="window.SportSphere.showToast('Digital Bib Pass downloaded for ${reg.bibNumber || 'entry'}')" class="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                <span class="material-symbols-outlined text-base">download</span>
                Download Bib Ticket
              </button>
              <button onclick="window.SportSphere.switchTab('profile')" class="text-xs text-slate-500 hover:text-slate-900 font-semibold">
                Verify Credentials
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupRegistrationsEvents() {}



// ==========================================
// VIEW: CALENDAR
// ==========================================
function getCalendarHTML() {
  const events = state.athleteProfile?.upcomingEvents || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-slate-900">Sprint & Tournament Calendar</h1>
        <p class="text-xs text-slate-500">Upcoming race days, selection trials, and technical inspection deadlines.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar Grid -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-base font-bold text-slate-900">October - November 2025</h2>
            <div class="flex items-center gap-2">
              <button class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <span class="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <span class="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>

          <div class="grid grid-cols-7 gap-2 text-xs">
            ${Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const hasRace = day === 28;
              return `
                <div class="h-16 p-1.5 rounded-xl border ${hasRace ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-slate-50'} flex flex-col justify-between text-left">
                  <span class="font-bold ${hasRace ? 'text-blue-600' : 'text-slate-700'}">${day}</span>
                  ${hasRace ? `<span class="text-[9px] bg-blue-600 text-white rounded px-1 py-0.5 font-bold truncate">State Trials</span>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Event Details List -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 class="text-base font-bold text-slate-900">Upcoming Timeline</h2>
          <div class="space-y-3">
            ${events.map(ev => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">${ev.dateStr}</span>
                <h3 class="text-sm font-bold text-slate-900">${ev.title}</h3>
                <p class="text-xs text-slate-500">${ev.venue}</p>
                <p class="text-xs text-emerald-600 font-semibold">${ev.callTime}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupCalendarEvents() {}

// ==========================================
// VIEW: ACHIEVEMENTS
// ==========================================
function getAchievementsHTML() {
  const achievements = state.athleteProfile?.achievements || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Verified Medals & Accreditations</h1>
          <p class="text-xs text-slate-500">Official certificates sanctioned by AIU, AFI, and Karnataka Athletics Association.</p>
        </div>

        <button onclick="window.SportSphere.switchTab('profile')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">
          <span class="material-symbols-outlined text-base">download</span>
          Export Athlete Dossier
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${achievements.map(ach => `
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover-card-elevate flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl">${ach.icon}</span>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">${ach.tier}</span>
              </div>

              <h2 class="text-base font-bold text-slate-900 leading-snug">${ach.title}</h2>
              <p class="text-xs text-slate-500 leading-relaxed">${ach.description}</p>

              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Certified Stat</span>
                <span class="font-mono font-bold text-blue-600 text-sm">${ach.recordStat}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-semibold flex items-center justify-between mt-4">
              <span>Verified: ${ach.verifiedBy}</span>
              <span>${ach.year}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupAchievementsEvents() {}

// ==========================================
// VIEW: ANALYTICS
// ==========================================
function getAnalyticsHTML() {
  const splits = state.athleteProfile?.splits || [];
  const progression = state.athleteProfile?.progression || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Sprint Biometrics & Velocity Curves</h1>
          <p class="text-xs text-slate-500">Biomechanical photofinish velocity, cadence, and split execution indices.</p>
        </div>

        <button onclick="window.SportSphere.openModal('uploadSprint')" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700">
          <span class="material-symbols-outlined text-base">upload_file</span>
          Upload Split Run
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        ${splits.map((s, idx) => `
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover-card-elevate">
            <span class="text-[10px] font-mono uppercase font-bold text-slate-400">Split ${idx + 1}</span>
            <div class="text-2xl font-black text-blue-600 my-1">${s.time}</div>
            <p class="text-xs font-semibold text-slate-700">${s.segment}</p>
            <div class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Speed: ${s.speed}</span>
              <span class="font-bold text-emerald-600">${s.effort} Output</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Progression Timeline -->
      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h2 class="text-base font-bold text-slate-900 mb-4">Season Pacing Progression</h2>
        <div class="divide-y divide-slate-100">
          ${progression.map((p, idx) => `
            <div class="py-3 flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-800">${p.meet}</span>
              <div class="flex items-center gap-4">
                <span class="font-mono font-bold text-blue-600 text-sm">${p.time}</span>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">${p.rank}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function setupAnalyticsEvents() {}

// ==========================================
// VIEW: SCHOLARSHIPS
// ==========================================
function getScholarshipsHTML() {
  const schs = state.scholarships || [];

  return `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-black text-slate-900">National Sports Scholarships & Grants</h1>
        <p class="text-xs text-slate-500">Fellowships and training grants verified for high-performing collegiate athletes.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${schs.map(sch => `
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover-card-elevate flex flex-col justify-between">
            <div class="space-y-4">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">${sch.status}</span>
              <h2 class="text-base font-bold text-slate-900">${sch.title}</h2>
              <p class="text-xs text-blue-600 font-semibold">${sch.provider}</p>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <span class="text-slate-400 text-[10px] font-bold uppercase">Grant Award</span>
                <div class="text-sm font-black text-slate-900">${sch.grant}</div>
              </div>

              <div class="text-xs text-slate-600 space-y-1">
                <span class="text-slate-400 font-bold">Eligibility:</span>
                <p class="text-slate-700">${sch.eligibility}</p>
              </div>
            </div>

            <button onclick="window.SportSphere.showToast('Application drafted with your verified Athlete CV!')" class="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all">
              Apply via Sports CV
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupScholarshipsEvents() {}

// ==========================================
// VIEW: SAVED
// ==========================================
function getSavedHTML() {
  const savedComps = state.competitions.filter(c => state.savedCompetitions.has(c.id));

  return `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Saved Competitions (${savedComps.length})</h1>
          <p class="text-xs text-slate-500">Bookmarked tournaments to track before deadlines expire.</p>
        </div>
      </div>

      ${savedComps.length === 0 ? `
        <div class="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">bookmark_border</span>
          <h3 class="text-base font-bold text-slate-700">No saved competitions yet</h3>
          <p class="text-xs text-slate-400 mt-1">Click the bookmark icon on any tournament card to save it here.</p>
          <button onclick="window.SportSphere.switchTab('discover')" class="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
            Explore Tournaments
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${savedComps.map(comp => renderCompetitionCard(comp)).join('')}
        </div>
      `}
    </div>
  `;
}

function setupSavedEvents() {}

// ==========================================
// MODAL CONTROLLERS & ACTIONS
// ==========================================

// Open Competition Registration Modal
export function openRegistrationModal(compId) {
  const comp = state.competitions.find(c => c.id === compId);
  if (!comp) return;

  state.activeModalComp = comp;
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-slide-up space-y-5">
        <button onclick="window.SportSphere.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
          <span class="material-symbols-outlined">close</span>
        </button>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">app_registration</span>
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">${comp.category} Circuit</span>
            <h2 class="text-lg font-black text-slate-900">${comp.title}</h2>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-500">Date Range:</span>
            <span class="font-bold text-slate-800">${comp.dateRange}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Venue:</span>
            <span class="font-bold text-slate-800">${comp.venue}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Registration Fee:</span>
            <span class="font-bold text-blue-600">${comp.entryFee}</span>
          </div>
        </div>

        <form id="registration-form" onsubmit="window.SportSphere.handleRegistrationSubmit(event)" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Athlete / Squad Representative Name</label>
            <input type="text" id="reg-athlete-name" value="${state.athleteProfile?.profile?.name || 'Student Athlete'}" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Varsity ID / AFI UID</label>
            <input type="text" id="reg-athlete-uid" value="BCU-ATH-0941" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Event Category / Division</label>
            <select id="reg-category" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="400m Varsity Men (Individual)">400m Varsity Men (Individual)</option>
              <option value="100m Dash (Individual)">100m Dash (Individual)</option>
              <option value="200m Open Sprint">200m Open Sprint</option>
            </select>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="reg-waiver" required checked class="rounded text-blue-600 focus:ring-blue-500" />
            <label for="reg-waiver" class="text-slate-600">I confirm adherence to AIU medical eligibility and anti-doping regulations.</label>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3">
            <button type="button" onclick="window.SportSphere.closeModal()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" id="reg-submit-btn" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md">
              Confirm & Submit Registration (Fetch API)
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Handle Registration Submit using native Fetch API
export async function handleRegistrationSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('reg-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting via Fetch API...';
  }

  const payload = {
    competitionId: state.activeModalComp.id,
    competitionTitle: state.activeModalComp.title,
    venue: state.activeModalComp.venue,
    eventDate: state.activeModalComp.dateRange,
    category: document.getElementById('reg-category')?.value,
    athleteName: document.getElementById('reg-athlete-name')?.value,
    athleteUid: document.getElementById('reg-athlete-uid')?.value,
    fee: state.activeModalComp.entryFee
  };

  try {
    const result = await SportSphereAPI.submitRegistration(payload);
    if (result.success) {
      state.athleteProfile.registrations.unshift(result.data);
      closeModal();
      showToast(`🎉 Registration confirmed for ${payload.competitionTitle}! Bib assigned: ${result.data.bibNumber}`, 'info');
      switchTab('registrations');
    }
  } catch (err) {
    showToast('Failed to submit registration. Please try again.', 'error');
  }
}

// Open General Modals
export function openModal(type) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  if (type === 'postHighlight') {
    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-slide-up space-y-4 max-h-[90vh] overflow-y-auto">
          <button onclick="window.SportSphere.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">video_call</span>
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Athlete Network</span>
              <h2 class="text-lg font-black text-slate-900">Post New Athletic Highlight</h2>
            </div>
          </div>

          <form onsubmit="window.SportSphere.handleHighlightPostSubmit(event)" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Highlight Title</label>
              <input type="text" id="hl-title" placeholder="e.g. Sub-47s 400m Finish or Winning Spike" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Sport Category</label>
              <select id="hl-sport" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="Track & Field">Track & Field / Athletics</option>
                <option value="Football">Football / Soccer</option>
                <option value="Badminton">Badminton</option>
                <option value="Aquatics">Aquatics / Swimming</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Basketball">Basketball</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Caption & Training Context</label>
              <textarea id="hl-caption" rows="3" placeholder="Share workout details, split velocities, or tournament match context..." required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Key Verified Stat (e.g. PB / Split)</label>
                <input type="text" id="hl-stat-timing" placeholder="e.g. 46.82s (PB)" class="w-full px-3 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Cadence / Split Stat</label>
                <input type="text" id="hl-stat-split" placeholder="e.g. Split 4: 12.60s" class="w-full px-3 py-2 rounded-xl border border-slate-200" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Media URL or Upload Preview</label>
              <input type="text" id="hl-media-url" value="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80" class="w-full px-3 py-2 rounded-xl border border-slate-200" />
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button" onclick="window.SportSphere.closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" id="hl-submit-btn" class="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md">
                Publish Reel (Fetch API)
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  } else if (type === 'athleteCv') {
    switchTab('profile');
  } else if (type === 'trialTime') {
    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-slide-up space-y-4">
          <button onclick="window.SportSphere.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">timer</span>
            </div>
            <h2 class="text-base font-black text-slate-900">Log Official Trial Time</h2>
          </div>

          <form onsubmit="window.SportSphere.handleTrialTimeSubmit(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Track Event</label>
              <select id="trial-event" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                <option value="400m Flat">400m Flat</option>
                <option value="200m Flat">200m Flat</option>
                <option value="100m Dash">100m Dash</option>
                <option value="4x400m Relay Leg">4x400m Relay Leg</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Logged Time (Seconds)</label>
              <input type="text" id="trial-time" placeholder="e.g. 46.95s" required class="w-full px-3 py-2 rounded-xl border border-slate-200" />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Timing Mechanism</label>
              <select id="trial-type" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                <option value="Omega Electronic Gates (FAT)">Omega Electronic Gates (FAT)</option>
                <option value="Hand-Timed (Certified Official)">Hand-Timed (Certified Official)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Coach / Official Sign-off ID</label>
              <input type="text" id="trial-coach" value="COACH-AFI-7721" required class="w-full px-3 py-2 rounded-xl border border-slate-200" />
            </div>

            <button type="submit" class="mt-2 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm">
              Submit via Fetch API
            </button>
          </form>
        </div>
      </div>
    `;
  } else if (type === 'uploadSprint') {
    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-slide-up space-y-4">
          <button onclick="window.SportSphere.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-700">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">cloud_upload</span>
            </div>
            <h2 class="text-base font-black text-slate-900">Upload Sprint Biometrics & Video</h2>
          </div>

          <div class="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all" onclick="document.getElementById('sprint-file-input').click()">
            <span class="material-symbols-outlined text-3xl text-slate-400">video_file</span>
            <p class="text-xs font-bold text-slate-700 mt-2">Click to select 400m photofinish video or telemetry</p>
            <p class="text-[10px] text-slate-400">Supports .mp4, .fit, .csv split files</p>
            <input type="file" id="sprint-file-input" class="hidden" onchange="window.SportSphere.handleFileSelect(event)" />
          </div>

          <button onclick="window.SportSphere.handleBiometricUploadSubmit()" class="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm">
            Process Biometrics (Fetch API)
          </button>
        </div>
      </div>
    `;
  }
}

export function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) modalContainer.innerHTML = '';
}

// Handle posting highlight
export async function handleHighlightPostSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('hl-title')?.value;
  const sport = document.getElementById('hl-sport')?.value;
  const caption = document.getElementById('hl-caption')?.value;
  const timingStat = document.getElementById('hl-stat-timing')?.value;
  const splitStat = document.getElementById('hl-stat-split')?.value;
  const mediaUrl = document.getElementById('hl-media-url')?.value;

  const result = await SportSphereAPI.postHighlight({
    title,
    sport,
    caption,
    timingStat,
    splitStat,
    mediaUrl
  });

  if (result.success) {
    state.highlights.unshift(result.data);
    closeModal();
    showToast(result.message, 'info');
    renderActiveTab();
  }
}

export async function handleTrialTimeSubmit(e) {
  e.preventDefault();
  const event = document.getElementById('trial-event')?.value;
  const time = document.getElementById('trial-time')?.value;
  const result = await SportSphereAPI.submitTrialTime({ event, time });
  closeModal();
  showToast(result.message, 'info');
}

export function handleFileSelect(e) {
  if (e.target.files.length > 0) {
    showToast(`File selected: ${e.target.files[0].name}`, 'info');
  }
}

export async function handleBiometricUploadSubmit() {
  const result = await SportSphereAPI.uploadSprintBiometrics({ timestamp: Date.now() });
  closeModal();
  showToast(result.message, 'info');
}

// Bookmark Toggle
export function toggleBookmark(compId, e) {
  if (e) e.stopPropagation();
  if (state.savedCompetitions.has(compId)) {
    state.savedCompetitions.delete(compId);
    showToast('Removed from saved competitions', 'warn');
  } else {
    state.savedCompetitions.add(compId);
    showToast('Added to saved competitions!', 'info');
  }
  renderHeaderProfile();
  renderActiveTab();
}

// Filter setters
export function setFilterCategory(category) {
  state.selectedCategory = category;
  renderDiscoverView();
}

export function setFilterTier(tier) {
  state.selectedTier = tier;
  renderDiscoverView();
}

export function selectVenue(venueId) {
  state.selectedVenueId = venueId;
  renderActiveTab();
}

export function setHeroSlide(idx) {
  state.heroIndex = idx;
  renderHeroSection();
}

function renderHeroSection() {
  const heroContainer = document.getElementById('hero-banner-container');
  if (heroContainer && state.activeTab === 'overview') {
    const hero = HERO_SLIDES[state.heroIndex];
    heroContainer.querySelector('.bg-cover').style.backgroundImage = `url('${hero.image}')`;
    const h1 = heroContainer.querySelector('h1');
    if (h1) h1.textContent = hero.title;
    const p = heroContainer.querySelector('p');
    if (p) p.textContent = hero.focus;
  }
}

// Render Navigation Tabs
function renderNavigation() {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'highlights', label: 'Highlights & Reels', icon: 'play_circle' },
    { id: 'profile', label: 'Sports CV & Profile', icon: 'person' },
    { id: 'categories', label: 'Categories', icon: 'category' },
    { id: 'discover', label: 'Discover Tournaments', icon: 'explore' },
    { id: 'map', label: 'Nearby Map', icon: 'map' },
    { id: 'registrations', label: 'Registrations', icon: 'app_registration' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { id: 'achievements', label: 'Medals & Badges', icon: 'military_tech' },
    { id: 'analytics', label: 'Biometrics', icon: 'insights' },
    { id: 'scholarships', label: 'Grants', icon: 'payments' },
    { id: 'saved', label: 'Saved', icon: 'bookmark' }
  ];

  const desktopNav = document.getElementById('desktop-nav-tabs');
  if (desktopNav) {
    desktopNav.innerHTML = tabs.map(t => `
      <button data-tab="${t.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${t.id === state.activeTab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-all whitespace-nowrap">
        <span class="material-symbols-outlined text-[17px]">${t.icon}</span>
        <span>${t.label}</span>
        ${t.id === 'saved' ? `<span id="saved-count-badge" class="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">${state.savedCompetitions.size}</span>` : ''}
      </button>
    `).join('');
  }

  const mobileNav = document.getElementById('mobile-bottom-nav');
  if (mobileNav) {
    mobileNav.innerHTML = [
      { id: 'overview', label: 'Overview', icon: 'dashboard' },
      { id: 'highlights', label: 'Reels', icon: 'play_circle' },
      { id: 'categories', label: 'Categories', icon: 'category' },
      { id: 'profile', label: 'Sports CV', icon: 'person' },
      { id: 'discover', label: 'Explore', icon: 'explore' }
    ].map(t => `
      <button data-mobile-tab="${t.id}" onclick="window.SportSphere.switchTab('${t.id}')" class="flex flex-col items-center justify-center gap-0.5 ${t.id === state.activeTab ? 'text-blue-600 font-bold' : 'text-slate-400'}">
        <span class="material-symbols-outlined text-xl">${t.icon}</span>
        <span class="text-[10px]">${t.label}</span>
      </button>
    `).join('');
  }

  // Re-bind desktop tab buttons
  document.querySelectorAll('#desktop-nav-tabs [data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });
}

// ==========================================
// SIDEBAR DRAWER CONTROLLER
// ==========================================

export function openSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  const overlay = document.getElementById('sidebar-overlay');
  renderSidebar();

  if (drawer && overlay) {
    overlay.classList.remove('hidden');
    void overlay.offsetWidth;
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');

    drawer.classList.remove('-translate-x-full');
    drawer.classList.add('translate-x-0');
  }
}

export function closeSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  const overlay = document.getElementById('sidebar-overlay');

  if (drawer && overlay) {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('-translate-x-full');

    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 280);
  }
}

export function toggleSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  if (drawer && drawer.classList.contains('translate-x-0')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

// Render Sidebar Drawer Content (All Remaining & Core Features)
export function renderSidebar() {
  const drawer = document.getElementById('sidebar-drawer');
  if (!drawer) return;

  const profile = state.athleteProfile?.profile || {};
  const activeTab = state.activeTab;

  drawer.innerHTML = `
    <!-- Sidebar Header -->
    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <span class="material-symbols-outlined text-2xl">sports_score</span>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-base font-black tracking-tight text-slate-900">SportSphere</span>
            <span class="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-blue-100 text-blue-700">All Features</span>
          </div>
          <p class="text-[10px] text-slate-400 font-semibold">Universal Sports Platform Hub</p>
        </div>
      </div>

      <button onclick="window.SportSphere.closeSidebar()" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Close Menu">
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>

    <!-- Quick Profile Card in Sidebar -->
    <div class="p-4 mx-4 mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 transition-colors" onclick="window.SportSphere.switchTab('profile')">
      <div class="flex items-center gap-3">
        <img src="${profile.avatar}" alt="${profile.name}" class="w-10 h-10 rounded-xl object-cover border border-blue-500 shadow-2xs" />
        <div>
          <div class="flex items-center gap-1">
            <h4 class="text-xs font-bold text-slate-900">${profile.name}</h4>
            <span class="material-symbols-outlined text-blue-600 text-sm">verified</span>
          </div>
          <p class="text-[10px] text-blue-600 font-semibold">${state.currentRole} • Scout Index: ${profile.scoutIndex || 94}/100</p>
        </div>
      </div>
      <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
    </div>

    <!-- Navigation Groups -->
    <div class="px-4 py-4 space-y-5 flex-1 overflow-y-auto">
      
      <!-- Group 1: Core Platform -->
      <div>
        <span class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Platform</span>
        <div class="mt-1.5 space-y-1">
          <button onclick="window.SportSphere.switchTab('overview')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-lg">dashboard</span>
            <span>Overview (Dashboard Home)</span>
          </button>

          <button onclick="window.SportSphere.switchTab('highlights')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'highlights' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">play_circle</span>
              <span>Highlights & Reels</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'highlights' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}">New</span>
          </button>

          <button onclick="window.SportSphere.switchTab('profile')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">person</span>
              <span>Sports CV & Profile</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'profile' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}">LinkedIn Style</span>
          </button>

          <button onclick="window.SportSphere.switchTab('categories')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">category</span>
              <span>Sports Categories</span>
            </div>
            <span class="text-[10px] text-slate-400 font-semibold">${state.categories.length} Sports</span>
          </button>

          <button onclick="window.SportSphere.switchTab('discover')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'discover' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-lg">explore</span>
            <span>Discover Tournaments</span>
          </button>
        </div>
      </div>

      <!-- Group 2: Competitions & Stadiums (Remaining Features) -->
      <div>
        <span class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Competitions & Stadiums</span>
        <div class="mt-1.5 space-y-1">
          <button onclick="window.SportSphere.switchTab('map')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">map</span>
              <span>Nearby Stadiums & Hubs</span>
            </div>
            <span class="text-[10px] text-slate-400 font-semibold">${state.venues.length} Facilities</span>
          </button>

          <button onclick="window.SportSphere.switchTab('registrations')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'registrations' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">app_registration</span>
              <span>Registrations & Bib Passes</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'registrations' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}">${state.athleteProfile?.registrations?.length || 4}</span>
          </button>

          <button onclick="window.SportSphere.switchTab('calendar')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'calendar' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-lg">calendar_month</span>
            <span>Sports Calendar & Schedule</span>
          </button>
        </div>
      </div>

      <!-- Group 3: Analytics & Verified Records (Remaining Features) -->
      <div>
        <span class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Biometrics & Records</span>
        <div class="mt-1.5 space-y-1">
          <button onclick="window.SportSphere.switchTab('analytics')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-lg">insights</span>
            <span>Sprint Biometrics & Curves</span>
          </button>

          <button onclick="window.SportSphere.switchTab('achievements')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'achievements' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">military_tech</span>
              <span>Medals & Accreditations</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'achievements' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}">6 Medals</span>
          </button>
        </div>
      </div>

      <!-- Group 4: Funding & Bookmarks -->
      <div>
        <span class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Grants & Saved</span>
        <div class="mt-1.5 space-y-1">
          <button onclick="window.SportSphere.switchTab('scholarships')" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'scholarships' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <span class="material-symbols-outlined text-lg">payments</span>
            <span>Scholarships & Grants</span>
          </button>

          <button onclick="window.SportSphere.switchTab('saved')" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'saved' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-700 hover:bg-slate-100'}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">bookmark</span>
              <span>Saved Competitions</span>
            </div>
            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}">${state.savedCompetitions.size}</span>
          </button>
        </div>
      </div>

    </div>

    <!-- Quick Actions in Sidebar Footer -->
    <div class="p-4 border-t border-slate-100 bg-slate-50 space-y-2 shrink-0">
      <div class="flex gap-2">
        <button onclick="window.SportSphere.openModal('trialTime'); window.SportSphere.closeSidebar();" class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors">
          <span class="material-symbols-outlined text-base">timer</span>
          Submit Trial
        </button>
        <button onclick="window.SportSphere.openModal('uploadSprint'); window.SportSphere.closeSidebar();" class="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors">
          <span class="material-symbols-outlined text-base">cloud_upload</span>
          Upload Video
        </button>
      </div>

      <button onclick="window.SportSphere.handleLogout()" class="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
        <span class="material-symbols-outlined text-base">logout</span>
        <span>Log Out of SportSphere</span>
      </button>

      <div class="text-[11px] text-slate-400 text-center font-medium pt-1">
        SportSphere Universal Sports Platform • Fetch API
      </div>
    </div>
  `;
}

// Handle Logout
export function handleLogout() {
  try {
    localStorage.removeItem('sportsphere_student_user');
    localStorage.removeItem('sportsphere_auth_user');
    sessionStorage.clear();
  } catch (e) {
    // ignore
  }
  showToast('Logging out of SportSphere...', 'info');
  setTimeout(() => {
    window.location.href = 'http://localhost:3003';
  }, 350);
}

// Global exposure for inline onclick handlers
window.SportSphere = {
  switchTab,
  openRegistrationModal,
  handleRegistrationSubmit,
  openModal,
  closeModal,
  handleTrialTimeSubmit,
  handleFileSelect,
  handleBiometricUploadSubmit,
  toggleBookmark,
  setFilterCategory,
  setFilterTier,
  selectVenue,
  setHeroSlide,
  handleGPSDetection,
  showToast,
  likeHighlight,
  shareHighlight,
  playHighlightMedia,
  openHighlightComments,
  handleHighlightPostSubmit,
  openCategory,
  endorseSkill,
  shareProfileCV,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  renderSidebar,
  handleLogout
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
