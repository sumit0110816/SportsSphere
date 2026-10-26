import React, { useState } from 'react';
import { Settings, Shield, Bell, Check, Save } from 'lucide-react';
import { getLoggedInOrganizer } from '../../utils/userSession';

interface SettingsViewProps {
  showToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ showToast }) => {
  const organizer = getLoggedInOrganizer();
  const [orgName, setOrgName] = useState(organizer.org || 'JCER Sports Association');
  const [coordinator, setCoordinator] = useState(`${organizer.name} (${organizer.title})`);
  const [email, setEmail] = useState(organizer.email || 'sports-board@sportsphere.org');
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [autoApproveVerified, setAutoApproveVerified] = useState(true);
  const [liveScoreBroadcast, setLiveScoreBroadcast] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Organization settings & notification parameters saved successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Settings className="w-4 h-4 transition-transform duration-500 hover:rotate-90" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Organization Profile &amp; Preferences</h2>
            <p className="text-xs text-slate-500">
              Manage collegiate athletic board credentials, staff coordinators, and automated alerts.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-6">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Coordinator</label>
            <input
              type="text"
              value={coordinator}
              onChange={(e) => setCoordinator(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Campus Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">Automated Tournament Rules</h4>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={whatsappNotifs}
                onChange={(e) => setWhatsappNotifs(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-800 block group-hover:text-blue-600 transition-colors">
                  Instant WhatsApp notifications for match delays &amp; court changes
                </span>
                <span className="text-[11px] text-slate-400">
                  Sends automated SMS/WhatsApp alerts if weather or referee delays occur.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoApproveVerified}
                onChange={(e) => setAutoApproveVerified(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-800 block group-hover:text-blue-600 transition-colors">
                  Auto-approve verified collegiate ID and medical waiver uploads
                </span>
                <span className="text-[11px] text-slate-400">
                  Instantly clears applicants whose university registration numbers match student directory.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={liveScoreBroadcast}
                onChange={(e) => setLiveScoreBroadcast(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-800 block group-hover:text-blue-600 transition-colors">
                  Push live match points to public campus TV display boards
                </span>
                <span className="text-[11px] text-slate-400">
                  Syncs court point changes directly with cafeteria and stadium displays.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="btn-interactive btn-shine px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
