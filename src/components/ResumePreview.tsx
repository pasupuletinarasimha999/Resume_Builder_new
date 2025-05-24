'use client';

import { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      // Create canvas from the resume element
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });

      const imgData = canvas.toDataURL('image/png');

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
      const imgX = (pdfWidth - (imgWidth * 0.264583 * ratio)) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * 0.264583 * ratio, imgHeight * 0.264583 * ratio);
      pdf.save(`${data.personalInfo.fullName || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* PDF Download Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>
        <Button
          onClick={downloadPDF}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download size={16} className="mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Resume Content */}
      <div className="overflow-y-auto" style={{ height: '800px' }}>
        <div
          ref={resumeRef}
          className="bg-white text-black p-12 font-sans"
          style={{
            width: '794px',
            minHeight: '1123px',
            fontSize: '14px',
            lineHeight: '1.4',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-black">
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="text-sm text-gray-700 mb-4">
              {[
                data.personalInfo.email,
                data.personalInfo.phone,
                data.personalInfo.location
              ].filter(Boolean).join(' | ')}
            </div>
            {/* Thick horizontal line */}
            <div className="w-full h-1 bg-black mb-6"></div>
          </div>

          {/* Summary Section */}
          {data.personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-black">Summary</h2>
              <p className="text-sm text-gray-800 leading-relaxed mb-6">
                {data.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Experience Section */}
          {data.workExperience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-black">Experience</h2>
              {data.workExperience.map((exp, index) => (
                <div key={exp.id} className="mb-6">
                  {/* Company and Date */}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-black">{exp.company}</h3>
                    <span className="text-sm text-gray-700">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {/* Position and Location */}
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-sm text-gray-800">
                      {exp.position} · Full-Time
                    </span>
                    <span className="text-sm text-gray-700">
                      {exp.location}
                    </span>
                  </div>
                  {/* Description with bullet points */}
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {exp.description.split('\n').map((line, i) => {
                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                        return (
                          <div key={i} className="ml-4 mb-1">
                            • {line.trim().replace(/^[•-]\s*/, '')}
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <p key={i} className="mb-2">{line.trim()}</p>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Section */}
          {data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-black border-b border-gray-400 pb-1">Projects</h2>
              {data.projects.map((project) => (
                <div key={project.id} className="mb-6">
                  {/* Project Name and Date */}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-black">{project.name}</h3>
                    <span className="text-sm text-gray-700">
                      {project.startDate} – {project.endDate}
                    </span>
                  </div>
                  {/* Technologies */}
                  {project.technologies.length > 0 && (
                    <div className="text-sm text-gray-700 mb-3">
                      {project.technologies.join(', ')}
                    </div>
                  )}
                  {/* Description with bullet points */}
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {project.description.split('\n').map((line, i) => {
                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                        return (
                          <div key={i} className="ml-4 mb-1">
                            • {line.trim().replace(/^[•-]\s*/, '')}
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <p key={i} className="mb-2">{line.trim()}</p>
                      ) : null;
                    })}
                  </div>
                  {/* Project Links */}
                  {(project.url || project.github) && (
                    <div className="text-sm text-blue-600 mt-2">
                      {project.url && <span>Live: {project.url}</span>}
                      {project.url && project.github && <span> | </span>}
                      {project.github && <span>GitHub: {project.github}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-black">Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  {/* Institution and Date */}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-black">{edu.institution}</h3>
                    <span className="text-sm text-gray-700">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  {/* Degree and GPA */}
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-gray-800">
                      {edu.degree} in {edu.field}
                    </span>
                    {edu.gpa && (
                      <span className="text-sm text-gray-700">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                  {/* Description */}
                  {edu.description && (
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-black">Technical Skills</h2>
              <div className="space-y-2">
                {data.skills.reduce((acc: { name: string; skills: typeof data.skills }[], skill) => {
                  const existingCategory = acc.find(cat => cat.name === skill.category);
                  if (existingCategory) {
                    existingCategory.skills.push(skill);
                  } else {
                    acc.push({ name: skill.category, skills: [skill] });
                  }
                  return acc;
                }, []).map((category) => (
                  <div key={category.name} className="mb-3">
                    <span className="text-sm font-semibold text-black mr-2">
                      {category.name}:
                    </span>
                    <span className="text-sm text-gray-800">
                      {category.skills.map((skill) => skill.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {data.languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-black">Languages</h2>
              <div className="space-y-1">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="text-sm text-gray-800">
                    <span className="font-medium">{lang.name}</span> - {lang.proficiency}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional sections can be added here following the same pattern */}
        </div>
      </div>
    </div>
  );
}
