'use client';

import type { ResumeData } from '@/types/resume';
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
        backgroundColor: '#ffffff'
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
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
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
      <div
        ref={resumeRef}
        className="p-8 bg-white text-black min-h-full resume-preview"
        style={{ minHeight: '800px' }}
      >
        {/* Header */}
        <div className="text-center mb-8 border-b border-gray-300 pb-6">
          <h1 className="text-3xl font-bold mb-2">
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.email && data.personalInfo.phone && <span>|</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.phone && data.personalInfo.location && <span>|</span>}
            {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary Section */}
        {data.personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900">SUMMARY</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience Section */}
        {data.workExperience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900">WORK EXPERIENCE</h2>
            {data.workExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <p className="text-sm text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900">EDUCATION</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900">PROJECTS</h2>
            {data.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className="text-sm text-gray-600">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                {project.technologies.length > 0 && (
                  <div className="text-sm text-gray-600 mb-2">
                    Technologies: {project.technologies.join(', ')}
                  </div>
                )}
                <p className="text-sm text-gray-700">{project.description}</p>
                {(project.url || project.github) && (
                  <div className="text-sm text-blue-600 mt-1">
                    {project.url && <span>Live: {project.url}</span>}
                    {project.url && project.github && <span> | </span>}
                    {project.github && <span>GitHub: {project.github}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900">SKILLS</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.reduce((acc: { name: string; skills: typeof data.skills }[], skill) => {
                const existingCategory = acc.find(cat => cat.name === skill.category);
                if (existingCategory) {
                  existingCategory.skills.push(skill);
                } else {
                  acc.push({ name: skill.category, skills: [skill] });
                }
                return acc;
              }, []).map((category) => (
                <div key={category.name}>
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  <div className="text-sm text-gray-700">
                    {category.skills.map((skill) => skill.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {data.languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900">LANGUAGES</h2>
            <div className="grid grid-cols-2 gap-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="text-sm text-gray-700">
                  <span className="font-medium">{lang.name}</span> - {lang.proficiency}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional sections can be added here as needed */}
      </div>
    </div>
  );
}
