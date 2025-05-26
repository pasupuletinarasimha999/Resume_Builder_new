'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Shield,
  Eye,
  Clock,
  Users,
  FileText,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Calendar,
  MapPin,
  Briefcase
} from 'lucide-react'

interface RedFlag {
  id: string
  category: 'critical' | 'high' | 'medium' | 'low'
  type: string
  title: string
  description: string
  location: string
  suggestion: string
  impact: string
  examples?: string[]
  autoFix?: boolean
}

interface RedFlagAnalysis {
  overallRisk: number
  totalFlags: number
  flagsByCategory: {
    critical: RedFlag[]
    high: RedFlag[]
    medium: RedFlag[]
    low: RedFlag[]
  }
  recommendations: string[]
  atsCompatibility: number
  recruiterAppeal: number
  industryFit: number
}

interface ResumeData {
  personalInfo?: {
    fullName?: string
    email?: string
    phone?: string
    linkedin?: string
    location?: string
  }
  summary?: string
  workExperience?: Array<{
    id: string
    company?: string
    position?: string
    startDate?: string
    endDate?: string
    description?: string
    isPresent?: boolean
  }>
  skills?: string[]
  education?: Array<{
    id: string
    school?: string
    degree?: string
    field?: string
    startDate?: string
    endDate?: string
  }>
  projects?: Array<{
    id: string
    name?: string
    technologies?: string
    description?: string
  }>
}

interface RedFlagDetectorProps {
  resumeData: ResumeData
  targetIndustry?: string
  targetRole?: string
  onFlagsDetected?: (analysis: RedFlagAnalysis) => void
}

// Red flag detection patterns and rules
const RED_FLAG_PATTERNS = {
  // Employment gaps and career progression
  employmentGaps: {
    threshold: 6, // months
    severity: 'high',
    exceptions: ['education', 'family', 'travel', 'freelance']
  },

  // Job hopping patterns
  jobHopping: {
    threshold: 18, // months minimum per job
    maxJobs: 4, // in 5 years
    severity: 'medium'
  },

  // Content quality issues
  contentIssues: {
    minDescriptionLength: 50,
    maxDescriptionLength: 300,
    genericPhrases: [
      'responsible for',
      'duties included',
      'helped with',
      'worked on',
      'assisted in',
      'participated in'
    ],
    weakVerbs: ['did', 'made', 'got', 'was', 'had', 'went'],
    unprofessionalWords: ['amazing', 'awesome', 'tons of', 'lots of', 'stuff']
  },

  // Format and structure issues
  formatIssues: {
    inconsistentDates: true,
    missingInfo: ['email', 'phone'],
    lengthIssues: {
      tooShort: 200, // words
      tooLong: 800   // words
    }
  },

  // ATS compatibility issues
  atsIssues: {
    problematicFormats: ['.pdf', '.jpg', '.png'],
    complexLayouts: true,
    missingKeywords: true,
    nonStandardSections: true
  }
}

// Industry-specific red flags
const INDUSTRY_RED_FLAGS = {
  technology: {
    outdatedSkills: ['flash', 'silverlight', 'internet explorer', 'jquery', 'php 5'],
    missingSkills: ['git', 'agile', 'testing'],
    redFlagCompanies: [],
    requiredSections: ['technical skills', 'projects']
  },
  finance: {
    outdatedSkills: ['lotus notes', 'cobol', 'fortran'],
    missingSkills: ['excel', 'financial modeling', 'compliance'],
    certificationRequired: true,
    requiredSections: ['education', 'certifications']
  },
  healthcare: {
    missingSkills: ['patient care', 'medical terminology'],
    certificationRequired: true,
    backgroundCheckSensitive: true,
    requiredSections: ['education', 'certifications', 'licenses']
  }
}

