import React, { useState } from 'react';
import { Megaphone, Send, Bell, Smartphone, Users } from 'lucide-react';

interface AnnouncementsViewProps {
  showToast: (msg: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ showToast }) => {
  const [recipientGroup, setRecipientGroup] = useState('All Registered Athletes (486)');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    showToast(`Broadcast "${title}" dispatched successfully to 486 recipients!`);
    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Broadcast Notification Composer</h2>
            <p className="text-xs text-slate-500">
              Send instant high-priority push notifications, campus SMS, and WhatsApp alerts to teams.
            </p>
          </div>
        </div>

        <form onSubmit={handleDispatch} className="space-y-4 mt-6">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Recipients</label>
            <select
              value={recipientGroup}
              onChange={(e) => setRecipientGroup(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white outline-hidden focus:border-blue-500 transition-colors"
            >
              <option>All Registered Athletes (486)</option>
              <option>Team Coaches Only (14)</option>
              <option>Intercollege Football Teams Only (16)</option>
              <option>Badminton Tournament Draw (64)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Message Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule Update: Reporting time changed to 8:30 AM"
              required
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Broadcast Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write instructions regarding bib collection, footwear restrictions on synthetic grass, medical waiver submission, or parking..."
              required
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Channels: SportSphere App Push + WhatsApp Direct API</span>
            </div>
            <span className="font-semibold text-emerald-700">Ready to deliver</span>
          </div>

          <button
            type="submit"
            className="btn-interactive btn-shine w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Urgent Announcement</span>
          </button>
        </form>
      </div>
    </div>
  );
};
