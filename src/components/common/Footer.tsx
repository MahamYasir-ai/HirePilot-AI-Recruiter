import React from 'react';
import { Compass, ShieldCheck, ExternalLink } from 'lucide-react';

interface Props {
  onNavigate: (view: 'public' | 'dashboard' | 'whatsapp', section?: string) => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenChat }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                HirePilot <span className="text-teal-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smarter Hiring. Better Connections. AI recruitment platform demonstration for Nexora Technologies.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Simulated Demonstration Environment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">Vacancies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('public', 'jobs')} className="hover:text-white transition-colors cursor-pointer">
                  Junior Python Developer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'jobs')} className="hover:text-white transition-colors cursor-pointer">
                  AI/ML Intern
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'jobs')} className="hover:text-white transition-colors cursor-pointer">
                  AI Automation Engineer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'jobs')} className="hover:text-white transition-colors cursor-pointer">
                  Frontend Developer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'jobs')} className="hover:text-white transition-colors cursor-pointer">
                  Full-Stack Developer
                </button>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">Candidate Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenChat} className="hover:text-white transition-colors cursor-pointer text-teal-300">
                  HirePilot AI Recruiter Chat
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('whatsapp')} className="hover:text-white transition-colors cursor-pointer">
                  WhatsApp Assistant Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'help')} className="hover:text-white transition-colors cursor-pointer">
                  Interview Preparation Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('public', 'help')} className="hover:text-white transition-colors cursor-pointer">
                  Recruitment FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* HR Management */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">HR Workspace</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Talent Pipeline & Applications
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  AI Skills Matcher
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  WhatsApp Business Webhooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Knowledge Base & Rubrics
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HirePilot AI. Built for Nexora Technologies Demonstration. Fictional demo environment.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Strict Privacy Protocol</span>
            <span>·</span>
            <span className="hover:text-slate-400">No Automated Rejection</span>
            <span>·</span>
            <span className="hover:text-slate-400">WCAG AA Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