export default function RedFlagDetector({
  resumeData,
  targetIndustry = 'technology',
  targetRole = '',
  onFlagsDetected
}: RedFlagDetectorProps) {
  const [analysis, setAnalysis] = useState<RedFlagAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const detectRedFlags = useCallback(async () => {
    setIsAnalyzing(true)

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    const flags: RedFlag[] = []

    // Detect employment gaps
    const gapFlags = detectEmploymentGaps()
    flags.push(...gapFlags)

    // Detect job hopping
    const hoppingFlags = detectJobHopping()
    flags.push(...hoppingFlags)

    // Detect content issues
    const contentFlags = detectContentIssues()
    flags.push(...contentFlags)

    // Detect format issues
    const formatFlags = detectFormatIssues()
    flags.push(...formatFlags)

    // Detect industry-specific issues
    const industryFlags = detectIndustryIssues()
    flags.push(...industryFlags)

    // Detect ATS compatibility issues
    const atsFlags = detectATSIssues()
    flags.push(...atsFlags)

    // Categorize flags
    const flagsByCategory = {
      critical: flags.filter(f => f.category === 'critical'),
      high: flags.filter(f => f.category === 'high'),
      medium: flags.filter(f => f.category === 'medium'),
      low: flags.filter(f => f.category === 'low')
    }

    // Calculate risk scores
    const overallRisk = calculateOverallRisk(flags)
    const atsCompatibility = calculateATSCompatibility(flags)
    const recruiterAppeal = calculateRecruiterAppeal(flags)
    const industryFit = calculateIndustryFit(flags)

    // Generate recommendations
    const recommendations = generateRecommendations(flags)

    const analysisResult: RedFlagAnalysis = {
      overallRisk,
      totalFlags: flags.length,
      flagsByCategory,
      recommendations,
      atsCompatibility,
      recruiterAppeal,
      industryFit
    }

    setAnalysis(analysisResult)
    onFlagsDetected?.(analysisResult)
    setIsAnalyzing(false)
  }, [onFlagsDetected])

  const detectEmploymentGaps = (): RedFlag[] => {
    const flags: RedFlag[] = []
    const workExperience = resumeData.workExperience || []

    if (workExperience.length < 2) return flags

    // Sort by start date
    const sortedExperience = [...workExperience].sort((a, b) => {
      const dateA = new Date(a.startDate || '').getTime()
      const dateB = new Date(b.startDate || '').getTime()
      return dateA - dateB
    })

    for (let i = 1; i < sortedExperience.length; i++) {
      const prevJob = sortedExperience[i - 1]
      const currentJob = sortedExperience[i]

      if (prevJob.endDate && currentJob.startDate) {
        const endDate = new Date(prevJob.endDate)
        const startDate = new Date(currentJob.startDate)
        const gapMonths = (startDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

        if (gapMonths > RED_FLAG_PATTERNS.employmentGaps.threshold) {
          flags.push({
            id: `gap-${i}`,
            category: gapMonths > 12 ? 'high' : 'medium',
            type: 'employment_gap',
            title: `${Math.round(gapMonths)}-Month Employment Gap`,
            description: `Gap between ${prevJob.company} and ${currentJob.company}`,
            location: 'Work Experience',
            suggestion: 'Add explanation for gap (education, freelance, family responsibilities) or adjust dates if incorrect',
            impact: 'Recruiters may question unexplained gaps longer than 6 months',
            examples: ['Freelance consulting', 'Professional development', 'Family responsibilities'],
            autoFix: false
          })
        }
      }
    }

    return flags
  }

  const detectJobHopping = (): RedFlag[] => {
    const flags: RedFlag[] = []
    const workExperience = resumeData.workExperience || []

    let shortTermJobs = 0

    for (const job of workExperience) {
      if (job.startDate && job.endDate) {
        const startDate = new Date(job.startDate)
        const endDate = new Date(job.endDate)
        const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)

        if (months < RED_FLAG_PATTERNS.jobHopping.threshold) {
          shortTermJobs++
        }
      }
    }

    if (shortTermJobs >= 3) {
      flags.push({
        id: 'job-hopping',
        category: shortTermJobs >= 4 ? 'high' : 'medium',
        type: 'job_hopping',
        title: 'Frequent Job Changes',
        description: `${shortTermJobs} positions lasting less than 18 months`,
        location: 'Work Experience',
        suggestion: 'Consolidate short-term roles or provide context for frequent changes',
        impact: 'May raise concerns about commitment and stability',
        examples: ['Contract positions', 'Company restructuring', 'Career exploration phase'],
        autoFix: false
      })
    }

    return flags
  }

  const detectContentIssues = (): RedFlag[] => {
    const flags: RedFlag[] = []
    const workExperience = resumeData.workExperience || []

    for (const job of workExperience) {
      const description = job.description || ''

      // Check for generic phrases
      const genericPhrases = RED_FLAG_PATTERNS.contentIssues.genericPhrases
      const foundGeneric = genericPhrases.filter(phrase =>
        description.toLowerCase().includes(phrase)
      )

      if (foundGeneric.length > 0) {
        flags.push({
          id: `generic-${job.id}`,
          category: 'medium',
          type: 'generic_content',
          title: 'Generic Job Descriptions',
          description: `Found generic phrases: ${foundGeneric.join(', ')}`,
          location: `${job.position} at ${job.company}`,
          suggestion: 'Replace with specific achievements and quantifiable results',
          impact: 'Generic descriptions fail to demonstrate unique value',
          examples: ['Led team of 5 developers', 'Increased efficiency by 30%', 'Implemented new system saving $50K'],
          autoFix: true
        })
      }

      // Check for weak action verbs
      const weakVerbs = RED_FLAG_PATTERNS.contentIssues.weakVerbs
      const foundWeak = weakVerbs.filter(verb =>
        description.toLowerCase().includes(` ${verb} `)
      )

      if (foundWeak.length > 2) {
        flags.push({
          id: `weak-verbs-${job.id}`,
          category: 'low',
          type: 'weak_verbs',
          title: 'Weak Action Verbs',
          description: `Using weak verbs: ${foundWeak.join(', ')}`,
          location: `${job.position} at ${job.company}`,
          suggestion: 'Use strong action verbs like: achieved, implemented, optimized, led',
          impact: 'Weak verbs reduce impact and professional tone',
          autoFix: true
        })
      }

      // Check description length
      if (description.length < RED_FLAG_PATTERNS.contentIssues.minDescriptionLength) {
        flags.push({
          id: `short-desc-${job.id}`,
          category: 'medium',
          type: 'insufficient_detail',
          title: 'Insufficient Job Details',
          description: 'Job description too brief to showcase impact',
          location: `${job.position} at ${job.company}`,
          suggestion: 'Expand with specific achievements, technologies used, and quantified results',
          impact: 'Brief descriptions miss opportunity to demonstrate value',
          autoFix: false
        })
      }
    }

    return flags
  }

  const detectFormatIssues = (): RedFlag[] => {
    const flags: RedFlag[] = []

    // Check for missing contact information
    const personalInfo = resumeData.personalInfo || {}
    const missingInfo = []

    if (!personalInfo.email) missingInfo.push('email')
    if (!personalInfo.phone) missingInfo.push('phone')
    if (!personalInfo.location) missingInfo.push('location')

    if (missingInfo.length > 0) {
      flags.push({
        id: 'missing-contact',
        category: 'high',
        type: 'missing_information',
        title: 'Missing Contact Information',
        description: `Missing: ${missingInfo.join(', ')}`,
        location: 'Personal Information',
        suggestion: 'Add all essential contact details for recruiters to reach you',
        impact: 'Recruiters cannot contact you without complete information',
        autoFix: false
      })
    }

    // Check for inconsistent date formats
    const workExperience = resumeData.workExperience || []
    const dateFormats = new Set()

    for (const job of workExperience) {
      if (job.startDate) {
        // Simple date format detection
        if (job.startDate.includes('/')) dateFormats.add('slash')
        if (job.startDate.includes('-')) dateFormats.add('dash')
        if (job.startDate.match(/\d{4}/)) dateFormats.add('year')
      }
    }

    if (dateFormats.size > 1) {
      flags.push({
        id: 'inconsistent-dates',
        category: 'low',
        type: 'formatting_inconsistency',
        title: 'Inconsistent Date Formats',
        description: 'Multiple date formats used throughout resume',
        location: 'Work Experience',
        suggestion: 'Use consistent date format (e.g., "Jan 2023" or "01/2023")',
        impact: 'Inconsistency appears unprofessional and hurts readability',
        autoFix: true
      })
    }

    return flags
  }

  const detectIndustryIssues = (): RedFlag[] => {
    const flags: RedFlag[] = []
    const industryRules = INDUSTRY_RED_FLAGS[targetIndustry as keyof typeof INDUSTRY_RED_FLAGS]

    if (!industryRules) return flags

    const skills = resumeData.skills || []
    const skillsText = skills.join(' ').toLowerCase()

    // Check for outdated skills
    if ('outdatedSkills' in industryRules && industryRules.outdatedSkills) {
      const outdatedFound = industryRules.outdatedSkills.filter((skill: string) =>
        skillsText.includes(skill.toLowerCase())
      )

      if (outdatedFound.length > 0) {
        flags.push({
          id: 'outdated-skills',
          category: 'medium',
          type: 'outdated_technology',
          title: 'Outdated Technologies',
          description: `Found outdated skills: ${outdatedFound.join(', ')}`,
          location: 'Skills Section',
          suggestion: 'Remove outdated technologies or explain current relevance',
          impact: 'Outdated skills may signal lack of current knowledge',
          autoFix: true
        })
      }
    }

    // Check for missing essential skills
    if (industryRules.missingSkills) {
      const missingSkills = industryRules.missingSkills.filter(skill =>
        !skillsText.includes(skill.toLowerCase())
      )

      if (missingSkills.length > 0) {
        flags.push({
          id: 'missing-skills',
          category: 'high',
          type: 'missing_skills',
          title: 'Missing Industry-Standard Skills',
          description: `Consider adding: ${missingSkills.join(', ')}`,
          location: 'Skills Section',
          suggestion: 'Add relevant industry-standard skills you possess',
          impact: 'Missing key skills may eliminate you from consideration',
          autoFix: false
        })
      }
    }

    return flags
  }

  const detectATSIssues = (): RedFlag[] => {
    const flags: RedFlag[] = []

    // Check for missing keywords
    const resumeText = JSON.stringify(resumeData).toLowerCase()
    const commonATSKeywords = ['experience', 'skills', 'education', 'achievement', 'result']
    const missingKeywords = commonATSKeywords.filter(keyword =>
      !resumeText.includes(keyword)
    )

    if (missingKeywords.length > 2) {
      flags.push({
        id: 'ats-keywords',
        category: 'medium',
        type: 'ats_compatibility',
        title: 'Limited ATS Keywords',
        description: 'Resume may not contain enough searchable keywords',
        location: 'Overall Content',
        suggestion: 'Include more industry-relevant keywords naturally in your content',
        impact: 'ATS systems may not properly parse or rank your resume',
        autoFix: false
      })
    }

    return flags
  }

  const calculateOverallRisk = (flags: RedFlag[]): number => {
    const weights = { critical: 10, high: 7, medium: 4, low: 1 }
    const totalWeight = flags.reduce((sum, flag) => sum + weights[flag.category], 0)
    const maxPossibleWeight = 50 // Arbitrary baseline
    return Math.min(100, (totalWeight / maxPossibleWeight) * 100)
  }

  const calculateATSCompatibility = (flags: RedFlag[]): number => {
    const atsFlags = flags.filter(f => f.type.includes('ats') || f.type.includes('format'))
    return Math.max(0, 100 - (atsFlags.length * 15))
  }

  const calculateRecruiterAppeal = (flags: RedFlag[]): number => {
    const appealFlags = flags.filter(f =>
      f.type.includes('content') || f.type.includes('generic') || f.type.includes('gap')
    )
    return Math.max(0, 100 - (appealFlags.length * 12))
  }

  const calculateIndustryFit = (flags: RedFlag[]): number => {
    const industryFlags = flags.filter(f => f.type.includes('skill') || f.type.includes('outdated'))
    return Math.max(0, 100 - (industryFlags.length * 20))
  }

  const generateRecommendations = (flags: RedFlag[]): string[] => {
    const recommendations = []

    if (flags.some(f => f.category === 'critical')) {
      recommendations.push('Address critical issues immediately - these could eliminate your application')
    }

    if (flags.some(f => f.type === 'employment_gap')) {
      recommendations.push('Consider adding freelance work, education, or volunteer experience to fill gaps')
    }

    if (flags.some(f => f.type === 'generic_content')) {
      recommendations.push('Quantify achievements with specific numbers, percentages, and dollar amounts')
    }

    if (flags.some(f => f.type === 'missing_skills')) {
      recommendations.push('Highlight relevant skills for your target industry and role')
    }

    if (flags.length === 0) {
      recommendations.push('Excellent! Your resume shows no major red flags')
    } else if (flags.length <= 3) {
      recommendations.push('Good overall quality with minor improvements needed')
    } else {
      recommendations.push('Significant improvements recommended before submitting applications')
    }

    return recommendations
  }

  const getFilteredFlags = () => {
    if (!analysis) return []

    if (selectedCategory === 'all') {
      return [
        ...analysis.flagsByCategory.critical,
        ...analysis.flagsByCategory.high,
        ...analysis.flagsByCategory.medium,
        ...analysis.flagsByCategory.low
      ]
    }

    return analysis.flagsByCategory[selectedCategory]
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'critical': return <XCircle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <Eye className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-orange-600'
    if (score >= 20) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk'
    if (score >= 40) return 'Medium Risk'
    if (score >= 20) return 'Low Risk'
    return 'Minimal Risk'
  }

  useEffect(() => {
    if (resumeData) {
      detectRedFlags()
    }
  }, [resumeData, detectRedFlags])

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Analyzing Resume for Red Flags...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              <span>Running comprehensive analysis...</span>
            </div>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-gray-600">
              Checking employment history, content quality, ATS compatibility, and industry standards...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Red Flag Detector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={detectRedFlags} className="w-full">
            Analyze Resume for Red Flags
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className={`h-5 w-5 ${getRiskColor(analysis.overallRisk)}`} />
              <div>
                <p className="text-sm font-medium">Overall Risk</p>
                <p className={`text-lg font-bold ${getRiskColor(analysis.overallRisk)}`}>
                  {getRiskLabel(analysis.overallRisk)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">ATS Score</p>
                <p className="text-lg font-bold text-blue-600">
                  {analysis.atsCompatibility}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Recruiter Appeal</p>
                <p className="text-lg font-bold text-green-600">
                  {analysis.recruiterAppeal}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Industry Fit</p>
                <p className="text-lg font-bold text-purple-600">
                  {analysis.industryFit}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Red Flag Analysis
              {analysis.totalFlags > 0 && (
                <Badge variant="outline" className="ml-2">
                  {analysis.totalFlags} issue{analysis.totalFlags !== 1 ? 's' : ''} found
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={detectRedFlags}
            >
              Re-analyze
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'all' | 'critical' | 'high' | 'medium' | 'low')}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({analysis.totalFlags})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-red-600">
                Critical ({analysis.flagsByCategory.critical.length})
              </TabsTrigger>
              <TabsTrigger value="high" className="text-orange-600">
                High ({analysis.flagsByCategory.high.length})
              </TabsTrigger>
              <TabsTrigger value="medium" className="text-yellow-600">
                Medium ({analysis.flagsByCategory.medium.length})
              </TabsTrigger>
              <TabsTrigger value="low" className="text-blue-600">
                Low ({analysis.flagsByCategory.low.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              {getFilteredFlags().length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedCategory === 'all' ? 'No Issues Found!' : `No ${selectedCategory} priority issues`}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCategory === 'all'
                      ? 'Your resume looks great with no red flags detected.'
                      : `No issues found in the ${selectedCategory} priority category.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredFlags().map((flag) => (
                    <Card key={flag.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getCategoryIcon(flag.category)}
                              <h4 className="font-medium">{flag.title}</h4>
                              <Badge className={getCategoryColor(flag.category)}>
                                {flag.category}
                              </Badge>
                              {flag.autoFix && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Auto-fixable
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {flag.location}
                            </p>
                            <p className="text-sm mb-3">{flag.description}</p>

                            {showDetails === flag.id && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                                <div>
                                  <strong className="text-sm">Impact:</strong>
                                  <p className="text-sm text-gray-700">{flag.impact}</p>
                                </div>
                                <div>
                                  <strong className="text-sm">Suggestion:</strong>
                                  <p className="text-sm text-gray-700">{flag.suggestion}</p>
                                </div>
                                {flag.examples && flag.examples.length > 0 && (
                                  <div>
                                    <strong className="text-sm">Examples:</strong>
                                    <ul className="text-sm text-gray-700 list-disc list-inside">
                                      {flag.examples.map((example) => (
                                        <li key={example}>{example}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDetails(showDetails === flag.id ? null : flag.id)}
                          >
                            {showDetails === flag.id ? 'Hide' : 'Details'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation) => (
                <div key={recommendation} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
