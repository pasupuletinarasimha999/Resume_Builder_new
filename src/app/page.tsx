'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PDFDownload } from '@/components/PDFDownload'
import { ResumeSection } from '@/components/ResumeSection'
import { ResumeChecker } from '@/components/ResumeChecker'
import { renderRichText } from '@/components/ui/rich-text-editor'
import dynamic from 'next/dynamic'
import { AISuggestions } from '@/components/AISuggestions'
import { EnhancedAISuggestions } from '@/components/EnhancedAISuggestions'
import { JobMatcher } from '@/components/JobMatcher'
import EnhancedATSScoring from '@/components/EnhancedATSScoring'
import WritingAssistantEnhanced from '@/components/WritingAssistantEnhanced'
import KeywordOptimizationEngine from '@/components/KeywordOptimizationEngine'

const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor').then(mod => ({ default: mod.RichTextEditor })), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded-md animate-pulse" />
})
import { ClientOnlyRichText } from '@/components/ClientOnlyRichText'

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
  { id: 'certifications', name: 'Certifications', icon: 'https://ext.same-assets.com/3442189925/3927218253.svg' }
]

interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  summary: string
}

interface EducationItem {
  id: string
  school?: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
  description?: string
  isPresent?: boolean
  [key: string]: string | boolean | undefined
}

interface ExperienceItem {
  id: string
  company?: string
  position?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: string
  isPresent?: boolean
  [key: string]: string | boolean | undefined
}

interface ProjectItem {
  id: string
  name?: string
  technologies?: string
  url?: string
  startDate?: string
  endDate?: string
  description?: string
  [key: string]: string | boolean | undefined
}

interface SkillItem {
  id: string
  category?: string
  skills?: string
  [key: string]: string | boolean | undefined
}

interface LanguageItem {
  id: string
  language?: string
  proficiency?: string
  [key: string]: string | boolean | undefined
}

interface SocialItem {
  id: string
  platform?: string
  url?: string
  username?: string
  [key: string]: string | boolean | undefined
}

interface AwardItem {
  id: string
  title?: string
  organization?: string
  date?: string
  description?: string
  [key: string]: string | boolean | undefined
}

interface CertificationItem {
  id: string
  name?: string
  issuer?: string
  date?: string
  credentialId?: string
  expiryDate?: string
  [key: string]: string | boolean | undefined
}

interface ResumeSections {
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: SkillItem[]
  languages: LanguageItem[]
  social: SocialItem[]
  awards: AwardItem[]
  certifications: CertificationItem[]
}

interface SectionOrderItem {
  id: string
  name: string
  icon: string
}

interface JobOptimizations {
  summary?: string
  experience?: Array<{
    id: string
    optimizedDescription: string
    changes: number
  }>
  skills?: {
    missing: string[]
    recommended: string[]
    fromJob: string[]
  }
  keywords?: string[]
}

