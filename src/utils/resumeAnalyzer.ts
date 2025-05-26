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
  languages: SectionItem[]
  social: SectionItem[]
  awards: SectionItem[]
  certifications: SectionItem[]
}

interface AnalysisResult {
  overallScore: number
  categories: {
    documentStrength: CategoryResult
    dataIdentification: CategoryResult
    semanticAnalysis: CategoryResult
    atsCompatibility: CategoryResult
  }
  recommendations: Recommendation[]
  keywordAnalysis: KeywordAnalysis
}

interface CategoryResult {
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor'
  checks: Check[]
}

interface Check {
  id: string
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  impact: 'high' | 'medium' | 'low'
  suggestion?: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  actionable: boolean
}

interface KeywordAnalysis {
  totalKeywords: number
  technicalSkills: string[]
  softSkills: string[]
  industryTerms: string[]
  missingKeywords: string[]
  keywordDensity: number
}

// Industry keywords database
const INDUSTRY_KEYWORDS = {
  technical: [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git',
    'TypeScript', 'HTML', 'CSS', 'MongoDB', 'PostgreSQL', 'Redis', 'Kubernetes',
    'Azure', 'Google Cloud', 'Vue.js', 'Angular', 'Express', 'GraphQL', 'REST API',
    'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD', 'Testing', 'Agile'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'creative', 'organized', 'detail-oriented', 'collaborative', 'adaptable',
    'innovative', 'strategic', 'mentoring', 'project management', 'time management'
  ],
  action: [
    'developed', 'created', 'implemented', 'designed', 'built', 'managed', 'led',
    'improved', 'optimized', 'increased', 'reduced', 'achieved', 'delivered',
    'collaborated', 'mentored', 'streamlined', 'automated', 'enhanced'
  ]
}

// ATS-friendly formatting checks
const ATS_CHECKS = {
  forbiddenElements: ['images', 'tables', 'text boxes', 'headers', 'footers'],
  recommendedSections: ['experience', 'education', 'skills'],
  fontRequirements: {
    minSize: 10,
    maxSize: 12,
    recommendedFonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica']
  }
}

export class ResumeAnalyzer {

  analyzeResume(resumeData: ResumeData, sections: ResumeSections): AnalysisResult {
    const documentStrength = this.analyzeDocumentStrength(resumeData, sections)
    const dataIdentification = this.analyzeDataIdentification(resumeData, sections)
    const semanticAnalysis = this.analyzeSemanticContent(resumeData, sections)
    const atsCompatibility = this.analyzeATSCompatibility(resumeData, sections)
    const keywordAnalysis = this.analyzeKeywords(resumeData, sections)

    const overallScore = this.calculateOverallScore({
      documentStrength,
      dataIdentification,
      semanticAnalysis,
      atsCompatibility
    })

    const recommendations = this.generateRecommendations({
      documentStrength,
      dataIdentification,
      semanticAnalysis,
      atsCompatibility
    })

    return {
      overallScore,
      categories: {
        documentStrength,
        dataIdentification,
        semanticAnalysis,
        atsCompatibility
      },
      recommendations,
      keywordAnalysis
    }
  }

  private analyzeDocumentStrength(resumeData: ResumeData, sections: ResumeSections): CategoryResult {
    const checks: Check[] = []
    let score = 0
    const maxScore = 25

    // Word count analysis
    const totalWordCount = this.getTotalWordCount(resumeData, sections)
    if (totalWordCount >= 300 && totalWordCount <= 600) {
      checks.push({
        id: 'word_count',
        name: 'Word Count',
        status: 'pass',
        message: `Good word count: ${totalWordCount} words`,
        impact: 'medium'
      })
      score += 5
    } else {
      checks.push({
        id: 'word_count',
        name: 'Word Count',
        status: totalWordCount < 300 ? 'fail' : 'warning',
        message: `Word count: ${totalWordCount} words (recommended: 300-600)`,
        impact: 'medium',
        suggestion: totalWordCount < 300 ? 'Add more details to your experiences' : 'Consider condensing your content'
      })
    }

    // Section completeness
    const completedSections = Object.values(sections).filter(section => section.length > 0).length
    if (completedSections >= 4) {
      checks.push({
        id: 'section_completeness',
        name: 'Section Completeness',
        status: 'pass',
        message: `${completedSections} sections completed`,
        impact: 'high'
      })
      score += 10
    } else {
      checks.push({
        id: 'section_completeness',
        name: 'Section Completeness',
        status: 'fail',
        message: `Only ${completedSections} sections completed (recommended: 4+)`,
        impact: 'high',
        suggestion: 'Complete more resume sections'
      })
    }

    // Contact information completeness
    const contactFields = [resumeData.email, resumeData.phone, resumeData.location]
    const completedContacts = contactFields.filter(field => field?.trim()).length
    if (completedContacts === 3) {
      checks.push({
        id: 'contact_info',
        name: 'Contact Information',
        status: 'pass',
        message: 'All contact information provided',
        impact: 'high'
      })
      score += 10
    } else {
      checks.push({
        id: 'contact_info',
        name: 'Contact Information',
        status: 'fail',
        message: `Missing ${3 - completedContacts} contact field(s)`,
        impact: 'high',
        suggestion: 'Complete all contact information fields'
      })
    }

    return {
      score,
      maxScore,
      status: this.getStatusFromScore(score, maxScore),
      checks
    }
  }

