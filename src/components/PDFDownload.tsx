'use client'

import { Button } from '@/components/ui/button'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

interface SectionItem {
  id: string
  isPresent?: boolean
  [key: string]: string | boolean | undefined
}

interface PDFDownloadProps {
  resumeData: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    summary: string
  }
  sections: {
    education: SectionItem[]
    experience: SectionItem[]
    projects: SectionItem[]
    skills: SectionItem[]
    languages: SectionItem[]
    social: SectionItem[]
    awards: SectionItem[]
    certifications: SectionItem[]
  }
  sectionOrder?: Array<{
    id: string
    name: string
    icon: string
  }>
}

// PDF Styles with proper margins
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: '10mm', // Further reduced top margin
    paddingTop: '8mm', // Minimal top padding to reduce gap
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
    borderBottom: '2pt solid #000000',
    paddingBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 9,
    color: '#333333',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #cccccc',
    paddingBottom: 0,
    marginBottom: 4,
  },
  sectionItem: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  companyLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    marginTop: 0,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  itemDate: {
    fontSize: 9,
    color: '#000000',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  itemDateLocation: {
    fontSize: 8,
    color: '#000000',
    fontStyle: 'italic',
    textAlign: 'right',
    lineHeight: 1.2,
  },
  itemSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 0,
    color: '#333333',
  },
  itemDescription: {
    fontSize: 11,
    lineHeight: 1.3,
    textAlign: 'justify',
    marginTop: 0,
  },
  skillCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  skillList: {
    fontSize: 10,
    lineHeight: 1.4,
    marginLeft: 8,
    marginBottom: 3,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  bulletPoint: {
    marginLeft: 10,
    marginBottom: 2,
  },
})

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  if (dateString.toLowerCase() === 'present' || dateString.toLowerCase() === 'current') {
    return 'Present'
  }

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
  }

  return dateString
}

// Helper function to render formatted text content for PDF
const renderFormattedText = (htmlContent: string) => {
  if (!htmlContent) return null

  // Split content into paragraphs and list items
  const lines = htmlContent
    .replace(/<strong>(.*?)<\/strong>/g, '$1')
    .replace(/<b>(.*?)<\/b>/g, '$1')
    .replace(/<ul>/g, '')
    .replace(/<\/ul>/g, '')
    .replace(/<ol>/g, '')
    .replace(/<\/ol>/g, '')
    .replace(/<li>/g, '• ')
    .replace(/<\/li>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<div>/g, '')
    .replace(/<\/div>/g, '\n')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .filter(line => line.trim())

  return lines.map((line, index) => (
    <Text key={`line-${index}-${line.slice(0, 10)}`} style={[
      styles.itemDescription,
      line.trim().startsWith('•') ? { marginLeft: 8, marginBottom: 2 } : {}
    ]}>
      {line.trim()}
    </Text>
  ))
}

// Default section order for fallback
const DEFAULT_SECTION_ORDER = [
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'experience', name: 'Experience', icon: '💼' },
  { id: 'projects', name: 'Projects', icon: '🚀' },
  { id: 'skills', name: 'Skills', icon: '🛠️' },
  { id: 'languages', name: 'Languages', icon: '🌐' },
  { id: 'social', name: 'Social Media', icon: '📱' },
  { id: 'awards', name: 'Awards', icon: '🏆' },
  { id: 'certifications', name: 'Certifications', icon: '📜' }
]

