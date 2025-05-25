'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wand2, Check, X, Lightbulb, Sparkles } from 'lucide-react'
import { aiService } from '@/services/aiService'

interface ContentSuggestion {
  id: string
  type: 'description' | 'summary' | 'achievement' | 'skill' | 'bullet_point'
  content: string
  confidence: number
  reasoning: string
}

interface SuggestionContext {
  position?: string
  company?: string
  industry?: string
  targetRole?: string
  experienceLevel?: string
}

interface ProjectSuggestionsContext {
  industry?: string
  experienceLevel?: string
}

interface AISuggestionsProps {
  sectionType: 'summary' | 'experience' | 'projects' | 'skills' | 'education'
  currentContent?: string
  context?: SuggestionContext
  onApplySuggestion: (content: string) => void
  onEnhanceContent?: (enhanced: string) => void
}

export function AISuggestions({
  sectionType,
  currentContent,
  context,
  onApplySuggestion,
  onEnhanceContent
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const generateSuggestions = async () => {
    setIsLoading(true)
    setIsVisible(true)

    try {
      let newSuggestions: ContentSuggestion[] = []

      switch (sectionType) {
        case 'summary':
          if (context?.targetRole && currentContent) {
            newSuggestions = await aiService.enhanceProfessionalSummary(
              currentContent,
              context.targetRole,
              [], // experience array would be passed from parent
              [] // skills array would be passed from parent
            )
          }
          break

        case 'experience':
          if (context?.position && context?.company && context?.industry && context?.experienceLevel) {
            newSuggestions = await aiService.generateJobDescription(
              context.position,
              context.company,
              context.industry,
              context.experienceLevel
            )
          }
          break

        case 'projects':
          // Generate project description suggestions
          newSuggestions = await generateProjectSuggestions(context as ProjectSuggestionsContext)
          break

        default:
          newSuggestions = await generateGenericSuggestions(sectionType, context as SuggestionContext)
      }

      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
      // Show fallback suggestions
      setSuggestions(getFallbackSuggestions(sectionType))
    } finally {
      setIsLoading(false)
    }
  }

  const generateProjectSuggestions = async (context: ProjectSuggestionsContext): Promise<ContentSuggestion[]> => {
    // Mock AI project suggestions - in real implementation, would call AI service
    return [
      {
        id: 'proj_1',
        type: 'description',
        content: 'Architected and developed a full-stack web application using React, Node.js, and PostgreSQL, serving 10,000+ daily active users',
        confidence: 0.9,
        reasoning: 'Includes specific technologies and quantified user metrics'
      },
      {
        id: 'proj_2',
        type: 'description',
        content: 'Implemented responsive design principles and optimized performance, resulting in 40% faster load times and improved user engagement',
        confidence: 0.85,
        reasoning: 'Highlights technical improvements with measurable impact'
      },
      {
        id: 'proj_3',
        type: 'description',
        content: 'Integrated third-party APIs and payment processing systems, enabling seamless user transactions and reducing checkout abandonment by 25%',
        confidence: 0.8,
        reasoning: 'Shows integration skills and business impact'
      }
    ]
  }

  const generateGenericSuggestions = async (type: string, context: SuggestionContext): Promise<ContentSuggestion[]> => {
    // Fallback suggestions for other section types
    const templates: Record<string, string[]> = {
      skills: [
        'JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Docker, Git',
        'Frontend: React, Vue.js, Angular, HTML5, CSS3, Sass, Tailwind CSS',
        'Backend: Node.js, Express, Django, FastAPI, PostgreSQL, MongoDB, Redis'
      ],
      education: [
        'Completed relevant coursework in Data Structures, Algorithms, and Software Engineering',
        'Maintained Dean\'s List status with GPA above 3.5 for academic excellence',
        'Led student organizations and participated in hackathons to develop leadership skills'
      ]
    }

    const suggestions = templates[type] || []
    return suggestions.map((content, index) => ({
      id: `${type}_${index}`,
      type: 'description' as const,
      content,
      confidence: 0.7,
      reasoning: 'Template-based suggestion'
    }))
  }

  const getFallbackSuggestions = (type: string): ContentSuggestion[] => {
    return [
      {
        id: 'fallback_1',
        type: 'description' as const,
        content: 'AI suggestions temporarily unavailable. Please try again later.',
        confidence: 0.1,
        reasoning: 'Service unavailable'
      }
    ]
  }

  const handleApplySuggestion = (suggestion: ContentSuggestion) => {
    onApplySuggestion(suggestion.content)
  }

  const handleEnhanceExisting = async () => {
    if (!currentContent) return

    setIsLoading(true)
    try {
      // For bullet points enhancement
      if (currentContent.includes('<li>') || currentContent.includes('•')) {
        const bulletPoints = extractBulletPoints(currentContent)
        const enhanced = await aiService.enhanceBulletPoints(bulletPoints, context || {})
        if (enhanced.length > 0 && onEnhanceContent) {
          const enhancedContent = formatAsBulletPoints(enhanced.map(e => e.content))
          onEnhanceContent(enhancedContent)
        }
      } else {
        // For other content types, just add to suggestions
        setSuggestions(prev => [
          ...prev,
          {
            id: 'enhanced',
            type: 'description',
            content: `Enhanced: ${currentContent}`,
            confidence: 0.8,
            reasoning: 'AI-enhanced version of existing content'
          }
        ])
      }
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const extractBulletPoints = (content: string): string[] => {
    // Extract bullet points from HTML or plain text
    if (content.includes('<li>')) {
      return content.match(/<li>(.*?)<\/li>/g)?.map(li => li.replace(/<\/?li>/g, '')) || []
    }
    return content
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.replace('•', '').trim())
  }

  const formatAsBulletPoints = (points: string[]): string => {
    return `<ul>${points.map(point => `<li>${point}</li>`).join('')}</ul>`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!isVisible) {
    return (
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={isLoading}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          AI Suggestions
        </Button>

        {currentContent && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnhanceExisting}
            disabled={isLoading}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Enhance Content
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Suggestions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
              <span className="text-gray-600">Generating AI suggestions...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-2">{suggestion.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="outline" className={getConfidenceColor(suggestion.confidence)}>
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </Badge>
                      <span>• {suggestion.reasoning}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {suggestions.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">No suggestions available for this content.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={isLoading}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate More
        </Button>
      </div>
    </div>
  )
}
