import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Terminal, Shield, Wrench, Code2, Network, Plus, Trash2, Edit3 } from 'lucide-react';

interface SkillsSectionProps {
  onOpenCMS: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ onOpenCMS }) => {
  const { profile, addSkillCategory, updateSkillCategory, deleteSkillCategory, isAdminLoggedIn, isEditModeActive } = usePortfolio();
  const [newSkillText, setNewSkillText] = useState<{ [id: string]: string }>({});

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('cyber') || lower.includes('security')) return <Shield className="w-4 h-4 text-[#F8FAFC]" />;
    if (lower.includes('tool')) return <Wrench className="w-4 h-4 text-[#38BDF8]" />;
    if (lower.includes('program') || lower.includes('code') || lower.includes('language')) return <Code2 className="w-4 h-4 text-[#94A3B8]" />;
    return <Network className="w-4 h-4 text-[#38BDF8]" />;
  };

  const handleAddSkillToCat = (catId: string) => {
    const text = (newSkillText[catId] || '').trim();
    if (!text) return;
    const cat = profile.skills.find((s) => s.id === catId);
    if (cat) {
      updateSkillCategory(catId, { skills: [...cat.skills, text] });
      setNewSkillText({ ...newSkillText, [catId]: '' });
    }
  };

  return (
    <section id="skills" className="py-20 bg-[#050B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              02 — SKILLS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {profile.siteSettings?.skillsTitle || 'Technical Arsenal'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {profile.siteSettings?.skillsSubtitle || 'Technologies, analytical tools, and cybersecurity domains I actively operate and study.'}
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const catName = prompt('Enter new skill category name:');
                  if (catName?.trim()) {
                    addSkillCategory({ category: catName.trim(), skills: [] });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-[#0B1628]/60 border border-[#1E3A5F]/50 rounded-lg hover:bg-[#00A8FF]/60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
              <button
                onClick={onOpenCMS}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-[#0D1B2A] border border-[#1E3A5F] rounded-lg hover:bg-[#0B1628]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage in CMS</span>
              </button>
            </div>
          )}
        </div>

        {/* Skills Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${profile.skills.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
          {profile.skills.map((skillGroup) => (
            <div
              key={skillGroup.id}
              className="p-6 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#00A8FF] transition-all duration-300 hover:-translate-y-1 group shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
                  <h3 className="font-heading text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                    {getCategoryIcon(skillGroup.category)}
                    <span>{skillGroup.category}</span>
                  </h3>
                  {isAdminLoggedIn && isEditModeActive && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete skill group "${skillGroup.category}"?`)) {
                          deleteSkillCategory(skillGroup.id);
                        }
                      }}
                      className="text-slate-500 hover:text-slate-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Skills Pills */}
                <div className="space-y-2">
                  {skillGroup.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#050B14]/60 border border-[#1E3A5F]/60 text-xs font-mono text-slate-200 group/item hover:border-[#38BDF8]/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A8FF]" />
                        {skill}
                      </span>
                      {isAdminLoggedIn && isEditModeActive && (
                        <button
                          onClick={() => {
                            const newSkills = skillGroup.skills.filter((_, i) => i !== sIdx);
                            updateSkillCategory(skillGroup.id, { skills: newSkills });
                          }}
                          className="text-slate-500 hover:text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity ml-2 text-xs"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Add Skill Input for Admin */}
              {isAdminLoggedIn && isEditModeActive && (
                <div className="mt-4 pt-3 border-t border-[#1E3A5F]/60 flex gap-1.5">
                  <input
                    type="text"
                    value={newSkillText[skillGroup.id] || ''}
                    onChange={(e) => setNewSkillText({ ...newSkillText, [skillGroup.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillToCat(skillGroup.id);
                      }
                    }}
                    placeholder="+ New skill..."
                    className="w-full px-2 py-1 bg-[#050B14] border border-[#1E3A5F] rounded text-[11px] text-[#F8FAFC] font-mono"
                  />
                  <button
                    onClick={() => handleAddSkillToCat(skillGroup.id)}
                    className="px-2 py-1 bg-[#00A8FF] text-white text-xs font-bold rounded"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
