import React, { useState } from 'react';

interface CalendarViewProps {
  showToast: (msg: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ showToast }) => {
  const [activeMonth, setActiveMonth] = useState('October 2025');

  const events = [
    {
      date: 'Oct 28, 2025',
      time: '07:30 AM',
      title: 'Karnataka State Athletic Selection Trials',
      venue: 'Kanteerava Outdoor Stadium, Track #3',
      type: 'Trials',
      status: 'Confirmed',
      color: 'border-blue-500 bg-blue-50/60 text-blue-900',
    },
    {
      date: 'Oct 30, 2025',
      time: '11:59 PM',
      title: 'AIU Football Cup Registration Cutoff',
      venue: 'Online Portal',
      type: 'Deadline',
      status: 'Action Needed',
      color: 'border-rose-500 bg-rose-50/60 text-rose-900',
    },
    {
      date: 'Nov 02, 2025',
      time: '08:00 AM',
      title: 'Regional Inter-College 400m Relay Heats',
      venue: 'Kanteerava Outer Track',
      type: 'Tournament',
      status: 'Under Review',
      color: 'border-amber-500 bg-amber-50/60 text-amber-900',
    },
    {
      date: 'Nov 05, 2025',
      time: '09:15 AM',
      title: 'Inter-Zone University Sprint Quarter-Finals',
      venue: 'Mysore University Athletic Complex',
      type: 'Championship',
      status: 'Ticket Ready',
      color: 'border-teal-500 bg-teal-50/60 text-teal-900',
    },
    {
      date: 'Nov 10, 2025',
      time: '05:00 PM',
      title: 'State Open Badminton Entry Deadline',
      venue: 'Padukone Sports Acad.',
      type: 'Deadline',
      status: 'Upcoming',
      color: 'border-slate-400 bg-slate-50 text-slate-800',
    },
    {
      date: 'Dec 05, 2025',
      time: '07:00 AM',
      title: 'National Junior Athletics Sprint Meet (AFI)',
      venue: 'JLN Stadium, Delhi',
      type: 'National Trials',
      status: 'Target Event',
      color: 'border-indigo-600 bg-indigo-50/70 text-indigo-950',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[24px]">calendar_month</span>
            <h1 className="text-2xl font-black text-slate-900">Sports & Trials Calendar</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Synchronized itinerary of selection trials, qualification heats, and entry deadlines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast('Synced entire itinerary with Google Calendar & iCal')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">sync</span>
            <span>Sync to Calendar</span>
          </button>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 mb-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">{activeMonth}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              6 Upcoming Events
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveMonth('September 2025');
                showToast('Viewing September 2025 archive');
              }}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMonth('October 2025');
                showToast('Viewing current month: October 2025');
              }}
              className="px-2.5 py-1 text-xs font-bold text-slate-800"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMonth('November 2025');
                showToast('Viewing November 2025 events');
              }}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Agenda Events List */}
        <div className="space-y-3">
          {events.map((ev, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl border-l-4 border transition-all hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${ev.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-white shadow-xs border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    {ev.date.split(' ')[0]}
                  </span>
                  <span className="text-lg font-black text-slate-900 leading-tight">
                    {ev.date.split(' ')[1].replace(',', '')}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {ev.type}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">{ev.time}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                    {ev.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white shadow-xs border border-slate-200">
                  {ev.status}
                </span>
                <button
                  type="button"
                  onClick={() => showToast(`Exported .ics event invite for ${ev.title}`)}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                  title="Download .ics event file"
                >
                  <span className="material-symbols-outlined text-[17px]">event</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
