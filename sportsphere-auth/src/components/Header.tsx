import React, { useState } from 'react';
import { Sparkles, ExternalLink, ShieldCheck, Trophy, Dumbbell, GraduationCap, Flame } from 'lucide-react';
import type { UserRole } from '../types/auth';
import { isFirebaseConfigured, firebaseConfig } from '../firebase/config';
import { FirebaseConfigModal } from './FirebaseConfigModal';

interface HeaderProps {
  currentRole: UserRole | null;
  mode: 'signup' | 'login';
  onToggleMode: (mode: 'signup' | 'login') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, mode, onToggleMode }) => {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const isConnected = isFirebaseConfigured();

  return (
    <>
      <header style={{
        width: '100%',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 20,
        borderBottom: '1px solid #E2E8F0',
        backdropFilter: 'blur(16px)',
        background: 'rgba(255, 255, 255, 0.92)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Brand logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0F172A'
              }}>
                SPORTSPHERE
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#ECFEFF',
                color: '#0891B2',
                border: '1px solid rgba(8, 145, 178, 0.3)'
              }}>
                AUTH PORTAL
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', margin: 0, fontWeight: 500 }}>
              Unified Sports Ecosystem {currentRole ? `• ${currentRole.toUpperCase()}` : '• Single Sign-On'}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="dash-jump-bar">
          {/* Firebase Status Badge */}
          <button
            type="button"
            onClick={() => setConfigModalOpen(true)}
            title={isConnected ? `Connected to Firebase (${firebaseConfig.projectId})` : 'Click to setup Firebase Backend credentials'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: isConnected ? '#ECFDF5' : '#FFF7ED',
              border: `1.5px solid ${isConnected ? '#A7F3D0' : '#FED7AA'}`,
              color: isConnected ? '#059669' : '#EA580C',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Flame size={14} color={isConnected ? '#10B981' : '#F97316'} />
            <span>{isConnected ? 'Firebase Live' : 'Firebase Setup'}</span>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isConnected ? '#10B981' : '#F59E0B',
              }}
            />
          </button>

          <div style={{ height: '20px', width: '1px', background: '#E2E8F0', margin: '0 2px' }} />

          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Portals:
          </span>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Student Athlete Portal (Port 3000)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#ECFEFF',
              border: '1px solid rgba(8, 145, 178, 0.3)',
              color: '#0891B2',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <GraduationCap size={13} />
            Student :3000
            <ExternalLink size={11} opacity={0.7} />
          </a>

          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Organizer Studio (Port 3001)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#FFFBEB',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              color: '#D97706',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Trophy size={13} />
            Organizer :3001
            <ExternalLink size={11} opacity={0.7} />
          </a>

          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Coach Platform (Port 3002)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#FAF5FF',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#7C3AED',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Dumbbell size={13} />
            Coach :3002
            <ExternalLink size={11} opacity={0.7} />
          </a>

          <div style={{ height: '24px', width: '1px', background: '#E2E8F0', margin: '0 4px' }} />

          {/* Mode switcher button */}
          <button
            onClick={() => onToggleMode(mode === 'signup' ? 'login' : 'signup')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              padding: '7px 15px',
              borderRadius: '999px',
              background: mode === 'signup' ? '#FFFFFF' : 'linear-gradient(135deg, #0284C7, #4F46E5)',
              border: '1.5px solid ' + (mode === 'signup' ? '#CBD5E1' : 'transparent'),
              color: mode === 'signup' ? '#0F172A' : '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={14} />
            {mode === 'signup' ? 'Switch to Sign In' : 'Create New Account'}
          </button>
        </div>
      </header>

      {/* Firebase Config Modal */}
      <FirebaseConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onSaved={() => setConfigModalOpen(false)}
      />
    </>
  );
};
