export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  url?: string;
  github?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  publication: string;
  date: string;
  url?: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  username: string;
  url: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  awards: Award[];
  certifications: Certification[];
  publications: Publication[];
  socialMedia: SocialMedia[];
  volunteering: WorkExperience[];
  competitions: Award[];
  conferences: Award[];
  testScores: Award[];
  patents: Publication[];
  scholarships: Award[];
  extraCurricular: Award[];
}

export type SectionType = keyof Omit<ResumeData, 'personalInfo'>;

export interface SectionConfig {
  key: SectionType;
  title: string;
  icon: string;
  enabled: boolean;
}
