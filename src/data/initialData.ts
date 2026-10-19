import { Application, Candidate, ConversationSession, WhatsAppConfig } from '../types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    fullName: 'Elena Rostova',
    email: 'elena.rostova.demo@example.com',
    education: 'B.S. in Computer Science, University of Technology (2025)',
    skills: ['Python', 'Git', 'GitHub', 'REST APIs', 'FastAPI', 'JSON Processing', 'PostgreSQL Basics'],
    experience: 'Completed university capstone project building a data extraction service and 6-month open source contributor.',
    projects: 'Built an automated financial news parser using Python requests and BeautifulSoup with automated CSV export. Maintained active GitHub repository with 150+ commits.',
    portfolioUrl: 'https://github.com/demo-elena-py',
    preferredArrangement: 'Hybrid',
    availability: 'Immediate (2 weeks notice)',
    consentGiven: true,
    notes: 'Strong fundamentals in Python exception handling and Git version control. Very clear communication in screening.',
    createdAt: '2026-03-22'
  },
  {
    id: 'cand-2',
    fullName: 'Marcus Chen',
    email: 'marcus.chen.demo@example.com',
    education: 'Undergraduate Senior, Data Science & Statistics (Graduating Spring 2026)',
    skills: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'Jupyter Notebook', 'Data Cleaning', 'Matplotlib'],
    experience: 'Academic research assistant on environmental telemetry data; cleaned 50k+ sensor logs and ran baseline regression models.',
    projects: 'Air quality prediction notebook using scikit-learn random forests; demonstrated 86% F1 score on sample test split with full confusion matrix documentation.',
    portfolioUrl: 'https://github.com/demo-marcus-ds',
    preferredArrangement: 'Remote',
    availability: 'Summer 2026 internship start',
    consentGiven: true,
    notes: 'Well-structured Jupyter notebooks. Needs further exposure to production model monitoring pipelines.',
    createdAt: '2026-03-24'
  },
  {
    id: 'cand-3',
    fullName: 'Amara Diallo',
    email: 'amara.diallo.demo@example.com',
    education: 'B.Eng. in Software Engineering (2024)',
    skills: ['Python', 'REST APIs', 'Webhooks', 'n8n', 'Zapier', 'JSON', 'AI Agents', 'OpenAI/Gemini APIs'],
    experience: '1 year as freelance automation specialist configuring multi-channel workflows for local businesses and integrating CRM webhooks.',
    projects: 'Constructed an end-to-end customer support triage bot connecting WhatsApp incoming webhooks with an n8n pipeline and internal ticketing API.',
    portfolioUrl: 'https://github.com/demo-amara-auto',
    preferredArrangement: 'Remote',
    availability: '1 month notice',
    consentGiven: true,
    notes: 'Practical grasp of API rate limits, backoff strategies, and agent tools. Demonstrated webhook debugging.',
    createdAt: '2026-03-25'
  },
  {
    id: 'cand-4',
    fullName: 'Sofia Morales',
    email: 'sofia.morales.demo@example.com',
    education: 'B.A. in Digital Design & Web Development (2025)',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS', 'Responsive Design', 'Git'],
    experience: 'Junior web intern at design agency; coded 8 responsive client landing pages adhering to WCAG 2.1 accessibility.',
    projects: 'E-commerce product catalog with accessible keyboard navigation, instant client-side filtering, and cart state in React 19.',
    portfolioUrl: 'https://github.com/demo-sofia-frontend',
    preferredArrangement: 'Hybrid',
    availability: 'Immediate',
    consentGiven: true,
    notes: 'Clean component architecture and strong eye for typographic scale and responsive mobile layouts.',
    createdAt: '2026-03-26'
  },
  {
    id: 'cand-5',
    fullName: 'Liam O’Connor',
    email: 'liam.oconnor.demo@example.com',
    education: 'Higher Diploma in Full-Stack Computing (2024)',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Git', 'Docker Basics'],
    experience: 'Developed and launched two full-stack web applications for local non-profit sports leagues.',
    projects: 'Tournament management system with Express backend, JWT auth, PostgreSQL relational schema, and responsive React frontend.',
    portfolioUrl: 'https://github.com/demo-liam-fullstack',
    preferredArrangement: 'On-site',
    availability: '3 weeks notice',
    consentGiven: true,
    notes: 'Solid end-to-end understanding of request lifecycles, database normalization, and state management.',
    createdAt: '2026-03-27'
  },
  {
    id: 'cand-6',
    fullName: 'Priya Sharma',
    email: 'priya.sharma.demo@example.com',
    education: 'B.Tech in Information Technology (2025)',
    skills: ['Python', 'SQL', 'Git', 'pandas', 'FastAPI'],
    experience: 'Student developer in university robotics club handling Python telemetry logging.',
    projects: 'Sensor data logger storing IoT readings into SQLite with basic FastAPI query endpoints.',
    portfolioUrl: 'https://github.com/demo-priya-code',
    preferredArrangement: 'Hybrid',
    availability: 'Immediate',
    consentGiven: true,
    notes: 'Great Python fundamentals; submitted application through the WhatsApp assistant flow.',
    createdAt: '2026-03-28'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-101',
    candidateId: 'cand-1',
    jobId: 'job-1',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova.demo@example.com',
    jobTitle: 'Junior Python Developer',
    skills: ['Python', 'Git', 'GitHub', 'REST APIs', 'FastAPI', 'JSON Processing'],
    experienceSummary: 'Recent graduate with data extraction project and active GitHub portfolio.',
    stage: 'Shortlisted',
    source: 'Website',
    appliedDate: '2026-03-22',
    notes: [
      'Resume reviewed on March 23. Python coursework and GitHub portfolio look solid.',
      'Passed initial AI screening with high alignment on required fundamentals.'
    ],
    screeningMatchScore: 92,
    matchHighlights: ['Strong Python fundamentals', 'Active GitHub presence', 'API data processing experience'],
    missingSkills: ['SQL basics (coursework only)', 'Unit testing framework exposure']
  },
  {
    id: 'app-102',
    candidateId: 'cand-2',
    jobId: 'job-2',
    candidateName: 'Marcus Chen',
    candidateEmail: 'marcus.chen.demo@example.com',
    jobTitle: 'AI/ML Intern',
    skills: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'Jupyter Notebook', 'Data Cleaning'],
    experienceSummary: 'Undergraduate research assistant with 50k sensor row cleaning and ML regression.',
    stage: 'Interview',
    source: 'Website',
    appliedDate: '2026-03-24',
    notes: [
      'Demonstrated solid grasp of training vs testing data splits.',
      'Scheduled for simulated technical discussion on random forest evaluation.'
    ],
    screeningMatchScore: 88,
    matchHighlights: ['Hands-on with scikit-learn & pandas', 'Practical experience with dataset cleaning'],
    missingSkills: ['Deep learning frameworks (not required for internship)', 'Model deployment']
  },
  {
    id: 'app-103',
    candidateId: 'cand-3',
    jobId: 'job-3',
    candidateName: 'Amara Diallo',
    candidateEmail: 'amara.diallo.demo@example.com',
    jobTitle: 'AI Automation Engineer',
    skills: ['Python', 'REST APIs', 'Webhooks', 'n8n', 'Zapier', 'JSON', 'AI Agents'],
    experienceSummary: '1 year freelance automation builder connecting WhatsApp webhooks and n8n.',
    stage: 'Under Review',
    source: 'Demo Chat',
    appliedDate: '2026-03-25',
    notes: [
      'Application initiated and pre-screened through HirePilot AI Chatbot.',
      'Strong fit for workflow debugging and webhook handling.'
    ],
    screeningMatchScore: 95,
    matchHighlights: ['Extensive hands-on n8n & webhook integration', 'Demonstrated AI assistant prototypes'],
    missingSkills: ['Formal software testing frameworks']
  },
  {
    id: 'app-104',
    candidateId: 'cand-4',
    jobId: 'job-4',
    candidateName: 'Sofia Morales',
    candidateEmail: 'sofia.morales.demo@example.com',
    jobTitle: 'Frontend Developer',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS', 'Responsive Design'],
    experienceSummary: 'Agency intern who delivered responsive WCAG-compliant client websites.',
    stage: 'Shortlisted',
    source: 'Website',
    appliedDate: '2026-03-26',
    notes: [
      'Clean component design and strong accessibility test scores on demo catalog.'
    ],
    screeningMatchScore: 90,
    matchHighlights: ['React state management', 'Responsive mobile-first coding', 'Accessibility awareness'],
    missingSkills: ['Automated Jest/Playwright testing']
  },
  {
    id: 'app-105',
    candidateId: 'cand-5',
    jobId: 'job-5',
    candidateName: 'Liam O’Connor',
    candidateEmail: 'liam.oconnor.demo@example.com',
    jobTitle: 'Full-Stack Developer',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs'],
    experienceSummary: 'Built complete tournament manager with Express, PostgreSQL, and React.',
    stage: 'New',
    source: 'Website',
    appliedDate: '2026-03-27',
    notes: [
      'Submitted via multi-step application form. Awaiting initial HR review.'
    ],
    screeningMatchScore: 89,
    matchHighlights: ['Full-stack data flow understanding', 'Relational database schema modeling'],
    missingSkills: ['Cloud CI/CD deployment pipelines']
  },
  {
    id: 'app-106',
    candidateId: 'cand-6',
    jobId: 'job-1',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma.demo@example.com',
    jobTitle: 'Junior Python Developer',
    skills: ['Python', 'SQL', 'Git', 'pandas', 'FastAPI'],
    experienceSummary: 'Robotics club telemetry logging and SQLite query scripts.',
    stage: 'New',
    source: 'WhatsApp',
    appliedDate: '2026-03-28',
    notes: [
      'Received through the WhatsApp recruitment assistant flow.'
    ],
    screeningMatchScore: 84,
    matchHighlights: ['Python fundamentals', 'FastAPI query handling'],
    missingSkills: ['Comprehensive unit testing']
  }
];

