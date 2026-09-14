import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { sanitizeUrl } from '../utils/security';
import { Award, ExternalLink, Plus, Edit2, Trash2 } from 'lucide-react';

interface CertificationsSectionProps {
  onOpenCMS: () => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ onOpenCMS }) => {
  const { profile, deleteCertification, isAdminLoggedIn, isEditModeActive } = usePortfolio();

  return (
    <section id="certifications" className="py-20 bg-[#050B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-widest block uppercase mb-2">
              06 — CERTIFICATIONS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
              {profile.siteSettings?.certificationsTitle || 'Certifications & Training'}
            </h2>
            <p className="text-[#94A3B8] text-sm mt-2">
              {profile.siteSettings?.certificationsSubtitle || 'Verified certifications in cybersecurity, python, defensive techniques, and corporate readiness.'}
            </p>
          </div>

          {isAdminLoggedIn && isEditModeActive && (
            <button
              onClick={onOpenCMS}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-[#F8FAFC] bg-[#00A8FF] hover:bg-[#38BDF8] rounded-lg shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Certs</span>
            </button>
          )}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] hover:border-[#38BDF8] transition-all duration-300 hover:-translate-y-1 group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-[#00A8FF]/10 text-[#F8FAFC] border border-[#00A8FF]/20">
                    <Award className="w-5 h-5" />
                  </div>

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
                          if (window.confirm(`Delete cert "${cert.title}"?`)) {
                            deleteCertification(cert.id);
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

                <strong className="text-[#F8FAFC] text-base font-heading font-semibold block mb-1">
                  {cert.issuer}
                </strong>

                <p className="font-mono text-xs text-[#F8FAFC] mb-2 font-medium">
                  {cert.title}
                </p>

                {cert.issuedYear && (
                  <span className="font-mono text-[11px] text-[#94A3B8] block">
                    Issued: {cert.issuedYear}
                  </span>
                )}
              </div>

              {cert.credentialUrl && (
                <div className="pt-4 mt-4 border-t border-[#1E3A5F]/60">
                  <a
                    href={sanitizeUrl(cert.credentialUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[#38BDF8] hover:text-[#F8FAFC] transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
