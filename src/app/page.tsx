'use client';

import { useState, useRef } from 'react';
import type { ResumeData, SectionKey } from '@/types/resume';
import { initialResumeData, sectionConfig, exportResumeData, importResumeData } from '@/lib/resume-data';
import { sampleResumeData } from '@/lib/sample-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<SectionKey | 'personalInfo'>('personalInfo');
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadData = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await importResumeData(file);
        setResumeData(data);
      } catch (error) {
        alert(`Error loading file: ${(error as Error).message}`);
      }
    }
  };

  const handleSaveData = () => {
    exportResumeData(resumeData);
  };

  const handleLoadSampleData = () => {
    setResumeData(sampleResumeData);
  };

  const updateResumeData = (updates: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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
              <Button variant="outline" size="sm" className="text-xs">Templates</Button>
              <Button variant="outline" size="sm" className="text-xs">Reorder</Button>
              <Button
                onClick={handleLoadSampleData}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Sample
              </Button>
            </div>

            {/* Load/Save Data Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleLoadData}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                size="sm"
              >
                📁 Load Data
              </Button>
              <Button
                onClick={handleSaveData}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                size="sm"
              >
                💾 Save Data
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-2">
            {sectionConfig.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeSection === section.key
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Image
                  src={section.icon}
                  alt={section.title}
                  width={16}
                  height={16}
                  className="flex-shrink-0"
                />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}

            <Separator className="my-4" />

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Image
                src="https://ext.same-assets.com/3442189925/1354271685.svg"
                alt="Dark Mode"
                width={16}
                height={16}
                className="flex-shrink-0"
              />
              <span className="text-sm font-medium">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Card className="p-6">
              <ResumeForm
                resumeData={resumeData}
                activeSection={activeSection}
                onUpdate={updateResumeData}
              />
            </Card>
          </div>

          {/* Preview Area */}
          <div className="w-96 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
