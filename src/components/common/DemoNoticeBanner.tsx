import React from 'react';
import { AlertCircle, ShieldAlert, ArrowRight, LayoutDashboard, UserCheck } from 'lucide-react';

interface Props {
  currentView: 'public' | 'dashboard' | 'whatsapp';
  onNavigate: (view: 'public' | 'dashboard' | 'whatsapp') => void;
}

export const DemoNoticeBanner: React.FC<Props> = ({ currentView, onNavigate }) => {
  return (
    <aside aria-label="Demo Disclaimer" className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
          <p>
            <span className="font-semibold text-white">Demonstration Notice:</span> Nexora Technologies and all vacancies, candidates, and recruitment outcomes are simulated demo assets. No real hiring is conducted.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentView !== 'dashboard' ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-teal-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Switch to HR Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('public')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Back to Candidate Careers</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
