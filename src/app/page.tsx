'use client';

import { useState } from 'react';
import { ResumeProvider } from '@/context/ResumeContext';
import { Sidebar, type Section } from '@/components/Sidebar';
import { ResumePreview } from '@/components/ResumePreview';
import { PersonalInfoForm } from '@/components/PersonalInfoForm';
import { WorkExperienceForm } from '@/components/WorkExperienceForm';
import { EducationForm } from '@/components/EducationForm';
import { SkillsForm } from '@/components/SkillsForm';
import { ProjectsForm } from '@/components/ProjectsForm';

function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState<Section>('basic');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return <PersonalInfoForm />;
      case 'work-experience':
        return <WorkExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>This section is under development. Please select another section.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - 320px wide */}
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Main content area - 40% for forms, 60% for preview */}
        <div className="flex flex-1">
          {/* Form section - 40% */}
          <div className="w-2/5 p-6 overflow-y-auto bg-white">
            {renderActiveSection()}
          </div>

          {/* Preview section - 60% with larger A4 preview */}
          <div className="w-3/5 bg-gray-100 p-6 overflow-y-auto">
            <div className="max-w-none">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Print Resume
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-lg">
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}
