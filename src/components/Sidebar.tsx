'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/context/ResumeContext';

export type Section =
  | 'basic'
  | 'education'
  | 'work-experience'
  | 'projects'
  | 'skills'
  | 'languages'
  | 'social-media'
  | 'awards'
  | 'certification'
  | 'publications'
  | 'volunteering'
  | 'competitions'
  | 'conferences'
  | 'test-scores'
  | 'patents'
  | 'scholarships'
  | 'extra-curricular';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const sections = [
  { key: 'basic' as const, title: 'Basic', icon: '👤' },
  { key: 'education' as const, title: 'Education', icon: '🎓' },
  { key: 'work-experience' as const, title: 'Work Experience', icon: '💼' },
  { key: 'projects' as const, title: 'Projects', icon: '🚀' },
  { key: 'skills' as const, title: 'Skills', icon: '⚡' },
  { key: 'languages' as const, title: 'Languages', icon: '🌐' },
  { key: 'social-media' as const, title: 'Social Media', icon: '📱' },
  { key: 'awards' as const, title: 'Awards', icon: '🏆' },
  { key: 'certification' as const, title: 'Certification', icon: '📜' },
  { key: 'publications' as const, title: 'Publications', icon: '📚' },
  { key: 'volunteering' as const, title: 'Volunteering', icon: '❤️' },
  { key: 'competitions' as const, title: 'Competitions', icon: '🏅' },
  { key: 'conferences' as const, title: 'Conferences and Workshops', icon: '🎤' },
  { key: 'test-scores' as const, title: 'Test Scores', icon: '📊' },
  { key: 'patents' as const, title: 'Patents', icon: '💡' },
  { key: 'scholarships' as const, title: 'Scholarships', icon: '💰' },
  { key: 'extra-curricular' as const, title: 'Extra Curricular Activities', icon: '🎯' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { loadData, exportData } = useResume();

  const handleLoadData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            loadData(data);
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveData = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSampleData = () => {
    const sampleData = {
      personalInfo: {
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/johnsmith',
        summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Proven track record of building scalable web applications and leading cross-functional teams. Passionate about creating innovative solutions that drive business growth and enhance user experiences.'
      },
      workExperience: [
        {
          id: '1',
          company: 'Tech Innovations Inc.',
          position: 'Senior Software Engineer',
          startDate: '01/2022',
          endDate: '',
          current: true,
          description: 'Lead development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 70%. Mentored junior developers and collaborated with product teams to deliver high-quality features.',
          location: 'San Francisco, CA'
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          startDate: '06/2020',
          endDate: '12/2021',
          current: false,
          description: 'Built responsive web applications using React and Node.js. Optimized database queries resulting in 40% performance improvement. Worked in agile environment with rapid product iterations.',
          location: 'Remote'
        }
      ],
      education: [
        {
          id: '1',
          institution: 'University of California, Berkeley',
          degree: "Bachelor's",
          field: 'Computer Science',
          startDate: '08/2016',
          endDate: '05/2020',
          gpa: '3.8',
          description: 'Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems'
        }
      ],
      skills: [
        { id: '1', name: 'JavaScript', category: 'Programming Languages', level: 'Expert' as const },
        { id: '2', name: 'Python', category: 'Programming Languages', level: 'Advanced' as const },
        { id: '3', name: 'React', category: 'Frameworks & Libraries', level: 'Expert' as const },
        { id: '4', name: 'Node.js', category: 'Frameworks & Libraries', level: 'Advanced' as const },
        { id: '5', name: 'PostgreSQL', category: 'Databases', level: 'Advanced' as const },
        { id: '6', name: 'AWS', category: 'Cloud & DevOps', level: 'Intermediate' as const },
        { id: '7', name: 'Docker', category: 'Cloud & DevOps', level: 'Intermediate' as const },
        { id: '8', name: 'Leadership', category: 'Soft Skills', level: 'Advanced' as const },
        { id: '9', name: 'Problem Solving', category: 'Soft Skills', level: 'Expert' as const }
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with payment integration, inventory management, and real-time analytics dashboard.',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'AWS'],
          startDate: '03/2023',
          endDate: '08/2023',
          url: 'https://demo-ecommerce.com',
          github: 'https://github.com/johnsmith/ecommerce-platform'
        },
        {
          id: '2',
          name: 'Task Management App',
          description: 'Developed a collaborative task management application with real-time updates, file sharing, and team collaboration features.',
          technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io'],
          startDate: '01/2023',
          endDate: '02/2023',
          url: '',
          github: 'https://github.com/johnsmith/task-manager'
        }
      ]
    };
    loadData(sampleData);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Hey,</span>
          <span className="text-sm font-medium underline cursor-pointer">Good to see you</span>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm">Templates</Button>
          <Button variant="outline" size="sm">Reorder</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSampleData}
          >
            Sample
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleLoadData}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
          >
            📁 Load Data
          </Button>
          <Button
            onClick={handleSaveData}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
          >
            💾 Save Data
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => onSectionChange(section.key)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mb-1 ${
              activeSection === section.key
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="text-sm">{section.icon}</span>
            <span className="text-sm font-medium">{section.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
