import {
  Application,
  Candidate,
  ConversationSession,
  FAQItem,
  Job,
  KnowledgeDocument,
  WhatsAppConfig,
  ScreeningEvaluation,
  ApplicationStage
} from '../types';
import { INITIAL_JOBS, INITIAL_FAQS, INITIAL_KNOWLEDGE_DOCS } from '../data/knowledgeBase';
import { INITIAL_APPLICATIONS, INITIAL_CANDIDATES, INITIAL_CONVERSATIONS, INITIAL_WHATSAPP_CONFIG } from '../data/initialData';

// Local storage keys
const STORAGE_KEYS = {
  JOBS: 'hirepilot_jobs',
  APPLICATIONS: 'hirepilot_applications',
  CANDIDATES: 'hirepilot_candidates',
  CONVERSATIONS: 'hirepilot_conversations',
  FAQS: 'hirepilot_faqs',
  DOCUMENTS: 'hirepilot_documents',
  WHATSAPP: 'hirepilot_whatsapp'
};

// Safe storage helpers
function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(stored) as T;
  } catch (err) {
    console.debug(`Failed to read ${key} from storage:`, err);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.debug(`Failed to write ${key} to storage:`, err);
  }
}

export const api = {
  // Chat
  async sendMessage(message: string, jobContext?: string): Promise<{ reply: string; quickReplies?: string[]; source?: string }> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, jobContext })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }

    // Local grounded knowledge base response engine
    const msg = message.toLowerCase().trim();
    if (msg.includes('explore open') || msg.includes('positions') || msg.includes('vacancies')) {
      const jobs = getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
      const jobList = jobs.map((j, i) => `${i + 1}. **${j.title}** (${j.department} · ${j.level})\n   *Key Skills:* ${j.requiredSkills.slice(0, 4).join(', ')}`).join('\n\n');
      return {
        reply: `Here are our demonstration vacancies at Nexora Technologies:\n\n${jobList}\n\n*All positions are fictional demo roles.* Which role would you like to inspect?`,
        quickReplies: ['Junior Python Developer', 'AI/ML Intern', 'AI Automation Engineer', 'Frontend Developer', 'Full-Stack Developer'],
        source: 'knowledge-base-client'
      };
    }

    if (msg.includes('real') || msg.includes('fictional')) {
      return {
        reply: "Nexora Technologies and all listed vacancies are fictional demonstration roles created to demonstrate the HirePilot AI platform. No real hiring takes place.",
        quickReplies: ['Explore Open Positions', 'Start an Application'],
        source: 'knowledge-base-client'
      };
    }

    if (msg.includes('prep') || msg.includes('interview')) {
      return {
        reply: "Which position would you like to practice interview questions for?\n\n1. Junior Python Developer\n2. AI/ML Intern\n3. AI Automation Engineer\n4. Frontend Developer\n5. Full-Stack Developer",
        quickReplies: ['Prep: Junior Python', 'Prep: AI/ML Intern', 'Prep: Automation', 'Prep: Frontend', 'Prep: Full-Stack'],
        source: 'knowledge-base-client'
      };
    }

    return {
      reply: "Hello! Welcome to Nexora Technologies. I'm HirePilot AI, your recruitment assistant. I can help you explore opportunities, understand job requirements, prepare for interviews, and walk you through a demo application. What would you like to do today?",
      quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs'],
      source: 'knowledge-base-client'
    };
  },

  // AI Screening
  async screenCandidate(params: { candidateSkills: string[]; candidateExperience: string; candidateProjects: string; jobTitle: string }): Promise<ScreeningEvaluation & { matchScore: number }> {
    try {
      const res = await fetch('/api/ai-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Fallback below
    }

    const jobs = getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const targetJob = jobs.find(j => j.title.toLowerCase() === params.jobTitle.toLowerCase()) || jobs[0];
    const candidateSkillsLower = params.candidateSkills.map(s => s.toLowerCase());

    const matchingSkills: string[] = [];
    const skillsNotDemonstrated: string[] = [];

    targetJob.requiredSkills.forEach(req => {
      const match = candidateSkillsLower.some(cs => req.toLowerCase().includes(cs) || cs.includes(req.toLowerCase()));
      if (match) matchingSkills.push(req);
      else skillsNotDemonstrated.push(req);
    });

    const score = Math.min(Math.round((matchingSkills.length / Math.max(targetJob.requiredSkills.length, 1)) * 60) + 35, 98);

    return {
      matchingSkills,
      skillsNotDemonstrated,
      relevantProjectEvidence: [params.candidateProjects ? `Demonstrated hands-on: "${params.candidateProjects.slice(0, 100)}..."` : 'Relevant coursework and self-directed practice.'],
      suggestedFollowUpQuestions: targetJob.screeningQuestions.slice(0, 3),
      summaryExplanation: `Candidate demonstrates alignment with ${matchingSkills.length} of ${targetJob.requiredSkills.length} required competencies for ${targetJob.title}. Focus areas for development: ${skillsNotDemonstrated.slice(0, 3).join(', ') || 'None identified'}. This is an informational skills comparison, not an official hiring decision.`,
      matchRecommendation: score >= 85 ? 'High Alignment' : score >= 70 ? 'Moderate Alignment' : 'Exploratory Alignment',
      matchScore: score
    };
  },

  // Jobs
  async getJobs(): Promise<Job[]> {
    try {
      const res = await fetch('/api/jobs');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.JOBS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },

  async createJob(job: Partial<Job>): Promise<Job> {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: job.title || 'Untitled Vacancy',
      department: job.department || 'Engineering',
      level: job.level || 'Junior',
      workArrangement: job.workArrangement || 'Unconfirmed',
      description: job.description || '',
      responsibilities: job.responsibilities || [],
      requiredSkills: job.requiredSkills || [],
      preferredSkills: job.preferredSkills || [],
      idealCandidate: job.idealCandidate || '',
      screeningQuestions: job.screeningQuestions || [],
      interviewQuestions: job.interviewQuestions || [],
      status: job.status || 'published',
      salaryRange: job.salaryRange,
      deadline: job.deadline,
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const serverJob = await res.json();
        const current = getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
        setLocalItem(STORAGE_KEYS.JOBS, [serverJob, ...current]);
        return serverJob;
      }
    } catch {
      // Fallback
    }

    const current = getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    setLocalItem(STORAGE_KEYS.JOBS, [newJob, ...current]);
    return newJob;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const updated = await res.json();
        const current = getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
        setLocalItem(STORAGE_KEYS.JOBS, current.map(j => j.id === id ? updated : j));
        return updated;
      }
    } catch {
      // Fallback
    }

    const current = getLocalItem<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    const index = current.findIndex(j => j.id === id);
    const updated = index !== -1 ? { ...current[index], ...updates } : { ...INITIAL_JOBS[0], ...updates, id };
    if (index !== -1) current[index] = updated;
    setLocalItem(STORAGE_KEYS.JOBS, current);
    return updated;
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    try {
      const res = await fetch('/api/applications');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.APPLICATIONS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocalItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  async submitApplication(data: any): Promise<{ application: Application; candidate: Candidate }> {
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      education: data.education || 'Not specified',
      skills: Array.isArray(data.skills) ? data.skills : [data.skills],
      experience: data.experience || 'Entry-level background',
      projects: data.projects || 'Portfolio in review',
      portfolioUrl: data.portfolioUrl,
      preferredArrangement: data.preferredArrangement || 'Hybrid',
      availability: data.availability || 'Immediate',
      consentGiven: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newApp: Application = {
      id: `app-${Date.now().toString().slice(-4)}`,
      candidateId: newCandidate.id,
      jobId: 'job-1',
      candidateName: data.fullName,
      candidateEmail: data.email,
      jobTitle: data.jobTitle,
      skills: newCandidate.skills,
      experienceSummary: data.experience ? data.experience.slice(0, 120) : 'Application submitted through public portal.',
      stage: 'New',
      source: data.source || 'Website',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: ['Candidate submitted simulated demo application with consent.']
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const serverResult = await res.json();
        // Update local storage
        const currentApps = getLocalItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
        const currentCands = getLocalItem<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
        setLocalItem(STORAGE_KEYS.APPLICATIONS, [serverResult.application, ...currentApps]);
        setLocalItem(STORAGE_KEYS.CANDIDATES, [serverResult.candidate, ...currentCands]);
        return serverResult;
      }
    } catch {
      // Fallback
    }

    const currentApps = getLocalItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const currentCands = getLocalItem<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
    setLocalItem(STORAGE_KEYS.APPLICATIONS, [newApp, ...currentApps]);
    setLocalItem(STORAGE_KEYS.CANDIDATES, [newCandidate, ...currentCands]);
    return { application: newApp, candidate: newCandidate };
  },

  async updateApplicationStage(id: string, stage: ApplicationStage, note?: string): Promise<Application> {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, note })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const updated = await res.json();
        const current = getLocalItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
        setLocalItem(STORAGE_KEYS.APPLICATIONS, current.map(a => a.id === id ? updated : a));
        return updated;
      }
    } catch {
      // Fallback
    }

    const current = getLocalItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const index = current.findIndex(a => a.id === id);
    if (index !== -1) {
      current[index].stage = stage;
      if (note) {
        current[index].notes = current[index].notes || [];
        current[index].notes.unshift(`[${new Date().toLocaleDateString()}] ${note}`);
      }
      setLocalItem(STORAGE_KEYS.APPLICATIONS, current);
      return current[index];
    }
    throw new Error('Application not found');
  },

  // Candidates
  async getCandidates(): Promise<Candidate[]> {
    try {
      const res = await fetch('/api/candidates');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.CANDIDATES, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocalItem<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  },

  async deleteCandidate(id: string): Promise<void> {
    try {
      await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }

    const currentCands = getLocalItem<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
    const currentApps = getLocalItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    setLocalItem(STORAGE_KEYS.CANDIDATES, currentCands.filter(c => c.id !== id));
    setLocalItem(STORAGE_KEYS.APPLICATIONS, currentApps.filter(a => a.candidateId !== id));
  },

  // Conversations
  async getConversations(): Promise<ConversationSession[]> {
    try {
      const res = await fetch('/api/conversations');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.CONVERSATIONS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getLocalItem<ConversationSession[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },

  async saveConversation(session: Partial<ConversationSession>): Promise<ConversationSession> {
    const newConv: ConversationSession = {
      id: `conv-${Date.now()}`,
      channel: session.channel || 'Website',
      candidateName: session.candidateName,
      candidateEmail: session.candidateEmail,
      jobInterest: session.jobInterest,
      messages: session.messages || [],
      startedAt: new Date().toLocaleString(),
      lastMessageAt: new Date().toLocaleString(),
      completedApplication: session.completedApplication || false
    };

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const serverConv = await res.json();
        const current = getLocalItem<ConversationSession[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
        setLocalItem(STORAGE_KEYS.CONVERSATIONS, [serverConv, ...current]);
        return serverConv;
      }
    } catch {
      // Fallback
    }

    const current = getLocalItem<ConversationSession[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    setLocalItem(STORAGE_KEYS.CONVERSATIONS, [newConv, ...current]);
    return newConv;
  },

  // Knowledge Base
  async getKnowledgeBase(): Promise<{ documents: KnowledgeDocument[]; faqs: FAQItem[]; retrievalEnabled: boolean; geminiActive: boolean }> {
    try {
      const res = await fetch('/api/knowledge-base');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.DOCUMENTS, data.documents);
        setLocalItem(STORAGE_KEYS.FAQS, data.faqs);
        return data;
      }
    } catch {
      // Fallback
    }

    const docs = getLocalItem<KnowledgeDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_KNOWLEDGE_DOCS);
    const faqs = getLocalItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    return {
      documents: docs,
      faqs,
      retrievalEnabled: true,
      geminiActive: false
    };
  },

  async addFaq(faq: { question: string; answer: string; category: string }): Promise<FAQItem> {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: faq.question,
      answer: faq.answer,
      category: (faq.category as any) || 'General'
    };

    try {
      const res = await fetch('/api/knowledge-base/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const serverFaq = await res.json();
        const current = getLocalItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
        setLocalItem(STORAGE_KEYS.FAQS, [serverFaq, ...current]);
        return serverFaq;
      }
    } catch {
      // Fallback
    }

    const current = getLocalItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    setLocalItem(STORAGE_KEYS.FAQS, [newFaq, ...current]);
    return newFaq;
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      await fetch(`/api/knowledge-base/documents/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }

    const current = getLocalItem<KnowledgeDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_KNOWLEDGE_DOCS);
    setLocalItem(STORAGE_KEYS.DOCUMENTS, current.filter(d => d.id !== id));
  },

  // WhatsApp
  async getWhatsAppStatus(): Promise<WhatsAppConfig & { envConfigured: boolean; recentEvents: any[] }> {
    try {
      const res = await fetch('/api/whatsapp/status');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setLocalItem(STORAGE_KEYS.WHATSAPP, data);
        return data;
      }
    } catch {
      // Fallback
    }

    const cfg = getLocalItem<WhatsAppConfig>(STORAGE_KEYS.WHATSAPP, INITIAL_WHATSAPP_CONFIG);
    return {
      ...cfg,
      envConfigured: false,
      recentEvents: []
    };
  },

  async testWhatsAppConnection(params?: { accessToken?: string; phoneNumberId?: string }): Promise<{ connected: boolean; message: string; statusCode: string }> {
    try {
      const res = await fetch('/api/whatsapp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params || {})
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      connected: false,
      message: 'Not Connected: Meta Cloud API credentials (Access Token and Phone Number ID) are not configured. Configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in server environment variables to activate outbound messaging.',
      statusCode: 'CREDENTIALS_MISSING'
    };
  },

  // Reset Demo Data
  async resetDemoData(): Promise<void> {
    try {
      await fetch('/api/reset-demo-data', { method: 'POST' });
    } catch {
      // Fallback
    }

    setLocalItem(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    setLocalItem(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    setLocalItem(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
    setLocalItem(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    setLocalItem(STORAGE_KEYS.FAQS, INITIAL_FAQS);
    setLocalItem(STORAGE_KEYS.DOCUMENTS, INITIAL_KNOWLEDGE_DOCS);
    setLocalItem(STORAGE_KEYS.WHATSAPP, INITIAL_WHATSAPP_CONFIG);
  }
};
