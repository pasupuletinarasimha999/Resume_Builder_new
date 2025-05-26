'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  Target,
  TrendingUp,
  Eye,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Filter,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react'

interface Keyword {
  term: string
  frequency: number
  importance: number
  category: 'technical' | 'soft' | 'industry' | 'role' | 'certification' | 'tool'
  suggestions: string[]
  alternatives: string[]
  context: string[]
  trend: 'rising' | 'stable' | 'declining'
  atsScore: number
}

interface KeywordAnalysis {
  total: number
  density: number
  coverage: number
  missing: Keyword[]
  present: Keyword[]
  optimized: Keyword[]
  recommendations: {
    add: string[]
    remove: string[]
    optimize: string[]
  }
}

interface KeywordOptimizationEngineProps {
  resumeText: string
  jobDescription?: string
  industry?: string
  targetRole?: string
  onKeywordApply?: (keyword: string, action: 'add' | 'replace', original?: string) => void
}

const INDUSTRY_KEYWORDS = {
  technology: {
    technical: [
      { term: 'JavaScript', importance: 9, alternatives: ['JS', 'ECMAScript'], trend: 'stable' as const },
      { term: 'Python', importance: 9, alternatives: ['Python3', 'Django', 'Flask'], trend: 'rising' as const },
      { term: 'React', importance: 8, alternatives: ['ReactJS', 'React.js'], trend: 'stable' as const },
      { term: 'Node.js', importance: 8, alternatives: ['NodeJS', 'Express'], trend: 'stable' as const },
      { term: 'AWS', importance: 9, alternatives: ['Amazon Web Services', 'EC2', 'S3'], trend: 'rising' as const },
      { term: 'Docker', importance: 8, alternatives: ['Containerization', 'Container'], trend: 'rising' as const },
      { term: 'Kubernetes', importance: 8, alternatives: ['K8s', 'Container Orchestration'], trend: 'rising' as const },
      { term: 'Microservices', importance: 7, alternatives: ['Microservice Architecture'], trend: 'stable' as const },
      { term: 'CI/CD', importance: 8, alternatives: ['Continuous Integration', 'DevOps'], trend: 'stable' as const },
      { term: 'API', importance: 8, alternatives: ['REST API', 'RESTful', 'GraphQL'], trend: 'stable' as const }
    ],
    soft: [
      { term: 'Agile', importance: 8, alternatives: ['Scrum', 'Kanban'], trend: 'stable' as const },
      { term: 'Leadership', importance: 7, alternatives: ['Team Lead', 'Mentoring'], trend: 'stable' as const },
      { term: 'Problem Solving', importance: 8, alternatives: ['Troubleshooting', 'Debugging'], trend: 'stable' as const },
      { term: 'Communication', importance: 7, alternatives: ['Collaboration', 'Teamwork'], trend: 'stable' as const }
    ],
    tools: [
      { term: 'Git', importance: 8, alternatives: ['GitHub', 'GitLab', 'Version Control'], trend: 'stable' as const },
      { term: 'Jira', importance: 6, alternatives: ['Project Management', 'Issue Tracking'], trend: 'stable' as const },
      { term: 'Jenkins', importance: 7, alternatives: ['Build Automation', 'CI Tool'], trend: 'declining' as const },
      { term: 'Terraform', importance: 7, alternatives: ['Infrastructure as Code', 'IaC'], trend: 'rising' as const }
    ]
  },
  marketing: {
    technical: [
      { term: 'SEO', importance: 9, alternatives: ['Search Engine Optimization'], trend: 'stable' as const },
      { term: 'SEM', importance: 8, alternatives: ['Search Engine Marketing', 'PPC'], trend: 'stable' as const },
      { term: 'Google Analytics', importance: 8, alternatives: ['GA', 'Web Analytics'], trend: 'stable' as const },
      { term: 'Social Media Marketing', importance: 8, alternatives: ['SMM', 'Social Marketing'], trend: 'stable' as const },
      { term: 'Content Marketing', importance: 7, alternatives: ['Content Strategy'], trend: 'rising' as const },
      { term: 'Email Marketing', importance: 7, alternatives: ['Email Campaigns'], trend: 'stable' as const }
    ],
    soft: [
      { term: 'Creative Thinking', importance: 7, alternatives: ['Creativity', 'Innovation'], trend: 'stable' as const },
      { term: 'Data Analysis', importance: 8, alternatives: ['Analytics', 'Data-Driven'], trend: 'rising' as const },
      { term: 'Brand Management', importance: 7, alternatives: ['Branding', 'Brand Strategy'], trend: 'stable' as const }
    ],
    tools: [
      { term: 'HubSpot', importance: 7, alternatives: ['Marketing Automation'], trend: 'rising' as const },
      { term: 'Salesforce', importance: 8, alternatives: ['CRM', 'Sales Cloud'], trend: 'stable' as const },
      { term: 'Adobe Creative Suite', importance: 6, alternatives: ['Photoshop', 'Illustrator'], trend: 'stable' as const }
    ]
  }
}

