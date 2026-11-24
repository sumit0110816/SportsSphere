import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Award,
} from 'lucide-react';
import type { CoachApplication } from '../../../types/admin';

interface CoachVerificationViewProps {
  applications: CoachApplication[];
  theme: 'light' | 'dark';
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
}

export const CoachVerificationView: React.FC<CoachVerificationViewProps> = ({
  applications,
  theme,
  onApprove,
  onReject,
}) => {
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectModalApp, setRejectModalApp] = useState<CoachApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [docPreview, setDocPreview] = useState<{ name: string; url: string } | null>(null);

  const filtered = applications.filter((app) => app.status === tab);

  const handleConfirmReject = () => {
    if (!rejectModalApp || !rejectReason.trim()) return;
    onReject(rejectModalApp.id, rejectReason.trim());
    setRejectModalApp(null);
    setRejectReason('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Information Header */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={18} color="#10B981" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              AFI & Federation Coach Accreditation Registry
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Verify coaching licenses, track federation certification credentials, and grant coach workspace privileges.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pending', 'approved', 'rejected'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: tab === t ? '1px solid #10B981' : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: tab === t ? '#10B981' : isDark ? '#0F172A' : '#F8FAFC',
                color: tab === t ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                cursor: 'pointer',
              }}
            >
              {t} ({applications.filter((a) => a.status === t).length})
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filtered.map((app) => (
          <div
            key={app.id}
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '12px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                    {app.fullName}
                  </h3>
                  <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    {app.email}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    backgroundColor:
                      app.status === 'approved'
                        ? '#ECFDF5'
                        : app.status === 'rejected'
                        ? '#FEF2F2'
                        : '#FFFBEB',
                    color:
                      app.status === 'approved'
                        ? '#059669'
                        : app.status === 'rejected'
                        ? '#DC2626'
                        : '#D97706',
                    textTransform: 'uppercase',
                  }}
                >
                  {app.status}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                  fontSize: '12.5px',
                }}
              >
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>Sport Discipline: </span>
                  <span style={{ fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B' }}>{app.sport}</span>
                </div>
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>Institution / Org: </span>
                  <span style={{ fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B' }}>{app.collegeOrOrg}</span>
                </div>
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>License / Reg No: </span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>{app.licenseNo}</span>
                </div>
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>Certifications: </span>
                  <span style={{ fontWeight: 500, color: isDark ? '#CBD5E1' : '#334155' }}>{app.certification}</span>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: isDark ? '#94A3B8' : '#64748B', marginBottom: '6px' }}>
                  UPLOADED VERIFICATION CERTIFICATES ({app.documents.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {app.documents.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDocPreview({ name: doc.name, url: doc.url })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: isDark ? '#172033' : '#F1F5F9',
                        border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                        color: '#2563EB',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} />
                        {doc.name}
                      </span>
                      <ExternalLink size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {app.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <button
                  onClick={() => setRejectModalApp(app)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#0F172A' : '#FEF2F2',
                    border: `1px solid ${isDark ? '#334155' : '#FECACA'}`,
                    color: '#DC2626',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <XCircle size={14} />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(app.id, 'Verified AFI credentials')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={14} />
                  Approve Coach
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '12px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              color: isDark ? '#94A3B8' : '#64748B',
            }}
          >
            No {tab} coach applications found in this queue.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '14px',
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Reject Coach Application: {rejectModalApp.fullName}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Please provide a clear reason for rejecting or requesting document re-upload:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. AFI Level 2 license number expired, or university seal missing from authorization letter."
              rows={4}
              style={{
                width: '100%',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                color: isDark ? '#F1F5F9' : '#0F172A',
                padding: '10px 12px',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '18px',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRejectModalApp(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                  color: isDark ? '#E2E8F0' : '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: rejectReason.trim() ? 1 : 0.6,
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {docPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: '24px',
          }}
          onClick={() => setDocPreview(null)}
        >
          <div
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '14px',
              overflow: 'hidden',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                Preview Document: {docPreview.name}
              </span>
              <button
                onClick={() => setDocPreview(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDark ? '#94A3B8' : '#64748B',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', textAlign: 'center' }}>
              <img
                src={docPreview.url}
                alt={docPreview.name}
                style={{
                  maxWidth: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
