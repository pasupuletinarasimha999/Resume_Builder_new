'use client';

import { useResume } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import type { SectionType } from '@/types/resume';
import { sampleResumeData } from '@/utils/sampleData';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const sections = [
  { id: 'basic' as SectionType, label: 'Basic', icon: User },
  { id: 'education' as SectionType, label: 'Education', icon: GraduationCap },
  { id: 'workExperience' as SectionType, label: 'Work Experience', icon: Briefcase },
  { id: 'projects' as SectionType, label: 'Projects', icon: FolderOpen },
  { id: 'skills' as SectionType, label: 'Skills', icon: Award },
];

export default function Sidebar() {
  const { state, dispatch } = useResume();

  const handleSectionChange = (section: SectionType) => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: section });
  };

  const handleToggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const handleLoadData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            dispatch({ type: 'LOAD_DATA', payload: data });
          } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading file. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveData = () => {
    const dataStr = JSON.stringify(state.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    dispatch({ type: 'LOAD_DATA', payload: sampleResumeData });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-10 bg-white border border-gray-200 rounded-full p-1 h-6 w-6"
        onClick={handleToggleSidebar}
      >
        {state.sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Hey,</span>
          <span className="text-sm font-medium underline cursor-pointer">Good to see you</span>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" className="text-xs">
            Templates
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Reorder
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={handleLoadSample}>
            Sample
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            onClick={handleLoadData}
          >
            📁 Load Data
          </Button>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
            onClick={handleSaveData}
          >
            💾 Save Data
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = state.currentSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
