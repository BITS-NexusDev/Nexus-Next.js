import { DataService } from './data-service'
import { User, Internship, Application } from './types'

const dataService = typeof window !== 'undefined' ? DataService.getInstance() : null

export function initializeMockData(): void {
  if (typeof window === 'undefined' || !dataService) {
    return
  }

  // Check if data already exists
  if (localStorage.getItem('dataInitialized')) {
    return
  }

  // Create mock startups
  const startup1 = dataService.createUser({
    email: 'techgenius@example.com',
    password: 'password123',
    userType: 'startup',
    name: 'TechGenius Solutions',
    onboardingComplete: true,
    startupData: {
      official_name: 'TechGenius Solutions',
      website_link: 'https://techgenius.com',
      year_of_incorporation: '2020',
      location_city: 'Bangalore',
      founders_name: 'Rahul Sharma, Priya Patel',
      summary: 'TechGenius Solutions is a cutting-edge AI and machine learning startup focused on developing innovative solutions for businesses.',
      domain: 'Artificial Intelligence',
      contact_mail: 'contact@techgenius.com',
      contact_number: '+91 9876543210',
      logo: '/mock-logos/techgenius.png'
    }
  })

  const startup2 = dataService.createUser({
    email: 'greenenergy@example.com',
    password: 'password123',
    userType: 'startup',
    name: 'GreenEnergy Innovations',
    onboardingComplete: true,
    startupData: {
      official_name: 'GreenEnergy Innovations',
      website_link: 'https://greenenergy.com',
      year_of_incorporation: '2019',
      location_city: 'Mumbai',
      founders_name: 'Amit Kumar, Neha Singh',
      summary: 'GreenEnergy Innovations is revolutionizing the renewable energy sector with our advanced solar panel technology.',
      domain: 'Renewable Energy',
      contact_mail: 'info@greenenergy.com',
      contact_number: '+91 8765432109',
      logo: '/mock-logos/greenenergy.png'
    }
  })

  // Create mock students
  const student1 = dataService.createUser({
    email: 'rahul@example.com',
    password: 'password123',
    userType: 'student',
    name: 'Rahul Sharma',
    onboardingComplete: true,
    studentData: {
      college: 'BITS Pilani',
      degree: 'B.Tech',
      year: '3',
      skills: ['React', 'Node.js', 'Python'],
      bio: 'Passionate about web development and AI.'
    }
  })

  const student2 = dataService.createUser({
    email: 'priya@example.com',
    password: 'password123',
    userType: 'student',
    name: 'Priya Patel',
    onboardingComplete: true,
    studentData: {
      college: 'BITS Pilani',
      degree: 'M.Tech',
      year: '1',
      skills: ['Data Science', 'Machine Learning', 'Python'],
      bio: 'Aspiring data scientist with a passion for solving real-world problems.'
    }
  })

  // Create mock internships
  const internship1 = dataService.createInternship({
    startupId: startup1.id,
    title: 'Frontend Developer Intern',
    description: 'We\'re looking for a passionate frontend developer intern to join our team.',
    location: 'Remote',
    type: 'Full-time',
    duration: '3 months',
    stipend: '₹20,000/month',
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    industry: 'Technology',
    status: 'active'
  })

  const internship2 = dataService.createInternship({
    startupId: startup1.id,
    title: 'Backend Developer Intern',
    description: 'Join our backend team to develop robust APIs and services.',
    location: 'Bangalore',
    type: 'Full-time',
    duration: '6 months',
    stipend: '₹25,000/month',
    skills: ['Node.js', 'Express', 'MongoDB'],
    industry: 'Technology',
    status: 'active'
  })

  const internship3 = dataService.createInternship({
    startupId: startup2.id,
    title: 'Data Analyst Intern',
    description: 'Help us analyze healthcare data to derive meaningful insights.',
    location: 'Remote',
    type: 'Part-time',
    duration: '3 months',
    stipend: '₹15,000/month',
    skills: ['Python', 'SQL', 'Data Visualization'],
    industry: 'Healthcare',
    status: 'active'
  })

  // Create mock applications
  dataService.createApplication({
    studentId: student1.id,
    internshipId: internship1.id,
    status: 'pending',
    coverLetter: 'I am excited to apply for the Frontend Developer position...'
  })

  dataService.createApplication({
    studentId: student2.id,
    internshipId: internship3.id,
    status: 'pending',
    coverLetter: 'I am interested in the Data Analyst position...'
  })

  // Mark data as initialized
  localStorage.setItem('dataInitialized', 'true')
} 