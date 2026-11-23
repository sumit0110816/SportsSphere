import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Search,
  CheckCheck,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { RegistrationApplicant } from '../../types';

interface RegistrationsViewProps {
  registrations: RegistrationApplicant[];
  onDecision: (id: string, decision: 'Approved' | 'Declined') => void;
  onBatchApprove: () => void;
  onOpenReviewModal: (applicant: RegistrationApplicant) => void;
  showToast: (msg: string) => void;
}

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Declined'] as const;
type StatusTab = typeof STATUS_TABS[number];

export const RegistrationsView: React.FC<RegistrationsViewProps> = ({
  registrations,
  onDecision,
  onBatchApprove,
  onOpenReviewModal,
  showToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<StatusTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = registrations.filter((r) => r.status === 'Pending').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;
  const declinedCount = registrations.filter((r) => r.status === 'Declined').length;

  const filtered = registrations.filter((r) => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.teamOrCollege.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts: Record<StatusTab, number> = {
    All: registrations.length,
    Pending: pendingCount,
    Approved: approvedCount,
    Declined: declinedCount,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Registrations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify athlete eligibility, review waivers, and issue collegiate player passes.
          </p>
        </div>
        {pendingCount > 0 && (
          <button
            onClick={onBatchApprove}
            className="btn-shine btn-interactive inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/25 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Batch Approve ({pendingCount})
          </button>
        )}
      </div>

      {/* Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: registrations.length, icon: Users, color: 'blue' },
          { label: 'Pending', value: pendingCount, icon: AlertCircle, color: 'amber' },
          { label: 'Approved', value: approvedCount, icon: UserCheck, color: 'emerald' },
          { label: 'Declined', value: declinedCount, icon: XCircle, color: 'rose' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`bg-white rounded-xl border border-slate-200 p-3 sm:p-4 flex items-center gap-3 shadow-2xs cursor-pointer hover:shadow-md transition-all`}
            onClick={() => setFilterStatus(label as StatusTab)}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              color === 'blue' ? 'bg-blue-100 text-blue-600' :
              color === 'amber' ? 'bg-amber-100 text-amber-600' :
              color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
              'bg-rose-100 text-rose-600'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">{value}</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {STATUS_TABS.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
              {statusCounts[st] > 0 && st !== 'All' && (
                <span className={`ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full ${
                  st === 'Pending' ? 'bg-amber-500 text-white' :
                  st === 'Approved' ? 'bg-emerald-500 text-white' :
                  'bg-rose-500 text-white'
                }`}>
                  {statusCounts[st]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicant, club..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-400 outline-hidden hover:border-slate-300 transition-colors w-52"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-5">Applicant / Team</th>
                <th className="py-3 px-3">Tournament</th>
                <th className="py-3 px-3">College / Dept</th>
                <th className="py-3 px-3">Docs</th>
                <th className="py-3 px-3">Fee</th>
                <th className="py-3 px-5 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                        {reg.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {reg.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{reg.sport}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 max-w-[140px] truncate">{reg.tournament}</td>
                  <td className="py-3.5 px-3 text-slate-700">{reg.teamOrCollege}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 font-semibold ${
                      reg.documentsStatus.includes('✓')
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}>
                      {reg.documentsStatus.includes('✓') ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {reg.documentsStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      Paid ₹{reg.feeAmount}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {reg.status === 'Pending' ? (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => onDecision(reg.id, 'Approved')}
                          className="btn-interactive px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 cursor-pointer shadow-2xs text-[11px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onDecision(reg.id, 'Declined')}
                          className="btn-interactive px-2.5 py-1 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 border border-rose-200 cursor-pointer text-[11px]"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onOpenReviewModal(reg)}
                          className="btn-interactive px-2.5 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 cursor-pointer text-[11px]"
                        >
                          Inspect
                        </button>
                      </div>
                    ) : reg.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Pass Issued
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-xs bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Declined
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-600">No registrations found</p>
              <p className="text-xs text-slate-400 mt-1">Try changing filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
