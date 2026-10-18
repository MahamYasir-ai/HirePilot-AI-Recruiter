import React, { useState, useEffect } from 'react';
import { Smartphone, Send, CheckCheck, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Key, Link2, ExternalLink, AlertTriangle } from 'lucide-react';
import { Job, WhatsAppConfig } from '../../types';
import { api } from '../../utils/api';

interface Props {
  jobs: Job[];
  onOpenApplicationModal?: (job?: Job) => void;
}

export const WhatsAppSection: React.FC<Props> = ({ jobs, onOpenApplicationModal }) => {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string; statusCode: string } | null>(null);
  const [testing, setTesting] = useState(false);

  // Simulated WhatsApp Candidate Chat in Phone Container
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: "👋 Welcome to Nexora Technologies! I'm HirePilot AI, your WhatsApp recruitment assistant.\n\nI can help you explore demonstration vacancies, evaluate your job match, or prepare for interviews.\n\nReply with a number:\n1️⃣ Explore Open Positions\n2️⃣ Check Job Match\n3️⃣ Start Demo Application\n4️⃣ Interview Practice\n5️⃣ Recruitment FAQs",
      time: '12:00 PM'
    }
  ]);
  const [simInput, setSimInput] = useState('');

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const status = await api.getWhatsAppStatus();
      setConfig(status);
    } catch (err) {
      console.warn('Failed to load WhatsApp status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      const result = await api.testWhatsAppConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        connected: false,
        message: err?.message || 'Error executing connection test.',
        statusCode: 'REQUEST_FAILED'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSimSend = (overrideText?: string) => {
    const text = (overrideText || simInput).trim();
    if (!text) return;

    setSimInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgs = [...simMessages, { sender: 'user' as const, text, time: now }];
    setSimMessages(newMsgs);

    // Auto respond based on choice
    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (text === '1' || lower.includes('explore') || lower.includes('open position')) {
        botResponse = "Here are our 5 demonstration vacancies at Nexora Technologies:\n\n1. Junior Python Developer (Software Engineering)\n2. AI/ML Intern (AI and Data)\n3. AI Automation Engineer (AI Solutions)\n4. Frontend Developer (Web Engineering)\n5. Full-Stack Developer (Product Engineering)\n\nReply with the role title to see requirements, or reply 3 to start an application!";
      } else if (text === '2' || lower.includes('match') || lower.includes('fit')) {
        botResponse = "To evaluate your skills match, reply with your technical skills and target role (e.g. 'I know Python and Git for Junior Python Developer').";
      } else if (text === '3' || lower.includes('application') || lower.includes('apply')) {
        botResponse = "📝 *Simulated Application Initiation*\n\nPlease reply with your Full Name, Email, and Position of interest. (Example: 'Elena Rostova, elena@example.com, Junior Python Developer').\n\n_Note: This will be saved to the demonstration candidate database with your consent._";
      } else if (text === '4' || lower.includes('prep') || lower.includes('interview')) {
        botResponse = "💡 *Technical Interview Practice*\n\nWhich position would you like practice questions for?\n• Junior Python Developer\n• AI/ML Intern\n• AI Automation Engineer\n• Frontend Developer\n• Full-Stack Developer\n\nReply with your chosen role.";
      } else if (text === '5' || lower.includes('faq')) {
        botResponse = "❓ *Frequently Asked Questions*\n\n• Are vacancies real? No, all roles are fictional demonstration assets.\n• Can fresh graduates apply? Yes, all roles are entry-level/internship.\n• Is remote work guaranteed? Unconfirmed.\n\nReply 1 to explore vacancies!";
      } else if (lower.includes('python')) {
        botResponse = "🐍 *Junior Python Developer Practice Question:*\n\nExplain the difference between a list and a tuple in Python. When would you choose one over the other?\n\nType your answer to practice!";
      } else if (lower.includes('alex') || lower.includes('@') || lower.includes('elena') || lower.includes('developer')) {
        botResponse = "✅ *Application Details Recorded*\nThank you! Your simulated application has been received and indexed into the HirePilot HR pipeline. A reference confirmation has been generated in demo mode.";
      } else {
        botResponse = "I'm HirePilot AI for WhatsApp. Reply 1 for Open Positions, 2 for Job Match, 3 for Demo Application, 4 for Interview Prep, or 5 for FAQs.";
      }

      setSimMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <div className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official WhatsApp Business Platform Integration</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            WhatsApp Recruitment Assistant
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Allow candidates to discover vacancies, complete conversational screening, and practice interview questions directly through WhatsApp. Below is the interactive candidate simulator alongside official Meta Cloud API connection controls.
          </p>
        </div>

        {/* 2-Column Split: Simulator on Left (Phone), Meta Integration Settings on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Phone Simulator (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800">
              {/* Speaker notch */}
              <div className="w-24 h-4 bg-slate-950 mx-auto rounded-full mb-2" />

              {/* WhatsApp Interface Screen */}
              <div className="bg-[#ECE5DD] rounded-[28px] overflow-hidden flex flex-col h-[560px]">
                {/* WhatsApp Chat Header */}
                <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-sm shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                      HP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight flex items-center gap-1">
                        <span>HirePilot Recruiter</span>
                        <CheckCheck className="w-3 h-3 text-sky-300" />
                      </h4>
                      <p className="text-[10px] text-emerald-200">Official Demo Business Account</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSimMessages([
                        {
                          sender: 'bot',
                          text: "👋 Welcome to Nexora Technologies! I'm HirePilot AI, your WhatsApp recruitment assistant.\n\nReply with a number:\n1️⃣ Explore Open Positions\n2️⃣ Check Job Match\n3️⃣ Start Demo Application\n4️⃣ Interview Practice",
                          time: '12:00 PM'
                        }
                      ])
                    }
                    className="text-[10px] text-emerald-200 hover:text-white cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Messages Bubble Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                  {simMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-2.5 shadow-2xs whitespace-pre-line leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#E7FFDB] text-slate-900 rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                        <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                          <span>{msg.time}</span>
                          {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Number Replies */}
                <div className="px-3 py-1.5 bg-[#F0F0F0] border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <button
                    onClick={() => handleSimSend('1')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 rounded text-slate-700 border border-slate-200 whitespace-nowrap cursor-pointer"
                  >
                    1. Positions
                  </button>
                  <button
                    onClick={() => handleSimSend('2')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 rounded text-slate-700 border border-slate-200 whitespace-nowrap cursor-pointer"
                  >
                    2. Match
                  </button>
                  <button
                    onClick={() => handleSimSend('3')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 rounded text-slate-700 border border-slate-200 whitespace-nowrap cursor-pointer"
                  >
                    3. Apply
                  </button>
                  <button
                    onClick={() => handleSimSend('4')}
                    className="px-2 py-0.5 bg-white hover:bg-slate-100 rounded text-slate-700 border border-slate-200 whitespace-nowrap cursor-pointer"
                  >
                    4. Practice
                  </button>
                </div>

                {/* Input Bar */}
                <div className="p-2 bg-[#F0F0F0] flex items-center gap-1.5 shrink-0">
                  <input
                    type="text"
                    value={simInput}
                    onChange={e => setSimInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSimSend()}
                    placeholder="Type a message or number..."
                    className="flex-1 bg-white px-3 py-1.5 text-xs rounded-full border border-slate-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSimSend()}
                    className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:bg-[#075E54]"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Meta Cloud API Integration Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Official WhatsApp Cloud API Status</h3>
                  <p className="text-xs text-slate-500">
                    Integration settings for Meta Business Platform webhook processing
                  </p>
                </div>
                {/* Status indicator - Real check, NOT simulated */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border ${
                      config?.connected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        config?.connected ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{config?.connected ? 'Connected' : 'Not Connected'}</span>
                  </span>
                </div>
              </div>

              {/* Status Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Provider</span>
                  <span className="font-semibold text-slate-800">{config?.provider}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Webhook Verification Status</span>
                  <span className="font-semibold text-slate-800">{config?.webhookStatus}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Inbound Webhook Endpoint</span>
                  <code className="font-mono text-[11px] text-teal-800 break-all select-all">
                    /api/whatsapp/webhook
                  </code>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-medium block">Verify Token (Secret)</span>
                  <code className="font-mono text-[11px] text-slate-700">
                    {config?.verifyToken || 'hirepilot_meta_webhook_secret_2026'}
                  </code>
                </div>
              </div>

              {/* Test Connection Action */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Provider Connection Verification
                    </h4>
                    <p className="text-xs text-slate-500">
                      Validate whether Meta Graph API tokens and Phone Number IDs are active
                    </p>
                  </div>
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 text-xs rounded-lg border ${
                      testResult.connected
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    <div className="font-semibold mb-0.5">Status Code: {testResult.statusCode}</div>
                    <div>{testResult.message}</div>
                  </div>
                )}
              </div>

              {/* Step-by-Step Meta Setup Instructions */}
              <div className="space-y-3 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 text-sm">
                  How to Connect Real WhatsApp Business Cloud API
                </h4>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Register on{' '}
                    <strong className="text-slate-900">Meta for Developers</strong> and configure a WhatsApp Business App.
                  </li>
                  <li>
                    Obtain your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">WHATSAPP_ACCESS_TOKEN</code> and{' '}
                    <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">WHATSAPP_PHONE_NUMBER_ID</code> from the Meta App Dashboard.
                  </li>
                  <li>
                    In the WhatsApp Configuration Webhook panel, enter the Callback URL (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">https://your-domain/api/whatsapp/webhook</code>) and verify token: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">hirepilot_meta_webhook_secret_2026</code>.
                  </li>
                  <li>
                    Subscribe to <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">messages</code> webhook fields.
                  </li>
                </ol>
              </div>

              {/* Compliance & Policy Notice */}
              <div className="p-3.5 bg-slate-100 rounded-lg text-slate-600 text-xs space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-700" />
                  <span>Meta Platform Policy & Consent Rules</span>
                </div>
                <p>
                  Outbound WhatsApp messages require explicit candidate opt-in. Messages outside the 24-hour customer service window must use approved Meta Message Templates. Personal phone numbers cannot be used as WhatsApp Business API numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
