'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building2,
  Code,
  Heart,
  DollarSign,
  Megaphone,
  Shield,
  GraduationCap,
  Factory,
  TrendingUp,
  Users,
  Target,
  Lightbulb
} from 'lucide-react'

interface IndustryOptimization {
  keywords: string[]
  skills: string[]
  achievements: string[]
  terminology: Record<string, string>
  requirements: string[]
}

interface IndustryOptimizerProps {
  currentText: string
  targetIndustry?: string
  targetRole?: string
  onApplyOptimization?: (optimizedText: string, changes: string[]) => void
  className?: string
}

const INDUSTRY_DATA: Record<string, IndustryOptimization> = {
  technology: {
    keywords: [
      'agile', 'scrum', 'ci/cd', 'devops', 'microservices', 'api', 'cloud', 'aws', 'azure',
      'kubernetes', 'docker', 'automation', 'scalable', 'full-stack', 'frontend', 'backend',
      'database', 'machine learning', 'ai', 'data analytics', 'user experience', 'mobile'
    ],
    skills: [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'Git',
      'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Redux', 'GraphQL', 'REST APIs'
    ],
    achievements: [
      'Increased application performance by X%',
      'Reduced deployment time from X to Y',
      'Built scalable system serving X+ users',
      'Automated X% of manual processes',
      'Implemented CI/CD pipeline reducing bugs by X%',
      'Optimized database queries improving response time by X%'
    ],
    terminology: {
      'made': 'developed',
      'worked on': 'engineered',
      'helped': 'collaborated to',
      'did': 'implemented',
      'fixed': 'resolved',
      'improved': 'optimized'
    },
    requirements: [
      'Technical leadership experience',
      'Cross-functional collaboration',
      'Code review and mentoring',
      'Performance optimization',
      'Security best practices'
    ]
  },
  healthcare: {
    keywords: [
      'patient care', 'clinical', 'compliance', 'hipaa', 'ehr', 'medical records', 'quality assurance',
      'healthcare analytics', 'telemedicine', 'medical devices', 'regulatory', 'safety protocols',
      'evidence-based', 'patient outcomes', 'healthcare technology', 'interoperability'
    ],
    skills: [
      'Electronic Health Records (EHR)', 'HIPAA Compliance', 'Clinical Research', 'Medical Coding',
      'Healthcare Analytics', 'Patient Care', 'Medical Terminology', 'Quality Improvement',
      'Healthcare IT', 'Regulatory Compliance', 'Telemedicine', 'Medical Device Management'
    ],
    achievements: [
      'Improved patient satisfaction scores by X%',
      'Reduced patient wait times by X minutes',
      'Achieved X% compliance rate',
      'Streamlined care processes reducing costs by $X',
      'Implemented EHR system for X patients',
      'Reduced medical errors by X%'
    ],
    terminology: {
      'customers': 'patients',
      'users': 'patients',
      'products': 'healthcare solutions',
      'sales': 'patient services',
      'support': 'patient care'
    },
    requirements: [
      'Patient-centered care experience',
      'Regulatory compliance knowledge',
      'Healthcare technology proficiency',
      'Quality improvement initiatives',
      'Interdisciplinary collaboration'
    ]
  },
  finance: {
    keywords: [
      'financial analysis', 'risk management', 'portfolio', 'compliance', 'sox', 'audit',
      'financial modeling', 'derivatives', 'investment', 'trading', 'asset management',
      'regulatory', 'fintech', 'blockchain', 'digital banking', 'wealth management'
    ],
    skills: [
      'Financial Modeling', 'Risk Analysis', 'Excel/VBA', 'SQL', 'Python', 'R', 'Bloomberg Terminal',
      'Portfolio Management', 'Derivatives', 'Fixed Income', 'Equity Research', 'Compliance',
      'Financial Reporting', 'Valuation', 'Credit Analysis', 'Regulatory Knowledge'
    ],
    achievements: [
      'Managed portfolio worth $X million',
      'Reduced risk exposure by X%',
      'Generated X% annual returns',
      'Identified cost savings of $X',
      'Improved compliance rating by X%',
      'Streamlined processes reducing processing time by X%'
    ],
    terminology: {
      'customers': 'clients',
      'products': 'financial products',
      'sales': 'business development',
      'made': 'generated',
      'saved': 'optimized'
    },
    requirements: [
      'Financial analysis expertise',
      'Risk management experience',
      'Regulatory compliance knowledge',
      'Client relationship management',
      'Investment strategy development'
    ]
  },
  marketing: {
    keywords: [
      'digital marketing', 'seo', 'sem', 'social media', 'content marketing', 'brand management',
      'campaign optimization', 'conversion rate', 'roi', 'analytics', 'growth hacking',
      'customer acquisition', 'retention', 'segmentation', 'automation', 'a/b testing'
    ],
    skills: [
      'Google Analytics', 'Google Ads', 'Facebook Ads', 'SEO/SEM', 'Content Strategy',
      'Social Media Management', 'Email Marketing', 'Marketing Automation', 'Copywriting',
      'Brand Management', 'Market Research', 'A/B Testing', 'Conversion Optimization'
    ],
    achievements: [
      'Increased brand awareness by X%',
      'Generated X qualified leads',
      'Improved conversion rate by X%',
      'Achieved X% ROI on campaigns',
      'Grew social media following by X%',
      'Reduced customer acquisition cost by X%'
    ],
    terminology: {
      'users': 'customers',
      'made': 'created',
      'built': 'developed',
      'fixed': 'optimized',
      'worked on': 'executed'
    },
    requirements: [
      'Multi-channel campaign experience',
      'Data-driven decision making',
      'Creative content development',
      'Customer journey optimization',
      'Performance measurement and reporting'
    ]
  },
  education: {
    keywords: [
      'curriculum development', 'student outcomes', 'educational technology', 'assessment',
      'learning management system', 'pedagogical', 'instructional design', 'student engagement',
      'academic achievement', 'educational research', 'differentiated instruction', 'inclusive education'
    ],
    skills: [
      'Curriculum Development', 'Instructional Design', 'Educational Technology', 'Assessment Design',
      'Learning Management Systems', 'Student Engagement', 'Differentiated Instruction',
      'Educational Research', 'Classroom Management', 'Data Analysis', 'Professional Development'
    ],
    achievements: [
      'Improved student performance by X%',
      'Increased graduation rates by X%',
      'Developed curriculum for X students',
      'Reduced achievement gap by X%',
      'Implemented technology improving engagement by X%',
      'Trained X educators in new methodologies'
    ],
    terminology: {
      'customers': 'students',
      'users': 'learners',
      'products': 'educational programs',
      'sales': 'enrollment',
      'support': 'student services'
    },
    requirements: [
      'Student-centered approach',
      'Educational technology integration',
      'Data-driven instruction',
      'Collaborative teaching experience',
      'Continuous professional development'
    ]
  }
}

