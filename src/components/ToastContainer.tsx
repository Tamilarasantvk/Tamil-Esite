import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePortfolio();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg border shadow-xl backdrop-blur-md text-sm transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-[#0D1B2A]/95 border-[#00A8FF]/60 text-[#F8FAFC]'
              : toast.type === 'error'
              ? 'bg-[#1e1017]/95 border-[#1E3A5F]/60 text-slate-100'
              : 'bg-[#0B1628]/95 border-[#38BDF8]/40 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#F8FAFC] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />}
            <span className="font-sans text-xs leading-relaxed">{toast.message}</span>
          </div>
          <button
            id={`dismiss-toast-${toast.id}`}
            onClick={() => dismissToast(toast.id)}
            className="p-1 hover:text-[#F8FAFC] text-[#94A3B8] shrink-0 ml-2 rounded transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