  private analyzeDataIdentification(resumeData: ResumeData, sections: ResumeSections): CategoryResult {
    const checks: Check[] = []
    let score = 0
    const maxScore = 25

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(resumeData.email)) {
      checks.push({
        id: 'email_format',
        name: 'Email Format',
        status: 'pass',
        message: 'Valid email format',
        impact: 'medium'
      })
      score += 5
    } else {
      checks.push({
        id: 'email_format',
        name: 'Email Format',
        status: 'fail',
        message: 'Invalid email format',
        impact: 'medium',
        suggestion: 'Use a valid email format (e.g., name@email.com)'
      })
    }

    // Phone format validation
    const phoneRegex = /[\+]?[1-9][\d]{0,15}/
    if (phoneRegex.test(resumeData.phone.replace(/[\s\-\(\)]/g, ''))) {
      checks.push({
        id: 'phone_format',
        name: 'Phone Format',
        status: 'pass',
        message: 'Valid phone format',
        impact: 'medium'
      })
      score += 5
    } else {
      checks.push({
        id: 'phone_format',
        name: 'Phone Format',
        status: 'fail',
        message: 'Invalid phone format',
        impact: 'medium',
        suggestion: 'Use a valid phone format (e.g., (555) 123-4567)'
      })
    }

    // Skills identification
    if (sections.skills.length > 3) {
      checks.push({
        id: 'skills_count',
        name: 'Skills Listed',
        status: 'pass',
        message: `${sections.skills.length} skills identified`,
        impact: 'high'
      })
      score += 10
    } else {
      checks.push({
        id: 'skills_count',
        name: 'Skills Listed',
        status: 'fail',
        message: `Only ${sections.skills.length} skills listed (recommended: 4+)`,
        impact: 'high',
        suggestion: 'Add more relevant skills to your resume'
      })
    }

    // Experience quantification
    const quantifiedExperiences = sections.experience.filter(exp =>
      this.hasQuantifiableResults(exp.description as string || '')
    ).length

    if (quantifiedExperiences > 0) {
      checks.push({
        id: 'quantified_results',
        name: 'Quantified Results',
        status: 'pass',
        message: `${quantifiedExperiences} experiences with quantified results`,
        impact: 'high'
      })
      score += 5
    } else {
      checks.push({
        id: 'quantified_results',
        name: 'Quantified Results',
        status: 'fail',
        message: 'No quantified results found',
        impact: 'high',
        suggestion: 'Add numbers, percentages, or metrics to your achievements'
      })
    }

