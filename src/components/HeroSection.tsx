import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, ArrowRight, FileText, Mail, Edit3, Check, Upload, Camera, Trash2 } from 'lucide-react';
import { prepareImageForStorage } from '../utils/image';

interface HeroSectionProps {
  onOpenResume: () => void;
  onOpenCMS: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume, onOpenCMS }) => {
  const { profile, updateProfileBasic, isAdminLoggedIn, isEditModeActive } = usePortfolio();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState(profile.avatarUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const displayAvatarUrl = profile.avatarUrl || '/profile.png';

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    prepareImageForStorage(file)
      .then((dataUrl) => {
        updateProfileBasic({ avatarUrl: dataUrl });
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      })
      .catch(() => setUploadSuccess(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSaveAvatar = () => {
    if (avatarInput.trim()) {
      updateProfileBasic({ avatarUrl: avatarInput.trim() });
    }
    setIsEditingAvatar(false);
  };

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty('--pointer-x', `${x}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}%`);
  };

  const handleHeroPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '50%');
    event.currentTarget.style.setProperty('--pointer-y', '0%');
  };

  return (
    <section
      id="home"
      className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden"
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
    >
      {/* Subtle ambient glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#00A8FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Text Column */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] mb-4 leading-tight">
              Hi, I'm{' '}
              <span className="text-[#38BDF8] drop-shadow-[0_0_25px_rgba(0,168,255,0.3)]">
                {profile.name}
              </span>
              .
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-medium text-[#38BDF8] mb-6 font-sans">
              {profile.subtitle}
            </h2>

            {/* Summary */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              {profile.summary}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-xs font-bold uppercase tracking-wider text-[#F8FAFC] bg-[#00A8FF] hover:bg-[#38BDF8] transition-all shadow-[0_0_20px_rgba(0,168,255,0.35)] hover:shadow-[0_0_30px_rgba(0,168,255,0.5)] transform hover:-translate-y-0.5"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-xs font-medium uppercase tracking-wider text-[#38BDF8] bg-[#0D1B2A]/80 hover:bg-[#101F33] border border-[#1E3A5F] hover:border-[#00A8FF]/50 transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-[#F8FAFC]" />
                <span>1-Page Resume</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-[#F8FAFC] bg-[#0D1B2A]/50 hover:bg-[#0D1B2A] border border-[#1E3A5F] transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </a>

              {isAdminLoggedIn && isEditModeActive && (
                <button
                  onClick={onOpenCMS}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-300 bg-[#0B1628]/40 border border-[#1E3A5F]/40 rounded-lg hover:bg-[#00A8FF]/40"
                  title="Edit Hero Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Hero</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hero Profile Image with Cyber Shield Frame */}
          <div className="flex flex-col items-center">
            {/* Hidden native file input for instant photo upload - Only active for Admin */}
            {isAdminLoggedIn && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            )}

            <div
              className={`relative group ${isAdminLoggedIn ? 'cursor-pointer' : ''} ${isDragging ? 'scale-105' : ''} transition-all duration-300`}
              onDragOver={isAdminLoggedIn ? handleDragOver : undefined}
              onDragLeave={isAdminLoggedIn ? handleDragLeave : undefined}
              onDrop={isAdminLoggedIn ? handleDrop : undefined}
              onClick={isAdminLoggedIn ? () => fileInputRef.current?.click() : undefined}
              title={isAdminLoggedIn ? "Click or drag & drop to upload your photo (Admin Access)" : profile.name}
            >
              {/* Glowing ring */}
              <div className="absolute -inset-1 rounded-full bg-[#00A8FF] opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />

              {/* Main Photo Container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-[3px] border-[#00A8FF] bg-[#0D1B2A] shadow-[0_0_30px_rgba(0,168,255,0.35)] group-hover:shadow-[0_0_45px_rgba(0,168,255,0.55)] transition-all duration-300">
                {displayAvatarUrl ? (
                  <>
                    <img
                      src={displayAvatarUrl}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                      onError={() => {
                        if (isAdminLoggedIn) {
                          updateProfileBasic({ avatarUrl: '' });
                        }
                      }}
                    />
                    {/* Hover upload overlay - Admin Only */}
                    {isAdminLoggedIn && (
                      <div className="absolute inset-0 bg-[#050B14]/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="w-8 h-8 text-[#F8FAFC] mb-2" />
                        <span className="font-mono text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
                          Change Photo
                        </span>
                        <span className="font-mono text-[10px] text-slate-300 mt-1">
                          Click or drop new image
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  /* High-Tech Cyber SOC Avatar Fallback */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#08131F]">
                    <div className="w-16 h-16 rounded-full bg-[#00A8FF]/15 border border-[#00A8FF]/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,168,255,0.25)] group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-[#F8FAFC]" />
                    </div>
                    <span className="font-heading font-bold text-[#F8FAFC] text-xl tracking-wider uppercase">
                      {profile.name}
                    </span>
                    {isAdminLoggedIn ? (
                      <>
                        <span className="font-mono text-xs font-semibold text-[#F8FAFC] mt-1 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Upload Your Photo
                        </span>
                        <span className="font-mono text-[10px] text-[#94A3B8] mt-1">
                          Drag & drop or click to browse
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-xs font-semibold text-[#38BDF8] mt-1">
                        Cybersecurity Operations
                      </span>
                    )}
                  </div>
                )}

                {/* Subtle cyber scanline */}
                <div className="absolute inset-0 bg-[#00A8FF]/5 pointer-events-none" />
              </div>

              {/* Status badge pill overlay */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#050B14]/95 border border-[#00A8FF]/60 shadow-[0_0_15px_rgba(0,168,255,0.3)] backdrop-blur-md flex items-center gap-2 whitespace-nowrap z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] font-semibold text-slate-200 tracking-wider uppercase">
                  {profile.siteSettings?.statusBadgeText || 'OPEN FOR SOC ROLES'}
                </span>
              </div>
            </div>

            {/* Photo Action Controls - Strictly Admin Only */}
            {isAdminLoggedIn && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00A8FF]/15 hover:bg-[#00A8FF]/25 border border-[#00A8FF]/40 text-[#F8FAFC] hover:text-[#F8FAFC] font-mono text-xs transition-all shadow-[0_0_15px_rgba(0,168,255,0.15)]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{profile.avatarUrl ? 'Change Photo' : 'Upload My Photo'}</span>
                  </button>

                  {profile.avatarUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProfileBasic({ avatarUrl: '' });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0B1628]/40 border border-[#1E3A5F] hover:border-[#1E3A5F]/40 text-[#94A3B8] hover:text-slate-300 text-xs font-mono transition-colors"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {uploadSuccess && (
                  <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Photo uploaded successfully!
                  </span>
                )}
              </div>
            )}

            {/* Quick Change Avatar URL Control for Admin */}
            {isAdminLoggedIn && isEditModeActive && (
              <div className="mt-3">
                {!isEditingAvatar ? (
                  <button
                    onClick={() => setIsEditingAvatar(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B1628] hover:bg-[#101F33] text-xs font-mono text-slate-300 rounded border border-slate-600"
                  >
                    <Edit3 className="w-3 h-3" /> Set Image via URL
                  </button>
                ) : (
                  <div className="flex gap-1.5 items-center mt-2 max-w-xs">
                    <input
                      type="text"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="Image URL..."
                      className="px-2 py-1 bg-[#050B14] border border-[#1E3A5F] rounded text-xs text-[#F8FAFC]"
                    />
                    <button
                      onClick={handleSaveAvatar}
                      className="p-1 bg-[#00A8FF] text-white rounded"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditingAvatar(false)}
                      className="p-1 bg-[#0B1628] text-[#94A3B8] rounded"
                      title="Cancel"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