// Helper function to render rich text content in preview
function renderRichTextContent(htmlContent: string, customStyle?: React.CSSProperties) {
  if (!htmlContent) return null

  const defaultStyle = { fontSize: '8pt', lineHeight: '1.2' }
  const style = customStyle ? { ...defaultStyle, ...customStyle } : defaultStyle

  // Check if content contains HTML tags
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(htmlContent)

  if (!hasHtml) {
    // If it's plain text, render it directly
    return (
      <div style={style}>
        {htmlContent}
      </div>
    )
  }

  // If it has HTML, use the ClientOnlyRichText component
  return (
    <ClientOnlyRichText
      content={htmlContent}
      style={style}
    />
  )
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
  const [activeSection, setActiveSection] = useState<string>('basic')
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false)
  const [showReorderModal, setShowReorderModal] = useState<boolean>(false)
  const [showResumeChecker, setShowResumeChecker] = useState<boolean>(false)
  const [showJobMatcher, setShowJobMatcher] = useState<boolean>(false)
  const [showEnhancedAI, setShowEnhancedAI] = useState<boolean>(false)
  const [showEnhancedATS, setShowEnhancedATS] = useState<boolean>(false)
  const [showWritingAssistant, setShowWritingAssistant] = useState<boolean>(false)
  const [showKeywordOptimizer, setShowKeywordOptimizer] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert resumeSections to state for reordering
  const [sectionOrder, setSectionOrder] = useState<SectionOrderItem[]>([
    { id: 'basic', name: 'Basic', icon: 'https://ext.same-assets.com/3442189925/3783633550.svg' },
    { id: 'education', name: 'Education', icon: 'https://ext.same-assets.com/3442189925/3160495444.svg' },
    { id: 'experience', name: 'Work Experience', icon: 'https://ext.same-assets.com/3442189925/3810376176.svg' },
    { id: 'projects', name: 'Projects', icon: 'https://ext.same-assets.com/3442189925/1109834275.svg' },
    { id: 'skills', name: 'Skills', icon: 'https://ext.same-assets.com/3442189925/3410870790.svg' },
    { id: 'languages', name: 'Languages', icon: 'https://ext.same-assets.com/3442189925/3304711307.svg' },
    { id: 'social', name: 'Social Media', icon: 'https://ext.same-assets.com/3442189925/3272116947.svg' },
    { id: 'awards', name: 'Awards', icon: 'https://ext.same-assets.com/3442189925/1967388618.svg' },
    { id: 'certifications', name: 'Certifications', icon: 'https://ext.same-assets.com/3442189925/3927218253.svg' }
  ])
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
    ],
    languages: [
      {
        id: 'lang1',
        language: 'English',
        proficiency: 'Native Proficiency'
      },
      {
        id: 'lang2',
        language: 'Spanish',
        proficiency: 'Professional Working'
      },
      {
        id: 'lang3',
        language: 'Telugu',
        proficiency: 'Native Proficiency'
      },
      {
        id: 'lang4',
        language: 'French',
        proficiency: 'Elementary'
      }
    ],
    social: [
      {
        id: 'social1',
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/alexjohnson',
        username: 'alexjohnson'
      },
      {
        id: 'social2',
        platform: 'GitHub',
        url: 'https://github.com/alexjohnson',
        username: 'alexjohnson'
      }
    ],
    awards: [
      {
        id: 'award1',
        title: 'Employee of the Year',
        organization: 'TechCorp Solutions',
        date: '12-2023',
        description: 'Recognized for outstanding performance in leading critical projects and mentoring team members'
      }
    ],
    certifications: [
      {
        id: 'cert1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: 'Aug 2021',
        credentialId: 'AWS-CSA-2023-001',
        expiryDate: 'Aug 2025'
      },
      {
        id: 'cert2',
        name: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        date: 'Mar 2022',
        credentialId: 'GCP-PD-2022-456',
        expiryDate: 'Mar 2024'
      },
      {
        id: 'cert3',
        name: 'Microsoft Azure Fundamentals',
        issuer: 'Microsoft',
        date: 'Jan 2023',
        credentialId: 'AZ-900-789',
        expiryDate: 'Jan 2026'
      },
      {
        id: 'cert4',
        name: 'Certified Kubernetes Administrator',
        issuer: 'Cloud Native Computing Foundation',
        date: 'Sep 2023',
        credentialId: 'CKA-2023-012',
        expiryDate: 'Sep 2026'
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

  // Save data functionality
  const handleSaveData = () => {
    const dataToSave = {
      resumeData,
      sections,
      timestamp: new Date().toISOString(),
      version: "1.0"
    }

    const jsonString = JSON.stringify(dataToSave, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    // Sanitize fullName for filename (replace spaces and special characters with underscores)
    const sanitizedName = resumeData.fullName.replace(/[^a-zA-Z0-9]/g, '_')

    const link = document.createElement('a')
    link.href = url
    link.download = `${sanitizedName}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Load data functionality
  const handleLoadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)

        // Validate the JSON structure
        if (!jsonData.resumeData || !jsonData.sections) {
          alert('Invalid file format. Please select a valid resume data file.')
          return
        }

        // Update the state with loaded data
        setResumeData(jsonData.resumeData)
        setSections(jsonData.sections)

        alert('Resume data loaded successfully!')
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid JSON file.')
        console.error('JSON parsing error:', error)
      }
    }

    reader.readAsText(file)
    // Reset the file input so the same file can be loaded again if needed
    event.target.value = ''
  }

  // Reorder functionality
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData('text/plain'))

    if (dragIndex === dropIndex) return

    const newOrder = [...sectionOrder]
    const draggedItem = newOrder[dragIndex]

    // Remove dragged item
    newOrder.splice(dragIndex, 1)
    // Insert at new position
    newOrder.splice(dropIndex, 0, draggedItem)

    setSectionOrder(newOrder)
  }

  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder]
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1

    if (toIndex < 0 || toIndex >= newOrder.length) return

    // Swap sections
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]]
    setSectionOrder(newOrder)
  }

  const resetSectionOrder = () => {
    setSectionOrder([
      { id: 'basic', name: 'Basic', icon: 'https://ext.same-assets.com/3442189925/3783633550.svg' },
      { id: 'education', name: 'Education', icon: 'https://ext.same-assets.com/3442189925/3160495444.svg' },
      { id: 'experience', name: 'Work Experience', icon: 'https://ext.same-assets.com/3442189925/3810376176.svg' },
      { id: 'projects', name: 'Projects', icon: 'https://ext.same-assets.com/3442189925/1109834275.svg' },
      { id: 'skills', name: 'Skills', icon: 'https://ext.same-assets.com/3442189925/3410870790.svg' },
      { id: 'languages', name: 'Languages', icon: 'https://ext.same-assets.com/3442189925/3304711307.svg' },
      { id: 'social', name: 'Social Media', icon: 'https://ext.same-assets.com/3442189925/3272116947.svg' },
      { id: 'awards', name: 'Awards', icon: 'https://ext.same-assets.com/3442189925/1967388618.svg' },
      { id: 'certifications', name: 'Certifications', icon: 'https://ext.same-assets.com/3442189925/3927218253.svg' }
    ])
  }

  const handleApplyAISuggestion = (sectionName: string, content: string) => {
    // Apply AI suggestion to the appropriate section
    if (sectionName === 'summary') {
      setResumeData(prev => ({ ...prev, summary: content }))
    }
    // Add more cases as needed
  }

  const handleApplyEnhancedAISuggestion = (content: string, type: string) => {
    // Handle different types of AI suggestions
    switch (type) {
      case 'summary':
        setResumeData(prev => ({ ...prev, summary: content }))
        break
      case 'description':
      case 'achievement':
      case 'bullet_point':
        // For now, just copy to clipboard and show notification
        navigator.clipboard.writeText(content)
        alert('Content copied to clipboard! You can paste it into the relevant section.')
        break
      default:
        console.log('Unknown suggestion type:', type)
    }
  }

  const handleApplyJobOptimizations = (optimizations: JobOptimizations) => {
    // Apply job-specific optimizations
    if (optimizations.summary) {
      setResumeData(prev => ({ ...prev, summary: optimizations.summary || '' }))
    }
    if (optimizations.experience) {
      // Update experience with optimized descriptions
      setSections(prev => ({
        ...prev,
        experience: prev.experience.map((exp) => {
          const optimization = optimizations.experience?.find(opt => opt.id === exp.id)
          return optimization ? { ...exp, description: optimization.optimizedDescription } : exp
        })
      }))
    }
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
    },
    languages: {
      title: 'Languages',
      fields: [
        { key: 'language', label: 'Language', type: 'text' as const, placeholder: 'e.g., English' },
        {
          key: 'proficiency',
          label: 'Proficiency Level',
          type: 'select' as const,
          placeholder: 'Select proficiency level',
          options: [
            'Fundamental Proficiency',
            'Elementary',
            'Limited Working',
            'Professional Working',
            'Native Proficiency'
          ]
        }
      ]
    },
    social: {
      title: 'Social Media',
      fields: [
        { key: 'platform', label: 'Platform', type: 'text' as const, placeholder: 'e.g., LinkedIn, GitHub, Twitter' },
        { key: 'username', label: 'Username', type: 'text' as const, placeholder: 'e.g., johndoe' },
        { key: 'url', label: 'Profile URL', type: 'text' as const, placeholder: 'https://...' }
      ]
    },
    awards: {
      title: 'Awards',
      fields: [
        { key: 'title', label: 'Award Title', type: 'text' as const, placeholder: 'e.g., Employee of the Year' },
        { key: 'organization', label: 'Organization', type: 'text' as const, placeholder: 'e.g., TechCorp Solutions' },
        { key: 'date', label: 'Date Received', type: 'text' as const, placeholder: 'MM-YYYY (e.g., 12-2023)' },
        { key: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Brief description of the award...' }
      ]
    },
    certifications: {
      title: 'Certifications',
      fields: [
        { key: 'name', label: 'Certification Name', type: 'text' as const, placeholder: 'e.g., AWS Certified Solutions Architect' },
        { key: 'issuer', label: 'Issuing Organization', type: 'text' as const, placeholder: 'e.g., Amazon Web Services' },
        { key: 'date', label: 'Issue Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., Aug 2021)' },
        { key: 'expiryDate', label: 'Expiry Date', type: 'text' as const, placeholder: 'MM-YYYY (e.g., Aug 2025) - Will show as range: Aug 2021 - Aug 2025' },
        { key: 'credentialId', label: 'Credential ID', type: 'text' as const, placeholder: 'e.g., AWS-CSA-2023-001' }
      ]
    }
  }

  const renderPreviewSection = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return null // Basic info is always at the top, not part of reorderable sections
      case 'education':
        return sections.education.length > 0 && (
          <div className="mb-4" key="education">
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
                    color: '#000000',
                    fontStyle: 'italic'
                  }}>
                    {(edu.startDate || edu.endDate) &&
                      `${edu.startDate && typeof edu.startDate === 'string' ? formatDateToMMYYYY(edu.startDate) : ''}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate && typeof edu.endDate === 'string' ? formatDateToMMYYYY(edu.endDate) : ''}`
                    }
                  </span>
                </div>
                <div style={{
                  fontSize: '9pt',
                  marginBottom: '0px',
                  fontStyle: 'italic'
                }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </div>
                {edu.description && (
                  <div style={{
                    margin: '0px 0 0 0',
                    fontSize: '8pt',
                    lineHeight: '1.2'
                  }}>
                    {renderRichTextContent(edu.description as string)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      case 'experience':
        return sections.experience.length > 0 && (
          <div className="mb-4" key="experience">
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
                  marginBottom: '0px'
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
                    color: '#000000',
                    fontStyle: 'italic',
                    lineHeight: '1.2'
                  }}>
                    <div>
                      {(exp.startDate || exp.endDate) &&
                        `${exp.startDate && typeof exp.startDate === 'string' ? formatDateToMMYYYY(exp.startDate) : ''}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate && typeof exp.endDate === 'string' ? formatDateToMMYYYY(exp.endDate) : ''}`
                      }
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '9pt',
                  marginBottom: '0px',
                  marginTop: '0px',
                  fontStyle: 'italic'
                }}>
                  <span>{exp.company}</span>
                  {exp.location && (
                    <span style={{
                      fontSize: '8pt',
                      color: '#000000'
                    }}>
                      {exp.location}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <div style={{
                    margin: '0px 0 0 0',
                    fontSize: '8pt',
                    lineHeight: '1.2'
                  }}>
                    {renderRichTextContent(exp.description as string)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      case 'projects':
        return sections.projects.length > 0 && (
          <div className="mb-4" key="projects">
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
                    color: '#000000',
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
                    margin: '1px 0 0 0',
                    fontSize: '8pt',
                    lineHeight: '1.2'
                  }}>
                    {renderRichTextContent(project.description as string)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      case 'skills':
        return sections.skills.length > 0 && (
          <div className="mb-4" key="skills">
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
              <div key={skill.id} style={{ marginBottom: '2px' }}>
                <div style={{
                  fontSize: '9pt',
                  lineHeight: '1.4'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{skill.category}:</span> {skill.skills}
                </div>
              </div>
            ))}
          </div>
        )
      case 'languages':
        return sections.languages.length > 0 && (
          <div className="mb-4" key="languages">
            <h2 style={{
              fontSize: '8pt',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ccc',
              paddingBottom: '0px'
            }}>
              LANGUAGES
            </h2>
            <div style={{
              fontSize: '11pt',
              lineHeight: '1.3'
            }}>
              {sections.languages
                .map((language) => `${language.language} [${language.proficiency}]`)
                .join(', ')
              }
            </div>
          </div>
        )
      case 'social':
        return sections.social.length > 0 && (
          <div className="mb-4" key="social">
            <h2 style={{
              fontSize: '8pt',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ccc',
              paddingBottom: '0px'
            }}>
              SOCIAL MEDIA
            </h2>
            {sections.social.map((social) => (
              <div key={social.id} style={{ marginBottom: '4px' }}>
                <div style={{
                  fontSize: '9pt',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{social.platform}:</span>
                  <span style={{
                    fontSize: '8pt',
                    color: '#0066cc',
                    wordBreak: 'break-all'
                  }}>
                    {social.url}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      case 'awards':
        return sections.awards.length > 0 && (
          <div className="mb-4" key="awards">
            <h2 style={{
              fontSize: '8pt',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ccc',
              paddingBottom: '0px'
            }}>
              AWARDS & ACHIEVEMENTS
            </h2>
            {sections.awards.map((award) => (
              <div key={award.id} style={{ marginBottom: '6px' }}>
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
                    {award.title}
                  </h3>
                  <span style={{
                    fontSize: '8pt',
                    color: '#000000',
                    fontStyle: 'italic'
                  }}>
                    {award.date && typeof award.date === 'string' ? formatDateToMMYYYY(award.date) : ''}
                  </span>
                </div>
                <div style={{
                  fontSize: '9pt',
                  marginBottom: '2px',
                  fontStyle: 'italic'
                }}>
                  {award.organization}
                </div>
                {award.description && (
                  <div style={{
                    margin: '2px 0 0 0',
                    fontSize: '8pt',
                    lineHeight: '1.2'
                  }}>
                    {award.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      case 'certifications':
        return sections.certifications.length > 0 && (
          <div className="mb-4" key="certifications">
            <h2 style={{
              fontSize: '8pt',
              fontWeight: 'bold',
              marginBottom: '10px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #ccc',
              paddingBottom: '0px'
            }}>
              CERTIFICATIONS
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              width: '100%'
            }}>
              {sections.certifications.map((cert) => (
                <div key={cert.id} style={{
                  padding: '6px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '4px',
                  backgroundColor: '#f8f8f8',
                  minHeight: '70px',
                  marginBottom: '4px'
                }}>
                  <h3 style={{
                    fontSize: '8pt',
                    fontWeight: 'bold',
                    margin: '0 0 3px 0',
                    lineHeight: '1.1'
                  }}>
                    {cert.name}
                  </h3>
                  <div style={{
                    fontSize: '7pt',
                    marginBottom: '2px',
                    fontStyle: 'italic',
                    color: '#555555'
                  }}>
                    {cert.issuer}
                  </div>
                  <div style={{
                    fontSize: '7pt',
                    color: '#666666',
                    fontWeight: 'bold',
                    marginBottom: '2px'
                  }}>
                    {cert.date && cert.expiryDate ?
                      `${formatDateToMMYYYY(cert.date as string)} - ${formatDateToMMYYYY(cert.expiryDate as string)}` :
                      cert.date ? formatDateToMMYYYY(cert.date as string) : ''
                    }
                  </div>
                  {cert.credentialId && (
                    <div style={{
                      fontSize: '6pt',
                      color: '#777777'
                    }}>
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const ReorderModal = () => {
    if (!showReorderModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Reorder Resume Sections</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReorderModal(false)}
            >
              ×
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            {sectionOrder.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 cursor-move transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={section.icon} alt={section.name} className="w-5 h-5" />
                  <span className="font-medium">{section.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 h-6 w-6"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sectionOrder.length - 1}
                    className="p-1 h-6 w-6"
                  >
                    ↓
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetSectionOrder}
              className="flex-1"
            >
              Reset to Default
            </Button>
            <Button
              onClick={() => setShowReorderModal(false)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Done
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            💡 Drag sections to reorder, or use arrow buttons. Changes apply to both preview and PDF.
          </p>
        </div>
      </div>
    )
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
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowReorderModal(true)}
              >
                Reorder
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Sample
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleLoadData}
              style={{ display: 'none' }}
            />
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
              onClick={() => fileInputRef.current?.click()}
            >
              📁 Load Data
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
              onClick={handleSaveData}
            >
              💾 Save Data
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
              onClick={() => setShowEnhancedAI(true)}
            >
              🪄 AI Content
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1"
              onClick={() => setShowJobMatcher(true)}
            >
              🎯 Job Matcher
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
              onClick={() => setShowResumeChecker(true)}
            >
              📊 Check Resume
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
              onClick={() => setShowEnhancedATS(true)}
            >
              🧠 AI ATS Score
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1"
              onClick={() => setShowWritingAssistant(true)}
            >
              ✍️ Writing Assistant
            </Button>
            <Button
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 py-1"
              onClick={() => setShowKeywordOptimizer(true)}
            >
              🔍 Keywords
            </Button>
            <PDFDownload resumeData={resumeData} sections={sections} sectionOrder={sectionOrder} />
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
            {sectionOrder.map((section) => (
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
                    <RichTextEditor
                      value={resumeData.summary}
                      onChange={(value) => handleInputChange('summary', value)}
                      placeholder="Write a brief professional summary..."
                      className="mt-1"
                    />

                    {/* AI Suggestions for Summary */}
                    <AISuggestions
                      sectionType="summary"
                      currentContent={resumeData.summary}
                      context={{
                        targetRole: "Software Engineer", // This could be made dynamic
                        experienceLevel: "senior"
                      }}
                      onApplySuggestion={(content) => handleInputChange('summary', content)}
                      onEnhanceContent={(enhanced) => handleInputChange('summary', enhanced)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'education' && (
              <>
                <ResumeSection
                  title={sectionConfigs.education.title}
                  items={sections.education}
                  onAddItem={() => addSectionItem('education')}
                  onUpdateItem={(id, field, value) => updateSectionItem('education', id, field, value)}
                  onDeleteItem={(id) => deleteSectionItem('education', id)}
                  fields={sectionConfigs.education.fields}
                />

                {/* AI Suggestions for Education */}
                <AISuggestions
                  sectionType="education"
                  context={{
                    industry: "Technology",
                    experienceLevel: "senior"
                  }}
                  onApplySuggestion={(content) => {
                    const newId = Math.random().toString(36).substr(2, 9)
                    setSections(prev => ({
                      ...prev,
                      education: [...prev.education, {
                        id: newId,
                        description: content,
                        school: "AI Suggested",
                        degree: "Degree",
                        field: "Field of Study"
                      }]
                    }))
                  }}
                />
              </>
            )}

            {activeSection === 'experience' && (
              <>
                <ResumeSection
                  title={sectionConfigs.experience.title}
                  items={sections.experience}
                  onAddItem={() => addSectionItem('experience')}
                  onUpdateItem={(id, field, value) => updateSectionItem('experience', id, field, value)}
                  onDeleteItem={(id) => deleteSectionItem('experience', id)}
                  fields={sectionConfigs.experience.fields}
                  isExperience={true}
                />

                {/* AI Suggestions for Experience */}
                <AISuggestions
                  sectionType="experience"
                  context={{
                    position: "Software Engineer",
                    company: "Tech Company",
                    industry: "Technology",
                    experienceLevel: "senior"
                  }}
                  onApplySuggestion={(content) => {
                    const newId = Math.random().toString(36).substr(2, 9)
                    setSections(prev => ({
                      ...prev,
                      experience: [...prev.experience, {
                        id: newId,
                        description: content,
                        company: "AI Suggested Company",
                        position: "Position Title",
                        location: "Location",
                        startDate: "MM-YYYY",
                        endDate: "MM-YYYY"
                      }]
                    }))
                  }}
                />
              </>
            )}

            {activeSection === 'projects' && (
              <>
                <ResumeSection
                  title={sectionConfigs.projects.title}
                  items={sections.projects}
                  onAddItem={() => addSectionItem('projects')}
                  onUpdateItem={(id, field, value) => updateSectionItem('projects', id, field, value)}
                  onDeleteItem={(id) => deleteSectionItem('projects', id)}
                  fields={sectionConfigs.projects.fields}
                />

                {/* AI Suggestions for Projects */}
                <AISuggestions
                  sectionType="projects"
                  context={{
                    industry: "Technology",
                    experienceLevel: "senior"
                  }}
                  onApplySuggestion={(content) => {
                    const newId = Math.random().toString(36).substr(2, 9)
                    setSections(prev => ({
                      ...prev,
                      projects: [...prev.projects, {
                        id: newId,
                        description: content,
                        name: "AI Suggested Project",
                        technologies: "React, Node.js, MongoDB",
                        url: "https://github.com/username/project"
                      }]
                    }))
                  }}
                />
              </>
            )}

            {activeSection === 'skills' && (
              <>
                <ResumeSection
                  title={sectionConfigs.skills.title}
                  items={sections.skills}
                  onAddItem={() => addSectionItem('skills')}
                  onUpdateItem={(id, field, value) => updateSectionItem('skills', id, field, value)}
                  onDeleteItem={(id) => deleteSectionItem('skills', id)}
                  fields={sectionConfigs.skills.fields}
                />

                {/* AI Suggestions for Skills */}
                <AISuggestions
                  sectionType="skills"
                  context={{
                    targetRole: "Software Engineer",
                    industry: "Technology"
                  }}
                  onApplySuggestion={(content) => {
                    const newId = Math.random().toString(36).substr(2, 9)
                    setSections(prev => ({
                      ...prev,
                      skills: [...prev.skills, {
                        id: newId,
                        category: "AI Suggested",
                        skills: content
                      }]
                    }))
                  }}
                />
              </>
            )}

            {activeSection === 'languages' && (
              <ResumeSection
                title={sectionConfigs.languages.title}
                items={sections.languages}
                onAddItem={() => addSectionItem('languages')}
                onUpdateItem={(id, field, value) => updateSectionItem('languages', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('languages', id)}
                fields={sectionConfigs.languages.fields}
                isLanguages={true}
              />
            )}

            {activeSection === 'social' && (
              <ResumeSection
                title={sectionConfigs.social.title}
                items={sections.social}
                onAddItem={() => addSectionItem('social')}
                onUpdateItem={(id, field, value) => updateSectionItem('social', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('social', id)}
                fields={sectionConfigs.social.fields}
              />
            )}

            {activeSection === 'awards' && (
              <ResumeSection
                title={sectionConfigs.awards.title}
                items={sections.awards}
                onAddItem={() => addSectionItem('awards')}
                onUpdateItem={(id, field, value) => updateSectionItem('awards', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('awards', id)}
                fields={sectionConfigs.awards.fields}
              />
            )}

            {activeSection === 'certifications' && (
              <ResumeSection
                title={sectionConfigs.certifications.title}
                items={sections.certifications}
                onAddItem={() => addSectionItem('certifications')}
                onUpdateItem={(id, field, value) => updateSectionItem('certifications', id, field, value)}
                onDeleteItem={(id) => deleteSectionItem('certifications', id)}
                fields={sectionConfigs.certifications.fields}
                isCertifications={true}
              />
            )}

            {!['basic', 'education', 'experience', 'projects', 'skills', 'languages', 'social', 'awards', 'certifications'].includes(activeSection) && (
              <Card className="rounded-xl p-6">
                <CardContent>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {sectionOrder.find(s => s.id === activeSection)?.name}
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
                    fontSize: '12pt',
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
                      {resumeData.summary ? (
                        // Check if content contains HTML tags
                        /<\/?[a-z][\s\S]*>/i.test(resumeData.summary) ? (
                          <ClientOnlyRichText
                            content={resumeData.summary}
                            style={{ fontSize: '9pt', lineHeight: '1.3' }}
                          />
                        ) : (
                          resumeData.summary
                        )
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Dynamic sections based on order */}
                {sectionOrder.filter(section => section.id !== 'basic').map(section =>
                  renderPreviewSection(section.id)
                ).filter(Boolean)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReorderModal />

      <ResumeChecker
        resumeData={resumeData}
        sections={sections}
        isOpen={showResumeChecker}
        onClose={() => setShowResumeChecker(false)}
      />

      <JobMatcher
        resumeData={resumeData}
        sections={sections}
        isOpen={showJobMatcher}
        onClose={() => setShowJobMatcher(false)}
        onApplyOptimizations={handleApplyJobOptimizations}
      />

      {/* Enhanced AI Suggestions Modal */}
      {showEnhancedAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Enhanced AI Content Generator</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEnhancedAI(false)}
                >
                  ×
                </Button>
              </div>
              <EnhancedAISuggestions onApplySuggestion={handleApplyEnhancedAISuggestion} />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced ATS Scoring Modal */}
      {showEnhancedATS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI-Enhanced ATS Scoring</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEnhancedATS(false)}
                >
                  ×
                </Button>
              </div>
              <EnhancedATSScoring
                resumeData={{
                  personalInfo: {
                    email: resumeData.email,
                    phone: resumeData.phone,
                    linkedin: resumeData.linkedin,
                    location: resumeData.location
                  },
                  workExperience: sections.experience?.map(exp => ({
                    id: exp.id,
                    company: exp.company || '',
                    position: exp.position || '',
                    startDate: exp.startDate || '',
                    endDate: exp.endDate || '',
                    description: exp.description || ''
                  })),
                  skills: sections.skills?.flatMap(skillGroup =>
                    skillGroup.skills?.split(',').map(skill => skill.trim()) || []
                  ) || [],
                  education: sections.education?.map(edu => ({
                    id: edu.id,
                    school: edu.school || '',
                    degree: edu.degree || '',
                    field: edu.field || '',
                    startDate: edu.startDate || '',
                    endDate: edu.endDate || ''
                  }))
                }}
                industry="technology"
                targetRole="Software Engineer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Writing Assistant Modal */}
      {showWritingAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Real-time Writing Assistant</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWritingAssistant(false)}
                >
                  ×
                </Button>
              </div>
              <WritingAssistantEnhanced
                text={resumeData.summary}
                context="summary"
                targetTone="professional"
                onChange={(newText) => handleInputChange('summary', newText)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Keyword Optimization Modal */}
      {showKeywordOptimizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Keyword Optimization Engine</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeywordOptimizer(false)}
                >
                  ×
                </Button>
              </div>
              <KeywordOptimizationEngine
                resumeText={JSON.stringify(resumeData) + JSON.stringify(sections)}
                industry="technology"
                targetRole="Software Engineer"
                onKeywordApply={(keyword, action, original) => {
                  // Handle keyword application logic
                  if (action === 'add') {
                    const currentSummary = resumeData.summary
                    const newSummary = currentSummary + (currentSummary ? '. ' : '') + keyword
                    handleInputChange('summary', newSummary)
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
