'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Education } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export function EducationForm({ data, onUpdate }: EducationFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Education>();

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      id: '',
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    });
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setIsAdding(false);
    reset(education);
  };

  const handleSave = (formData: Education) => {
    const newEducation = {
      ...formData,
      id: editingId || crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    };

    if (editingId) {
      // Update existing
      const updated = data.map(edu => edu.id === editingId ? newEducation : edu);
      onUpdate(updated);
    } else {
      // Add new
      onUpdate([...data, newEducation]);
    }

    setEditingId(null);
    setIsAdding(false);
    reset();
  };

  const handleDelete = (id: string) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    reset();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Education
          </h2>
          <Button onClick={handleAdd} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Education
          </Button>
        </div>

        {/* Education List */}
        <div className="space-y-4">
          {data.map((education) => (
            <div key={education.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {education.degree} in {education.field}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{education.institution}</p>
                  <p className="text-sm text-gray-500">
                    {education.startDate} - {education.endDate}
                    {education.gpa && ` • GPA: ${education.gpa}`}
                  </p>
                  {education.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {education.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(education)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(education.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit(handleSave)} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
              {editingId ? 'Edit Education' : 'Add Education'}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  {...register('institution', { required: 'Institution is required' })}
                  placeholder="University/School name"
                  className="mt-1"
                />
                {errors.institution && (
                  <p className="text-red-500 text-sm mt-1">{errors.institution.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  {...register('degree', { required: 'Degree is required' })}
                  placeholder="Bachelor's, Master's, etc."
                  className="mt-1"
                />
                {errors.degree && (
                  <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="field">Field of Study *</Label>
                <Input
                  id="field"
                  {...register('field', { required: 'Field is required' })}
                  placeholder="Computer Science, etc."
                  className="mt-1"
                />
                {errors.field && (
                  <p className="text-red-500 text-sm mt-1">{errors.field.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gpa">GPA (Optional)</Label>
                <Input
                  id="gpa"
                  {...register('gpa')}
                  placeholder="3.8/4.0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="mt-1"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="month"
                  {...register('endDate', { required: 'End date is required' })}
                  className="mt-1"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Relevant coursework, achievements, etc."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                {editingId ? 'Update' : 'Add'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
