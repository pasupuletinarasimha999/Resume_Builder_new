'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PDFDownload } from '@/components/PDFDownload'
import { ResumeSection } from '@/components/ResumeSection'
import { renderRichText } from '@/components/ui/rich-text-editor'

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
  linkedin: string
  summary: string
}

interface SectionItem {
  id: string
  isPresent?: boolean
  [key: string]: string | boolean | undefined
}

interface ResumeSections {
  education: SectionItem[]
  experience: SectionItem[]
  projects: SectionItem[]
  skills: SectionItem[]
}

// Helper function to render rich text content in preview
function renderRichTextContent(htmlContent: string) {
  if (!htmlContent) return null

  // Only render on client side to avoid SSR issues
  if (typeof window === 'undefined') {
    // Return server-safe fallback - strip HTML tags for plain text
    const plainText = htmlContent.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ')
    return <div>{plainText}</div>
  }

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  // Handle different HTML elements
  const result: React.ReactNode[] = []
  let key = 0

  const processNode = (node: Node): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      return text ? <span key={key++}>{text}</span> : null
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const children = Array.from(element.childNodes).map(processNode).filter(Boolean)

      switch (element.tagName.toLowerCase()) {
        case 'strong':
        case 'b':
          return <strong key={key++}>{children}</strong>
        case 'ul':
          return (
            <ul key={key++} style={{
              margin: '2px 0 0 16px',
              padding: 0,
              fontSize: '8pt',
              lineHeight: '1.2',
              listStyleType: 'disc',
              listStylePosition: 'outside'
            }}>
              {children}
            </ul>
          )
        case 'ol':
          return (
            <ol key={key++} style={{
              margin: '2px 0 0 16px',
              padding: 0,
              fontSize: '8pt',
              lineHeight: '1.2',
              listStyleType: 'decimal',
              listStylePosition: 'outside'
            }}>
              {children}
            </ol>
          )
        case 'li':
          return <li key={key++} style={{
            marginBottom: '1px',
            paddingLeft: '4px',
            display: 'list-item'
          }}>{children}</li>
        case 'br':
          return <br key={key++} />
        case 'div':
        case 'p':
          return <div key={key++}>{children}</div>
        default:
          return <span key={key++}>{children}</span>
      }
    }
    return null
  }

  for (const node of Array.from(tempDiv.childNodes)) {
    const processed = processNode(node)
    if (processed) result.push(processed)
  }

  return result.length > 0 ? result : null
}

