'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { WorkExperience } from '@/types/resume';

export function WorkExperienceForm() {
  const { resumeData, addWorkExperience, removeWorkExperience } = useResume();
  const { workExperience } = resumeData;

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: ''
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company && formData.position && formData.startDate) {
      addWorkExperience(formData);
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        location: ''
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Work Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="Job title"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                placeholder="MM/YYYY"
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                placeholder="MM/YYYY"
                disabled={formData.current}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => handleChange('current', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="current" className="text-sm">Currently working here</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">Add Work Experience</Button>
        </form>

        {workExperience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Added Work Experience:</h3>
            {workExperience.map((exp) => (
              <div key={exp.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeWorkExperience(exp.id)}
                  >
                    Remove
                  </Button>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
