import React from 'react';
import { ArrowRight, Bot, Sparkles, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';
import heroWorkspaceImg from '../../assets/images/hero_recruitment_workspace_1792353150210.jpg';

interface Props {
  onExploreJobs: () => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<Props> = ({ onExploreJobs, onOpenChat }) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Generation Recruitment Technology</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              Find Your Next Opportunity with HirePilot AI.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Explore demonstration vacancies at Nexora Technologies, evaluate your technical alignment with conversational screening, and practice role-tailored technical interview questions in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreJobs}
                className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenChat}
                className="px-6 py-3 text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-teal-700" />
                <span>Chat with AI Recruiter</span>
              </button>
            </div>

            {/* Adjacent Proof Strip */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-slate-600 text-xs sm:text-sm">
              <div>
                <span className="block font-bold text-slate-900 text-lg tabular-nums">5 Roles</span>
                <span className="text-slate-500 text-xs">Curated Vacancies</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 text-lg tabular-nums">0 Hallucination</span>
                <span className="text-slate-500 text-xs">Knowledge-Grounded</span>
              </div>
              <div>
                <span className="block font-bold text-slate-900 text-lg tabular-nums">100% Consent</span>
                <span className="text-slate-500 text-xs">Simulated Demo Data</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100 aspect-16/10 lg:aspect-4/3">
              <img
                src={heroWorkspaceImg}
                onError={(e) => {
                  e.currentTarget.src = '/images/hero_recruitment_workspace_1792353150210.jpg';
                }}
                alt="Modern technology workspace at Nexora Technologies"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
                    <Compass className="w-4 h-4" />
                    <span>Nexora Technologies Tech Campus</span>
                  </div>
                  <p className="text-sm font-semibold leading-snug">
                    Engineering intelligence for automated software & web ecosystems.
                  </p>
                  <p className="text-[11px] text-slate-300">
                    All open positions are verified demonstration opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
