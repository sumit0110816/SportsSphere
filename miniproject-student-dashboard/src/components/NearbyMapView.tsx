import React, { useState } from 'react';
import { VENUES, calculateDistanceKm } from '../mockData';
import { VenueSpot, UserLocation } from '../types';

interface NearbyMapViewProps {
  userLocation: UserLocation;
  onDetectLocation: () => void;
  showToast: (msg: string) => void;
}

export const NearbyMapView: React.FC<NearbyMapViewProps> = ({
  userLocation,
  onDetectLocation,
  showToast,
}) => {
  const [selectedRadius, setSelectedRadius] = useState<number>(30);

  // Dynamically calculate distance for each venue from the user's location
  const dynamicVenues = VENUES.map((v) => {
    const dist = calculateDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      v.latitude,
      v.longitude
    );
    return {
      ...v,
      distanceNum: dist,
      distance: dist < 1 ? '<1 km away' : `${dist} km away`,
    };
  });

  const [selectedVenue, setSelectedVenue] = useState<VenueSpot>(dynamicVenues[0]);

  const venuesWithinRadius = dynamicVenues.filter((v) => v.distanceNum <= selectedRadius);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">map</span>
            <h1 className="text-2xl font-black text-slate-900">Nearby Events & Venue Map</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Locate stadiums, athletics tracks, and training facilities calibrated to {userLocation.cityName}
          </p>
        </div>

        {/* Radius selector & Location refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDetectLocation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">my_location</span>
            <span>Update GPS</span>
          </button>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 pl-3">Radius:</span>
            {[5, 15, 30, 60].map((radius) => (
              <button
                key={radius}
                type="button"
                onClick={() => {
                  setSelectedRadius(radius);
                  showToast(`Filter radius updated to ${radius} km`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRadius === radius
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {radius}km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-200 relative min-h-[480px] flex flex-col justify-between">
          {/* Map canvas */}
          <div className="relative w-full h-[520px] overflow-hidden bg-slate-900">
            <img
              alt="Bengaluru sports map background"
              className="w-full h-full object-cover brightness-[1.04] contrast-[1.04]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0pqlA6GrxqR_evm7z4yG1PpcLYZgycRse9bqBCH63zNrEp2L8ez6YZs4ltiiSXNj2FNPM6wKvlO5idU94Ud1MHouUN5JnVxF5sUisFqyvU5Z_fg5yflTlnWErEL1ONQimcj_agXNCejHLdkZwmp31ae71QAZkJfHsuoXr3JjKBlUMvznRXAzh5UkmusYYDtrrQZA4Mf0fNCWz_iRJCKf0BIwb3VvPGw-QEdoehmw0Hm649KWA6HYTPQ"
            />
            <div className="absolute inset-0 bg-slate-900/15 pointer-events-none" />

            {/* Pins overlay */}
            {venuesWithinRadius.map((venue) => {
              const isSelected = selectedVenue.id === venue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => {
                    setSelectedVenue(venue);
                    showToast(`Selected venue: ${venue.name} (${venue.distance})`);
                  }}
                  style={{
                    top: `${venue.coords.y}%`,
                    left: `${venue.coords.x}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`px-3 py-1 rounded-xl shadow-lg text-xs whitespace-nowrap mb-1.5 font-bold transition-all border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400 scale-105'
                          : 'bg-white/95 text-slate-900 border-slate-200 group-hover/pin:scale-105'
                      }`}
                    >
                      {venue.name.split(' ')[0]} {venue.name.split(' ')[1]} ({venue.distance})
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 ring-4 ring-blue-400/50 scale-125'
                          : 'bg-teal-600 ring-4 ring-teal-400/30'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Location floating pill */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-white/60 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-[18px]">near_me</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Your Origin</span>
                <span className="text-xs font-bold text-slate-800">{userLocation.cityName}</span>
              </div>
            </div>

            {/* Bottom map summary */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center justify-between text-slate-800 border border-white/60 shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold">
                  {venuesWithinRadius.length} stadiums active within {selectedRadius}km of your location
                </span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Opening GPS route navigation in Google Maps...')}
                className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Navigate</span>
                <span className="material-symbols-outlined text-[16px]">directions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Venue Details Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-100">
              <img
                alt={selectedVenue.name}
                src={selectedVenue.image}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs font-mono text-emerald-300 font-semibold block">
                  {selectedVenue.distance}
                </span>
                <h3 className="font-extrabold text-base leading-tight mt-0.5">{selectedVenue.name}</h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              {selectedVenue.category}
            </span>

            <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5 leading-relaxed">
              <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0 mt-0.5">
                location_on
              </span>
              <span>{selectedVenue.address}</span>
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Facility Features & Track Tech
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedVenue.features.map((feat) => (
                  <div
                    key={feat}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-blue-600 text-[15px]">
                      check_circle
                    </span>
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => showToast(`Calculating driving route to ${selectedVenue.name}: 18 mins`)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Directions</span>
            </button>
            <button
              type="button"
              onClick={() => showToast(`Filtered ${selectedVenue.eventsCount} events at ${selectedVenue.name}`)}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">event</span>
              <span>View {selectedVenue.eventsCount} Events</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
