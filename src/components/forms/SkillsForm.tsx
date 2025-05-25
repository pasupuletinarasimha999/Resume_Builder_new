'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Skill } from '@/types/resume';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function SkillsForm() {
  const { state, dispatch } = useResume();
  const { skills } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 'Intermediate',
    category: ''
  });

  const skillLevels: Array<Skill['level']> = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const resetForm = () => {
    setFormData({
      name: '',
      level: 'Intermediate',
      category: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      dispatch({
        type: 'UPDATE_SKILL',
        payload: { id: editingId, data: formData }
      });
    } else {
      dispatch({
        type: 'ADD_SKILL',
        payload: { ...formData, id: Date.now().toString() }
      });
    }

    resetForm();
  };

  const handleEdit = (item: Skill) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_SKILL', payload: id });
  };

  const handleChange = (field: keyof Omit<Skill, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="JavaScript, React, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Programming, Design, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Proficiency Level</Label>
              <Select value={formData.level} onValueChange={(value: Skill['level']) => handleChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingId ? 'Update Skill' : 'Add Skill'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Skills List */}
      {skills.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skills by Category</h3>
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="ml-2 text-sm text-gray-500">({skill.level})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(skill)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(skill.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
