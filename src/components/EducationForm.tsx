'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function EducationForm() {
  const { resumeData, addEducation, removeEducation } = useResume();
  const { education } = resumeData;

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.institution && formData.degree && formData.field && formData.startDate && formData.endDate) {
      addEducation(formData);
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              placeholder="University or school name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder="Bachelor's, Master's, PhD, etc."
                required
              />
            </div>
            <div>
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => handleChange('field', e.target.value)}
                placeholder="Computer Science, Engineering, etc."
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
                required
              />
            </div>
            <div>
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa}
                onChange={(e) => handleChange('gpa', e.target.value)}
                placeholder="3.75"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Relevant coursework, honors, achievements..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">Add Education</Button>
        </form>

        {education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Added Education:</h3>
            {education.map((edu) => (
              <div key={edu.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                  >
                    Remove
                  </Button>
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
