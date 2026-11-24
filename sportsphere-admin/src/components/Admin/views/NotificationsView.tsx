import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
} from 'lucide-react';
import type { AdminNotification } from '../../../types/admin';

interface NotificationsViewProps {
  notifications: AdminNotification[];
  theme: 'light' | 'dark';
  onSend: (notif: Omit<AdminNotification, 'id' | 'sentAt' | 'readCount'>) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  theme,
  onSend,
}) => {
  const isDark = theme === 'dark';
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetAudience, setTargetAudience] = useState<AdminNotification['targetAudience']>('all');
  const [type, setType] = useState<AdminNotification['type']>('announcement');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onSend({
      title: title.trim(),
      body: body.trim(),
      targetAudience,
      type,
      sentBy: 'admin@sportsync.io',
    });

    setTitle('');
    setBody('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Bell size={18} color="#3B82F6" />
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Ecosystem Announcements & Target Audience Broadcasts
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
          Broadcast official sanctioning announcements, rules updates, and urgent alerts across the Athlete, Coach, and Organizer dashboards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Compose Form */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            padding: '22px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Compose New Platform Notification
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                Announcement Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2026 All-India Inter-University Athletics Circuit Open"
                required
                style={{
                  width: '100%',
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    color: isDark ? '#F1F5F9' : '#0F172A',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Portals (Everyone)</option>
                  <option value="athletes">Athletes Only (:3000)</option>
                  <option value="coaches">Coaches Only (:3002)</option>
                  <option value="organizers">Organizers Only (:3001)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                  Notification Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                    color: isDark ? '#F1F5F9' : '#0F172A',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="announcement">Announcement</option>
                  <option value="security">Security & Rules</option>
                  <option value="approval">Approval Notice</option>
                  <option value="urgent">Urgent Warning</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                Notification Body / Content
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Full broadcast text to be displayed in notification bells and dashboard feeds..."
                required
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  color: isDark ? '#F1F5F9' : '#0F172A',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '4px',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#2563EB',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Send size={14} />
              Broadcast Notification
            </button>

            {isSuccess && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  border: '1px solid #A7F3D0',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={14} /> Broadcast sent successfully!
              </div>
            )}
          </form>
        </div>

        {/* Sent History */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            padding: '22px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Broadcast History ({notifications.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: isDark ? '#F1F5F9' : '#0F172A' }}>
                    {n.title}
                  </div>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#2563EB15',
                      color: '#2563EB',
                      textTransform: 'uppercase',
                    }}
                  >
                    {n.targetAudience}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '6px' }}>
                  {n.body}
                </div>
                <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#94A3B8' }}>
                  Sent on {new Date(n.sentAt).toLocaleDateString()} • {n.readCount} deliveries logged
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
