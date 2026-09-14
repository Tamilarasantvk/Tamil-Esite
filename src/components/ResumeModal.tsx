import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { sanitizePdfUrl } from '../utils/security';
import { ExternalLink, FileText, Lock, Printer, ShieldCheck, Sliders, X } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCMS?: (tab?: any) => void;
  onOpenLogin?: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  onOpenCMS,
  onOpenLogin
}) => {
  const { profile, isAdminLoggedIn } = usePortfolio();
  const uploadedResumeUrl = profile.resumeSettings?.uploadedResumeUrl;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="resume-modal-overlay" className="fixed inset-0 z-[9992] flex items-center justify-center p-2 sm:p-4 bg-[#050B14]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl h-[95vh] bg-[#050B14] border border-[#1E3A5F] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-[#1E3A5F] bg-[#050B14]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00A8FF]/10 text-[#00A8FF] border border-[#00A8FF]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                Uploaded Resume
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0B1628]/80 text-slate-300 border border-[#1E3A5F]/40">
                  PDF PREVIEW
                </span>
              </h3>
              <p className="text-xs font-mono text-[#94A3B8]">Your uploaded resume is shown here without generated content.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {uploadedResumeUrl && (
              <button
                id="resume-print-btn"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-[#050B14] font-semibold rounded-lg text-xs font-mono transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            )}
            {isAdminLoggedIn && onOpenCMS && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCMS('resume');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1B2A] hover:bg-[#101F33] text-slate-300 border border-[#1E3A5F] text-xs font-mono rounded-lg transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Resume Studio</span>
              </button>
            )}
            {!isAdminLoggedIn && onOpenLogin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1628] hover:bg-[#101F33] text-slate-300 border border-[#1E3A5F] text-xs font-mono rounded-lg transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Login</span>
              </button>
            )}
            <button
              id="resume-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B1628] transition-colors"
              title="Close resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#050B14]">
          {uploadedResumeUrl ? (
            <div id="printable-resume" className="mx-auto max-w-[900px] h-full rounded-xl border border-[#1E3A5F] bg-[#0D1B2A] p-3">
              <iframe
                src={sanitizePdfUrl(uploadedResumeUrl)}
                title={`${profile.name} uploaded resume`}
                className="h-full min-h-[700px] w-full rounded-lg bg-white"
              />
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
              <FileText className="w-12 h-12 text-[#00A8FF] mb-4" />
              <h4 className="font-heading text-xl font-bold text-white mb-2">No uploaded resume yet</h4>
              <p className="max-w-md text-sm text-slate-300 mb-6">
                Upload your PDF in Resume Studio. This portfolio does not generate or display an automatic resume.
              </p>
              {isAdminLoggedIn && onOpenCMS ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCMS('resume');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-[#050B14] font-semibold rounded-lg text-xs font-mono"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Resume Studio
                </button>
              ) : onOpenLogin ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-[#050B14] font-semibold rounded-lg text-xs font-mono"
                >
                  <Lock className="w-4 h-4" />
                  Admin Login to Upload
                </button>
              ) : null}
            </div>
          )}
        </div>

        <div className="no-print px-6 py-3 border-t border-[#1E3A5F] bg-[#050B14] text-xs font-mono text-[#94A3B8]">
          Only your uploaded PDF is displayed in this resume viewer.
        </div>
      </div>
    </div>
  );
};
