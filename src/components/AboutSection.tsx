import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, GraduationCap, Target, Cpu, Compass, Edit3 } from 'lucide-react';

interface AboutSectionProps {
  onOpenCMS: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCMS }) => {
  const { profile, isAdminLoggedIn, isEditModeActive } = usePortfolio();

  return (
    <section id="about" className="py-20 bg-[#050B14] border-t border-b border-[#1E3A5F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              01 — ABOUT ME
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {profile.siteSettings?.aboutTitle || 'Who I Am'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {profile.siteSettings?.aboutSubtitle || 'A technology enthusiast building practical cybersecurity and defensive operations skills.'}
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-[#0B1628]/50 border border-[#1E3A5F]/40 rounded-lg hover:bg-[#00A8FF]/50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit About</span>
            </button>
          )}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Narrative Bio */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 text-base leading-relaxed">
            {profile.aboutParagraphs.map((paragraph, idx) => (
              <p key={idx} className="p-4 rounded-lg bg-[#0D1B2A]/40 border border-[#1E3A5F]/40 hover:border-[#00A8FF]/40 transition-colors">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right Column: SOC Info Card */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] shadow-xl relative overflow-hidden group hover:border-[#00A8FF]/60 transition-all">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00A8FF]/10 rounded-bl-full pointer-events-none" />

              <h3 className="font-heading text-lg font-bold text-[#F8FAFC] mb-6 flex items-center gap-2 border-b border-[#1E3A5F] pb-3">
                <Shield className="w-4 h-4 text-[#F8FAFC]" />
                <span>Profile Snapshot</span>
              </h3>

              <div className="space-y-5">
                <div className="border-b border-[#1E3A5F]/60 pb-3.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5 mb-1 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" /> Education
                  </span>
                  <p className="text-sm font-medium text-slate-100">{profile.education}</p>
                </div>

                <div className="border-b border-[#1E3A5F]/60 pb-3.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5 mb-1 font-semibold">
                    <Target className="w-3.5 h-3.5" /> Career Goal
                  </span>
                  <p className="text-sm font-medium text-slate-100">{profile.careerGoal}</p>
                </div>

                <div className="border-b border-[#1E3A5F]/60 pb-3.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5 mb-1 font-semibold">
                    <Cpu className="w-3.5 h-3.5" /> Interests
                  </span>
                  <p className="text-sm font-medium text-slate-100">{profile.interests}</p>
                </div>

                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5 mb-1 font-semibold">
                    <Compass className="w-3.5 h-3.5" /> Activities
                  </span>
                  <p className="text-sm font-medium text-slate-100">{profile.activities}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
