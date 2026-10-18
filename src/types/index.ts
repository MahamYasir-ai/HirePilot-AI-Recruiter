export type JobLevel = 'Entry-level' | 'Internship' | 'Junior' | 'Mid-level' | 'Senior';
export type JobStatus = 'published' | 'draft' | 'archived';
export type ApplicationStage = 'New' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn';
export type ApplicationSource = 'Website' | 'WhatsApp' | 'Demo Chat';
export type WorkArrangement = 'Unconfirmed' | 'Remote' | 'Hybrid' | 'On-site';

export interface Job {
  id: string;
  title: string;
  department: string;
  level: JobLevel;
  workArrangement: WorkArrangement;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  idealCandidate: string;
  screeningQuestions: string[];
  interviewQuestions: string[];
  status: JobStatus;
  salaryRange?: string;
  deadline?: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  education: string;
  skills: string[];
  experience: string;
  projects: string;
  portfolioUrl?: string;
  preferredArrangement: WorkArrangement;
  availability: string;
  consentGiven: boolean;
  notes?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  skills: string[];
  experienceSummary: string;
  stage: ApplicationStage;
  source: ApplicationSource;
  appliedDate: string;
  notes: string[];
  screeningMatchScore?: number;
  matchHighlights?: string[];
  missingSkills?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  metadata?: {
    intent?: string;
    jobId?: string;
    collectedData?: Partial<Candidate>;
  };
}

export interface ConversationSession {
  id: string;
  channel: 'Website' | 'WhatsApp';
  candidateName?: string;
  candidateEmail?: string;
  jobInterest?: string;
  messages: ChatMessage[];
  startedAt: string;
  lastMessageAt: string;
  completedApplication?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Vacancies' | 'Application' | 'Interviews' | 'Privacy';
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'Ready' | 'Processing' | 'Indexed';
  updatedAt: string;
  contentSummary: string;
}

export interface WhatsAppConfig {
  connected: boolean;
  provider: string;
  phoneNumberId?: string;
  wabaId?: string;
  displayPhoneNumber?: string;
  webhookStatus: 'Active' | 'Not Configured' | 'Error';
  lastEventTimestamp?: string;
  verifyToken?: string;
}

export interface ScreeningEvaluation {
  matchingSkills: string[];
  skillsNotDemonstrated: string[];
  relevantProjectEvidence: string[];
  suggestedFollowUpQuestions: string[];
  summaryExplanation: string;
  matchRecommendation: 'High Alignment' | 'Moderate Alignment' | 'Exploratory Alignment';
}
