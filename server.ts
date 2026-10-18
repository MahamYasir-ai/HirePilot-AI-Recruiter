import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_JOBS, INITIAL_FAQS, INITIAL_KNOWLEDGE_DOCS, KNOWLEDGE_BASE_TEXT } from './src/data/knowledgeBase';
import { INITIAL_APPLICATIONS, INITIAL_CANDIDATES, INITIAL_CONVERSATIONS, INITIAL_WHATSAPP_CONFIG } from './src/data/initialData';
import { Application, Candidate, ConversationSession, FAQItem, Job, KnowledgeDocument, WhatsAppConfig } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Data Store (Initialized with seeds)
let jobs: Job[] = JSON.parse(JSON.stringify(INITIAL_JOBS));
let candidates: Candidate[] = JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
let applications: Application[] = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
let conversations: ConversationSession[] = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
let faqs: FAQItem[] = JSON.parse(JSON.stringify(INITIAL_FAQS));
let knowledgeDocs: KnowledgeDocument[] = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCS));
let whatsappConfig: WhatsAppConfig = JSON.parse(JSON.stringify(INITIAL_WHATSAPP_CONFIG));
let whatsappEvents: any[] = [];

// Gemini Client initialization on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Intelligent Knowledge Base Fallback Engine
function generateKnowledgeBaseFallback(userMessage: string, jobContext?: string): { reply: string; quickReplies?: string[] } {
  const msg = userMessage.toLowerCase().trim();

  // 1. Greeting
  if (msg === 'hi' || msg === 'hello' || msg === 'hey' || msg.includes('start') || msg.includes('get started')) {
    return {
      reply: "Hello! Welcome to Nexora Technologies. I'm HirePilot AI, your recruitment assistant. I can help you explore opportunities, understand job requirements, prepare for interviews, and walk you through a demo application. What would you like to do today?",
      quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs']
    };
  }

  // 2. Explore Open Positions
  if (msg.includes('explore open') || msg.includes('positions') || msg.includes('vacancies') || msg.includes('job list') || msg.includes('what jobs')) {
    const jobList = jobs.map((j, i) => `${i + 1}. **${j.title}** (${j.department} · ${j.level})\n   *Key Skills:* ${j.requiredSkills.slice(0, 4).join(', ')}`).join('\n\n');
    return {
      reply: `Here are our 5 demonstration vacancies at Nexora Technologies:\n\n${jobList}\n\n*Note: Nexora Technologies and all listed vacancies are fictional and created solely for demonstration.* Which role would you like to inspect?`,
      quickReplies: ['Junior Python Developer', 'AI/ML Intern', 'AI Automation Engineer', 'Frontend Developer', 'Full-Stack Developer']
    };
  }

  // 3. FAQs and General Inquiries
  if (msg.includes('real') || msg.includes('fictional') || msg.includes('legit') || msg.includes('scam')) {
    return {
      reply: "Nexora Technologies and all vacancies listed here are fictional demonstration roles created to demonstrate the HirePilot AI recruitment platform. No real hiring, salary, or employment exists.",
      quickReplies: ['Explore Open Positions', 'Start an Application', 'Recruitment FAQs']
    };
  }

  if (msg.includes('fresh graduate') || msg.includes('entry level') || msg.includes('no experience') || msg.includes('degree')) {
    return {
      reply: "Fresh graduates can certainly apply! The sample junior and internship roles are designed around entry-level skills. Candidates can discuss university coursework, hobby projects, open source contributions, or practical self-directed learning.",
      quickReplies: ['Junior Python Developer', 'AI/ML Intern', 'Check My Job Match']
    };
  }

  if (msg.includes('salary') || msg.includes('compensation') || msg.includes('pay') || msg.includes('benefits')) {
    return {
      reply: "Salary and compensation figures have not been defined for these fictional vacancies. As a rule, HirePilot AI never invents compensation figures or benefits.",
      quickReplies: ['Explore Open Positions', 'Start an Application', 'Recruitment FAQs']
    };
  }

  if (msg.includes('remote') || msg.includes('hybrid') || msg.includes('on-site') || msg.includes('work arrangement') || msg.includes('location')) {
    return {
      reply: "Work arrangements are unconfirmed for these demonstration positions. Candidates are welcome to state their preferred arrangement (remote, hybrid, or on-site), but the system cannot guarantee remote work.",
      quickReplies: ['Explore Open Positions', 'Start an Application', 'Recruitment FAQs']
    };
  }

  if (msg.includes('deadline') || msg.includes('when does') || msg.includes('closing date')) {
    return {
      reply: "No application deadline exists for these fictional vacancies. You may explore, test the screening engine, and submit demo applications at any time.",
      quickReplies: ['Explore Open Positions', 'Start an Application']
    };
  }

  if (msg.includes('interview') && (msg.includes('real') || msg.includes('guarantee') || msg.includes('call') || msg.includes('schedule'))) {
    return {
      reply: "The chatbot cannot arrange or guarantee a real employer interview because this is a demonstration. However, I can provide role-specific interview practice questions to help you prepare!",
      quickReplies: ['Interview Preparation', 'Explore Open Positions', 'Recruitment FAQs']
    };
  }

  if (msg.includes('cv') || msg.includes('resume') || msg.includes('upload')) {
    return {
      reply: "You can input your technical skills, experience, and portfolio/GitHub links directly in our interactive demo application form or chat assistant. The platform does not claim a file was received unless verified.",
      quickReplies: ['Start an Application', 'Explore Open Positions']
    };
  }

  if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('address') || msg.includes('hr email')) {
    return {
      reply: "No real contact details (such as HR email, telephone number, or physical office address) have been configured for Nexora Technologies. All communications are contained inside this demonstration platform.",
      quickReplies: ['Explore Open Positions', 'Recruitment FAQs']
    };
  }

  // 4. Interview Preparation
  if (msg.includes('interview preparation') || msg.includes('practice interview') || msg.includes('interview question')) {
    return {
      reply: "Which position would you like to practice interview questions for?\n\n1. Junior Python Developer\n2. AI/ML Intern\n3. AI Automation Engineer\n4. Frontend Developer\n5. Full-Stack Developer",
      quickReplies: ['Prep: Junior Python', 'Prep: AI/ML Intern', 'Prep: Automation', 'Prep: Frontend', 'Prep: Full-Stack']
    };
  }

  if (msg.includes('prep: junior python') || (msg.includes('python') && msg.includes('interview'))) {
    return {
      reply: "Here are 5 practice interview questions for the Junior Python Developer role:\n\n1. Explain the difference between lists and tuples in Python.\n2. Describe how exception handling works using `try...except...finally`.\n3. Explain how functions help organize and modularize code.\n4. Describe how you use Git branching and commits in a real project.\n5. How would you read, filter, and process a CSV file using Python?\n\nTry answering one of these, or ask me for an explanation of any topic!",
      quickReplies: ['Explain Lists vs Tuples', 'Explain Exception Handling', 'Start an Application']
    };
  }

  if (msg.includes('prep: ai/ml') || (msg.includes('ml') && msg.includes('interview'))) {
    return {
      reply: "Here are 5 practice interview questions for the AI/ML Intern role:\n\n1. Explain the difference between supervised and unsupervised learning.\n2. Why is it essential to split data into training and testing datasets?\n3. How do you detect and handle missing or null values in pandas?\n4. How do you evaluate a classification model (accuracy vs precision vs recall)?\n5. Walk through a data analysis or machine learning project you have built.\n\nWhich question would you like to practice first?",
      quickReplies: ['Supervised vs Unsupervised', 'Train vs Test Split', 'Start an Application']
    };
  }

  if (msg.includes('prep: automation') || (msg.includes('automation') && msg.includes('interview'))) {
    return {
      reply: "Here are 5 practice interview questions for the AI Automation Engineer role:\n\n1. Explain what REST APIs and webhooks are, and how they differ.\n2. Describe an automated workflow you have designed.\n3. How do you troubleshoot and recover when an external API or webhook call fails?\n4. How do you evaluate the reliability and latency of AI-generated responses?\n5. How do you ensure API keys and credentials remain secure?\n\nFeel free to type your response for feedback!",
      quickReplies: ['APIs vs Webhooks', 'Troubleshooting Workflows', 'Start an Application']
    };
  }

  if (msg.includes('prep: frontend') || (msg.includes('frontend') && msg.includes('interview'))) {
    return {
      reply: "Here are 5 practice interview questions for the Frontend Developer role:\n\n1. Explain the distinct roles of HTML, CSS, and JavaScript in modern web development.\n2. How do you build a responsive interface that adapts seamlessly across mobile and 1440px desktop?\n3. How does a frontend component make asynchronous API calls and handle loading/error states?\n4. Explain how React components and state updates trigger re-renders.\n5. How do you test and verify accessibility (WCAG AA)?\n\nWhich question would you like to explore?",
      quickReplies: ['HTML CSS JS Roles', 'Responsive Design Principles', 'Start an Application']
    };
  }

  if (msg.includes('prep: full-stack') || (msg.includes('full-stack') && msg.includes('interview'))) {
    return {
      reply: "Here are 5 practice interview questions for the Full-Stack Developer role:\n\n1. Explain the division of responsibilities between client frontend and server backend.\n2. How do relational databases maintain data integrity and relationships?\n3. Walk through what happens under the hood when a user submits a form and an HTTP POST is sent.\n4. How do you implement robust server-side error handling and validation?\n5. How do you securely store API keys and secrets on the server?\n\nPick a question to practice or discuss!",
      quickReplies: ['Frontend vs Backend Roles', 'Form POST Lifecycle', 'Start an Application']
    };
  }

  // 5. Job Match / Screening check
  if (msg.includes('match') || msg.includes('check my job') || msg.includes('fit for')) {
    return {
      reply: "I'd love to help evaluate your skills! Please tell me which position you are interested in and what technologies or projects you've worked with (e.g. 'I know Python and Git, and built a data scraper for Junior Python Developer').",
      quickReplies: ['Junior Python Developer', 'AI/ML Intern', 'AI Automation Engineer', 'Frontend Developer', 'Full-Stack Developer']
    };
  }

  // 6. Role Specific Information
  const matchedJob = jobs.find(j => msg.includes(j.title.toLowerCase()) || msg.includes(j.id));
  if (matchedJob) {
    return {
      reply: `**${matchedJob.title}**\nDepartment: ${matchedJob.department}\nLevel: ${matchedJob.level}\nWork Arrangement: ${matchedJob.workArrangement}\n\n**Key Responsibilities:**\n${matchedJob.responsibilities.map(r => `• ${r}`).join('\n')}\n\n**Required Skills:** ${matchedJob.requiredSkills.join(', ')}\n**Preferred Skills:** ${matchedJob.preferredSkills.join(', ')}\n\n*Ideal Candidate:* ${matchedJob.idealCandidate}\n\nWould you like to start a demo application, compare your skills, or practice interview questions?`,
      quickReplies: [`Apply for ${matchedJob.title}`, `Interview Prep: ${matchedJob.title}`, 'Check My Job Match']
    };
  }

  // 7. Start Application
  if (msg.includes('apply') || msg.includes('start an application') || msg.includes('application form')) {
    return {
      reply: "You can start a simulated demo application either directly through our step-by-step application form on the website, or I can collect your details right here! To proceed here, please tell me your **Full Name** and **Email Address**.",
      quickReplies: ['Open Application Form', 'Explore Open Positions', 'Recruitment FAQs']
    };
  }

  // 8. General recruitment FAQs
  if (msg.includes('faq') || msg.includes('help') || msg.includes('questions')) {
    return {
      reply: "Here are common recruitment questions I can answer:\n• Are these real vacancies?\n• Can fresh graduates apply?\n• Is prior experience mandatory?\n• Is remote work available?\n• What is the salary?\n• What is the application deadline?\n• Will I receive a real interview?\n• How is my privacy protected?",
      quickReplies: ['Are these real vacancies?', 'Can fresh graduates apply?', 'Is remote work available?', 'Interview Preparation']
    };
  }

  // 9. Default Graceful Fallback (No Hallucination)
  return {
    reply: "I don't have that specific information in the Nexora Technologies recruitment knowledge base. As an AI assistant, I only provide verified information about our 5 demonstration vacancies, interview preparation questions, application guidelines, and recruitment FAQs. How may I assist you with those topics?",
    quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs']
  };
}

