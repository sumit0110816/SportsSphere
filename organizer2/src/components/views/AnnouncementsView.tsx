import React, { useState } from 'react';
import {
  Megaphone,
  Send,
  Bell,
  Smartphone,
  Users,
  CheckCircle2,
  Clock,
  Globe,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface AnnouncementsViewProps {
  showToast: (msg: string) => void;
}

const RECENT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Schedule Update: Football Cup reporting time changed',
    body: 'All participating teams must report by 7:30 AM at the main ground. Registration counter opens at 7:00 AM.',
    recipients: 'Football Teams (16)',
    channel: 'App Push + WhatsApp',
    time: '2 hours ago',
    status: 'Delivered',
  },
  {
    id: 2,
    title: 'Badminton Draw Announcement',
    body: 'Official bracket has been published. Check the fixtures section for your match schedule.',
    recipients: 'All Registered Athletes (486)',
    channel: 'App Push',
    time: '1 day ago',
    status: 'Delivered',
  },
  {
    id: 3,
    title: 'Medical Waiver Reminder',
    body: 'All athletes must submit signed medical waivers before the event. Deadline: Oct 22.',
    recipients: 'Pending Registrations (12)',
    channel: 'WhatsApp + SMS',
    time: '2 days ago',
    status: 'Delivered',
  },
];

const CHANNELS = [
  { id: 'app', label: 'App Push', icon: Smartphone, color: 'blue' },
  { id: 'whatsapp', label: 'WhatsApp', icon: Globe, color: 'emerald' },
  { id: 'sms', label: 'SMS', icon: Bell, color: 'amber' },
];

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ showToast }) => {
  const [recipientGroup, setRecipientGroup] = useState('All Registered Athletes (486)');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['app', 'whatsapp']);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [isSending, setIsSending] = useState(false);

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      showToast(`📣 Broadcast "${title}" dispatched to ${recipientGroup}!`);
      setTitle('');
      setBody('');
      setIsSending(false);
    }, 1200);
  };

  const priorityColors = {
    Normal: 'bg-slate-100 text-slate-700 border-slate-300',
    High: 'bg-amber-50 text-amber-700 border-amber-300',
    Urgent: 'bg-rose-50 text-rose-700 border-rose-300',
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Announcements</h1>
        <p className="text-xs text-slate-500 mt-0.5">Send targeted broadcasts to athletes, teams, and coaches.</p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Composer (left) */}
        <div className="xl:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Card header */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">Broadcast Composer</h2>
                <p className="text-[11px] text-blue-100">Send high-priority notifications to your audience</p>
              </div>
            </div>

            <form onSubmit={handleDispatch} className="p-5 space-y-4">
              {/* Recipients */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <Users className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  Target Recipients
                </label>
                <select
                  value={recipientGroup}
                  onChange={(e) => setRecipientGroup(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option>All Registered Athletes (486)</option>
                  <option>Team Coaches Only (14)</option>
                  <option>Intercollege Football Teams Only (16)</option>
                  <option>Badminton Tournament Draw (64)</option>
                  <option>Pending Registration Athletes (12)</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  <Zap className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  Priority Level
                </label>
                <div className="flex items-center gap-2">
                  {(['Normal', 'High', 'Urgent'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        priority === p
                          ? p === 'Urgent' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' :
                            p === 'High' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' :
                            'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Message Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule Update: Reporting time changed to 8:30 AM"
                  required
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-300"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Broadcast Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="Write your announcement here — include key info like bib collection, footwear restrictions, medical waiver deadlines, or parking..."
                  required
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none placeholder:text-slate-300"
                />
                <div className="text-[10px] text-slate-400 text-right mt-0.5">{body.length} characters</div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Channels</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {CHANNELS.map(({ id, label, icon: Icon, color }) => {
                    const active = selectedChannels.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleChannel(id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          active
                            ? color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                              color === 'emerald' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                              'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {label}
                        {active && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview strip */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready to deliver via {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''}</span>
                </div>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                  priority === 'High' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {priority} Priority
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSending || !title.trim() || !body.trim()}
                className={`btn-interactive btn-shine w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all ${
                  isSending || !title.trim() || !body.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                }`}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Dispatch Announcement
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Announcements (right) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Recent Broadcasts</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{RECENT_ANNOUNCEMENTS.length} sent</span>
            </div>

            <div className="divide-y divide-slate-100">
              {RECENT_ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="p-4 hover:bg-slate-50/70 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {ann.title}
                    </h4>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap shrink-0">{ann.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{ann.body}</p>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Users className="w-2.5 h-2.5" />
                      {ann.recipients}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {ann.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-extrabold">Broadcast Tips</span>
            </div>
            <ul className="space-y-2 text-[11px] text-blue-100">
              {[
                'Send urgent alerts at least 24 hours before events.',
                'Use WhatsApp for high-priority schedule changes.',
                'Keep titles under 60 characters for push notifications.',
                'Target specific groups to reduce notification fatigue.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-blue-300" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