const INDUSTRY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  technology: Code,
  healthcare: Heart,
  finance: DollarSign,
  marketing: Megaphone,
  education: GraduationCap,
  manufacturing: Factory,
  consulting: Users,
  legal: Shield,
  retail: Building2
}

export function IndustryOptimizer({
  currentText,
  targetIndustry,
  targetRole,
  onApplyOptimization,
  className
}: IndustryOptimizerProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(targetIndustry || 'technology')
  const [optimizations, setOptimizations] = useState<{
    keywords: string[]
    terminology: Array<{ original: string; improved: string }>
    missing: string[]
    achievements: string[]
  }>({
    keywords: [],
    terminology: [],
    missing: [],
    achievements: []
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (currentText.trim()) {
      analyzeIndustryFit(currentText, selectedIndustry)
    }
  }, [currentText, selectedIndustry])

  const analyzeIndustryFit = async (text: string, industry: string) => {
    setIsAnalyzing(true)

    const industryData = INDUSTRY_DATA[industry]
    if (!industryData) {
      setIsAnalyzing(false)
      return
    }

    const lowerText = text.toLowerCase()

    // Find missing keywords
    const missingKeywords = industryData.keywords.filter(keyword =>
      !lowerText.includes(keyword.toLowerCase())
    ).slice(0, 8)

    // Find terminology that can be improved
    const terminologyImprovements = Object.entries(industryData.terminology)
      .filter(([original]) => lowerText.includes(original.toLowerCase()))
      .map(([original, improved]) => ({ original, improved }))

    // Suggest industry-specific achievements
    const relevantAchievements = industryData.achievements.slice(0, 4)

    // Identify existing good keywords
    const existingKeywords = industryData.keywords.filter(keyword =>
      lowerText.includes(keyword.toLowerCase())
    )

    setOptimizations({
      keywords: existingKeywords,
      terminology: terminologyImprovements,
      missing: missingKeywords,
      achievements: relevantAchievements
    })

    setIsAnalyzing(false)
  }

  const applyOptimization = (type: 'terminology' | 'keywords' | 'achievements', data: any) => {
    let optimizedText = currentText
    const changes: string[] = []

    if (type === 'terminology') {
      const { original, improved } = data
      const regex = new RegExp(`\\b${original}\\b`, 'gi')
      optimizedText = optimizedText.replace(regex, improved)
      changes.push(`Replaced "${original}" with "${improved}"`)
    } else if (type === 'keywords') {
      // Add keywords naturally to the text
      const keywordsToAdd = data.slice(0, 3)
      optimizedText += ` Key focus areas include: ${keywordsToAdd.join(', ')}.`
      changes.push(`Added industry keywords: ${keywordsToAdd.join(', ')}`)
    } else if (type === 'achievements') {
      optimizedText += `\n\n• ${data}`
      changes.push(`Added achievement template: ${data}`)
    }

    onApplyOptimization?.(optimizedText, changes)
  }

  const IndustryIcon = INDUSTRY_ICONS[selectedIndustry] || Building2

  return (
    <div className={className}>
      {isAnalyzing && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Analyzing industry fit...</span>
        </div>
      )}

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IndustryIcon className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm">Industry-Specific Optimization</CardTitle>
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(INDUSTRY_DATA).map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue="keywords" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-8">
              <TabsTrigger value="keywords" className="text-xs">Keywords</TabsTrigger>
              <TabsTrigger value="terminology" className="text-xs">Terminology</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs">Achievements</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="mt-3">
              <div className="space-y-3">
                {optimizations.keywords.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-green-600 mb-2 flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      Found Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {optimizations.keywords.map(keyword => (
                        <Badge key={keyword} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {optimizations.missing.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-orange-600 mb-2 flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Recommended Keywords
                    </h4>
                    <div className="space-y-2">
                      {optimizations.missing.slice(0, 6).map(keyword => (
                        <div key={keyword} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <Badge variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => applyOptimization('keywords', [keyword])}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                      {optimizations.missing.length > 6 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs"
                          onClick={() => applyOptimization('keywords', optimizations.missing.slice(0, 5))}
                        >
                          Add Top 5 Keywords
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="terminology" className="mt-3">
              <div className="space-y-2">
                {optimizations.terminology.length > 0 ? (
                  <>
                    <h4 className="text-xs font-medium text-blue-600 mb-2">Terminology Improvements</h4>
                    {optimizations.terminology.map((term, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs">
                            <span className="text-red-600 line-through">{term.original}</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600 font-medium">{term.improved}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => applyOptimization('terminology', term)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No terminology improvements found. Your text already uses professional language!
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-3">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-purple-600 mb-2">Industry-Specific Achievement Templates</h4>
                {optimizations.achievements.map((achievement, index) => (
                  <div key={index} className="p-2 bg-purple-50 rounded">
                    <div className="flex items-start justify-between">
                      <div className="text-xs text-gray-700 flex-1">
                        {achievement}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs ml-2"
                        onClick={() => applyOptimization('achievements', achievement)}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-3">
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-indigo-600 mb-2">Recommended Skills for {selectedIndustry}</h4>
                <div className="flex flex-wrap gap-1">
                  {INDUSTRY_DATA[selectedIndustry]?.skills.slice(0, 12).map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs bg-indigo-50 text-indigo-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  💡 Consider adding these skills to your resume if you have experience with them.
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <strong>Industry Focus:</strong> {selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1)} •
              <strong> Keywords Found:</strong> {optimizations.keywords.length} •
              <strong> Improvements Available:</strong> {optimizations.missing.length + optimizations.terminology.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
