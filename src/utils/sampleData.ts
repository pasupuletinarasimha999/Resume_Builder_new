import { ResumeData } from '@/types/resume';

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Jack Smith',
    email: 'jack@example.com',
    phone: '987654321',
    location: 'Hyderabad, India',
    summary: 'I am Jack a tech enthusiast with a passion for innovation. As the developer behind wall I\'ve created a groundbreaking software solution that revolutionizes. With a focus on streamlining and optimizing workflows, It brings efficiency and effectiveness to the world of animals.'
  },
  education: [
    {
      id: '1',
      institution: 'Indian Institute of Technology',
      degree: 'Bachelor of Technology',
      field: 'Computer Science',
      startDate: '2018-08',
      endDate: '2022-05',
      gpa: '8.5/10',
      description: 'Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering'
    }
  ],
  workExperience: [
    {
      id: '1',
      company: 'Tech Innovations Ltd',
      position: 'Senior Software Developer',
      location: 'Hyderabad, India',
      startDate: '2022-06',
      endDate: '2024-01',
      current: false,
      description: 'Led development of web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions. Implemented CI/CD pipelines and improved deployment efficiency by 40%.'
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      startDate: '2024-02',
      endDate: '',
      current: true,
      description: 'Developing scalable web applications using modern technologies. Working on microservices architecture and implementing best practices for code quality and performance optimization.'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a full-featured e-commerce platform with user authentication, payment processing, and admin dashboard. Implemented responsive design and optimized for performance.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS'],
      startDate: '2023-01',
      endDate: '2023-06',
      url: 'https://ecommerce-demo.com',
      github: 'https://github.com/jack/ecommerce-platform'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates, team collaboration features, and advanced filtering options.',
      technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io'],
      startDate: '2023-07',
      endDate: '2023-12',
      url: 'https://taskmanager-app.com',
      github: 'https://github.com/jack/task-manager'
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
      name: 'MongoDB',
      level: 'Intermediate',
      category: 'Databases'
    },
    {
      id: '5',
      name: 'AWS',
      level: 'Intermediate',
      category: 'Cloud Platforms'
    },
    {
      id: '6',
      name: 'Git',
      level: 'Advanced',
      category: 'Tools'
    }
  ]
};
