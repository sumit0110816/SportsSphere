import React from 'react';
import { X, CheckCircle, AlertCircle, FileText, DollarSign, Shield } from 'lucide-react';
import { RegistrationApplicant } from '../../types';

interface ReviewApplicantModalProps {
  applicant: RegistrationApplicant | null;
  isOpen: boolean;
  onClose: () => void;
  onDecision: (id: string, decision: 'Approved' | 'Declined') => void;
}

export const ReviewApplicantModal: React.FC<ReviewApplicantModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onDecision,
}) => {
  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fade-in text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Review Athlete Registration</h4>
                <div className="text-[10px] text-slate-400">Identity &amp; Medical Clearance</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-press p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900 text-sm">{applicant.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tournament:</span>
                <span className="font-semibold text-slate-800">{applicant.tournament}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">College / Club:</span>
                <span className="font-semibold text-slate-800">{applicant.teamOrCollege}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Registration Fee:</span>
                <span className="font-bold text-emerald-600">₹{applicant.feeAmount} ({applicant.feeStatus})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Verification Status:</span>
                <span className="text-emerald-700 font-semibold">{applicant.documentsStatus}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Approving this registration will automatically issue an official QR-coded athlete pass and seed them into the tournament bracket.
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onDecision(applicant.id, 'Declined');
                onClose();
              }}
              className="btn-interactive py-2.5 px-3 text-xs font-semibold rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              Decline Application
            </button>
            <button
              onClick={() => {
                onDecision(applicant.id, 'Approved');
                onClose();
              }}
              className="btn-interactive btn-shine py-2.5 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              Approve &amp; Issue Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
