import React, { useState } from 'react';
import {
  AlertTriangle,
} from 'lucide-react';
import type { ReportComplaint } from '../../../types/admin';

interface ReportsComplaintsViewProps {
  reports: ReportComplaint[];
  theme: 'light' | 'dark';
  onUpdateStatus: (id: string, status: ReportComplaint['status'], notes?: string) => void;
}

export const ReportsComplaintsView: React.FC<ReportsComplaintsViewProps> = ({
  reports,
  theme,
  onUpdateStatus,
}) => {
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ReportComplaint | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const filtered = reports.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  const handleSaveNotes = () => {
    if (!selectedReport) return;
    onUpdateStatus(selectedReport.id, 'investigating', adminNote);
    setSelectedReport(null);
    setAdminNote('');
  };

  const getPriorityBadge = (p: ReportComplaint['priority']) => {
    const map = {
      urgent: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
      high: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
      medium: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
      low: { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
    };
    const s = map[p] || map.low;
    return (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '2px 7px',
          borderRadius: '4px',
          backgroundColor: isDark ? '#0F172A' : s.bg,
          color: s.text,
          border: `1px solid ${s.border}`,
        }}
      >
        {p}
      </span>
    );
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
            <AlertTriangle size={18} color="#DC2626" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Platform Reports, Complaints & Fraud Inquiries
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Investigate fraudulent organizers, unregistered cash tournament fees, fake profiles, and athlete harassment cases.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Complaints' },
            { id: 'fraudulent_organizer', label: 'Fraud Organizers' },
            { id: 'fake_tournament', label: 'Fake Tourneys' },
            { id: 'misleading_record', label: 'Misleading PRs' },
            { id: 'harassment', label: 'Harassment' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: selectedCategory === cat.id ? '1px solid #DC2626' : `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: selectedCategory === cat.id ? '#DC2626' : isDark ? '#0F172A' : '#F8FAFC',
                color: selectedCategory === cat.id ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  color: isDark ? '#94A3B8' : '#64748B',
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '14px 18px' }}>Priority</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Target Entity</th>
                <th style={{ padding: '14px 18px' }}>Complaint Summary</th>
                <th style={{ padding: '14px 18px' }}>Reporter</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rep) => (
                <tr
                  key={rep.id}
                  style={{
                    borderBottom: `1px solid ${isDark ? '#2D3748' : '#F1F5F9'}`,
                    color: isDark ? '#E2E8F0' : '#1E293B',
                  }}
                >
                  <td style={{ padding: '14px 18px' }}>{getPriorityBadge(rep.priority)}</td>

                  <td style={{ padding: '14px 18px', fontWeight: 600, textTransform: 'capitalize' }}>
                    {rep.category.replace('_', ' ')}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#0F172A' }}>
                      {rep.targetEntityName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>ID: {rep.targetEntityId}</div>
                  </td>

                  <td style={{ padding: '14px 18px', maxWidth: '320px' }}>
                    <div style={{ fontSize: '12.5px', color: isDark ? '#CBD5E1' : '#334155' }}>
                      {rep.description}
                    </div>
                    {rep.adminNotes && (
                      <div style={{ marginTop: '4px', fontSize: '11.5px', color: '#2563EB', fontWeight: 500 }}>
                        Internal Note: {rep.adminNotes}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 500 }}>{rep.reporterName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{rep.reporterEmail}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        backgroundColor:
                          rep.status === 'resolved'
                            ? '#ECFDF5'
                            : rep.status === 'investigating'
                            ? '#EFF6FF'
                            : '#FEF2F2',
                        color:
                          rep.status === 'resolved'
                            ? '#059669'
                            : rep.status === 'investigating'
                            ? '#2563EB'
                            : '#DC2626',
                      }}
                    >
                      {rep.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setAdminNote(rep.adminNotes || '');
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
                          border: `1px solid ${isDark ? '#334155' : '#BFDBFE'}`,
                          color: '#2563EB',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => onUpdateStatus(rep.id, 'resolved', 'Resolved by admin intervention')}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#10B981',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Notes Modal */}
      {selectedReport && (
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
              Investigation Notes for Report #{selectedReport.id}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Add confidential administrative notes regarding university contact, verification status, or action taken:
            </p>

            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Dean of Student Affairs confirmed organizer was unauthorized; account suspended."
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
                onClick={() => setSelectedReport(null)}
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
                onClick={handleSaveNotes}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#2563EB',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Notes & Set Investigating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
