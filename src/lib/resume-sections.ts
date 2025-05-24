import { SectionConfig, ResumeData } from '@/types/resume';

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

export const defaultResumeData: ResumeData = {
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

export const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: "Senior Software Engineer with over 5+ years of experience specializing in full-stack development, microservices architecture, and cloud technologies. Proven expertise in leading cross-functional teams, optimizing application performance, and delivering scalable solutions that serve millions of users. Passionate about clean code, user experience, and implementing innovative technologies to solve complex business challenges."
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
      startDate: 'Mar 2022',
      endDate: 'Present',
      current: true,
      location: 'San Francisco, CA',
      description: '• Led development of microservices architecture serving 1M+ users, improving system scalability by 40%\n• Implemented CI/CD pipelines reducing deployment time by 60% and minimizing production issues\n• Mentored 3 junior developers and conducted comprehensive code reviews to maintain code quality\n• Designed and implemented RESTful APIs handling 10,000+ requests per minute\n• Collaborated with cross-functional teams to deliver features ahead of schedule'
    },
    {
      id: 'work2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: 'Jun 2021',
      endDate: 'Feb 2022',
      current: false,
      location: 'Remote',
      description: '• Built responsive web applications using React and Node.js, serving 50,000+ active users\n• Collaborated with design team to implement pixel-perfect UI components using modern CSS frameworks\n• Optimized database queries resulting in 30% faster load times and improved user experience\n• Implemented user authentication and authorization systems using JWT tokens\n• Developed automated testing suites achieving 90%+ code coverage'
    }
  ],
  projects: [
    {
      id: 'proj1',
      name: 'E-Commerce Platform',
      description: '• Built a full-stack e-commerce platform serving 10,000+ products with React, Node.js, and MongoDB\n• Implemented secure payment processing using Stripe API with 99.9% transaction success rate\n• Developed comprehensive admin dashboard for inventory management and analytics\n• Integrated user authentication and authorization with role-based access control\n• Achieved 95+ Google PageSpeed score through performance optimization techniques',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT', 'Redis'],
      startDate: 'Jan 2023',
      endDate: 'Mar 2023',
      url: 'https://demo-ecommerce.com',
      github: 'https://github.com/alexjohnson/ecommerce'
    },
    {
      id: 'proj2',
      name: 'Task Management System',
      description: '• Developed collaborative task management application with real-time updates for 500+ concurrent users\n• Implemented advanced filtering and search functionality using Elasticsearch\n• Built responsive UI with drag-and-drop functionality and real-time notifications\n• Designed scalable database schema supporting complex project hierarchies\n• Deployed using Docker containers with automated CI/CD pipeline',
      technologies: ['React', 'Redux', 'Socket.io', 'Express.js', 'PostgreSQL', 'Docker'],
      startDate: 'Aug 2022',
      endDate: 'Oct 2022',
      url: '',
      github: 'https://github.com/alexjohnson/taskmanager'
    }
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript', level: 'Expert' as const, category: 'Programming Languages' },
    { id: 'skill2', name: 'TypeScript', level: 'Advanced' as const, category: 'Programming Languages' },
    { id: 'skill3', name: 'Python', level: 'Intermediate' as const, category: 'Programming Languages' },
    { id: 'skill4', name: 'React', level: 'Expert' as const, category: 'Frontend' },
    { id: 'skill5', name: 'Vue.js', level: 'Intermediate' as const, category: 'Frontend' },
    { id: 'skill6', name: 'Node.js', level: 'Advanced' as const, category: 'Backend' },
    { id: 'skill7', name: 'Express.js', level: 'Advanced' as const, category: 'Backend' },
    { id: 'skill8', name: 'MongoDB', level: 'Intermediate' as const, category: 'Databases' },
    { id: 'skill9', name: 'PostgreSQL', level: 'Intermediate' as const, category: 'Databases' }
  ],
  languages: [
    { id: 'lang1', name: 'English', proficiency: 'Native' as const },
    { id: 'lang2', name: 'Spanish', proficiency: 'Conversational' as const },
    { id: 'lang3', name: 'French', proficiency: 'Basic' as const }
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