const ATS_OPTIMIZATION_RULES = {
  keywordDensity: { min: 1, max: 3, optimal: 2 },
  keywordVariation: { min: 2, recommended: 4 },
  contextualPlacement: ['summary', 'experience', 'skills'],
  avoidOveruse: true
}

export default function KeywordOptimizationEngine({
  resumeText,
  jobDescription = '',
  industry = 'technology',
  targetRole = '',
  onKeywordApply
}: KeywordOptimizationEngineProps) {
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null)
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('analysis')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null)

  const performKeywordAnalysis = useCallback(async () => {
    setIsAnalyzing(true)

    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000))

    const result = await analyzeKeywords()
    setAnalysis(result)
    setIsAnalyzing(false)
  }, [])

  const analyzeKeywords = async (): Promise<KeywordAnalysis> => {
    const resumeLower = resumeText.toLowerCase()
    const jobLower = jobDescription.toLowerCase()

    // Get industry-specific keywords
    const industryData = INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS] || INDUSTRY_KEYWORDS.technology
    const allKeywords: Keyword[] = []

    // Process technical keywords
    if (industryData.technical) {
      for (const keyword of industryData.technical) {
        allKeywords.push({
          ...keyword,
          category: 'technical',
          frequency: countKeywordFrequency(resumeLower, keyword.term, keyword.alternatives),
          suggestions: generateSuggestions(keyword.term, keyword.alternatives),
          context: findKeywordContext(resumeText, keyword.term, keyword.alternatives),
          atsScore: calculateATSScore(keyword.term, keyword.alternatives, resumeLower, jobLower)
        })
      }
    }

    // Process soft skills
    if (industryData.soft) {
      for (const keyword of industryData.soft) {
        allKeywords.push({
          ...keyword,
          category: 'soft',
          frequency: countKeywordFrequency(resumeLower, keyword.term, keyword.alternatives),
          suggestions: generateSuggestions(keyword.term, keyword.alternatives),
          context: findKeywordContext(resumeText, keyword.term, keyword.alternatives),
          atsScore: calculateATSScore(keyword.term, keyword.alternatives, resumeLower, jobLower)
        })
      }
    }

    // Process tools
    if (industryData.tools) {
      for (const keyword of industryData.tools) {
        allKeywords.push({
          ...keyword,
          category: 'tool',
          frequency: countKeywordFrequency(resumeLower, keyword.term, keyword.alternatives),
          suggestions: generateSuggestions(keyword.term, keyword.alternatives),
          context: findKeywordContext(resumeText, keyword.term, keyword.alternatives),
          atsScore: calculateATSScore(keyword.term, keyword.alternatives, resumeLower, jobLower)
        })
      }
    }

    // Extract keywords from job description
    if (jobDescription) {
      const jobKeywords = extractJobKeywords(jobDescription)
      for (const jobKeyword of jobKeywords) {
        if (!allKeywords.find(k => k.term.toLowerCase() === jobKeyword.toLowerCase())) {
          allKeywords.push({
            term: jobKeyword,
            category: 'role',
            importance: 8,
            frequency: countKeywordFrequency(resumeLower, jobKeyword, []),
            alternatives: [],
            suggestions: [],
            context: findKeywordContext(resumeText, jobKeyword, []),
            trend: 'stable',
            atsScore: calculateATSScore(jobKeyword, [], resumeLower, jobLower)
          })
        }
      }
    }

    // Categorize keywords
    const present = allKeywords.filter(k => k.frequency > 0)
    const missing = allKeywords.filter(k => k.frequency === 0 && k.importance >= 7)
    const optimized = allKeywords.filter(k => k.frequency > 0 && k.atsScore >= 80)

    // Calculate metrics
    const totalWords = resumeText.split(/\s+/).length
    const totalKeywords = allKeywords.reduce((sum, k) => sum + k.frequency, 0)
    const density = (totalKeywords / totalWords) * 100
    const coverage = (present.length / allKeywords.length) * 100

    // Generate recommendations
    const recommendations = generateRecommendations(allKeywords, present, missing)

    return {
      total: allKeywords.length,
      density: Math.round(density * 100) / 100,
      coverage: Math.round(coverage),
      missing,
      present,
      optimized,
      recommendations
    }
  }

  const countKeywordFrequency = (text: string, term: string, alternatives: string[]): number => {
    let count = 0
    const patterns = [term, ...alternatives].map(t => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'))

    for (const pattern of patterns) {
      const matches = text.match(pattern)
      if (matches) count += matches.length
    }

    return count
  }

  const findKeywordContext = (text: string, term: string, alternatives: string[]): string[] => {
    const contexts: string[] = []
    const patterns = [term, ...alternatives].map(t => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'))

    for (const pattern of patterns) {
      let match: RegExpExecArray | null = pattern.exec(text)
      while (match !== null) {
        const start = Math.max(0, match.index - 50)
        const end = Math.min(text.length, match.index + match[0].length + 50)
        contexts.push(text.substring(start, end).trim())
        match = pattern.exec(text)
      }
    }

    return contexts.slice(0, 3) // Limit to 3 contexts
  }

  const calculateATSScore = (term: string, alternatives: string[], resumeText: string, jobText: string): number => {
    let score = 0

    // Base score for presence in resume
    const resumeFreq = countKeywordFrequency(resumeText, term, alternatives)
    if (resumeFreq > 0) score += 40

    // Bonus for presence in job description
    if (jobText) {
      const jobFreq = countKeywordFrequency(jobText, term, alternatives)
      if (jobFreq > 0) score += 30
    }

    // Optimal frequency bonus (not too little, not too much)
    if (resumeFreq >= 1 && resumeFreq <= 3) score += 20

    // Context variety bonus
    const contexts = findKeywordContext(resumeText, term, alternatives)
    if (contexts.length >= 2) score += 10

    return Math.min(100, score)
  }

  const extractJobKeywords = (jobText: string): string[] => {
    // Simple keyword extraction - in real implementation, this would be more sophisticated
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'upon', 'across', 'under', 'over'])

    const words = jobText.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))

    const wordFreq: Record<string, number> = {}
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }

    return Object.entries(wordFreq)
      .filter(([_, freq]) => freq >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  const generateSuggestions = (term: string, alternatives: string[]): string[] => {
    const suggestions = [
      `Add "${term}" to your skills section`,
      `Mention "${term}" in your work experience`,
      `Include "${term}" in your professional summary`
    ]

    if (alternatives.length > 0) {
      suggestions.push(`Consider using variants: ${alternatives.join(', ')}`)
    }

    return suggestions
  }

  const generateRecommendations = (all: Keyword[], present: Keyword[], missing: Keyword[]) => {
    const add = missing
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5)
      .map(k => k.term)

    const remove = present
      .filter(k => k.frequency > 4) // Overused keywords
      .map(k => k.term)

    const optimize = present
      .filter(k => k.atsScore < 60)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3)
      .map(k => k.term)

    return { add, remove, optimize }
  }

  const copyKeyword = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword)
      setCopiedKeyword(keyword)
      setTimeout(() => setCopiedKeyword(null), 2000)
    } catch (err) {
      console.error('Failed to copy keyword:', err)
    }
  }

  const applyKeyword = (keyword: string, action: 'add' | 'replace', original?: string) => {
    onKeywordApply?.(keyword, action, original)
    setSelectedKeywords(prev => new Set([...prev, keyword]))
  }

  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyword)) {
        newSet.delete(keyword)
      } else {
        newSet.add(keyword)
      }
      return newSet
    })
  }

  const getFilteredKeywords = (keywords: Keyword[]) => {
    let filtered = keywords

    if (filterCategory !== 'all') {
      filtered = filtered.filter(k => k.category === filterCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(k =>
        k.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.alternatives.some(alt => alt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'declining': return <ArrowDown className="h-4 w-4 text-red-500" />
      default: return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'soft': return 'bg-green-100 text-green-800'
      case 'tool': return 'bg-purple-100 text-purple-800'
      case 'role': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    if (resumeText) {
      performKeywordAnalysis()
    }
  }, [resumeText, performKeywordAnalysis])

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 animate-pulse" />
            Keyword Optimization Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-8">
            <RefreshCw className="h-12 w-12 text-blue-500 animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Analyzing Keywords...</p>
              <p className="text-sm text-muted-foreground">
                Optimizing for ATS and industry relevance
              </p>
            </div>
            <Progress value={66} className="w-64" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Keyword Optimization Engine
          <Badge variant="outline" className="ml-auto">
            {analysis.coverage}% coverage
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="missing">Missing</TabsTrigger>
            <TabsTrigger value="present">Present</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">Coverage</p>
                <p className="text-xl font-bold text-blue-600">{analysis.coverage}%</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">Present</p>
                <p className="text-xl font-bold text-green-600">{analysis.present.length}</p>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-800">Missing</p>
                <p className="text-xl font-bold text-red-600">{analysis.missing.length}</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-800">Optimized</p>
                <p className="text-xl font-bold text-purple-600">{analysis.optimized.length}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Keyword Density</span>
                  <span className="text-sm text-muted-foreground">{analysis.density}%</span>
                </div>
                <Progress value={Math.min(100, (analysis.density / 3) * 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal range: 1-3%
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Industry Coverage</span>
                  <span className="text-sm text-muted-foreground">{analysis.coverage}%</span>
                </div>
                <Progress value={analysis.coverage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage of important industry keywords present
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="missing" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search keywords</Label>
                <Input
                  id="search"
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="tool">Tools</option>
                  <option value="role">Role-specific</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {getFilteredKeywords(analysis.missing).map((keyword) => (
                <div key={keyword.term} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{keyword.term}</span>
                        <Badge className={getCategoryColor(keyword.category)}>
                          {keyword.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Importance: {keyword.importance}/10
                        </Badge>
                        {getTrendIcon(keyword.trend)}
                      </div>

                      {keyword.alternatives.length > 0 && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Alternatives: {keyword.alternatives.join(', ')}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => applyKeyword(keyword.term, 'add')}
                          disabled={selectedKeywords.has(keyword.term)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Add to Resume
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyKeyword(keyword.term)}
                        >
                          {copiedKeyword === keyword.term ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="present" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search present keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="technical">Technical</option>
                <option value="soft">Soft Skills</option>
                <option value="tool">Tools</option>
                <option value="role">Role-specific</option>
              </select>
            </div>

            <div className="space-y-3">
              {getFilteredKeywords(analysis.present).map((keyword) => (
                <div key={keyword.term} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{keyword.term}</span>
                        <Badge className={getCategoryColor(keyword.category)}>
                          {keyword.category}
                        </Badge>
                        <Badge variant={keyword.atsScore >= 80 ? 'default' : keyword.atsScore >= 60 ? 'secondary' : 'destructive'}>
                          ATS: {keyword.atsScore}%
                        </Badge>
                        <Badge variant="outline">
                          Used {keyword.frequency}x
                        </Badge>
                      </div>

                      {keyword.context.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Context:</p>
                          <p className="text-sm text-muted-foreground">
                            "{keyword.context[0]}..."
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Progress value={keyword.atsScore} className="flex-1 h-2" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyKeyword(keyword.term)}
                        >
                          {copiedKeyword === keyword.term ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  High Priority: Add These Keywords
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {analysis.recommendations.add.map((keyword) => (
                    <div key={keyword} className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="font-medium text-green-800">{keyword}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyKeyword(keyword, 'add')}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.recommendations.optimize.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-600 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Optimize These Keywords
                  </h4>
                  <div className="space-y-2">
                    {analysis.recommendations.optimize.map((keyword) => (
                      <div key={keyword} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                        <span className="font-medium text-blue-800">{keyword}</span>
                        <Badge variant="secondary">Needs optimization</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.recommendations.remove.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Consider Reducing
                  </h4>
                  <div className="space-y-2">
                    {analysis.recommendations.remove.map((keyword) => (
                      <div key={keyword} className="flex items-center justify-between p-3 bg-red-50 rounded">
                        <span className="font-medium text-red-800">{keyword}</span>
                        <Badge variant="destructive">Overused</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Pro Tips</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use keywords naturally in context, avoid keyword stuffing</li>
                <li>• Include variations and synonyms of important keywords</li>
                <li>• Place high-priority keywords in your summary and job titles</li>
                <li>• Match the exact keywords from job descriptions when relevant</li>
                <li>• Update keywords based on industry trends and job requirements</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={performKeywordAnalysis}
            disabled={isAnalyzing}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-analyze Keywords
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
