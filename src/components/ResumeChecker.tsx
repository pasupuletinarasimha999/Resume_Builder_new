'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, AlertTriangle, Target, Brain, FileText, Shield } from 'lucide-react'
import { resumeAnalyzer } from '@/utils/resumeAnalyzer'

interface AnalysisResult {
  overallScore: number
  categories: Record<string, CategoryResult>
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

interface ResumeCheckerProps {
  resumeData: ResumeData
  sections: ResumeSections
  isOpen: boolean
  onClose: () => void
}

export function ResumeChecker({ resumeData, sections, isOpen, onClose }: ResumeCheckerProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (isOpen && !analysis) {
      performAnalysis()
    }
  }, [isOpen, analysis])

  const performAnalysis = async () => {
    setIsAnalyzing(true)
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000))

    const result = resumeAnalyzer.analyzeResume(resumeData, sections)
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default: return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentStrength': return <FileText className="w-5 h-5" />
      case 'dataIdentification': return <Target className="w-5 h-5" />
      case 'semanticAnalysis': return <Brain className="w-5 h-5" />
      case 'atsCompatibility': return <Shield className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'documentStrength': return 'Document Strength'
      case 'dataIdentification': return 'Data Identification'
      case 'semanticAnalysis': return 'Semantic Analysis'
      case 'atsCompatibility': return 'ATS Compatibility'
      default: return category
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Resume Analysis Report</h2>
          <Button variant="outline" onClick={onClose}>✕</Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Analyzing your resume...</h3>
              <p className="text-sm text-gray-600 mt-2">Checking ATS compatibility, keywords, and content quality</p>
            </div>
          ) : analysis ? (
            <div className="p-6">
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)} mb-2`}>
                  {analysis.overallScore}
                </div>
                <div className="text-lg text-gray-600">Overall Resume Score</div>
                <div className="w-32 mx-auto mt-4">
                  <Progress value={analysis.overallScore} className="h-3" />
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysis.categories).map(([key, category]: [string, CategoryResult]) => (
                      <Card key={key}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            {getCategoryIcon(key)}
                            {getCategoryName(key)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className={`text-2xl font-bold ${getScoreColor((category.score / category.maxScore) * 100)}`}>
                              {Math.round((category.score / category.maxScore) * 100)}%
                            </div>
                            <Badge variant={category.status === 'excellent' ? 'default' :
                                           category.status === 'good' ? 'secondary' : 'destructive'}>
                              {category.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Progress value={(category.score / category.maxScore) * 100} className="mt-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  {Object.entries(analysis.categories).map(([key, category]: [string, CategoryResult]) => (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {getCategoryIcon(key)}
                          {getCategoryName(key)}
                          <Badge variant={category.status === 'excellent' ? 'default' :
                                         category.status === 'good' ? 'secondary' : 'destructive'}>
                            {Math.round((category.score / category.maxScore) * 100)}%
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.checks.map((check: Check) => (
                            <div key={check.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              {getStatusIcon(check.status)}
                              <div className="flex-1">
                                <div className="font-medium text-sm">{check.name}</div>
                                <div className="text-sm text-gray-600">{check.message}</div>
                                {check.suggestion && (
                                  <div className="text-sm text-blue-600 mt-1">
                                    💡 {check.suggestion}
                                  </div>
                                )}
                              </div>
                              <Badge variant={check.impact === 'high' ? 'destructive' :
                                            check.impact === 'medium' ? 'secondary' : 'outline'}>
                                {check.impact}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Keyword Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Keywords:</span>
                          <Badge>{analysis.keywordAnalysis.totalKeywords}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Keyword Density:</span>
                          <Badge>{analysis.keywordAnalysis.keywordDensity.toFixed(1)}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Technical Skills:</span>
                          <Badge>{analysis.keywordAnalysis.technicalSkills.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Soft Skills:</span>
                          <Badge>{analysis.keywordAnalysis.softSkills.length}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Found Keywords</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium mb-2">Technical Skills:</div>
                            <div className="flex flex-wrap gap-1">
                              {analysis.keywordAnalysis.technicalSkills.slice(0, 10).map((skill: string) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2">Soft Skills:</div>
                            <div className="flex flex-wrap gap-1">
                              {analysis.keywordAnalysis.softSkills.slice(0, 10).map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {analysis.keywordAnalysis.missingKeywords.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Suggested Keywords to Add</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywordAnalysis.missingKeywords.map((keyword: string) => (
                            <Badge key={keyword} variant="destructive" className="text-xs">
                              + {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  {analysis.recommendations.map((recommendation: Recommendation) => (
                    <Card key={recommendation.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Badge variant={recommendation.priority === 'high' ? 'destructive' :
                                          recommendation.priority === 'medium' ? 'secondary' : 'outline'}>
                            {recommendation.priority}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-medium">{recommendation.title}</div>
                            <div className="text-sm text-gray-600 mt-1">{recommendation.description}</div>
                            <div className="text-xs text-gray-500 mt-2">
                              Category: {getCategoryName(recommendation.category)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
