import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, Plus, Edit2, Trash2 } from 'lucide-react';

interface AchievementsSectionProps {
  onOpenCMS: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ onOpenCMS }) => {
  const { profile, deleteAchievement, isAdminLoggedIn, isEditModeActive } = usePortfolio();

  return (
    <section id="achievements" className="py-20 bg-[#050B14] border-t border-b border-[#1E3A5F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              05 — ACHIEVEMENTS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {profile.siteSettings?.achievementsTitle || 'Key Achievements'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {profile.siteSettings?.achievementsSubtitle || 'Recognitions earned in Capture The Flag competitions, symposiums, and leadership camps.'}
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-[#F8FAFC] bg-[#00A8FF] hover:bg-[#38BDF8] rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Achievements</span>
            </button>
          )}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-6 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#00A8FF] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group shadow-xl relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                    {ach.awardEmoji}
                  </span>

                  {isAdminLoggedIn && isEditModeActive && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={onOpenCMS}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete achievement "${ach.title}"?`)) {
                            deleteAchievement(ach.id);
                          }
                        }}
                        className="p-1 rounded text-[#94A3B8] hover:text-slate-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="font-heading text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#38BDF8] transition-colors">
                  {ach.title}
                </h3>

                {ach.organization && (
                  <span className="font-mono text-xs text-[#F8FAFC] block mb-2 font-medium">
                    {ach.organization}
                  </span>
                )}

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