// Individual PDF section rendering functions
const renderEducationPDF = (educationData: SectionItem[]) => {
  if (educationData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>EDUCATION</Text>
      {educationData.map((edu) => (
        <View key={edu.id} style={styles.sectionItem}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{edu.school}</Text>
            <Text style={styles.itemDate}>
              {(edu.startDate || edu.endDate) &&
                `${edu.startDate ? formatDate(edu.startDate as string) : ''}${edu.startDate && edu.endDate ? ' - ' : ''}${edu.endDate ? formatDate(edu.endDate as string) : ''}`
              }
            </Text>
          </View>
          <Text style={styles.itemSubtitle}>
            {edu.degree} {edu.field && `in ${edu.field}`}
          </Text>
          {edu.description && (
            <View>
              {renderFormattedText(edu.description as string)}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

const renderExperiencePDF = (experienceData: SectionItem[]) => {
  if (experienceData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
      {experienceData.map((exp) => (
        <View key={exp.id} style={styles.sectionItem}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{exp.position}</Text>
            <Text style={styles.itemDate}>
              {(exp.startDate || exp.endDate) &&
                `${exp.startDate ? formatDate(exp.startDate as string) : ''}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate ? formatDate(exp.endDate as string) : ''}`
              }
            </Text>
          </View>
          <View style={styles.companyLocationRow}>
            <Text style={styles.itemSubtitle}>
              {exp.company}
            </Text>
            {exp.location && (
              <Text style={[styles.itemDate, { fontSize: 8 }]}>
                {exp.location}
              </Text>
            )}
          </View>
          {exp.description && (
            <View>
              {renderFormattedText(exp.description as string)}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

const renderProjectsPDF = (projectsData: SectionItem[]) => {
  if (projectsData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROJECTS</Text>
      {projectsData.map((project) => (
        <View key={project.id} style={styles.sectionItem}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{project.name}</Text>
            <Text style={styles.itemDate}>
              {(project.startDate || project.endDate) &&
                `${project.startDate ? formatDate(project.startDate as string) : ''}${project.startDate && project.endDate ? ' - ' : ''}${project.endDate ? formatDate(project.endDate as string) : ''}`
              }
            </Text>
          </View>
          {project.technologies && (
            <Text style={styles.itemSubtitle}>
              Technologies: {project.technologies}
            </Text>
          )}
          {project.url && (
            <Text style={[styles.itemSubtitle, { color: '#0066cc' }]}>
              {project.url}
            </Text>
          )}
          {project.description && (
            <View>
              {renderFormattedText(project.description as string)}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

const renderSkillsPDF = (skillsData: SectionItem[]) => {
  if (skillsData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
      {skillsData.map((skill) => (
        <View key={skill.id} style={[styles.sectionItem, { marginBottom: 0 }]}>
          <Text style={styles.skillCategory}>{skill.category}:</Text>
          <Text style={styles.skillList}>{skill.skills}</Text>
        </View>
      ))}
    </View>
  )
}

const renderLanguagesPDF = (languagesData: SectionItem[]) => {
  if (languagesData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>LANGUAGES</Text>
      <Text style={[styles.itemDescription, { fontSize: 11, lineHeight: 1.3 }]}>
        {languagesData
          .map((language) => `${language.language} [${language.proficiency}]`)
          .join(', ')
        }
      </Text>
    </View>
  )
}

const renderSocialPDF = (socialData: SectionItem[]) => {
  if (socialData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SOCIAL MEDIA</Text>
      {socialData.map((social) => (
        <View key={social.id} style={[styles.sectionItem, { marginBottom: 4 }]}>
          <View style={styles.itemHeader}>
            <Text style={styles.skillCategory}>{social.platform}:</Text>
            <Text style={[styles.itemDate, { fontSize: 8, color: '#0066cc' }]}>
              {social.url}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const renderAwardsPDF = (awardsData: SectionItem[]) => {
  if (awardsData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AWARDS & ACHIEVEMENTS</Text>
      {awardsData.map((award) => (
        <View key={award.id} style={styles.sectionItem}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{award.title}</Text>
            <Text style={styles.itemDate}>
              {award.date ? formatDate(award.date as string) : ''}
            </Text>
          </View>
          <Text style={styles.itemSubtitle}>{award.organization}</Text>
          {award.description && (
            <Text style={styles.itemDescription}>{award.description}</Text>
          )}
        </View>
      ))}
    </View>
  )
}

const renderCertificationsPDF = (certificationsData: SectionItem[]) => {
  if (certificationsData.length === 0) return null
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
      {/* Group certificates in pairs for side-by-side layout */}
      {Array.from({ length: Math.ceil(certificationsData.length / 2) }, (_, rowIndex) => {
        const rowCerts = certificationsData.slice(rowIndex * 2, rowIndex * 2 + 2)
        const rowKey = rowCerts.map(cert => cert.id).join('-')
        return (
          <View key={rowKey} style={{
            flexDirection: 'row',
            marginBottom: 10
          }}>
            {rowCerts.map((cert, colIndex) => (
            <View key={cert.id} style={{
              width: rowCerts.length === 1
                ? '100%' : colIndex === 0 ? '48%' : '48%',
              marginRight: colIndex === 0 && rowCerts.length > 1 ? '4%' : '0%',
              padding: 8,
              border: '1pt solid #d0d0d0',
              borderRadius: 2,
              backgroundColor: '#f8f8f8'
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: 'bold',
                marginBottom: 4,
                lineHeight: 1.3,
                color: '#000000'
              }}>
                {cert.name}
              </Text>
              <Text style={{
                fontSize: 10,
                marginBottom: 3,
                fontStyle: 'italic',
                color: '#000000',
                lineHeight: 1.2
              }}>
                {cert.issuer}
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: 3,
                lineHeight: 1.2
              }}>
                {cert.date && cert.expiryDate ?
                  `${formatDate(cert.date as string)} - ${formatDate(cert.expiryDate as string)}` :
                  cert.date ? formatDate(cert.date as string) : ''
                }
              </Text>
              {cert.credentialId && (
                <Text style={{
                  fontSize: 9,
                  color: '#000000',
                  lineHeight: 1.2
                }}>
                  ID: {cert.credentialId}
                </Text>
              )}
            </View>
            ))}
          </View>
        )
      })}
    </View>
  )
}

// Dynamic PDF section renderer
const renderPDFSection = (sectionId: string, sections: PDFDownloadProps['sections']) => {
  switch (sectionId) {
    case 'education':
      return renderEducationPDF(sections.education)
    case 'experience':
      return renderExperiencePDF(sections.experience)
    case 'projects':
      return renderProjectsPDF(sections.projects)
    case 'skills':
      return renderSkillsPDF(sections.skills)
    case 'languages':
      return renderLanguagesPDF(sections.languages)
    case 'social':
      return renderSocialPDF(sections.social)
    case 'awards':
      return renderAwardsPDF(sections.awards)
    case 'certifications':
      return renderCertificationsPDF(sections.certifications)
    default:
      return null
  }
}

// PDF Document Component with dynamic section rendering
const ResumeDocument = ({ resumeData, sections, sectionOrder }: PDFDownloadProps) => {
  // Use provided section order or fall back to default
  const sectionsToRender = sectionOrder || DEFAULT_SECTION_ORDER

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Always at the top */}
        <View style={styles.header}>
          <Text style={styles.name}>{resumeData.fullName}</Text>
          <View style={styles.contactInfo}>
            <Text>{resumeData.email}</Text>
            <Text> | </Text>
            <Text>{resumeData.phone}</Text>
            <Text> | </Text>
            <Text>{resumeData.location}</Text>
            {resumeData.linkedin && (
              <>
                <Text> | </Text>
                <Text style={{ color: '#0066cc' }}>{resumeData.linkedin}</Text>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary - Always after header */}
        {resumeData.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summary}>{resumeData.summary}</Text>
          </View>
        )}

        {/* Dynamic sections based on sectionOrder */}
        {sectionsToRender.map((section) => (
          <View key={section.id}>
            {renderPDFSection(section.id, sections)}
          </View>
        ))}
      </Page>
    </Document>
  )
}

export function PDFDownload({ resumeData, sections, sectionOrder }: PDFDownloadProps) {
  const downloadPDF = async () => {
    try {
      // Generate PDF blob with proper text content and section order
      const blob = await pdf(<ResumeDocument resumeData={resumeData} sections={sections} sectionOrder={sectionOrder} />).toBlob()

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <Button
      onClick={downloadPDF}
      size="sm"
      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
    >
      📄 Download PDF
    </Button>
  )
}
