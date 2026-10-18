import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Edit2, Sparkles, Send } from 'lucide-react';
import { Job, WorkArrangement } from '../../types';
import { api } from '../../utils/api';

interface Props {
  initialJob: Job | null;
  jobs: Job[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplicationModal: React.FC<Props> = ({ initialJob, jobs, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    jobTitle: initialJob ? initialJob.title : jobs[0]?.title || 'Junior Python Developer',
    education: '',
    skills: '',
    experience: '',
    projects: '',
    portfolioUrl: '',
    preferredArrangement: 'Hybrid' as WorkArrangement,
    availability: 'Immediate (2 weeks notice)',
    consentGiven: false
  });

  // Keep jobTitle in sync when initialJob changes
  React.useEffect(() => {
    if (initialJob) {
      setFormData(prev => ({ ...prev, jobTitle: initialJob.title }));
    }
  }, [initialJob]);

  if (!isOpen) return null;

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Please enter a valid email address.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.education.trim()) {
        setError('Please provide your educational background.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.skills.trim()) {
        setError('Please list your relevant technical skills.');
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.projects.trim()) {
        setError('Please describe at least one project or coursework demonstration.');
        return false;
      }
    } else if (currentStep === 5) {
      if (!formData.consentGiven) {
        setError('Please confirm consent to save this simulated demonstration application.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 6) as any);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1) as any);
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.submitApplication({
        fullName: formData.fullName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        education: formData.education,
        skills: skillsArray,
        experience: formData.experience,
        projects: formData.projects,
        portfolioUrl: formData.portfolioUrl,
        preferredArrangement: formData.preferredArrangement,
        availability: formData.availability,
        source: 'Website'
      });

      setSubmittedRefId(res.application.id);
      setStep(6);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit application. Please check fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setError(null);
    setSubmittedRefId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              {step === 6 ? 'Submission Confirmed' : `Step ${step} of 5`}
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {step === 6 ? 'Demo Application Received' : 'Candidate Demonstration Application'}
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 6 && (
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-teal-600 h-1 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-slate-500">
                Please provide your contact details for this demonstration.
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex.morgan@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Simulated demo email for communication tracking.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Position & Education */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selected Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jobTitle}
                  onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.title}>
                      {j.title} ({j.department} · {j.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Educational Background <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={e => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science or Self-Taught Software Developer"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Degree, bootcamp, coursework, or practical self-directed learning.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Experience */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Skills (Comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Python, Git, REST APIs, JSON, SQL"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  List languages, libraries, tools, and platforms you know.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work or Internship Experience (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Briefly describe any relevant internship, open source, or freelance work (or enter 'Fresh Graduate' / 'Entry-Level')."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Projects, Portfolio & Availability */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notable Projects or Code Repositories <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.projects}
                  onChange={e => setFormData({ ...formData, projects: e.target.value })}
                  placeholder="e.g. Built an automated data parser in Python with unit tests and GitHub documentation."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portfolio or GitHub URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/your-username"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Arrangement Preference
                  </label>
                  <select
                    value={formData.preferredArrangement}
                    onChange={e => setFormData({ ...formData, preferredArrangement: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Unconfirmed">Flexible / Unconfirmed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Earliest Availability
                  </label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={e => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g. Immediate, 2 weeks"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Consent */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-slate-900">Application Summary</span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Answers</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="block text-[11px] text-slate-400">Applicant</span>
                    <span className="font-medium text-slate-800">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Email</span>
                    <span className="font-medium text-slate-800">{formData.email}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Role</span>
                    <span className="font-medium text-slate-800">{formData.jobTitle}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400">Education</span>
                    <span className="font-medium text-slate-800">{formData.education}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[11px] text-slate-400">Skills Stated</span>
                    <span className="font-medium text-slate-800">{formData.skills}</span>
                  </div>
                </div>
              </div>

              {/* Consent Box */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I acknowledge that <strong className="text-slate-900">Nexora Technologies is a fictional company</strong> and this application is submitted into a demonstration database for evaluation purposes. No real employer has received this information.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {step === 6 && (
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 border border-teal-200 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Demonstration Application Received!</h3>
                <p className="text-xs text-slate-500">
                  Your simulated candidate record has been saved to the HirePilot AI HR database.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 max-w-sm mx-auto text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">#{submittedRefId || 'DEMO-100'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate:</span>
                  <span className="font-medium text-slate-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="font-medium text-slate-800">{formData.jobTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Initial Stage:</span>
                  <span className="font-medium text-teal-700">New</span>
                </div>
              </div>

              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg max-w-sm mx-auto">
                Reminder: This is an AI recruitment demonstration. No real recruiter or HR will contact you.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step < 6 ? (
            <>
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Demo Application'}</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={resetForm}
              className="w-full px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Done & Return to Careers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
