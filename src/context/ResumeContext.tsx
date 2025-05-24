'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ResumeData, PersonalInfo, Education, WorkExperience, Project, Skill } from '@/types/resume';

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addWorkExperience: (experience: Omit<WorkExperience, 'id'>) => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  loadData: (data: Partial<ResumeData>) => void;
  exportData: () => ResumeData;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: ''
  },
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  languages: [],
  awards: [],
  certifications: [],
  publications: [],
  socialMedia: [],
  volunteering: [],
  competitions: [],
  conferences: [],
  testScores: [],
  patents: [],
  scholarships: [],
  extraCurricular: []
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation = { ...education, id: Date.now().toString() };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addWorkExperience = (experience: Omit<WorkExperience, 'id'>) => {
    const newExperience = { ...experience, id: Date.now().toString() };
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience]
    }));
  };

  const updateWorkExperience = (id: string, experience: Partial<WorkExperience>) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, ...project } : proj
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill = { ...skill, id: Date.now().toString() };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === id ? { ...s, ...skill } : s
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const loadData = (data: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...data }));
  };

  const exportData = () => resumeData;

  return (
    <ResumeContext.Provider value={{
      resumeData,
      updatePersonalInfo,
      addEducation,
      updateEducation,
      removeEducation,
      addWorkExperience,
      updateWorkExperience,
      removeWorkExperience,
      addProject,
      updateProject,
      removeProject,
      addSkill,
      updateSkill,
      removeSkill,
      loadData,
      exportData
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
