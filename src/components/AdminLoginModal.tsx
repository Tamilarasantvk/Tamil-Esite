import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, Lock, User, Eye, EyeOff, X, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard
}) => {
  const { adminLogin, requestPasswordReset, resetAdminPassword, isAdminLoggedIn, adminLogout } = usePortfolio();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get('adminReset') || '');
  const [resetPassword, setResetPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = await adminLogin(username.trim(), password);
    if (success) {
      setPassword('');
      onClose();
      if (onOpenDashboard) {
        onOpenDashboard();
      }
    } else {
      setErrorMsg('Invalid credentials. Please verify your login details.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await requestPasswordReset(username);
    setErrorMsg(success ? 'If the account exists, a reset link was sent to the admin email.' : 'Unable to contact the authentication service.');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await resetAdminPassword(resetToken, resetPassword);
    setErrorMsg(success ? 'Password reset complete. Sign in with your new password.' : 'This reset link is invalid or expired.');
    if (success) { setResetToken(''); setResetPassword(''); setIsForgotPassword(false); window.history.replaceState({}, '', window.location.pathname); }
  };

  return (
    <div id="admin-login-modal" className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-[#050B14]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0D1B2A] border border-[#1E3A5F] rounded-xl p-6 md:p-8 shadow-2xl text-[#F8FAFC]">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-[#F8FAFC]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-[#F8FAFC] tracking-wide">
                Admin Authentication
              </h3>
              <p className="font-mono text-xs text-[#94A3B8]">
                SOC PORTAL • ROLE-BASED ACCESS CONTROL
              </p>
            </div>
          </div>
          <button
            id="close-admin-login"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B1628] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAdminLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#00A8FF]/10 border border-[#00A8FF]/30 text-slate-200 text-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#F8FAFC] shrink-0" />
              <span>You are currently authenticated as <strong>Admin</strong>. Live CRUD editing is enabled.</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                id="open-cms-from-login"
                onClick={() => {
                  onClose();
                  if (onOpenDashboard) onOpenDashboard();
                }}
                className="flex-1 py-2.5 px-4 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-[#00A8FF]/20"
              >
                Open CMS Dashboard
              </button>
              <button
                id="logout-btn-modal"
                onClick={() => {
                  adminLogout();
                  onClose();
                }}
                className="py-2.5 px-4 bg-[#0B1628] hover:bg-[#0B1628] hover:text-slate-300 border border-[#1E3A5F] text-slate-300 text-sm rounded-lg transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : isForgotPassword || resetToken ? (
          <form onSubmit={resetToken ? handleResetPassword : handleForgotPassword} className="space-y-4">
            {errorMsg && <div className="p-3 rounded-lg bg-[#0B1628]/70 border border-[#1E3A5F]/50 text-slate-200 text-xs flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" /><span>{errorMsg}</span></div>}
            <p className="text-sm text-slate-300">{resetToken ? 'Choose a new admin password.' : 'Enter your admin username. A one-time reset link will be sent to the configured admin email.'}</p>
            {!resetToken && <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Configured admin username" className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] font-mono" />}
            {resetToken && <input type="password" required minLength={12} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="New password (min 12 chars)" className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] font-mono" />}
            <button type="submit" className="w-full py-2.5 px-4 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2"><Mail className="w-4 h-4" />{resetToken ? 'Reset Password' : 'Send Reset Link'}</button>
            {!resetToken && <button type="button" onClick={() => { setIsForgotPassword(false); setErrorMsg(''); }} className="w-full text-xs text-[#38BDF8] flex items-center justify-center gap-1"><ArrowLeft className="w-3 h-3" /> Back to sign in</button>}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#0B1628]/70 border border-[#1E3A5F]/50 text-slate-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Configured admin username"
                  className="w-full pl-9 pr-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#00A8FF] focus:ring-1 focus:ring-[#00A8FF] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#00A8FF] focus:ring-1 focus:ring-[#00A8FF] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-submit-btn"
              type="submit"
              className="w-full py-2.5 px-4 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-[#00A8FF]/20 flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              Authorize & Enter CMS
            </button>
            <button type="button" onClick={() => { setIsForgotPassword(true); setErrorMsg(''); }} className="w-full text-xs text-[#38BDF8] hover:text-white">Forgot password?</button>
          </form>
        )}
      </div>
    </div>
  );
};
