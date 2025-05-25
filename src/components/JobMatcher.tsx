'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Target, TrendingUp, AlertTriangle, CheckCircle, Zap, FileText } from 'lucide-react'
import { aiService } from '@/services/aiService'

interface JobMatchAnalysis {
  score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  keywords: string[]
}

interface JobMatcherProps {
  resumeData: any
  sections: any
  isOpen: boolean
  onClose: () => void
  onApplyOptimizations?: (optimizations: any) => void
}

export function JobMatcher({ resumeData, sections, isOpen, onClose, onApplyOptimizations }: JobMatcherProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [optimizations, setOptimizations] = useState<any>(null)

  const analyzeJobMatch = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description first')
      return
    }

    setIsAnalyzing(true)

    try {
      const result = await aiService.analyzeJobMatch(resumeData, jobDescription)
      setAnalysis(result)

      // Generate specific optimizations based on the analysis
      await generateOptimizations(result)

    } catch (error) {
      console.error('Job matching failed:', error)
      // Fallback analysis
      setAnalysis({
        score: 75,
        strengths: ['Relevant technical experience', 'Strong educational background'],
        gaps: ['Missing specific industry keywords', 'Could highlight more achievements'],
        suggestions: [
          'Add more quantified results to your experience',
          'Include relevant certifications',
          'Optimize summary for target role'
        ],
        keywords: ['leadership', 'collaboration', 'problem-solving', 'innovation']
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateOptimizations = async (matchAnalysis: JobMatchAnalysis) => {
    try {
      // Generate optimized content based on job match analysis
      const optimizedSummary = await generateOptimizedSummary(matchAnalysis)
      const optimizedExperience = await optimizeExperienceSection(matchAnalysis)
      const suggestedSkills = await suggestAdditionalSkills(matchAnalysis)

      setOptimizations({
        summary: optimizedSummary,
        experience: optimizedExperience,
        skills: suggestedSkills,
        keywords: matchAnalysis.keywords
      })
    } catch (error) {
      console.error('Failed to generate optimizations:', error)
    }
  }

  const generateOptimizedSummary = async (analysis: JobMatchAnalysis) => {
    // Extract key requirements from job description for summary optimization
    const targetRole = extractTargetRole(jobDescription)

    try {
      const suggestions = await aiService.enhanceProfessionalSummary(
        resumeData.summary,
        targetRole,
        sections.experience,
        sections.skills?.map((s: any) => s.skills).join(', ').split(', ') || []
      )

      return suggestions[0]?.content || resumeData.summary
    } catch {
      return `${resumeData.summary} Proven expertise in ${analysis.keywords.slice(0, 3).join(', ')} with a strong track record of delivering results in dynamic environments.`
    }
  }

  const optimizeExperienceSection = async (analysis: JobMatchAnalysis) => {
    const optimized = []

    for (const exp of sections.experience || []) {
      try {
        // Extract bullet points and enhance them for the target role
        const bulletPoints = extractBulletPoints(exp.description || '')
        const enhanced = await aiService.enhanceBulletPoints(bulletPoints, {
          position: exp.position,
          company: exp.company,
          industry: extractIndustry(jobDescription)
        })

        optimized.push({
          ...exp,
          optimizedDescription: formatAsBulletPoints(enhanced.map(e => e.content)),
          changes: enhanced.length
        })
      } catch {
        optimized.push({
          ...exp,
          optimizedDescription: exp.description,
          changes: 0
        })
      }
    }

    return optimized
  }

  const suggestAdditionalSkills = async (analysis: JobMatchAnalysis) => {
    const currentSkills = sections.skills?.flatMap((s: any) => s.skills.split(', ')) || []

    try {
      const skillAnalysis = await aiService.generateSkillSuggestions(
        currentSkills,
        extractTargetRole(jobDescription),
        extractIndustry(jobDescription)
      )

      return {
        missing: skillAnalysis.missingSkills,
        recommended: skillAnalysis.recommendedSkills,
        fromJob: analysis.keywords.filter(k => !currentSkills.some(s =>
          s.toLowerCase().includes(k.toLowerCase())
        ))
      }
    } catch {
      return {
        missing: analysis.keywords.slice(0, 5),
        recommended: ['Communication', 'Leadership', 'Problem-solving'],
        fromJob: analysis.keywords
      }
    }
  }

  const extractTargetRole = (jd: string): string => {
    // Simple extraction - in production would use more sophisticated NLP
    const lines = jd.split('\n')
    const titleLine = lines.find(line =>
      line.toLowerCase().includes('software engineer') ||
      line.toLowerCase().includes('developer') ||
      line.toLowerCase().includes('manager') ||
      line.toLowerCase().includes('analyst')
    )
    return titleLine?.trim() || 'Software Engineer'
  }

  const extractIndustry = (jd: string): string => {
    if (jd.toLowerCase().includes('fintech') || jd.toLowerCase().includes('financial')) return 'Financial Services'
    if (jd.toLowerCase().includes('healthcare') || jd.toLowerCase().includes('medical')) return 'Healthcare'
    if (jd.toLowerCase().includes('ecommerce') || jd.toLowerCase().includes('retail')) return 'E-commerce'
    return 'Technology'
  }

  const extractBulletPoints = (content: string): string[] => {
    if (content.includes('<li>')) {
      return content.match(/<li>(.*?)<\/li>/g)?.map(li => li.replace(/<\/?li>/g, '')) || []
    }
    return content.split('\n').filter(line => line.trim().startsWith('•')).map(line => line.replace('•', '').trim())
  }

  const formatAsBulletPoints = (points: string[]): string => {
    return '<ul>' + points.map(point => `<li>${point}</li>`).join('') + '</ul>'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreStatus = (score: number) => {
    if (score >= 85) return 'Excellent Match'
    if (score >= 70) return 'Good Match'
    if (score >= 55) return 'Moderate Match'
    return 'Needs Improvement'
  }

  const applyOptimizations = () => {
    if (!optimizations || !onApplyOptimizations) return

    onApplyOptimizations(optimizations)
    alert('Optimizations applied! Review the suggested changes in each section.')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Job Description Matcher
          </h2>
          <Button variant="outline" onClick={onClose}>✕</Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Job Description Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full"
                />
                <Button
                  onClick={analyzeJobMatch}
                  disabled={isAnalyzing || !jobDescription.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing Match...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Job Match
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Match Score</TabsTrigger>
                  <TabsTrigger value="gaps">Gaps & Strengths</TabsTrigger>
                  <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center mb-6">
                        <div className={`text-5xl font-bold ${getScoreColor(analysis.score)} mb-2`}>
                          {analysis.score}%
                        </div>
                        <div className="text-lg text-gray-600">{getScoreStatus(analysis.score)}</div>
                        <Progress value={analysis.score} className="w-48 mx-auto mt-4" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {analysis.strengths.map((strength, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-2">
                            {analysis.gaps.map((gap, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="gaps" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm text-green-600">Your Strengths</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {strength}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm text-orange-600">Improvement Areas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {analysis.gaps.map((gap, index) => (
                          <Badge key={index} variant="destructive" className="mr-2 mb-2">
                            {gap}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                            <span className="text-sm text-gray-800">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="optimizations" className="space-y-4">
                  {optimizations ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">AI-Generated Optimizations</h3>
                        <Button onClick={applyOptimizations} className="bg-green-600 hover:bg-green-700 text-white">
                          Apply All Optimizations
                        </Button>
                      </div>

                      {optimizations.summary && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Optimized Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm">{optimizations.summary}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {optimizations.skills && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Suggested Skills to Add</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {optimizations.skills.missing?.map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-blue-600">
                                  + {skill}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500">
                          Run job analysis first to see optimization suggestions
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Important Keywords from Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="mb-2">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Consider incorporating these keywords naturally into your resume content
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
