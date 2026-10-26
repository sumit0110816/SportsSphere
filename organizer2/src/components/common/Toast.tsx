import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in pointer-events-none">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-medium border border-slate-700/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
        <span>{message}</span>
      </div>
    </div>
  );
};
