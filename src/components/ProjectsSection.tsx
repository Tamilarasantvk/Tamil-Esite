import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { FolderGit2, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectsSectionProps {
  onOpenCMS: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenCMS }) => {
  const { profile, deleteProject, isAdminLoggedIn, isEditModeActive } = usePortfolio();

  return (
    <section id="projects" className="py-20 bg-[#050B14] border-t border-b border-[#1E3A5F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              03 — PROJECTS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {profile.siteSettings?.projectsTitle || 'Featured Projects'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {profile.siteSettings?.projectsSubtitle || 'Practical hardware, network defense, and applied cybersecurity initiatives.'}
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-[#F8FAFC] bg-[#00A8FF] hover:bg-[#38BDF8] rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Projects</span>
            </button>
          )}
        </div>

        {/* Project Grid */}
        <div className={`grid grid-cols-1 ${profile.projects.length === 1 ? 'max-w-2xl' : profile.projects.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {profile.projects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#00A8FF] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group shadow-xl relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider">
                    {project.projectNumber}
                  </span>

                  {isAdminLoggedIn && isEditModeActive && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={onOpenCMS}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B1628]"
                        title="Edit in CMS"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete project "${project.title}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1 rounded text-[#94A3B8] hover:text-slate-400 hover:bg-[#0B1628]/40"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="font-heading text-xl font-bold text-[#F8FAFC] mb-3 group-hover:text-[#38BDF8] transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#1E3A5F]/60">
                {project.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded bg-[#1E3A5F]/40 border border-[#38BDF8]/20 text-[#38BDF8] font-mono text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
