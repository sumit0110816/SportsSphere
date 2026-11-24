import React from 'react';
import {
  Settings,
} from 'lucide-react';
import { firebaseConfig, isFirebaseConfigured } from '../../../firebase/config';

interface SettingsViewProps {
  theme: 'light' | 'dark';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const isLive = isFirebaseConfigured();

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
          <Settings size={18} color="#2563EB" />
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            System & Cloud Infrastructure Configuration
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
          Real-time status of Firebase project resources, Cloud Firestore rules, media storage buckets, and payment webhooks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Firebase Config Card */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            padding: '22px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Firebase Project & Auth Credentials
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '999px',
                backgroundColor: isLive ? '#ECFDF5' : '#FFFBEB',
                color: isLive ? '#059669' : '#D97706',
              }}
            >
              {isLive ? 'Connected' : 'Fallback Emulation'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              padding: '14px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: '#64748B' }}>Project ID: </span>
              <span style={{ color: isDark ? '#F1F5F9' : '#0F172A', fontWeight: 600 }}>
                {firebaseConfig.projectId || 'sportsphere-default'}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Auth Domain: </span>
              <span style={{ color: isDark ? '#F1F5F9' : '#0F172A' }}>
                {firebaseConfig.authDomain || 'sportsphere-default.firebaseapp.com'}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Storage Bucket: </span>
              <span style={{ color: isDark ? '#F1F5F9' : '#0F172A' }}>
                {firebaseConfig.storageBucket || 'sportsphere-default.appspot.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Port Ecosystem Routing Rules */}
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '12px',
            padding: '22px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Port Allocation Architecture
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
              <span>Port 3000: Student Athlete Dashboard</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
              <span>Port 3001: Tournament Organizer Studio</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
              <span>Port 3002: Coach Platform & Scouting</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
              <span>Port 3003: Central Admin Governance Console</span>
              <span style={{ fontWeight: 700, color: '#2563EB' }}>Super Admin (This App)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
