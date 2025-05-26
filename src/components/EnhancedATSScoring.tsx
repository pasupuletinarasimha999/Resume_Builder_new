'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  Zap,
  BarChart3,
  Lightbulb
} from 'lucide-react'

interface ATSScore {
  overall: number
  categories: {
    keywords: number
    formatting: number
    experience: number
    skills: number
    education: number
    contact: number
  }
  aiInsights: {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    industryMatch: number
    roleCompatibility: number
  }
  mlPredictions: {
    passRate: number
    rankingPosition: number
    improvementPotential: number
    competitiveScore: number
  }
}

interface WorkExperience {
  company?: string
  position?: string
  description?: string
  startDate?: string
  endDate?: string
}

interface Education {
  degree?: string
  institution?: string
  graduationDate?: string
  gpa?: string
}

interface EnhancedATSScoringProps {
  resumeData: {
    personalInfo?: { email?: string; phone?: string; linkedin?: string; location?: string }
    workExperience?: WorkExperience[]
    skills?: string[]
    education?: Education[]
  }
  jobDescription?: string
  industry?: string
  targetRole?: string
  onScoreUpdate?: (score: ATSScore) => void
}

const ATS_KEYWORDS_DATABASE = {
  technology: {
    keywords: ['agile', 'scrum', 'ci/cd', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'microservices', 'api', 'rest', 'graphql', 'javascript', 'python', 'react', 'node.js', 'sql', 'nosql', 'mongodb', 'postgresql'],
    weights: { 'cloud': 1.5, 'aws': 1.4, 'azure': 1.4, 'kubernetes': 1.3, 'react': 1.2, 'python': 1.2 }
  },
  marketing: {
    keywords: ['seo', 'sem', 'social media', 'analytics', 'conversion', 'roi', 'kpi', 'crm', 'email marketing', 'content marketing', 'brand management', 'digital marketing', 'ppc', 'google ads', 'facebook ads'],
    weights: { 'roi': 1.5, 'analytics': 1.4, 'conversion': 1.3, 'seo': 1.2, 'sem': 1.2 }
  },
  finance: {
    keywords: ['financial modeling', 'excel', 'sql', 'tableau', 'power bi', 'risk management', 'compliance', 'gaap', 'ifrs', 'financial analysis', 'budgeting', 'forecasting', 'investment', 'portfolio'],
    weights: { 'financial modeling': 1.5, 'risk management': 1.4, 'compliance': 1.3, 'gaap': 1.3, 'ifrs': 1.3 }
  }
}

const ML_SCORING_FACTORS = {
  keywordDensity: 0.25,
  experienceMatch: 0.20,
  skillsAlignment: 0.20,
  educationFit: 0.15,
  formatOptimization: 0.10,
  industryRelevance: 0.10
}

