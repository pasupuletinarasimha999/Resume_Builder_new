'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PDFDownload } from '@/components/PDFDownload'
import { ResumeSection } from '@/components/ResumeSection'

// Resume sections with icons
const resumeSections = [
  { id: 'basic', name: 'Basic', icon: 'https://ext.same-assets.com/3442189925/3783633550.svg' },
  { id: 'education', name: 'Education', icon: 'https://ext.same-assets.com/3442189925/3160495444.svg' },
  { id: 'experience', name: 'Work Experience', icon: 'https://ext.same-assets.com/3442189925/3810376176.svg' },
  { id: 'projects', name: 'Projects', icon: 'https://ext.same-assets.com/3442189925/1109834275.svg' },
  { id: 'skills', name: 'Skills', icon: 'https://ext.same-assets.com/3442189925/3410870790.svg' },
  { id: 'languages', name: 'Languages', icon: 'https://ext.same-assets.com/3442189925/3304711307.svg' },
  { id: 'social', name: 'Social Media', icon: 'https://ext.same-assets.com/3442189925/3272116947.svg' },
  { id: 'awards', name: 'Awards', icon: 'https://ext.same-assets.com/3442189925/1967388618.svg' },
  { id: 'certification', name: 'Certification', icon: 'https://ext.same-assets.com/3442189925/3927218253.svg' },
  { id: 'publications', name: 'Publications', icon: 'https://ext.same-assets.com/3442189925/3561037935.svg' },
  { id: 'volunteering', name: 'Volunteering', icon: 'https://ext.same-assets.com/3442189925/1132317054.svg' },
  { id: 'competitions', name: 'Competitions', icon: 'https://ext.same-assets.com/3442189925/2555040435.svg' },
  { id: 'conferences', name: 'Conferences and Workshops', icon: 'https://ext.same-assets.com/3442189925/1581566948.svg' }
]

interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  summary: string
}

interface SectionItem {
  id: string
  [key: string]: string | undefined
}

interface ResumeSections {
  education: SectionItem[]
  experience: SectionItem[]
  projects: SectionItem[]
  skills: SectionItem[]
}

