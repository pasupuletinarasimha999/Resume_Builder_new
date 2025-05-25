'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/resume';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function ProjectsForm() {
  const { state, dispatch } = useResume();
  const { projects } = state.data;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    url: '',
    github: ''
  });
  const [currentTech, setCurrentTech] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      url: '',
      github: ''
    });
    setCurrentTech('');
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: { id: editingId, data: formData }
      });
    } else {
      dispatch({
        type: 'ADD_PROJECT',
        payload: { ...formData, id: Date.now().toString() }
      });
    }

    resetForm();
  };

  const handleEdit = (item: Project) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  const handleChange = (field: keyof Omit<Project, 'id' | 'technologies'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTechnology = () => {
    if (currentTech.trim() && !formData.technologies.includes(currentTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Project title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the project, your role, and key achievements..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="technologies"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={handleTechKeyPress}
                placeholder="Add technology (press Enter)"
              />
              <Button type="button" onClick={addTechnology} size="sm">
                Add
              </Button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="url">Live URL (Optional)</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://project-demo.com"
              />
            </div>

            <div>
              <Label htmlFor="github">GitHub URL (Optional)</Label>
              <Input
                id="github"
                type="url"
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingId ? 'Update Project' : 'Add Project'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Projects List */}
      {projects.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Projects</h3>
          <div className="space-y-4">
            {projects.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.startDate} - {item.endDate}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                    {item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {(item.url || item.github) && (
                      <div className="flex gap-2 text-sm">
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {item.github && (
                          <a
                            href={item.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
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
