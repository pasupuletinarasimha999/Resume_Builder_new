'use client';

import { useState, useCallback } from 'react';
import { ResumeData, SectionKey } from '@/types/resume';
import { resumeSections, defaultResumeData, sampleResumeData } from '@/lib/resume-sections';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm';
import { EducationForm } from '@/components/forms/EducationForm';
import { WorkExperienceForm } from '@/components/forms/WorkExperienceForm';
import { ResumePreview } from '@/components/ResumePreview';
import { Moon } from 'lucide-react';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeSection, setActiveSection] = useState<SectionKey>('personalInfo');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const updateResumeData = useCallback((section: SectionKey, data: ResumeData[SectionKey]) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  const loadSampleData = () => {
    setResumeData(sampleResumeData);
    console.log('Sample data loaded');
  };

  const saveData = () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    console.log('Data saved to localStorage');
  };

  const loadData = () => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      setResumeData(JSON.parse(saved));
      console.log('Data loaded from localStorage');
    }
  };

  const renderActiveForm = () => {
    switch (activeSection) {
      case 'personalInfo':
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onUpdate={(data) => updateResumeData('personalInfo', data)}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onUpdate={(data) => updateResumeData('education', data)}
          />
        );
      case 'workExperience':
        return (
          <WorkExperienceForm
            data={resumeData.workExperience}
            onUpdate={(data) => updateResumeData('workExperience', data)}
          />
        );
      // Other forms will be implemented later
      default:
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {resumeSections.find(s => s.key === activeSection)?.label}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This section is coming soon...
            </p>
          </Card>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Hey,</span>
              <span className="text-sm font-medium underline cursor-pointer">Good to see you</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" className="text-xs">
                Templates
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Reorder
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={loadSampleData}>
                Sample
              </Button>
            </div>

            {/* Save/Load Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                onClick={loadData}
              >
                📁 Load Data
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                onClick={saveData}
              >
                💾 Save Data
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-2">
            {resumeSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
                  activeSection === section.key
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Moon size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Editor */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderActiveForm()}
          </div>

          {/* Resume Preview */}
          <div className="w-96 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
