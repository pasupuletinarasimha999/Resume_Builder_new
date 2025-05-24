export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: string;
  category: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface LinkItem {
  id: string;
  platform: string;
  url: string;
  username: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publication: string;
  date: string;
  url?: string;
  description?: string;
}

export interface VolunteeringItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CompetitionItem {
  id: string;
  name: string;
  organizer: string;
  date: string;
  position: string;
  description?: string;
}

export interface ConferenceItem {
  id: string;
  name: string;
  organizer: string;
  date: string;
  role: string;
  description?: string;
}

export interface TestScoreItem {
  id: string;
  testName: string;
  score: string;
  date: string;
  validUntil?: string;
}

export interface PatentItem {
  id: string;
  title: string;
  patentNumber: string;
  date: string;
  description?: string;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  amount: string;
  date: string;
  provider: string;
  description?: string;
}

export interface ExtracurricularItem {
  id: string;
  activity: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  links: LinkItem[];
  awards: AwardItem[];
  certifications: CertificationItem[];
  publications: PublicationItem[];
  volunteering: VolunteeringItem[];
  competitions: CompetitionItem[];
  conferences: ConferenceItem[];
  testScores: TestScoreItem[];
  patents: PatentItem[];
  scholarships: ScholarshipItem[];
  extracurricular: ExtracurricularItem[];
}

export type SectionKey = keyof Omit<ResumeData, 'personalInfo'>;
