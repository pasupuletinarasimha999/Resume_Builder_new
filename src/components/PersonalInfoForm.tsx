'use client';

import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(123) 456-7890"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, State/Country"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
