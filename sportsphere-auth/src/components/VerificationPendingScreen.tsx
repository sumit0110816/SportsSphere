import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Award,
  CreditCard,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { ROLE_CONFIG, type UserSession } from '../types/auth';

interface VerificationPendingScreenProps {
  session: UserSession;
  status: 'pending' | 'rejected' | 'approved';
  rejectionReason?: string;
  onApproved: () => void;
  onBackToLogin: () => void;
}

export const VerificationPendingScreen: React.FC<VerificationPendingScreenProps> = ({
  session,
  status: initialStatus,
  rejectionReason: initialRejectionReason = '',
  onApproved,
  onBackToLogin,
}) => {
  const { role, name, email, profile } = session;
  const config = ROLE_CONFIG[role];

  const [currentStatus, setCurrentStatus] = useState<'pending' | 'rejected' | 'approved'>(initialStatus);
  const [rejectionReason, setRejectionReason] = useState(initialRejectionReason);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('Just now');
  const [checkFeedback, setCheckFeedback] = useState<string>('');

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setCheckFeedback('');

    try {
      const res = await fetch(`/api/sync/check-status?email=${encodeURIComponent(email)}&role=${role}`);
      if (res.ok) {
        const data = await res.json();
        setLastCheckedTime(new Date().toLocaleTimeString());

        if (data.status === 'approved') {
          setCurrentStatus('approved');
          setCheckFeedback('Application Approved! Redirecting you now...');
          setTimeout(() => {
            onApproved();
          }, 1200);
          return;
        } else if (data.status === 'rejected') {
          setCurrentStatus('rejected');
          setRejectionReason(data.rejectionReason || 'Application rejected by platform administrator.');
          setCheckFeedback('Application was rejected by Admin.');
        } else {
          setCurrentStatus('pending');
          setCheckFeedback('Status: Still pending Platform Admin review.');
        }
      }
    } catch {
      setCheckFeedback('Unable to query sync service. Please ensure Admin is online.');
    } finally {
      setIsChecking(false);
    }
  };

  const isOrganizer = role === 'organizer';
  const orgProfile = profile as any;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
      {/* Back button */}
      <button
        onClick={onBackToLogin}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#64748B',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '16px',
          padding: '4px 0',
        }}
      >
        <ArrowLeft size={16} />
        Back to Login Portal
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card"
        style={{
          padding: '36px 32px',
          boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Status Badge & Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {currentStatus === 'pending' && (
            <>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#B45309',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '14px',
                }}
              >
                <Clock size={14} className="animate-pulse" />
                Access Blocked • Awaiting Platform Admin Approval
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: '0 0 8px',
                }}
              >
                {isOrganizer ? 'Organizer Authorization Pending' : 'Coach Accreditation Under Review'}
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                Your {isOrganizer ? 'collegiate organizer application' : 'coach license & certification'} has been dispatched to the <strong>SportSphere Admin Governance Console</strong>. Workspace access is restricted until approved.
              </p>
            </>
          )}

          {currentStatus === 'rejected' && (
            <>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '14px',
                }}
              >
                <XCircle size={14} />
                Application Rejected by Admin
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#991B1B',
                  margin: '0 0 8px',
                }}
              >
                Verification Not Approved
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                The Platform Administrator was unable to verify your credentials.
              </p>
            </>
          )}

          {currentStatus === 'approved' && (
            <>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#047857',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '14px',
                }}
              >
                <CheckCircle2 size={14} />
                Application Approved by Admin!
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#065F46',
                  margin: '0 0 8px',
                }}
              >
                Welcome to SportSphere
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
                Your account is active. Launching your workspace...
              </p>
            </>
          )}
        </div>

        {/* Rejection Note Alert */}
        {currentStatus === 'rejected' && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#991B1B',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              Admin Rejection Reason:
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.45 }}>
              {rejectionReason || 'Uploaded documentation could not be validated against collegiate sports authority records.'}
            </div>
          </div>
        )}

        {/* Applicant Summary Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              Submitted Verification Dossier
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: currentStatus === 'approved' ? '#047857' : currentStatus === 'rejected' ? '#DC2626' : '#D97706',
                textTransform: 'uppercase',
              }}
            >
              Status: {currentStatus.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>Applicant Name</span>
              <strong style={{ color: '#0F172A' }}>{name || 'SportSphere User'}</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>Requested Role</span>
              <strong style={{ color: config.color }}>{config.title} (Port {config.port})</strong>
            </div>

            <div>
              <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>Email Address</span>
              <span style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} color="#64748B" />
                {orgProfile?.collegeEmail || email}
              </span>
            </div>

            <div>
              <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>Contact Number</span>
              <span style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} color="#64748B" />
                {orgProfile?.contactNumber || orgProfile?.phone || '+91 98765 43210'}
              </span>
            </div>

            {isOrganizer ? (
              <>
                <div>
                  <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>Affiliated College</span>
                  <span style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={12} color="#64748B" />
                    {orgProfile?.collegeName || orgProfile?.organizationName || 'IIT Delhi'}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>College ID / Roll No</span>
                  <span style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={12} color="#64748B" />
                    {orgProfile?.collegeId || orgProfile?.studentId || '2023CS1089'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>Coaching Sport</span>
                  <span style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Award size={12} color="#64748B" />
                    {orgProfile?.primarySport || 'Athletics / Track & Field'}
                  </span>
                </div>

                <div>
                  <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block' }}>License / Credential ID</span>
                  <span style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} color="#64748B" />
                    {orgProfile?.licenseNo || 'WA-IND-2024-891'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Submitted Documents preview */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ color: '#64748B', fontSize: '11.5px', display: 'block', marginBottom: '6px' }}>
              Uploaded Verification Documents
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {isOrganizer ? (
                <>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11.5px', color: '#1E293B', fontWeight: 600 }}>
                    <FileText size={12} color="#D97706" /> College_ID_Card.png
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11.5px', color: '#1E293B', fontWeight: 600 }}>
                    <FileText size={12} color="#D97706" /> Dean_Sports_NOC_Letter.pdf
                  </div>
                </>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11.5px', color: '#1E293B', fontWeight: 600 }}>
                  <FileText size={12} color="#2563EB" /> AFI_Level2_Coach_Certificate.pdf
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Check Status Button */}
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isChecking}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '10px',
              background: '#0F172A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13.5px',
              border: 'none',
              cursor: isChecking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
            <span>{isChecking ? 'Checking Admin Registry...' : 'Check Approval Status'}</span>
          </button>

          {/* Shortcut to Admin Console (:3003) for instant verification demonstration */}
          <a
            href="http://localhost:3003"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              padding: '11px 18px',
              borderRadius: '10px',
              background: '#F1F5F9',
              color: '#1E293B',
              fontWeight: 600,
              fontSize: '13px',
              border: '1.5px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <span>Open Admin Console (Port 3003) to Review & Approve</span>
            <ExternalLink size={15} color="#64748B" />
          </a>
        </div>

        {/* Status feedback label */}
        {checkFeedback && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#64748B' }}>
            {checkFeedback} (Last checked: {lastCheckedTime})
          </div>
        )}
      </motion.div>
    </div>
  );
};
