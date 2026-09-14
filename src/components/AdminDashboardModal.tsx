import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Download,
  Upload,
  RotateCcw,
  User,
  FolderGit2,
  Wrench,
  Briefcase,
  Trophy,
  Award,
  Shield,
  Key,
  ExternalLink,
  Globe,
  Type,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { Project, ExperienceItem, AchievementItem, CertificationItem, SkillCategory, ResumeSettings } from '../types/portfolio';
import { prepareImageForStorage } from '../utils/image';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume?: () => void;
  initialTab?: TabType;
}

export type TabType = 'profile' | 'projects' | 'skills' | 'experience' | 'achievements' | 'certifications' | 'leadership' | 'branding' | 'resume' | 'backup';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenResume,
  initialTab = 'profile'
}) => {
  const {
    profile,
    updateProfileBasic,
    updateSiteSettings,
    updateResumeSettings,
    updateContact,
    updateLeadership,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addCertification,
    updateCertification,
    deleteCertification,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    updateAdminCredentials,
    adminLogout,
    showToast,
    isEditModeActive,
    toggleEditMode
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form states for adding/editing items
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    projectNumber: 'PROJECT 0X',
    description: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<Partial<ExperienceItem>>({
    role: '',
    type: 'CYBERSECURITY',
    organization: '',
    dateRange: '',
    description: ''
  });

  const [editingAchId, setEditingAchId] = useState<string | null>(null);
  const [achForm, setAchForm] = useState<Partial<AchievementItem>>({
    awardEmoji: '🏆',
    title: '',
    organization: '',
    description: ''
  });

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<Partial<CertificationItem>>({
    title: '',
    issuer: '',
    issuedYear: new Date().getFullYear().toString(),
    credentialUrl: ''
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');

  // Handlers for Project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title?.trim()) return;

    if (editingProjectId) {
      updateProject(editingProjectId, projectForm);
      setEditingProjectId(null);
    } else {
      addProject({
        title: projectForm.title || 'New Project',
        projectNumber: projectForm.projectNumber || `PROJECT 0${profile.projects.length + 1}`,
        description: projectForm.description || '',
        tags: projectForm.tags || ['Cybersecurity'],
        featured: true
      });
    }
    setProjectForm({ title: '', projectNumber: '', description: '', tags: [] });
  };

  const handleStartEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm({ ...p });
  };

  // Handlers for Experience
  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.role?.trim()) return;

    if (editingExpId) {
      updateExperience(editingExpId, expForm);
      setEditingExpId(null);
    } else {
      addExperience({
        role: expForm.role || '',
        type: expForm.type || 'CYBERSECURITY',
        organization: expForm.organization || '',
        dateRange: expForm.dateRange || 'Present',
        description: expForm.description || ''
      });
    }
    setExpForm({ role: '', type: 'CYBERSECURITY', organization: '', dateRange: '', description: '' });
  };

  // Handlers for Achievement
  const handleSaveAch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achForm.title?.trim()) return;

    if (editingAchId) {
      updateAchievement(editingAchId, achForm);
      setEditingAchId(null);
    } else {
      addAchievement({
        awardEmoji: achForm.awardEmoji || '🏆',
        title: achForm.title || '',
        organization: achForm.organization || '',
        description: achForm.description || ''
      });
    }
    setAchForm({ awardEmoji: '🏆', title: '', organization: '', description: '' });
  };

  // Handlers for Certification
  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title?.trim()) return;

    if (editingCertId) {
      updateCertification(editingCertId, certForm);
      setEditingCertId(null);
    } else {
      addCertification({
        title: certForm.title || '',
        issuer: certForm.issuer || '',
        issuedYear: certForm.issuedYear || '2024',
        credentialUrl: certForm.credentialUrl || ''
      });
    }
    setCertForm({ title: '', issuer: '', issuedYear: '2024', credentialUrl: '' });
  };

  // Resume Settings Form state
  const [resumeForm, setResumeForm] = useState<Partial<ResumeSettings>>({
    uploadedResumeUrl: profile.resumeSettings?.uploadedResumeUrl || '',
    targetRole: profile.resumeSettings?.targetRole || profile.subtitle || '',
    summary: profile.resumeSettings?.summary || profile.summary || '',
    educationDegree: profile.resumeSettings?.educationDegree || profile.education || '',
    educationInstitution: profile.resumeSettings?.educationInstitution || 'RAMCO INSTITUTE OF TECHNOLOGY',
    educationSpecialization: profile.resumeSettings?.educationSpecialization || 'Specialization: Cybersecurity, Networking & Systems Engineering',
    educationGraduationYear: profile.resumeSettings?.educationGraduationYear || 'Graduation: 2029',
    showLeadership: profile.resumeSettings?.showLeadership !== false,
    showAchievements: profile.resumeSettings?.showAchievements !== false,
    showProjects: profile.resumeSettings?.showProjects !== false,
    showCertifications: profile.resumeSettings?.showCertifications !== false,
    maxProjectsCount: profile.resumeSettings?.maxProjectsCount || 3,
    customAtsKeywords: profile.resumeSettings?.customAtsKeywords || '',
    customFooterNote: profile.resumeSettings?.customFooterNote || ''
  });

  useEffect(() => {
    if (profile.resumeSettings) {
      setResumeForm({
        uploadedResumeUrl: profile.resumeSettings.uploadedResumeUrl ?? '',
        targetRole: profile.resumeSettings.targetRole ?? profile.subtitle ?? '',
        summary: profile.resumeSettings.summary ?? profile.summary ?? '',
        educationDegree: profile.resumeSettings.educationDegree ?? profile.education ?? '',
        educationInstitution: profile.resumeSettings.educationInstitution ?? 'RAMCO INSTITUTE OF TECHNOLOGY',
        educationSpecialization: profile.resumeSettings.educationSpecialization ?? 'Specialization: Cybersecurity, Networking & Systems Engineering',
        educationGraduationYear: profile.resumeSettings.educationGraduationYear ?? 'Graduation: 2029',
        showLeadership: profile.resumeSettings.showLeadership !== false,
        showAchievements: profile.resumeSettings.showAchievements !== false,
        showProjects: profile.resumeSettings.showProjects !== false,
        showCertifications: profile.resumeSettings.showCertifications !== false,
        maxProjectsCount: profile.resumeSettings.maxProjectsCount ?? 3,
        customAtsKeywords: profile.resumeSettings.customAtsKeywords ?? '',
        customFooterNote: profile.resumeSettings.customFooterNote ?? ''
      });
    }
  }, [profile.resumeSettings, profile.subtitle, profile.summary, profile.education]);

  if (!isOpen) return null;

  const handleSaveResume = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateResumeSettings(resumeForm);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF resume.', 'error');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showToast('Resume PDF must be smaller than 4 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setResumeForm((prev) => ({ ...prev, uploadedResumeUrl: reader.result as string }));
        showToast('Resume uploaded. Save Resume Settings to publish it.');
      }
    };
    reader.onerror = () => showToast('Unable to read the resume file.', 'error');
    reader.readAsDataURL(file);
  };

  // File import helper
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="admin-cms-dashboard" className="fixed inset-0 z-[9995] flex items-center justify-center p-3 md:p-6 bg-[#050B14]/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#050B14] border border-[#1E3A5F] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F8FAFC]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E3A5F] bg-[#050B14]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00A8FF]/10 text-[#F8FAFC] border border-[#00A8FF]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg md:text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
                Portfolio CMS Studio
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00A8FF]/20 text-[#38BDF8] border border-[#00A8FF]/40">
                  CRUD CONTROL ACTIVE
                </span>
              </h2>
              <p className="text-xs font-mono text-[#94A3B8]">
                Real-time add, update, view, and delete your profile content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenResume && (
              <button
                id="cms-open-resume-btn"
                onClick={() => {
                  onClose();
                  onOpenResume();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D1B2A] hover:bg-[#101F33] text-slate-300 border border-[#1E3A5F] text-xs font-mono rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View 1-Page Resume
              </button>
            )}

            <button
              id="cms-toggle-edit-mode"
              onClick={toggleEditMode}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                isEditModeActive
                  ? 'bg-[#0B1628]/60 text-slate-300 border-[#1E3A5F]/50'
                  : 'bg-[#0B1628] text-[#94A3B8] border-[#1E3A5F]'
              }`}
            >
              Inline Edits: {isEditModeActive ? 'ON' : 'OFF'}
            </button>

            <button
              id="cms-logout-btn"
              onClick={() => {
                adminLogout();
                onClose();
              }}
              className="px-3 py-1.5 bg-[#0B1628]/40 hover:bg-[#00A8FF]/60 text-slate-300 border border-slate-700/40 text-xs font-mono rounded-lg transition-colors"
            >
              Logout
            </button>

            <button
              id="cms-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0B1628] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-[#1E3A5F] bg-[#0B1628] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'profile' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile & Bio
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'projects' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" /> Projects ({profile.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'skills' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Skills ({profile.skills.length})
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'experience' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Experience ({profile.experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'achievements' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Achievements ({profile.achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'certifications' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Certifications ({profile.certifications.length})
          </button>
          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'leadership' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> NCC Leadership
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'branding' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Titles & Branding
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'resume' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resume Studio
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'backup' ? 'bg-[#00A8FF] text-white font-semibold' : 'text-slate-300 hover:bg-[#0B1628]'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Settings & Backup
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfileBasic({ name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Professional Subtitle / Role</label>
                  <input
                    type="text"
                    value={profile.subtitle}
                    onChange={(e) => updateProfileBasic({ subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Hero Intro Summary</label>
                  <textarea
                    rows={2}
                    value={profile.summary}
                    onChange={(e) => updateProfileBasic({ summary: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Profile Photo (Upload or URL)</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={profile.avatarUrl.startsWith('data:') ? 'Custom Uploaded Photo (Active)' : profile.avatarUrl}
                      onChange={(e) => updateProfileBasic({ avatarUrl: e.target.value })}
                      placeholder="Photo URL or Data URI"
                      className="flex-1 min-w-[200px] px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#00A8FF] shrink-0"
                        onError={() => updateProfileBasic({ avatarUrl: '' })}
                      />
                    ) : (
                      <img
                        src="/profile.png"
                        alt="Default profile preview"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#1E3A5F] shrink-0"
                      />
                    )}
                    <label className="px-3 py-2 rounded bg-[#00A8FF]/40 hover:bg-slate-800/50 text-[#F8FAFC] text-xs font-mono border border-[#00A8FF]/40 cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            prepareImageForStorage(file)
                              .then((res) => updateProfileBasic({ avatarUrl: res }))
                              .catch(() => undefined);
                          }
                        }}
                      />
                    </label>
                    {profile.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => updateProfileBasic({ avatarUrl: '' })}
                        className="px-2.5 py-2 rounded bg-[#0B1628] hover:bg-[#00A8FF]/40 text-[#94A3B8] hover:text-slate-300 text-xs font-mono border border-[#1E3A5F] shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-mono mt-1">
                    Upload your profile portrait image directly or specify an image URL.
                  </p>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-4">
                <h4 className="font-heading font-semibold text-slate-400 text-sm">Key Facts (About Cards)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Education</label>
                    <input
                      type="text"
                      value={profile.education}
                      onChange={(e) => updateProfileBasic({ education: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Career Goal</label>
                    <input
                      type="text"
                      value={profile.careerGoal}
                      onChange={(e) => updateProfileBasic({ careerGoal: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Interests</label>
                    <input
                      type="text"
                      value={profile.interests}
                      onChange={(e) => updateProfileBasic({ interests: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Activities</label>
                    <input
                      type="text"
                      value={profile.activities}
                      onChange={(e) => updateProfileBasic({ activities: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>
              </div>

              {/* About Paragraphs */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm">About Me Narrative Paragraphs</h4>
                {profile.aboutParagraphs.map((para, idx) => (
                  <div key={idx} className="flex gap-2">
                    <textarea
                      rows={2}
                      value={para}
                      onChange={(e) => {
                        const newParas = [...profile.aboutParagraphs];
                        newParas[idx] = e.target.value;
                        updateProfileBasic({ aboutParagraphs: newParas });
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                    <button
                      onClick={() => {
                        const newParas = profile.aboutParagraphs.filter((_, i) => i !== idx);
                        updateProfileBasic({ aboutParagraphs: newParas });
                      }}
                      className="p-2 text-slate-400 hover:text-slate-300 hover:bg-[#0B1628]/40 rounded self-start"
                      title="Delete Paragraph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateProfileBasic({
                      aboutParagraphs: [...profile.aboutParagraphs, 'New paragraph content about your cybersecurity journey...']
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#38BDF8] hover:text-[#F8FAFC]"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Paragraph
                </button>
              </div>

              {/* Contact Links */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm">Contact & Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.contact.email}
                      onChange={(e) => updateContact({ email: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.contact.linkedin}
                      onChange={(e) => updateContact({ linkedin: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={profile.contact.github}
                      onChange={(e) => updateContact({ github: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.contact.location || ''}
                      onChange={(e) => updateContact({ location: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={profile.contact.phone || ''}
                      placeholder="+91 98765 43210"
                      onChange={(e) => updateContact({ phone: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">TryHackMe Profile URL</label>
                    <input
                      type="text"
                      value={profile.contact.tryhackme || ''}
                      placeholder="https://tryhackme.com/p/tamilarasan"
                      onChange={(e) => updateContact({ tryhackme: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Add / Edit Form */}
              <form onSubmit={handleSaveProject} className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm flex items-center justify-between">
                  <span>{editingProjectId ? 'Edit Project' : 'Add New Project'}</span>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({ title: '', projectNumber: '', description: '', tags: [] });
                      }}
                      className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Cancel Edit
                    </button>
                  )}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Badge (e.g. PROJECT 01)</label>
                    <input
                      type="text"
                      value={projectForm.projectNumber || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, projectNumber: e.target.value })}
                      placeholder="PROJECT 01"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Smart Water Hygiene Tracker by Camera"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Project Description</label>
                    <textarea
                      rows={2}
                      required
                      value={projectForm.description || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="To analyse unnecessary objects like insects, bacteria, weed etc. in Domestic water tank..."
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Tech Tags (comma separated)</label>
                    <input
                      type="text"
                      value={projectForm.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                        setProjectForm({ ...projectForm, tags });
                      }}
                      placeholder="IoT, Embedded Systems, Computer Vision, Safety"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC] font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingProjectId ? 'Update Project' : 'Add Project to Portfolio'}
                </button>
              </form>

              {/* Projects List */}
              <div className="space-y-3">
                <h4 className="font-heading font-semibold text-[#F8FAFC] text-sm">Existing Projects ({profile.projects.length})</h4>
                {profile.projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#F8FAFC] font-semibold">{p.projectNumber}</span>
                        <h5 className="font-heading font-bold text-[#F8FAFC] text-base">{p.title}</h5>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#1E3A5F]/60 text-slate-300 text-[10px] font-mono">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleStartEditProject(p)}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] hover:text-white text-slate-300 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete project "${p.title}"?`)) {
                            deleteProject(p.id);
                          }
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] text-slate-300 hover:text-[#F8FAFC] transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS CRUD */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Add New Category */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">New Category Name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Cloud Security & SIEM"
                    className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                  />
                </div>
                <button
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      addSkillCategory({ category: newCategoryName.trim(), skills: ['Initial Skill'] });
                      setNewCategoryName('');
                    }
                  }}
                  className="px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
              </div>

              {/* Categories list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
                        className="font-heading font-semibold text-[#F8FAFC] text-base bg-transparent border-b border-transparent hover:border-[#1E3A5F] focus:border-[#00A8FF] focus:outline-none px-1"
                      />
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.category}"?`)) {
                            deleteSkillCategory(cat.id);
                          }
                        }}
                        className="text-[#94A3B8] hover:text-slate-400 p-1"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Skill tags list */}
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#050B14] border border-[#1E3A5F] text-xs font-mono text-slate-200"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              const updatedSkills = cat.skills.filter((_, i) => i !== sIdx);
                              updateSkillCategory(cat.id, { skills: updatedSkills });
                            }}
                            className="text-[#94A3B8] hover:text-slate-400 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Quick add skill */}
                    <div className="flex gap-2 pt-2 border-t border-[#1E3A5F]/40">
                      <input
                        type="text"
                        value={newSkillInput[cat.id] || ''}
                        onChange={(e) => setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (newSkillInput[cat.id] || '').trim();
                            if (val) {
                              updateSkillCategory(cat.id, { skills: [...cat.skills, val] });
                              setNewSkillInput({ ...newSkillInput, [cat.id]: '' });
                            }
                          }
                        }}
                        placeholder="Add skill (press Enter)..."
                        className="flex-1 px-2.5 py-1 bg-[#050B14] border border-[#1E3A5F] rounded text-xs text-[#F8FAFC]"
                      />
                      <button
                        onClick={() => {
                          const val = (newSkillInput[cat.id] || '').trim();
                          if (val) {
                            updateSkillCategory(cat.id, { skills: [...cat.skills, val] });
                            setNewSkillInput({ ...newSkillInput, [cat.id]: '' });
                          }
                        }}
                        className="px-2.5 py-1 bg-[#0B1628] hover:bg-[#00A8FF] hover:text-white text-xs font-mono rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE CRUD */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {/* Add / Edit Experience */}
              <form onSubmit={handleSaveExp} className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm flex items-center justify-between">
                  <span>{editingExpId ? 'Edit Experience' : 'Add Experience / Activity'}</span>
                  {editingExpId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExpId(null);
                        setExpForm({ role: '', type: '', organization: '', dateRange: '', description: '' });
                      }}
                      className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Cancel Edit
                    </button>
                  )}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Type Tag (e.g. CYBERSECURITY INTERNSHIP)</label>
                    <input
                      type="text"
                      value={expForm.type || ''}
                      onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                      placeholder="CYBERSECURITY INTERNSHIP"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Role Title</label>
                    <input
                      type="text"
                      required
                      value={expForm.role || ''}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      placeholder="e.g. Cybersecurity & Ethical Hacking Intern"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Organization / Platform</label>
                    <input
                      type="text"
                      value={expForm.organization || ''}
                      onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                      placeholder="e.g. Supraja Technologies"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Date Range</label>
                    <input
                      type="text"
                      value={expForm.dateRange || ''}
                      onChange={(e) => setExpForm({ ...expForm, dateRange: e.target.value })}
                      placeholder="e.g. 2024 - 2025"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={expForm.description || ''}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      placeholder="Internship experience focused on security tools, vulnerability assessment..."
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingExpId ? 'Update Experience' : 'Add Experience Entry'}
                </button>
              </form>

              {/* Experience list */}
              <div className="space-y-3">
                {profile.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#F8FAFC]">{exp.type}</span>
                        {exp.dateRange && <span className="font-mono text-xs text-[#94A3B8]">• {exp.dateRange}</span>}
                      </div>
                      <h5 className="font-heading font-bold text-[#F8FAFC] text-base">
                        {exp.role} {exp.organization && <span className="font-normal text-[#94A3B8]">at {exp.organization}</span>}
                      </h5>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{exp.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingExpId(exp.id);
                          setExpForm({ ...exp });
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] hover:text-white text-slate-300 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete experience item "${exp.role}"?`)) {
                            deleteExperience(exp.id);
                          }
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] text-slate-300 hover:text-[#F8FAFC] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACHIEVEMENTS CRUD */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveAch} className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm">
                  {editingAchId ? 'Edit Achievement' : 'Add New Achievement'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Award Emoji</label>
                    <input
                      type="text"
                      value={achForm.awardEmoji || '🥇'}
                      onChange={(e) => setAchForm({ ...achForm, awardEmoji: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC] font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={achForm.title || ''}
                      onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                      placeholder="e.g. Cipher Carnival CTF - 1st Prize"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Organization / Event</label>
                    <input
                      type="text"
                      value={achForm.organization || ''}
                      onChange={(e) => setAchForm({ ...achForm, organization: e.target.value })}
                      placeholder="e.g. Cybersecurity Fest"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Description</label>
                    <input
                      type="text"
                      value={achForm.description || ''}
                      onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                      placeholder="Secured 1st Prize in Cipher Carnival Capture The Flag competition."
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingAchId ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{ach.awardEmoji}</span>
                      <div className="space-y-1">
                        <h5 className="font-heading font-bold text-[#F8FAFC] text-sm">{ach.title}</h5>
                        {ach.organization && <p className="font-mono text-[11px] text-[#F8FAFC]">{ach.organization}</p>}
                        <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingAchId(ach.id);
                          setAchForm({ ...ach });
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] hover:text-white text-slate-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete achievement "${ach.title}"?`)) {
                            deleteAchievement(ach.id);
                          }
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] text-slate-300 hover:text-[#F8FAFC]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATIONS CRUD */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveCert} className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm">
                  {editingCertId ? 'Edit Certification' : 'Add New Certification'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Certification Name</label>
                    <input
                      type="text"
                      required
                      value={certForm.title || ''}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      placeholder="e.g. Junior Cybersecurity Analyst"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Issuing Body / Authority</label>
                    <input
                      type="text"
                      required
                      value={certForm.issuer || ''}
                      onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                      placeholder="e.g. Cisco Networking Academy"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Year</label>
                    <input
                      type="text"
                      value={certForm.issuedYear || ''}
                      onChange={(e) => setCertForm({ ...certForm, issuedYear: e.target.value })}
                      placeholder="2024"
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingCertId ? 'Update Certification' : 'Add Certification'}
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.certifications.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] flex items-start justify-between gap-3"
                  >
                    <div>
                      <h5 className="font-heading font-bold text-[#F8FAFC] text-sm">{c.issuer}</h5>
                      <p className="font-mono text-xs text-[#F8FAFC] mt-0.5">{c.title}</p>
                      {c.issuedYear && <span className="font-mono text-[10px] text-[#94A3B8]">Year: {c.issuedYear}</span>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCertId(c.id);
                          setCertForm({ ...c });
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] hover:text-white text-slate-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete certification "${c.title}"?`)) {
                            deleteCertification(c.id);
                          }
                        }}
                        className="p-1.5 rounded bg-[#0B1628] hover:bg-[#00A8FF] text-slate-300 hover:text-[#F8FAFC]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: LEADERSHIP & NCC */}
          {activeTab === 'leadership' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-slate-400 text-sm">NCC & Leadership Details</h4>
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Section Title</label>
                  <input
                    type="text"
                    value={profile.leadership.title}
                    onChange={(e) => updateLeadership({ title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Role & Cadre</label>
                  <input
                    type="text"
                    value={profile.leadership.role}
                    onChange={(e) => updateLeadership({ role: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Key Leadership Metric / Stat</label>
                  <input
                    type="text"
                    value={profile.leadership.stats || ''}
                    onChange={(e) => updateLeadership({ stats: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Leadership Narrative</label>
                  <textarea
                    rows={4}
                    value={profile.leadership.description}
                    onChange={(e) => updateLeadership({ description: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: TITLES & BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-6 max-w-3xl">
              {/* Brand & Navbar */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-4">
                <h4 className="font-heading font-semibold text-slate-400 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#F8FAFC]" /> Brand & Navigation Bar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Brand Logo / Header Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.brandTitle || ''}
                      placeholder={profile.name.toUpperCase()}
                      onChange={(e) => updateSiteSettings({ brandTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Header Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.brandSubtitle || ''}
                      placeholder="SOC OPERATIONS • BLUE TEAM"
                      onChange={(e) => updateSiteSettings({ brandSubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Profile Photo Overlay Badge</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.statusBadgeText || ''}
                      placeholder="OPEN FOR SOC ROLES"
                      onChange={(e) => updateSiteSettings({ statusBadgeText: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section Titles & Subtitles */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-4">
                <h4 className="font-heading font-semibold text-slate-400 text-sm flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#F8FAFC]" /> Section Titles & Subtitles
                </h4>
                
                {/* About */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">01 — About Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.aboutTitle || ''}
                      placeholder="Who I Am"
                      onChange={(e) => updateSiteSettings({ aboutTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">About Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.aboutSubtitle || ''}
                      placeholder="A technology enthusiast building practical cybersecurity and defensive operations skills."
                      onChange={(e) => updateSiteSettings({ aboutSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">02 — Skills Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.skillsTitle || ''}
                      placeholder="Technical Arsenal"
                      onChange={(e) => updateSiteSettings({ skillsTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Skills Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.skillsSubtitle || ''}
                      placeholder="Technologies, analytical tools, and cybersecurity domains I actively operate and study."
                      onChange={(e) => updateSiteSettings({ skillsSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Projects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">03 — Projects Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.projectsTitle || ''}
                      placeholder="Featured Projects"
                      onChange={(e) => updateSiteSettings({ projectsTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Projects Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.projectsSubtitle || ''}
                      placeholder="Practical hardware, network defense, and applied cybersecurity initiatives."
                      onChange={(e) => updateSiteSettings({ projectsSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">04 — Experience Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.experienceTitle || ''}
                      placeholder="Professional Journey"
                      onChange={(e) => updateSiteSettings({ experienceTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Experience Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.experienceSubtitle || ''}
                      placeholder="Internships, tactical simulations, and specialized cybersecurity hands-on exposure."
                      onChange={(e) => updateSiteSettings({ experienceSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">05 — Achievements Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.achievementsTitle || ''}
                      placeholder="Key Achievements"
                      onChange={(e) => updateSiteSettings({ achievementsTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Achievements Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.achievementsSubtitle || ''}
                      placeholder="Recognitions earned in Capture The Flag competitions, symposiums, and leadership camps."
                      onChange={(e) => updateSiteSettings({ achievementsSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">06 — Certifications Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.certificationsTitle || ''}
                      placeholder="Certifications & Training"
                      onChange={(e) => updateSiteSettings({ certificationsTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Certifications Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.certificationsSubtitle || ''}
                      placeholder="Verified certifications in cybersecurity, python, defensive techniques, and corporate readiness."
                      onChange={(e) => updateSiteSettings({ certificationsSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Leadership */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">07 — Leadership Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.leadershipTitle || ''}
                      placeholder="NCC & Leadership"
                      onChange={(e) => updateSiteSettings({ leadershipTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-[#1E3A5F]/60">
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">08 — Contact Section Title</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.contactTitle || ''}
                      placeholder="Let's Connect"
                      onChange={(e) => updateSiteSettings({ contactTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#94A3B8] mb-1">Contact Section Subtitle</label>
                    <input
                      type="text"
                      value={profile.siteSettings?.contactSubtitle || ''}
                      placeholder="I'm actively seeking cybersecurity internships, SOC Analyst entry roles..."
                      onChange={(e) => updateSiteSettings({ contactSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] mb-1">Footer Tagline & Note</label>
                  <input
                    type="text"
                    value={profile.siteSettings?.footerText || ''}
                    placeholder="Dedicated to defensive security operations, threat hunting, and infrastructure protection."
                    onChange={(e) => updateSiteSettings({ footerText: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded-md text-sm text-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESUME STUDIO (FULL ADMIN CONTROL OVER RESUME) */}
          {activeTab === 'resume' && (
            <div className="space-y-6 max-w-4xl">
              {/* Header & Quick Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F]">
                <div>
                  <h3 className="font-heading font-bold text-[#F8FAFC] text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#F8FAFC]" /> One-Page Resume CMS & ATS Studio
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Manage all resume content, ATS keywords, education credentials, and print layout options directly from Admin.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenResume && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenResume();
                      }}
                      className="px-3.5 py-1.5 bg-[#0B1628] hover:bg-[#101F33] text-slate-300 border border-slate-600 font-mono text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview Resume
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSaveResume()}
                    className="px-4 py-1.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold font-mono text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Resume Settings
                  </button>
                </div>
              </div>

              {/* Form Container */}
              <form onSubmit={handleSaveResume} className="space-y-5">
                <div className="p-5 rounded-xl bg-[#0D1B2A]/70 border border-[#1E3A5F] space-y-3">
                  <h4 className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Resume PDF
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Upload a PDF to show as your public resume. Maximum file size: 4 MB.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-3 py-2 rounded bg-[#00A8FF]/40 hover:bg-slate-800/50 text-[#F8FAFC] text-xs font-mono border border-[#00A8FF]/40 cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Choose PDF
                      <input type="file" accept="application/pdf,.pdf" onChange={handleResumeUpload} className="hidden" />
                    </label>
                    {resumeForm.uploadedResumeUrl && (
                      <button
                        type="button"
                        onClick={() => setResumeForm((prev) => ({ ...prev, uploadedResumeUrl: '' }))}
                        className="px-3 py-2 rounded bg-[#0B1628]/40 hover:bg-[#00A8FF]/50 text-slate-300 text-xs font-mono border border-[#1E3A5F]/30"
                      >
                        Remove Uploaded Resume
                      </button>
                    )}
                    <span className="text-xs font-mono text-slate-300">
                      {resumeForm.uploadedResumeUrl ? 'PDF selected' : 'No PDF selected'}
                    </span>
                  </div>
                </div>
                {/* Section 1: Target Role & ATS Summary */}
                <div className="p-5 rounded-xl bg-[#0D1B2A]/70 border border-[#1E3A5F] space-y-4">
                  <h4 className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 1. Target Role & Professional Summary
                  </h4>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Resume Target Role / Subtitle
                    </label>
                    <input
                      type="text"
                      value={resumeForm.targetRole || ''}
                      placeholder="Aspiring SOC Analyst & Cybersecurity Professional"
                      onChange={(e) => setResumeForm({ ...resumeForm, targetRole: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                    <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                      Displays prominently beneath your name on the resume header.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Professional Summary (ATS Tailored)
                    </label>
                    <textarea
                      rows={4}
                      value={resumeForm.summary || ''}
                      placeholder="Write your high-impact professional overview here..."
                      onChange={(e) => setResumeForm({ ...resumeForm, summary: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none leading-relaxed"
                    />
                    <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                      Character count: {resumeForm.summary?.length || 0} characters. Keep between 250-450 characters for clean 1-page fit.
                    </span>
                  </div>
                </div>

                {/* Section 2: Education Details */}
                <div className="p-5 rounded-xl bg-[#0D1B2A]/70 border border-[#1E3A5F] space-y-4">
                  <h4 className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> 2. Education Credentials
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Degree</label>
                      <input
                        type="text"
                        value={resumeForm.educationDegree || ''}
                        placeholder="B.Tech Information Technology"
                        onChange={(e) => setResumeForm({ ...resumeForm, educationDegree: e.target.value })}
                        className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">College / University</label>
                      <input
                        type="text"
                        value={resumeForm.educationInstitution || ''}
                        placeholder="Sri Sairam Engineering College"
                        onChange={(e) => setResumeForm({ ...resumeForm, educationInstitution: e.target.value })}
                        className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Specialization / Coursework</label>
                      <input
                        type="text"
                        value={resumeForm.educationSpecialization || ''}
                        placeholder="Specialization: Cybersecurity, Networking & Systems Engineering"
                        onChange={(e) => setResumeForm({ ...resumeForm, educationSpecialization: e.target.value })}
                        className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Graduation Year / Timeline</label>
                      <input
                        type="text"
                        value={resumeForm.educationGraduationYear || ''}
                        placeholder="Graduation: 2026"
                        onChange={(e) => setResumeForm({ ...resumeForm, educationGraduationYear: e.target.value })}
                        className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: One-Page Layout & Section Toggles */}
                <div className="p-5 rounded-xl bg-[#0D1B2A]/70 border border-[#1E3A5F] space-y-4">
                  <h4 className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> 3. 1-Page Layout & Section Display Toggles
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F]/70 cursor-pointer hover:border-[#00A8FF]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resumeForm.showProjects !== false}
                        onChange={(e) => setResumeForm({ ...resumeForm, showProjects: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F8FAFC] bg-[#050B14] border-[#1E3A5F] focus:ring-[#00A8FF]"
                      />
                      <div>
                        <span className="text-sm text-[#F8FAFC] font-medium block">Show Projects Section</span>
                        <span className="text-xs text-[#94A3B8]">Display hands-on technical initiatives</span>
                      </div>
                    </label>

                    <div className="p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F]/70">
                      <label className="text-xs font-mono text-slate-300 block mb-1">Max Projects on Resume</label>
                      <select
                        value={resumeForm.maxProjectsCount || 3}
                        onChange={(e) => setResumeForm({ ...resumeForm, maxProjectsCount: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC] focus:outline-none"
                      >
                        <option value={1}>Top 1 Project (Maximum compact)</option>
                        <option value={2}>Top 2 Projects (Recommended for 1 page)</option>
                        <option value={3}>Top 3 Projects (Standard)</option>
                        <option value={10}>All Projects</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F]/70 cursor-pointer hover:border-[#00A8FF]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resumeForm.showAchievements !== false}
                        onChange={(e) => setResumeForm({ ...resumeForm, showAchievements: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F8FAFC] bg-[#050B14] border-[#1E3A5F] focus:ring-[#00A8FF]"
                      />
                      <div>
                        <span className="text-sm text-[#F8FAFC] font-medium block">Show Honors & CTF Achievements</span>
                        <span className="text-xs text-[#94A3B8]">Include symposium and competition awards</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F]/70 cursor-pointer hover:border-[#00A8FF]/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={resumeForm.showCertifications !== false}
                        onChange={(e) => setResumeForm({ ...resumeForm, showCertifications: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F8FAFC] bg-[#050B14] border-[#1E3A5F] focus:ring-[#00A8FF]"
                      />
                      <div>
                        <span className="text-sm text-[#F8FAFC] font-medium block">Show Certifications</span>
                        <span className="text-xs text-[#94A3B8]">Include industry & academic certifications</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#050B14] border border-[#1E3A5F]/70 cursor-pointer hover:border-[#00A8FF]/50 transition-colors sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={resumeForm.showLeadership !== false}
                        onChange={(e) => setResumeForm({ ...resumeForm, showLeadership: e.target.checked })}
                        className="w-4 h-4 rounded text-[#F8FAFC] bg-[#050B14] border-[#1E3A5F] focus:ring-[#00A8FF]"
                      />
                      <div>
                        <span className="text-sm text-[#F8FAFC] font-medium block">Show Leadership (NCC Cadet & Company Captain)</span>
                        <span className="text-xs text-[#94A3B8]">Highlight discipline, troop command, and teamwork capabilities</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 4: ATS Keywords & Footer Notes */}
                <div className="p-5 rounded-xl bg-[#0D1B2A]/70 border border-[#1E3A5F] space-y-4">
                  <h4 className="font-mono text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> 4. ATS Keywords & Availability Note
                  </h4>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      ATS Keywords & Core Competencies Highlight
                    </label>
                    <input
                      type="text"
                      value={resumeForm.customAtsKeywords || ''}
                      placeholder="SIEM, SOC Analysis, Wireshark, Nmap, Kali Linux, Incident Triage, Log Analysis"
                      onChange={(e) => setResumeForm({ ...resumeForm, customAtsKeywords: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                    <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                      Comma-separated list displayed in the technical competencies row of your ATS resume.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Availability / Custom Footer Note
                    </label>
                    <input
                      type="text"
                      value={resumeForm.customFooterNote || ''}
                      placeholder="Available for SOC Analyst Internships & Entry-Level Blue Team Roles."
                      onChange={(e) => setResumeForm({ ...resumeForm, customFooterNote: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050B14] border border-[#1E3A5F] rounded-lg text-sm text-[#F8FAFC] focus:border-[#00A8FF] focus:outline-none"
                    />
                    <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                      Appears in fine italic text at the bottom of the one-page resume.
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8] font-mono">Source data shortcuts:</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-mono text-[#F8FAFC] hover:underline"
                    >
                      Projects
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('experience')}
                      className="text-xs font-mono text-[#F8FAFC] hover:underline"
                    >
                      Experience
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('skills')}
                      className="text-xs font-mono text-[#F8FAFC] hover:underline"
                    >
                      Skills
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('certifications')}
                      className="text-xs font-mono text-[#F8FAFC] hover:underline"
                    >
                      Certifications
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold font-mono text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-[#00A8FF]/20 transition-all"
                  >
                    <Check className="w-4 h-4" /> Save All Resume Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: SETTINGS & BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              {/* Change Admin Credentials */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-[#F8FAFC] text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#F8FAFC]" /> Change Admin Credentials
                </h4>
                <p className="text-xs text-slate-300">
                  Update the username and password used to access the admin dashboard.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC] font-mono"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 12 chars)"
                    className="flex-1 px-3 py-1.5 bg-[#050B14] border border-[#1E3A5F] rounded text-sm text-[#F8FAFC] font-mono"
                  />
                  <button
                    onClick={() => {
                      updateAdminCredentials(newUsername, newPassword);
                      setNewUsername('');
                      setNewPassword('');
                    }}
                    className="sm:col-span-2 px-4 py-1.5 bg-[#00A8FF] hover:bg-[#38BDF8] text-white font-semibold text-xs font-mono rounded"
                  >
                    Save Credentials
                  </button>
                </div>
              </div>

              {/* Data Backup & Restore */}
              <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#1E3A5F] space-y-3">
                <h4 className="font-heading font-semibold text-[#F8FAFC] text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#F8FAFC]" /> Export & Import Portfolio JSON
                </h4>
                <p className="text-xs text-slate-300">
                  Safely download your complete profile state as a JSON file, or restore from a previously exported backup.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={exportDataJSON}
                    className="px-4 py-2 bg-[#0B1628] hover:bg-[#101F33] text-slate-300 border border-[#1E3A5F] font-mono text-xs rounded-lg flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Backup JSON
                  </button>
                  <label className="px-4 py-2 bg-[#0B1628] hover:bg-[#101F33] text-slate-300 border border-[#1E3A5F] font-mono text-xs rounded-lg flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" /> Restore Backup JSON
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Factory Reset */}
              <div className="p-4 rounded-xl bg-[#0B1628]/20 border border-[#00A8FF]/40 space-y-3">
                <h4 className="font-heading font-semibold text-slate-300 text-sm flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-slate-400" /> Factory Reset Content
                </h4>
                <p className="text-xs text-slate-200/80">
                  Reset all portfolio text, skills, and projects back to Tamilarasan's original cybersecurity default dataset.
                </p>
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 bg-[#00A8FF]/50 hover:bg-slate-800 text-slate-100 border border-slate-700/50 font-mono text-xs rounded-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset to Original Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-[#1E3A5F] bg-[#050B14] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>CMS Status: Connected • All edits auto-saved to persistent storage</span>
          <span className="text-[#38BDF8]">Live preview updates instantly</span>
        </div>
      </div>
    </div>
  );
};
