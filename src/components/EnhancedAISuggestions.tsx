'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wand2, TrendingUp, Target, Zap, CheckCircle, Loader2, Copy } from 'lucide-react'
import { aiService } from '@/services/aiService'

interface ContentSuggestion {
  id: string
  type: 'description' | 'summary' | 'achievement' | 'skill' | 'bullet_point'
  content: string
  confidence: number
  reasoning: string
}

interface EnhancedAISuggestionsProps {
  onApplySuggestion: (suggestion: string, type: string) => void
}

export function EnhancedAISuggestions({ onApplySuggestion }: EnhancedAISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')

  // Experience Description Generator
  const [experienceData, setExperienceData] = useState({
    position: '',
    company: '',
    industry: '',
    duration: '',
    keyTasks: ''
  })

  // Achievement Quantifier
  const [achievements, setAchievements] = useState('')
  const [achievementContext, setAchievementContext] = useState({
    role: '',
    industry: '',
    company: ''
  })

  // Bullet Point Enhancer
  const [bulletPoints, setBulletPoints] = useState('')
  const [bulletContext, setBulletContext] = useState({
    position: '',
    company: '',
    industry: ''
  })

  // Summary Optimizer
  const [summaryData, setSummaryData] = useState({
    currentSummary: '',
    targetRole: '',
    yearsOfExperience: '',
    industryFocus: '',
    keySkills: ''
  })

  // Skill Gap Analyzer
  const [skillGapData, setSkillGapData] = useState({
    currentSkills: '',
    targetRole: '',
    industry: ''
  })

  const generateExperienceDescriptions = async () => {
    if (!experienceData.position || !experienceData.company) {
      alert('Please provide at least position and company')
      return
    }

    setIsLoading(true)
    try {
      const keyTasksArray = experienceData.keyTasks
        ? experienceData.keyTasks.split(',').map(task => task.trim())
        : []

      const results = await aiService.generateSmartExperienceDescriptions({
        ...experienceData,
        keyTasks: keyTasksArray
      })

      setSuggestions(results)
    } catch (error) {
      console.error('Failed to generate experience descriptions:', error)
      alert('Failed to generate suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const quantifyAchievements = async () => {
    if (!achievements.trim()) {
      alert('Please provide achievement descriptions to quantify')
      return
    }

    setIsLoading(true)
    try {
      const achievementList = achievements.split('\n').filter(a => a.trim())
      const results = await aiService.quantifyAchievements(achievementList, achievementContext)
      setSuggestions(results)
    } catch (error) {
      console.error('Failed to quantify achievements:', error)
      alert('Failed to generate suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const enhanceBulletPoints = async () => {
    if (!bulletPoints.trim()) {
      alert('Please provide bullet points to enhance')
      return
    }

    setIsLoading(true)
    try {
      const bulletList = bulletPoints.split('\n').filter(b => b.trim())
      const results = await aiService.enhanceBulletPoints(bulletList, bulletContext)
      setSuggestions(results)
    } catch (error) {
      console.error('Failed to enhance bullet points:', error)
      alert('Failed to generate suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const optimizeSummary = async () => {
    if (!summaryData.currentSummary.trim()) {
      alert('Please provide a current summary to optimize')
      return
    }

    setIsLoading(true)
    try {
      const context = {
        targetRole: summaryData.targetRole,
        yearsOfExperience: summaryData.yearsOfExperience ? parseInt(summaryData.yearsOfExperience) : undefined,
        industryFocus: summaryData.industryFocus,
        skills: summaryData.keySkills ? summaryData.keySkills.split(',').map(s => s.trim()) : undefined
      }

      const results = await aiService.optimizeProfessionalSummary(summaryData.currentSummary, context)
      setSuggestions(results)
    } catch (error) {
      console.error('Failed to optimize summary:', error)
      alert('Failed to generate suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeSkillGap = async () => {
    if (!skillGapData.currentSkills.trim() || !skillGapData.targetRole.trim()) {
      alert('Please provide both current skills and target role')
      return
    }

    setIsLoading(true)
    try {
      const currentSkillsList = skillGapData.currentSkills.split(',').map(s => s.trim())
      const analysis = await aiService.generateSkillSuggestions(
        currentSkillsList,
        skillGapData.targetRole,
        skillGapData.industry || 'Technology'
      )

      // Convert skill gap analysis to suggestions format
      const gapSuggestions: ContentSuggestion[] = [
        {
          id: 'skill_gap_missing',
          type: 'skill',
          content: `Missing Skills: ${analysis.missingSkills.join(', ')}`,
          confidence: 0.9,
          reasoning: 'Critical skills missing for target role'
        },
        {
          id: 'skill_gap_recommended',
          type: 'skill',
          content: `Recommended to Learn: ${analysis.recommendedSkills.join(', ')}`,
          confidence: 0.8,
          reasoning: 'Skills that would strengthen your profile'
        },
        ...analysis.careerAdvice.map((advice, index) => ({
          id: `skill_gap_advice_${index}`,
          type: 'skill' as const,
          content: advice,
          confidence: 0.7,
          reasoning: 'Career development recommendation'
        }))
      ]

      setSuggestions(gapSuggestions)
    } catch (error) {
      console.error('Failed to analyze skill gap:', error)
      alert('Failed to generate analysis. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'experience': return <Target className="h-4 w-4" />
      case 'achievements': return <TrendingUp className="h-4 w-4" />
      case 'bullets': return <Zap className="h-4 w-4" />
      default: return <Wand2 className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Enhanced AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              {getTabIcon('experience')}
              Experience
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              {getTabIcon('achievements')}
              Achievements
            </TabsTrigger>
            <TabsTrigger value="bullets" className="flex items-center gap-2">
              {getTabIcon('bullets')}
              Bullet Points
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div>
              <Label htmlFor="currentSummary">Current Professional Summary *</Label>
              <Textarea
                id="currentSummary"
                value={summaryData.currentSummary}
                onChange={(e) => setSummaryData(prev => ({ ...prev, currentSummary: e.target.value }))}
                placeholder="Enter your current professional summary here..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  value={summaryData.targetRole}
                  onChange={(e) => setSummaryData(prev => ({ ...prev, targetRole: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="yearsExp">Years of Experience</Label>
                <Input
                  id="yearsExp"
                  type="number"
                  value={summaryData.yearsOfExperience}
                  onChange={(e) => setSummaryData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <Label htmlFor="industryFocus">Industry Focus</Label>
                <Input
                  id="industryFocus"
                  value={summaryData.industryFocus}
                  onChange={(e) => setSummaryData(prev => ({ ...prev, industryFocus: e.target.value }))}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
              <div>
                <Label htmlFor="keySkills">Key Skills (comma-separated)</Label>
                <Input
                  id="keySkills"
                  value={summaryData.keySkills}
                  onChange={(e) => setSummaryData(prev => ({ ...prev, keySkills: e.target.value }))}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </div>
            </div>
            <Button
              onClick={optimizeSummary}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
              Optimize Professional Summary
            </Button>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div>
              <Label htmlFor="currentSkills">Current Skills (comma-separated) *</Label>
              <Textarea
                id="currentSkills"
                value={skillGapData.currentSkills}
                onChange={(e) => setSkillGapData(prev => ({ ...prev, currentSkills: e.target.value }))}
                placeholder="e.g., JavaScript, React, Python, SQL, Git, AWS..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="skillTargetRole">Target Role *</Label>
                <Input
                  id="skillTargetRole"
                  value={skillGapData.targetRole}
                  onChange={(e) => setSkillGapData(prev => ({ ...prev, targetRole: e.target.value }))}
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>
              <div>
                <Label htmlFor="skillIndustry">Industry</Label>
                <Input
                  id="skillIndustry"
                  value={skillGapData.industry}
                  onChange={(e) => setSkillGapData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Technology, Finance"
                />
              </div>
            </div>
            <Button
              onClick={analyzeSkillGap}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Analyze Skill Gap
            </Button>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={experienceData.position}
                  onChange={(e) => setExperienceData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={experienceData.company}
                  onChange={(e) => setExperienceData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={experienceData.industry}
                  onChange={(e) => setExperienceData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Technology"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={experienceData.duration}
                  onChange={(e) => setExperienceData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2 years"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="keyTasks">Key Tasks (comma-separated)</Label>
              <Textarea
                id="keyTasks"
                value={experienceData.keyTasks}
                onChange={(e) => setExperienceData(prev => ({ ...prev, keyTasks: e.target.value }))}
                placeholder="e.g., Backend development, API design, Team leadership"
                rows={3}
              />
            </div>
            <Button
              onClick={generateExperienceDescriptions}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Target className="h-4 w-4 mr-2" />}
              Generate Experience Descriptions
            </Button>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  value={achievementContext.role}
                  onChange={(e) => setAchievementContext(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={achievementContext.industry}
                  onChange={(e) => setAchievementContext(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Technology"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={achievementContext.company}
                  onChange={(e) => setAchievementContext(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Microsoft"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="achievements">Achievement Descriptions (one per line)</Label>
              <Textarea
                id="achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="Improved system performance&#10;Led team project&#10;Reduced processing time"
                rows={5}
              />
            </div>
            <Button
              onClick={quantifyAchievements}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
              Quantify Achievements
            </Button>
          </TabsContent>

          <TabsContent value="bullets" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bulletPosition">Position</Label>
                <Input
                  id="bulletPosition"
                  value={bulletContext.position}
                  onChange={(e) => setBulletContext(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., Data Scientist"
                />
              </div>
              <div>
                <Label htmlFor="bulletCompany">Company</Label>
                <Input
                  id="bulletCompany"
                  value={bulletContext.company}
                  onChange={(e) => setBulletContext(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Amazon"
                />
              </div>
              <div>
                <Label htmlFor="bulletIndustry">Industry</Label>
                <Input
                  id="bulletIndustry"
                  value={bulletContext.industry}
                  onChange={(e) => setBulletContext(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., E-commerce"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bulletPoints">Bullet Points to Enhance (one per line)</Label>
              <Textarea
                id="bulletPoints"
                value={bulletPoints}
                onChange={(e) => setBulletPoints(e.target.value)}
                placeholder="Developed web applications&#10;Worked with team members&#10;Improved system efficiency"
                rows={5}
              />
            </div>
            <Button
              onClick={enhanceBulletPoints}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              Enhance Bullet Points
            </Button>
          </TabsContent>
        </Tabs>

        {/* Suggestions Display */}
        {suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">AI Suggestions</h3>
            </div>
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getConfidenceColor(suggestion.confidence)}>
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(suggestion.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(suggestion.content, suggestion.type)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{suggestion.content}</p>
                  <p className="text-xs text-gray-500 italic">{suggestion.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
