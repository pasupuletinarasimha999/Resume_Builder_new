'use client';

import { useResume } from '@/context/ResumeContext';
import { Separator } from '@/components/ui/separator';

export function ResumePreview() {
  const { resumeData } = useResume();
  const { personalInfo, education, workExperience, projects, skills } = resumeData;

  return (
    <div className="a4-preview resume-font">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2 text-black">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-sm text-gray-700 flex items-center justify-center gap-2 flex-wrap">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {(personalInfo.email || personalInfo.phone || personalInfo.location) && personalInfo.linkedin && <span>|</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <Separator className="mb-6 border-gray-400" />

      {/* Professional Summary */}
      {personalInfo.summary && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-black uppercase">PROFESSIONAL SUMMARY</h2>
            <p className="text-sm text-gray-800 leading-relaxed">{personalInfo.summary}</p>
          </div>
          <Separator className="mb-6 border-gray-400" />
        </>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-black uppercase">WORK EXPERIENCE</h2>
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-black">{exp.position}</h3>
                    <span className="text-sm text-gray-700">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-800">{exp.company}</h4>
                    {exp.location && <span className="text-sm text-gray-600">{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator className="mb-6 border-gray-400" />
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-black uppercase">EDUCATION</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-black">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-sm text-gray-700">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">{edu.institution}</h4>
                  {edu.gpa && (
                    <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-gray-700 leading-relaxed mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator className="mb-6 border-gray-400" />
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-black uppercase">PROJECTS</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-black">{project.name}</h3>
                    <span className="text-sm text-gray-700">
                      {project.startDate} {project.endDate && `- ${project.endDate}`}
                    </span>
                  </div>
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                  )}
                  <div className="flex gap-4 mt-1">
                    {project.url && (
                      <a href={project.url} className="text-sm text-blue-600 hover:underline">
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} className="text-sm text-blue-600 hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="mb-6 border-gray-400" />
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-black uppercase">SKILLS</h2>
          <div className="grid grid-cols-1 gap-2">
            {Array.from(new Set(skills.map(s => s.category))).map(category => (
              <div key={category}>
                <span className="text-sm font-semibold text-black">{category}: </span>
                <span className="text-sm text-gray-700">
                  {skills
                    .filter(s => s.category === category)
                    .map(s => s.name)
                    .join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
