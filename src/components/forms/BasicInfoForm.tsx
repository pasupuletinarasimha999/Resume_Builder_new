'use client';

import { useResume } from '@/context/ResumeContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function BasicInfoForm() {
  const { state, dispatch } = useResume();
  const { personalInfo } = state.data;

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { [field]: value }
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter your location"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a brief professional summary..."
            rows={4}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </Card>
  );
}
