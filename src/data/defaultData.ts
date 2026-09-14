import { PortfolioProfile } from '../types/portfolio';

export const initialPortfolioData: PortfolioProfile = {
  name: "Tamilarasan P",
  tagline: "",
  subtitle: "Aspiring SOC Analyst & Cybersecurity Professional",
  summary: "B.Tech Information Technology student passionate about Cybersecurity, SOC Operations, Network Security, Digital Forensics and Ethical Hacking.",
  avatarUrl: "/profile.png",
  education: "B.Tech Information Technology",
  careerGoal: "SOC Analyst / Cybersecurity Professional",
  interests: "SOC • Blue Team • Digital Forensics • Network Security",
  activities: "NCC • CTF • Cybersecurity Events",
  aboutParagraphs: [
    "I am a B.Tech Information Technology student with a strong interest in Cybersecurity and Information Security.",
    "My primary career goal is to become a SOC Analyst and develop strong capabilities in security monitoring, threat detection, incident response and digital forensics.",
    "I actively participate in cybersecurity competitions, Capture The Flag challenges, workshops and technical events to strengthen my practical knowledge."
  ],
  contact: {
    email: "tamilarasanpt31@gmail.com",
    linkedin: "https://linkedin.com/in/tamilarasan-purushothaman-641041318//",
    github: "https://github.com/Tamilarasantvk",
    location: "Cuddalore,Tamil Nadu",
    phone: "+91 9025604173"
  },
  skills: [
    {
      id: "skill-1",
      category: "Cybersecurity",
      skills: [
        "Cyber Security Fundamentals",
        "Basic Vulnerability Assessment"
      ]
    },
    {
      id: "skill-2",
      category: "Security Tools",
      skills: [
        "Wireshark",
        "Nmap",
        "Burp Suite",
        "Kali Linux"
      ]
    },
    {
      id: "skill-3",
      category: "Programming Languages",
      skills: [
        "HTML",
        "CSS",
        "Python",
        "C++"
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      projectNumber: "PROJECT 01",
      title: "Smart Water Hygiene Tracker by Camera",
      description: "To analyse the unneccesary objects like insects , bacteria, weed ,etc in the Domestic water Tank by using Camera and ESP32.",
      tags: ["IoT", "Safety", "Embedded Systems"],
      featured: true
    }
  ],
  experiences: [
    {
      id: "exp-1",
      type: "CYBERSECURITY INTERNSHIP",
      role: "Cybersecurity & Ethical Hacking Intern",
      organization: "Supraja Technologies",
      dateRange: "June 2026 -July 2026",
      description: "Internship experience at Supraja Technologies focused on cybersecurity and ethical hacking. Developed practical exposure to security concepts, vulnerability assessment and cybersecurity tools.",
      keyPoints: [
        "Focused on cybersecurity and ethical hacking fundamentals.",
        "Hands-on vulnerability assessment and security tool usage.",
        "Practical exposure to defensive workflows and reconnaissance."
      ]
    },
    {
      id: "exp-2",
      type: "CYBERSECURITY ACTIVITIES",
      role: "CTF & Cybersecurity Competitions",
      organization: "Competitions & Technical Workshops",
      dateRange: "2025 - Present",
      description: "Participated in Capture The Flag competitions, cybersecurity workshops and technical events to improve practical problem-solving and security skills.",
      keyPoints: [
        "Solved cryptography, web security, and forensic CTF challenges.",
        "Participated in active defensive security symposiums."
      ]
    }
  ],
  achievements: [
    {
      id: "ach-1",
      awardEmoji: "🥇",
      title: "Cipher Carnival CTF",
      organization: "Technical Symposium CTF",
      description: "Secured 1st Prize in Cipher Carnival Capture The Flag competition."
    },
    {
      id: "ach-2",
      awardEmoji: "🏆",
      title: "ATC Camp",
      organization: "National Cadet Corps (NCC)",
      description: "Led 95 NCC cadets as Company Captain and contributed to achieving the overall trophy."
    },
    {
      id: "ach-3",
      awardEmoji: "🥈",
      title: "Prompt War",
      organization: "ASTRYX'26",
      description: "Secured 2nd Prize in Prompt War at ASTRYX'26."
    },
    {
      id: "ach-4",
      awardEmoji: "🥉",
      title: "Photography",
      organization: "Ramco Institute of Technology",
      description: "Secured 3rd Prize in a photography event at Ramco Institute of Technology."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Junior Cybersecurity Analyst",
      issuer: "Cisco Networking Academy",
      issuedYear: "2025- Present"
    },
    {
      id: "cert-2",
      title: "Soft Skills",
      issuer: "TCS iON",
      issuedYear: "2025"
    },
    {
      id: "cert-3",
      title: "Python for Data Science",
      issuer: "NPTEL",
      issuedYear: "2026"
    },
    {
      id: "cert-4",
      title: "Cybersecurity training and awareness",
      issuer: "NCC Cyber Defender",
      issuedYear: "2026"
    }
  ],
  leadership: {
    id: "lead-1",
    title: "NCC & Leadership",
    role: "Army Wing NCC Cadet",
    organization: "National Cadet Corps (NCC)",
    stats: "Company Captain • Led 95 Cadets • Overall Trophy Winner",
    description: "NCC has strengthened my leadership, discipline, teamwork, communication and decision-making abilities. As a Company Captain during ATC Camp, I led 95 cadets and contributed to achieving the overall trophy."
  },
  siteSettings: {
    brandTitle: "TAMILARASAN",
    brandSubtitle: "SOC OPERATIONS • BLUE TEAM",
    statusBadgeText: "OPEN FOR SOC ROLES",
    aboutTitle: "Who I Am",
    aboutSubtitle: "A technology enthusiast building practical cybersecurity and defensive operations skills.",
    skillsTitle: "Technical Arsenal",
    skillsSubtitle: "Technologies, analytical tools, and cybersecurity domains I actively operate and study.",
    projectsTitle: "Featured Projects",
    projectsSubtitle: "Selected initiatives demonstrating hands-on cybersecurity tools, network defense, and system auditing.",
    experienceTitle: "Experience & Education",
    experienceSubtitle: "Formal internships, training, and academic background building defensive security capabilities.",
    achievementsTitle: "Key Highlights & Achievements",
    achievementsSubtitle: "Recognitions earned in Capture The Flag competitions, symposiums, and leadership camps.",
    certificationsTitle: "Certifications",
    certificationsSubtitle: "Verified credentials and technical trainings in Cybersecurity, Networking, and Information Technology.",
    leadershipTitle: "NCC Leadership & Discipline",
    contactTitle: "Get in Touch",
    contactSubtitle: "Interested in SOC Analyst roles, security investigations, or cybersecurity collaborations? Drop me a line.",
    footerText: "Dedicated to defensive security operations, threat hunting, and infrastructure protection."
  },
  resumeSettings: {
    uploadedResumeUrl: "",
    targetRole: "Aspiring SOC Analyst & Cybersecurity Professional",
    summary: "B.Tech Information Technology student passionate about Cybersecurity, SOC Operations, Network Security, Digital Forensics and Ethical Hacking. Focused on security monitoring, threat detection, incident triage, and digital forensics with practical lab experience in Wireshark, Nmap, Kali Linux, and active competitive CTF problem-solving.",
    educationDegree: "B.Tech Information Technology",
    educationInstitution: "RAMCO INSTITUTE OF TECHNOLOGY",
    educationSpecialization: "Specialization: Cybersecurity, Networking & Systems Engineering",
    educationGraduationYear: "Graduation: 2029",
    showLeadership: true,
    showAchievements: true,
    showProjects: true,
    showCertifications: true,
    maxProjectsCount: 3,
    customAtsKeywords: "SIEM, SOC Analysis, Wireshark, Nmap, Kali Linux, Incident Triage, Log Analysis, Vulnerability Assessment, Threat Detection, Network Defense",
    customFooterNote: "Available for SOC Analyst Internships & Entry-Level Blue Team Roles."
  }
};
