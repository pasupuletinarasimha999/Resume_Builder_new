'use client';

import { useResume } from '@/context/ResumeContext';
import BasicInfoForm from './forms/BasicInfoForm';
import EducationForm from './forms/EducationForm';
import WorkExperienceForm from './forms/WorkExperienceForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';

export default function MainContent() {
  const { state } = useResume();

  const renderCurrentSection = () => {
    switch (state.currentSection) {
      case 'basic':
        return <BasicInfoForm />;
      case 'education':
        return <EducationForm />;
      case 'workExperience':
        return <WorkExperienceForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'skills':
        return <SkillsForm />;
      default:
        return <BasicInfoForm />;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderCurrentSection()}
    </div>
  );
}
