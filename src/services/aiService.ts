interface AIServiceConfig {
  apiKey?: string
  model: string
  maxTokens: number
  temperature: number
}

interface ContentSuggestion {
  id: string
  type: 'description' | 'summary' | 'achievement' | 'skill' | 'bullet_point'
  content: string
  confidence: number
  reasoning: string
}

interface JobMatchAnalysis {
  score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  keywords: string[]
}

interface SkillGapAnalysis {
  missingSkills: string[]
  recommendedSkills: string[]
  skillLevel: Record<string, 'beginner' | 'intermediate' | 'expert'>
  careerAdvice: string[]
}

interface SuggestionItem {
  content: string
  confidence?: number
  reasoning: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

interface ExperienceItem {
  position?: string
  company?: string
  description?: string
}

interface ResumeDataInput {
  summary: string
  experience?: ExperienceItem[]
  skills?: Array<{ skills: string }>
}

interface SkillGapAnalysisResponse {
  missingSkills: string[]
  recommendedSkills: string[]
  skillLevel: Record<string, 'beginner' | 'intermediate' | 'expert'>
  careerAdvice: string[]
}

interface JobMatchAnalysisResponse {
  score: number
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  keywords: string[]
}

export class AIService {
  private config: AIServiceConfig
  private cache: Map<string, ContentSuggestion[] | SkillGapAnalysis | JobMatchAnalysis> = new Map()

  constructor(config?: Partial<AIServiceConfig>) {
    this.config = {
      apiKey: config?.apiKey || process.env.OPENAI_API_KEY,
      model: config?.model || 'gpt-4o-mini',
      maxTokens: config?.maxTokens || 500,
      temperature: config?.temperature || 0.7
    }
  }

