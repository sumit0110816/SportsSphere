import React, { useState } from 'react';
import { Settings, Shield, Bell, Check, Save, User, Building, MapPin, Mail, Image as ImageIcon, Upload } from 'lucide-react';
import { getLoggedInOrganizer, LoggedInOrganizer } from '../../utils/userSession';

interface SettingsViewProps {
  showToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ showToast }) => {
  const [organizer, setOrganizer] = useState(() => getLoggedInOrganizer());
  const [name, setName] = useState(organizer.name || 'Tournament Director');
  const [title, setTitle] = useState(organizer.title || 'Regional Director');
  const [orgName, setOrgName] = useState(organizer.org || 'JCER Sports Association');
  const [city, setCity] = useState(organizer.city || 'Regional Sports Hub');
  const [email, setEmail] = useState(organizer.email || 'sports-board@sportsphere.org');
  const [sport, setSport] = useState(organizer.sport || 'Multi-Sport');
  const [bio, setBio] = useState(organizer.bio || 'Official Sports Event Organizer & Tournament Director');
  const [avatar, setAvatar] = useState(organizer.avatar || '');
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [autoApproveVerified, setAutoApproveVerified] = useState(true);
  const [liveScoreBroadcast, setLiveScoreBroadcast] = useState(true);

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setAvatar(evt.target.result as string);
        showToast(`Selected logo/avatar: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Coordinator name cannot be empty');
      return;
    }

    const updated: LoggedInOrganizer = {
      ...organizer,
      name: name.trim(),
      title: title.trim(),
      org: orgName.trim(),
      city: city.trim(),
      email: email.trim(),
      sport: sport.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
    };

    // Save in localStorage
    try {
      localStorage.setItem('sportsphere_organizer_user', JSON.stringify(updated));
    } catch {}

    // Also update sportsphere_auth_user
    try {
      const authStr = localStorage.getItem('sportsphere_auth_user');
      if (authStr) {
        const parsed = JSON.parse(authStr);
        parsed.name = updated.name;
        if (updated.email) parsed.email = updated.email;
        if (!parsed.profile) parsed.profile = {};
        parsed.profile.fullName = updated.name;
        parsed.profile.organizationName = updated.org;
        parsed.profile.designation = updated.title;
        parsed.profile.city = updated.city;
        parsed.profile.bio = updated.bio;
        if (updated.avatar) parsed.profile.avatar = updated.avatar;
        localStorage.setItem('sportsphere_auth_user', JSON.stringify(parsed));
      }
    } catch {}

    setOrganizer(updated);
    window.dispatchEvent(new Event('organizer-profile-updated'));
    showToast('🎉 Organization & coordinator profile saved permanently!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs max-w-2xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Settings className="w-4 h-4 transition-transform duration-500 hover:rotate-90" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Organization &amp; Coordinator Profile</h2>
            <p className="text-xs text-slate-500">
              Update your sports federation credentials, coordinator details, and automated tournament rules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Coordinator Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Coordinator Title / Designation</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tournament Director"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization / Federation Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Karnataka University Sports Board"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region Hub</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Belagavi, Karnataka"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Core Sport Category</label>
              <input
                type="text"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                placeholder="e.g. Athletics, Badminton, Multi-Sport"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Federation Bio / Mission</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Avatar / Logo Selection */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block font-semibold text-slate-700 text-xs">
              Organization Logo / Coordinator Avatar (URL or Device Upload)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://... or choose file from device"
                className="flex-1 text-xs rounded-lg border border-slate-300 p-2 bg-white"
              />
              <label className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer shrink-0">
                Browse
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFileSelect} />
              </label>
            </div>
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
              className="btn-interactive btn-shine px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Persist Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
