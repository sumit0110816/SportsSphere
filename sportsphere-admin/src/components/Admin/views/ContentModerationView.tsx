import React, { useState } from 'react';
import {
  ShieldAlert,
  Trash2,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import type { ModerationItem } from '../../../types/admin';

interface ContentModerationViewProps {
  items: ModerationItem[];
  theme: 'light' | 'dark';
  onResolve: (id: string, decision: ModerationItem['status'], comment?: string) => void;
}

export const ContentModerationView: React.FC<ContentModerationViewProps> = ({
  items,
  theme,
  onResolve,
}) => {
  const isDark = theme === 'dark';
  const [tab, setTab] = useState<'pending' | 'removed' | 'approved'>('pending');
  const [previewMedia, setPreviewMedia] = useState<ModerationItem | null>(null);

  const filtered = items.filter((item) => {
    if (tab === 'pending') return item.status === 'pending';
    if (tab === 'removed') return item.status === 'removed' || item.status === 'warning_issued';
    return item.status === 'approved';
  });

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
            <ShieldAlert size={18} color="#EF4444" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Content Moderation & Flagged Reels Triage
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Review flagged athletic highlight clips, suspicious timing claims, and community reports against platform standards.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pending', 'removed', 'approved'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: tab === t ? '1px solid #EF4444' : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: tab === t ? '#EF4444' : isDark ? '#0F172A' : '#F8FAFC',
                color: tab === t ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                cursor: 'pointer',
              }}
            >
              {t} ({items.filter((i) => (t === 'pending' ? i.status === 'pending' : t === 'removed' ? i.status === 'removed' : i.status === 'approved')).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Moderation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
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
                  <div style={{ fontWeight: 700, fontSize: '14px', color: isDark ? '#F1F5F9' : '#0F172A' }}>
                    Author: {item.authorName} ({item.authorRole})
                  </div>
                  <div style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    Reported by {item.reportedBy} • {item.reportedCount} Flags
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.type}
                </span>
              </div>

              {/* Media Thumbnail or Quote */}
              {item.thumbnailUrl && (
                <div
                  onClick={() => setPreviewMedia(item)}
                  style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt="Media preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Eye size={14} /> Preview Media
                    </div>
                  </div>
                </div>
              )}

              {/* Caption & Reason Box */}
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
                  <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontWeight: 500 }}>Caption: </span>
                  <span style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>"{item.caption}"</span>
                </div>
                <div style={{ marginTop: '4px', color: '#EF4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={13} />
                  <span>Violation: {item.flagReason}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {item.status === 'pending' && (
              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <button
                  onClick={() => onResolve(item.id, 'removed', 'Violated integrity guidelines')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#EF4444',
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
                  <Trash2 size={13} />
                  Takedown Media
                </button>
                <button
                  onClick={() => onResolve(item.id, 'warning_issued', 'Official caution sent to athlete')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? '#1E293B' : '#FFFBEB',
                    border: `1px solid ${isDark ? '#334155' : '#FDE68A'}`,
                    color: '#D97706',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle size={13} />
                  Issue Warning
                </button>
                <button
                  onClick={() => onResolve(item.id, 'approved', 'Dismissed false report')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: isDark ? '#1E293B' : '#ECFDF5',
                    border: `1px solid ${isDark ? '#334155' : '#A7F3D0'}`,
                    color: '#059669',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
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
            No content moderation items pending review.
          </div>
        )}
      </div>

      {/* Media Fullscreen Preview */}
      {previewMedia && (
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
          onClick={() => setPreviewMedia(null)}
        >
          <div
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '14px',
              overflow: 'hidden',
              maxWidth: '640px',
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
                Inspecting Flagged Reel: {previewMedia.authorName}
              </span>
              <button
                onClick={() => setPreviewMedia(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              {previewMedia.thumbnailUrl && (
                <img
                  src={previewMedia.thumbnailUrl}
                  alt="Review"
                  style={{ maxWidth: '100%', maxHeight: '65vh', borderRadius: '8px' }}
                />
              )}
              <p style={{ marginTop: '12px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#334155' }}>
                Caption: "{previewMedia.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
