import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { ROLE_CONFIG, type CoachProfileData } from '../../types/auth';

interface CoachProfileFormProps {
  initialEmail: string;
  initialName?: string;
  onBack: () => void;
  onSubmit: (profile: CoachProfileData) => void;
}

const AVATAR_PRESETS = [
  '⏱️', '🥋', '🥊', '🎯', '🏅', '📋', '🔥', '🧠'
];

export const CoachProfileForm: React.FC<CoachProfileFormProps> = ({
  initialEmail,
  initialName = '',
  onBack,
  onSubmit,
}) => {
  const config = ROLE_CONFIG.coach;

  const defaultName = initialName || (initialEmail ? initialEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '');

  const [fullName, setFullName] = useState(defaultName);
  const [title, setTitle] = useState('');
  const [primarySport, setPrimarySport] = useState('Athletics / Track & Field');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('4-7 Years');
  const [certification, setCertification] = useState('');
  const [currentAcademy, setCurrentAcademy] = useState('');
  const [city, setCity] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⏱️');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!primarySport.trim()) {
      setError('Please specify your coaching sport');
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      title: title.trim() || 'Head Coach',
      primarySport,
      specialization: specialization.trim(),
      yearsOfExperience,
      certification: certification.trim(),
      currentAcademy: currentAcademy.trim(),
      city: city.trim(),
      linkedinUrl: linkedinUrl.trim(),
      bio: bio.trim(),
      avatar: selectedAvatar && selectedAvatar.startsWith('http')
        ? selectedAvatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=2563eb&color=fff&size=256&bold=true`,
    });
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            <Sparkles size={12} />
            Step 3 of 3 • Coach Pro Hub Profile
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 6px',
            }}
          >
            Build Your Coach Pro Profile
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Account: <strong style={{ color: config.color }}>{initialEmail || 'coach@sportsphere.org'}</strong>
          </p>
        </div>

        {/* Avatar Preset Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <label className="field-label" style={{ marginBottom: '10px' }}>Select Coach Profile Icon</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {AVATAR_PRESETS.map((icon) => {
              const isSelected = selectedAvatar === icon;
              return (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedAvatar(icon)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: isSelected ? '#FAF5FF' : '#F1F5F9',
                    border: `2px solid ${isSelected ? '#7C3AED' : '#CBD5E1'}`,
                    fontSize: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 16px rgba(124, 58, 237, 0.25)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {icon}
                </button>
              );
            })}
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
          {/* Row 1: Full name and title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label">Coach Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="auth-input auth-input-coach"
                required
              />
            </div>
            <div>
              <label className="field-label">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Head Coach / High-Performance Lead"
                className="auth-input auth-input-coach"
              />
            </div>
          </div>

          {/* Row 2: Primary Sport & Specialization */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label">Primary Coaching Sport *</label>
              <select
                value={primarySport}
                onChange={(e) => setPrimarySport(e.target.value)}
                className="auth-input auth-select auth-input-coach"
              >
                <option value="Athletics / Track & Field">Athletics / Track & Field</option>
                <option value="Football / Soccer">Football / Soccer</option>
                <option value="Badminton">Badminton</option>
                <option value="Basketball">Basketball</option>
                <option value="Cricket">Cricket</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Strength & Conditioning">Strength & Conditioning</option>
                <option value="Martial Arts & Combat">Martial Arts & Combat</option>
              </select>
            </div>
            <div>
              <label className="field-label">Tactical Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Sprint Mechanics / Playmaking"
                className="auth-input auth-input-coach"
              />
            </div>
          </div>

          {/* Row 3: Experience & Certification */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
            <div>
              <label className="field-label">Coaching Experience</label>
              <select
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="auth-input auth-select auth-input-coach"
              >
                <option value="1-3 Years">1-3 Years</option>
                <option value="4-7 Years">4-7 Years</option>
                <option value="8-12 Years">8-12 Years</option>
                <option value="12+ Years Veteran">12+ Years Veteran</option>
              </select>
            </div>
            <div>
              <label className="field-label">Certifications & Badges</label>
              <input
                type="text"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="e.g. NIS / IAAF Level 2 / AFC License"
                className="auth-input auth-input-coach"
              />
            </div>
          </div>

          {/* Row 4: Academy & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div>
              <label className="field-label">Current Academy / Club</label>
              <input
                type="text"
                value={currentAcademy}
                onChange={(e) => setCurrentAcademy(e.target.value)}
                placeholder="Your sports academy or club name"
                className="auth-input auth-input-coach"
              />
            </div>
            <div>
              <label className="field-label">City Base</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Delhi NCR / Austin"
                className="auth-input auth-input-coach"
              />
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="field-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#7C3AED">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn Profile URL (Optional)
              </span>
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/your-profile"
              className="auth-input auth-input-coach"
            />
          </div>

          {/* Bio / Coaching Philosophy */}
          <div>
            <label className="field-label">Coaching Philosophy & Background</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Describe your coaching philosophy, athlete mentorship track record, and specialties..."
              className="auth-input auth-input-coach"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary btn-coach"
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>Complete Profile & Open Coach Platform (Port 3002)</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