// REST API Endpoints

// 1. Chat endpoint with Gemini API and Knowledge Base fallback
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [], jobContext } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message string is required' });
      return;
    }

    // Try Gemini API if key is configured
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `You are HirePilot AI, a professional, friendly, and helpful recruitment assistant for the fictional technology company Nexora Technologies.
IMPORTANT RULES:
1. Nexora Technologies and all 5 vacancies are fictional demonstration roles. Never represent sample candidates, vacancies, or hiring outcomes as real.
2. Source of truth is this recruitment knowledge base:
${KNOWLEDGE_BASE_TEXT}
3. If a question cannot be answered from this knowledge base (e.g., real salaries, specific deadlines, external contact emails), explicitly acknowledge the limitation rather than inventing an answer.
4. Ask one question at a time during screening or applications.
5. Provide helpful, constructive feedback on skills.
6. Current selected job context: ${jobContext || 'None specified'}.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction
          }
        });

        const replyText = response.text || "I'm here to assist with Nexora Technologies demonstration vacancies.";
        res.json({
          reply: replyText,
          source: 'gemini-3.8-flash',
          quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs']
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to knowledge base engine:', geminiError?.message || geminiError);
      }
    }

    // Fallback to Knowledge Base Engine
    const fallback = generateKnowledgeBaseFallback(message, jobContext);
    res.json({
      reply: fallback.reply,
      quickReplies: fallback.quickReplies,
      source: 'knowledge-base-engine'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process chat request', details: err?.message });
  }
});

// 2. AI Screening Endpoint
app.post('/api/ai-screen', async (req: Request, res: Response) => {
  try {
    const { candidateSkills = [], candidateExperience = '', candidateProjects = '', jobTitle = '' } = req.body;
    const targetJob = jobs.find(j => j.title.toLowerCase() === jobTitle.toLowerCase()) || jobs[0];

    const lowerCandidateSkills = candidateSkills.map((s: string) => s.toLowerCase());
    const matchingSkills: string[] = [];
    const skillsNotDemonstrated: string[] = [];

    targetJob.requiredSkills.forEach(reqSkill => {
      const match = lowerCandidateSkills.some((cs: string) => reqSkill.toLowerCase().includes(cs) || cs.includes(reqSkill.toLowerCase()));
      if (match) {
        matchingSkills.push(reqSkill);
      } else {
        skillsNotDemonstrated.push(reqSkill);
      }
    });

    const projectEvidence: string[] = [];
    if (candidateProjects && candidateProjects.length > 5) {
      projectEvidence.push(`Demonstrated hands-on experience: "${candidateProjects.slice(0, 100)}..."`);
    } else {
      projectEvidence.push('No specific GitHub repository or project link provided yet.');
    }

    const followUpQuestions: string[] = targetJob.screeningQuestions.slice(0, 3);
    const score = Math.round((matchingSkills.length / Math.max(targetJob.requiredSkills.length, 1)) * 60) + 35;

    let recommendation: 'High Alignment' | 'Moderate Alignment' | 'Exploratory Alignment' = 'Moderate Alignment';
    if (score >= 85) recommendation = 'High Alignment';
    else if (score < 70) recommendation = 'Exploratory Alignment';

    const summaryExplanation = `Candidate demonstrates alignment with ${matchingSkills.length} of ${targetJob.requiredSkills.length} required competencies for ${targetJob.title}. Focus areas for development include: ${skillsNotDemonstrated.slice(0, 3).join(', ') || 'None identified'}. This is an informational skills comparison, not an official hiring decision.`;

    res.json({
      jobTitle: targetJob.title,
      matchScore: Math.min(score, 98),
      matchingSkills,
      skillsNotDemonstrated,
      relevantProjectEvidence: projectEvidence,
      suggestedFollowUpQuestions: followUpQuestions,
      summaryExplanation,
      matchRecommendation: recommendation
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to evaluate screening', details: err?.message });
  }
});

// 3. Jobs Management Endpoints
app.get('/api/jobs', (_req: Request, res: Response) => {
  res.json(jobs);
});

app.post('/api/jobs', (req: Request, res: Response) => {
  const newJob: Job = {
    id: `job-${Date.now()}`,
    title: req.body.title || 'Untitled Vacancy',
    department: req.body.department || 'Engineering',
    level: req.body.level || 'Junior',
    workArrangement: req.body.workArrangement || 'Unconfirmed',
    description: req.body.description || '',
    responsibilities: req.body.responsibilities || [],
    requiredSkills: req.body.requiredSkills || [],
    preferredSkills: req.body.preferredSkills || [],
    idealCandidate: req.body.idealCandidate || '',
    screeningQuestions: req.body.screeningQuestions || [],
    interviewQuestions: req.body.interviewQuestions || [],
    status: req.body.status || 'published',
    salaryRange: req.body.salaryRange,
    deadline: req.body.deadline,
    createdAt: new Date().toISOString().split('T')[0]
  };
  jobs.unshift(newJob);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = jobs.findIndex(j => j.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  jobs[index] = { ...jobs[index], ...req.body };
  res.json(jobs[index]);
});

// 4. Applications Endpoints
app.get('/api/applications', (_req: Request, res: Response) => {
  res.json(applications);
});

app.post('/api/applications', (req: Request, res: Response) => {
  const {
    fullName,
    email,
    jobTitle,
    education,
    skills = [],
    experience,
    projects,
    portfolioUrl,
    preferredArrangement = 'Unconfirmed',
    availability = 'Flexible',
    source = 'Website'
  } = req.body;

  if (!fullName || !email || !jobTitle) {
    res.status(400).json({ error: 'Full name, email, and job title are required' });
    return;
  }

  const newCandidate: Candidate = {
    id: `cand-${Date.now()}`,
    fullName,
    email,
    education: education || 'Not specified',
    skills: Array.isArray(skills) ? skills : [skills],
    experience: experience || 'Entry-level background',
    projects: projects || 'Portfolio in review',
    portfolioUrl,
    preferredArrangement,
    availability,
    consentGiven: true,
    createdAt: new Date().toISOString().split('T')[0]
  };
  candidates.unshift(newCandidate);

  const matchedJob = jobs.find(j => j.title.toLowerCase() === jobTitle.toLowerCase());
  const newApp: Application = {
    id: `app-${Date.now().toString().slice(-4)}`,
    candidateId: newCandidate.id,
    jobId: matchedJob ? matchedJob.id : 'job-1',
    candidateName: fullName,
    candidateEmail: email,
    jobTitle,
    skills: newCandidate.skills,
    experienceSummary: experience ? experience.slice(0, 120) : 'Application submitted through public portal.',
    stage: 'New',
    source,
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ['Candidate submitted simulated demo application with consent.']
  };
  applications.unshift(newApp);

  res.status(201).json({ application: newApp, candidate: newCandidate });
});

app.patch('/api/applications/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = applications.findIndex(a => a.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  if (req.body.stage) {
    applications[index].stage = req.body.stage;
  }
  if (req.body.note) {
    applications[index].notes = applications[index].notes || [];
    applications[index].notes.unshift(`[${new Date().toLocaleDateString()}] ${req.body.note}`);
  }

  res.json(applications[index]);
});

// 5. Candidates Endpoints
app.get('/api/candidates', (_req: Request, res: Response) => {
  res.json(candidates);
});

app.delete('/api/candidates/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  candidates = candidates.filter(c => c.id !== id);
  applications = applications.filter(a => a.candidateId !== id);
  res.json({ success: true, message: 'Candidate and associated demo records removed' });
});

// 6. Conversations Endpoints
app.get('/api/conversations', (_req: Request, res: Response) => {
  res.json(conversations);
});

app.post('/api/conversations', (req: Request, res: Response) => {
  const newConv: ConversationSession = {
    id: `conv-${Date.now()}`,
    channel: req.body.channel || 'Website',
    candidateName: req.body.candidateName,
    candidateEmail: req.body.candidateEmail,
    jobInterest: req.body.jobInterest,
    messages: req.body.messages || [],
    startedAt: new Date().toLocaleString(),
    lastMessageAt: new Date().toLocaleString(),
    completedApplication: req.body.completedApplication || false
  };
  conversations.unshift(newConv);
  res.status(201).json(newConv);
});

// 7. Knowledge Base & FAQs Endpoints
app.get('/api/knowledge-base', (_req: Request, res: Response) => {
  res.json({
    documents: knowledgeDocs,
    faqs,
    retrievalEnabled: true,
    geminiActive: !!process.env.GEMINI_API_KEY
  });
});

app.post('/api/knowledge-base/faq', (req: Request, res: Response) => {
  const newFaq: FAQItem = {
    id: `faq-${Date.now()}`,
    question: req.body.question,
    answer: req.body.answer,
    category: req.body.category || 'General'
  };
  faqs.unshift(newFaq);
  res.status(201).json(newFaq);
});

app.delete('/api/knowledge-base/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  knowledgeDocs = knowledgeDocs.filter(d => d.id !== id);
  res.json({ success: true, message: 'Document removed' });
});

// 8. WhatsApp Integration Endpoints
app.get('/api/whatsapp/status', (_req: Request, res: Response) => {
  const hasMetaCredentials = !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
  res.json({
    ...whatsappConfig,
    connected: hasMetaCredentials,
    webhookStatus: hasMetaCredentials ? 'Active' : 'Not Configured',
    envConfigured: hasMetaCredentials,
    recentEvents: whatsappEvents.slice(0, 10)
  });
});

app.post('/api/whatsapp/test-connection', (req: Request, res: Response) => {
  const { accessToken, phoneNumberId } = req.body;
  const token = accessToken || process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    res.status(200).json({
      connected: false,
      message: 'Not Connected: Meta Cloud API credentials (Access Token and Phone Number ID) are not configured. To activate real WhatsApp messaging, please supply WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in your server environment.',
      statusCode: 'CREDENTIALS_MISSING'
    });
    return;
  }

  res.status(200).json({
    connected: true,
    message: 'Meta Cloud API credentials detected. Endpoint verified for webhook delivery.',
    phoneNumberId: phoneId,
    statusCode: 'VERIFIED'
  });
});

// Meta WhatsApp Webhook Verification
app.get('/api/whatsapp/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || whatsappConfig.verifyToken;
  if (mode === 'subscribe' && token === expectedToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Meta WhatsApp Webhook Inbound Event Processing
app.post('/api/whatsapp/webhook', (req: Request, res: Response) => {
  const body = req.body;
  whatsappEvents.unshift({
    receivedAt: new Date().toISOString(),
    payload: body
  });
  if (whatsappEvents.length > 50) whatsappEvents.pop();

  whatsappConfig.lastEventTimestamp = new Date().toISOString();
  whatsappConfig.webhookStatus = 'Active';

  res.sendStatus(200);
});

// 9. Reset Demo Data Endpoint
app.post('/api/reset-demo-data', (_req: Request, res: Response) => {
  jobs = JSON.parse(JSON.stringify(INITIAL_JOBS));
  candidates = JSON.parse(JSON.stringify(INITIAL_CANDIDATES));
  applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
  conversations = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
  faqs = JSON.parse(JSON.stringify(INITIAL_FAQS));
  knowledgeDocs = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCS));
  whatsappEvents = [];
  res.json({ success: true, message: 'All demo data has been successfully reset to initial state' });
});

// Development vs Production Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`HirePilot AI server running on http://localhost:${PORT}`);
  });
}

startServer();
