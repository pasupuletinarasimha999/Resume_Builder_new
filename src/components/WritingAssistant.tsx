'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Lightbulb, Zap, Target, TrendingUp } from 'lucide-react'

interface WritingSuggestion {
  id: string
  type: 'grammar' | 'tone' | 'ats' | 'action-verb' | 'quantification' | 'clarity'
  severity: 'low' | 'medium' | 'high'
  message: string
  suggestion: string
  startIndex: number
  endIndex: number
  replacement?: string
}

interface WritingAssistantProps {
  text: string
  context?: {
    section?: 'summary' | 'experience' | 'skills' | 'education'
    role?: string
    industry?: string
  }
  onSuggestionApply?: (originalText: string, newText: string) => void
  className?: string
}

const ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'analyzed', 'authored', 'automated',
  'built', 'collaborated', 'created', 'designed', 'developed', 'directed',
  'enhanced', 'established', 'executed', 'expanded', 'generated', 'implemented',
  'improved', 'increased', 'initiated', 'launched', 'led', 'managed',
  'optimized', 'organized', 'pioneered', 'planned', 'produced', 'reduced',
  'resolved', 'spearheaded', 'streamlined', 'supervised', 'transformed'
]

const WEAK_WORDS = ['very', 'really', 'quite', 'somewhat', 'rather', 'pretty', 'just', 'only']

const ATS_KEYWORDS = {
  software: ['agile', 'scrum', 'ci/cd', 'api', 'database', 'cloud', 'microservices', 'devops'],
  management: ['leadership', 'strategy', 'stakeholder', 'budget', 'team', 'project', 'coordination'],
  marketing: ['campaign', 'analytics', 'roi', 'conversion', 'segmentation', 'branding', 'digital'],
  sales: ['revenue', 'quota', 'pipeline', 'crm', 'relationship', 'negotiation', 'target']
}

