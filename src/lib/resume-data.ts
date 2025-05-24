import type { ResumeData } from '@/types/resume';

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Jack',
    email: 'jack@haveloc.com',
    phone: '987654321',
    location: 'Hyderabad, India',
    summary: "I am Jack a tech enthusiast with a passion for innovation. As the developer behind wall I've created a groundbreaking software solution that revolutionizes. With a focus on streamlining and optimizing workflows, It brings efficiency and effectiveness to the world of animals."
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  languages: [],
  links: [],
  awards: [],
  certifications: [],
  publications: [],
  volunteering: [],
  competitions: [],
  conferences: [],
  testScores: [],
  patents: [],
  scholarships: [],
  extracurricular: []
};

export const sectionConfig = [
  { key: 'personalInfo' as const, title: 'Basic', icon: 'https://ext.same-assets.com/3442189925/3783633550.svg' },
  { key: 'education' as const, title: 'Education', icon: 'https://ext.same-assets.com/3442189925/2563901416.svg' },
  { key: 'experience' as const, title: 'Work Experience', icon: 'https://ext.same-assets.com/3442189925/548389142.svg' },
  { key: 'projects' as const, title: 'Projects', icon: 'https://ext.same-assets.com/3442189925/260646423.svg' },
  { key: 'skills' as const, title: 'Skills', icon: 'https://ext.same-assets.com/3442189925/4061061103.svg' },
  { key: 'languages' as const, title: 'Languages', icon: 'https://ext.same-assets.com/3442189925/2320907649.svg' },
  { key: 'links' as const, title: 'Social Media', icon: 'https://ext.same-assets.com/3442189925/1998606599.svg' },
  { key: 'awards' as const, title: 'Awards', icon: 'https://ext.same-assets.com/3442189925/1367661487.svg' },
  { key: 'certifications' as const, title: 'Certification', icon: 'https://ext.same-assets.com/3442189925/2838098675.svg' },
  { key: 'publications' as const, title: 'Publications', icon: 'https://ext.same-assets.com/3442189925/2018733539.svg' },
  { key: 'volunteering' as const, title: 'Volunteering', icon: 'https://ext.same-assets.com/3442189925/2067545548.svg' },
  { key: 'competitions' as const, title: 'Competitions', icon: 'https://ext.same-assets.com/3442189925/4252861238.svg' },
  { key: 'conferences' as const, title: 'Conferences and Workshops', icon: 'https://ext.same-assets.com/3442189925/3301625649.svg' },
  { key: 'testScores' as const, title: 'Test Scores', icon: 'https://ext.same-assets.com/3442189925/3394157246.svg' },
  { key: 'patents' as const, title: 'Patents', icon: 'https://ext.same-assets.com/3442189925/1787624407.svg' },
  { key: 'scholarships' as const, title: 'Scholarships', icon: 'https://ext.same-assets.com/3442189925/2116589346.svg' },
  { key: 'extracurricular' as const, title: 'Extra Curricular Activities', icon: 'https://ext.same-assets.com/3442189925/1743763944.svg' }
];

export const exportResumeData = (data: ResumeData) => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-${data.personalInfo.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importResumeData = (file: File): Promise<ResumeData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result) as ResumeData;
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
