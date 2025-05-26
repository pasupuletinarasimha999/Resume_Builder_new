'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Code,
  Users,
  Zap,
  Building,
  Download,
  Copy,
  Check,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react'

interface ResumeVariant {
  id: string
  title: string
  description: string
  targetRole: string
  industry: string
  summary: string
  skillsEmphasis: string[]
  experienceAdjustments: Record<string, string>
  keywordOptimizations: string[]
}

interface ResumeVariantsGeneratorProps {
  currentResume: {
    summary: string
    experience: Array<{
      id: string
      position?: string
      company?: string
      description?: string
    }>
    skills: Array<{ skills: string }>
  }
  onApplyVariant?: (variant: ResumeVariant) => void
  className?: string
}

const ROLE_TEMPLATES = {
  'frontend-developer': {
    title: 'Frontend Developer',
    description: 'Emphasis on UI/UX, React, TypeScript, and user experience',
    keywords: ['React', 'TypeScript', 'CSS', 'JavaScript', 'UI/UX', 'responsive design', 'accessibility'],
    skillsToEmphasize: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript', 'Next.js', 'Tailwind'],
    summaryAdjustments: 'frontend development, user experience, and responsive web applications'
  },
  'fullstack-developer': {
    title: 'Full-Stack Developer',
    description: 'Balanced frontend and backend skills with system architecture',
    keywords: ['Full-stack', 'API', 'database', 'microservices', 'cloud', 'DevOps'],
    skillsToEmphasize: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
    summaryAdjustments: 'full-stack development, API design, and scalable system architecture'
  },
  'backend-developer': {
    title: 'Backend Developer',
    description: 'Focus on server-side development, databases, and system architecture',
    keywords: ['API', 'microservices', 'database', 'scalability', 'cloud architecture', 'DevOps'],
    skillsToEmphasize: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes'],
    summaryAdjustments: 'backend systems, API development, and scalable cloud architecture'
  },
  'team-lead': {
    title: 'Technical Team Lead',
    description: 'Leadership, mentoring, and technical decision-making emphasis',
    keywords: ['leadership', 'mentoring', 'architecture', 'technical strategy', 'cross-functional'],
    skillsToEmphasize: ['Leadership', 'Architecture', 'Mentoring', 'Agile', 'Strategic Planning'],
    summaryAdjustments: 'technical leadership, team mentoring, and strategic architecture decisions'
  },
  'devops-engineer': {
    title: 'DevOps Engineer',
    description: 'Infrastructure, automation, and deployment pipeline focus',
    keywords: ['CI/CD', 'automation', 'infrastructure', 'monitoring', 'cloud platforms'],
    skillsToEmphasize: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Monitoring'],
    summaryAdjustments: 'DevOps practices, infrastructure automation, and deployment optimization'
  },
  'startup-role': {
    title: 'Startup All-Rounder',
    description: 'Versatility, adaptability, and multi-functional skills',
    keywords: ['versatile', 'adaptable', 'startup experience', 'rapid development', 'MVP'],
    skillsToEmphasize: ['Full-stack', 'Rapid prototyping', 'MVP development', 'Agile', 'Adaptability'],
    summaryAdjustments: 'versatile development skills, rapid prototyping, and startup environment experience'
  }
}

const COMPANY_SIZES = {
  startup: {
    title: 'Startup (1-50 employees)',
    adjustments: {
      tone: 'agile, adaptable, wearing multiple hats',
      keywords: ['startup', 'agile', 'rapid development', 'MVP', 'adaptable', 'versatile'],
      emphasis: 'flexibility and rapid development'
    }
  },
  midsize: {
    title: 'Mid-size Company (50-1000 employees)',
    adjustments: {
      tone: 'collaborative, process-oriented, growth-minded',
      keywords: ['collaboration', 'scalable', 'process improvement', 'growth'],
      emphasis: 'collaboration and scalable solutions'
    }
  },
  enterprise: {
    title: 'Enterprise (1000+ employees)',
    adjustments: {
      tone: 'enterprise-scale, compliance-aware, structured',
      keywords: ['enterprise', 'compliance', 'security', 'governance', 'large-scale'],
      emphasis: 'enterprise architecture and compliance'
    }
  }
}

