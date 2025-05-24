import type { ResumeData } from '@/types/resume';

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced Full-Stack Developer with 5+ years of experience building scalable web applications. Passionate about creating efficient, maintainable code and delivering exceptional user experiences.'
  },
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: "Bachelor's in Computer Science",
      fieldOfStudy: 'Computer Science',
      startDate: '08/2016',
      endDate: '05/2020',
      description: 'Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems.'
    }
  ],
  experience: [
    {
      id: '1',
      position: 'Senior Full-Stack Developer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '06/2022',
      endDate: 'Present',
      current: true,
      description: '• Led development of microservices architecture serving 1M+ users\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews\n• Technologies: React, Node.js, PostgreSQL, AWS'
    },
    {
      id: '2',
      position: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Palo Alto, CA',
      startDate: '08/2020',
      endDate: '05/2022',
      current: false,
      description: '• Built responsive web applications using React and TypeScript\n• Collaborated with design team to implement pixel-perfect UIs\n• Optimized application performance improving load times by 40%'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Docker'],
      link: 'https://github.com/johndoe/ecommerce-platform',
      startDate: '01/2023',
      endDate: '03/2023'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Real-time collaborative task management application with drag-and-drop functionality.',
      technologies: ['Vue.js', 'Express.js', 'Socket.io', 'PostgreSQL'],
      link: 'https://taskmanager-demo.com',
      startDate: '09/2022',
      endDate: '11/2022'
    }
  ],
  skills: [
    {
      id: '1',
      name: 'JavaScript',
      level: 'Expert',
      category: 'Programming Languages'
    },
    {
      id: '2',
      name: 'React',
      level: 'Advanced',
      category: 'Frontend'
    },
    {
      id: '3',
      name: 'Node.js',
      level: 'Advanced',
      category: 'Backend'
    },
    {
      id: '4',
      name: 'PostgreSQL',
      level: 'Intermediate',
      category: 'Database'
    },
    {
      id: '5',
      name: 'AWS',
      level: 'Intermediate',
      category: 'Cloud'
    }
  ],
  languages: [
    {
      id: '1',
      name: 'English',
      proficiency: 'Native'
    },
    {
      id: '2',
      name: 'Spanish',
      proficiency: 'Proficient'
    },
    {
      id: '3',
      name: 'French',
      proficiency: 'Basic'
    }
  ],
  links: [
    {
      id: '1',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/johndoe',
      username: 'johndoe'
    },
    {
      id: '2',
      platform: 'GitHub',
      url: 'https://github.com/johndoe',
      username: 'johndoe'
    },
    {
      id: '3',
      platform: 'Portfolio',
      url: 'https://johndoe.dev',
      username: 'johndoe'
    }
  ],
  awards: [
    {
      id: '1',
      title: 'Employee of the Year',
      issuer: 'Tech Solutions Inc.',
      date: '12/2023',
      description: 'Recognized for outstanding performance and leadership in delivering critical projects.'
    },
    {
      id: '2',
      title: 'Best Capstone Project',
      issuer: 'UC Berkeley',
      date: '05/2020',
      description: 'Awarded for innovative machine learning solution for traffic optimization.'
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '03/2023',
      expiryDate: '03/2026',
      credentialId: 'AWS-CSA-123456',
      url: 'https://aws.amazon.com/certification/verify'
    },
    {
      id: '2',
      name: 'React Developer Certification',
      issuer: 'Meta',
      issueDate: '01/2022',
      expiryDate: '',
      credentialId: 'META-REACT-789',
      url: 'https://certificates.meta.com/verify'
    }
  ],
  publications: [],
  volunteering: [],
  competitions: [],
  conferences: [],
  testScores: [],
  patents: [],
  scholarships: [],
  extracurricular: []
};
