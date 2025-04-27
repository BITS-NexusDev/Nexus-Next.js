export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  password: string;
  userType: 'student' | 'startup';
  onboardingComplete: boolean;
  studentData?: StudentData;
  startupData?: StartupData;
}

export interface StudentData {
  college: string;
  degree: string;
  year: string;
  skills: string[];
  bio: string;
}

export interface StartupData {
  official_name: string;
  website_link: string;
  year_of_incorporation: string;
  location_city: string;
  founders_name: string;
  summary: string;
  domain: string;
  contact_mail: string;
  contact_number: string;
  logo: string;
}

export interface Internship extends BaseEntity {
  startupId: string;
  title: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time';
  duration: string;
  stipend: string;
  skills: string[];
  industry: string;
  status: 'active' | 'closed';
}

export interface Application extends BaseEntity {
  studentId: string;
  internshipId: string;
  status: 'pending' | 'accepted' | 'rejected';
  coverLetter?: string;
  resume?: string;
} 