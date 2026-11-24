/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, NavTabId, Competition, UserLocation } from './types';
import { INITIAL_COMPETITIONS, DEFAULT_USER_LOCATION, calculateDistanceKm } from './mockData';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { DiscoverView } from './components/DiscoverView';
import { NearbyMapView } from './components/NearbyMapView';
import { RegistrationsView } from './components/RegistrationsView';
import { CalendarView } from './components/CalendarView';
import { AchievementsView } from './components/AchievementsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ScholarshipsView } from './components/ScholarshipsView';
import { SavedView } from './components/SavedView';
import { RegistrationModal } from './components/RegistrationModal';
import { AthleteCvModal } from './components/AthleteCvModal';
import { SubmitTrialTimeModal } from './components/SubmitTrialTimeModal';
import { UploadSprintModal } from './components/UploadSprintModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('Athlete');
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Location State
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);

  // Competitions with distance calculated based on userLocation
  const [competitions, setCompetitions] = useState<Competition[]>(() =>
    INITIAL_COMPETITIONS.map((c) => ({
      ...c,
      distanceKm: calculateDistanceKm(
        DEFAULT_USER_LOCATION.latitude,
        DEFAULT_USER_LOCATION.longitude,
        c.latitude,
        c.longitude
      ),
    }))
  );

  // Modals state
  const [registerModalComp, setRegisterModalComp] = useState<Competition | null>(null);
  const [athleteCvOpen, setAthleteCvOpen] = useState(false);
  const [submitTrialOpen, setSubmitTrialOpen] = useState(false);
  const [uploadSprintOpen, setUploadSprintOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Recalculate all distances whenever userLocation changes
  const updateCompetitionsDistance = (lat: number, lng: number) => {
    setCompetitions((prev) =>
      prev.map((c) => ({
        ...c,
        distanceKm: calculateDistanceKm(lat, lng, c.latitude, c.longitude),
      }))
    );
  };

  // Helper to map organizer published event to Athlete Competition
  const mapOrganizerEventToCompetition = (ev: any, lat: number, lng: number): Competition => {
    const sportImages: Record<string, string> = {
      Football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      Badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
      Basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      Athletics: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
      Swimming: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80',
      Volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    };

    const feeNum = ev.feeAmount || parseInt(String(ev.fee || '').replace(/\D/g, ''), 10) || 500;
    const cat = ['Football', 'Badminton', 'Athletics', 'Basketball', 'Swimming', 'Volleyball'].find(
      (s) => s.toLowerCase() === (ev.sport || '').toLowerCase()
    ) || 'Athletics';

    const eventLat = ev.latitude || 12.9716;
    const eventLng = ev.longitude || 77.5946;

    return {
      id: ev.id,
      title: ev.title,
      category: cat as any,
      circuitTier: 'University',
      organizer: ev.organizerName || 'Verified Collegiate Organizer',
      dateRange: ev.date || 'Dec 15–20, 2026',
      venue: ev.venue || 'University Main Ground',
      city: ev.city || 'Campus Stadium Hub',
      latitude: eventLat,
      longitude: eventLng,
      distanceKm: calculateDistanceKm(lat, lng, eventLat, eventLng),
      entryFee: ev.fee || `₹${feeNum} / team`,
      feeAmount: feeNum,
      deadline: `Closes in ${ev.daysLeft || 10} days`,
      matchScore: 94,
      image: sportImages[cat] || sportImages.Athletics,
      tags: ['Organizer Published', 'Verified Open Tournament', 'Scout Calibrated'],
      eligibility: 'Open to All Enrolled Varsity Athletes',
      description: ev.subtitle || 'Official tournament published by authorized Sports Organizer on SportSphere.',
      registeredCount: ev.registeredCount || 0,
      maxSlots: ev.totalCapacity || 16,
      isBookmarked: false,
    };
  };

  // Poll & sync published events from organizer across ports
  useEffect(() => {
    const fetchSyncEvents = async () => {
      try {
        let res = await fetch('/api/sync/events');
        if (!res.ok) {
          res = await fetch('http://localhost:3004/api/sync/events');
        }
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.events)) {
            setCompetitions((prev) => {
              const prevIds = new Set(prev.map((c) => c.id));
              const newItems = data.events
                .filter((ev: any) => ev.status === 'Open' && !prevIds.has(ev.id))
                .map((ev: any) => mapOrganizerEventToCompetition(ev, userLocation.latitude, userLocation.longitude));
              if (newItems.length > 0) {
                return [...newItems, ...prev];
              }
              return prev;
            });
          }
        }
      } catch {}
    };

    fetchSyncEvents();
    const interval = setInterval(fetchSyncEvents, 3000);
    window.addEventListener('focus', fetchSyncEvents);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchSyncEvents);
    };
  }, [userLocation.latitude, userLocation.longitude]);

  // Browser Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    setUserLocation((prev) => ({ ...prev, isDetecting: true }));
    showToast('Requesting GPS location from browser...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: UserLocation = {
          latitude,
          longitude,
          cityName: `GPS Detected (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`,
          source: 'gps',
          isDetecting: false,
          accuracy: position.coords.accuracy,
        };

        setUserLocation(newLocation);
        updateCompetitionsDistance(latitude, longitude);
        showToast(`📍 Location updated to your live GPS! Competitions sorted by distance.`);
      },
      (error) => {
        setUserLocation((prev) => ({ ...prev, isDetecting: false }));
        showToast(`GPS detection unavailable (${error.message || 'permission'}). Retaining active region.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Switch to preset location (Bengaluru, Delhi, Mumbai, etc.)
  const handleSelectPresetLocation = (preset: { name: string; lat: number; lng: number }) => {
    const newLocation: UserLocation = {
      latitude: preset.lat,
      longitude: preset.lng,
      cityName: preset.name,
      source: 'preset',
      isDetecting: false,
    };
    setUserLocation(newLocation);
    updateCompetitionsDistance(preset.lat, preset.lng);
    showToast(`📍 Switched competitive region to: ${preset.name}`);
  };

  const handleToggleBookmark = (targetComp: Competition) => {
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === targetComp.id ? { ...c, isBookmarked: !c.isBookmarked } : c
      )
    );
    if (!targetComp.isBookmarked) {
      showToast(`Saved "${targetComp.title}" to your watchlist!`);
    } else {
      showToast(`Removed "${targetComp.title}" from your saved competitions.`);
    }
  };

  const handleConfirmRegistration = (comp: Competition) => {
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === comp.id ? { ...c, registeredCount: c.registeredCount + 1 } : c
      )
    );
    setRegisterModalComp(null);
    showToast(`Registration confirmed for "${comp.title}"! Official bib pass generated.`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Sticky Top Bar & Horizontal Mega Navigation */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCvModal={() => setAthleteCvOpen(true)}
        onOpenQuickTrialModal={() => setSubmitTrialOpen(true)}
        onOpenUploadSprintModal={() => setUploadSprintOpen(true)}
        showToast={showToast}
      />

      {/* Main Dynamic View Screen */}
      <main className="flex-1 w-full relative">
        {activeTab === 'overview' && (
          <OverviewView
            competitions={competitions}
            userLocation={userLocation}
            onDetectLocation={handleDetectLocation}
            onSelectPresetLocation={handleSelectPresetLocation}
            onOpenRegisterModal={(comp) => setRegisterModalComp(comp)}
            onOpenCvModal={() => setAthleteCvOpen(true)}
            onToggleBookmark={handleToggleBookmark}
            onSelectNavTab={(tab) => setActiveTab(tab)}
            showToast={showToast}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverView
            competitions={competitions}
            userLocation={userLocation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenRegisterModal={(comp) => setRegisterModalComp(comp)}
            onToggleBookmark={handleToggleBookmark}
            showToast={showToast}
          />
        )}

        {activeTab === 'map' && (
          <NearbyMapView
            userLocation={userLocation}
            onDetectLocation={handleDetectLocation}
            showToast={showToast}
          />
        )}

        {activeTab === 'registrations' && <RegistrationsView showToast={showToast} />}

        {activeTab === 'calendar' && <CalendarView showToast={showToast} />}

        {activeTab === 'achievements' && (
          <AchievementsView onOpenCvModal={() => setAthleteCvOpen(true)} showToast={showToast} />
        )}

        {activeTab === 'analytics' && <AnalyticsView showToast={showToast} />}

        {activeTab === 'scholarships' && <ScholarshipsView showToast={showToast} />}

        {activeTab === 'saved' && (
          <SavedView
            competitions={competitions}
            onOpenRegisterModal={(comp) => setRegisterModalComp(comp)}
            onToggleBookmark={handleToggleBookmark}
            showToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <RegistrationModal
        competition={registerModalComp}
        onClose={() => setRegisterModalComp(null)}
        onConfirm={handleConfirmRegistration}
      />

      <AthleteCvModal
        isOpen={athleteCvOpen}
        onClose={() => setAthleteCvOpen(false)}
        showToast={showToast}
      />

      <SubmitTrialTimeModal
        isOpen={submitTrialOpen}
        onClose={() => setSubmitTrialOpen(false)}
        showToast={showToast}
      />

      <UploadSprintModal
        isOpen={uploadSprintOpen}
        onClose={() => setUploadSprintOpen(false)}
        showToast={showToast}
      />

      {/* Global Feedback Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
