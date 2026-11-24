import React from 'react';
import {
  BarChart3,
} from 'lucide-react';
import type { PlatformStats } from '../../../types/admin';

interface AnalyticsViewProps {
  stats: PlatformStats;
  theme: 'light' | 'dark';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats: _stats, theme }) => {
  const isDark = theme === 'dark';

  const colleges = [
    { name: 'IIT Delhi', athletes: 142, tournamentsHosted: 3, points: 1840 },
    { name: 'BITS Pilani', athletes: 128, tournamentsHosted: 4, points: 1720 },
    { name: 'Delhi University', athletes: 210, tournamentsHosted: 2, points: 1650 },
    { name: 'Anna University Chennai', athletes: 115, tournamentsHosted: 2, points: 1490 },
    { name: 'SPIT Mumbai', athletes: 94, tournamentsHosted: 2, points: 1220 },
    { name: 'IIT Madras', athletes: 108, tournamentsHosted: 1, points: 1180 },
  ];

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
            <BarChart3 size={18} color="#8B5CF6" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Inter-Collegiate Athletics Performance & Analytics
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Comprehensive institutional engagement data, multi-sport circuit adoption, and regional tournament metrics.
          </p>
        </div>
      </div>

      {/* Top Performing Colleges Ranking Table */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            All-India Inter-University Points Table & Active Institutions
          </h3>
        </div>
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
                <th style={{ padding: '14px 18px' }}>Rank</th>
                <th style={{ padding: '14px 18px' }}>University / Institution</th>
                <th style={{ padding: '14px 18px' }}>Enrolled Athletes</th>
                <th style={{ padding: '14px 18px' }}>Tournaments Hosted</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Circuit Points</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((col, idx) => (
                <tr
                  key={col.name}
                  style={{
                    borderBottom: `1px solid ${isDark ? '#2D3748' : '#F1F5F9'}`,
                    color: isDark ? '#E2E8F0' : '#1E293B',
                  }}
                >
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: idx < 3 ? '#F59E0B' : '#64748B' }}>
                    #{idx + 1}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>{col.name}</td>
                  <td style={{ padding: '14px 18px' }}>{col.athletes} Athletes</td>
                  <td style={{ padding: '14px 18px' }}>{col.tournamentsHosted} Major Events</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: '#2563EB' }}>
                    {col.points} pts
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