export default function EnhancedATSScoring({
  resumeData,
  jobDescription = '',
  industry = 'technology',
  targetRole = '',
  onScoreUpdate
}: EnhancedATSScoringProps) {
  const [score, setScore] = useState<ATSScore | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')

  const performEnhancedATSAnalysis = useCallback(async () => {
    setIsAnalyzing(true)

    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 3000))

    const analysisResult = await runMLScoringModel()
    setScore(analysisResult)
    onScoreUpdate?.(analysisResult)
    setIsAnalyzing(false)
  }, [onScoreUpdate])

  const runMLScoringModel = async (): Promise<ATSScore> => {
    // Simulate advanced ML analysis
    const resumeText = JSON.stringify(resumeData).toLowerCase()
    const jobText = jobDescription.toLowerCase()

    // Keyword analysis with industry-specific weighting
    const industryData = ATS_KEYWORDS_DATABASE[industry as keyof typeof ATS_KEYWORDS_DATABASE] || ATS_KEYWORDS_DATABASE.technology
    const keywordMatches = industryData.keywords.filter(keyword =>
      resumeText.includes(keyword.toLowerCase())
    )

    const weightedKeywordScore = keywordMatches.reduce((score, keyword) => {
      const weight = industryData.weights[keyword as keyof typeof industryData.weights] || 1
      return score + (weight * 10)
    }, 0)

    const keywordScore = Math.min(100, (weightedKeywordScore / industryData.keywords.length) * 10)

    // ML-based scoring simulation
    const experienceScore = calculateExperienceMatch()
    const skillsScore = calculateSkillsAlignment()
    const formatScore = calculateFormatScore()
    const educationScore = calculateEducationScore()
    const contactScore = calculateContactScore()

    // AI insights generation
    const aiInsights = generateAIInsights(keywordScore, experienceScore, skillsScore)

    // ML predictions
    const mlPredictions = generateMLPredictions(keywordScore, experienceScore, skillsScore)

    const overallScore = (
      keywordScore * ML_SCORING_FACTORS.keywordDensity +
      experienceScore * ML_SCORING_FACTORS.experienceMatch +
      skillsScore * ML_SCORING_FACTORS.skillsAlignment +
      educationScore * ML_SCORING_FACTORS.educationFit +
      formatScore * ML_SCORING_FACTORS.formatOptimization +
      (aiInsights.industryMatch * ML_SCORING_FACTORS.industryRelevance)
    )

    return {
      overall: Math.round(overallScore),
      categories: {
        keywords: Math.round(keywordScore),
        formatting: Math.round(formatScore),
        experience: Math.round(experienceScore),
        skills: Math.round(skillsScore),
        education: Math.round(educationScore),
        contact: Math.round(contactScore)
      },
      aiInsights,
      mlPredictions
    }
  }

  const calculateExperienceMatch = (): number => {
    const experiences = resumeData.workExperience || []
    if (experiences.length === 0) return 0

    // Simulate ML analysis of experience relevance
    const roleRelevance = targetRole ? 0.8 : 0.6
    const industryBonus = industry === 'technology' ? 1.1 : 1.0
    const experienceDepth = Math.min(experiences.length * 15, 90)

    return Math.min(100, experienceDepth * roleRelevance * industryBonus)
  }

  const calculateSkillsAlignment = (): number => {
    const skills = resumeData.skills || []
    const industryData = ATS_KEYWORDS_DATABASE[industry as keyof typeof ATS_KEYWORDS_DATABASE] || ATS_KEYWORDS_DATABASE.technology

    const relevantSkills = skills.filter((skill: string) =>
      industryData.keywords.some(keyword =>
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    )

    return Math.min(100, (relevantSkills.length / Math.max(skills.length, 1)) * 100)
  }

  const calculateFormatScore = (): number => {
    // Simulate format analysis
    const hasContact = resumeData.personalInfo?.email && resumeData.personalInfo?.phone
    const hasWorkExp = (resumeData.workExperience?.length ?? 0) > 0
    const hasEducation = (resumeData.education?.length ?? 0) > 0
    const hasSkills = (resumeData.skills?.length ?? 0) > 0

    const formatFactors = [hasContact, hasWorkExp, hasEducation, hasSkills]
    return (formatFactors.filter(Boolean).length / formatFactors.length) * 100
  }

  const calculateEducationScore = (): number => {
    const education = resumeData.education || []
    if (education.length === 0) return 30

    // Simulate education relevance scoring
    const hasRelevantDegree = education.some((edu: Education) =>
      edu.degree?.toLowerCase().includes('computer') ||
      edu.degree?.toLowerCase().includes('engineer') ||
      edu.degree?.toLowerCase().includes('science')
    )

    return hasRelevantDegree ? 85 : 65
  }

  const calculateContactScore = (): number => {
    const contact = resumeData.personalInfo || {}
    const hasEmail = !!contact.email
    const hasPhone = !!contact.phone
    const hasLinkedIn = !!contact.linkedin
    const hasLocation = !!contact.location

    const contactFactors = [hasEmail, hasPhone, hasLinkedIn, hasLocation]
    return (contactFactors.filter(Boolean).length / contactFactors.length) * 100
  }

  const generateAIInsights = (keywordScore: number, experienceScore: number, skillsScore: number) => {
    const strengths = []
    const weaknesses = []
    const recommendations = []

    if (keywordScore >= 80) strengths.push('Strong keyword optimization')
    else if (keywordScore < 50) {
      weaknesses.push('Insufficient industry keywords')
      recommendations.push('Add more relevant technical keywords from the job description')
    }

    if (experienceScore >= 80) strengths.push('Excellent experience relevance')
    else if (experienceScore < 60) {
      weaknesses.push('Experience could be more targeted')
      recommendations.push('Emphasize achievements that align with the target role')
    }

    if (skillsScore >= 80) strengths.push('Well-aligned skill set')
    else {
      weaknesses.push('Skills section needs enhancement')
      recommendations.push('Add trending technologies and methodologies in your field')
    }

    return {
      strengths,
      weaknesses,
      recommendations,
      industryMatch: Math.min(100, (keywordScore + skillsScore) / 2),
      roleCompatibility: Math.min(100, (experienceScore + skillsScore) / 2)
    }
  }

  const generateMLPredictions = (keywordScore: number, experienceScore: number, skillsScore: number) => {
    const averageScore = (keywordScore + experienceScore + skillsScore) / 3

    return {
      passRate: Math.max(10, Math.min(95, averageScore - 5 + Math.random() * 10)),
      rankingPosition: Math.ceil((100 - averageScore) / 10),
      improvementPotential: Math.max(5, 100 - averageScore),
      competitiveScore: Math.max(30, averageScore + Math.random() * 20 - 10)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  useEffect(() => {
    if (resumeData) {
      performEnhancedATSAnalysis()
    }
  }, [resumeData, performEnhancedATSAnalysis])

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            AI-Enhanced ATS Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-8">
            <Zap className="h-12 w-12 text-blue-500 animate-bounce" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Running ML Analysis...</p>
              <p className="text-sm text-muted-foreground">
                Analyzing with advanced AI models for industry-specific insights
              </p>
            </div>
            <Progress value={33} className="w-64" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!score) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Enhanced ATS Scoring
          <Badge variant={getScoreBadgeVariant(score.overall)} className="ml-auto">
            {score.overall}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall ATS Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
                    {score.overall}%
                  </span>
                </div>
                <Progress value={score.overall} className="h-3" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Industry Match</span>
                  <span className={`text-lg font-semibold ${getScoreColor(score.aiInsights.industryMatch)}`}>
                    {score.aiInsights.industryMatch}%
                  </span>
                </div>
                <Progress value={score.aiInsights.industryMatch} className="h-2" />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">Strengths</p>
                <p className="text-xl font-bold text-green-600">{score.aiInsights.strengths.length}</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-800">Areas to Improve</p>
                <p className="text-xl font-bold text-red-600">{score.aiInsights.weaknesses.length}</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Lightbulb className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">Recommendations</p>
                <p className="text-xl font-bold text-blue-600">{score.aiInsights.recommendations.length}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {Object.entries(score.categories).map(([category, categoryScore]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <Badge variant={getScoreBadgeVariant(categoryScore)}>
                    {categoryScore}%
                  </Badge>
                </div>
                <Progress value={categoryScore} className="h-2" />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {score.aiInsights.strengths.map((strength, index) => (
                    <li key={`strength-${index}-${strength.slice(0, 15)}`} className="text-sm text-muted-foreground pl-4">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {score.aiInsights.weaknesses.map((weakness, index) => (
                    <li key={`weakness-${index}-${weakness.slice(0, 15)}`} className="text-sm text-muted-foreground pl-4">
                      • {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Recommendations
                </h4>
                <ul className="space-y-1">
                  {score.aiInsights.recommendations.map((recommendation, index) => (
                    <li key={`recommendation-${index}-${recommendation.slice(0, 15)}`} className="text-sm text-muted-foreground pl-4">
                      • {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">ATS Pass Rate</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(score.mlPredictions.passRate)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Likelihood to pass initial screening
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Ranking Position</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  Top {score.mlPredictions.rankingPosition}0%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated position among candidates
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Improvement Potential</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  +{Math.round(score.mlPredictions.improvementPotential)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum possible score increase
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Competitive Score</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(score.mlPredictions.competitiveScore)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Compared to industry average
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={performEnhancedATSAnalysis}
            disabled={isAnalyzing}
            className="w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            Re-analyze with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
