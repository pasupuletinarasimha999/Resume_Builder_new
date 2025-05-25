'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { WorkExperience } from '@/types/resume';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function WorkExperienceForm() {
  const { state, dispatch } = useResume();
  const { workExperience } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<WorkExperience, 'id'>>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      dispatch({
        type: 'UPDATE_WORK_EXPERIENCE',
        payload: { id: editingId, data: formData }
      });
    } else {
      dispatch({
        type: 'ADD_WORK_EXPERIENCE',
        payload: { ...formData, id: Date.now().toString() }
      });
    }

    resetForm();
  };

  const handleEdit = (item: WorkExperience) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_WORK_EXPERIENCE', payload: id });
  };

  const handleChange = (field: keyof Omit<WorkExperience, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Work Experience</h2>

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

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, State/Country"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => handleChange('current', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="current">Currently working here</Label>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                disabled={formData.current}
                required={!formData.current}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingId ? 'Update Experience' : 'Add Experience'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Work Experience List */}
      {workExperience.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
          <div className="space-y-4">
            {workExperience.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.position}</h4>
                    <p className="text-gray-600">{item.company} • {item.location}</p>
                    <p className="text-sm text-gray-500">
                      {item.startDate} - {item.current ? 'Present' : item.endDate}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
