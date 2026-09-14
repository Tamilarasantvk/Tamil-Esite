import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

interface ExperienceSectionProps {
  onOpenCMS: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onOpenCMS }) => {
  const { profile, deleteExperience, isAdminLoggedIn, isEditModeActive } = usePortfolio();

  return (
    <section id="experience" className="py-20 bg-[#050B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              04 — EXPERIENCE
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {profile.siteSettings?.experienceTitle || 'Professional Journey'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {profile.siteSettings?.experienceSubtitle || 'Internships, tactical simulations, and specialized cybersecurity hands-on exposure.'}
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-[#F8FAFC] bg-[#00A8FF] hover:bg-[#38BDF8] rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Experience</span>
            </button>
          )}
        </div>

        {/* Vertical Cyber Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#1E3A5F] max-w-3xl ml-2 sm:ml-4 space-y-10">
          {profile.experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Glowing Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#00A8FF] shadow-[0_0_12px_#00A8FF] border-2 border-[#ffffff]" />

              <div className="p-6 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#00A8FF]/60 transition-all shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase">
                    {exp.type}
                  </span>

                  <div className="flex items-center gap-3">
                    {exp.dateRange && (
                      <span className="font-mono text-xs text-[#94A3B8] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#38BDF8]" />
                        {exp.dateRange}
                      </span>
                    )}

                    {isAdminLoggedIn && isEditModeActive && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={onOpenCMS}
                          className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
                          title="Edit in CMS"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete experience "${exp.role}"?`)) {
                              deleteExperience(exp.id);
                            }
                          }}
                          className="p-1 rounded text-[#94A3B8] hover:text-slate-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#F8FAFC] mb-1">
                  {exp.role}
                </h3>

                {exp.organization && (
                  <h4 className="text-sm font-sans font-medium text-[#38BDF8] mb-3">
                    {exp.organization}
                  </h4>
                )}

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {exp.description}
                </p>

                {exp.keyPoints && exp.keyPoints.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-slate-300 pl-4 border-l border-[#1E3A5F]/80">
                    {exp.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-[#F8FAFC]">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
