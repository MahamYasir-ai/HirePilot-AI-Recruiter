import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, ChevronDown, CheckCircle2, User, ExternalLink } from 'lucide-react';
import recruiterAvatarImg from '../../assets/images/avatar_recruiter_sarah_1792353150433.jpg';
import { ChatMessage, Job } from '../../types';
import { api } from '../../utils/api';

interface Props {
  jobs: Job[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialContextJob?: Job | null;
  onOpenApplicationModal?: (job?: Job) => void;
}

export const HirePilotChatbot: React.FC<Props> = ({
  jobs,
  isOpen,
  onClose,
  onOpen,
  initialContextJob,
  onOpenApplicationModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'native' | 'jotform'>('native');
  const [jotformLoaded, setJotformLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const jotformContainerRef = useRef<HTMLDivElement>(null);

  // Initial welcome message per exact prompt specifications
  const getInitialMessage = (): ChatMessage => ({
    id: `msg-${Date.now()}`,
    sender: 'bot',
    text: "Hello! Welcome to Nexora Technologies. I'm HirePilot AI, your recruitment assistant. I can help you explore opportunities, understand job requirements, prepare for interviews, and walk you through a demo application. What would you like to do today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    quickReplies: [
      'Explore Open Positions',
      'Check My Job Match',
      'Start an Application',
      'Interview Preparation',
      'Recruitment FAQs'
    ]
  });

  // Initialize messages on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([getInitialMessage()]);
    }
  }, []);

  // Handle external job context if provided
  useEffect(() => {
    if (initialContextJob && isOpen) {
      const contextMsg: ChatMessage = {
        id: `msg-ctx-${Date.now()}`,
        sender: 'bot',
        text: `I see you are viewing the **${initialContextJob.title}** position (${initialContextJob.department} · ${initialContextJob.level}). Would you like to practice technical interview questions, check your skill match, or start a demo application?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: [
          `Interview Prep: ${initialContextJob.title}`,
          `Check Match for ${initialContextJob.title}`,
          `Apply for ${initialContextJob.title}`
        ]
      };
      setMessages(prev => [...prev, contextMsg]);
    }
  }, [initialContextJob, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Play polite click sound
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext not allowed before user interaction
    }
  };

  // Handle Jotform agent script loading
  useEffect(() => {
    if (activeTab === 'jotform' && !jotformLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jotfor.ms/agent/embedjs/01a150816a0870008a103e61c25c9993c45f/embed.js';
      script.async = true;
      script.onload = () => setJotformLoaded(true);
      document.body.appendChild(script);
    }
  }, [activeTab, jotformLoaded]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setInputText('');
    playChime();

    // Special quick reply: Open Application Form
    if (text.toLowerCase().includes('open application form') && onOpenApplicationModal) {
      onOpenApplicationModal();
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await api.sendMessage(text, initialContextJob?.title);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: response.quickReplies || ['Explore Open Positions', 'Check My Job Match', 'Start an Application', 'Interview Preparation', 'Recruitment FAQs']
      };

      setMessages(prev => [...prev, botMsg]);
      playChime();

      // Save to background session
      api.saveConversation({
        channel: 'Website',
        messages: [...messages, userMsg, botMsg],
        jobInterest: initialContextJob?.title
      }).catch(err => console.debug('Session log:', err));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'bot',
        text: "I experienced a brief connection delay. As a reminder, Nexora Technologies demonstration vacancies are: Junior Python Developer, AI/ML Intern, AI Automation Engineer, Frontend Developer, and Full-Stack Developer. How can I help you with those?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['Explore Open Positions', 'Check My Job Match', 'Interview Preparation']
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRestart = () => {
    setMessages([getInitialMessage()]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Open HirePilot AI Recruiter Chat"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 hover:bg-slate-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2.5 group cursor-pointer border border-slate-700/60"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-400/50 bg-slate-800 shrink-0">
              <img
                src={recruiterAvatarImg}
                onError={(e) => {
                  e.currentTarget.src = '/images/avatar_recruiter_sarah_1792353150433.jpg';
                }}
                alt="HirePilot AI Recruiter Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-400 border-2 border-slate-900 rounded-full" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>HirePilot AI Recruiter</span>
            </span>
            <span className="text-[11px] text-teal-300 font-medium">Click to chat · Demo</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isExpanded
              ? 'inset-4 sm:inset-10 lg:inset-x-auto lg:right-8 lg:bottom-6 lg:top-16 lg:w-[680px]'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-teal-400 bg-slate-800 shrink-0">
                <img
                  src={recruiterAvatarImg}
                  onError={(e) => {
                    e.currentTarget.src = '/images/avatar_recruiter_sarah_1792353150433.jpg';
                  }}
                  alt="Recruiter Sarah"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                  <span>HirePilot AI Recruiter</span>
                  <span className="text-[10px] text-teal-400 font-medium px-1.5 py-0.2 bg-slate-800 rounded">
                    Demo
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">Nexora Technologies Assistant</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRestart}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs: Native AI vs Jotform Agent Embed */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('native')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'native' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HirePilot Recruiter (Grounded)
            </button>
            <button
              onClick={() => setActiveTab('jotform')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'jotform' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>Jotform Recruiter Agent</span>
            </button>
          </div>

          {activeTab === 'jotform' ? (
            /* Jotform Agent Embed View */
            <div className="flex-1 p-4 bg-slate-50 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto border border-teal-200">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-bold text-slate-900">Jotform AI Recruiter Active</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The Jotform AI Agent script is embedded in this session. You can interact directly with the agent badge in your viewport or open the full experience.
                </p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-mono break-all max-w-xs text-left">
                Embed source: cdn.jotfor.ms/agent/embedjs/01a150816a0870008a103e61c25c9993c45f/embed.js
              </div>
              <button
                onClick={() => setActiveTab('native')}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Return to HirePilot Native Chat
              </button>
            </div>
          ) : (
            /* Native HirePilot AI Recruiter Chat */
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                    {/* Quick Replies */}
                    {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.quickReplies.map(qr => (
                          <button
                            key={qr}
                            onClick={() => handleSendMessage(qr)}
                            className="text-[11px] font-medium text-slate-700 hover:text-teal-900 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 px-2.5 py-1 rounded-full transition-colors cursor-pointer shadow-2xs"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-xs text-xs text-slate-400 w-fit shadow-xs">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                    <span className="text-[11px] ml-1 text-slate-500">HirePilot AI is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Ask about roles, skills match, interview prep..."
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="p-2.5 text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between pt-2 px-1 text-[10px] text-slate-400">
                  <span>Nexora Technologies recruitment knowledge base verified</span>
                  <span className="text-teal-700 font-medium">Fictional demo</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
