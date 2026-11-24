import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Search,
  RotateCcw,
} from 'lucide-react';
import type { PaymentRecord } from '../../../types/admin';

interface PaymentManagementViewProps {
  payments: PaymentRecord[];
  theme: 'light' | 'dark';
  onRefund: (id: string, reason: string) => void;
}

export const PaymentManagementView: React.FC<PaymentManagementViewProps> = ({
  payments,
  theme,
  onRefund,
}) => {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentRecord['status']>('all');
  const [refundModalPayment, setRefundModalPayment] = useState<PaymentRecord | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const totalCollected = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPlatformFees = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.platformFee, 0);

  const totalOrganizerPayout = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.organizerPayout, 0);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.payerName.toLowerCase().includes(search.toLowerCase()) ||
      p.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.gatewayId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmRefund = () => {
    if (!refundModalPayment || !refundReason.trim()) return;
    onRefund(refundModalPayment.id, refundReason.trim());
    setRefundModalPayment(null);
    setRefundReason('');
  };

  const handleExportCSV = () => {
    const headers = 'ID,GatewayID,Payer,Email,Event,Amount,PlatformFee,OrganizerPayout,Status,Method,Date\n';
    const rows = filtered
      .map(
        (p) =>
          `"${p.id}","${p.gatewayId}","${p.payerName}","${p.payerEmail}","${p.eventTitle}",${p.amount},${p.platformFee},${p.organizerPayout},"${p.status}","${p.method}","${p.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sportsync_payments_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Information Header */}
      <div
        style={{
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CreditCard size={18} color="#06B6D4" />
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Razorpay Settlement & Tournament Fee Ledger
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Tournament registration payments, automated platform commission splits (5%), and secure dispute refunds.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
            border: `1px solid ${isDark ? '#334155' : '#BFDBFE'}`,
            color: '#2563EB',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={14} />
          Export Settlement CSV
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '10px',
            padding: '16px 20px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
            Gross Tournament Revenue
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: isDark ? '#CBD5E1' : '#64748B', marginTop: '4px' }}>
            100% processed through Razorpay
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '10px',
            padding: '16px 20px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
            Platform Commission (5%)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>
            ₹{totalPlatformFees.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: isDark ? '#CBD5E1' : '#64748B', marginTop: '4px' }}>
            Retained for AIU circuit operations
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: '10px',
            padding: '16px 20px',
            border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
            Organizer Disbursal Pool
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#8B5CF6', marginTop: '4px' }}>
            ₹{totalOrganizerPayout.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: isDark ? '#CBD5E1' : '#64748B', marginTop: '4px' }}>
            Settled directly to verified colleges
          </div>
        </div>
      </div>

      {/* Filter and Search */}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
          />
          <input
            type="text"
            placeholder="Search by payer, tournament or Razorpay transaction ID..."
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
          <option value="all">All Payment Statuses</option>
          <option value="captured">Captured (Successful)</option>
          <option value="refunded">Refunded</option>
          <option value="pending">Pending Gateway Handshake</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
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
                <th style={{ padding: '14px 18px' }}>Transaction ID</th>
                <th style={{ padding: '14px 18px' }}>Payer & Athlete</th>
                <th style={{ padding: '14px 18px' }}>Tournament</th>
                <th style={{ padding: '14px 18px' }}>Amount (INR)</th>
                <th style={{ padding: '14px 18px' }}>Method</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: `1px solid ${isDark ? '#2D3748' : '#F1F5F9'}`,
                    color: isDark ? '#E2E8F0' : '#1E293B',
                  }}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#2563EB', fontFamily: 'monospace' }}>
                      {p.gatewayId}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: isDark ? '#F1F5F9' : '#0F172A' }}>{p.payerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{p.payerEmail}</div>
                  </td>

                  <td style={{ padding: '14px 18px', maxWidth: '240px' }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.eventTitle}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>₹{p.amount}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Fee: ₹{p.platformFee}</div>
                  </td>

                  <td style={{ padding: '14px 18px', textTransform: 'uppercase', fontWeight: 600, fontSize: '11.5px' }}>
                    {p.method}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        backgroundColor:
                          p.status === 'captured'
                            ? '#ECFDF5'
                            : p.status === 'refunded'
                            ? '#FFFBEB'
                            : '#FEF2F2',
                        color:
                          p.status === 'captured'
                            ? '#059669'
                            : p.status === 'refunded'
                            ? '#D97706'
                            : '#DC2626',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    {p.status === 'captured' && (
                      <button
                        onClick={() => setRefundModalPayment(p)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          backgroundColor: isDark ? '#0F172A' : '#FEF2F2',
                          border: `1px solid ${isDark ? '#334155' : '#FECACA'}`,
                          color: '#DC2626',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <RotateCcw size={12} />
                        Refund
                      </button>
                    )}
                    {p.status === 'refunded' && (
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Refunded ({p.refundReason || 'Processed'})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {refundModalPayment && (
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
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Process Refund: ₹{refundModalPayment.amount}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Payer: {refundModalPayment.payerName} • Gateway ID: {refundModalPayment.gatewayId}
            </p>

            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g. Tournament schedule rescheduled by organizer; student requested fee reversal."
              rows={4}
              style={{
                width: '100%',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#334155' : '#CBD5E1'}`,
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                color: isDark ? '#F1F5F9' : '#0F172A',
                padding: '10px 12px',
                fontSize: '13px',
                outline: 'none',
                marginBottom: '18px',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRefundModalPayment(null)}
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
                onClick={handleConfirmRefund}
                disabled={!refundReason.trim()}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: refundReason.trim() ? 1 : 0.6,
                }}
              >
                Authorize Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