export function WritingAssistant({ text, context, onSuggestionApply, className }: WritingAssistantProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const analyzeText = useCallback(async (inputText: string) => {
    if (!inputText.trim() || inputText.length < 10) {
      setSuggestions([])
      return
    }

    setIsAnalyzing(true)
    const foundSuggestions: WritingSuggestion[] = []

    // Grammar and clarity checks
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0)

    sentences.forEach((sentence, sentenceIndex) => {
      const trimmedSentence = sentence.trim()
      if (trimmedSentence.length === 0) return

      const sentenceStart = inputText.indexOf(trimmedSentence)

      // Check for passive voice
      const passivePatterns = /\b(was|were|been|being)\s+\w+ed\b/gi
      let match: RegExpExecArray | null = passivePatterns.exec(trimmedSentence)
      while (match !== null) {
        foundSuggestions.push({
          id: `passive_${sentenceIndex}_${match.index}`,
          type: 'tone',
          severity: 'medium',
          message: 'Consider using active voice for more impact',
          suggestion: 'Active voice makes your achievements more direct and powerful',
          startIndex: sentenceStart + match.index,
          endIndex: sentenceStart + match.index + match[0].length
        })
        match = passivePatterns.exec(trimmedSentence)
      }

      // Check for weak words
      for (const word of WEAK_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        let weakMatch: RegExpExecArray | null = regex.exec(trimmedSentence)
        while (weakMatch !== null) {
          foundSuggestions.push({
            id: `weak_${sentenceIndex}_${weakMatch.index}`,
            type: 'clarity',
            severity: 'low',
            message: `Remove weak qualifier "${word}"`,
            suggestion: 'Strong statements have more impact without qualifiers',
            startIndex: sentenceStart + weakMatch.index,
            endIndex: sentenceStart + weakMatch.index + weakMatch[0].length,
            replacement: ''
          })
          weakMatch = regex.exec(trimmedSentence)
        }
      }

      // Check for missing quantification
      if (context?.section === 'experience' && !/\d+/.test(trimmedSentence)) {
        if (trimmedSentence.length > 20 && !trimmedSentence.toLowerCase().includes('responsible')) {
          foundSuggestions.push({
            id: `quantify_${sentenceIndex}`,
            type: 'quantification',
            severity: 'high',
            message: 'Consider adding specific metrics or numbers',
            suggestion: 'Quantified achievements are more compelling (e.g., "increased by 25%", "managed team of 8")',
            startIndex: sentenceStart,
            endIndex: sentenceStart + trimmedSentence.length
          })
        }
      }

      // Check for action verbs at sentence start
      if (context?.section === 'experience') {
        const firstWord = trimmedSentence.split(' ')[0]?.toLowerCase()
        const isActionVerb = ACTION_VERBS.some(verb => verb.startsWith(firstWord) || firstWord.startsWith(verb))

        if (!isActionVerb && firstWord && firstWord.length > 2) {
          foundSuggestions.push({
            id: `action_${sentenceIndex}`,
            type: 'action-verb',
            severity: 'medium',
            message: 'Start with a strong action verb',
            suggestion: `Consider starting with: ${ACTION_VERBS.slice(0, 5).join(', ')}`,
            startIndex: sentenceStart,
            endIndex: sentenceStart + firstWord.length
          })
        }
      }
    })

    // ATS keyword suggestions
    if (context?.role && context.section !== 'skills') {
      const roleKeywords = ATS_KEYWORDS.software // Default to software keywords
      const missingKeywords = roleKeywords.filter(keyword =>
        !inputText.toLowerCase().includes(keyword.toLowerCase())
      )

      if (missingKeywords.length > 0 && inputText.length > 50) {
        foundSuggestions.push({
          id: 'ats_keywords',
          type: 'ats',
          severity: 'medium',
          message: 'Consider adding ATS-friendly keywords',
          suggestion: `Relevant keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
          startIndex: 0,
          endIndex: 0
        })
      }
    }

    // Sentence length check
    sentences.forEach((sentence, index) => {
      const words = sentence.trim().split(/\s+/)
      if (words.length > 30) {
        const sentenceStart = inputText.indexOf(sentence.trim())
        foundSuggestions.push({
          id: `length_${index}`,
          type: 'clarity',
          severity: 'medium',
          message: 'Consider breaking this long sentence',
          suggestion: 'Shorter sentences are easier to read and more impactful',
          startIndex: sentenceStart,
          endIndex: sentenceStart + sentence.trim().length
        })
      }
    })

    setSuggestions(foundSuggestions)
    setIsAnalyzing(false)
    setShowSuggestions(foundSuggestions.length > 0)
  }, [context])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeText(text)
    }, 1000) // Debounce analysis

    return () => clearTimeout(timeoutId)
  }, [text, analyzeText])

  const applySuggestion = (suggestion: WritingSuggestion) => {
    if (!suggestion.replacement && !onSuggestionApply) return

    if (suggestion.replacement !== undefined) {
      const newText = text.substring(0, suggestion.startIndex) +
                    suggestion.replacement +
                    text.substring(suggestion.endIndex)
      onSuggestionApply?.(text, newText)
    }

    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const getSeverityIcon = (severity: WritingSuggestion['severity']) => {
    switch (severity) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium': return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getTypeIcon = (type: WritingSuggestion['type']) => {
    switch (type) {
      case 'grammar': return <AlertCircle className="w-4 h-4" />
      case 'tone': return <Zap className="w-4 h-4" />
      case 'ats': return <Target className="w-4 h-4" />
      case 'action-verb': return <TrendingUp className="w-4 h-4" />
      case 'quantification': return <TrendingUp className="w-4 h-4" />
      case 'clarity': return <Lightbulb className="w-4 h-4" />
    }
  }

  const getTypeBadgeColor = (type: WritingSuggestion['type']) => {
    switch (type) {
      case 'grammar': return 'bg-red-100 text-red-800'
      case 'tone': return 'bg-purple-100 text-purple-800'
      case 'ats': return 'bg-blue-100 text-blue-800'
      case 'action-verb': return 'bg-green-100 text-green-800'
      case 'quantification': return 'bg-orange-100 text-orange-800'
      case 'clarity': return 'bg-gray-100 text-gray-800'
    }
  }

  if (!showSuggestions && !isAnalyzing) return null

  return (
    <div className={`mt-2 ${className}`}>
      {isAnalyzing && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing text...</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Writing Assistant</span>
                <Badge variant="secondary" className="text-xs">
                  {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-1">
                    {getSeverityIcon(suggestion.severity)}
                    {getTypeIcon(suggestion.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{suggestion.message}</span>
                      <Badge className={`text-xs ${getTypeBadgeColor(suggestion.type)}`}>
                        {suggestion.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{suggestion.suggestion}</p>
                  </div>

                  {suggestion.replacement !== undefined && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applySuggestion(suggestion)}
                      className="text-xs h-6 px-2"
                    >
                      Apply
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tips: Use action verbs, quantify achievements, avoid passive voice</span>
                <div className="flex space-x-1">
                  {['high', 'medium', 'low'].map(severity => {
                    const count = suggestions.filter(s => s.severity === severity).length
                    return count > 0 ? (
                      <Badge key={severity} variant="outline" className="text-xs h-5">
                        {getSeverityIcon(severity as WritingSuggestion['severity'])}
                        {count}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
