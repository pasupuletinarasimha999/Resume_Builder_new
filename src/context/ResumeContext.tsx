'use client';

import type React from 'react';
import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ResumeData, SectionType } from '@/types/resume';

interface ResumeState {
  data: ResumeData;
  currentSection: SectionType;
  sidebarCollapsed: boolean;
}

type ResumeAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<ResumeData['personalInfo']> }
  | { type: 'ADD_EDUCATION'; payload: ResumeData['education'][0] }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<ResumeData['education'][0]> } }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: ResumeData['workExperience'][0] }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { id: string; data: Partial<ResumeData['workExperience'][0]> } }
  | { type: 'DELETE_WORK_EXPERIENCE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: ResumeData['projects'][0] }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<ResumeData['projects'][0]> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_SKILL'; payload: ResumeData['skills'][0] }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Partial<ResumeData['skills'][0]> } }
  | { type: 'DELETE_SKILL'; payload: string }
  | { type: 'SET_CURRENT_SECTION'; payload: SectionType }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'LOAD_DATA'; payload: ResumeData };

const initialState: ResumeState = {
  data: {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: []
  },
  currentSection: 'basic',
  sidebarCollapsed: false
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        data: {
          ...state.data,
          personalInfo: { ...state.data.personalInfo, ...action.payload }
        }
      };
    case 'ADD_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          education: [...state.data.education, action.payload]
        }
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          education: state.data.education.map(edu =>
            edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu
          )
        }
      };
    case 'DELETE_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          education: state.data.education.filter(edu => edu.id !== action.payload)
        }
      };
    case 'ADD_WORK_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          workExperience: [...state.data.workExperience, action.payload]
        }
      };
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          workExperience: state.data.workExperience.map(exp =>
            exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
          )
        }
      };
    case 'DELETE_WORK_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          workExperience: state.data.workExperience.filter(exp => exp.id !== action.payload)
        }
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: [...state.data.projects, action.payload]
        }
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: state.data.projects.map(proj =>
            proj.id === action.payload.id ? { ...proj, ...action.payload.data } : proj
          )
        }
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: state.data.projects.filter(proj => proj.id !== action.payload)
        }
      };
    case 'ADD_SKILL':
      return {
        ...state,
        data: {
          ...state.data,
          skills: [...state.data.skills, action.payload]
        }
      };
    case 'UPDATE_SKILL':
      return {
        ...state,
        data: {
          ...state.data,
          skills: state.data.skills.map(skill =>
            skill.id === action.payload.id ? { ...skill, ...action.payload.data } : skill
          )
        }
      };
    case 'DELETE_SKILL':
      return {
        ...state,
        data: {
          ...state.data,
          skills: state.data.skills.filter(skill => skill.id !== action.payload)
        }
      };
    case 'SET_CURRENT_SECTION':
      return { ...state, currentSection: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'LOAD_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
}

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(state.data));
  }, [state.data]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
