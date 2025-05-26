'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, Bot, User, Lightbulb, FileText, Target, Zap } from 'lucide-react'
import { aiService } from '@/services/aiService'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIChatAssistantProps {
  resumeData?: {
    summary?: string
    experience?: Array<{
      position?: string
      company?: string
      description?: string
    }>
    skills?: Array<{ skills: string }>
    education?: Array<{
      degree?: string
      school?: string
    }>
  }
  onApplySuggestion?: (suggestion: string, section: string) => void
}

const QUICK_PROMPTS = [
  {
    icon: FileText,
    text: "How can I improve my professional summary?",
    category: "summary"
  },
  {
    icon: Target,
    text: "What skills should I add for my target role?",
    category: "skills"
  },
  {
    icon: Zap,
    text: "Help me quantify my achievements",
    category: "experience"
  },
  {
    icon: Lightbulb,
    text: "Give me interview preparation tips",
    category: "interview"
  }
]

export function AIChatAssistant({ resumeData, onApplySuggestion }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI resume assistant. I can help you improve your resume, suggest better content, analyze your skills, and provide career advice. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Improve my professional summary",
        "Analyze my skills gap",
        "Enhance my work experience",
        "Get interview preparation tips"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const generateChatResponse = async (userMessage: string): Promise<string> => {
    const context = {
      summary: resumeData?.summary || 'No summary provided',
      experience: resumeData?.experience?.map(exp =>
        `${exp.position} at ${exp.company}: ${exp.description}`
      ).join('; ') || 'No experience provided',
      skills: resumeData?.skills?.map(skill => skill.skills).join(', ') || 'No skills provided',
      education: resumeData?.education?.map(edu =>
        `${edu.degree} from ${edu.school}`
      ).join('; ') || 'No education provided'
    }

    const prompt = `You are a professional career coach and resume expert. A user is asking for help with their resume.

User's Current Resume Context:
- Summary: ${context.summary}
- Experience: ${context.experience}
- Skills: ${context.skills}
- Education: ${context.education}

User's Question: "${userMessage}"

Provide helpful, actionable advice. If the user is asking about:
- Professional summary: Suggest specific improvements with examples
- Skills: Recommend missing skills for their role and how to present them
- Experience: Help quantify achievements and improve descriptions
- Interview prep: Provide relevant questions and answers based on their background
- General advice: Give career guidance based on their profile

Keep your response conversational, helpful, and under 200 words. If relevant, suggest specific text they could use.

Respond in plain text format (no markdown).`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional career coach and resume expert. Provide helpful, actionable advice in a conversational tone.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.'
    } catch (error) {
      console.error('AI Chat error:', error)
      return getFallbackResponse(userMessage, context)
    }
  }

  const getFallbackResponse = (userMessage: string, context: unknown): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('summary') || lowerMessage.includes('professional')) {
      return `Based on your current summary, I'd suggest making it more specific and quantified. Try starting with "Results-driven [your role] with X years of experience..." and include 1-2 specific achievements. For example, mention technologies you've used or impact you've made at previous companies.`
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('technical')) {
      return "Looking at your current skills, consider adding trending technologies in your field. For tech roles, skills like cloud platforms (AWS, Azure), containers (Docker, Kubernetes), and relevant programming frameworks are valuable. Make sure to organize them by category (Programming Languages, Frameworks, Tools, etc.)."
    }

    if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job')) {
      return `To improve your experience section, focus on quantifying your achievements. Instead of "Worked on projects," try "Led development of 3 web applications that improved user engagement by 25%." Use action verbs like "developed," "implemented," "optimized," and "collaborated."`
    }

    if (lowerMessage.includes('interview') || lowerMessage.includes('preparation')) {
      return `For interview prep, focus on the STAR method (Situation, Task, Action, Result) for behavioral questions. Based on your experience, prepare examples that show leadership, problem-solving, and technical skills. Practice explaining your projects clearly and be ready to discuss specific technologies you've used.`
    }

    return `I'm here to help with your resume! I can assist with improving your professional summary, suggesting relevant skills, enhancing work experience descriptions, or providing interview preparation tips. What specific area would you like to focus on?`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateChatResponse(input.trim())

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="w-6 h-6 mr-2" />
          AI Assistant
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-xl border-2 border-blue-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              <CardTitle className="text-sm">AI Resume Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          {/* Quick Prompts */}
          <div className="p-3 border-b bg-gray-50">
            <div className="text-xs text-gray-600 mb-2">Quick questions:</div>
            <div className="flex flex-wrap gap-1">
              {QUICK_PROMPTS.map((prompt) => (
                <Button
                  key={prompt.text}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="text-xs h-7 px-2 hover:bg-blue-50"
                >
                  <prompt.icon className="w-3 h-3 mr-1" />
                  {prompt.text.split(' ').slice(0, 3).join(' ')}...
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                  <div className="flex items-start">
                    {message.type === 'assistant' && <Bot className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />}
                    {message.type === 'user' && <User className="w-4 h-4 mr-2 mt-0.5" />}
                    <div className="text-sm">{message.content}</div>
                  </div>

                  {message.suggestions && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion) => (
                        <Badge
                          key={suggestion}
                          variant="secondary"
                          className="mr-1 mb-1 cursor-pointer hover:bg-blue-100 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 mr-2 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your resume..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
