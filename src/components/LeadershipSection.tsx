import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, Award, Users, Edit3 } from 'lucide-react';

interface LeadershipSectionProps {
  onOpenCMS: () => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onOpenCMS }) => {
  const { profile, isAdminLoggedIn, isEditModeActive } = usePortfolio();
  const { leadership } = profile;

  return (
    <section id="leadership" className="py-20 bg-[#050B14] border-t border-b border-[#1E3A5F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              07 — LEADERSHIP
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {leadership.title}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              High-discipline command, squad coordination, and tactical team execution.
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-[#0B1628]/50 border border-[#1E3A5F]/40 rounded-lg hover:bg-[#00A8FF]/50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Leadership</span>
            </button>
          )}
        </div>

        {/* Highlight Card */}
        <div className="max-w-4xl p-8 rounded-2xl bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#00A8FF]/60 transition-all shadow-2xl relative overflow-hidden group">
          {/* Subtle Background Accent */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00A8FF]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 mb-6 border-b border-[#1E3A5F]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00A8FF]/10 text-[#F8FAFC] font-mono text-xs border border-[#00A8FF]/30 mb-3">
                <Shield className="w-3.5 h-3.5" />
                <span>{leadership.organization}</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#F8FAFC]">
                {leadership.role}
              </h3>
            </div>

            {leadership.stats && (
              <div className="px-4 py-3 rounded-xl bg-[#050B14] border border-[#1E3A5F] flex items-center gap-3 shrink-0">
                <div className="p-2 rounded-lg bg-[#00A8FF]/10 text-[#F8FAFC]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-wider block">
                    Leadership Metric
                  </span>
                  <span className="font-heading font-bold text-[#F8FAFC] text-sm">
                    {leadership.stats}
                  </span>
                </div>
              </div>
            )}
          </div>

          <p className="text-slate-300 text-base leading-relaxed">
            {leadership.description}
          </p>
        </div>
      </div>
    </section>
  );
};