export const INITIAL_CONVERSATIONS: ConversationSession[] = [
  {
    id: 'conv-1',
    channel: 'Website',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova.demo@example.com',
    jobInterest: 'Junior Python Developer',
    startedAt: '2026-03-22 10:14:00',
    lastMessageAt: '2026-03-22 10:28:15',
    completedApplication: true,
    messages: [
      {
        id: 'msg-1',
        sender: 'bot',
        text: "Hello! Welcome to Nexora Technologies. I'm HirePilot AI, your recruitment assistant. I can help you explore opportunities, understand job requirements, prepare for interviews, and walk you through a demo application. What would you like to do today?",
        timestamp: '10:14 AM',
        quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs']
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Check My Job Match',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg-3',
        sender: 'bot',
        text: 'Wonderful! Which role at Nexora Technologies are you interested in comparing with your background? (e.g., Junior Python Developer, AI/ML Intern, AI Automation Engineer, Frontend Developer, Full-Stack Developer)',
        timestamp: '10:15 AM',
        quickReplies: ['Junior Python Developer', 'AI/ML Intern', 'AI Automation Engineer', 'Frontend Developer', 'Full-Stack Developer']
      },
      {
        id: 'msg-4',
        sender: 'user',
        text: 'Junior Python Developer. I know Python loops, functions, exception handling, Git, and I have built an automated data scraper.',
        timestamp: '10:17 AM'
      },
      {
        id: 'msg-5',
        sender: 'bot',
        text: 'Your Python projects, data extraction experience, and Git usage appear relevant to the Junior Python Developer role. Demonstrating API integration and SQL basics could further strengthen your profile. Please note this is an informational skills comparison, not an official hiring decision.\n\nWould you like to start a simulated application, or practice interview questions for this role?',
        timestamp: '10:18 AM',
        quickReplies: ['Start an Application', 'Interview Preparation', 'Explore Other Roles']
      }
    ]
  },
  {
    id: 'conv-2',
    channel: 'WhatsApp',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma.demo@example.com',
    jobInterest: 'Junior Python Developer',
    startedAt: '2026-03-28 14:02:10',
    lastMessageAt: '2026-03-28 14:15:30',
    completedApplication: true,
    messages: [
      {
        id: 'w-msg-1',
        sender: 'bot',
        text: "👋 Welcome to Nexora Technologies! I'm HirePilot AI, your WhatsApp recruitment assistant. I'm here to share vacancies, answer FAQs, and guide you through demo applications.\n\nReply with a number:\n1️⃣ Explore Open Positions\n2️⃣ Check Job Match\n3️⃣ Start Demo Application\n4️⃣ Interview Practice",
        timestamp: '2:02 PM'
      },
      {
        id: 'w-msg-2',
        sender: 'user',
        text: '1',
        timestamp: '2:03 PM'
      },
      {
        id: 'w-msg-3',
        sender: 'bot',
        text: "Here are our current demonstration vacancies:\n1. Junior Python Developer (Software Engineering)\n2. AI/ML Intern (AI and Data)\n3. AI Automation Engineer (AI Solutions)\n4. Frontend Developer (Web Engineering)\n5. Full-Stack Developer (Product Engineering)\n\nReply with a role number to see requirements or start applying!",
        timestamp: '2:03 PM'
      }
    ]
  },
  {
    id: 'conv-3',
    channel: 'Website',
    candidateName: 'Sofia Morales',
    candidateEmail: 'sofia.morales.demo@example.com',
    jobInterest: 'Frontend Developer',
    startedAt: '2026-03-26 11:20:00',
    lastMessageAt: '2026-03-26 11:35:10',
    completedApplication: true,
    messages: [
      {
        id: 'f-msg-1',
        sender: 'bot',
        text: "Hello! Welcome to Nexora Technologies. I'm HirePilot AI, your recruitment assistant. I can help you explore opportunities, understand job requirements, prepare for interviews, and walk you through a demo application. What would you like to do today?",
        timestamp: '11:20 AM',
        quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs']
      },
      {
        id: 'f-msg-2',
        sender: 'user',
        text: 'Interview Preparation',
        timestamp: '11:21 AM'
      },
      {
        id: 'f-msg-3',
        sender: 'bot',
        text: "Which position would you like to practice interview questions for?\n1. Junior Python Developer\n2. AI/ML Intern\n3. AI Automation Engineer\n4. Frontend Developer\n5. Full-Stack Developer",
        timestamp: '11:21 AM',
        quickReplies: ['Prep: Frontend', 'Prep: Junior Python', 'Prep: AI/ML Intern']
      },
      {
        id: 'f-msg-4',
        sender: 'user',
        text: 'Prep: Frontend',
        timestamp: '11:22 AM'
      },
      {
        id: 'f-msg-5',
        sender: 'bot',
        text: "Here are 5 practice interview questions for Frontend Developer:\n1. Explain the distinct roles of HTML, CSS, and JavaScript in modern web development.\n2. How do you approach building a responsive interface that looks great across mobile and desktop?\n3. How does a frontend component make asynchronous API calls and handle loading states?\n4. Explain how React components and state updates trigger re-renders.\n5. How do you test and ensure an interface is accessible (WCAG AA)?\n\nWould you like to start a simulated application for this position?",
        timestamp: '11:23 AM',
        quickReplies: ['Start an Application', 'Explain React Components']
      }
    ]
  },
  {
    id: 'conv-4',
    channel: 'Website',
    candidateName: 'Marcus Chen',
    candidateEmail: 'marcus.chen.demo@example.com',
    jobInterest: 'AI/ML Intern',
    startedAt: '2026-03-24 16:40:00',
    lastMessageAt: '2026-03-24 16:55:00',
    completedApplication: true,
    messages: [
      {
        id: 'm-msg-1',
        sender: 'bot',
        text: "Hello! Welcome to Nexora Technologies. I'm HirePilot AI, your recruitment assistant. What would you like to do today?",
        timestamp: '4:40 PM',
        quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Start an Application']
      },
      {
        id: 'm-msg-2',
        sender: 'user',
        text: 'Check My Job Match for AI/ML Intern. I know Python, pandas, scikit-learn, and cleaned sensor telemetry data.',
        timestamp: '4:42 PM'
      },
      {
        id: 'm-msg-3',
        sender: 'bot',
        text: "Your dataset exploration experience with pandas and scikit-learn appears strongly aligned with the AI/ML Intern role. Demonstrating model evaluation metrics (precision, recall, ROC-AUC) will further reinforce your profile. Would you like to practice technical interview questions or submit an application?",
        timestamp: '4:43 PM',
        quickReplies: ['Start an Application', 'Interview Preparation']
      }
    ]
  }
];

export const INITIAL_WHATSAPP_CONFIG: WhatsAppConfig = {
  connected: false,
  provider: 'Meta WhatsApp Business Platform (Cloud API)',
  displayPhoneNumber: '+1 (555) 019-2831 (Pending verification)',
  webhookStatus: 'Not Configured',
  lastEventTimestamp: undefined,
  verifyToken: 'hirepilot_meta_webhook_secret_2026'
};
