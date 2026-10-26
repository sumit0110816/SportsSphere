import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Search, Filter, ShieldCheck, CheckCheck } from 'lucide-react';
import { RegistrationApplicant } from '../../types';

interface RegistrationsViewProps {
  registrations: RegistrationApplicant[];
  onDecision: (id: string, decision: 'Approved' | 'Declined') => void;
  onBatchApprove: () => void;
  onOpenReviewModal: (applicant: RegistrationApplicant) => void;
  showToast: (msg: string) => void;
}

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({
  registrations,
  onDecision,
  onBatchApprove,
  onOpenReviewModal,
  showToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Declined'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = registrations.filter((r) => r.status === 'Pending').length;

  const filtered = registrations.filter((r) => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teamOrCollege.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registration Triage Queue</h2>
          <p className="text-xs text-slate-500">
            Verify athlete eligibility, review medical waivers, and issue verified collegiate player passes.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-xs font-bold">
            {pendingCount} Pending Review
          </span>
          <button
            onClick={onBatchApprove}
            className="btn-shine btn-interactive px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Batch Approve</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Approved', 'Declined'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn-press px-3 py-1 rounded-lg font-medium cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicant or club..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 focus:ring-1 focus:ring-blue-500 outline-hidden hover:border-slate-300 transition-colors"
          />
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Applicant / Team</th>
                <th className="py-3 px-3">Tournament</th>
                <th className="py-3 px-3">College / Dept</th>
                <th className="py-3 px-3">Documents</th>
                <th className="py-3 px-3">Fee Status</th>
                <th className="py-3 px-4 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    <div>{reg.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{reg.sport}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{reg.tournament}</td>
                  <td className="py-3.5 px-3 text-slate-700">{reg.teamOrCollege}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={
                        reg.documentsStatus.includes('✓')
                          ? 'text-emerald-600 font-medium'
                          : 'text-amber-600 font-medium'
                      }
                    >
                      {reg.documentsStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-bold">
                      Paid ₹{reg.feeAmount}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {reg.status === 'Pending' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onDecision(reg.id, 'Approved')}
                          className="btn-interactive px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 cursor-pointer shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onDecision(reg.id, 'Declined')}
                          className="btn-interactive px-2.5 py-1 bg-slate-100 text-rose-600 font-semibold rounded hover:bg-rose-50 hover:border-rose-200 border border-transparent cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onOpenReviewModal(reg)}
                          className="btn-interactive px-2 py-1 bg-blue-50 text-blue-600 font-semibold rounded hover:bg-blue-100 cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    ) : reg.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded">
                        <CheckCircle className="w-3.5 h-3.5 animate-bounce" style={{ animationIterationCount: 2 }} />
                        <span>Pass Issued</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Declined</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
