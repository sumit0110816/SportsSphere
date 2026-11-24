import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  School,
  Mail,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import type { OrganizerApplication } from '../../../types/admin';

interface OrganizerVerificationViewProps {
  applications: OrganizerApplication[];
  theme: 'light' | 'dark';
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onSuspend: (id: string, reason: string) => void;
}

export const OrganizerVerificationView: React.FC<OrganizerVerificationViewProps> = ({
  applications,
  theme,
  onApprove,
  onReject,
  onSuspend,
}) => {
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'suspended'>('pending');
  const [rejectModalApp, setRejectModalApp] = useState<OrganizerApplication | null>(null);
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
            <Building2 size={18} color="#2563EB" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Collegiate Organizer Authorization & NOC Vetting
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            There is no separate College Admin portal. The SportSync Platform Admin directly verifies student organizers against Dean / Sports Council NOC letters.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pending', 'approved', 'rejected', 'suspended'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: tab === t ? '1px solid #2563EB' : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: tab === t ? '#2563EB' : isDark ? '#0F172A' : '#F8FAFC',
                color: tab === t ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                cursor: 'pointer',
              }}
            >
              {t} ({applications.filter((a) => a.status === t).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: '18px' }}>
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
                  <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600 }}>
                    ID: {app.studentId}
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
                        : app.status === 'suspended'
                        ? '#FEF2F2'
                        : '#FFFBEB',
                    color:
                      app.status === 'approved'
                        ? '#059669'
                        : app.status === 'rejected' || app.status === 'suspended'
                        ? '#DC2626'
                        : '#D97706',
                    textTransform: 'uppercase',
                  }}
                >
                  {app.status}
                </span>
              </div>

              {/* Verified College Affiliation Box */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <School size={14} color="#2563EB" />
                  <span style={{ fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F172A' }}>{app.collegeName}</span>
                </div>
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>Department: </span>
                  <span style={{ fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B' }}>{app.department}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color={isDark ? '#94A3B8' : '#64748B'} />
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>{app.collegeEmail}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color={isDark ? '#94A3B8' : '#64748B'} />
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>{app.phone}</span>
                </div>
              </div>

              {/* NOC Letter and Verification Documents */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: isDark ? '#94A3B8' : '#64748B', marginBottom: '6px' }}>
                  DEAN / SPORTS COUNCIL AUTHORIZATION NOC ({app.documents.length})
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
            {app.status === 'pending' ? (
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
                  onClick={() => onApprove(app.id, `Authorized for ${app.collegeName}`)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
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
                  Authorize Organizer
                </button>
              </div>
            ) : app.status === 'approved' ? (
              <div style={{ paddingTop: '10px', borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <button
                  onClick={() => onSuspend(app.id, 'Organizer role suspended by admin')}
                  style={{
                    width: '100%',
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
                    gap: '6px',
                  }}
                >
                  <ShieldAlert size={14} />
                  Revoke / Suspend Organizer Permissions
                </button>
              </div>
            ) : null}
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
            No {tab} organizer applications found in this queue.
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
              Reject Organizer Application: {rejectModalApp.fullName}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Specify the reason (e.g. Dean NOC letter invalid or student email unverified):
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. NOC letter requires official institution seal and signature of Dean of Student Affairs."
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
