import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Award,
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { ROLE_CONFIG, type CoachProfileData } from '../../types/auth';

interface CoachProfileFormProps {
  initialEmail: string;
  initialName?: string;
  onBack: () => void;
  onSubmit: (profile: CoachProfileData) => void;
}

export const CoachProfileForm: React.FC<CoachProfileFormProps> = ({
  initialEmail,
  initialName = '',
  onBack,
  onSubmit,
}) => {
  const config = ROLE_CONFIG.coach;

  const defaultName =
    initialName ||
    (initialEmail ? initialEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : '');

  const [fullName, setFullName] = useState(defaultName);
  const [email, setEmail] = useState(initialEmail || '');
  const [contactNumber, setContactNumber] = useState('+91 99223 34455');
  const [primarySport, setPrimarySport] = useState('Athletics / Track & Field');
  const [certification, setCertification] = useState('AFI Level-2 & World Athletics Certified Coach');
  const [licenseNo, setLicenseNo] = useState('WA-IND-2024-891');
  const [currentAcademy, setCurrentAcademy] = useState('Delhi University Sports Council & Elite Track Club');
  const [yearsOfExperience, setYearsOfExperience] = useState('5-8 Years');
  const [specialization, setSpecialization] = useState('Sprint Mechanics & Relay Transitions');
  const [bio, setBio] = useState('Certified athletic coach training collegiate athletes for national inter-university meets.');

  // Certificate Document Upload & Preview
  const [certificateDocName, setCertificateDocName] = useState('AFI_Level2_Coach_Certificate.pdf');
  const [coachCertificateUrl, setCoachCertificateUrl] = useState(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
  );

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File picker handler for Coach Certificate
  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateDocName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setCoachCertificateUrl(fakeUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full legal name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide your professional coaching email');
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 8) {
      setError('Please provide a valid contact phone number');
      return;
    }
    if (!primarySport.trim()) {
      setError('Please specify your coaching sport discipline');
      return;
    }
    if (!licenseNo.trim()) {
      setError('Please enter your federation license or certificate credential number');
      return;
    }

    setIsSubmitting(true);

    const profileData: CoachProfileData = {
      fullName: fullName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      primarySport: primarySport.trim(),
      certification: certification.trim(),
      licenseNo: licenseNo.trim(),
      currentAcademy: currentAcademy.trim(),
      yearsOfExperience,
      specialization: specialization.trim(),
      coachCertificateUrl,
      title: 'Head Coach',
      city: 'New Delhi',
      bio: bio.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName.trim()
      )}&background=2563eb&color=fff&size=256&bold=true`,
    };

    // Send to sync backend for instantaneous Platform Admin verification
    try {
      await fetch('/api/sync/submit-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.contactNumber,
          contactNumber: profileData.contactNumber,
          sport: profileData.primarySport,
          collegeOrOrg: profileData.currentAcademy,
          experienceYears: profileData.yearsOfExperience,
          certification: profileData.certification,
          licenseNo: profileData.licenseNo,
          coachCertificateUrl,
          documents: [
            { name: certificateDocName, url: coachCertificateUrl, type: 'pdf', size: '2.4 MB' },
          ],
        }),
      });
    } catch {
      // Local sync fallback
    }

    setIsSubmitting(false);
    onSubmit(profileData);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      {/* Back button */}
      <button
        onClick={onBack}
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
        Back to Credentials
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card"
        style={{
          padding: '36px 32px',
          boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Step Indicator & Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: config.accentBg,
              border: `1px solid ${config.color}30`,
              color: config.color,
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}
          >
            <ShieldCheck size={12} />
            Coach Accreditation Dossier • Admin Gated
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 6px',
            }}
          >
            Coach Certification & License Verification
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Upload your coaching accreditation, national federation license, and varsity credentials. Platform Admin must approve your dossier before access to Coach Pro Hub (Port 3002) is unlocked.
          </p>
        </div>

        {/* Verification Policy Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            marginBottom: '22px',
          }}
        >
          <AlertCircle size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12.5px', color: '#1E40AF', lineHeight: 1.45 }}>
            <strong>Federation Accreditation Standard:</strong> Only verified coaches with authentic AFI, FIBA, BWF, or NIS Patiala credentials are authorized to scout athletes and endorse performance metrics.
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Row 1: Full Name & Primary Sport */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label">Coach Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Coach Legal Full Name"
                className="auth-input auth-input-coach"
                required
              />
            </div>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={13} color="#2563EB" />
                Primary Sport Discipline *
              </label>
              <select
                value={primarySport}
                onChange={(e) => setPrimarySport(e.target.value)}
                className="auth-input auth-select auth-input-coach"
              >
                <option value="Athletics / Track & Field">Athletics / Track & Field</option>
                <option value="Basketball">Basketball</option>
                <option value="Badminton">Badminton</option>
                <option value="Football / Soccer">Football / Soccer</option>
                <option value="Cricket">Cricket</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Volleyball">Volleyball</option>
              </select>
            </div>
          </div>

          {/* Row 2: Email & Contact Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#2563EB" />
                Coach Professional Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach.name@academy.com"
                className="auth-input auth-input-coach"
                required
              />
            </div>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#2563EB" />
                Contact Number *
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 99223 34455"
                className="auth-input auth-input-coach"
                required
              />
            </div>
          </div>

          {/* Row 3: Certification & License Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={13} color="#2563EB" />
                Accreditation / Certification Name *
              </label>
              <input
                type="text"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="e.g. AFI Level 2 / NIS Diploma / FIBA Level 1"
                className="auth-input auth-input-coach"
                required
              />
            </div>
            <div>
              <label className="field-label">License / Credential ID *</label>
              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                placeholder="e.g. WA-IND-2024-891"
                className="auth-input auth-input-coach"
                required
              />
            </div>
          </div>

          {/* Row 4: Affiliated College/Academy, Specialization & Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '12px' }}>
            <div>
              <label className="field-label">Associated College / Academy</label>
              <input
                type="text"
                value={currentAcademy}
                onChange={(e) => setCurrentAcademy(e.target.value)}
                placeholder="e.g. Delhi University Sports Council"
                className="auth-input auth-input-coach"
              />
            </div>
            <div>
              <label className="field-label">Coaching Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Sprint Mechanics / Defensive Tactics"
                className="auth-input auth-input-coach"
              />
            </div>
            <div>
              <label className="field-label">Experience</label>
              <select
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="auth-input auth-select auth-input-coach"
              >
                <option value="1-3 Years">1-3 Years</option>
                <option value="4-7 Years">4-7 Years</option>
                <option value="8-12 Years">8-12 Years</option>
                <option value="12+ Years">12+ Years (Master Coach)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Mandatory Coach Certificate Upload */}
          <div
            style={{
              border: '1.5px dashed #CBD5E1',
              borderRadius: '12px',
              padding: '16px',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} color="#2563EB" />
                Coach Certificate Document / Federation Scan *
              </span>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle size={12} /> Ready
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <FileText size={16} color="#64748B" />
              <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {certificateDocName}
              </span>
              <label
                style={{
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2563EB',
                  background: '#EFF6FF',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Upload size={11} /> Change Certificate
                <input type="file" accept="image/*,.pdf" onChange={handleCertUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
              Upload your official federation diploma, certificate scan, or coaching credentials badge.
            </p>
          </div>

          {/* Specialization & Bio */}
          <div>
            <label className="field-label">Coaching Specialization & Track Record</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Notable athletes trained, tournament titles won, or coaching methodologies..."
              className="auth-input auth-input-coach"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn-coach"
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <span>Submit Coach Credentials to Platform Admin</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
