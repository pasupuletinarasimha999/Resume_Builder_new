import type { SectionConfig } from '@/types/resume';

export const resumeSections: SectionConfig[] = [
  { key: 'personalInfo', label: 'Basic' },
  { key: 'education', label: 'Education' },
  { key: 'workExperience', label: 'Work Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'skills', label: 'Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'socialMedia', label: 'Social Media' },
  { key: 'awards', label: 'Awards' },
  { key: 'certifications', label: 'Certification' },
  { key: 'publications', label: 'Publications' },
  { key: 'volunteering', label: 'Volunteering' },
  { key: 'competitions', label: 'Competitions' },
  { key: 'conferences', label: 'Conferences and Workshops' },
  { key: 'testScores', label: 'Test Scores' },
  { key: 'patents', label: 'Patents' },
  { key: 'scholarships', label: 'Scholarships' },
  { key: 'extraCurricular', label: 'Extra Curricular Activities' },
];

export const defaultResumeData = {
  personalInfo: {
    fullName: 'Jack',
    email: 'jack@haveloc.com',
    phone: '987654321',
    location: 'Hyderabad, India',
    summary: "I am Jack a tech enthusiast with a passion for innovation. As the developer behind wall I've created a groundbreaking software solution that revolutionizes. With a focus on streamlining and optimizing workflows, It brings efficiency and effectiveness to the world of animals."
  },
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  languages: [],
  socialMedia: [],
  awards: [],
  certifications: [],
  publications: [],
  volunteering: [],
  competitions: [],
  conferences: [],
  testScores: [],
  patents: [],
  scholarships: [],
  extraCurricular: [],
};

export const sampleResumeData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: "Experienced Software Engineer with 5+ years developing scalable web applications. Passionate about clean code, user experience, and innovative solutions. Led teams of 4+ developers and increased application performance by 40%."
  },
  education: [
    {
      id: 'edu1',
      institution: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2017-09',
      endDate: '2021-05',
      gpa: '3.8/4.0',
      description: 'Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems'
    },
    {
      id: 'edu2',
      institution: 'FreeCodeCamp',
      degree: 'Full Stack Developer',
      field: 'Web Development',
      startDate: '2020-01',
      endDate: '2020-06',
      gpa: '',
      description: 'Completed 300+ hours of hands-on programming projects'
    }
  ],
  workExperience: [
    {
      id: 'work1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      startDate: '2022-03',
      endDate: '2024-12',
      current: true,
      location: 'San Francisco, CA',
      description: 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored 3 junior developers and conducted code reviews.'
    },
    {
      id: 'work2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: '2021-06',
      endDate: '2022-02',
      current: false,
      location: 'Remote',
      description: 'Built responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UI components. Optimized database queries resulting in 30% faster load times.'
    }
  ],
  projects: [
    {
      id: 'proj1',
      name: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT'],
      startDate: '2023-01',
      endDate: '2023-03',
      url: 'https://demo-ecommerce.com',
      github: 'https://github.com/alexjohnson/ecommerce'
    },
    {
      id: 'proj2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates using Socket.io and Redux for state management.',
      technologies: ['React', 'Redux', 'Socket.io', 'Express.js', 'PostgreSQL'],
      startDate: '2022-08',
      endDate: '2022-10',
      url: '',
      github: 'https://github.com/alexjohnson/taskmanager'
    }
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript', level: 'Expert', category: 'Programming Languages' },
    { id: 'skill2', name: 'TypeScript', level: 'Advanced', category: 'Programming Languages' },
    { id: 'skill3', name: 'Python', level: 'Intermediate', category: 'Programming Languages' },
    { id: 'skill4', name: 'React', level: 'Expert', category: 'Frontend' },
    { id: 'skill5', name: 'Vue.js', level: 'Intermediate', category: 'Frontend' },
    { id: 'skill6', name: 'Node.js', level: 'Advanced', category: 'Backend' },
    { id: 'skill7', name: 'Express.js', level: 'Advanced', category: 'Backend' },
    { id: 'skill8', name: 'MongoDB', level: 'Intermediate', category: 'Databases' },
    { id: 'skill9', name: 'PostgreSQL', level: 'Intermediate', category: 'Databases' }
  ],
  languages: [
    { id: 'lang1', name: 'English', proficiency: 'Native' },
    { id: 'lang2', name: 'Spanish', proficiency: 'Conversational' },
    { id: 'lang3', name: 'French', proficiency: 'Basic' }
  ],
  socialMedia: [],
  awards: [],
  certifications: [],
  publications: [],
  volunteering: [],
  competitions: [],
  conferences: [],
  testScores: [],
  patents: [],
  scholarships: [],
  extraCurricular: [],
};
