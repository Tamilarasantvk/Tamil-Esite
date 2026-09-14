import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, FileText, Lock, Unlock, Menu, X, Terminal, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenDashboard,
  onOpenResume
}) => {
  const { profile, isAdminLoggedIn, isEditModeActive, toggleEditMode } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#certifications', label: 'Certs' },
    { href: '#contact', label: 'Contact' }
  ];

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 24);
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }),
      { rootMargin: '-25% 0px -62% 0px', threshold: 0 },
    );

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener('scroll', updateScrolledState);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = () => setMobileMenuOpen(false);

  return (
    <header className={`site-navbar sticky top-0 z-50 px-3 sm:px-5 lg:px-8 pt-3 ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between rounded-2xl bg-[#050B14]/80 backdrop-blur-xl border border-[#1E3A5F]/80 shadow-[0_18px_45px_rgba(0,0,0,.22)]">
        {/* Brand / Logo with SOC terminal pulse */}
        <a href="#home" onClick={handleNavClick} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A8FF]/25 to-violet-500/20 border border-[#00A8FF]/50 flex items-center justify-center text-[#38BDF8] group-hover:border-[#38BDF8] group-hover:shadow-[0_0_18px_rgba(0,168,255,0.4)] transition-all">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base tracking-wider text-white group-hover:text-[#00A8FF] transition-colors">
              {profile.siteSettings?.brandTitle || profile.name.toUpperCase()}
            </span>
            <span className="font-mono text-[9px] text-[#38BDF8] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {profile.siteSettings?.brandSubtitle || 'SOC OPERATIONS • BLUE TEAM'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                  className={`nav-link font-mono text-[11px] tracking-wide py-2 relative ${activeSection === link.href.slice(1) ? 'is-active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons: Resume + Admin Login / CMS */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* 1-Page Resume Trigger */}
          <button
            id="nav-resume-btn"
            onClick={onOpenResume}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium text-white bg-[#00A8FF]/10 hover:bg-[#00A8FF]/20 border border-[#00A8FF]/30 hover:border-[#00A8FF]/60 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1-Page Resume</span>
          </button>

          {/* Admin CMS Trigger */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                id="nav-cms-dashboard-btn"
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold text-[#050B14] bg-[#00A8FF] hover:bg-[#101F33] transition-all"
                title="Open CMS CRUD Studio"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>CMS Studio</span>
              </button>
              <button
                id="nav-toggle-edit-mode"
                onClick={toggleEditMode}
                className={`p-1.5 rounded-md text-xs border font-mono transition-colors ${
                  isEditModeActive
                    ? 'border-[#00A8FF]/50 bg-[#00A8FF]/10 text-white'
                    : 'border-slate-700 bg-[#00A8FF] text-slate-400'
                }`}
                title={isEditModeActive ? 'Inline edit buttons visible' : 'Visitor view mode'}
              >
                <Unlock className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="nav-admin-login-btn"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono text-slate-300 hover:text-white bg-[#0D1B2A]/50 hover:bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#00A8FF]/50 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-slate-300" />
              <span>Admin Login</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenResume}
            className="p-2 text-white bg-[#00A8FF]/10 rounded border border-[#00A8FF]/30 text-xs"
            title="Resume"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-[#00A8FF]/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu sm:hidden px-4 pt-2 bg-[#050B14] border-b border-slate-700 space-y-3 ${mobileMenuOpen ? 'is-open' : ''}`}>
          <ul className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                  className={`mobile-nav-link block p-2 rounded text-xs font-mono ${activeSection === link.href.slice(1) ? 'is-active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-slate-700 flex flex-col gap-2">
            <button
              onClick={() => {
                handleNavClick();
                onOpenResume();
              }}
              className="w-full py-2 px-3 bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-white rounded text-xs font-mono flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> View 1-Page Resume
            </button>

            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                    handleNavClick();
                  onOpenDashboard();
                }}
                className="w-full py-2 px-3 bg-[#00A8FF] text-white font-semibold rounded text-xs font-mono flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" /> Open CMS Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                    handleNavClick();
                  onOpenLogin();
                }}
                className="w-full py-2 px-3 bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-white rounded text-xs font-mono flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Admin Login (CRUD)
              </button>
            )}
          </div>
        </div>
    </header>
  );
};
