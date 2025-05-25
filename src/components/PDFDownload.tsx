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
  }
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
    fontSize: 18,
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
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #cccccc',
    paddingBottom: 4,
    marginBottom: 6,
  },
  sectionItem: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  itemDate: {
    fontSize: 9,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  itemDateLocation: {
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'right',
    lineHeight: 1.2,
  },
  itemSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 4,
    color: '#333333',
  },
  itemDescription: {
    fontSize: 9,
    lineHeight: 1.3,
    textAlign: 'justify',
    marginTop: 2,
  },
  skillCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  skillList: {
    fontSize: 8,
    lineHeight: 1.3,
    marginLeft: 8,
    marginBottom: 6,
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
      line.trim().startsWith('•') ? { marginLeft: 8, marginBottom: 1 } : {}
    ]}>
      {line.trim()}
    </Text>
  ))
}

// PDF Document Component
const ResumeDocument = ({ resumeData, sections }: PDFDownloadProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
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

      {/* Professional Summary */}
      {resumeData.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
          <Text style={styles.summary}>{resumeData.summary}</Text>
        </View>
      )}

      {/* Education */}
      {sections.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {sections.education.map((edu) => (
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
      )}

      {/* Experience */}
      {sections.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
          {sections.experience.map((exp) => (
            <View key={exp.id} style={styles.sectionItem}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <View style={styles.itemDateLocation}>
                  <Text>
                    {(exp.startDate || exp.endDate) &&
                      `${exp.startDate ? formatDate(exp.startDate as string) : ''}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate ? formatDate(exp.endDate as string) : ''}`
                    }
                  </Text>
                  {exp.location && (
                    <Text style={{ marginTop: 1 }}>
                      {exp.location}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.itemSubtitle}>
                {exp.company}
              </Text>
              {exp.description && (
                <View>
                  {renderFormattedText(exp.description as string)}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {sections.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROJECTS</Text>
          {sections.projects.map((project) => (
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
      )}

      {/* Skills */}
      {sections.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
          {sections.skills.map((skill) => (
            <View key={skill.id} style={[styles.sectionItem, { marginBottom: 8 }]}>
              <Text style={styles.skillCategory}>{skill.category}:</Text>
              <Text style={styles.skillList}>{skill.skills}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
)

export function PDFDownload({ resumeData, sections }: PDFDownloadProps) {
  const downloadPDF = async () => {
    try {
      // Generate PDF blob with proper text content
      const blob = await pdf(<ResumeDocument resumeData={resumeData} sections={sections} />).toBlob()

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
