export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  projectNumber: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  type: string;
  role: string;
  organization?: string;
  dateRange?: string;
  description: string;
  keyPoints?: string[];
}

export interface AchievementItem {
  id: string;
  awardEmoji: string;
  title: string;
  organization?: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issuedYear?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface LeadershipItem {
  id: string;
  title: string;
  role: string;
  organization: string;
  description: string;
  stats?: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  location?: string;
  phone?: string;
  tryhackme?: string;
}

export interface SiteSettings {
  brandTitle?: string;
  brandSubtitle?: string;
  statusBadgeText?: string;
  heroViewProjectsText?: string;
  heroResumeText?: string;
  heroContactText?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  skillsTitle?: string;
  skillsSubtitle?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  experienceTitle?: string;
  experienceSubtitle?: string;
  achievementsTitle?: string;
  achievementsSubtitle?: string;
  certificationsTitle?: string;
  certificationsSubtitle?: string;
  leadershipTitle?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  footerText?: string;
}

export interface ResumeSettings {
  uploadedResumeUrl?: string;
  targetRole?: string;
  summary?: string;
  educationDegree?: string;
  educationInstitution?: string;
  educationSpecialization?: string;
  educationGraduationYear?: string;
  showLeadership?: boolean;
  showAchievements?: boolean;
  showProjects?: boolean;
  showCertifications?: boolean;
  maxProjectsCount?: number;
  customAtsKeywords?: string;
  customFooterNote?: string;
}

export interface PortfolioProfile {
  name: string;
  tagline?: string;
  subtitle: string;
  summary: string;
  avatarUrl: string;
  education: string;
  careerGoal: string;
  interests: string;
  activities: string;
  aboutParagraphs: string[];
  contact: ContactInfo;
  skills: SkillCategory[];
  projects: Project[];
  experiences: ExperienceItem[];
  achievements: AchievementItem[];
  certifications: CertificationItem[];
  leadership: LeadershipItem;
  siteSettings?: SiteSettings;
  resumeSettings?: ResumeSettings;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Stored securely in client storage
}
