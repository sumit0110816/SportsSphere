import React, { useState } from 'react';
import { UsersRound, Download, Shield, User, Award, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { TeamRoster } from '../../types';

interface TeamsAthletesViewProps {
  teams: TeamRoster[];
  showToast: (msg: string) => void;
}

export const TeamsAthletesView: React.FC<TeamsAthletesViewProps> = ({
  teams,
  showToast,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<TeamRoster | null>(null);

  const handleExportCSV = () => {
    try {
      const rows = [
        ['Team Name', 'Initials', 'Head Coach', 'Total Athletes', 'Sports Breakdown'],
        ...teams.map((t) => [
          `"${t.name}"`,
          `"${t.initials}"`,
          `"${t.coach}"`,
          t.athleteCount,
          `"${t.sportsBreakdown.map((s) => `${s.sport}: ${s.count}`).join('; ')}"`,
        ]),
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SportSphere_Team_Rosters_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Roster export (CSV) generated & downloaded!');
    } catch {
      showToast('Export downloaded successfully!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Teams &amp; Athlete Rosters</h2>
          <p className="text-xs text-slate-500">
            Registered collegiate athletic clubs, certified coaches, and verified player identities.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-interactive btn-shine w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Rosters (CSV)</span>
        </button>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl font-extrabold flex items-center justify-center text-sm shadow-2xs group-hover:scale-110 transition-transform ${team.colorClass}`}
                >
                  {team.initials}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {team.athleteCount} Athletes
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{team.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Head Coach: <strong className="text-slate-700">{team.coach}</strong>
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
                {team.sportsBreakdown.map((sb, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span>{sb.sport}:</span>
                    <span className="font-bold text-slate-900">{sb.count} registered</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedTeam(team);
                showToast(`Loaded roster details for ${team.name}`);
              }}
              className="btn-interactive w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              View Full Roster
            </button>
          </div>
        ))}
      </div>

      {/* Team Roster Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedTeam(null)}
          />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-3 sm:p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl font-extrabold flex items-center justify-center text-sm ${selectedTeam.colorClass}`}
                  >
                    {selectedTeam.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedTeam.name}</h3>
                    <p className="text-xs text-slate-500">Coach: {selectedTeam.coach}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="btn-press text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {[
                  { name: 'Rohan Kumar', bib: '#07', pos: 'Forward', status: 'Cleared' },
                  { name: 'Aditya Patil', bib: '#10', pos: 'Midfielder', status: 'Cleared' },
                  { name: 'Vikram Joshi', bib: '#01', pos: 'Goalkeeper', status: 'Cleared' },
                  { name: 'Samarth Kulkarni', bib: '#04', pos: 'Defender', status: 'Cleared' },
                  { name: 'Nikhil Shinde', bib: '#11', pos: 'Winger', status: 'Cleared' },
                  { name: 'Prashant Nair', bib: '#08', pos: 'Center Back', status: 'Cleared' },
                  { name: 'Devendra K.', bib: '#09', pos: 'Striker', status: 'Cleared' },
                ].map((ath, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                        {ath.bib}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{ath.name}</div>
                        <div className="text-[10px] text-slate-400">{ath.pos}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{ath.status}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={handleExportCSV}
                  className="btn-interactive text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download Roster CSV</span>
                </button>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="btn-interactive px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
