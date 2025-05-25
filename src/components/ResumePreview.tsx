'use client';

import { useRef } from 'react';
import { useResume } from '@/context/ResumeContext';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResumePreview() {
  const { state } = useResume();
  const { data } = state;
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

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = data.personalInfo.fullName
        ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with download button */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <Button onClick={downloadPDF} className="w-full flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* Resume Preview */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          ref={resumeRef}
          className="bg-white rounded-lg shadow-lg min-h-full resume-preview"
          style={{ width: '210mm', minHeight: '297mm' }} // A4 dimensions
        >
          <div className="p-8 text-black min-h-full">
            {/* Header */}
            <div className="text-center mb-8 border-b border-gray-300 pb-6">
              <h1 className="text-3xl font-bold mb-2">
                {data.personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.email && data.personalInfo.phone && <span>|</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {(data.personalInfo.email || data.personalInfo.phone) && data.personalInfo.location && <span>|</span>}
                {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
              </div>
            </div>

            {/* Summary */}
            {data.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">SUMMARY</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">EDUCATION</h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Work Experience */}
            {data.workExperience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">EXPERIENCE</h2>
                {data.workExperience.map((exp) => (
                  <div key={exp.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600">{exp.company} • {exp.location}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">PROJECTS</h2>
                {data.projects.map((project) => (
                  <div key={project.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        {project.startDate} - {project.endDate}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </p>
                    )}
                    {(project.url || project.github) && (
                      <div className="text-xs text-blue-600">
                        {project.url && <span>Live: {project.url}</span>}
                        {project.url && project.github && <span> | </span>}
                        {project.github && <span>GitHub: {project.github}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">SKILLS</h2>
                {Object.entries(
                  data.skills.reduce((acc, skill) => {
                    const category = skill.category || 'Other';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof data.skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category} className="mb-3 last:mb-0">
                    <p className="text-sm">
                      <strong className="text-gray-900">{category}:</strong>{' '}
                      <span className="text-gray-700">
                        {categorySkills.map(skill => `${skill.name} (${skill.level})`).join(', ')}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
