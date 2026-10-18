import { Application, Candidate, ConversationSession, FAQItem, Job, KnowledgeDocument, WhatsAppConfig, ScreeningEvaluation } from '../types';

export const api = {
  // Chat
  async sendMessage(message: string, jobContext?: string): Promise<{ reply: string; quickReplies?: string[]; source?: string }> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, jobContext })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      return {
        reply: "I'm HirePilot AI for Nexora Technologies. I can help you explore our 5 demonstration vacancies, check your skill match, or prepare for interviews. What would you like to explore?",
        quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Interview Preparation', 'Recruitment FAQs'],
        source: 'local-resilience'
      };
    }
  },

  // AI Screening
  async screenCandidate(params: { candidateSkills: string[]; candidateExperience: string; candidateProjects: string; jobTitle: string }): Promise<ScreeningEvaluation & { matchScore: number }> {
    try {
      const res = await fetch('/api/ai-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Screening API error:', err);
      return {
        matchingSkills: params.candidateSkills.slice(0, 3),
        skillsNotDemonstrated: ['Production systems exposure'],
        relevantProjectEvidence: [params.candidateProjects || 'Coursework projects'],
        suggestedFollowUpQuestions: ['Walk through your code structure and testing approach.'],
        summaryExplanation: 'Candidate displays foundational alignment with role requirements.',
        matchRecommendation: 'Moderate Alignment',
        matchScore: 82
      };
    }
  },

  // Jobs
  async getJobs(): Promise<Job[]> {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to load jobs');
    return await res.json();
  },

  async createJob(job: Partial<Job>): Promise<Job> {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    if (!res.ok) throw new Error('Failed to create job');
    return await res.json();
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update job');
    return await res.json();
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    const res = await fetch('/api/applications');
    if (!res.ok) throw new Error('Failed to load applications');
    return await res.json();
  },

  async submitApplication(data: any): Promise<{ application: Application; candidate: Candidate }> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit application');
    }
    return await res.json();
  },

  async updateApplicationStage(id: string, stage: string, note?: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, note })
    });
    if (!res.ok) throw new Error('Failed to update application');
    return await res.json();
  },

  // Candidates
  async getCandidates(): Promise<Candidate[]> {
    const res = await fetch('/api/candidates');
    if (!res.ok) throw new Error('Failed to load candidates');
    return await res.json();
  },

  async deleteCandidate(id: string): Promise<void> {
    const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete candidate');
  },

  // Conversations
  async getConversations(): Promise<ConversationSession[]> {
    const res = await fetch('/api/conversations');
    if (!res.ok) throw new Error('Failed to load conversations');
    return await res.json();
  },

  async saveConversation(session: Partial<ConversationSession>): Promise<ConversationSession> {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    if (!res.ok) throw new Error('Failed to save conversation');
    return await res.json();
  },

  // Knowledge Base
  async getKnowledgeBase(): Promise<{ documents: KnowledgeDocument[]; faqs: FAQItem[]; retrievalEnabled: boolean; geminiActive: boolean }> {
    const res = await fetch('/api/knowledge-base');
    if (!res.ok) throw new Error('Failed to load knowledge base');
    return await res.json();
  },

  async addFaq(faq: { question: string; answer: string; category: string }): Promise<FAQItem> {
    const res = await fetch('/api/knowledge-base/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq)
    });
    if (!res.ok) throw new Error('Failed to add FAQ');
    return await res.json();
  },

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`/api/knowledge-base/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete document');
  },

  // WhatsApp
  async getWhatsAppStatus(): Promise<WhatsAppConfig & { envConfigured: boolean; recentEvents: any[] }> {
    const res = await fetch('/api/whatsapp/status');
    if (!res.ok) throw new Error('Failed to load WhatsApp status');
    return await res.json();
  },

  async testWhatsAppConnection(params?: { accessToken?: string; phoneNumberId?: string }): Promise<{ connected: boolean; message: string; statusCode: string }> {
    const res = await fetch('/api/whatsapp/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });
    return await res.json();
  },

  // Reset Demo Data
  async resetDemoData(): Promise<void> {
    const res = await fetch('/api/reset-demo-data', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
  }
};
