import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Sparkles,
  BookOpen,
  MessageSquare,
  Smartphone,
  Database,
  BarChart3,
  Settings,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  X,
  FileCheck,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Application, Candidate, ConversationSession, FAQItem, Job, KnowledgeDocument, WhatsAppConfig, ApplicationStage } from '../../types';
import { api } from '../../utils/api';

interface Props {
  onBackToPublic: () => void;
  onOpenChat: () => void;
}

export const HRDashboard: React.FC<Props> = ({ onBackToPublic, onOpenChat }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'applications'
    | 'candidates'
    | 'jobs'
    | 'screening'
    | 'interview-prep'
    | 'conversations'
    | 'whatsapp'
    | 'knowledge'
    | 'analytics'
    | 'settings'
  >('overview');

  // Data States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [whatsappStatus, setWhatsappStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Selected entities for drawers / modals
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  // AI Screening Tool States
  const [screenCandidateId, setScreenCandidateId] = useState<string>('');
  const [screenJobId, setScreenJobId] = useState<string>('');
  const [screeningResult, setScreeningResult] = useState<any>(null);
  const [isScreening, setIsScreening] = useState(false);

  // Application Filters
  const [appSearch, setAppSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Knowledge Base New FAQ Modal State
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState<'General' | 'Vacancies' | 'Application' | 'Interviews' | 'Privacy'>('General');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Data Load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [jobsData, appsData, candsData, convsData, kbData, waData] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
        api.getCandidates(),
        api.getConversations(),
        api.getKnowledgeBase(),
        api.getWhatsAppStatus()
      ]);

      setJobs(jobsData);
      setApplications(appsData);
      setCandidates(candsData);
      setConversations(convsData);
      setFaqs(kbData.faqs);
      setKnowledgeDocs(kbData.documents);
      setWhatsappStatus(waData);

      if (candsData.length > 0) setScreenCandidateId(candsData[0].id);
      if (jobsData.length > 0) setScreenJobId(jobsData[0].id);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Error syncing dashboard data. Check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Application Stage Update Handler
  const handleStageChange = async (appId: string, newStage: ApplicationStage) => {
    try {
      const updated = await api.updateApplicationStage(appId, newStage);
      setApplications(prev => prev.map(a => (a.id === appId ? updated : a)));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(updated);
      }
      showToast(`Application updated to stage: ${newStage}`);
    } catch (err: any) {
      showToast(`Failed to update stage: ${err.message}`);
    }
  };

  // Add Note to Application
  const handleAddNote = async (appId: string) => {
    if (!newNoteText.trim()) return;
    try {
      const updated = await api.updateApplicationStage(appId, selectedApp?.stage || 'New', newNoteText.trim());
      setApplications(prev => prev.map(a => (a.id === appId ? updated : a)));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(updated);
      }
      setNewNoteText('');
      showToast('Internal note saved to candidate record.');
    } catch (err: any) {
      showToast(`Failed to save note: ${err.message}`);
    }
  };

  // Candidate Deletion
  const handleDeleteCandidate = async (candidateId: string) => {
    if (!window.confirm('Delete this demo candidate profile and associated applications?')) return;
    try {
      await api.deleteCandidate(candidateId);
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      setApplications(prev => prev.filter(a => a.candidateId !== candidateId));
      setSelectedCandidate(null);
      setSelectedApp(null);
      showToast('Candidate record removed successfully.');
    } catch (err: any) {
      showToast(`Failed to delete: ${err.message}`);
    }
  };

  // Run AI Screening Tool
  const handleRunScreening = async () => {
    const cand = candidates.find(c => c.id === screenCandidateId);
    const job = jobs.find(j => j.id === screenJobId);
    if (!cand || !job) return;

    setIsScreening(true);
    try {
      const result = await api.screenCandidate({
        candidateSkills: cand.skills,
        candidateExperience: cand.experience,
        candidateProjects: cand.projects,
        jobTitle: job.title
      });
      setScreeningResult(result);
    } catch (err: any) {
      showToast(`Screening error: ${err.message}`);
    } finally {
      setIsScreening(false);
    }
  };

  // Reset Demo Data
  const handleResetData = async () => {
    if (!window.confirm('Reset all demo data back to clean initial state?')) return;
    try {
      await api.resetDemoData();
      await loadAllData();
      showToast('All demonstration data has been reset to defaults.');
    } catch (err: any) {
      showToast(`Reset failed: ${err.message}`);
    }
  };

  // Filtered Applications Table
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch =
        app.candidateName.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.skills.some(s => s.toLowerCase().includes(appSearch.toLowerCase()));

      const matchesStage = stageFilter === 'All' || app.stage === stageFilter;
      const matchesSource = sourceFilter === 'All' || app.source === sourceFilter;

      return matchesSearch && matchesStage && matchesSource;
    });
  }, [applications, appSearch, stageFilter, sourceFilter]);

  // Stage counts for KPI overview
  const stageStats = useMemo(() => {
    const counts: Record<string, number> = {
      New: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0
    };
    applications.forEach(a => {
      if (counts[a.stage] !== undefined) counts[a.stage]++;
    });
    return counts;
  }, [applications]);

  const stages: ApplicationStage[] = [
    'New',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
    'Withdrawn'
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs">
            HP
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>HirePilot AI</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-teal-400 font-medium">HR Recruitment Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-slate-800 text-slate-300 rounded border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Fictional Demo Environment</span>
          </span>
          <button
            onClick={onBackToPublic}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            Candidate Portal
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recruitment Navigation
            </span>
          </div>

          <nav className="p-3 space-y-1 text-xs font-medium flex-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'applications' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Applications</span>
              </div>
              <span className="font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-300 tabular-nums">
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'candidates' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Candidates</span>
              </div>
              <span className="font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-300 tabular-nums">
                {candidates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'jobs' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Job Listings</span>
              </div>
              <span className="font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-300 tabular-nums">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('screening')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'screening' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Skills Screening</span>
            </button>

            <button
              onClick={() => setActiveTab('interview-prep')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'interview-prep' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Interview Question Bank</span>
            </button>

            <button
              onClick={() => setActiveTab('conversations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'conversations' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Chat Conversations</span>
              </div>
              <span className="font-mono text-[11px] bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-300 tabular-nums">
                {conversations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'whatsapp' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp Integration</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Not connected" />
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'knowledge' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Knowledge Base</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'analytics' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Logs</span>
            </button>
          </nav>

          <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Recruiter:</span>
              <span className="text-white font-medium">Sarah Jenkins</span>
            </div>
            <div className="flex items-center justify-between">
              <span>System Mode:</span>
              <span className="text-teal-400 font-medium">Full Demo Mode</span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Pipeline Overview</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time metrics for simulated demonstration applications and conversational candidate touchpoints.
                  </p>
                </div>
                <button
                  onClick={loadAllData}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Data</span>
                </button>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs font-medium text-slate-500">Total Demo Applications</div>
                  <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {applications.length}
                  </div>
                  <div className="text-[11px] text-slate-400">Across 5 demonstration roles</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs font-medium text-slate-500">Active Pipeline (In Progress)</div>
                  <div className="text-2xl font-bold text-teal-700 font-mono tabular-nums">
                    {applications.filter(a => a.stage === 'New' || a.stage === 'Under Review' || a.stage === 'Shortlisted').length}
                  </div>
                  <div className="text-[11px] text-slate-400">New, Under Review & Shortlisted</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs font-medium text-slate-500">Candidate Conversations</div>
                  <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {conversations.length}
                  </div>
                  <div className="text-[11px] text-slate-400">Website & WhatsApp sessions</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-xs font-medium text-slate-500">WhatsApp Cloud API</div>
                  <div className="text-sm font-bold text-amber-700 flex items-center gap-1.5 pt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Not Connected</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Awaiting Meta credentials</div>
                </div>
              </div>

              {/* Pipeline Stage Distribution & Application Source */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Stage Breakdown (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Candidates by Application Stage</h3>
                  <div className="space-y-3">
                    {Object.entries(stageStats).map(([stage, count]) => {
                      const pct = applications.length ? Math.round((count / applications.length) * 100) : 0;
                      return (
                        <div key={stage} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700">{stage}</span>
                            <span className="text-slate-500 font-mono tabular-nums">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Vacancies (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Applications by Role</h3>
                  <div className="space-y-3 text-xs">
                    {jobs.map(job => {
                      const count = applications.filter(a => a.jobTitle === job.title).length;
                      return (
                        <div key={job.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-800">{job.title}</div>
                            <div className="text-[11px] text-slate-500">{job.department}</div>
                          </div>
                          <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Applications Feed */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Recent Candidate Submissions</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-teal-700 hover:text-teal-900 font-medium cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 4).map(app => (
                    <div key={app.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{app.candidateName}</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-600">{app.jobTitle}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Applied {app.appliedDate} · Source: {app.source}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200">
                          {app.stage}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setActiveTab('applications');
                          }}
                          className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Management</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Search, filter, evaluate skills alignment, and update recruitment pipeline stages.
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900 tabular-nums">{filteredApplications.length}</span> candidates
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={e => setAppSearch(e.target.value)}
                    placeholder="Search candidate name, email, role, or skills..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={stageFilter}
                    onChange={e => setStageFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="All">All Stages</option>
                    {stages.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={sourceFilter}
                    onChange={e => setSourceFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="All">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Demo Chat">Demo Chat</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Applied Role</th>
                        <th className="py-3 px-4">Skills</th>
                        <th className="py-3 px-4">Applied Date</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Stage</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            No applications match the current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map(app => (
                          <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{app.candidateName}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{app.candidateEmail}</div>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">
                              {app.jobTitle}
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                              {app.skills.join(', ')}
                            </td>
                            <td className="py-3 px-4 text-slate-500 tabular-nums">
                              {app.appliedDate}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                                {app.source}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={app.stage}
                                onChange={e => handleStageChange(app.id, e.target.value as ApplicationStage)}
                                className="text-xs px-2 py-1 rounded border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                              >
                                {stages.map(s => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="px-2.5 py-1 text-xs font-semibold text-teal-800 hover:text-white bg-teal-50 hover:bg-teal-700 rounded transition-colors cursor-pointer"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Application Detail Drawer / Modal */}
              {selectedApp && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-teal-700 uppercase font-semibold">
                          Application #{selectedApp.id} · {selectedApp.source}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedApp.candidateName}</h2>
                        <p className="text-xs text-slate-500">{selectedApp.candidateEmail} · Target: {selectedApp.jobTitle}</p>
                      </div>
                      <button
                        onClick={() => setSelectedApp(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
                      {/* Current Stage Controller */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-slate-500 font-medium block">Pipeline Stage</span>
                          <span className="font-bold text-sm text-slate-900">{selectedApp.stage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-slate-600 font-medium">Update Stage:</label>
                          <select
                            value={selectedApp.stage}
                            onChange={e => handleStageChange(selectedApp.id, e.target.value as ApplicationStage)}
                            className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                          >
                            {stages.map(s => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Skills Stated */}
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                          Reported Technical Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.skills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Experience Summary */}
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                          Experience Summary
                        </h4>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                          {selectedApp.experienceSummary}
                        </p>
                      </div>

                      {/* Recruiter Notes & History */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                          Internal Recruiter Notes
                        </h4>
                        <div className="space-y-1.5">
                          {selectedApp.notes && selectedApp.notes.length > 0 ? (
                            selectedApp.notes.map((note, idx) => (
                              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                                {note}
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-400">No recruiter notes logged yet.</p>
                          )}
                        </div>

                        {/* Add note input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={newNoteText}
                            onChange={e => setNewNoteText(e.target.value)}
                            placeholder="Add internal evaluation note..."
                            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                          <button
                            onClick={() => handleAddNote(selectedApp.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Demo changes persist to local server runtime.
                      </span>
                      <button
                        onClick={() => setSelectedApp(null)}
                        className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CANDIDATES */}
          {activeTab === 'candidates' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidate Profiles</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Privacy-aware candidate registry with full education, portfolio links, and deletion controls.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{candidate.fullName}</h3>
                        <p className="text-xs text-slate-400 font-mono">{candidate.email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete demo candidate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-700">Education: </span>
                        <span>{candidate.education}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Arrangement: </span>
                        <span>{candidate.preferredArrangement} · {candidate.availability}</span>
                      </div>
                      {candidate.portfolioUrl && (
                        <div className="flex items-center gap-1 text-teal-700 font-medium">
                          <ExternalLink className="w-3 h-3" />
                          <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">
                            {candidate.portfolioUrl}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 text-[11px] pt-1">
                      {candidate.skills.slice(0, 6).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Consent Recorded</span>
                      </span>
                      <button
                        onClick={() => {
                          setScreenCandidateId(candidate.id);
                          setActiveTab('screening');
                        }}
                        className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                      >
                        Run AI Match &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JOB LISTINGS MANAGEMENT */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vacancies Management</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create, edit, publish, or archive demonstration roles.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingJob(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Demonstration Job</span>
                </button>
              </div>

              <div className="space-y-4">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{job.department}</span>
                        <span>·</span>
                        <span>{job.level}</span>
                        <span>·</span>
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.2 rounded text-[11px] font-medium border border-amber-200">
                          {job.workArrangement}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{job.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingJob(job)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit / Create Job Modal */}
              {(editingJob || isCreatingJob) && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="font-bold text-slate-900 text-base">
                        {editingJob ? `Edit: ${editingJob.title}` : 'Create New Demonstration Vacancy'}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingJob(null);
                          setIsCreatingJob(false);
                        }}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={async e => {
                        e.preventDefault();
                        const form = e.target as any;
                        const jobData = {
                          title: form.title.value,
                          department: form.department.value,
                          level: form.level.value,
                          description: form.description.value,
                          requiredSkills: form.skills.value.split(',').map((s: string) => s.trim())
                        };

                        try {
                          if (editingJob) {
                            const updated = await api.updateJob(editingJob.id, jobData);
                            setJobs(prev => prev.map(j => (j.id === editingJob.id ? updated : j)));
                            showToast('Job listing updated.');
                          } else {
                            const created = await api.createJob(jobData);
                            setJobs(prev => [created, ...prev]);
                            showToast('New demonstration job created.');
                          }
                          setEditingJob(null);
                          setIsCreatingJob(false);
                        } catch (err: any) {
                          showToast(`Error: ${err.message}`);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                        <input
                          name="title"
                          defaultValue={editingJob?.title || ''}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Department</label>
                          <input
                            name="department"
                            defaultValue={editingJob?.department || 'Software Engineering'}
                            required
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
                          <select
                            name="level"
                            defaultValue={editingJob?.level || 'Junior'}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="Entry-level">Entry-level</option>
                            <option value="Internship">Internship</option>
                            <option value="Junior">Junior</option>
                            <option value="Mid-level">Mid-level</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
                        <textarea
                          name="description"
                          rows={3}
                          defaultValue={editingJob?.description || ''}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                        <input
                          name="skills"
                          defaultValue={editingJob?.requiredSkills.join(', ') || 'Python, Git, APIs'}
                          required
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJob(null);
                            setIsCreatingJob(false);
                          }}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                        >
                          Save Listing
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI SKILLS SCREENING TOOL */}
          {activeTab === 'screening' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Skills Matcher & Screening</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare candidate coursework and repository evidence with vacancy requirements. Informational assistance only—never automated rejection.
                </p>
              </div>

              {/* Selector Bar */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Candidate</label>
                  <select
                    value={screenCandidateId}
                    onChange={e => setScreenCandidateId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Vacancy</label>
                  <select
                    value={screenJobId}
                    onChange={e => setScreenJobId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={handleRunScreening}
                    disabled={isScreening}
                    className="w-full py-2 px-3 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isScreening ? 'Analyzing...' : 'Run Match'}</span>
                  </button>
                </div>
              </div>

              {/* Results */}
              {screeningResult && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Screening Evaluation: {screeningResult.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Recommendation: <span className="font-semibold text-teal-700">{screeningResult.matchRecommendation}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                        {screeningResult.matchScore}%
                      </span>
                      <span className="block text-[10px] text-slate-400">Match Metric</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Matching skills */}
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/70 space-y-2">
                      <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Demonstrated Skills ({screeningResult.matchingSkills.length})</span>
                      </h4>
                      <ul className="space-y-1 text-slate-700">
                        {screeningResult.matchingSkills.map((s: string) => (
                          <li key={s} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing skills */}
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
                      <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Competencies Not Yet Evidenced ({screeningResult.skillsNotDemonstrated.length})</span>
                      </h4>
                      <ul className="space-y-1 text-slate-700">
                        {screeningResult.skillsNotDemonstrated.map((s: string) => (
                          <li key={s} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Summary explanation */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Objective Evaluation Explanation
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {screeningResult.summaryExplanation}
                    </p>
                  </div>

                  {/* Suggested follow-up questions */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Suggested Follow-Up Interview Probes
                    </span>
                    <div className="space-y-1.5">
                      {screeningResult.suggestedFollowUpQuestions.map((q: string, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: INTERVIEW QUESTION BANK */}
          {activeTab === 'interview-prep' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interview Question Bank & Rubrics</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated technical questions for all 5 demonstration roles as defined in the Nexora Technologies knowledge base.
                </p>
              </div>

              <div className="space-y-6">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{job.title}</h3>
                        <p className="text-xs text-slate-500">{job.department} · {job.level}</p>
                      </div>
                      <span className="text-xs font-mono text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                        {job.interviewQuestions.length} Questions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {job.interviewQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <span className="font-mono font-bold text-teal-700">Question 0{idx + 1}</span>
                          <p className="text-slate-800 font-medium">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CHAT CONVERSATIONS */}
          {activeTab === 'conversations' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recruiter Chat Sessions</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transcripts of candidate conversations with HirePilot AI Recruiter and WhatsApp Assistant.
                </p>
              </div>

              <div className="space-y-4">
                {conversations.map(conv => (
                  <div key={conv.id} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {conv.candidateName || 'Anonymous Visitor'} ({conv.channel})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Started: {conv.startedAt} · Topic: {conv.jobInterest || 'General Inquiry'}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {conv.messages.length} Messages
                      </span>
                    </div>

                    <div className="p-4 space-y-2 max-h-56 overflow-y-auto text-xs bg-slate-50/30">
                      {conv.messages.map((m, i) => (
                        <div
                          key={i}
                          className={`p-2.5 rounded-lg max-w-[85%] ${
                            m.sender === 'user'
                              ? 'ml-auto bg-slate-900 text-white'
                              : 'mr-auto bg-white border border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="whitespace-pre-line">{m.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: WHATSAPP INTEGRATION */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">WhatsApp Cloud API Configuration</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Meta Business Platform webhook settings and connection diagnostics.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Connection State</h3>
                    <p className="text-xs text-slate-500">Live webhook endpoint verification</p>
                  </div>
                  <span className="px-3 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Not Connected (Awaiting Meta Credentials)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-medium block">Callback URL</span>
                    <code className="font-mono text-teal-800 break-all">/api/whatsapp/webhook</code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-medium block">Verification Secret</span>
                    <code className="font-mono text-slate-800">hirepilot_meta_webhook_secret_2026</code>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <h4 className="font-bold text-slate-900">Environment Setup</h4>
                  <p>
                    To establish a live outbound connection, define <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">WHATSAPP_ACCESS_TOKEN</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">WHATSAPP_PHONE_NUMBER_ID</code> in your server secrets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: KNOWLEDGE BASE */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Knowledge Base</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Source of truth for candidate answers, screening criteria, and interview questions.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingFaq(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ Item</span>
                </button>
              </div>

              {/* Indexed Documents */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Uploaded Recruitment Documents</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {knowledgeDocs.map(doc => (
                    <div key={doc.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-500">{doc.contentSummary}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-400">{doc.size}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium text-[11px]">
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Configured FAQ Answers ({faqs.length})</h3>
                <div className="space-y-2 text-xs">
                  {faqs.map(faq => (
                    <div key={faq.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{faq.question}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-medium text-slate-700">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add FAQ Modal */}
              {isAddingFaq && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="font-bold text-slate-900 text-sm">Add New FAQ Entry</h3>
                      <button onClick={() => setIsAddingFaq(false)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={async e => {
                        e.preventDefault();
                        try {
                          const newF = await api.addFaq({
                            question: newFaqQuestion,
                            answer: newFaqAnswer,
                            category: newFaqCategory
                          });
                          setFaqs(prev => [newF, ...prev]);
                          setIsAddingFaq(false);
                          setNewFaqQuestion('');
                          setNewFaqAnswer('');
                          showToast('FAQ entry added to knowledge base.');
                        } catch (err: any) {
                          showToast(`Error: ${err.message}`);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Question</label>
                        <input
                          type="text"
                          value={newFaqQuestion}
                          onChange={e => setNewFaqQuestion(e.target.value)}
                          required
                          placeholder="e.g. Can I apply for multiple roles?"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Answer</label>
                        <textarea
                          rows={3}
                          value={newFaqAnswer}
                          onChange={e => setNewFaqAnswer(e.target.value)}
                          required
                          placeholder="Provide verified answer grounded in Nexora recruitment policy..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Category</label>
                        <select
                          value={newFaqCategory}
                          onChange={e => setNewFaqCategory(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        >
                          <option value="General">General</option>
                          <option value="Vacancies">Vacancies</option>
                          <option value="Application">Application</option>
                          <option value="Interviews">Interviews</option>
                          <option value="Privacy">Privacy</option>
                        </select>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingFaq(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                        >
                          Save FAQ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recruitment Analytics</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulated candidate traffic, channel conversion, and role popularity metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500">Website Portal Channel</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                    {applications.filter(a => a.source === 'Website').length}
                  </div>
                  <span className="text-[11px] text-slate-400">Direct form submissions</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500">WhatsApp Assistant Channel</span>
                  <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                    {applications.filter(a => a.source === 'WhatsApp').length}
                  </div>
                  <span className="text-[11px] text-slate-400">Mobile conversational flows</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500">AI Recruiter Chatbot Channel</span>
                  <div className="text-2xl font-bold text-teal-700 font-mono tabular-nums">
                    {applications.filter(a => a.source === 'Demo Chat').length}
                  </div>
                  <span className="text-[11px] text-slate-400">In-session chat completions</span>
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Pipeline Conversion Funnel</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-lg font-mono text-slate-900 tabular-nums">{applications.length}</div>
                    <div className="text-slate-500">Total Inbound</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-lg font-mono text-slate-900 tabular-nums">
                      {applications.filter(a => a.stage === 'Shortlisted' || a.stage === 'Interview' || a.stage === 'Selected').length}
                    </div>
                    <div className="text-slate-500">Shortlisted</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-lg font-mono text-slate-900 tabular-nums">
                      {applications.filter(a => a.stage === 'Interview' || a.stage === 'Selected').length}
                    </div>
                    <div className="text-slate-500">Interviewed</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-lg font-mono text-slate-900 tabular-nums">
                      {applications.filter(a => a.stage === 'Selected').length}
                    </div>
                    <div className="text-slate-500">Selected (Demo)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings & Data Controls</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage simulation parameters, reset demo databases, and review access policies.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6 text-xs">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">Reset Demonstration Data</h3>
                  <p className="text-slate-600 mb-3">
                    Restores all candidates, applications, jobs, and chat transcripts to their initial seed state.
                  </p>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset All Demo Data
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900">Privacy & Fairness Audit Policy</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Zero-pill metadata discipline and clean typography applied across all views.</li>
                    <li>No protected personal characteristics evaluated or recorded.</li>
                    <li>Informational AI screening suggestions require human recruiter sign-off before advancing candidates.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
