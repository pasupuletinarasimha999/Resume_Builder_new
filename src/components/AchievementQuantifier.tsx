'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, DollarSign, Users, Clock, Percent, Copy, Check } from 'lucide-react'

interface QuantificationSuggestion {
  id: string
  original: string
  quantified: string
  metrics: {
    type: 'percentage' | 'number' | 'currency' | 'time' | 'scale'
    value: string
    unit: string
  }[]
  confidence: number
  reasoning: string
  industry?: string
}

interface AchievementQuantifierProps {
  text: string
  context?: {
    role?: string
    industry?: string
    company?: string
    experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive'
  }
  onApplyQuantification?: (original: string, quantified: string) => void
  className?: string
}

const METRIC_TEMPLATES = {
  software: {
    performance: ['improved response time by 40%', 'reduced load time from 3s to 0.8s', 'increased throughput by 60%'],
    users: ['serving 100K+ daily active users', 'supporting 50K+ monthly users', 'handling 1M+ requests daily'],
    efficiency: ['reduced deployment time by 75%', 'automated 90% of manual processes', 'decreased bug reports by 45%'],
    team: ['led team of 8 developers', 'mentored 5 junior developers', 'collaborated with 15+ stakeholders'],
    revenue: ['generated $500K in cost savings', 'increased revenue by $2M annually', 'reduced operational costs by 30%']
  },
  marketing: {
    engagement: ['increased engagement by 150%', 'boosted click-through rate by 85%', 'improved conversion by 40%'],
    reach: ['reached 500K+ potential customers', 'expanded audience by 200%', 'generated 50K+ leads'],
    campaigns: ['managed $1M+ advertising budget', 'launched 25+ successful campaigns', 'achieved 4.2x ROAS'],
    growth: ['increased followers by 300%', 'grew brand awareness by 60%', 'expanded market share by 15%']
  },
  sales: {
    revenue: ['exceeded quota by 125%', 'generated $2.5M in sales', 'increased territory revenue by 80%'],
    relationships: ['managed 150+ client accounts', 'maintained 95% client retention', 'acquired 50+ new clients'],
    process: ['reduced sales cycle by 30%', 'improved close rate by 45%', 'increased average deal size by 60%']
  },
  management: {
    team: ['managed cross-functional team of 25+', 'supervised 12 direct reports', 'led organization of 100+ employees'],
    budget: ['managed $5M annual budget', 'reduced costs by $800K annually', 'optimized spending by 25%'],
    projects: ['delivered 15+ projects on time', 'managed portfolio worth $10M+', 'achieved 98% project success rate']
  }
}

const ACHIEVEMENT_PATTERNS = [
  { pattern: /improv|increas|boost|enhanc|optim/i, metrics: ['percentage', 'number'] },
  { pattern: /reduc|decreas|cut|lower|minim/i, metrics: ['percentage', 'time', 'currency'] },
  { pattern: /manag|lead|supervis|oversee/i, metrics: ['number', 'scale'] },
  { pattern: /develop|build|creat|design|implement/i, metrics: ['number', 'scale', 'time'] },
  { pattern: /save|cost|budget|revenue|profit/i, metrics: ['currency', 'percentage'] },
  { pattern: /user|customer|client|visitor/i, metrics: ['number', 'scale'] },
  { pattern: /team|group|staff|member/i, metrics: ['number'] },
  { pattern: /time|speed|duration|period/i, metrics: ['time', 'percentage'] }
]

