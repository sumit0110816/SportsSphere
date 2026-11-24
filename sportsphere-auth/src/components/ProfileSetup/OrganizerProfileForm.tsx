import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  CreditCard,
  FileCheck,
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ROLE_CONFIG, type OrganizerProfileData } from '../../types/auth';

interface OrganizerProfileFormProps {
  initialEmail: string;
  initialName?: string;
  onBack: () => void;
  onSubmit: (profile: OrganizerProfileData) => void;
}

export const OrganizerProfileForm: React.FC<OrganizerProfileFormProps> = ({
  initialEmail,
  initialName = '',
  onBack,
  onSubmit,
}) => {
  const config = ROLE_CONFIG.organizer;

  const defaultName =
    initialName ||
    (initialEmail ? initialEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : '');

  const [fullName, setFullName] = useState(defaultName);
  const [collegeName, setCollegeName] = useState('IIT Delhi');
  const [collegeEmail, setCollegeEmail] = useState(initialEmail || '');
  const [contactNumber, setContactNumber] = useState('+91 98765 43210');
  const [collegeId, setCollegeId] = useState('2023CS1089');
  const [department, setDepartment] = useState('Board for Sports Activities (BSA)');
  const [designation, setDesignation] = useState('Sports Council Convener');
  const [bio, setBio] = useState('Authorized student tournament director coordinating inter-collegiate championships.');

  // Document Uploads & Previews
  const [collegeIdDocName, setCollegeIdDocName] = useState('College_ID_Card.png');
  const [collegeIdDocUrl, setCollegeIdDocUrl] = useState(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  );
  const [nocLetterName, setNocLetterName] = useState('Dean_Sports_NOC_Letter.pdf');
  const [nocLetterUrl, setNocLetterUrl] = useState(
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
  );

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File picker handler for ID Card
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCollegeIdDocName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setCollegeIdDocUrl(fakeUrl);
    }
  };

  // File picker handler for NOC Letter
  const handleNocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNocLetterName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setNocLetterUrl(fakeUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full legal name');
      return;
    }
    if (!collegeEmail.trim() || !collegeEmail.includes('@')) {
      setError('Please provide your official college email');
      return;
    }
    if (!contactNumber.trim() || contactNumber.length < 8) {
      setError('Please provide a valid official contact number');
      return;
    }
    if (!collegeId.trim()) {
      setError('Please enter your official College ID or Student ID');
      return;
    }
    if (!collegeName.trim()) {
      setError('Please specify your affiliated College / University name');
      return;
    }

    setIsSubmitting(true);

    const profileData: OrganizerProfileData = {
      fullName: fullName.trim(),
      collegeEmail: collegeEmail.trim(),
      contactNumber: contactNumber.trim(),
      collegeId: collegeId.trim(),
      collegeName: collegeName.trim(),
      department: department.trim(),
      designation: designation.trim() || 'Tournament Organizer',
      organizationName: collegeName.trim(),
      organizationType: 'Collegiate Sports Council',
      phone: contactNumber.trim(),
      collegeIdDocUrl,
      nocLetterUrl,
      bio: bio.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName.trim()
      )}&background=d97706&color=fff&size=256&bold=true`,
    };

    // Forward to backend sync for immediate Admin review
    try {
      await fetch('/api/sync/submit-organizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileData.fullName,
          email: initialEmail || profileData.collegeEmail,
          collegeEmail: profileData.collegeEmail,
          phone: profileData.contactNumber,
          contactNumber: profileData.contactNumber,
          collegeName: profileData.collegeName,
          studentId: profileData.collegeId,
          collegeId: profileData.collegeId,
          department: profileData.department,
          collegeIdDocUrl,
          nocLetterUrl,
          documents: [
            { name: collegeIdDocName, url: collegeIdDocUrl, type: 'image', size: '1.4 MB' },
            { name: nocLetterName, url: nocLetterUrl, type: 'pdf', size: '2.3 MB' },
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
            Organizer Verification Dossier • Admin Gated
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
            Organizer Authorization Credentials
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Submit your university affiliation, ID proof, and Dean NOC letter. SportSphere Admin must authorize your application before access to the Organizer Studio (Port 3001) is granted.
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
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            marginBottom: '22px',
          }}
        >
          <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12.5px', color: '#92400E', lineHeight: 1.45 }}>
            <strong>Institutional Governance:</strong> Student & faculty organizers are authorized exclusively for their verified college. Uploaded documents are audited in real time by the Platform Admin.
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
          {/* Row 1: Full Name & College Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={13} color="#D97706" />
                Affiliated College / University *
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. IIT Delhi / BITS Pilani / COEP"
                className="auth-input auth-input-organizer"
                required
              />
            </div>
            <div>
              <label className="field-label">Organizer Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Legal Name"
                className="auth-input auth-input-organizer"
                required
              />
            </div>
          </div>

          {/* Row 2: Official College Email & Contact Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#D97706" />
                Official College Email (.edu / .ac.in) *
              </label>
              <input
                type="email"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                placeholder="e.g. student.sports@iitd.ac.in"
                className="auth-input auth-input-organizer"
                required
              />
            </div>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#D97706" />
                Contact Number *
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="auth-input auth-input-organizer"
                required
              />
            </div>
          </div>

          {/* Row 3: College ID Number, Department & Designation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={13} color="#D97706" />
                College / Student ID *
              </label>
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="e.g. 2023CS1089"
                className="auth-input auth-input-organizer"
                required
              />
            </div>
            <div>
              <label className="field-label">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Sports Board"
                className="auth-input auth-input-organizer"
              />
            </div>
            <div>
              <label className="field-label">Role / Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Sports Convener"
                className="auth-input auth-input-organizer"
              />
            </div>
          </div>

          {/* Row 4: Mandatory Document Uploads */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* College ID Card Upload */}
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
                  <CreditCard size={14} color="#D97706" />
                  College ID Card Proof *
                </span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle size={12} /> Ready
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <FileText size={16} color="#64748B" />
                <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {collegeIdDocName}
                </span>
                <label
                  style={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#D97706',
                    background: '#FFFBEB',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Upload size={11} /> Change
                  <input type="file" accept="image/*,.pdf" onChange={handleIdUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
                Scanned student or faculty ID showing name, college & photo.
              </p>
            </div>

            {/* Dean NOC Letter Upload */}
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
                  <FileCheck size={14} color="#D97706" />
                  Dean / Sports Advisor NOC *
                </span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle size={12} /> Ready
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <FileText size={16} color="#64748B" />
                <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {nocLetterName}
                </span>
                <label
                  style={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#D97706',
                    background: '#FFFBEB',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Upload size={11} /> Change
                  <input type="file" accept="image/*,.pdf" onChange={handleNocUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
                Official authorization letter on university letterhead with seal.
              </p>
            </div>
          </div>

          {/* Org Bio */}
          <div>
            <label className="field-label">Tournament Scope & Experience</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Detail your tournament plans, inter-college events, or previous sports meets..."
              className="auth-input auth-input-organizer"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn-organizer"
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
            <span>Submit Verification Dossier to Platform Admin</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
