'use client';

import type { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { personalInfo, education, experience, projects, skills, languages, links, awards, certifications } = resumeData;

  return (
    <div className="p-8 bg-white text-black min-h-full resume-preview">
      {/* Header */}
      <div className="text-center mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.name || 'Your Name'}</h1>
        <div className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
          {personalInfo.email && (
            <>
              <span>{personalInfo.email}</span>
              {(personalInfo.phone || personalInfo.location) && <span>|</span>}
            </>
          )}
          {personalInfo.phone && (
            <>
              <span>{personalInfo.phone}</span>
              {personalInfo.location && <span>|</span>}
            </>
          )}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>

        {/* Links */}
        {links.length > 0 && (
          <div className="mt-2 text-sm text-blue-600">
            {links.map((link, index) => (
              <span key={link.id}>
                {link.url}
                {index < links.length - 1 && ' | '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">SUMMARY</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">SKILLS</h2>
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.id} className="text-sm">
                <span className="font-semibold text-gray-900">{skill.category || 'General'}:</span>
                <span className="text-gray-700 ml-2">{skill.name}</span>
                {skill.level && <span className="text-gray-500 ml-1">({skill.level})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">WORK EXPERIENCE</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{exp.startDate} - {exp.endDate}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm text-gray-700 mt-2">
                    {exp.description.split('\n').map((line, index) => (
                      <p key={`${exp.id}-line-${index}`} className="mb-1">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">EDUCATION</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{edu.startDate} - {edu.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">PROJECTS</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <div className="text-sm text-gray-600">
                    {project.startDate} - {project.endDate}
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <p className="text-sm text-blue-600">{project.link}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">CERTIFICATIONS</h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-700">{cert.issuer}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{cert.issueDate}</p>
                  {cert.expiryDate && <p>Expires: {cert.expiryDate}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">LANGUAGES</h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="font-semibold text-gray-900">{lang.name}</span>
                {lang.proficiency && (
                  <span className="text-gray-600 ml-1">({lang.proficiency})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-gray-900">AWARDS</h2>
          <div className="space-y-3">
            {awards.map((award) => (
              <div key={award.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{award.title}</h3>
                  <p className="text-sm text-gray-700">{award.issuer}</p>
                  {award.description && (
                    <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {award.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!personalInfo.name && !personalInfo.email && (
        <div className="text-center py-12 text-gray-400">
          <p>Fill out the form to see your resume preview here</p>
        </div>
      )}
    </div>
  );
}
