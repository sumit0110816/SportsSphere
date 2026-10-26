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
