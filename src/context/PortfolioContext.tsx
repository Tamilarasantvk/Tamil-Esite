import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioProfile,
  Project,
  ExperienceItem,
  AchievementItem,
  CertificationItem,
  SkillCategory,
  LeadershipItem,
  ContactInfo,
  SiteSettings,
  ResumeSettings
} from '../types/portfolio';
import { initialPortfolioData } from '../data/defaultData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface PortfolioContextType {
  profile: PortfolioProfile;
  isAdminLoggedIn: boolean;
  isEditModeActive: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  // Auth
  adminLogin: (user: string, pass: string) => Promise<boolean>;
  requestPasswordReset: (user: string) => Promise<boolean>;
  resetAdminPassword: (token: string, pass: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  toggleEditMode: () => void;
  updateAdminCredentials: (newUser: string, newPass: string) => Promise<void>;
  // Profile
  updateProfileBasic: (data: Partial<PortfolioProfile>) => void;
  updateSiteSettings: (data: Partial<SiteSettings>) => void;
  updateResumeSettings: (data: Partial<ResumeSettings>) => void;
  updateContact: (data: Partial<ContactInfo>) => void;
  updateLeadership: (data: Partial<LeadershipItem>) => void;
  // Projects CRUD
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Experience CRUD
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  // Achievement CRUD
  addAchievement: (ach: Omit<AchievementItem, 'id'>) => void;
  updateAchievement: (id: string, ach: Partial<AchievementItem>) => void;
  deleteAchievement: (id: string) => void;
  // Certification CRUD
  addCertification: (cert: Omit<CertificationItem, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<CertificationItem>) => void;
  deleteCertification: (id: string) => void;
  // Skills CRUD
  addSkillCategory: (cat: Omit<SkillCategory, 'id'>) => void;
  updateSkillCategory: (id: string, cat: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;
  // Data backup
  resetToDefaults: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'soc_portfolio_data_v6';
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const normalizePortfolioData = (data: Partial<PortfolioProfile>): PortfolioProfile => ({
  ...initialPortfolioData,
  ...data,
  aboutParagraphs: Array.isArray(data.aboutParagraphs) ? data.aboutParagraphs : initialPortfolioData.aboutParagraphs,
  skills: Array.isArray(data.skills) ? data.skills : initialPortfolioData.skills,
  projects: Array.isArray(data.projects) ? data.projects : initialPortfolioData.projects,
  experiences: Array.isArray(data.experiences) ? data.experiences : initialPortfolioData.experiences,
  achievements: Array.isArray(data.achievements) ? data.achievements : initialPortfolioData.achievements,
  certifications: Array.isArray(data.certifications) ? data.certifications : initialPortfolioData.certifications,
  contact: { ...initialPortfolioData.contact, ...(data.contact || {}) },
  leadership: { ...initialPortfolioData.leadership, ...(data.leadership || {}) },
  siteSettings: { ...initialPortfolioData.siteSettings, ...(data.siteSettings || {}) },
  resumeSettings: { ...initialPortfolioData.resumeSettings, ...(data.resumeSettings || {}) }
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PortfolioProfile>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('soc_portfolio_data_v5') ||
        localStorage.getItem('soc_portfolio_data_v4') ||
        localStorage.getItem('soc_portfolio_data_v3') ||
        localStorage.getItem('soc_portfolio_data_v2') ||
        localStorage.getItem('soc_portfolio_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Tamilarasan') {
          parsed.name = 'Tamilarasan P';
        }
        // Clear known placeholder URLs while preserving uploaded images.
        if (!parsed.avatarUrl || parsed.avatarUrl.includes('unsplash.com') || parsed.avatarUrl === '/profile.jpg' || parsed.avatarUrl.includes('proffessional')) {
          parsed.avatarUrl = '';
        }
        parsed.tagline = '';
        parsed.siteSettings = {
          ...initialPortfolioData.siteSettings,
          ...(parsed.siteSettings || {})
        };
        parsed.resumeSettings = {
          ...initialPortfolioData.resumeSettings,
          ...(parsed.resumeSettings || {})
        };
        return normalizePortfolioData(parsed);
      }
    } catch {
      // Fallback
    }
    return { ...initialPortfolioData, avatarUrl: '', tagline: '' };
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then((response) => {
        if (response.ok) setIsAdminLoggedIn(true);
      })
      .catch(() => undefined);
  }, []);

  // Guard helper: enforce admin access on all mutations
  const requireAdmin = (): boolean => {
    if (!isAdminLoggedIn) {
      showToast('Admin access required. Please log in with admin password to modify portfolio.', 'error');
      return false;
    }
    return true;
  };

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [profile]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Functions
  const adminLogin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      if (response.ok) {
        setIsAdminLoggedIn(true);
        showToast('Welcome back, Admin! Live CRUD controls activated.', 'success');
        return true;
      }
      if (response.status !== 401) {
        showToast('CMS authentication service is unavailable. Start the API server and try again.', 'error');
        return false;
      }
    } catch {
      showToast('CMS authentication service is unavailable.', 'error');
      return false;
    }
    showToast('Invalid admin credentials. Please verify your login details.', 'error');
    return false;
  };

  const adminLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined);
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin mode.', 'info');
  };

  const requestPasswordReset = async (user: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user.trim() }) });
      return response.ok;
    } catch { return false; }
  };

  const resetAdminPassword = async (token: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: pass }) });
      return response.ok;
    } catch { return false; }
  };

  const toggleEditMode = () => {
    setIsEditModeActive((prev) => !prev);
  };

  const updateAdminCredentials = async (newUser: string, newPass: string) => {
    if (!requireAdmin()) return;
    if (!newUser.trim()) {
      showToast('Username cannot be empty.', 'error');
      return;
    }
    if (!newPass || newPass.length < 12) {
      showToast('Password must be at least 12 characters.', 'error');
      return;
    }
    try {
      const response = await fetch('/api/auth/credentials', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUser.trim(), password: newPass })
      });
      if (!response.ok) throw new Error('Credential update failed');
      showToast('Admin username and password successfully updated.', 'success');
    } catch {
      showToast('Unable to update admin credentials.', 'error');
    }
  };

  // Profile Updates (Admin Protected)
  const updateProfileBasic = (data: Partial<PortfolioProfile>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({ ...prev, ...data }));
    showToast('Profile information updated successfully.');
  };

  const updateSiteSettings = (data: Partial<SiteSettings>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      siteSettings: {
        ...(prev.siteSettings || {}),
        ...data
      }
    }));
    showToast('Website titles & branding updated.');
  };

  const updateResumeSettings = (data: Partial<ResumeSettings>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      resumeSettings: {
        ...(prev.resumeSettings || {}),
        ...data
      }
    }));
    showToast('Resume configuration updated successfully.');
  };

  const updateContact = (data: Partial<ContactInfo>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...data }
    }));
    showToast('Contact details updated successfully.');
  };

  const updateLeadership = (data: Partial<LeadershipItem>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      leadership: { ...prev.leadership, ...data }
    }));
    showToast('Leadership section updated.');
  };

  // Projects CRUD (Admin Protected)
  const addProject = (project: Omit<Project, 'id'>) => {
    if (!requireAdmin()) return;
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`
    };
    setProfile((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects]
    }));
    showToast(`Project "${project.title}" added successfully.`);
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...project } : p))
    }));
    showToast('Project updated successfully.');
  };

  const deleteProject = (id: string) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
    showToast('Project deleted.', 'info');
  };

  // Experience CRUD (Admin Protected)
  const addExperience = (exp: Omit<ExperienceItem, 'id'>) => {
    if (!requireAdmin()) return;
    const newExp: ExperienceItem = {
      ...exp,
      id: `exp-${Date.now()}`
    };
    setProfile((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
    showToast(`Experience "${exp.role}" added.`);
  };

  const updateExperience = (id: string, exp: Partial<ExperienceItem>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...exp } : e))
    }));
    showToast('Experience updated.');
  };

  const deleteExperience = (id: string) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id)
    }));
    showToast('Experience item removed.', 'info');
  };

  // Achievement CRUD (Admin Protected)
  const addAchievement = (ach: Omit<AchievementItem, 'id'>) => {
    if (!requireAdmin()) return;
    const newAch: AchievementItem = {
      ...ach,
      id: `ach-${Date.now()}`
    };
    setProfile((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAch]
    }));
    showToast(`Achievement "${ach.title}" added.`);
  };

  const updateAchievement = (id: string, ach: Partial<AchievementItem>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === id ? { ...a, ...ach } : a))
    }));
    showToast('Achievement updated.');
  };

  const deleteAchievement = (id: string) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id)
    }));
    showToast('Achievement item removed.', 'info');
  };

  // Certification CRUD (Admin Protected)
  const addCertification = (cert: Omit<CertificationItem, 'id'>) => {
    if (!requireAdmin()) return;
    const newCert: CertificationItem = {
      ...cert,
      id: `cert-${Date.now()}`
    };
    setProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
    showToast(`Certification "${cert.title}" added.`);
  };

  const updateCertification = (id: string, cert: Partial<CertificationItem>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c))
    }));
    showToast('Certification updated.');
  };

  const deleteCertification = (id: string) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id)
    }));
    showToast('Certification item removed.', 'info');
  };

  // Skills CRUD (Admin Protected)
  const addSkillCategory = (cat: Omit<SkillCategory, 'id'>) => {
    if (!requireAdmin()) return;
    const newCat: SkillCategory = {
      ...cat,
      id: `skill-${Date.now()}`
    };
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newCat]
    }));
    showToast(`Skill category "${cat.category}" created.`);
  };

  const updateSkillCategory = (id: string, cat: Partial<SkillCategory>) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...cat } : s))
    }));
    showToast('Skill category updated.');
  };

  const deleteSkillCategory = (id: string) => {
    if (!requireAdmin()) return;
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
    showToast('Skill category deleted.', 'info');
  };

  // Reset & Backup (Admin Protected)
  const resetToDefaults = () => {
    if (!requireAdmin()) return;
    if (window.confirm('Are you sure you want to reset all portfolio content to original default data?')) {
      setProfile(initialPortfolioData);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Portfolio data reset to defaults.', 'info');
    }
  };

  const exportDataJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tamilarasan_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded successfully.', 'success');
  };

  const importDataJSON = (jsonStr: string): boolean => {
    if (!requireAdmin()) return false;
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.name && parsed.contact && parsed.skills) {
        setProfile(normalizePortfolioData(parsed));
        showToast('Portfolio data successfully restored from JSON.', 'success');
        return true;
      }
      throw new Error('Invalid JSON structure');
    } catch {
      showToast('Failed to import JSON: Invalid format.', 'error');
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        isAdminLoggedIn,
        isEditModeActive,
        toasts,
        showToast,
        dismissToast,
        adminLogin,
        requestPasswordReset,
        resetAdminPassword,
        adminLogout,
        toggleEditMode,
        updateAdminCredentials,
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
        importDataJSON
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
