import React from 'react';
import { Compass, Menu, X, ArrowUpRight } from 'lucide-react';

interface Props {
  currentView: 'public' | 'dashboard' | 'whatsapp';
  onNavigate: (view: 'public' | 'dashboard' | 'whatsapp', section?: string) => void;
  onOpenChat: () => void;
}

export const Header: React.FC<Props> = ({ currentView, onNavigate, onOpenChat }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('public')}
          className="flex items-center gap-2.5 text-left group cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400 group-hover:bg-slate-800 transition-colors shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              HirePilot <span className="text-teal-600 font-semibold">AI</span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('public', 'jobs')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Vacancies
          </button>
          <button
            onClick={() => onNavigate('public', 'benefits')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('whatsapp')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
          >
            WhatsApp Assistant
          </button>
          <button
            onClick={() => onNavigate('public', 'help')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Help Center
          </button>
          <button
            onClick={onOpenChat}
            className="text-teal-700 hover:text-teal-800 font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            AI Recruiter
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView !== 'dashboard' ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>HR Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('public')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Public Careers
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          <button
            onClick={() => {
              onNavigate('public', 'jobs');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Vacancies (5 Roles)
          </button>
          <button
            onClick={() => {
              onNavigate('public', 'benefits');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onNavigate('whatsapp');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            WhatsApp Recruitment Assistant
          </button>
          <button
            onClick={() => {
              onNavigate('public', 'help');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Help Center & FAQs
          </button>
          <button
            onClick={() => {
              onOpenChat();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            Open AI Recruiter Chat
          </button>
        </div>
      )}
    </header>
  );
};