// Helper function to format date to MM-YYYY or month name format
function formatDateToMMYYYY(dateString: string): string {
  if (!dateString) return ''

  // Handle "Present" or similar text
  if (dateString.toLowerCase() === 'present' || dateString.toLowerCase() === 'current') {
    return 'Present'
  }

  // If already in MM-YYYY format, convert to "Month YYYY" format for better readability
  if (/^\d{2}-\d{4}$/.test(dateString)) {
    const [month, year] = dateString.split('-')
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    const monthIndex = Number.parseInt(month) - 1
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${year}`
    }
    return dateString
  }

  // Try to parse as date and convert to "Month YYYY"
  try {
    const date = new Date(dateString)
    if (!Number.isNaN(date.getTime())) {
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
      const month = monthNames[date.getMonth()]
      const year = date.getFullYear()
      return `${month} ${year}`
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
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    summary: "Experienced Full Stack Developer with 4+ years of expertise in modern web technologies. Passionate about building scalable applications and leading development teams. Proven track record of improving system performance, implementing best practices, and delivering high-quality software solutions that drive business growth."
  })

  const [sections, setSections] = useState<ResumeSections>({
    education: [
      {
        id: 'edu1',
        school: 'Massachusetts Institute of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '09-2020',
        endDate: '06-2024',
        description: '<ul><li>Relevant Coursework: Data Structures and Algorithms, Machine Learning, Database Systems</li><li>Dean\'s List for 6 semesters with GPA 3.8/4.0</li><li>President of Computer Science Club, organized tech meetups and hackathons</li><li>Teaching Assistant for Introduction to Programming course</li></ul>'
      }
    ],
    experience: [
      {
        id: 'exp1',
        company: 'TechCorp Solutions',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '07-2023',
        endDate: 'Present',
        description: '<ul><li>Led development of microservices architecture serving 2M+ daily active users</li><li>Implemented CI/CD pipelines reducing deployment time by 60%</li><li>Mentored 5 junior developers and conducted technical interviews</li><li>Optimized database queries resulting in 40% performance improvement</li><li>Collaborated with cross-functional teams to deliver features on time</li></ul>'
      },
      {
        id: 'exp2',
        company: 'StartupX',
        position: 'Full Stack Developer',
        location: 'Austin, TX',
        startDate: '06-2022',
        endDate: '06-2023',
        description: '<ul><li>Built responsive web applications using React, Node.js, and MongoDB</li><li>Developed RESTful APIs handling 10K+ requests per minute</li><li>Implemented real-time features using WebSocket technology</li><li>Increased user engagement by 35% through UI/UX improvements</li></ul>'
      }
    ],
    projects: [
      {
        id: 'proj1',
        name: 'AI-Powered Resume Builder',
        technologies: 'React, Next.js, TypeScript, OpenAI API, PostgreSQL',
        url: 'https://github.com/username/resume-builder',
        startDate: '01-2024',
        endDate: '04-2024',
        description: '<ul><li>Developed intelligent resume builder with AI-powered content suggestions</li><li>Integrated OpenAI API for dynamic content generation and optimization</li><li>Implemented PDF generation with custom styling and formatting</li><li>Built rich text editor with bullet point support and real-time preview</li><li>Deployed on Vercel with automated testing and CI/CD pipeline</li></ul>'
      },
      {
        id: 'proj2',
        name: 'E-commerce Analytics Dashboard',
        technologies: 'Python, Django, React, D3.js, Redis, Docker',
        url: 'https://github.com/username/analytics-dashboard',
        startDate: '09-2023',
        endDate: '12-2023',
        description: '<ul><li>Created comprehensive analytics dashboard for e-commerce businesses</li><li>Implemented real-time data visualization with interactive charts and graphs</li><li>Built data processing pipeline handling 1M+ transactions daily</li><li>Designed responsive frontend with advanced filtering and export capabilities</li><li>Optimized performance using Redis caching and database indexing</li></ul>'
      }
    ],
    skills: [
      {
        id: 'skill1',
        category: 'Programming Languages',
        skills: 'JavaScript, TypeScript, Python, Java, Go, SQL'
      },
      {
        id: 'skill2',
        category: 'Frontend Technologies',
        skills: 'React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS, SASS'
      },
      {
        id: 'skill3',
        category: 'Backend Technologies',
        skills: 'Node.js, Express, Django, FastAPI, PostgreSQL, MongoDB, Redis'
      },
      {
        id: 'skill4',
        category: 'Tools & DevOps',
        skills: 'Git, Docker, Kubernetes, AWS, CI/CD, Jest, Webpack, Linux'
      }
    ]
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

  const updateSectionItem = (sectionName: keyof ResumeSections, id: string, field: string, value: string | boolean) => {
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
        { key: 'description', label: 'Description', type: 'richtext' as const, placeholder: 'Relevant coursework, achievements, etc.' }
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
        { key: 'description', label: 'Description', type: 'richtext' as const, placeholder: 'Key responsibilities and achievements...' }
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
        { key: 'description', label: 'Description', type: 'richtext' as const, placeholder: 'Brief description of the project...' }
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
            <PDFDownload resumeData={resumeData} sections={sections} />
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

                    <div className="col-span-2">
                      <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={resumeData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="e.g., linkedin.com/in/yourprofile"
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
                isExperience={true}
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
          <div className="w-[500px] bg-gray-100 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-2">
              <div
                className="bg-white text-black"
                id="resume-preview"
                style={{
                  fontFamily: 'Calibri, Arial, sans-serif',
                  width: '100%',
                  maxWidth: '460px',
                  minHeight: '650px',
                  margin: '0 auto',
                  padding: '20px',
                  fontSize: '9pt',
                  lineHeight: '1.3',
                  color: '#000000',
                  transform: 'scale(1)',
                  transformOrigin: 'top left',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div className="text-center mb-6 border-b-2 border-gray-900 pb-4">
                  <h1 style={{
                    fontSize: '14pt',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {resumeData.fullName}
                  </h1>
                  <div style={{
                    fontSize: '8pt',
                    color: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span>{resumeData.email}</span>
                    <span>|</span>
                    <span>{resumeData.phone}</span>
                    <span>|</span>
                    <span>{resumeData.location}</span>
                    {resumeData.linkedin && (
                      <>
                        <span>|</span>
                        <span style={{ color: '#0066cc' }}>{resumeData.linkedin}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                {resumeData.summary && (
                  <div className="mb-4">
                    <h2 style={{
                      fontSize: '8pt',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '0px'
                    }}>
                      PROFESSIONAL SUMMARY
                    </h2>
                    <div style={{
                      fontSize: '9pt',
                      lineHeight: '1.3',
                      textAlign: 'justify'
                    }}>
                      {resumeData.summary}
                    </div>
                  </div>
                )}

                {/* Education */}
                {sections.education.length > 0 && (
                  <div className="mb-4">
                    <h2 style={{
                      fontSize: '8pt',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '0px'
                    }}>
                      EDUCATION
                    </h2>
                    {sections.education.map((edu) => (
                      <div key={edu.id} style={{ marginBottom: '6px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{
                            fontSize: '9pt',
                            fontWeight: 'bold',
                            margin: 0
                          }}>
                            {edu.school}
                          </h3>
                          <span style={{
                            fontSize: '8pt',
                            color: '#666666',
                            fontStyle: 'italic'
                          }}>
                            {(edu.startDate || edu.endDate) &&
                              `${edu.startDate && typeof edu.startDate === 'string' ? formatDateToMMYYYY(edu.startDate) : ''}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate && typeof edu.endDate === 'string' ? formatDateToMMYYYY(edu.endDate) : ''}`
                            }
                          </span>
                        </div>
                        <div style={{
                          fontSize: '9pt',
                          marginBottom: '4px',
                          fontStyle: 'italic'
                        }}>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </div>
                        {edu.description && (
                          <div style={{
                            margin: '4px 0 0 0',
                            fontSize: '8pt',
                            lineHeight: '1.2'
                          }}>
                            {renderRichTextContent(edu.description as string)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience */}
                {sections.experience.length > 0 && (
                  <div className="mb-4">
                    <h2 style={{
                      fontSize: '8pt',
                      fontWeight: 'bold',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '0px'
                    }}>
                      PROFESSIONAL EXPERIENCE
                    </h2>
                    {sections.experience.map((exp) => (
                      <div key={exp.id} style={{ marginBottom: '6px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '2px'
                        }}>
                          <h3 style={{
                            fontSize: '9pt',
                            fontWeight: 'bold',
                            margin: 0
                          }}>
                            {exp.position}
                          </h3>
                          <div style={{
                            textAlign: 'right',
                            fontSize: '8pt',
                            color: '#666666',
                            fontStyle: 'italic',
                            lineHeight: '1.2'
                          }}>
                            <div>
                              {(exp.startDate || exp.endDate) &&
                                `${exp.startDate && typeof exp.startDate === 'string' ? formatDateToMMYYYY(exp.startDate) : ''}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate && typeof exp.endDate === 'string' ? formatDateToMMYYYY(exp.endDate) : ''}`
                              }
                            </div>
                            {exp.location && (
                              <div style={{ marginTop: '1px' }}>
                                {exp.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '9pt',
                          marginBottom: '4px',
                          fontStyle: 'italic'
                        }}>
                          {exp.company}
                        </div>
                        {exp.description && (
                          <div style={{
                            margin: '4px 0 0 0',
                            fontSize: '8pt',
                            lineHeight: '1.2'
                          }}>
                            {renderRichTextContent(exp.description as string)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {sections.projects.length > 0 && (
                  <div className="mb-4">
                    <h2 style={{
                      fontSize: '8pt',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '0px'
                    }}>
                      PROJECTS
                    </h2>
                    {sections.projects.map((project) => (
                      <div key={project.id} style={{ marginBottom: '6px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <h3 style={{
                            fontSize: '9pt',
                            fontWeight: 'bold',
                            margin: 0
                          }}>
                            {project.name}
                          </h3>
                          <span style={{
                            fontSize: '8pt',
                            color: '#666666',
                            fontStyle: 'italic'
                          }}>
                            {(project.startDate || project.endDate) &&
                              `${project.startDate && typeof project.startDate === 'string' ? formatDateToMMYYYY(project.startDate) : ''}${project.startDate && project.endDate ? ' - ' : ''}${project.endDate && typeof project.endDate === 'string' ? formatDateToMMYYYY(project.endDate) : ''}`
                            }
                          </span>
                        </div>
                        {project.technologies && (
                          <div style={{
                            fontSize: '8pt',
                            marginBottom: '4px',
                            fontStyle: 'italic',
                            color: '#333333'
                          }}>
                            <strong>Technologies:</strong> {project.technologies}
                          </div>
                        )}
                        {project.url && (
                          <div style={{
                            fontSize: '8pt',
                            marginBottom: '4px',
                            color: '#0066cc',
                            wordBreak: 'break-all'
                          }}>
                            {project.url}
                          </div>
                        )}
                        {project.description && (
                          <div style={{
                            margin: '4px 0 0 0',
                            fontSize: '8pt',
                            lineHeight: '1.2'
                          }}>
                            {renderRichTextContent(project.description as string)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {sections.skills.length > 0 && (
                  <div className="mb-4">
                    <h2 style={{
                      fontSize: '8pt',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid #ccc',
                      paddingBottom: '0px'
                    }}>
                      TECHNICAL SKILLS
                    </h2>
                    {sections.skills.map((skill) => (
                      <div key={skill.id} style={{ marginBottom: '4px' }}>
                        <div style={{
                          fontSize: '9pt',
                          fontWeight: 'bold',
                          marginBottom: '2px'
                        }}>
                          {skill.category}:
                        </div>
                        <div style={{
                          fontSize: '8pt',
                          lineHeight: '1.2',
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