export function ResumeVariantsGenerator({
  currentResume,
  onApplyVariant,
  className
}: ResumeVariantsGeneratorProps) {
  const [selectedRole, setSelectedRole] = useState<string>('frontend-developer')
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('midsize')
  const [variants, setVariants] = useState<ResumeVariant[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const generateVariants = async () => {
    setIsGenerating(true)

    const selectedTemplate = ROLE_TEMPLATES[selectedRole as keyof typeof ROLE_TEMPLATES]
    const companyData = COMPANY_SIZES[selectedCompanySize as keyof typeof COMPANY_SIZES]

    // Generate 3 different variants
    const generatedVariants: ResumeVariant[] = [
      {
        id: 'variant-1',
        title: `${selectedTemplate.title} - ${companyData.title}`,
        description: `${selectedTemplate.description} optimized for ${companyData.title.toLowerCase()}`,
        targetRole: selectedTemplate.title,
        industry: 'technology',
        summary: generateOptimizedSummary(currentResume.summary, selectedTemplate, companyData, 'professional'),
        skillsEmphasis: selectedTemplate.skillsToEmphasize,
        experienceAdjustments: generateExperienceAdjustments(currentResume.experience, selectedTemplate, 'technical'),
        keywordOptimizations: [...selectedTemplate.keywords, ...companyData.adjustments.keywords]
      },
      {
        id: 'variant-2',
        title: `${selectedTemplate.title} - Impact Focused`,
        description: `${selectedTemplate.description} with emphasis on quantified achievements`,
        targetRole: selectedTemplate.title,
        industry: 'technology',
        summary: generateOptimizedSummary(currentResume.summary, selectedTemplate, companyData, 'results-driven'),
        skillsEmphasis: selectedTemplate.skillsToEmphasize,
        experienceAdjustments: generateExperienceAdjustments(currentResume.experience, selectedTemplate, 'achievement'),
        keywordOptimizations: [...selectedTemplate.keywords, 'ROI', 'performance', 'optimization', 'efficiency']
      },
      {
        id: 'variant-3',
        title: `${selectedTemplate.title} - Leadership`,
        description: `${selectedTemplate.description} highlighting leadership and collaboration`,
        targetRole: selectedTemplate.title,
        industry: 'technology',
        summary: generateOptimizedSummary(currentResume.summary, selectedTemplate, companyData, 'leadership'),
        skillsEmphasis: [...selectedTemplate.skillsToEmphasize, 'Leadership', 'Mentoring', 'Cross-functional collaboration'],
        experienceAdjustments: generateExperienceAdjustments(currentResume.experience, selectedTemplate, 'leadership'),
        keywordOptimizations: [...selectedTemplate.keywords, 'leadership', 'mentoring', 'team', 'collaboration']
      }
    ]

    setVariants(generatedVariants)
    setIsGenerating(false)
  }

  const generateOptimizedSummary = (
    originalSummary: string,
    template: typeof ROLE_TEMPLATES[keyof typeof ROLE_TEMPLATES],
    companyData: typeof COMPANY_SIZES[keyof typeof COMPANY_SIZES],
    style: 'professional' | 'results-driven' | 'leadership'
  ): string => {
    const baseText = originalSummary || 'Experienced software developer'

    switch (style) {
      case 'professional':
        return `${baseText.split('.')[0]} specializing in ${template.summaryAdjustments}. Proven experience in ${companyData.adjustments.emphasis} with expertise in modern development practices and emerging technologies.`

      case 'results-driven':
        return `Results-driven ${template.title.toLowerCase()} with expertise in ${template.summaryAdjustments}. Track record of delivering high-impact solutions that drive business growth and improve operational efficiency by leveraging cutting-edge technologies.`

      case 'leadership':
        return `Technical leader and ${template.title.toLowerCase()} specializing in ${template.summaryAdjustments}. Experienced in leading cross-functional teams, mentoring developers, and driving architectural decisions that scale with business needs.`

      default:
        return baseText
    }
  }

  const generateExperienceAdjustments = (
    experience: Array<{ id: string; position?: string; company?: string; description?: string }>,
    template: typeof ROLE_TEMPLATES[keyof typeof ROLE_TEMPLATES],
    focus: 'technical' | 'achievement' | 'leadership'
  ): Record<string, string> => {
    const adjustments: Record<string, string> = {}

    for (const exp of experience) {
      if (!exp.description) continue

      const originalDesc = exp.description
      let enhancedDesc = originalDesc

      switch (focus) {
        case 'technical':
          enhancedDesc = enhanceTechnicalAspects(originalDesc, template.keywords)
          break
        case 'achievement':
          enhancedDesc = enhanceAchievements(originalDesc)
          break
        case 'leadership':
          enhancedDesc = enhanceLeadership(originalDesc)
          break
      }

      if (enhancedDesc !== originalDesc) {
        adjustments[exp.id] = enhancedDesc
      }
    }

    return adjustments
  }

  const enhanceTechnicalAspects = (description: string, keywords: string[]): string => {
    let enhanced = description

    // Add technical context if missing
    if (!enhanced.toLowerCase().includes('technolog')) {
      enhanced += ' Utilized modern technologies and best practices to ensure scalability and maintainability.'
    }

    // Add relevant keywords naturally
    const missingKeywords = keywords.filter(keyword =>
      !enhanced.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 2)

    if (missingKeywords.length > 0) {
      enhanced += ` Key technologies: ${missingKeywords.join(', ')}.`
    }

    return enhanced
  }

  const enhanceAchievements = (description: string): string => {
    let enhanced = description

    // Add quantification if missing
    if (!/\d+/.test(enhanced)) {
      enhanced = enhanced.replace(/improved/gi, 'improved by 30%')
      enhanced = enhanced.replace(/increased/gi, 'increased by 40%')
      enhanced = enhanced.replace(/reduced/gi, 'reduced by 25%')
      enhanced = enhanced.replace(/developed/gi, 'successfully developed and deployed')
    }

    // Add business impact
    if (!enhanced.toLowerCase().includes('business') && !enhanced.toLowerCase().includes('revenue')) {
      enhanced += ' Contributed to improved business outcomes and operational efficiency.'
    }

    return enhanced
  }

  const enhanceLeadership = (description: string): string => {
    let enhanced = description

    // Add collaboration elements
    if (!enhanced.toLowerCase().includes('team') && !enhanced.toLowerCase().includes('collaborat')) {
      enhanced += ' Collaborated with cross-functional teams to ensure successful project delivery.'
    }

    // Add mentoring aspect
    if (!enhanced.toLowerCase().includes('mentor') && !enhanced.toLowerCase().includes('lead')) {
      enhanced += ' Provided technical guidance and mentorship to team members.'
    }

    return enhanced
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

  const applyVariant = (variant: ResumeVariant) => {
    onApplyVariant?.(variant)
  }

  return (
    <div className={className}>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-sm">Resume Variants Generator</CardTitle>
          </div>
          <p className="text-xs text-gray-600">
            Generate optimized resume versions for different roles and company types
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Target Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_TEMPLATES).map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Company Size</label>
                <Select value={selectedCompanySize} onValueChange={setSelectedCompanySize}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPANY_SIZES).map(([key, size]) => (
                      <SelectItem key={key} value={key}>
                        {size.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateVariants}
              disabled={isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating Variants...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Resume Variants
                </>
              )}
            </Button>

            {/* Generated Variants */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Generated Variants ({variants.length})
                </h4>

                <Tabs defaultValue="variant-1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="variant-1" className="text-xs">Professional</TabsTrigger>
                    <TabsTrigger value="variant-2" className="text-xs">Impact</TabsTrigger>
                    <TabsTrigger value="variant-3" className="text-xs">Leadership</TabsTrigger>
                  </TabsList>

                  {variants.map((variant) => (
                    <TabsContent key={variant.id} value={variant.id} className="mt-3">
                      <div className="border rounded-lg p-3 space-y-3 bg-purple-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-sm text-purple-900">{variant.title}</h5>
                            <p className="text-xs text-purple-700">{variant.description}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(variant.summary, variant.id)}
                              className="h-7 px-2"
                            >
                              {copiedId === variant.id ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => applyVariant(variant)}
                              className="h-7 px-3 bg-purple-600 hover:bg-purple-700"
                            >
                              Apply
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-purple-800 mb-1 block">
                            Optimized Summary:
                          </label>
                          <div className="text-xs text-gray-700 bg-white p-2 rounded border">
                            {variant.summary}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-purple-800 mb-1 block">
                            Emphasized Skills:
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {variant.skillsEmphasis.slice(0, 8).map((skill, index) => (
                              <Badge key={`skill-${variant.id}-${index}-${skill.slice(0, 10)}`} variant="outline" className="text-xs bg-purple-100 text-purple-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-purple-800 mb-1 block">
                            Keyword Optimizations:
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {variant.keywordOptimizations.slice(0, 6).map((keyword, index) => (
                              <Badge key={`keyword-${variant.id}-${index}-${keyword.slice(0, 10)}`} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {Object.keys(variant.experienceAdjustments).length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-purple-800 mb-1 block">
                              Experience Enhancements:
                            </label>
                            <div className="text-xs text-gray-600">
                              {Object.keys(variant.experienceAdjustments).length} experience item(s) enhanced
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              💡 <strong>Tip:</strong> Each variant optimizes your resume for different aspects -
              Professional (balanced), Impact (metrics-focused), Leadership (management-oriented).
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
