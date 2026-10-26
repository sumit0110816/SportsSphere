import React, { useState } from 'react';
import { Award, QrCode, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface CertificatesViewProps {
  showToast: (msg: string) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ showToast }) => {
  const [recipientName, setRecipientName] = useState('Rohan Kumar');
  const [tournamentName, setTournamentName] = useState('Intercollege Football Cup 2024');
  const [teamName, setTeamName] = useState('St. Xavier Titans');
  const [honorType, setHonorType] = useState('Certificate of Athletic Merit');

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Certificate Generation &amp; Merits</h2>
          <p className="text-xs text-slate-500">
            Automated tamper-proof cryptographic and QR verifiable athletic participation credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Batch certificate PDF generation started for 486 students')}
            className="btn-interactive btn-shine px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Bulk Issue Certificates</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Certificate Designer Controls */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Customize Template</h3>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Award Designation</label>
            <select
              value={honorType}
              onChange={(e) => setHonorType(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
            >
              <option>Certificate of Athletic Merit</option>
              <option>Certificate of Participation</option>
              <option>Championship Winner - Gold Medalist</option>
              <option>Runner Up - Silver Honors</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Athlete Recipient</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tournament Event</label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Collegiate Institution</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => showToast(`Issued individual certificate for ${recipientName}!`)}
              className="btn-interactive btn-shine flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer shadow-xs"
            >
              Issue Certificate
            </button>
            <button
              onClick={() => showToast('Print preview generated in high-resolution')}
              className="btn-interactive p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shadow-2xs"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Certificate Visual Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center shadow-xs relative overflow-hidden bg-gradient-to-b from-slate-50/50 to-white hover:border-blue-300 transition-colors">
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Proof</span>
          </div>

          <div className="text-[10px] tracking-widest font-bold uppercase text-blue-600 mb-2">
            {honorType}
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            SportSphere Collegiate Honors
          </h3>
          <p className="text-xs text-slate-500 mt-3">This certifies that</p>
          <div className="text-xl font-bold text-slate-900 underline decoration-blue-500 decoration-2 mt-1">
            {recipientName}
          </div>
          <p className="text-xs text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
            has achieved distinction in <strong>{tournamentName}</strong> representing{' '}
            <strong>{teamName}</strong> with exemplary athletic prowess and sporting conduct.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-between items-center text-[11px] text-slate-500 gap-4">
            <div className="text-left">
              <div className="font-bold text-slate-800">Dr. S. K. Mahajan</div>
              <div className="text-[10px] text-slate-400">Dean of Physical Education, JCER</div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
              <QrCode className="w-6 h-6 text-slate-700" />
              <div className="text-left">
                <div className="font-mono text-emerald-600 text-[10px] font-bold">#SPH-2024-8842</div>
                <div className="text-[9px] text-slate-400">Scan to verify legitimacy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