// Helper function to format date to MM-YYYY
function formatDateToMMYYYY(dateString: string): string {
  if (!dateString) return ''

  // If already in MM-YYYY format, return as is
  if (/^\d{2}-\d{4}$/.test(dateString)) {
    return dateString
  }

  // Handle "Present" or similar text
  if (dateString.toLowerCase() === 'present' || dateString.toLowerCase() === 'current') {
    return 'Present'
  }

  // Try to parse as date and convert to MM-YYYY
  try {
    const date = new Date(dateString)
    if (!Number.isNaN(date.getTime())) {
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${month}-${year}`
    }
  } catch (error) {
    // If parsing fails, return the original string
    return dateString
  }

  return dateString
}

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: 'Jack',
    email: 'jack@haveloc.com',
    phone: '987654321',
    location: 'Hyderabad, India',
    summary: "I am Jack a tech enthusiast with a passion for innovation. As the developer behind wall I've created a groundbreaking software solution that revolutionizes. With a focus on streamlining and optimizing workflows, It brings efficiency and effectiveness to the world of animals."
  })

  const [sections, setSections] = useState<ResumeSections>({
    education: [],
    experience: [],
    projects: [],
    skills: []
  })

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  const addSectionItem = (sectionName: keyof ResumeSections) => {
    const newId = Math.random().toString(36).substr(2, 9)
    setSections(prev => ({
      ...prev,
      [sectionName]: [...prev[sectionName], { id: newId }]
    }))
  }

  const updateSectionItem = (sectionName: keyof ResumeSections, id: string, field: string, value: string) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const deleteSectionItem = (sectionName: keyof ResumeSections, id: string) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].filter(item => item.id !== id)
    }))
  }

  const sectionConfigs = {
    education: {
      title: 'Education',
      fields: [
        { key: 'school', label: 'School/University', type: 'text' as const, placeholder: 'e.g., MIT' },
        { key: 'degree', label: 'Degree', type: 'text' as const, placeholder: 'e.g., Bachelor of Science' },
        { key: 'field', label: 'Field of Study', type: 'text' as const, placeholder: 'e.g., Computer Science' },
        { key: 'startDate', label: 'Start Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., 09-2020)' },
        { key: 'endDate', label: 'End Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., 06-2024)' },
        { key: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Relevant coursework, achievements, etc.' }
      ]
    },
    experience: {
      title: 'Work Experience',
      fields: [
        { key: 'company', label: 'Company', type: 'text' as const, placeholder: 'e.g., Google' },
        { key: 'position', label: 'Position', type: 'text' as const, placeholder: 'e.g., Software Engineer' },
        { key: 'location', label: 'Location', type: 'text' as const, placeholder: 'e.g., San Francisco, CA' },
        { key: 'startDate', label: 'Start Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., 01-2022)' },
        { key: 'endDate', label: 'End Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., Present)' },
        { key: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Key responsibilities and achievements...' }
      ]
    },
    projects: {
      title: 'Projects',
      fields: [
        { key: 'name', label: 'Project Name', type: 'text' as const, placeholder: 'e.g., Resume Builder App' },
        { key: 'technologies', label: 'Technologies', type: 'text' as const, placeholder: 'e.g., React, Node.js, MongoDB' },
        { key: 'url', label: 'Project URL', type: 'text' as const, placeholder: 'https://github.com/...' },
        { key: 'startDate', label: 'Start Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., 03-2023)' },
        { key: 'endDate', label: 'End Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., 08-2023)' },
        { key: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Brief description of the project...' }
      ]
    },
    skills: {
      title: 'Skills',
      fields: [
        { key: 'category', label: 'Category', type: 'text' as const, placeholder: 'e.g., Programming Languages' },
        { key: 'skills', label: 'Skills', type: 'textarea' as const, placeholder: 'e.g., JavaScript, Python, Java...' }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hey,</span>
              <span className="text-sm font-medium underline cursor-pointer">Good to see you</span>
            </div>

            {/* Template buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Templates
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Reorder
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Sample
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
            >
              📁 Load Data
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
            >
              💾 Save Data
            </Button>
            <PDFDownload resumeData={resumeData} />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Collapsible Sidebar */}
        <div
          className={`bg-gray-800 transition-all duration-300 ease-in-out ${
            sidebarExpanded ? 'w-64' : 'w-16'
          } flex flex-col`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <div className="flex-1 overflow-y-auto py-4">
            {resumeSections.map((section) => (
              <div key={section.id} className="relative group">
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <img
                    src={section.icon}
                    alt={section.name}
                    className="w-6 h-6 flex-shrink-0"
                  />
                  {sidebarExpanded && (
                    <span className="text-sm font-medium">{section.name}</span>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {!sidebarExpanded && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {section.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'basic' && (
              <Card className="rounded-xl p-6">
                <CardContent className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Write a brief professional summary..."
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'education' && (
              <ResumeSection
                title={sectionConfigs.education.title}
                items={sections.education}
                onAddItem={() => addSectionItem('education')}
                onUpdateItem={(id, field, value) => updateSectionItem('education', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('education', id)}
                fields={sectionConfigs.education.fields}
              />
            )}

            {activeSection === 'experience' && (
              <ResumeSection
                title={sectionConfigs.experience.title}
                items={sections.experience}
                onAddItem={() => addSectionItem('experience')}
                onUpdateItem={(id, field, value) => updateSectionItem('experience', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('experience', id)}
                fields={sectionConfigs.experience.fields}
              />
            )}

            {activeSection === 'projects' && (
              <ResumeSection
                title={sectionConfigs.projects.title}
                items={sections.projects}
                onAddItem={() => addSectionItem('projects')}
                onUpdateItem={(id, field, value) => updateSectionItem('projects', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('projects', id)}
                fields={sectionConfigs.projects.fields}
              />
            )}

            {activeSection === 'skills' && (
              <ResumeSection
                title={sectionConfigs.skills.title}
                items={sections.skills}
                onAddItem={() => addSectionItem('skills')}
                onUpdateItem={(id, field, value) => updateSectionItem('skills', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('skills', id)}
                fields={sectionConfigs.skills.fields}
              />
            )}

            {!['basic', 'education', 'experience', 'projects', 'skills'].includes(activeSection) && (
              <Card className="rounded-xl p-6">
                <CardContent>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {resumeSections.find(s => s.id === activeSection)?.name}
                  </h2>
                  <p className="text-gray-600">Section coming soon...</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="w-96 bg-gray-100 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg">
              <div
                className="bg-white text-black"
                id="resume-preview"
                style={{
                  fontFamily: 'Calibri, Arial, sans-serif',
                  width: '210mm',
                  minHeight: '297mm',
                  maxWidth: '100%',
                  margin: '0 auto',
                  padding: '20mm',
                  fontSize: '11pt',
                  lineHeight: '1.4',
                  color: '#000000'
                }}
              >
                {/* Header */}
                <div className="text-center mb-6 border-b-2 border-gray-900 pb-4">
                  <h1 style={{
                    fontSize: '18pt',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {resumeData.fullName}
                  </h1>
                  <div style={{
                    fontSize: '10pt',
                    color: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span>{resumeData.email}</span>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                    <span>•</span>
                    <span>{resumeData.location}</span>
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.summary && (
                  <div className="mb-6">
                    <h2 style={{
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '2px'
                    }}>
                      PROFESSIONAL SUMMARY
                    </h2>
                    <div style={{
                      fontSize: '11pt',
                      lineHeight: '1.4',
                      textAlign: 'justify'
                    }}>
                      {resumeData.summary}
                    </div>
                  </div>
                )}

                {/* Education */}
                {sections.education.length > 0 && (
                  <div className="mb-6">
                    <h2 style={{
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '2px'
                    }}>
                      EDUCATION
                    </h2>
                    {sections.education.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{
                            fontSize: '11pt',
                            fontWeight: 'bold',
                            margin: 0
                          }}>
                            {edu.school}
                          </h3>
                          <span style={{
                            fontSize: '10pt',
                            color: '#666666',
                            fontStyle: 'italic'
                          }}>
                            {edu.startDate && edu.endDate &&
                              `${formatDateToMMYYYY(edu.startDate)} - ${formatDateToMMYYYY(edu.endDate)}`
                            }
                          </span>
                        </div>
                        <div style={{
                          fontSize: '11pt',
                          marginBottom: '4px',
                          fontStyle: 'italic'
                        }}>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </div>
                        {edu.description && (
                          <ul style={{
                            margin: '4px 0 0 20px',
                            padding: 0,
                            fontSize: '10pt',
                            lineHeight: '1.3'
                          }}>
                            {edu.description.split('\n').filter(line => line.trim()).map((line) => (
                              <li key={`${edu.id}-edu-${line.slice(0, 20)}`} style={{ marginBottom: '2px' }}>
                                {line.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience */}
                {sections.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 style={{
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '2px'
                    }}>
                      PROFESSIONAL EXPERIENCE
                    </h2>
                    {sections.experience.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{
                            fontSize: '11pt',
                            fontWeight: 'bold',
                            margin: 0
                          }}>
                            {exp.position}
                          </h3>
                          <span style={{
                            fontSize: '10pt',
                            color: '#666666',
                            fontStyle: 'italic'
                          }}>
                            {exp.startDate && exp.endDate &&
                              `${formatDateToMMYYYY(exp.startDate)} - ${formatDateToMMYYYY(exp.endDate)}`
                            }
                          </span>
                        </div>
                        <div style={{
                          fontSize: '11pt',
                          marginBottom: '4px',
                          fontStyle: 'italic'
                        }}>
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                        {exp.description && (
                          <ul style={{
                            margin: '4px 0 0 20px',
                            padding: 0,
                            fontSize: '10pt',
                            lineHeight: '1.3'
                          }}>
                            {exp.description.split('\n').filter(line => line.trim()).map((line) => (
                              <li key={`${exp.id}-exp-${line.slice(0, 20)}`} style={{ marginBottom: '2px' }}>
                                {line.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {sections.projects.length > 0 && (
                  <div className="mb-6">
                    <h2 style={{
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '2px'
                    }}>
                      PROJECTS
                    </h2>
                    {sections.projects.map((project) => (
                      <div key={project.id} style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{
                            fontSize: '11pt',
                            fontWeight: 'bold',
                            margin: 0
                          }}>
                            {project.name}
                          </h3>
                          <span style={{
                            fontSize: '10pt',
                            color: '#666666',
                            fontStyle: 'italic'
                          }}>
                            {project.startDate && project.endDate &&
                              `${formatDateToMMYYYY(project.startDate)} - ${formatDateToMMYYYY(project.endDate)}`
                            }
                          </span>
                        </div>
                        {project.technologies && (
                          <div style={{
                            fontSize: '10pt',
                            marginBottom: '4px',
                            fontStyle: 'italic',
                            color: '#333333'
                          }}>
                            <strong>Technologies:</strong> {project.technologies}
                          </div>
                        )}
                        {project.url && (
                          <div style={{
                            fontSize: '10pt',
                            marginBottom: '4px',
                            color: '#0066cc',
                            wordBreak: 'break-all'
                          }}>
                            {project.url}
                          </div>
                        )}
                        {project.description && (
                          <ul style={{
                            margin: '4px 0 0 20px',
                            padding: 0,
                            fontSize: '10pt',
                            lineHeight: '1.3'
                          }}>
                            {project.description.split('\n').filter(line => line.trim()).map((line) => (
                              <li key={`${project.id}-proj-${line.slice(0, 20)}`} style={{ marginBottom: '2px' }}>
                                {line.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {sections.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 style={{
                      fontSize: '12pt',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '2px'
                    }}>
                      TECHNICAL SKILLS
                    </h2>
                    {sections.skills.map((skill) => (
                      <div key={skill.id} style={{ marginBottom: '8px' }}>
                        <div style={{
                          fontSize: '11pt',
                          fontWeight: 'bold',
                          marginBottom: '2px'
                        }}>
                          {skill.category}:
                        </div>
                        <div style={{
                          fontSize: '10pt',
                          lineHeight: '1.3',
                          marginLeft: '10px'
                        }}>
                          {skill.skills}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
