import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Plus, Trophy, Users, Calendar, MapPin } from 'lucide-react';
import { ViewId } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
  onOpenCreateModal: () => void;
  pendingCount: number;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCreateModal,
  pendingCount,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'fixtures',
      title: 'Go to Fixtures & Schedule',
      desc: 'View knockout brackets, elimination tree, and timings',
      action: () => {
        onNavigate('fixtures');
        onClose();
      },
      icon: Calendar,
      type: 'Jump',
    },
    {
      id: 'scores',
      title: 'Go to Match Score Entry',
      desc: 'Referee live scoreboard & points confirmation',
      action: () => {
        onNavigate('scores');
        onClose();
      },
      icon: Trophy,
      type: 'Jump',
    },
    {
      id: 'registrations',
      title: `Review Pending Registrations (${pendingCount})`,
      desc: 'Document verification & athlete passes triage queue',
      action: () => {
        onNavigate('registrations');
        onClose();
      },
      icon: Users,
      type: 'Jump',
    },
    {
      id: 'create',
      title: 'Create New Sports Event',
      desc: 'Set up rules, capacities, venues, and registration fees',
      action: () => {
        onClose();
        onOpenCreateModal();
      },
      icon: Plus,
      type: 'Action',
    },
    {
      id: 'venues',
      title: 'Check Venue Availability',
      desc: 'Inspect Main Ground, Indoor Stadium & Track Field',
      action: () => {
        onNavigate('venues');
        onClose();
      },
      icon: MapPin,
      type: 'Jump',
    },
  ];

  const filtered = actions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 flex items-start justify-center pt-20 p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-fade-in text-xs">
          <div className="relative flex items-center mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a destination or action... (e.g. fixtures, scores, venues)"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 outline-hidden focus:border-blue-500 focus:bg-white transition-all text-slate-900"
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'Enter' && filtered.length > 0) {
                  filtered[0].action();
                }
              }}
            />
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                No matching results found for "{query}"
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full p-2.5 hover:bg-blue-50/80 active:bg-blue-100/70 rounded-xl cursor-pointer flex justify-between items-center transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-blue-900">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-tight">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px] px-2 py-0.5 rounded bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700">
                      {item.type} ↵
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Use ↑↓ to navigate</span>
            <span>Press ESC to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
