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
    padding: '15mm', // Reduced margins for more content space
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
    borderBottom: '2pt solid #000000',
    paddingBottom: 12,
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
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #cccccc',
    paddingBottom: 4,
    marginBottom: 10,
  },
  sectionItem: {
    marginBottom: 12,
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

// Helper function to convert rich text to plain text for PDF while preserving structure
const convertRichTextToPlain = (htmlContent: string): string => {
  if (!htmlContent) return ''

  return htmlContent
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
    .replace(/\n\n+/g, '\n')
    .replace(/^\n+|\n+$/g, '')
    .trim()
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
                <Text style={styles.itemDescription}>
                  {convertRichTextToPlain(edu.description as string)}
                </Text>
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
                <Text style={styles.itemDate}>
                  {(exp.startDate || exp.endDate) &&
                    `${exp.startDate ? formatDate(exp.startDate as string) : ''}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate ? formatDate(exp.endDate as string) : ''}`
                  }
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {exp.company} {exp.location && `• ${exp.location}`}
              </Text>
              {exp.description && (
                <Text style={styles.itemDescription}>
                  {convertRichTextToPlain(exp.description as string)}
                </Text>
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
                <Text style={styles.itemDescription}>
                  {convertRichTextToPlain(project.description as string)}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {sections.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          {sections.skills.map((skill) => (
            <View key={skill.id} style={styles.sectionItem}>
              <Text style={styles.itemTitle}>{skill.category}</Text>
              <Text style={styles.itemDescription}>{skill.skills}</Text>
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
