import React, { useState } from 'react';
import {
  FileText,
  Search,
  Lock,
} from 'lucide-react';
import type { AuditLog } from '../../../types/admin';

interface AuditLogsViewProps {
  logs: AuditLog[];
  theme: 'light' | 'dark';
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, theme }) => {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.targetName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'all' ? true : log.action === actionFilter;
    return matchesSearch && matchesAction;
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
            <FileText size={18} color="#3B82F6" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Immutable Administrative Security & Audit Logs
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Every role change, coach approval, student organizer authorization, tournament rejection, and refund is cryptographically signed and logged.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
            border: `1px solid ${isDark ? '#334155' : '#BFDBFE'}`,
            fontSize: '12px',
            color: '#2563EB',
            fontWeight: 600,
          }}
        >
          <Lock size={13} />
          Tamper-Evident SHA-256 Storage
        </div>
      </div>

      {/* Filter and Search */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 20px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
          />
          <input
            type="text"
            placeholder="Search audit trail by admin, target, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px 0 36px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              color: isDark ? '#F1F5F9' : '#0F172A',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '8px',
            border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            color: isDark ? '#F1F5F9' : '#0F172A',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Action Types</option>
          <option value="ROLE_CHANGE">ROLE_CHANGE</option>
          <option value="COACH_APPROVAL">COACH_APPROVAL</option>
          <option value="ORGANIZER_APPROVAL">ORGANIZER_APPROVAL</option>
          <option value="EVENT_APPROVAL">EVENT_APPROVAL</option>
          <option value="ACCOUNT_SUSPENSION">ACCOUNT_SUSPENSION</option>
          <option value="REFUND_PROCESSED">REFUND_PROCESSED</option>
        </select>
      </div>

      {/* Audit Log Table */}
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
                <th style={{ padding: '14px 18px' }}>Timestamp</th>
                <th style={{ padding: '14px 18px' }}>Action</th>
                <th style={{ padding: '14px 18px' }}>Target Entity</th>
                <th style={{ padding: '14px 18px' }}>Admin Operator</th>
                <th style={{ padding: '14px 18px' }}>Details & Context</th>
                <th style={{ padding: '14px 18px' }}>Source IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: `1px solid ${isDark ? '#2D3748' : '#F1F5F9'}`,
                    color: isDark ? '#E2E8F0' : '#1E293B',
                  }}
                >
                  <td style={{ padding: '14px 18px', color: isDark ? '#94A3B8' : '#64748B', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '3px 7px',
                        borderRadius: '4px',
                        backgroundColor: '#3B82F615',
                        color: '#2563EB',
                        border: '1px solid #3B82F633',
                        fontFamily: 'monospace',
                      }}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#0F172A' }}>{log.targetName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Type: {log.targetType}</div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 500 }}>{log.adminEmail}</div>
                  </td>

                  <td style={{ padding: '14px 18px', maxWidth: '340px' }}>
                    <div style={{ fontSize: '12.5px', color: isDark ? '#CBD5E1' : '#334155' }}>
                      {log.details}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px', fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace' }}>
                    {log.ipAddress || '127.0.0.1'}
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
