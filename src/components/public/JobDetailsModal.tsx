import React from 'react';
import { X, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, Briefcase, Building, Layers, MapPin } from 'lucide-react';
import { Job } from '../../types';

interface Props {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  onAskAi: (job: Job) => void;
}

export const JobDetailsModal: React.FC<Props> = ({ job, onClose, onApply, onAskAi }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{job.department}</span>
              <span>·</span>
              <span>{job.level}</span>
              <span>·</span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200/60">
                Work Arrangement: {job.workArrangement}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{job.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Demo Notice Callout */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold">Demonstration Vacancy Notice:</strong> This position is a fictional demonstration vacancy created for testing HirePilot AI. No real employment, salary, or deadline exists at Nexora Technologies.
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Role Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Key Responsibilities</h3>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold shrink-0">·</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium text-slate-800 bg-slate-100 rounded-md border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Preferred Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.preferredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium text-teal-800 bg-teal-50 rounded-md border border-teal-200/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Ideal Candidate Profile */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">Ideal Candidate Profile</span>
            <p>{job.idealCandidate}</p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onAskAi(job);
              onClose();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Ask AI About This Job</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onApply(job);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Start Demo Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