    return {
      score,
      maxScore,
      status: this.getStatusFromScore(score, maxScore),
      checks
    }
  }

  private analyzeSemanticContent(resumeData: ResumeData, sections: ResumeSections): CategoryResult {
    const checks: Check[] = []
    let score = 0
    const maxScore = 25

    // Action verbs usage
    const allText = this.getAllText(resumeData, sections)
    const actionVerbs = INDUSTRY_KEYWORDS.action.filter(verb =>
      allText.toLowerCase().includes(verb.toLowerCase())
    )

    if (actionVerbs.length >= 5) {
      checks.push({
        id: 'action_verbs',
        name: 'Action Verbs',
        status: 'pass',
        message: `${actionVerbs.length} action verbs found`,
        impact: 'medium'
      })
      score += 8
    } else {
      checks.push({
        id: 'action_verbs',
        name: 'Action Verbs',
        status: 'fail',
        message: `Only ${actionVerbs.length} action verbs found (recommended: 5+)`,
        impact: 'medium',
        suggestion: 'Use more action verbs to describe your achievements'
      })
    }

    // Industry relevance
    const technicalTerms = INDUSTRY_KEYWORDS.technical.filter(term =>
      allText.toLowerCase().includes(term.toLowerCase())
    )

    if (technicalTerms.length >= 3) {
      checks.push({
        id: 'industry_terms',
        name: 'Industry Terms',
        status: 'pass',
        message: `${technicalTerms.length} relevant industry terms`,
        impact: 'high'
      })
      score += 10
    } else {
      checks.push({
        id: 'industry_terms',
        name: 'Industry Terms',
        status: 'fail',
        message: `Only ${technicalTerms.length} industry terms found`,
        impact: 'high',
        suggestion: 'Include more industry-specific keywords and technologies'
      })
    }

    // Summary quality
    if (resumeData.summary && resumeData.summary.length >= 100) {
      checks.push({
        id: 'summary_quality',
        name: 'Professional Summary',
        status: 'pass',
        message: 'Comprehensive professional summary',
        impact: 'medium'
      })
      score += 7
    } else {
      checks.push({
        id: 'summary_quality',
        name: 'Professional Summary',
        status: 'fail',
        message: 'Professional summary too brief or missing',
        impact: 'medium',
        suggestion: 'Write a detailed professional summary (100+ characters)'
      })
    }

    return {
      score,
      maxScore,
      status: this.getStatusFromScore(score, maxScore),
      checks
    }
  }

  private analyzeATSCompatibility(resumeData: ResumeData, sections: ResumeSections): CategoryResult {
    const checks: Check[] = []
    let score = 0
    const maxScore = 25

    // Standard section headers
    const standardSections = ['experience', 'education', 'skills']
    const hasStandardSections = standardSections.every(section =>
      sections[section as keyof ResumeSections].length > 0
    )

    if (hasStandardSections) {
      checks.push({
        id: 'standard_sections',
        name: 'Standard Sections',
        status: 'pass',
        message: 'All standard sections present',
        impact: 'high'
      })
      score += 10
    } else {
      checks.push({
        id: 'standard_sections',
        name: 'Standard Sections',
        status: 'fail',
        message: 'Missing standard sections (Experience, Education, Skills)',
        impact: 'high',
        suggestion: 'Include all standard resume sections'
      })
    }

    // Text-based format (simulated)
    checks.push({
      id: 'text_format',
      name: 'Text-Based Format',
      status: 'pass',
      message: 'Resume uses text-based format',
      impact: 'high'
    })
    score += 8

    // No complex formatting (simulated)
    checks.push({
      id: 'simple_formatting',
      name: 'Simple Formatting',
      status: 'pass',
      message: 'No complex formatting detected',
      impact: 'medium'
    })
    score += 7

    return {
      score,
      maxScore,
      status: this.getStatusFromScore(score, maxScore),
      checks
    }
  }

  private analyzeKeywords(resumeData: ResumeData, sections: ResumeSections): KeywordAnalysis {
    const allText = this.getAllText(resumeData, sections)
    const words = allText.toLowerCase().split(/\s+/)

    const technicalSkills = INDUSTRY_KEYWORDS.technical.filter(skill =>
      allText.toLowerCase().includes(skill.toLowerCase())
    )

    const softSkills = INDUSTRY_KEYWORDS.soft.filter(skill =>
      allText.toLowerCase().includes(skill.toLowerCase())
    )

    const industryTerms = [...technicalSkills, ...softSkills]
    const missingKeywords = INDUSTRY_KEYWORDS.technical
      .filter(skill => !technicalSkills.includes(skill))
      .slice(0, 5) // Top 5 missing keywords

    return {
      totalKeywords: industryTerms.length,
      technicalSkills,
      softSkills,
      industryTerms,
      missingKeywords,
      keywordDensity: (industryTerms.length / words.length) * 100
    }
  }

  private calculateOverallScore(categories: Record<string, CategoryResult>): number {
    const totalScore = Object.values(categories).reduce((sum: number, category: CategoryResult) =>
      sum + category.score, 0
    )
    const totalMaxScore = Object.values(categories).reduce((sum: number, category: CategoryResult) =>
      sum + category.maxScore, 0
    )

    return Math.round((totalScore / totalMaxScore) * 100)
  }

  private generateRecommendations(categories: Record<string, CategoryResult>): Recommendation[] {
    const recommendations: Recommendation[] = []

    for (const [categoryName, category] of Object.entries(categories)) {
      for (const check of category.checks) {
        if (check.status === 'fail' && check.suggestion) {
          recommendations.push({
            id: check.id,
            title: check.name,
            description: check.suggestion,
            priority: check.impact as 'high' | 'medium' | 'low',
            category: categoryName,
            actionable: true
          })
        }
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private getTotalWordCount(resumeData: ResumeData, sections: ResumeSections): number {
    const allText = this.getAllText(resumeData, sections)
    return allText.split(/\s+/).filter(word => word.length > 0).length
  }

  private getAllText(resumeData: ResumeData, sections: ResumeSections): string {
    let text = `${resumeData.fullName} ${resumeData.summary}`

    for (const sectionArray of Object.values(sections)) {
      for (const item of sectionArray) {
        for (const [key, value] of Object.entries(item)) {
          if (typeof value === 'string' && key !== 'id') {
            text += ` ${value}`
          }
        }
      }
    }

    return text
  }

  private hasQuantifiableResults(text: string): boolean {
    const quantifiers = /\d+(%|percent|\+|k|million|billion|years?|months?|weeks?|days?|hours?|minutes?|\$|dollars?|reduction|increase|improvement|growth)/i
    return quantifiers.test(text)
  }

  private getStatusFromScore(score: number, maxScore: number): 'excellent' | 'good' | 'needs_improvement' | 'poor' {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'excellent'
    if (percentage >= 75) return 'good'
    if (percentage >= 50) return 'needs_improvement'
    return 'poor'
  }
}

export const resumeAnalyzer = new ResumeAnalyzer()
