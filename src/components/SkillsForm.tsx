'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function SkillsForm() {
  const { resumeData, addSkill, removeSkill } = useResume();
  const { skills } = resumeData;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category) {
      addSkill(formData);
      setFormData({
        name: '',
        category: '',
        level: 'Intermediate'
      });
    }
  };

  const skillCategories = Array.from(new Set(skills.map(s => s.category))).filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="JavaScript, Python, Leadership, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Programming Languages, Frameworks, etc."
                required
                list="categories"
              />
              <datalist id="categories">
                <option value="Programming Languages" />
                <option value="Frameworks & Libraries" />
                <option value="Tools & Technologies" />
                <option value="Databases" />
                <option value="Soft Skills" />
                <option value="Languages" />
              </datalist>
            </div>
          </div>

          <div>
            <Label htmlFor="level">Proficiency Level</Label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <Button type="submit" className="w-full">Add Skill</Button>
        </form>

        {skills.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Added Skills:</h3>
            {skillCategories.map(category => (
              <div key={category} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter(skill => skill.category === category)
                    .map((skill) => (
                      <div key={skill.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <span className="text-sm">{skill.name}</span>
                        {skill.level && (
                          <span className="text-xs text-gray-500 ml-1">({skill.level})</span>
                        )}
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
