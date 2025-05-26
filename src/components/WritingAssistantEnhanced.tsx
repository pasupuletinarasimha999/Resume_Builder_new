'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PenTool,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Eye,
  Volume2,
  Sparkles
} from 'lucide-react'

interface GrammarIssue {
  id: string
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  text: string
  suggestion: string
  position: { start: number; end: number }
  severity: 'low' | 'medium' | 'high'
  explanation: string
}

interface ToneAnalysis {
  overall: 'professional' | 'casual' | 'formal' | 'conversational' | 'confident' | 'passive'
  confidence: number
  metrics: {
    clarity: number
    conciseness: number
    professionalism: number
    engagement: number
    authority: number
  }
  suggestions: string[]
}

interface ReadabilityScore {
  grade: number
  level: string
  metrics: {
    avgSentenceLength: number
    avgWordsPerSentence: number
    complexWords: number
    readingTime: number
  }
  recommendations: string[]
}

interface WritingAssistantEnhancedProps {
  text: string
  onChange?: (text: string) => void
  context?: 'resume' | 'cover-letter' | 'experience' | 'summary'
  targetTone?: 'professional' | 'confident' | 'engaging'
  realTime?: boolean
}

const GRAMMAR_PATTERNS = [
  {
    pattern: /\b(there|their|they're)\b/gi,
    type: 'grammar' as const,
    check: (match: string, context: string) => {
      // Simplified grammar check logic
      if (match.toLowerCase() === 'there' && context.includes('house')) return null
      return {
        suggestion: 'Check there/their/they\'re usage',
        explanation: 'Ensure correct usage of there (location), their (possessive), they\'re (they are)'
      }
    }
  },
  {
    pattern: /\b(affect|effect)\b/gi,
    type: 'grammar' as const,
    check: (match: string, context: string) => ({
      suggestion: match.toLowerCase() === 'affect' ? 'Consider "effect" if used as noun' : 'Consider "affect" if used as verb',
      explanation: 'Affect is typically a verb (to influence), effect is typically a noun (a result)'
    })
  },
  {
    pattern: /\s{2,}/g,
    type: 'style' as const,
    check: () => ({
      suggestion: 'Remove extra spaces',
      explanation: 'Multiple consecutive spaces should be reduced to single spaces'
    })
  },
  {
    pattern: /([.!?])\s*([a-z])/g,
    type: 'grammar' as const,
    check: () => ({
      suggestion: 'Capitalize after sentence end',
      explanation: 'First word after sentence-ending punctuation should be capitalized'
    })
  }
]

const TONE_INDICATORS = {
  professional: {
    positive: ['achieved', 'delivered', 'implemented', 'managed', 'led', 'developed', 'optimized', 'increased'],
    negative: ['maybe', 'sort of', 'kind of', 'pretty much', 'i think', 'probably'],
    replacements: {
      'helped': 'supported',
      'worked on': 'developed',
      'did': 'executed',
      'made': 'created'
    }
  },
  confident: {
    positive: ['successfully', 'effectively', 'significantly', 'consistently', 'substantially'],
    negative: ['tried to', 'attempted', 'hoped to', 'maybe', 'might have'],
    replacements: {
      'tried to improve': 'improved',
      'helped increase': 'increased',
      'worked to achieve': 'achieved'
    }
  },
  engaging: {
    positive: ['innovative', 'creative', 'dynamic', 'passionate', 'collaborative', 'inspiring', 'transformative'],
    negative: ['boring', 'routine', 'mundane', 'ordinary', 'standard', 'basic'],
    replacements: {
      'worked': 'collaborated',
      'made': 'crafted',
      'did': 'pioneered',
      'used': 'leveraged'
    }
  }
}

export default function WritingAssistantEnhanced({
  text,
  onChange,
  context = 'resume',
  targetTone = 'professional',
  realTime = true
}: WritingAssistantEnhancedProps) {
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([])
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis | null>(null)
  const [readabilityScore, setReadabilityScore] = useState<ReadabilityScore | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('grammar')
  const debounceRef = useRef<NodeJS.Timeout>()

  const analyzeText = useCallback(async (inputText: string) => {
    if (!inputText.trim()) {
      setGrammarIssues([])
      setToneAnalysis(null)
      setReadabilityScore(null)
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    // Grammar and style analysis
    const issues = analyzeGrammarAndStyle(inputText)
    setGrammarIssues(issues)

    // Tone analysis
    const tone = analyzeTone(inputText)
    setToneAnalysis(tone)

    // Readability analysis
    const readability = analyzeReadability(inputText)
    setReadabilityScore(readability)

    setIsAnalyzing(false)
  }, [])

  const analyzeGrammarAndStyle = (inputText: string): GrammarIssue[] => {
    const issues: GrammarIssue[] = []
    let issueId = 0

    for (const pattern of GRAMMAR_PATTERNS) {
      let match: RegExpExecArray | null
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags)

      match = regex.exec(inputText)
      while (match !== null) {
        const result = pattern.check(match[0], inputText)
        if (result) {
          issues.push({
            id: `issue_${issueId++}`,
            type: pattern.type,
            text: match[0],
            suggestion: result.suggestion,
            position: { start: match.index, end: match.index + match[0].length },
            severity: pattern.type === 'grammar' ? 'high' : 'medium',
            explanation: result.explanation
          })
        }
        match = regex.exec(inputText)
      }
    }

    // Check for passive voice
    const passivePattern = /\b(was|were|is|are|been|being)\s+\w+ed\b/gi
    let passiveMatch: RegExpExecArray | null = passivePattern.exec(inputText)
    while (passiveMatch !== null) {
      issues.push({
        id: `passive_${issueId++}`,
        type: 'style',
        text: passiveMatch[0],
        suggestion: 'Consider active voice',
        position: { start: passiveMatch.index, end: passiveMatch.index + passiveMatch[0].length },
        severity: 'low',
        explanation: 'Active voice is generally more engaging and direct than passive voice'
      })
      passiveMatch = passivePattern.exec(inputText)
    }

    // Check for weak words
    const weakWords = ['very', 'really', 'quite', 'rather', 'somewhat', 'fairly']
    for (const word of weakWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      let match: RegExpExecArray | null = regex.exec(inputText)
      while (match !== null) {
        issues.push({
          id: `weak_${issueId++}`,
          type: 'style',
          text: match[0],
          suggestion: 'Consider removing or replacing with stronger word',
          position: { start: match.index, end: match.index + match[0].length },
          severity: 'low',
          explanation: 'Weak qualifiers can diminish the impact of your statements'
        })
        match = regex.exec(inputText)
      }
    }

    return issues
  }

  const analyzeTone = (inputText: string): ToneAnalysis => {
    const words = inputText.toLowerCase().split(/\s+/)
    const toneData = TONE_INDICATORS[targetTone]

    const positiveCount = words.filter(word =>
      toneData.positive.some((indicator: string) => word.includes(indicator))
    ).length

    const negativeCount = words.filter(word =>
      toneData.negative.some((indicator: string) => word.includes(indicator))
    ).length

    // Calculate tone metrics
    const clarity = Math.max(0, Math.min(100, 80 + (positiveCount * 5) - (negativeCount * 10)))
    const conciseness = Math.max(0, Math.min(100, 90 - (words.length > 50 ? (words.length - 50) / 2 : 0)))
    const professionalism = Math.max(0, Math.min(100, 70 + (positiveCount * 8) - (negativeCount * 15)))
    const engagement = Math.max(0, Math.min(100, 75 + (positiveCount * 6) - (negativeCount * 8)))
    const authority = Math.max(0, Math.min(100, 80 + (positiveCount * 7) - (negativeCount * 12)))

    const overallScore = (clarity + conciseness + professionalism + engagement + authority) / 5

    // Determine overall tone
    let overall: ToneAnalysis['overall'] = 'professional'
    if (overallScore >= 85) overall = 'confident'
    else if (overallScore >= 75) overall = 'professional'
    else if (overallScore >= 65) overall = 'conversational'
    else if (overallScore >= 55) overall = 'casual'
    else overall = 'passive'

    // Generate suggestions
    const suggestions: string[] = []
    if (clarity < 70) suggestions.push('Use more specific and concrete language')
    if (conciseness < 70) suggestions.push('Consider shortening sentences for better readability')
    if (professionalism < 70) suggestions.push('Replace casual language with professional terminology')
    if (engagement < 70) suggestions.push('Add more action verbs and quantifiable achievements')
    if (authority < 70) suggestions.push('Use confident language and avoid tentative phrases')

    // Add replacement suggestions
    for (const [weak, strong] of Object.entries(toneData.replacements)) {
      if (inputText.toLowerCase().includes(weak)) {
        suggestions.push(`Consider replacing "${weak}" with "${strong}"`)
      }
    }

    return {
      overall,
      confidence: overallScore,
      metrics: {
        clarity: Math.round(clarity),
        conciseness: Math.round(conciseness),
        professionalism: Math.round(professionalism),
        engagement: Math.round(engagement),
        authority: Math.round(authority)
      },
      suggestions
    }
  }

  const analyzeReadability = (inputText: string): ReadabilityScore => {
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = inputText.split(/\s+/).filter(w => w.length > 0)
    const syllables = words.reduce((total, word) => total + countSyllables(word), 0)

    const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0
    const avgSyllablesPerWord = words.length > 0 ? syllables / words.length : 0

    // Simplified Flesch-Kincaid grade level
    const gradeLevel = (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59
    const adjustedGrade = Math.max(1, Math.min(16, gradeLevel))

    let level = 'College'
    if (adjustedGrade <= 6) level = 'Elementary'
    else if (adjustedGrade <= 9) level = 'Middle School'
    else if (adjustedGrade <= 12) level = 'High School'

    const complexWords = words.filter(word => countSyllables(word) >= 3).length
    const readingTime = Math.ceil(words.length / 200) // Average reading speed

    const recommendations: string[] = []
    if (adjustedGrade > 12) recommendations.push('Consider simplifying complex sentences')
    if (avgSentenceLength > 20) recommendations.push('Break down long sentences')
    if (complexWords / words.length > 0.3) recommendations.push('Replace complex words with simpler alternatives')

    return {
      grade: Math.round(adjustedGrade * 10) / 10,
      level,
      metrics: {
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        avgWordsPerSentence: Math.round(avgSentenceLength * 10) / 10,
        complexWords,
        readingTime
      },
      recommendations
    }
  }

  const countSyllables = (word: string): number => {
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i].toLowerCase())
      if (isVowel && !previousWasVowel) count++
      previousWasVowel = isVowel
    }

    // Adjust for silent e
    if (word.endsWith('e') && count > 1) count--

    return Math.max(1, count)
  }

  const applySuggestion = (issue: GrammarIssue) => {
    if (!onChange) return

    const newText = text.substring(0, issue.position.start) +
                   issue.suggestion +
                   text.substring(issue.position.end)
    onChange(newText)
  }

  const applyToneSuggestion = (original: string, replacement: string) => {
    if (!onChange) return

    const newText = text.replace(new RegExp(original, 'gi'), replacement)
    onChange(newText)
  }

  // Real-time analysis with debouncing
  useEffect(() => {
    if (!realTime) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      analyzeText(text)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [text, realTime, analyzeText])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  const getSeverityBadge = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Real-time Writing Assistant
          {isAnalyzing && <Sparkles className="h-4 w-4 animate-spin text-blue-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="tone">Tone</TabsTrigger>
            <TabsTrigger value="readability">Readability</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="grammar" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Grammar & Style Issues</h3>
              <Badge variant={grammarIssues.length === 0 ? 'default' : 'secondary'}>
                {grammarIssues.length} issues
              </Badge>
            </div>

            {grammarIssues.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p>No grammar or style issues detected!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {grammarIssues.map((issue) => (
                  <div key={issue.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className={`h-4 w-4 ${getSeverityColor(issue.severity)}`} />
                          <span className="font-medium capitalize">{issue.type}</span>
                          <Badge variant={getSeverityBadge(issue.severity)} className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Found: "<span className="font-medium">{issue.text}</span>"
                        </p>
                        <p className="text-sm text-blue-600 mb-2">
                          Suggestion: {issue.suggestion}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {issue.explanation}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(issue)}
                        disabled={!onChange}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tone" className="space-y-4">
            {toneAnalysis ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">Current Tone</span>
                    </div>
                    <p className="text-lg font-semibold capitalize">{toneAnalysis.overall}</p>
                    <p className={`text-sm ${getScoreColor(toneAnalysis.confidence)}`}>
                      {Math.round(toneAnalysis.confidence)}% confidence
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Target Tone</span>
                    </div>
                    <p className="text-lg font-semibold capitalize">{targetTone}</p>
                    <p className="text-sm text-muted-foreground">Optimizing for this tone</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Tone Metrics</h4>
                  {Object.entries(toneAnalysis.metrics).map(([metric, score]) => (
                    <div key={metric} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm capitalize">{metric}</span>
                        <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Tone Suggestions
                  </h4>
                  {toneAnalysis.suggestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Your tone looks great!</p>
                  ) : (
                    <div className="space-y-2">
                      {toneAnalysis.suggestions.map((suggestion, index) => (
                        <div key={`tone-suggestion-${index}-${suggestion.slice(0, 20)}`} className="p-2 bg-blue-50 rounded text-sm">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Volume2 className="h-12 w-12 mx-auto mb-2" />
                <p>Start typing to analyze tone...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="readability" className="space-y-4">
            {readabilityScore ? (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Reading Level</p>
                    <p className="text-lg font-bold">{readabilityScore.level}</p>
                    <p className="text-xs text-muted-foreground">Grade {readabilityScore.grade}</p>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Reading Time</p>
                    <p className="text-lg font-bold">{readabilityScore.metrics.readingTime} min</p>
                    <p className="text-xs text-muted-foreground">Average pace</p>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">Avg Sentence</p>
                    <p className="text-lg font-bold">{readabilityScore.metrics.avgSentenceLength} words</p>
                    <p className="text-xs text-muted-foreground">Per sentence</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Readability Metrics</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Complex words:</span>
                      <span>{readabilityScore.metrics.complexWords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average words per sentence:</span>
                      <span>{readabilityScore.metrics.avgWordsPerSentence}</span>
                    </div>
                  </div>
                </div>

                {readabilityScore.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <div className="space-y-1">
                      {readabilityScore.recommendations.map((rec, index) => (
                        <p key={`readability-rec-${index}-${rec.slice(0, 15)}`} className="text-sm text-muted-foreground">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2" />
                <p>Start typing to analyze readability...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-800">Issues Found</p>
                <p className="text-xl font-bold text-red-600">{grammarIssues.length}</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-800">Tone Score</p>
                <p className={`text-xl font-bold ${toneAnalysis ? getScoreColor(toneAnalysis.confidence) : 'text-gray-400'}`}>
                  {toneAnalysis ? `${Math.round(toneAnalysis.confidence)}%` : '--'}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">Reading Level</p>
                <p className="text-xl font-bold text-green-600">
                  {readabilityScore ? readabilityScore.level : '--'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => analyzeText(text)}
                  disabled={isAnalyzing}
                  className="w-full justify-start"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Re-analyze Text
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
