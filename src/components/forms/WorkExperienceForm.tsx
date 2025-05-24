'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { WorkExperience } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface WorkExperienceFormProps {
  data: WorkExperience[];
  onUpdate: (data: WorkExperience[]) => void;
}

export function WorkExperienceForm({ data, onUpdate }: WorkExperienceFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<WorkExperience>();

  const isCurrent = watch('current', false);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: ''
    });
  };

  const handleEdit = (experience: WorkExperience) => {
    setEditingId(experience.id);
    setIsAdding(false);
    reset(experience);
  };

  const handleSave = (formData: WorkExperience) => {
    const newExperience = {
      ...formData,
      id: editingId || `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    if (editingId) {
      // Update existing
      const updated = data.map(exp => exp.id === editingId ? newExperience : exp);
      onUpdate(updated);
    } else {
      // Add new
      onUpdate([...data, newExperience]);
    }

    setEditingId(null);
    setIsAdding(false);
    reset();
  };

  const handleDelete = (id: string) => {
    onUpdate(data.filter(exp => exp.id !== id));
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
            Work Experience
          </h2>
          <Button onClick={handleAdd} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Experience List */}
        <div className="space-y-4">
          {data.map((experience) => (
            <div key={experience.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {experience.position}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {experience.company} {experience.location && `• ${experience.location}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                  </p>
                  {experience.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {experience.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(experience.id)}
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
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="position">Position/Job Title *</Label>
                <Input
                  id="position"
                  {...register('position', { required: 'Position is required' })}
                  placeholder="Software Engineer, Manager, etc."
                  className="mt-1"
                />
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  {...register('company', { required: 'Company is required' })}
                  placeholder="Company name"
                  className="mt-1"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="City, State/Country"
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

              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="current"
                    {...register('current')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="current">I currently work here</Label>
                </div>
              </div>

              {!isCurrent && (
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="month"
                    {...register('endDate', {
                      required: !isCurrent ? 'End date is required' : false
                    })}
                    className="mt-1"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your responsibilities, achievements, and key accomplishments..."
                rows={4}
                className="mt-1"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
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
