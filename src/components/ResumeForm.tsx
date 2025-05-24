'use client';

import type { ResumeData, SectionKey } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Edit2, Link2 } from 'lucide-react';
import { useState } from 'react';
import { sectionConfig } from '@/lib/resume-data';

interface ResumeFormProps {
  resumeData: ResumeData;
  activeSection: SectionKey | 'personalInfo';
  onUpdate: (updates: Partial<ResumeData>) => void;
}

export default function ResumeForm({ resumeData, activeSection, onUpdate }: ResumeFormProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onUpdate({
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  };

  const addNewItem = (section: SectionKey) => {
    const newId = Date.now().toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentArray = resumeData[section] as any[];

    const newItem = {
      id: newId,
      // Default fields based on section type
      ...(section === 'education' && {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
      }),
      ...(section === 'experience' && {
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }),
      ...(section === 'projects' && {
        name: '',
        description: '',
        technologies: [],
        link: '',
        startDate: '',
        endDate: ''
      }),
      ...(section === 'skills' && {
        name: '',
        level: '',
        category: ''
      }),
      ...(section === 'languages' && {
        name: '',
        proficiency: ''
      }),
      ...(section === 'links' && {
        platform: '',
        url: '',
        username: ''
      }),
      // Add other section defaults as needed
      ...(section === 'awards' && {
        title: '',
        issuer: '',
        date: '',
        description: ''
      }),
      ...(section === 'certifications' && {
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        url: ''
      })
    };

    onUpdate({
      [section]: [...currentArray, newItem]
    });
    setEditingItem(newId);
  };

  const updateItem = (section: SectionKey, itemId: string, updates: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentArray = resumeData[section] as any[];
    const updatedArray = currentArray.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    onUpdate({
      [section]: updatedArray
    });
  };

  const removeItem = (section: SectionKey, itemId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentArray = resumeData[section] as any[];
    const updatedArray = currentArray.filter(item => item.id !== itemId);

    onUpdate({
      [section]: updatedArray
    });
  };

  const renderPersonalInfoForm = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={resumeData.personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="Your phone number"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={resumeData.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={resumeData.personalInfo.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          placeholder="Write a brief professional summary..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderSectionHeader = (title: string, section: SectionKey, icon: string) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src={icon} alt={title} className="w-5 h-5" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <Edit2 className="w-4 h-4 text-gray-400" />
          <Link2 className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderAddNewItemButton = (section: SectionKey) => (
    <Button
      onClick={() => addNewItem(section)}
      variant="outline"
      className="w-full mt-4 border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
    >
      <PlusCircle className="w-4 h-4 mr-2" />
      + Add a New Item
    </Button>
  );

  const renderEducationForm = () => {
    const section = sectionConfig.find(s => s.key === 'education');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'education', section.icon)}

        {resumeData.education.map((edu) => (
          <Card key={edu.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Education Item</h3>
              <Button
                onClick={() => removeItem('education', edu.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateItem('education', edu.id, { institution: e.target.value })}
                  placeholder="University/School name"
                />
              </div>
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateItem('education', edu.id, { degree: e.target.value })}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateItem('education', edu.id, { fieldOfStudy: e.target.value })}
                  placeholder="Computer Science, etc."
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateItem('education', edu.id, { startDate: e.target.value })}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => updateItem('education', edu.id, { endDate: e.target.value })}
                  placeholder="MM/YYYY or Present"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Description</Label>
              <Textarea
                value={edu.description || ''}
                onChange={(e) => updateItem('education', edu.id, { description: e.target.value })}
                placeholder="Additional details..."
                rows={3}
              />
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('education')}
      </div>
    );
  };

  const renderExperienceForm = () => {
    const section = sectionConfig.find(s => s.key === 'experience');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'experience', section.icon)}

        {resumeData.experience.map((exp) => (
          <Card key={exp.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Experience Item</h3>
              <Button
                onClick={() => removeItem('experience', exp.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateItem('experience', exp.id, { position: e.target.value })}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => updateItem('experience', exp.id, { location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={exp.startDate}
                  onChange={(e) => updateItem('experience', exp.id, { startDate: e.target.value })}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={exp.endDate}
                  onChange={(e) => updateItem('experience', exp.id, { endDate: e.target.value })}
                  placeholder="MM/YYYY or Present"
                  disabled={exp.current}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateItem('experience', exp.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? 'Present' : ''
                  })}
                />
                <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
              </div>
            </div>

            <div className="mt-4">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('experience')}
      </div>
    );
  };

  const renderProjectsForm = () => {
    const section = sectionConfig.find(s => s.key === 'projects');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'projects', section.icon)}

        {resumeData.projects.map((project) => (
          <Card key={project.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Project Item</h3>
              <Button
                onClick={() => removeItem('projects', project.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateItem('projects', project.id, { name: e.target.value })}
                  placeholder="Project name"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={project.link || ''}
                  onChange={(e) => updateItem('projects', project.id, { link: e.target.value })}
                  placeholder="https://project-url.com"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={project.startDate}
                  onChange={(e) => updateItem('projects', project.id, { startDate: e.target.value })}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={project.endDate}
                  onChange={(e) => updateItem('projects', project.id, { endDate: e.target.value })}
                  placeholder="MM/YYYY or Present"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateItem('projects', project.id, { description: e.target.value })}
                placeholder="Describe your project..."
                rows={3}
              />
            </div>

            <div className="mt-4">
              <Label>Technologies</Label>
              <Input
                value={project.technologies.join(', ')}
                onChange={(e) => updateItem('projects', project.id, {
                  technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                })}
                placeholder="React, Node.js, MongoDB (comma separated)"
              />
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('projects')}
      </div>
    );
  };

  const renderSkillsForm = () => {
    const section = sectionConfig.find(s => s.key === 'skills');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'skills', section.icon)}

        {resumeData.skills.map((skill) => (
          <Card key={skill.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Skill Item</h3>
              <Button
                onClick={() => removeItem('skills', skill.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Skill Name</Label>
                <Input
                  value={skill.name}
                  onChange={(e) => updateItem('skills', skill.id, { name: e.target.value })}
                  placeholder="JavaScript, Design, etc."
                />
              </div>
              <div>
                <Label>Level</Label>
                <select
                  value={skill.level}
                  onChange={(e) => updateItem('skills', skill.id, { level: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={skill.category}
                  onChange={(e) => updateItem('skills', skill.id, { category: e.target.value })}
                  placeholder="Programming, Design, etc."
                />
              </div>
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('skills')}
      </div>
    );
  };

  const renderLanguagesForm = () => {
    const section = sectionConfig.find(s => s.key === 'languages');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'languages', section.icon)}

        {resumeData.languages.map((language) => (
          <Card key={language.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Language Item</h3>
              <Button
                onClick={() => removeItem('languages', language.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Language</Label>
                <Input
                  value={language.name}
                  onChange={(e) => updateItem('languages', language.id, { name: e.target.value })}
                  placeholder="English, Spanish, etc."
                />
              </div>
              <div>
                <Label>Proficiency</Label>
                <select
                  value={language.proficiency}
                  onChange={(e) => updateItem('languages', language.id, { proficiency: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select proficiency</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('languages')}
      </div>
    );
  };

  const renderLinksForm = () => {
    const section = sectionConfig.find(s => s.key === 'links');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'links', section.icon)}

        {resumeData.links.map((link) => (
          <Card key={link.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Social Link</h3>
              <Button
                onClick={() => removeItem('links', link.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Platform</Label>
                <Input
                  value={link.platform}
                  onChange={(e) => updateItem('links', link.id, { platform: e.target.value })}
                  placeholder="LinkedIn, GitHub, etc."
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={link.username}
                  onChange={(e) => updateItem('links', link.id, { username: e.target.value })}
                  placeholder="your-username"
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateItem('links', link.id, { url: e.target.value })}
                  placeholder="https://platform.com/username"
                />
              </div>
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('links')}
      </div>
    );
  };

  const renderAwardsForm = () => {
    const section = sectionConfig.find(s => s.key === 'awards');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'awards', section.icon)}

        {resumeData.awards.map((award) => (
          <Card key={award.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Award Item</h3>
              <Button
                onClick={() => removeItem('awards', award.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Award Title</Label>
                <Input
                  value={award.title}
                  onChange={(e) => updateItem('awards', award.id, { title: e.target.value })}
                  placeholder="Award name"
                />
              </div>
              <div>
                <Label>Issuer</Label>
                <Input
                  value={award.issuer}
                  onChange={(e) => updateItem('awards', award.id, { issuer: e.target.value })}
                  placeholder="Organization that gave the award"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  value={award.date}
                  onChange={(e) => updateItem('awards', award.id, { date: e.target.value })}
                  placeholder="MM/YYYY"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Description</Label>
              <Textarea
                value={award.description || ''}
                onChange={(e) => updateItem('awards', award.id, { description: e.target.value })}
                placeholder="Description of the award..."
                rows={3}
              />
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('awards')}
      </div>
    );
  };

  const renderCertificationsForm = () => {
    const section = sectionConfig.find(s => s.key === 'certifications');
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, 'certifications', section.icon)}

        {resumeData.certifications.map((cert) => (
          <Card key={cert.id} className="p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">Certification Item</h3>
              <Button
                onClick={() => removeItem('certifications', cert.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateItem('certifications', cert.id, { name: e.target.value })}
                  placeholder="Certification name"
                />
              </div>
              <div>
                <Label>Issuer</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateItem('certifications', cert.id, { issuer: e.target.value })}
                  placeholder="Organization"
                />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input
                  value={cert.issueDate}
                  onChange={(e) => updateItem('certifications', cert.id, { issueDate: e.target.value })}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateItem('certifications', cert.id, { expiryDate: e.target.value })}
                  placeholder="MM/YYYY or leave empty"
                />
              </div>
              <div>
                <Label>Credential ID</Label>
                <Input
                  value={cert.credentialId || ''}
                  onChange={(e) => updateItem('certifications', cert.id, { credentialId: e.target.value })}
                  placeholder="Credential ID (optional)"
                />
              </div>
              <div>
                <Label>Verification URL</Label>
                <Input
                  value={cert.url || ''}
                  onChange={(e) => updateItem('certifications', cert.id, { url: e.target.value })}
                  placeholder="https://verify-url.com (optional)"
                />
              </div>
            </div>
          </Card>
        ))}

        {renderAddNewItemButton('certifications')}
      </div>
    );
  };

  const renderGenericSection = (sectionKey: SectionKey) => {
    const section = sectionConfig.find(s => s.key === sectionKey);
    if (!section) return null;

    return (
      <div className="space-y-6">
        {renderSectionHeader(section.title, sectionKey, section.icon)}

        <div className="text-center py-8 text-gray-500">
          <p>Form for {section.title} coming soon...</p>
        </div>

        {renderAddNewItemButton(sectionKey)}
      </div>
    );
  };



  if (activeSection === 'personalInfo') {
    return renderPersonalInfoForm();
  }

  if (activeSection === 'education') {
    return renderEducationForm();
  }

  if (activeSection === 'experience') {
    return renderExperienceForm();
  }

  if (activeSection === 'projects') {
    return renderProjectsForm();
  }

  if (activeSection === 'skills') {
    return renderSkillsForm();
  }

  if (activeSection === 'languages') {
    return renderLanguagesForm();
  }

  if (activeSection === 'links') {
    return renderLinksForm();
  }

  if (activeSection === 'awards') {
    return renderAwardsForm();
  }

  if (activeSection === 'certifications') {
    return renderCertificationsForm();
  }

  return renderGenericSection(activeSection);
}
