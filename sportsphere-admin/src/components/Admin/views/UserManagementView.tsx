import React, { useState } from 'react';
import {
  Search,
  UserX,
  UserCheck,
  Edit,
  School,
} from 'lucide-react';
import type { AdminUser } from '../../../types/admin';
import type { UserRole } from '../../../types/auth';

interface UserManagementViewProps {
  users: AdminUser[];
  theme: 'light' | 'dark';
  onUpdateStatus: (uid: string, status: AdminUser['status'], reason?: string) => void;
  onUpdateRoles: (uid: string, roles: UserRole[], reason?: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  theme,
  onUpdateStatus,
  onUpdateRoles,
}) => {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole | 'multi'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminUser['status']>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditingRoles, setIsEditingRoles] = useState(false);
  const [editedRoles, setEditedRoles] = useState<UserRole[]>([]);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.college && u.college.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      roleFilter === 'all'
        ? true
        : roleFilter === 'multi'
        ? u.roles.length > 1
        : u.roles.includes(roleFilter);

    const matchesStatus = statusFilter === 'all' ? true : u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenRoleModal = (u: AdminUser) => {
    setSelectedUser(u);
    setEditedRoles([...u.roles]);
    setIsEditingRoles(true);
  };

  const toggleRole = (r: UserRole) => {
    if (editedRoles.includes(r)) {
      if (editedRoles.length === 1) return; // Prevent 0 roles
      setEditedRoles(editedRoles.filter((item) => item !== r));
    } else {
      setEditedRoles([...editedRoles, r]);
    }
  };

  const handleSaveRoles = () => {
    if (!selectedUser) return;
    onUpdateRoles(selectedUser.uid, editedRoles, 'Admin updated user roles');
    setIsEditingRoles(false);
    setSelectedUser(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action and Filter Bar */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          padding: '16px 20px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isDark ? '#64748B' : '#94A3B8',
            }}
          />
          <input
            type="text"
            placeholder="Search by name, email, or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px 0 36px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              color: isDark ? '#F1F5F9' : '#0F172A',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            style={{
              height: '38px',
              padding: '0 12px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              color: isDark ? '#F1F5F9' : '#0F172A',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Roles</option>
            <option value="student">Athletes Only</option>
            <option value="coach">Coaches Only</option>
            <option value="organizer">Organizers Only</option>
            <option value="multi">Multi-Role Users (Hybrid)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              height: '38px',
              padding: '0 12px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
              backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              color: isDark ? '#F1F5F9' : '#0F172A',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          overflow: 'hidden',
        }}
      >
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
                <th style={{ padding: '14px 18px' }}>User Details</th>
                <th style={{ padding: '14px 18px' }}>Institution / College</th>
                <th style={{ padding: '14px 18px' }}>Assigned Roles</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Registered</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isMultiRole = user.roles.length > 1;
                return (
                  <tr
                    key={user.uid}
                    style={{
                      borderBottom: `1px solid ${isDark ? '#2D3748' : '#F1F5F9'}`,
                      color: isDark ? '#E2E8F0' : '#1E293B',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = isDark ? '#172033' : '#F8FAFC')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px',
                            flexShrink: 0,
                          }}
                        >
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#0F172A' }}>
                            {user.fullName}
                          </div>
                          <div style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <School size={14} color={isDark ? '#64748B' : '#94A3B8'} />
                        <span>{user.college || 'Universal Athlete'}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {user.roles.map((r) => {
                          const badgeStyles: Record<UserRole, { bg: string; text: string }> = {
                            student: { bg: '#EFF6FF', text: '#1D4ED8' },
                            coach: { bg: '#ECFDF5', text: '#047857' },
                            organizer: { bg: '#FFFBEB', text: '#B45309' },
                          };
                          const style = badgeStyles[r] || { bg: '#F1F5F9', text: '#334155' };
                          return (
                            <span
                              key={r}
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: isDark ? '#0F172A' : style.bg,
                                color: style.text,
                                border: `1px solid ${style.text}33`,
                              }}
                            >
                              {r === 'student' ? 'Athlete' : r}
                            </span>
                          );
                        })}
                        {isMultiRole && (
                          <span
                            title="Multi-role ecosystem member"
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 5px',
                              borderRadius: '4px',
                              backgroundColor: '#8B5CF6',
                              color: '#FFFFFF',
                            }}
                          >
                            HYBRID
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          backgroundColor:
                            user.status === 'active'
                              ? isDark
                                ? 'rgba(16, 185, 129, 0.15)'
                                : '#ECFDF5'
                              : user.status === 'suspended'
                              ? isDark
                                ? 'rgba(239, 68, 68, 0.15)'
                                : '#FEF2F2'
                              : '#FFFBEB',
                          color:
                            user.status === 'active'
                              ? '#059669'
                              : user.status === 'suspended'
                              ? '#DC2626'
                              : '#D97706',
                          border: `1px solid ${
                            user.status === 'active'
                              ? '#A7F3D0'
                              : user.status === 'suspended'
                              ? '#FECACA'
                              : '#FDE68A'
                          }`,
                          textTransform: 'capitalize',
                        }}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', color: isDark ? '#94A3B8' : '#64748B', fontSize: '12px' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          title="Manage Roles (Multi-Role)"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
                            border: `1px solid ${isDark ? '#334155' : '#BFDBFE'}`,
                            color: '#2563EB',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Edit size={13} />
                          Roles
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => onUpdateStatus(user.uid, 'suspended', 'Admin suspension')}
                            title="Suspend Account"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? '#0F172A' : '#FEF2F2',
                              border: `1px solid ${isDark ? '#334155' : '#FECACA'}`,
                              color: '#DC2626',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <UserX size={13} />
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateStatus(user.uid, 'active', 'Admin reinstated account')}
                            title="Reactivate Account"
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: isDark ? '#0F172A' : '#ECFDF5',
                              border: `1px solid ${isDark ? '#334155' : '#A7F3D0'}`,
                              color: '#059669',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <UserCheck size={13} />
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Modal (Multi-Role Support) */}
      {isEditingRoles && selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '14px',
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Assign Roles to {selectedUser.fullName}
            </h3>
            <p style={{ margin: '0 0 18px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              SportSync users can hold multiple simultaneous ecosystem roles (e.g. Athlete + Coach + Organizer).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {(['student', 'coach', 'organizer'] as UserRole[]).map((role) => {
                const isChecked = editedRoles.includes(role);
                const roleLabels = {
                  student: 'Student Athlete (Port 3000)',
                  coach: 'Accredited Coach (Port 3002)',
                  organizer: 'Tournament Organizer (Port 3001)',
                };

                return (
                  <label
                    key={role}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: isChecked
                        ? isDark
                          ? 'rgba(37, 99, 235, 0.15)'
                          : '#EFF6FF'
                        : isDark
                        ? '#0F172A'
                        : '#F8FAFC',
                      border: `1px solid ${
                        isChecked ? '#3B82F6' : isDark ? '#334155' : '#E2E8F0'
                      }`,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRole(role)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13.5px',
                          color: isDark ? '#F1F5F9' : '#0F172A',
                          textTransform: 'capitalize',
                        }}
                      >
                        {roleLabels[role]}
                      </div>
                      <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
                        {role === 'student' && 'Can register for tournaments and upload athletic highlights'}
                        {role === 'coach' && 'Can verify athlete times, sign off on PRs, and scout talent'}
                        {role === 'organizer' && 'Can create AIU sanctioned events for authorized institution'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsEditingRoles(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                  color: isDark ? '#E2E8F0' : '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoles}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#2563EB',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Roles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
