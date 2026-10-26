import React, { useState } from 'react';

interface UploadSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const UploadSprintModal: React.FC<UploadSprintModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onClose();
      showToast('Sprint video analyzed: Max velocity 10.42 m/s, Stride cadence 4.2 steps/sec');
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[22px]">videocam</span>
            <h3 className="font-bold text-base text-slate-900">Upload Sprint Footage</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleSimulateUpload();
          }}
          onClick={handleSimulateUpload}
          className={`border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all my-4 ${
            dragActive
              ? 'border-blue-600 bg-blue-50'
              : 'border-slate-200 hover:border-blue-400 bg-slate-50'
          }`}
        >
          {analyzing ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                AI Biomechanical Pose Estimation in progress...
              </p>
              <span className="text-[11px] text-slate-500">Measuring ground reaction forces & stride cadence</span>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </div>
              <p className="text-sm font-bold text-slate-900">Drag & drop 400m / 200m track video</p>
              <p className="text-xs text-slate-500 mt-1">Supports MP4, MOV up to 4K 120fps</p>
              <button
                type="button"
                className="mt-4 px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
              >
                Browse Video Files
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          Footage is scanned for knee angle extension, torso tilt, and hurdle/sprint kinematics.
        </p>
      </div>
    </div>
  );
};
