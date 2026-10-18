import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { DemoNoticeBanner } from './components/common/DemoNoticeBanner';
import { Hero } from './components/public/Hero';
import { JobsSection } from './components/public/JobsSection';
import { BenefitsSection } from './components/public/BenefitsSection';
import { HelpCenterSection } from './components/public/HelpCenterSection';
import { JobDetailsModal } from './components/public/JobDetailsModal';
import { ApplicationModal } from './components/public/ApplicationModal';
import { HirePilotChatbot } from './components/chat/HirePilotChatbot';
import { WhatsAppSection } from './components/whatsapp/WhatsAppSection';
import { HRDashboard } from './components/dashboard/HRDashboard';
import { Job, FAQItem } from './types';
import { INITIAL_JOBS, INITIAL_FAQS } from './data/knowledgeBase';
import { api } from './utils/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'dashboard' | 'whatsapp'>('public');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForApp, setSelectedJobForApp] = useState<Job | null>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContextJob, setChatContextJob] = useState<Job | null>(null);

  // Load latest jobs & faqs from backend on start
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, kbData] = await Promise.all([
          api.getJobs(),
          api.getKnowledgeBase()
        ]);
        if (jobsData && jobsData.length > 0) setJobs(jobsData);
        if (kbData && kbData.faqs) setFaqs(kbData.faqs);
      } catch (err) {
        console.debug('Loaded default seed data in client:', err);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (view: 'public' | 'dashboard' | 'whatsapp', sectionId?: string) => {
    setCurrentView(view);
    if (view === 'public' && sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenChatWithJob = (job: Job) => {
    setChatContextJob(job);
    setIsChatOpen(true);
  };

  const handleStartApplication = (job?: Job) => {
    if (job) setSelectedJobForApp(job);
    setIsAppModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Banner Notice */}
      <DemoNoticeBanner
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {currentView === 'dashboard' ? (
        /* HR Recruitment Dashboard */
        <HRDashboard
          onBackToPublic={() => handleNavigate('public')}
          onOpenChat={() => setIsChatOpen(true)}
        />
      ) : (
        /* Candidate Experience (Public Website & WhatsApp Page) */
        <div className="flex-1 flex flex-col">
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenChat={() => setIsChatOpen(true)}
          />

          <main className="flex-1">
            {currentView === 'whatsapp' ? (
              <WhatsAppSection
                jobs={jobs}
                onOpenApplicationModal={handleStartApplication}
              />
            ) : (
              <>
                {/* Hero Section */}
                <Hero
                  onExploreJobs={() => handleNavigate('public', 'jobs')}
                  onOpenChat={() => setIsChatOpen(true)}
                />

                {/* 5 Open Vacancies Section */}
                <JobsSection
                  jobs={jobs}
                  onSelectJob={job => setSelectedJobForDetails(job)}
                  onApplyJob={job => handleStartApplication(job)}
                  onAskAi={job => handleOpenChatWithJob(job)}
                />

                {/* Platform Values & Recruitment Steps */}
                <BenefitsSection
                  onExploreJobs={() => handleNavigate('public', 'jobs')}
                  onOpenChat={() => setIsChatOpen(true)}
                />

                {/* Candidate Help Center & FAQs */}
                <HelpCenterSection
                  faqs={faqs}
                  jobs={jobs}
                  onOpenChat={() => setIsChatOpen(true)}
                  onSelectJobForPrep={job => handleOpenChatWithJob(job)}
                />
              </>
            )}
          </main>

          <Footer
            onNavigate={handleNavigate}
            onOpenChat={() => setIsChatOpen(true)}
          />
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onApply={job => handleStartApplication(job)}
        onAskAi={job => handleOpenChatWithJob(job)}
      />

      {/* Multi-step Application Modal */}
      <ApplicationModal
        initialJob={selectedJobForApp}
        jobs={jobs}
        isOpen={isAppModalOpen}
        onClose={() => {
          setIsAppModalOpen(false);
          setSelectedJobForApp(null);
        }}
        onSuccess={() => {
          // Re-fetch jobs or apps if needed
        }}
      />

      {/* Floating AI Recruiter Chatbot */}
      <HirePilotChatbot
        jobs={jobs}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        initialContextJob={chatContextJob}
        onOpenApplicationModal={handleStartApplication}
      />
    </div>
  );
}
