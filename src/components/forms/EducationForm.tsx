'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Education } from '@/types/resume';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function EducationForm() {
  const { state, dispatch } = useResume();
  const { education } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      dispatch({
        type: 'UPDATE_EDUCATION',
        payload: { id: editingId, data: formData }
      });
    } else {
      dispatch({
        type: 'ADD_EDUCATION',
        payload: { ...formData, id: Date.now().toString() }
      });
    }

    resetForm();
  };

  const handleEdit = (item: Education) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_EDUCATION', payload: id });
  };

  const handleChange = (field: keyof Omit<Education, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="University/School name"
                required
              />
            </div>

            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder="Bachelor's, Master's, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => handleChange('field', e.target.value)}
                placeholder="Computer Science, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa}
                onChange={(e) => handleChange('gpa', e.target.value)}
                placeholder="3.8/4.0"
              />
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
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Relevant coursework, achievements, etc."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingId ? 'Update Education' : 'Add Education'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Education List */}
      {education.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Education History</h3>
          <div className="space-y-4">
            {education.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.degree} in {item.field}</h4>
                    <p className="text-gray-600">{item.institution}</p>
                    <p className="text-sm text-gray-500">
                      {item.startDate} - {item.endDate}
                      {item.gpa && ` • GPA: ${item.gpa}`}
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                    )}
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
