import React from 'react';
import type { UserRole } from '../types/auth';

interface HeaderProps {
  currentRole?: UserRole | null;
  mode: 'signup' | 'login';
  onToggleMode: (mode: 'signup' | 'login') => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onToggleMode, onOpenAdmin }) => {
  return (
    <>
      <header style={{
        width: '100%',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 20,
        borderBottom: '1px solid #E2E8F0',
        background: '#FFFFFF',
        boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.03)'
      }}>
        {/* Brand logo & athletic identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Athletic monogram icon */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)'
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '18px',
              letterSpacing: '-0.03em'
            }}>
              S
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0F172A'
              }}>
                SPORTSYNC
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '2px 7px',
                borderRadius: '6px',
                background: '#F1F5F9',
                color: '#475569',
                border: '1px solid #E2E8F0'
              }}>
                VARSITY ID
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', margin: 0, fontWeight: 500 }}>
              National Inter-Collegiate Athletics Platform
            </p>
          </div>
        </div>

        {/* Right side simple auth link and admin switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => onToggleMode(mode === 'signup' ? 'login' : 'signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {mode === 'signup' ? (
              <span>Already registered? <strong style={{ color: '#1D4ED8', fontWeight: 600 }}>Sign In</strong></span>
            ) : (
              <span>Need an account? <strong style={{ color: '#1D4ED8', fontWeight: 600 }}>Create Account</strong></span>
            )}
          </button>

          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Admin Console</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
};
