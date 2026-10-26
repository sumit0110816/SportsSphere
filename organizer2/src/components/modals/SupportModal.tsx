import React, { useState } from 'react';
import { X, Send, LifeBuoy, Phone, Mail, Clock } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your ticket has been logged with JCER Campus Support (Ticket #SS-992)');
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">JCER Sports Tech Support</h4>
                <div className="text-[10px] text-slate-400">Direct Campus Organizer Helpline</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-press p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] mb-4">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate text-slate-700">support@jcer.ac.in</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate text-slate-700">+91 831 249 8100</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
              <select className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500">
                <option>Ground &amp; Venue Scheduling Conflict</option>
                <option>Score Verification / Referee Disputes</option>
                <option>Athlete Medical Waiver Inquiries</option>
                <option>Financial Payout &amp; Registration Fees</option>
                <option>Organizer Event Credit Top-up</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of request..."
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Provide event details, match number, or student ID..."
                required
                className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-interactive px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-interactive btn-shine px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
