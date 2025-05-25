'use client';

import { useState } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ProjectsForm() {
  const { resumeData, addProject, removeProject } = useResume();
  const { projects } = resumeData;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    url: '',
    github: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.startDate) {
      addProject({
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
      });
      setFormData({
        name: '',
        description: '',
        technologies: '',
        startDate: '',
        endDate: '',
        url: '',
        github: ''
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
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
              placeholder="Describe what the project does and your role..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => handleChange('technologies', e.target.value)}
              placeholder="React, Node.js, MongoDB, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                placeholder="MM/YYYY or leave blank if ongoing"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="url">Live Demo URL (Optional)</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://yourproject.com"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL (Optional)</Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Add Project</Button>
        </form>

        {projects.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Added Projects:</h3>
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <p className="text-sm text-gray-500">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </p>
                    {project.technologies.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProject(project.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
