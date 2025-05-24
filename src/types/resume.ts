export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
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
  endDate: string;
  url?: string;
  github?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  username: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
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

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Competition {
  id: string;
  name: string;
  position: string;
  date: string;
  description?: string;
}

export interface Conference {
  id: string;
  name: string;
  role: 'Attendee' | 'Speaker' | 'Organizer';
  date: string;
  location: string;
  description?: string;
}

export interface TestScore {
  id: string;
  testName: string;
  score: string;
  maxScore?: string;
  date: string;
}

export interface Patent {
  id: string;
  title: string;
  patentNumber: string;
  date: string;
  description?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  date: string;
  description?: string;
}

export interface ExtraCurricular {
  id: string;
  activity: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  socialMedia: SocialMedia[];
  awards: Award[];
  certifications: Certification[];
  publications: Publication[];
  volunteering: Volunteering[];
  competitions: Competition[];
  conferences: Conference[];
  testScores: TestScore[];
  patents: Patent[];
  scholarships: Scholarship[];
  extraCurricular: ExtraCurricular[];
}

export type SectionKey = keyof ResumeData;

export interface SectionConfig {
  key: SectionKey;
  label: string;
  icon?: string;
}