  async generateJobDescription(
    position: string,
    company: string,
    industry: string,
    experienceLevel: string
  ): Promise<ContentSuggestion[]> {
    const cacheKey = `job_desc_${position}_${company}_${industry}_${experienceLevel}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as ContentSuggestion[]
    }

    const prompt = `Generate 4-5 professional bullet points for a ${position} role at ${company} in the ${industry} industry for someone with ${experienceLevel} experience level.

Focus on:
- Quantifiable achievements and results
- Industry-specific technologies and methodologies
- Leadership and collaboration aspects
- Process improvements and business impact

Return as JSON array with format:
[{
  "content": "bullet point text",
  "confidence": 0.9,
  "reasoning": "why this is relevant"
}]`

    try {
      const suggestions = await this.callOpenAI(prompt) as SuggestionItem[]

      const results: ContentSuggestion[] = suggestions.map(
        (item: SuggestionItem, index: number) => ({
          id: `job_desc_${index}`,
          type: 'description' as const,
          content: item.content,
          confidence: item.confidence || 0.8,
          reasoning: item.reasoning || 'AI-generated based on role requirements'
        })
      )

      this.cache.set(cacheKey, results)
      return results

    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackJobDescriptions(position, experienceLevel)
    }
  }

  async enhanceProfessionalSummary(
    currentSummary: string,
    targetRole: string,
    experience: ExperienceItem[],
    skills: string[]
  ): Promise<ContentSuggestion[]> {
    const prompt = `Improve this professional summary for someone targeting a ${targetRole} position:

Current Summary: "${currentSummary}"

Experience: ${experience.map(exp => `${exp.position} at ${exp.company}`).join(', ')}
Key Skills: ${skills.join(', ')}

Generate 3 improved versions that:
- Highlight relevant achievements
- Use industry keywords
- Show career progression
- Quantify impact where possible
- Match the target role requirements

Return as JSON array with format:
[{
  "content": "improved summary text",
  "confidence": 0.9,
  "reasoning": "what makes this version better"
}]`

    try {
      const suggestions = await this.callOpenAI(prompt) as SuggestionItem[]

      return suggestions.map((item: SuggestionItem, index: number) => ({
        id: `summary_${index}`,
        type: 'summary' as const,
        content: item.content,
        confidence: item.confidence || 0.8,
        reasoning: item.reasoning
      }))

    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackSummaryEnhancements(currentSummary)
    }
  }

  async generateSkillSuggestions(
    currentSkills: string[],
    targetRole: string,
    industry: string
  ): Promise<SkillGapAnalysis> {
    const prompt = `Analyze skills for someone targeting a ${targetRole} role in ${industry}:

Current Skills: ${currentSkills.join(', ')}

Provide skill gap analysis including:
- Missing critical skills for the role
- Recommended skills to learn next
- Assessment of current skill levels
- Career advancement advice

Return as JSON with format:
{
  "missingSkills": ["skill1", "skill2"],
  "recommendedSkills": ["skill1", "skill2"],
  "skillLevel": {"skill": "level"},
  "careerAdvice": ["advice1", "advice2"]
}`

    try {
      const analysis = await this.callOpenAI(prompt, false) as SkillGapAnalysisResponse
      return {
        missingSkills: analysis.missingSkills,
        recommendedSkills: analysis.recommendedSkills,
        skillLevel: analysis.skillLevel,
        careerAdvice: analysis.careerAdvice
      }
    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackSkillAnalysis(currentSkills, targetRole)
    }
  }

  async analyzeJobMatch(
    resumeData: ResumeDataInput,
    jobDescription: string
  ): Promise<JobMatchAnalysis> {
    const prompt = `Analyze how well this resume matches the job description:

Resume Summary: ${resumeData.summary}
Experience: ${resumeData.experience?.map((exp) => `${exp.position}: ${exp.description}`).join('\n')}
Skills: ${resumeData.skills?.map((skill) => skill.skills).join(', ')}

Job Description:
${jobDescription}

Provide analysis with format:
{
  "score": 85,
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "keywords": ["keyword1", "keyword2"]
}`

    try {
      const analysis = await this.callOpenAI(prompt, false) as JobMatchAnalysisResponse
      return {
        score: analysis.score,
        strengths: analysis.strengths,
        gaps: analysis.gaps,
        suggestions: analysis.suggestions,
        keywords: analysis.keywords
      }
    } catch (error) {
      console.error('AI service error:', error)
      return {
        score: 75,
        strengths: ['Good technical background', 'Relevant experience'],
        gaps: ['Could add more quantified results', 'Missing some key technologies'],
        suggestions: ['Add metrics to achievements', 'Include relevant certifications'],
        keywords: ['leadership', 'teamwork', 'problem-solving']
      }
    }
  }

  async enhanceBulletPoints(
    bulletPoints: string[],
    context: { position?: string; company?: string; industry?: string }
  ): Promise<ContentSuggestion[]> {
    const prompt = `Enhance these bullet points for a ${context.position || 'professional'} role:

Original Bullet Points:
${bulletPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

Improve each bullet point by:
- Adding quantifiable metrics where appropriate
- Using stronger action verbs
- Highlighting business impact
- Making them more ATS-friendly
- Ensuring they're specific and results-oriented

Return as JSON array with format:
[{
  "content": "enhanced bullet point",
  "confidence": 0.9,
  "reasoning": "what was improved"
}]`

    try {
      const suggestions = await this.callOpenAI(prompt) as SuggestionItem[]

      return suggestions.map((item: SuggestionItem, index: number) => ({
        id: `bullet_${index}`,
        type: 'bullet_point' as const,
        content: item.content,
        confidence: item.confidence || 0.8,
        reasoning: item.reasoning
      }))

    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackBulletEnhancements(bulletPoints)
    }
  }

  async quantifyAchievements(
    descriptions: string[],
    context: { role?: string; industry?: string; company?: string }
  ): Promise<ContentSuggestion[]> {
    const prompt = `Quantify and enhance these achievements for a ${context.role || 'professional'} in ${context.industry || 'technology'}:

Original Descriptions:
${descriptions.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}

For each description, add specific metrics, percentages, timeframes, or numbers. Use realistic estimates based on typical ${context.role || 'professional'} achievements. Focus on:
- Performance improvements (e.g., "increased efficiency by 25%")
- Scale/volume (e.g., "managed team of 8 people")
- Time savings (e.g., "reduced processing time from 2 hours to 15 minutes")
- Revenue/cost impact (e.g., "generated $50K in cost savings")
- User/customer impact (e.g., "improved user satisfaction by 30%")

Return as JSON array with format:
[{
  "content": "quantified achievement description",
  "confidence": 0.85,
  "reasoning": "metrics and quantification added"
}]`

    try {
      const suggestions = await this.callOpenAI(prompt) as SuggestionItem[]

      return suggestions.map((item: SuggestionItem, index: number) => ({
        id: `quantified_${index}`,
        type: 'achievement' as const,
        content: item.content,
        confidence: item.confidence || 0.8,
        reasoning: item.reasoning
      }))

    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackQuantifiedAchievements(descriptions)
    }
  }

  async generateSmartExperienceDescriptions(
    experienceData: {
      position: string
      company: string
      industry?: string
      duration?: string
      keyTasks?: string[]
    }
  ): Promise<ContentSuggestion[]> {
    const prompt = `Generate 4-6 professional bullet point descriptions for this work experience:

Position: ${experienceData.position}
Company: ${experienceData.company}
Industry: ${experienceData.industry || 'Technology'}
Duration: ${experienceData.duration || 'Not specified'}
Key Tasks: ${experienceData.keyTasks?.join(', ') || 'Not specified'}

Create descriptions that:
- Use strong action verbs and quantifiable results
- Highlight technical skills and business impact
- Show progression and increasing responsibility
- Include industry-relevant keywords
- Demonstrate leadership and collaboration
- Focus on achievements rather than just duties

Return as JSON array with format:
[{
  "content": "professional bullet point description",
  "confidence": 0.9,
  "reasoning": "why this description is effective"
}]`

    try {
      const suggestions = await this.callOpenAI(prompt) as SuggestionItem[]

      return suggestions.map((item: SuggestionItem, index: number) => ({
        id: `exp_desc_${index}`,
        type: 'description' as const,
        content: item.content,
        confidence: item.confidence || 0.8,
        reasoning: item.reasoning
      }))

    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackExperienceDescriptions(experienceData)
    }
  }

  async optimizeProfessionalSummary(
    currentSummary: string,
    context: {
      targetRole?: string
      experience?: ExperienceItem[]
      skills?: string[]
      yearsOfExperience?: number
      industryFocus?: string
    }
  ): Promise<ContentSuggestion[]> {
    const skillsList = context.skills?.join(', ') || 'Not specified'
    const experienceList = context.experience?.map(exp =>
      `${exp.position} at ${exp.company}`
    ).join(', ') || 'Not specified'

    const prompt = `Optimize this professional summary for a ${context.targetRole || 'professional'} role:

Current Summary: "${currentSummary}"

Context:
- Target Role: ${context.targetRole || 'Not specified'}
- Years of Experience: ${context.yearsOfExperience || 'Not specified'}
- Industry Focus: ${context.industryFocus || 'Technology'}
- Recent Experience: ${experienceList}
- Key Skills: ${skillsList}

Create 3-4 improved versions that:
- Start with a strong value proposition
- Include relevant keywords for ATS optimization
- Quantify achievements where possible
- Match the target role requirements
- Highlight unique selling points
- Maintain professional tone and conciseness (2-4 sentences)
- Show career progression and expertise level

Return as JSON array with format:
[{
  "content": "optimized professional summary",
  "confidence": 0.9,
  "reasoning": "what makes this version better and why it's effective"
}]`

    try {
      const suggestions = await this.callOpenAI(prompt) as SuggestionItem[]

      return suggestions.map((item: SuggestionItem, index: number) => ({
        id: `summary_opt_${index}`,
        type: 'summary' as const,
        content: item.content,
        confidence: item.confidence || 0.8,
        reasoning: item.reasoning
      }))

    } catch (error) {
      console.error('AI service error:', error)
      return this.getFallbackSummaryOptimizations(currentSummary, context)
    }
  }

  private async callOpenAI(prompt: string, expectArray = true): Promise<unknown> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writing expert and career coach. Always return valid JSON responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json() as OpenAIResponse
    const content = data.choices[0]?.message?.content

    try {
      return JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Invalid JSON response from AI')
    }
  }

  private getFallbackJobDescriptions(position: string, level: string): ContentSuggestion[] {
    const templates = {
      'Software Engineer': [
        'Developed and maintained scalable web applications serving thousands of users',
        'Collaborated with cross-functional teams to deliver features on time and within budget',
        'Implemented best practices for code quality, testing, and documentation',
        'Optimized application performance resulting in improved user experience'
      ],
      'Data Scientist': [
        'Built machine learning models to solve complex business problems',
        'Analyzed large datasets to extract actionable insights and recommendations',
        'Collaborated with stakeholders to define requirements and success metrics',
        'Deployed models to production environment with monitoring and maintenance'
      ]
    }

    const descriptions = templates[position as keyof typeof templates] || templates['Software Engineer']

    return descriptions.map((content, index) => ({
      id: `fallback_${index}`,
      type: 'description' as const,
      content,
      confidence: 0.7,
      reasoning: 'Template-based suggestion (AI unavailable)'
    }))
  }

  private getFallbackSummaryEnhancements(currentSummary: string): ContentSuggestion[] {
    return [
      {
        id: 'fallback_summary_1',
        type: 'summary' as const,
        content: `${currentSummary} Proven track record of delivering results and driving innovation in fast-paced environments.`,
        confidence: 0.6,
        reasoning: 'Added achievement and environment context'
      },
      {
        id: 'fallback_summary_2',
        type: 'summary' as const,
        content: `Results-driven professional with expertise in ${currentSummary.toLowerCase()}. Strong analytical and problem-solving skills with experience leading cross-functional teams.`,
        confidence: 0.6,
        reasoning: 'Restructured with stronger opening and leadership mention'
      }
    ]
  }

  private getFallbackSkillAnalysis(currentSkills: string[], targetRole: string): SkillGapAnalysis {
    const commonSkills = {
      'Software Engineer': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS'],
      'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Tableau', 'TensorFlow'],
      'Product Manager': ['Agile', 'Scrum', 'Analytics', 'User Research', 'SQL', 'Figma', 'JIRA']
    }

    const roleSkills = commonSkills[targetRole as keyof typeof commonSkills] || commonSkills['Software Engineer']
    const missing = roleSkills.filter(skill => !currentSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase())))

    return {
      missingSkills: missing.slice(0, 3),
      recommendedSkills: missing.slice(0, 5),
      skillLevel: Object.fromEntries(currentSkills.map(skill => [skill, 'intermediate' as const])),
      careerAdvice: [
        'Focus on developing missing technical skills',
        'Consider obtaining relevant certifications',
        'Build portfolio projects to demonstrate expertise'
      ]
    }
  }

  private getFallbackBulletEnhancements(bulletPoints: string[]): ContentSuggestion[] {
    return bulletPoints.map((point, index) => ({
      id: `fallback_bullet_${index}`,
      type: 'bullet_point' as const,
      content: point.startsWith('Developed') ?
        point.replace('Developed', 'Successfully developed and deployed') :
        `Enhanced ${point.toLowerCase()}`,
      confidence: 0.5,
      reasoning: 'Basic enhancement applied (AI unavailable)'
    }))
  }

  private getFallbackQuantifiedAchievements(descriptions: string[]): ContentSuggestion[] {
    const quantifiers = [
      'Improved efficiency by 20%',
      'Reduced processing time by 30%',
      'Managed team of 5+ members',
      'Increased productivity by 25%',
      'Saved approximately $10K annually',
      'Improved customer satisfaction by 15%'
    ]

    return descriptions.map((desc, index) => ({
      id: `fallback_quantified_${index}`,
      type: 'achievement' as const,
      content: `${desc} - ${quantifiers[index % quantifiers.length]}`,
      confidence: 0.6,
      reasoning: 'Template-based quantification applied (AI unavailable)'
    }))
  }

  private getFallbackExperienceDescriptions(
    experienceData: { position: string; company: string; industry?: string }
  ): ContentSuggestion[] {
    const templates = {
      'Software Engineer': [
        'Developed and maintained scalable web applications using modern technologies',
        'Collaborated with cross-functional teams to deliver high-quality software solutions',
        'Implemented best practices for code quality, testing, and documentation',
        'Optimized application performance resulting in improved user experience'
      ],
      'Product Manager': [
        'Led product development initiatives from conception to launch',
        'Collaborated with engineering and design teams to define product requirements',
        'Analyzed user feedback and market research to prioritize feature development',
        'Managed product roadmap and communicated progress to stakeholders'
      ],
      'Data Scientist': [
        'Built machine learning models to solve complex business problems',
        'Analyzed large datasets to extract actionable insights and recommendations',
        'Presented findings to stakeholders and influenced strategic decisions',
        'Deployed models to production environment with monitoring and maintenance'
      ]
    }

    const descriptions = templates[experienceData.position as keyof typeof templates] || templates['Software Engineer']

    return descriptions.map((content, index) => ({
      id: `fallback_exp_${index}`,
      type: 'description' as const,
      content,
      confidence: 0.7,
      reasoning: 'Template-based description (AI unavailable)'
    }))
  }

  private getFallbackSummaryOptimizations(
    currentSummary: string,
    context: { targetRole?: string; yearsOfExperience?: number; industryFocus?: string }
  ): ContentSuggestion[] {
    const role = context.targetRole || 'Professional'
    const years = context.yearsOfExperience || 3
    const industry = context.industryFocus || 'technology'

    const templates = [
      `Results-driven ${role} with ${years}+ years of experience in ${industry}. ${currentSummary} Proven track record of delivering innovative solutions and driving business growth.`,
      `Experienced ${role} specializing in ${industry} with a strong background in ${currentSummary.toLowerCase()}. Known for leadership, problem-solving, and driving measurable results.`,
      `${role} with ${years} years of expertise in ${industry}. ${currentSummary} Passionate about leveraging technology to solve complex business challenges and improve operational efficiency.`,
      `Dynamic ${role} with proven success in ${industry}. ${currentSummary} Skilled in leading cross-functional teams and delivering high-impact solutions that drive revenue growth.`
    ]

    return templates.map((content, index) => ({
      id: `fallback_summary_${index}`,
      type: 'summary' as const,
      content: content.replace(/\s+/g, ' ').trim(),
      confidence: 0.6,
      reasoning: 'Template-based optimization (AI unavailable)'
    }))
  }
}

export const aiService = new AIService()
