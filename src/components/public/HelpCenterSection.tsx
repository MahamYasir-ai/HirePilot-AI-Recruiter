import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Bot, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { FAQItem, Job } from '../../types';

interface Props {
  faqs: FAQItem[];
  jobs: Job[];
  onOpenChat: () => void;
  onSelectJobForPrep: (job: Job) => void;
}

export const HelpCenterSection: React.FC<Props> = ({ faqs, jobs, onOpenChat, onSelectJobForPrep }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPrepJobId, setSelectedPrepJobId] = useState<string>(jobs[0]?.id || 'job-1');

  const categories = ['All', 'Vacancies', 'General', 'Application', 'Privacy'];

  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory === 'All') return true;
    return faq.category === selectedCategory;
  });

  const selectedPrepJob = jobs.find(j => j.id === selectedPrepJobId) || jobs[0];

  return (
    <section id="help" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
            Candidate Knowledge Hub
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Help Center & Interview Preparation
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Find answers to verified recruitment questions, practice role-specific technical interview questions, or ask our AI Recruiter directly.
          </p>
        </div>

        {/* 2-Column Split: FAQs on Left, Interview Practice on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: FAQs Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
              {/* Category Filter Pills (Functional Buttons) */}
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredFaqs.map(faq => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-teal-800 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4.5 pb-4.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact Information Policy Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Notice Regarding Direct Contact Information</span>
              </div>
              <p>
                As defined in the recruitment policy, no real HR email, phone number, physical office address, or live company website has been configured for Nexora Technologies. Please avoid submitting confidential data.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Role-Specific Interview Practice (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                  <BookOpen className="w-4 h-4" />
                  <span>Interview Preparation Bank</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Practice Technical Questions</h3>
                <p className="text-xs text-slate-500">
                  Select a vacancy to preview tailored practice questions recommended in the Nexora knowledge base.
                </p>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Vacancy</label>
                <select
                  value={selectedPrepJobId}
                  onChange={e => setSelectedPrepJobId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Questions List */}
              {selectedPrepJob && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-slate-800">
                    Practice Set ({selectedPrepJob.interviewQuestions.length} Questions):
                  </div>
                  <ol className="space-y-2 text-xs text-slate-600">
                    {selectedPrepJob.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-2.5">
                        <span className="font-mono font-bold text-teal-700 shrink-0 tabular-nums">0{idx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={onOpenChat}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Bot className="w-4 h-4 text-teal-400" />
                  <span>Practice These in Live AI Chat</span>
                </button>
                <span className="text-[11px] text-slate-400 text-center">
                  Chatbot provides conversational hints and explains topics step-by-step.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
