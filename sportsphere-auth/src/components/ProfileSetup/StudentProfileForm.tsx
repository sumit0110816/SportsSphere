import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { ROLE_CONFIG, type StudentProfileData } from '../../types/auth';

interface StudentProfileFormProps {
  initialEmail: string;
  initialName?: string;
  onBack: () => void;
  onSubmit: (profile: StudentProfileData) => void;
}

const AVATAR_PRESETS = [
  '⚡', '🏃‍♂️', '🏸', '⚽', '🏀', '🥇', '🥋', '🏊‍♂️'
];

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  initialEmail,
  initialName = '',
  onBack,
  onSubmit,
}) => {
  const config = ROLE_CONFIG.student;

  // Derive initial friendly name from login user
  const defaultName = initialName || (initialEmail ? initialEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '');
  const defaultHandle = initialEmail ? '@' + initialEmail.split('@')[0].toLowerCase() : '';

  const [fullName, setFullName] = useState(defaultName);
  const [username, setUsername] = useState(defaultHandle);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [institution, setInstitution] = useState('');
  const [primarySport, setPrimarySport] = useState('Badminton');
  const [positionOrEvent, setPositionOrEvent] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('District Level Competitor');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!primarySport.trim()) {
      setError('Please select your primary sport');
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      username: username.trim() ? (username.startsWith('@') ? username.trim() : `@${username.trim()}`) : `@${fullName.trim().toLowerCase().replace(/\s+/g, '_')}`,
      dateOfBirth,
      gender,
      institution: institution.trim(),
      primarySport,
      positionOrEvent: positionOrEvent.trim(),
      experienceLevel,
      city: city.trim(),
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
            Step 3 of 3 • Student Athlete Profile
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
            Create Your Athlete Profile
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Account: <strong style={{ color: config.color }}>{initialEmail || 'athlete@sportsphere.org'}</strong>
          </p>
        </div>

        {/* Avatar Preset Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <label className="field-label" style={{ marginBottom: '10px' }}>Select Your Avatar</label>
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
                    background: isSelected ? '#ECFEFF' : '#F1F5F9',
                    border: `2px solid ${isSelected ? '#0891B2' : '#CBD5E1'}`,
                    fontSize: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 16px rgba(8, 145, 178, 0.25)' : 'none',
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
          {/* Row 1: Full name and username */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="auth-input auth-input-student"
                required
              />
            </div>
            <div>
              <label className="field-label">Athlete Handle / Tag</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@your_username"
                className="auth-input auth-input-student"
              />
            </div>
          </div>

          {/* Row 2: Institution & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div>
              <label className="field-label">School / College / Academy</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Your school or sports academy"
                className="auth-input auth-input-student"
              />
            </div>
            <div>
              <label className="field-label">City & State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, KA"
                className="auth-input auth-input-student"
              />
            </div>
          </div>

          {/* Row 3: Primary Sport & Position */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label">Primary Sport *</label>
              <select
                value={primarySport}
                onChange={(e) => setPrimarySport(e.target.value)}
                className="auth-input auth-select auth-input-student"
              >
                <option value="Athletics / Track & Field">Athletics / Track & Field</option>
                <option value="Badminton">Badminton</option>
                <option value="Cricket">Cricket</option>
                <option value="Football / Soccer">Football / Soccer</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Table Tennis">Table Tennis</option>
                <option value="Martial Arts">Martial Arts</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Other">Other Sport</option>
              </select>
            </div>
            <div>
              <label className="field-label">Position / Category</label>
              <input
                type="text"
                value={positionOrEvent}
                onChange={(e) => setPositionOrEvent(e.target.value)}
                placeholder="e.g. 100m Sprint / Forward / Singles"
                className="auth-input auth-input-student"
              />
            </div>
          </div>

          {/* Row 4: Date of Birth & Competition Level */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="field-label">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="auth-input auth-input-student"
              />
            </div>
            <div>
              <label className="field-label">Competition Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="auth-input auth-select auth-input-student"
              >
                <option value="School / Beginner Level">School / Beginner</option>
                <option value="District Level Competitor">District Level</option>
                <option value="State Level Competitor">State Level</option>
                <option value="National Level Competitor">National Level</option>
                <option value="Elite / Professional">Elite / Pro</option>
              </select>
            </div>
          </div>

          {/* Gender Category */}
          <div>
            <label className="field-label">Gender Category</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="auth-input auth-select auth-input-student"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Athletic Bio */}
          <div>
            <label className="field-label">Athletic Bio & Target Goals</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell scouts, coaches, and organizers about your sports goals, achievements, and training discipline..."
              className="auth-input auth-input-student"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary btn-student"
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>Complete Profile & Open Student Portal (Port 3000)</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
