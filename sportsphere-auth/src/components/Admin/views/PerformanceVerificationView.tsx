import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Wind,
  UserCheck,
} from 'lucide-react';
import type { PerformanceClaim } from '../../../types/admin';

interface PerformanceVerificationViewProps {
  claims: PerformanceClaim[];
  theme: 'light' | 'dark';
  onVerify: (id: string, notes?: string) => void;
  onDispute: (id: string, reason: string) => void;
}

export const PerformanceVerificationView: React.FC<PerformanceVerificationViewProps> = ({
  claims,
  theme,
  onVerify,
  onDispute,
}) => {
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'pending' | 'verified' | 'disputed'>('pending');
  const [disputeModalClaim, setDisputeModalClaim] = useState<PerformanceClaim | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  const filtered = claims.filter((c) => c.status === tab);

  const handleConfirmDispute = () => {
    if (!disputeModalClaim || !disputeReason.trim()) return;
    onDispute(disputeModalClaim.id, disputeReason.trim());
    setDisputeModalClaim(null);
    setDisputeReason('');
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
            <Activity size={18} color="#3B82F6" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Athlete Performance & Leaderboard Record Verification
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Verify electronic FAT (Fully Automatic Timing) telemetry, wind legal metrics (&lt; +2.0m/s), and coach attestations before granting verified badges to athlete personal records.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pending', 'verified', 'disputed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: tab === t ? '1px solid #3B82F6' : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: tab === t ? '#3B82F6' : isDark ? '#0F172A' : '#F8FAFC',
                color: tab === t ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                cursor: 'pointer',
              }}
            >
              {t} ({claims.filter((c) => c.status === t).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Claims */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filtered.map((claim) => (
          <div
            key={claim.id}
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '12px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F172A' }}>
                    {claim.athleteName}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600 }}>
                    {claim.college}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#10B981',
                    backgroundColor: isDark ? '#0F172A' : '#ECFDF5',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  {claim.claimedValue}
                </div>
              </div>

              {/* Detail Metrics */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                  fontSize: '12.5px',
                }}
              >
                <div>
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Event: </span>
                  <span style={{ fontWeight: 700, color: isDark ? '#E2E8F0' : '#1E293B' }}>{claim.sport} - {claim.event}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="#3B82F6" />
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Timing Method: </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: claim.timingMethod === 'FAT' ? '#10B981' : '#F59E0B',
                    }}
                  >
                    {claim.timingMethod} {claim.timingMethod === 'FAT' ? '(Fully Automatic Timing)' : '(Manual Hand-Clocked)'}
                  </span>
                </div>
                {claim.windAssist && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wind size={13} color="#64748B" />
                    <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Wind: </span>
                    <span style={{ fontWeight: 600, color: isDark ? '#CBD5E1' : '#334155' }}>{claim.windAssist}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={13} color="#10B981" />
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Coach Signoff: </span>
                  <span style={{ fontWeight: 600, color: isDark ? '#CBD5E1' : '#334155' }}>{claim.coachName}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Venue: {claim.venue} ({claim.date})
                </div>
              </div>

              {claim.disputeReason && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    fontSize: '11.5px',
                    color: '#EF4444',
                  }}
                >
                  <strong>Dispute Note:</strong> {claim.disputeReason}
                </div>
              )}
            </div>

            {/* Actions */}
            {claim.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <button
                  onClick={() => setDisputeModalClaim(claim)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? '#1E293B' : '#FEF2F2',
                    border: `1px solid ${isDark ? '#334155' : '#FECACA'}`,
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertOctagon size={13} />
                  Flag Dispute
                </button>
                <button
                  onClick={() => onVerify(claim.id, 'Verified electronic timing sensors')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#10B981',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={13} />
                  Verify Record
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
            No performance records in this queue.
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {disputeModalClaim && (
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
              Dispute Athlete Record: {disputeModalClaim.athleteName} ({disputeModalClaim.claimedValue})
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Specify why this record is being challenged (e.g. stop-watch manual error, uncertified coach signoff):
            </p>

            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="e.g. Disputed due to absence of certified electronic finish-line camera equipment."
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
                onClick={() => setDisputeModalClaim(null)}
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
                onClick={handleConfirmDispute}
                disabled={!disputeReason.trim()}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: disputeReason.trim() ? 1 : 0.6,
                }}
              >
                Register Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
