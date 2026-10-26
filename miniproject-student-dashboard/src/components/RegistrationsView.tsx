import React, { useState } from 'react';
import { MY_REGISTRATIONS } from '../mockData';
import { RegistrationItem } from '../types';

interface RegistrationsViewProps {
  showToast: (msg: string) => void;
}

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({ showToast }) => {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(MY_REGISTRATIONS);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Confirmed' | 'Under Review'>('All');
  const [selectedBib, setSelectedBib] = useState<RegistrationItem | null>(null);

  const filtered = registrations.filter((r) => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">description</span>
            <h1 className="text-2xl font-black text-slate-900">My Registrations & Applications</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track official tournament entry passes, heat assignments, and federation clearances
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(['All', 'Confirmed', 'Under Review'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Registration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((reg) => {
          const isConfirmed = reg.status === 'Confirmed';

          return (
            <div
              key={reg.id}
              className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {reg.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                      {reg.competitionTitle}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${
                      isConfirmed
                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isConfirmed ? 'check_circle' : 'hourglass_top'}
                    </span>
                    {reg.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 my-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Event Date</span>
                    <span className="font-bold text-slate-800">{reg.eventDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Entry Fee</span>
                    <span className="font-bold text-slate-800">{reg.fee}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Venue & Track</span>
                    <span className="font-semibold text-slate-800 truncate block">{reg.venue}</span>
                  </div>
                  {reg.laneInfo && (
                    <div className="col-span-2 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Seeding / Heat</span>
                      <span className="font-mono text-blue-700 font-bold">{reg.laneInfo}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {isConfirmed && reg.bibNumber ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedBib(reg)}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>View Official Bib Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Downloaded entry receipt PDF for ${reg.competitionTitle}`)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                      title="Download PDF Entry Slip"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Scout committee reviewing qualification times</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`Resent athlete profile credentials for ${reg.competitionTitle}`)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Resend Docs
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bib Pass Modal */}
      {selectedBib && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBib(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedBib(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Official Athlete Bib Pass
            </span>

            <h3 className="font-black text-lg text-slate-900 mt-3 leading-snug">
              {selectedBib.competitionTitle}
            </h3>

            {/* Bib number display */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-inner">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Bib Identification
              </span>
              <div className="font-mono text-3xl font-black tracking-widest text-white my-1">
                {selectedBib.bibNumber}
              </div>
              <span className="text-xs text-teal-300 font-semibold">{selectedBib.laneInfo}</span>
            </div>

            {/* Simulated QR Code */}
            <div className="w-36 h-36 mx-auto bg-slate-50 rounded-2xl p-2.5 border border-slate-200 flex flex-col items-center justify-center">
              <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-white rounded-lg border border-slate-200">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i * 7 + 3) % 4 === 0 || i < 6 || i % 6 === 0
                        ? 'bg-slate-900'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 mt-3">
              Scan at call room gate for biometric identity verification
            </p>

            <button
              type="button"
              onClick={() => {
                showToast(`Saved Bib #${selectedBib.bibNumber} to Apple Wallet / Google Pay`);
                setSelectedBib(null);
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">wallet</span>
              <span>Add to Mobile Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
