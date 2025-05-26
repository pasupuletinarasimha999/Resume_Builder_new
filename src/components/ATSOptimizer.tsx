'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, Target, Zap, Brain, FileText } from 'lucide-react'

interface JobAnalysis {
  requiredSkills: string[]
  preferredSkills: string[]
  technologies: string[]
  keyResponsibilities: string[]
  experienceLevel: string
  industryKeywords: string[]
  actionVerbs: string[]
  qualifications: string[]
}

interface OptimizationSuggestion {
  type: 'add' | 'modify' | 'remove' | 'enhance'
  section: 'summary' | 'experience' | 'skills' | 'projects'
  current?: string
  suggested: string
  reason: string
  impact: 'high' | 'medium' | 'low'
  keywords: string[]
}

interface ATSScore {
  overall: number
  keywordMatch: number
  skillsMatch: number
  formatCompliance: number
  contentRelevance: number
  suggestions: OptimizationSuggestion[]
}

interface ResumeData {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  summary: string
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
}

interface SkillItem {
  id: string
  category?: string
  skills?: string
}

interface BaseItem {
  id: string
  [key: string]: string | boolean | undefined
}

interface ResumeSections {
  experience: ExperienceItem[]
  skills: SkillItem[]
  education?: BaseItem[]
  projects?: BaseItem[]
  languages?: BaseItem[]
  social?: BaseItem[]
  awards?: BaseItem[]
  certifications?: BaseItem[]
}

interface OptimizationResult {
  summary?: string
  experience?: ExperienceItem[]
  skills?: SkillItem[]
}

interface ATSOptimizerProps {
  resumeData: ResumeData
  sections: ResumeSections
  onApplyOptimizations: (optimizations: OptimizationResult) => void
  isOpen: boolean
  onClose: () => void
}

