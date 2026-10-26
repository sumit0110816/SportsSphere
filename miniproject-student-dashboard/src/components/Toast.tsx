import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <span className="material-symbols-outlined text-teal-400 text-[20px] shrink-0">
        check_circle
      </span>
      <span>{message}</span>
    </div>
  );
};
