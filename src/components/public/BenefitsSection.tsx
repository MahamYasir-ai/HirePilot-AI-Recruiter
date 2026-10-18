import React from 'react';
import { Sparkles, CheckCircle2, Bot, Shield, FileText, ArrowRight } from 'lucide-react';

interface Props {
  onExploreJobs: () => void;
  onOpenChat: () => void;
}

export const BenefitsSection: React.FC<Props> = ({ onExploreJobs, onOpenChat }) => {
  return (
    <section id="benefits" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
            Platform Architecture & Values
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How HirePilot AI Transforms Candidate Discovery
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Designed for Nexora Technologies, HirePilot AI bridges applicants and hiring teams with clear transparency, non-discriminatory screening, and real-time interview preparation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Conversational Recruiter</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ask questions about job requirements, explore matching roles based on your coursework and repositories, and receive instant, grounded responses.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Informational Skills Match</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent feedback identifies competencies you've demonstrated alongside constructive suggestions for strengthening your technical profile.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero-Bias & Fair Evaluation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No automatic hiring or rejection decisions. The platform never evaluates protected characteristics and keeps candidate data consent-driven.
            </p>
          </div>
        </div>

        {/* Process Steps (How It Works) with Collaboration Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-slate-100">
          {/* Left Column: Photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 bg-slate-100">
              <img
                src="/src/assets/images/team_collaboration_tech_1792353150132.jpg"
                alt="Engineering team collaborating at Nexora Technologies"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="pt-3 text-xs text-slate-500 text-center">
              Demonstration engineering culture · Fictional tech workplace
            </div>
          </div>

          {/* Right Column: Process Steps */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Recruitment Flow
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                How The Demonstration Process Works
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200 shrink-0">
                  01
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Explore Open Vacancies</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Browse 5 structured junior and internship positions across Software Engineering, AI, Automation, and Web Development.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200 shrink-0">
                  02
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Conversational Screening & Matching</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Share your technical background with HirePilot AI Recruiter to receive an objective breakdown of matching competencies and learning recommendations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200 shrink-0">
                  03
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Interview Practice</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Prepare with realistic technical questions tailored to your chosen vacancy (e.g. lists vs tuples for Python, webhooks for Automation).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200 shrink-0">
                  04
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">HR Workspace Review</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    HR recruiters inspect candidate evidence, review transcripts with candidate consent, and update pipeline stages in the dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenChat}
                className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Try Conversational AI Recruiter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
