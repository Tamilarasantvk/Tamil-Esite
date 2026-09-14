import React, { useEffect, useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { AchievementsSection } from './components/AchievementsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { LeadershipSection } from './components/LeadershipSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal, TabType } from './components/AdminDashboardModal';
import { ResumeModal } from './components/ResumeModal';
import { ToastContainer } from './components/ToastContainer';
import { Shield, FileText, Settings, KeyRound, Sliders } from 'lucide-react';

const PortfolioContent: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<TabType>('profile');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { isAdminLoggedIn, isEditModeActive, toggleEditMode } = usePortfolio();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main > section'));
    sections.forEach((section) => {
      section.classList.add('reveal');
      Array.from(section.children).forEach((child) => child.classList.add('reveal'));
    });
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  const handleOpenDashboard = (tab: TabType = 'profile') => {
    setDashboardTab(tab);
    setIsDashboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F8FAFC] flex flex-col selection:bg-[#00A8FF]/30 selection:text-[#38BDF8]">
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ width: `${scrollProgress}%` }} />
      </div>
      {/* Navigation */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={() => handleOpenDashboard('profile')}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenCMS={() => handleOpenDashboard('profile')}
        />
        <AboutSection onOpenCMS={() => handleOpenDashboard('profile')} />
        <SkillsSection onOpenCMS={() => handleOpenDashboard('skills')} />
        <ProjectsSection onOpenCMS={() => handleOpenDashboard('projects')} />
        <ExperienceSection onOpenCMS={() => handleOpenDashboard('experience')} />
        <AchievementsSection onOpenCMS={() => handleOpenDashboard('achievements')} />
        <CertificationsSection onOpenCMS={() => handleOpenDashboard('certifications')} />
        <LeadershipSection onOpenCMS={() => handleOpenDashboard('leadership')} />
        <ContactSection onOpenCMS={() => handleOpenDashboard('profile')} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Portals */}
      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenDashboard={() => handleOpenDashboard('profile')}
      />

      <AdminDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onOpenResume={() => setIsResumeOpen(true)}
        initialTab={dashboardTab}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        onOpenCMS={(tab?: TabType) => handleOpenDashboard(tab || 'resume')}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Floating Admin Controls Widget */}
      {isAdminLoggedIn && (
        <aside
          aria-label="Admin quick action bar"
          className="no-print fixed bottom-5 left-5 z-40 flex items-center gap-2 p-2 rounded-xl bg-[#0D1B2A]/90 border border-[#00A8FF]/50 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2 pl-2 pr-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-slate-200 hidden sm:inline">
              Admin Active
            </span>
          </div>

          <button
            onClick={() => handleOpenDashboard('profile')}
            className="px-3 py-1.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>CMS Studio</span>
          </button>

          <button
            onClick={() => handleOpenDashboard('resume')}
            className="px-2.5 py-1.5 bg-[#0D1B2A]/20 hover:bg-[#0D1B2A]/30 text-slate-300 text-xs font-mono rounded-lg transition-colors flex items-center gap-1 border border-[#1E3A5F]/40"
            title="Configure Resume in CMS"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Resume</span>
          </button>

          <button
            onClick={() => setIsResumeOpen(true)}
            className="px-2.5 py-1.5 bg-[#0B1628] hover:bg-[#101F33] text-slate-300 text-xs font-mono rounded-lg transition-colors flex items-center gap-1 border border-[#1E3A5F]"
            title="Preview 1-Page Resume"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </button>
        </aside>
      )}

      {/* Non-admin quick login floating indicator */}
      {!isAdminLoggedIn && (
        <button
          onClick={() => setIsLoginOpen(true)}
          className="no-print fixed bottom-5 left-5 z-30 p-2.5 rounded-full bg-[#0D1B2A]/80 hover:bg-[#101F33] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E3A5F] hover:border-[#00A8FF]/50 shadow-lg backdrop-blur-md transition-all group"
          title="Admin CMS Login"
        >
          <KeyRound className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Feedback Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