export function ATSOptimizer({ resumeData, sections, onApplyOptimizations, isOpen, onClose }: ATSOptimizerProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null)
  const [atsScore, setATSScore] = useState<ATSScore | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)

  if (!isOpen) return null

  // Parse job description to extract key information
  const analyzeJobDescription = async (description: string): Promise<JobAnalysis> => {
    // Simulate AI analysis - in production, you'd use OpenAI or similar
    const analysis: JobAnalysis = {
      requiredSkills: extractSkills(description, 'required'),
      preferredSkills: extractSkills(description, 'preferred'),
      technologies: extractTechnologies(description),
      keyResponsibilities: extractResponsibilities(description),
      experienceLevel: extractExperienceLevel(description),
      industryKeywords: extractIndustryKeywords(description),
      actionVerbs: extractActionVerbs(description),
      qualifications: extractQualifications(description)
    }
    return analysis
  }

  // Extract skills from job description
  const extractSkills = (text: string, type: 'required' | 'preferred'): string[] => {
    const skillPatterns = [
      /(?:react|angular|vue|javascript|typescript|python|java|c\+\+|node\.js|express|django|flask|spring|hibernate)/gi,
      /(?:aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab|jira|confluence)/gi,
      /(?:sql|mongodb|postgresql|mysql|redis|elasticsearch|graphql|rest|api)/gi,
      /(?:agile|scrum|kanban|devops|ci\/cd|tdd|bdd|microservices|architecture)/gi
    ]

    const skills = new Set<string>()
    for (const pattern of skillPatterns) {
      const matches = text.match(pattern) || []
      for (const match of matches) {
        skills.add(match.toLowerCase())
      }
    }

    return Array.from(skills)
  }

  // Extract technologies
  const extractTechnologies = (text: string): string[] => {
    const techKeywords = [
      'react', 'angular', 'vue', 'javascript', 'typescript', 'python', 'java', 'node.js',
      'aws', 'azure', 'docker', 'kubernetes', 'mongodb', 'postgresql', 'redis',
      'microservices', 'api', 'rest', 'graphql', 'git', 'jenkins', 'ci/cd'
    ]

    return techKeywords.filter(tech =>
      text.toLowerCase().includes(tech.toLowerCase())
    )
  }

  // Extract key responsibilities
  const extractResponsibilities = (text: string): string[] => {
    const responsibilities = []
    const lines = text.split('\n').filter(line => line.trim())

    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        responsibilities.push(line.trim().replace(/^[•\-*]\s*/, ''))
      }
    }

    return responsibilities.slice(0, 8) // Limit to top 8
  }

  // Extract experience level
  const extractExperienceLevel = (text: string): string => {
    if (text.toLowerCase().includes('senior') || text.includes('5+') || text.includes('7+')) {
      return 'senior'
    }
    if (text.toLowerCase().includes('mid') || text.includes('3+') || text.includes('4+')) {
      return 'mid-level'
    }
    if (text.toLowerCase().includes('junior') || text.includes('1+') || text.includes('2+')) {
      return 'junior'
    }
    return 'mid-level'
  }

  // Extract industry keywords
  const extractIndustryKeywords = (text: string): string[] => {
    const industryTerms = [
      'scalable', 'performance', 'optimization', 'security', 'compliance',
      'collaboration', 'cross-functional', 'stakeholders', 'delivery',
      'innovation', 'best practices', 'mentoring', 'leadership'
    ]

    return industryTerms.filter(term =>
      text.toLowerCase().includes(term.toLowerCase())
    )
  }

  // Extract action verbs
  const extractActionVerbs = (text: string): string[] => {
    const actionVerbs = [
      'develop', 'implement', 'design', 'build', 'create', 'optimize',
      'lead', 'manage', 'collaborate', 'deliver', 'maintain', 'improve',
      'analyze', 'architect', 'deploy', 'integrate', 'test', 'debug'
    ]

    return actionVerbs.filter(verb =>
      text.toLowerCase().includes(verb.toLowerCase())
    )
  }

  // Extract qualifications
  const extractQualifications = (text: string): string[] => {
    const qualifications = []
    const lines = text.toLowerCase().split('\n')

    for (const line of lines) {
      if (line.includes('bachelor') || line.includes('degree') || line.includes('certification')) {
        qualifications.push(line.trim())
      }
    }

    return qualifications
  }

  // Calculate ATS score
  const calculateATSScore = (analysis: JobAnalysis): ATSScore => {
    const suggestions: OptimizationSuggestion[] = []

    // Check keyword matches
    const resumeText = JSON.stringify(resumeData) + JSON.stringify(sections)
    const keywordMatches = analysis.requiredSkills.filter(skill =>
      resumeText.toLowerCase().includes(skill.toLowerCase())
    ).length

    const keywordScore = Math.min((keywordMatches / analysis.requiredSkills.length) * 100, 100)

    // Check skills section
    const currentSkills = sections.skills?.flatMap((s: SkillItem) =>
      s.skills?.split(',').map((skill: string) => skill.trim().toLowerCase()) || []
    ) || []

    const missingSkills = analysis.requiredSkills.filter(skill =>
      !currentSkills.includes(skill.toLowerCase())
    )

    // Generate suggestions for missing skills
    for (const skill of missingSkills) {
      suggestions.push({
        type: 'add',
        section: 'skills',
        suggested: `Add "${skill}" to your skills section`,
        reason: "This is a required skill mentioned in the job description",
        impact: 'high',
        keywords: [skill]
      })
    }

    // Check experience descriptions
    const experienceText = sections.experience?.map((exp: ExperienceItem) => exp.description).join(' ') || ''
    const missingActionVerbs = analysis.actionVerbs.filter(verb =>
      !experienceText.toLowerCase().includes(verb.toLowerCase())
    )

    // Generate suggestions for experience enhancement
    if (missingActionVerbs.length > 0) {
      suggestions.push({
        type: 'enhance',
        section: 'experience',
        suggested: `Use action verbs like: ${missingActionVerbs.slice(0, 3).join(', ')}`,
        reason: 'These action verbs appear in the job description and will improve ATS matching',
        impact: 'medium',
        keywords: missingActionVerbs.slice(0, 3)
      })
    }

    // Check summary optimization
    const summaryText = resumeData.summary?.toLowerCase() || ''
    const missingKeywords = analysis.industryKeywords.filter(keyword =>
      !summaryText.includes(keyword.toLowerCase())
    )

    if (missingKeywords.length > 0) {
      suggestions.push({
        type: 'enhance',
        section: 'summary',
        suggested: `Incorporate keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
        reason: 'These industry keywords will improve your summary\'s relevance',
        impact: 'high',
        keywords: missingKeywords.slice(0, 3)
      })
    }

    const skillsScore = Math.max(100 - (missingSkills.length * 10), 0)
    const formatScore = 95 // Assume good formatting
    const contentScore = Math.min(keywordScore + 20, 100)

    const overall = Math.round((keywordScore + skillsScore + formatScore + contentScore) / 4)

    return {
      overall,
      keywordMatch: Math.round(keywordScore),
      skillsMatch: Math.round(skillsScore),
      formatCompliance: formatScore,
      contentRelevance: Math.round(contentScore),
      suggestions
    }
  }

  // Generate optimized content
  const generateOptimizedContent = (analysis: JobAnalysis): OptimizationResult => {
    const optimizedExperience = sections.experience?.map((exp: ExperienceItem) => {
      const optimizedDescription = enhanceExperienceDescription(exp.description || '', analysis)
      return {
        ...exp,
        description: optimizedDescription
      }
    })

    const optimizedSummary = enhanceSummary(resumeData.summary, analysis)

    return {
      summary: optimizedSummary,
      experience: optimizedExperience,
      skills: generateOptimizedSkills(analysis)
    }
  }

  // Enhance experience description
  const enhanceExperienceDescription = (description: string, analysis: JobAnalysis): string => {
    if (!description) return description

    let enhanced = description

    // Add relevant technologies if missing
    const missingTechs = analysis.technologies.filter(tech =>
      !description.toLowerCase().includes(tech.toLowerCase())
    ).slice(0, 2)

    if (missingTechs.length > 0) {
      enhanced += `<li>Utilized ${missingTechs.join(', ')} to deliver scalable solutions</li>`
    }

    // Add relevant action verbs
    const relevantVerbs = analysis.actionVerbs.slice(0, 2)
    if (relevantVerbs.length > 0) {
      enhanced += `<li>Successfully ${relevantVerbs[0]}ed and ${relevantVerbs[1] || 'managed'} key project deliverables</li>`
    }

    return enhanced
  }

  // Enhance summary
  const enhanceSummary = (summary: string, analysis: JobAnalysis): string => {
    if (!summary) return summary

    const keywords = analysis.industryKeywords.slice(0, 3)
    const technologies = analysis.technologies.slice(0, 3)

    let enhanced = summary

    // Add missing keywords naturally
    if (keywords.length > 0 && !summary.toLowerCase().includes(keywords[0].toLowerCase())) {
      enhanced += ` Experienced in ${keywords.join(', ')} with focus on ${technologies.join(', ')}.`
    }

    return enhanced
  }

  // Generate optimized skills
  const generateOptimizedSkills = (analysis: JobAnalysis): SkillItem[] => {
    const currentSkills = sections.skills || []
    const missingSkills = analysis.requiredSkills.filter(skill =>
      !currentSkills.some((s: SkillItem) => s.skills?.toLowerCase().includes(skill.toLowerCase()))
    )

    if (missingSkills.length > 0) {
      return [
        ...currentSkills,
        {
          id: Math.random().toString(36).substr(2, 9),
          category: 'Job-Specific Skills',
          skills: missingSkills.join(', ')
        }
      ]
    }

    return currentSkills
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)
    try {
      const analysis = await analyzeJobDescription(jobDescription)
      setJobAnalysis(analysis)

      const score = calculateATSScore(analysis)
      setATSScore(score)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOptimize = () => {
    if (!jobAnalysis) return

    setIsOptimizing(true)
    try {
      const optimizations = generateOptimizedContent(jobAnalysis)
      onApplyOptimizations(optimizations)
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Smart ATS Optimizer
            </h2>
            <Button variant="outline" onClick={onClose}>×</Button>
          </div>

          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analyze">📋 Analyze Job</TabsTrigger>
              <TabsTrigger value="score">📊 ATS Score</TabsTrigger>
              <TabsTrigger value="optimize">🚀 Optimize</TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Job Description Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="job-description">Paste the job description here:</Label>
                    <Textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job description from the company portal..."
                      className="min-h-[200px] mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze Job Requirements
                      </>
                    )}
                  </Button>

                  {jobAnalysis && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Required Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {jobAnalysis.requiredSkills.map(skill => (
                              <Badge key={skill} variant="destructive">{skill}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Technologies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {jobAnalysis.technologies.map(tech => (
                              <Badge key={tech} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Key Responsibilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">
                            {jobAnalysis.keyResponsibilities.slice(0, 5).map((resp) => (
                              <li key={resp} className="flex items-start gap-2">
                                <span className="text-gray-500">•</span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Industry Keywords</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {jobAnalysis.industryKeywords.map(keyword => (
                              <Badge key={keyword} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="score" className="space-y-4">
              {atsScore ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        📊 ATS Compatibility Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{atsScore.overall}%</div>
                          <div className="text-sm text-gray-600">Overall Score</div>
                          <Progress value={atsScore.overall} className="mt-2" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{atsScore.keywordMatch}%</div>
                          <div className="text-sm text-gray-600">Keyword Match</div>
                          <Progress value={atsScore.keywordMatch} className="mt-2" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{atsScore.skillsMatch}%</div>
                          <div className="text-sm text-gray-600">Skills Match</div>
                          <Progress value={atsScore.skillsMatch} className="mt-2" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{atsScore.contentRelevance}%</div>
                          <div className="text-sm text-gray-600">Content Relevance</div>
                          <Progress value={atsScore.contentRelevance} className="mt-2" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Optimization Suggestions:</h4>
                        {atsScore.suggestions.map((suggestion) => (
                          <div key={`${suggestion.section}-${suggestion.suggested}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            {suggestion.impact === 'high' ? (
                              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            ) : suggestion.impact === 'medium' ? (
                              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{suggestion.suggested}</div>
                              <div className="text-xs text-gray-600 mt-1">{suggestion.reason}</div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {suggestion.keywords.map(keyword => (
                                  <Badge key={keyword} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600">Please analyze a job description first to see your ATS score.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="optimize" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Auto-Optimize Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Click the button below to automatically optimize your resume based on the job analysis.
                      This will add missing keywords, enhance your experience descriptions, and improve ATS compatibility.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">What will be optimized:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Add missing required skills to your skills section</li>
                        <li>• Enhance experience descriptions with relevant keywords</li>
                        <li>• Improve summary with industry-specific terminology</li>
                        <li>• Add relevant technologies and tools</li>
                        <li>• Optimize action verbs for better impact</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleOptimize}
                      disabled={!jobAnalysis || isOptimizing}
                      className="bg-green-600 hover:bg-green-700 w-full"
                      size="lg"
                    >
                      {isOptimizing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Optimizing Resume...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Apply Smart Optimizations
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
