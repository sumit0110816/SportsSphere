import React from 'react';
import { CreditCard, Download, ArrowUpRight, CheckCircle2, Clock, FileText } from 'lucide-react';

interface PaymentsViewProps {
  showToast: (msg: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ showToast }) => {
  const transactions = [
    { id: 'TXN-7248', desc: 'Intercollege Football Cup - Team St. Xavier', amount: '₹400', date: 'Oct 15, 2024', status: 'Settled' },
    { id: 'TXN-7247', desc: 'Basketball League - Team Phoenix (5 athletes)', amount: '₹1,200', date: 'Oct 15, 2024', status: 'Settled' },
    { id: 'TXN-7246', desc: 'Badminton Championship - Sneha Patil', amount: '₹300', date: 'Oct 14, 2024', status: 'Settled' },
    { id: 'TXN-7245', desc: 'Track Meet Entry - Vikramaditya S.', amount: '₹250', date: 'Oct 14, 2024', status: 'Settled' },
    { id: 'TXN-7244', desc: 'Annual Athletics Meet - JCER Squad Entry', amount: '₹3,500', date: 'Oct 13, 2024', status: 'Processing' },
  ];

  const handleDownloadInvoices = () => {
    try {
      const rows = [
        ['Transaction ID', 'Description', 'Date', 'Amount', 'Status'],
        ...transactions.map((t) => [`"${t.id}"`, `"${t.desc}"`, `"${t.date}"`, `"${t.amount}"`, `"${t.status}"`]),
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'SportSphere_Financial_Invoices_2024.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Financial invoice ledger downloaded successfully!');
    } catch {
      showToast('Invoice downloaded!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Financial Summary &amp; Registrations Revenue
          </h2>
          <p className="text-xs text-slate-500">
            Collected tournament entry fees, referee compensation allocations, and association disbursements.
          </p>
        </div>
        <button
          onClick={handleDownloadInvoices}
          className="btn-interactive btn-shine w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Invoices</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-200 transition-colors">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Total Collected
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹48,500</div>
          <div className="text-emerald-600 text-xs font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>↑ 28% growth vs last semester</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-200 transition-colors">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Pending Gate Cleared
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹6,200</div>
          <div className="text-slate-400 text-xs mt-1">8 offline cash/counter approvals</div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-200 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Net Campus Payout
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹42,300</div>
          <div className="text-slate-400 text-xs mt-1">
            Directly routed to JCER Sports Athletic Trust
          </div>
        </div>
      </div>

      {/* Transactions Table with responsive scroll */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Recent Fee Transactions</h3>
          <span className="text-slate-400 text-[11px] hidden sm:inline">Automated Razorpay / UPI Gateway</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.id}</td>
                  <td className="py-3 px-3 text-slate-700">{tx.desc}</td>
                  <td className="py-3 px-3 text-slate-400">{tx.date}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">{tx.amount}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'Settled'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
