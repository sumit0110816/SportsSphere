import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  PauseCircle,
} from 'lucide-react';
import type { TournamentEvent } from '../../../types/admin';

interface EventApprovalsViewProps {
  events: TournamentEvent[];
  theme: 'light' | 'dark';
  onUpdateStatus: (id: string, status: TournamentEvent['status'], reason?: string) => void;
}

export const EventApprovalsView: React.FC<EventApprovalsViewProps> = ({
  events,
  theme,
  onUpdateStatus,
}) => {
  const isDark = theme === 'dark';
  const [filterStatus, setFilterStatus] = useState<'all' | TournamentEvent['status']>('all');
  const [rejectModalEvent, setRejectModalEvent] = useState<TournamentEvent | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  const filteredEvents =
    filterStatus === 'all' ? events : events.filter((e) => e.status === filterStatus);

  const handleConfirmReject = () => {
    if (!rejectModalEvent || !rejectReason.trim()) return;
    onUpdateStatus(rejectModalEvent.id, 'rejected', rejectReason.trim());
    setRejectModalEvent(null);
    setRejectReason('');
  };

  const getStatusBadge = (status: TournamentEvent['status']) => {
    const map: Record<TournamentEvent['status'], { bg: string; text: string; border: string }> = {
      draft: { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
      pending: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
      approved: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
      published: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
      rejected: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
      cancelled: { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5' },
    };
    const s = map[status] || map.draft;
    return (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: '999px',
          backgroundColor: isDark ? '#0F172A' : s.bg,
          color: s.text,
          border: `1px solid ${s.border}`,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Filter */}
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
            <Trophy size={18} color="#F59E0B" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Tournament & Event Sanctioning Board
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            All inter-collegiate tournaments created by student organizers must receive official Platform Admin sanctioning before being published on the Athlete Portal (Port 3000).
          </p>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['all', 'pending', 'published', 'rejected', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: filterStatus === st ? '1px solid #2563EB' : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: filterStatus === st ? '#2563EB' : isDark ? '#0F172A' : '#F8FAFC',
                color: filterStatus === st ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                cursor: 'pointer',
              }}
            >
              {st} ({st === 'all' ? events.length : events.filter((e) => e.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '14px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Poster & Header */}
            <div style={{ position: 'relative', height: '140px', backgroundColor: '#0F172A' }}>
              <img
                src={evt.posterUrl}
                alt={evt.title}
                onClick={() => setSelectedPoster(evt.posterUrl)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.85,
                  cursor: 'pointer',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '6px',
                }}
              >
                {getStatusBadge(evt.status)}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '14px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: '#60A5FA',
                  fontWeight: 700,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {evt.circuitTier} Circuit
              </div>
            </div>

            {/* Event Content Details */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {evt.title}
                </h3>
                <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600 }}>
                  {evt.sport} • Organized by {evt.organizerName}
                </div>
              </div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#CBD5E1' : '#334155' }}>
                  <MapPin size={14} color="#64748B" />
                  <span>{evt.venue}, {evt.city}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#CBD5E1' : '#334155' }}>
                  <Calendar size={14} color="#64748B" />
                  <span>{evt.dates.start} to {evt.dates.end}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Entry Fee: </span>
                    <span style={{ fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F172A' }}>₹{evt.registrationFee}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Prize Pool: </span>
                    <span style={{ fontWeight: 700, color: '#10B981' }}>{evt.prizePool}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Capacity: </span>
                    <span style={{ fontWeight: 700, color: '#3B82F6' }}>{evt.registeredCount}/{evt.maxTeams}</span>
                  </div>
                </div>
              </div>

              {evt.rejectionReason && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    fontSize: '11.5px',
                    color: '#EF4444',
                  }}
                >
                  <strong>Admin Feedback:</strong> {evt.rejectionReason}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                display: 'flex',
                gap: '8px',
              }}
            >
              {evt.status === 'pending' ? (
                <>
                  <button
                    onClick={() => setRejectModalEvent(evt)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
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
                    <XCircle size={14} />
                    Reject
                  </button>
                  <button
                    onClick={() => onUpdateStatus(evt.id, 'published', 'Sanctioned & Published by Admin')}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
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
                    <CheckCircle2 size={14} />
                    Sanction & Publish
                  </button>
                </>
              ) : evt.status === 'published' ? (
                <button
                  onClick={() => onUpdateStatus(evt.id, 'cancelled', 'Tournament cancelled by admin safety decree')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#1E293B' : '#FEF2F2',
                    border: `1px solid ${isDark ? '#334155' : '#FECACA'}`,
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <PauseCircle size={14} />
                  Suspend / Cancel Tournament
                </button>
              ) : (
                <button
                  onClick={() => onUpdateStatus(evt.id, 'published', 'Reinstated by Admin')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                    border: `1px solid ${isDark ? '#334155' : '#BFDBFE'}`,
                    color: '#2563EB',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Re-publish to Athlete Portal
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
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
            No tournaments found in this filter status.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalEvent && (
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
              Reject Tournament: {rejectModalEvent.title}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              State reasons for rejection or requested corrections (e.g. venue agreement missing, registration fees non-compliant with AIU standards):
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Tournament dates clash with South Zone Inter-University trials; please revise dates."
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
                onClick={() => setRejectModalEvent(null)}
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

      {/* Poster Preview Modal */}
      {selectedPoster && (
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
          onClick={() => setSelectedPoster(null)}
        >
          <div
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '14px',
              overflow: 'hidden',
              maxWidth: '600px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                Tournament Poster Preview
              </span>
              <button
                onClick={() => setSelectedPoster(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <img src={selectedPoster} alt="Poster" style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