export function AchievementQuantifier({ text, context, onApplyQuantification, className }: AchievementQuantifierProps) {
  const [suggestions, setSuggestions] = useState<QuantificationSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const analyzeAchievements = useCallback(async (inputText: string) => {
    setIsAnalyzing(true)

    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const quantificationSuggestions: QuantificationSuggestion[] = []

    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim()

      // Skip if already quantified (contains numbers or percentages)
      if (/\d+/.test(trimmedSentence)) return

      // Find achievement patterns
      const matchedPatterns = ACHIEVEMENT_PATTERNS.filter(pattern =>
        pattern.pattern.test(trimmedSentence)
      )

      if (matchedPatterns.length > 0) {
        const industry = context?.industry?.toLowerCase() || 'software'
        const role = context?.role?.toLowerCase() || 'developer'
        const level = context?.experienceLevel || 'mid'

        const quantifiedVersions = generateQuantifiedVersions(
          trimmedSentence,
          matchedPatterns,
          industry,
          role,
          level
        )

        quantifiedVersions.forEach((version, vIndex) => {
          quantificationSuggestions.push({
            id: `quant_${index}_${vIndex}`,
            original: trimmedSentence,
            quantified: version.text,
            metrics: version.metrics,
            confidence: version.confidence,
            reasoning: version.reasoning,
            industry
          })
        })
      }
    })

    setSuggestions(quantificationSuggestions)
    setIsAnalyzing(false)
  }, [context])

  useEffect(() => {
    if (!text.trim() || text.length < 20) {
      setSuggestions([])
      return
    }

    analyzeAchievements(text)
  }, [text, analyzeAchievements])

  const generateQuantifiedVersions = (
    sentence: string,
    patterns: typeof ACHIEVEMENT_PATTERNS,
    industry: string,
    role: string,
    level: string
  ) => {
    const versions = []
    const industryTemplates = METRIC_TEMPLATES[industry as keyof typeof METRIC_TEMPLATES] || METRIC_TEMPLATES.software

    // Generate 2-3 different quantified versions
    if (sentence.toLowerCase().includes('improve') || sentence.toLowerCase().includes('increase')) {
      const percentages = level === 'senior' ? ['40%', '60%', '85%'] : ['25%', '35%', '50%']
      versions.push({
        text: `${sentence}, achieving a ${percentages[0]} improvement in efficiency`,
        metrics: [{ type: 'percentage' as const, value: percentages[0], unit: 'improvement' }],
        confidence: 0.8,
        reasoning: 'Added performance improvement metric typical for the role level'
      })
    }

    if (sentence.toLowerCase().includes('manage') || sentence.toLowerCase().includes('lead')) {
      const teamSizes = level === 'senior' ? ['12', '15', '20'] : ['5', '8', '10']
      versions.push({
        text: `${sentence} for a team of ${teamSizes[0]} professionals`,
        metrics: [{ type: 'number' as const, value: teamSizes[0], unit: 'team members' }],
        confidence: 0.9,
        reasoning: 'Added team size metric appropriate for management responsibilities'
      })
    }

    if (sentence.toLowerCase().includes('develop') || sentence.toLowerCase().includes('build')) {
      versions.push({
        text: `${sentence}, delivering the project 3 weeks ahead of schedule`,
        metrics: [{ type: 'time' as const, value: '3 weeks', unit: 'ahead of schedule' }],
        confidence: 0.7,
        reasoning: 'Added timeline achievement to demonstrate efficiency'
      })
    }

    if (sentence.toLowerCase().includes('save') || sentence.toLowerCase().includes('cost')) {
      const savings = level === 'senior' ? ['$250K', '$500K', '$1M'] : ['$50K', '$100K', '$200K']
      versions.push({
        text: `${sentence}, resulting in annual savings of ${savings[0]}`,
        metrics: [{ type: 'currency' as const, value: savings[0], unit: 'annual savings' }],
        confidence: 0.8,
        reasoning: 'Added cost savings metric to quantify business impact'
      })
    }

    if (sentence.toLowerCase().includes('user') || sentence.toLowerCase().includes('customer')) {
      const userCounts = level === 'senior' ? ['100K+', '500K+', '1M+'] : ['10K+', '50K+', '100K+']
      versions.push({
        text: `${sentence} for ${userCounts[0]} daily active users`,
        metrics: [{ type: 'scale' as const, value: userCounts[0], unit: 'daily active users' }],
        confidence: 0.8,
        reasoning: 'Added user scale metric to show impact scope'
      })
    }

    // Fallback generic quantification
    if (versions.length === 0) {
      const genericMetrics = ['25% efficiency gain', '40% improvement', '2x faster processing']
      versions.push({
        text: `${sentence}, achieving ${genericMetrics[0]}`,
        metrics: [{ type: 'percentage' as const, value: '25%', unit: 'efficiency gain' }],
        confidence: 0.6,
        reasoning: 'Added generic performance metric based on achievement pattern'
      })
    }

    return versions.slice(0, 2) // Return top 2 suggestions
  }

  const applySuggestion = (suggestion: QuantificationSuggestion) => {
    onApplyQuantification?.(suggestion.original, suggestion.quantified)
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-4 h-4" />
      case 'currency': return <DollarSign className="w-4 h-4" />
      case 'number': return <Target className="w-4 h-4" />
      case 'time': return <Clock className="w-4 h-4" />
      case 'scale': return <Users className="w-4 h-4" />
      default: return <TrendingUp className="w-4 h-4" />
    }
  }

  if (suggestions.length === 0 && !isAnalyzing) return null

  return (
    <div className={className}>
      {isAnalyzing && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing achievements for quantification...</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <Card className="border-l-4 border-l-green-500 mt-2">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle className="text-sm">Achievement Quantification Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-3 bg-green-50">
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Original:</div>
                      <div className="text-sm text-gray-700 bg-white p-2 rounded border">
                        {suggestion.original}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Quantified version:</div>
                      <div className="text-sm text-gray-900 bg-white p-2 rounded border border-green-200">
                        {suggestion.quantified}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {suggestion.metrics.map((metric) => (
                        <Badge key={`${metric.type}-${metric.value}-${metric.unit}`} variant="outline" className="text-xs">
                          {getMetricIcon(metric.type)}
                          <span className="ml-1">{metric.value} {metric.unit}</span>
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      <strong>Why this works:</strong> {suggestion.reasoning}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={`confidence-dot-${suggestion.id}-${i}`}
                              className={`w-2 h-2 rounded-full ${
                                i < suggestion.confidence * 5 ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(suggestion.quantified, suggestion.id)}
                          className="h-7 px-2 text-xs"
                        >
                          {copiedId === suggestion.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-green-200">
              <div className="text-xs text-gray-500">
                💡 Tip: Quantified achievements are 3x more likely to catch recruiter attention.
                Include percentages, dollar amounts, team sizes, and timeframes when possible.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
