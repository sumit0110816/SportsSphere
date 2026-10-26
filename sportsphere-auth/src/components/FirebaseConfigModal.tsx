import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Flame, ExternalLink, Save } from 'lucide-react';
import { isFirebaseConfigured, firebaseConfig } from '../firebase/config';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const isConnected = isFirebaseConfigured();

  const [rawJson, setRawJson] = useState('');
  const [apiKey, setApiKey] = useState(firebaseConfig.apiKey || '');
  const [projectId, setProjectId] = useState(firebaseConfig.projectId || '');
  const [authDomain, setAuthDomain] = useState(firebaseConfig.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(firebaseConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(firebaseConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(firebaseConfig.appId || '');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleParseJson = () => {
    try {
      // Handles both JS object notation and JSON
      const cleaned = rawJson
        .replace(/const\s+firebaseConfig\s*=\s*/, '')
        .replace(/;\s*$/, '')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"');

      const parsed = JSON.parse(cleaned);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
      if (parsed.appId) setAppId(parsed.appId);
      setStatusMessage('Parsed config successfully! Click Save below.');
    } catch {
      setStatusMessage('Could not parse JSON. Please enter fields manually.');
    }
  };

  const handleSave = () => {
    if (!apiKey.trim() || !projectId.trim()) {
      setStatusMessage('Please enter at least an API Key and Project ID.');
      return;
    }

    const configToSave = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    localStorage.setItem('sportsphere_firebase_config', JSON.stringify(configToSave));
    setStatusMessage('Config saved! Reloading application to initialize Firebase...');

    setTimeout(() => {
      onSaved();
      window.location.reload();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem('sportsphere_firebase_config');
    setStatusMessage('Custom Firebase config cleared. Switched back to environment default.');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const copyEnvFormat = () => {
    const envText = `VITE_FIREBASE_API_KEY=${apiKey || 'YOUR_API_KEY'}
VITE_FIREBASE_AUTH_DOMAIN=${authDomain || `${projectId || 'YOUR_PROJECT_ID'}.firebaseapp.com`}
VITE_FIREBASE_PROJECT_ID=${projectId || 'YOUR_PROJECT_ID'}
VITE_FIREBASE_STORAGE_BUCKET=${storageBucket || `${projectId || 'YOUR_PROJECT_ID'}.appspot.com`}
VITE_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId || ''}
VITE_FIREBASE_APP_ID=${appId || ''}`;

    navigator.clipboard.writeText(envText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card"
          style={{
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF9100 0%, #FF3D00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255, 145, 0, 0.35)',
              }}
            >
              <Flame size={24} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                Firebase Backend Setup
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Authentication & Cloud Firestore Database
              </p>
            </div>
          </div>

          {/* Live Status indicator */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: isConnected ? '#ECFDF5' : '#FFFBEB',
              border: `1.5px solid ${isConnected ? '#10B981' : '#F59E0B'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: isConnected ? '#10B981' : '#F59E0B',
                  boxShadow: `0 0 10px ${isConnected ? '#10B981' : '#F59E0B'}`,
                }}
              />
              <div>
                <strong style={{ fontSize: '13px', color: isConnected ? '#065F46' : '#92400E', display: 'block' }}>
                  {isConnected ? 'Firebase Live Connected' : 'Running in Offline / Demo Mode'}
                </strong>
                <span style={{ fontSize: '11px', color: isConnected ? '#047857' : '#B45309' }}>
                  {isConnected
                    ? `Project: ${firebaseConfig.projectId}`
                    : 'Mock accounts active. Add keys to write live users & profiles.'}
                </span>
              </div>
            </div>

            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: isConnected ? '#065F46' : '#92400E',
                textDecoration: 'underline',
              }}
            >
              Console
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Quick Paste JSON */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="field-label" style={{ margin: 0 }}>
                Quick Paste `firebaseConfig` Object:
              </label>
              <button
                type="button"
                onClick={handleParseJson}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0891B2',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Auto-Fill Fields
              </button>
            </div>
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "sportsphere-123",\n  ...\n};`}
              rows={3}
              className="auth-input"
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
          </div>

          {/* Individual fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label className="field-label">API Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="auth-input"
              />
            </div>
            <div>
              <label className="field-label">Project ID</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="sportsphere-app"
                className="auth-input"
              />
            </div>
            <div>
              <label className="field-label">Auth Domain</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="project.firebaseapp.com"
                className="auth-input"
              />
            </div>
            <div>
              <label className="field-label">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:12345:web:6789"
                className="auth-input"
              />
            </div>
          </div>

          {/* Status feedback */}
          {statusMessage && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#F1F5F9',
                fontSize: '12px',
                color: '#334155',
                marginBottom: '14px',
                fontWeight: 600,
              }}
            >
              {statusMessage}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #FF9100 0%, #FF3D00 100%)',
                boxShadow: '0 4px 14px rgba(255, 61, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px',
              }}
            >
              <Save size={16} />
              Save & Connect
            </button>

            <button
              type="button"
              onClick={copyEnvFormat}
              className="btn-secondary"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px',
              }}
            >
              {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
              {copied ? 'Copied to Clipboard!' : 'Copy for .env'}
            </button>
          </div>

          {/* Clear overrides if present */}
          {localStorage.getItem('sportsphere_firebase_config') && (
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear custom browser config
              </button>
            </div>
          )}

          {/* Quick 3-step setup guide */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              How to setup Firebase in 2 minutes:
            </h4>
            <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#64748B', lineHeight: 1.6 }}>
              <li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#0891B2', fontWeight: 600 }}>Firebase Console</a> & create a new project.</li>
              <li>Go to <strong>Authentication &rarr; Sign-in method</strong> & enable <strong>Email/Password</strong> and <strong>Google</strong>.</li>
              <li>Go to <strong>Firestore Database</strong> &rarr; Create Database in test mode.</li>
              <li>Go to Project Settings &rarr; Add Web App (<code>&lt;/&gt;</code>) and paste your configuration above!</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
