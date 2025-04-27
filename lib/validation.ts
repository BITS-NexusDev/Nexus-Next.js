import { User, Internship, Application } from './types'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function validateUser(user: Partial<User>): void {
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new ValidationError('Invalid email format')
  }
  if (!user.password || user.password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long')
  }
  if (!user.userType || !['student', 'startup'].includes(user.userType)) {
    throw new ValidationError('Invalid user type')
  }
}

export function validateInternship(internship: Partial<Internship>): void {
  if (!internship.title || internship.title.trim().length === 0) {
    throw new ValidationError('Internship title is required')
  }
  if (!internship.description || internship.description.trim().length === 0) {
    throw new ValidationError('Internship description is required')
  }
  if (!internship.startupId) {
    throw new ValidationError('Startup ID is required')
  }
  if (!internship.type || !['Full-time', 'Part-time'].includes(internship.type)) {
    throw new ValidationError('Invalid internship type')
  }
  if (!internship.status || !['active', 'closed'].includes(internship.status)) {
    throw new ValidationError('Invalid internship status')
  }
}

export function validateApplication(application: Partial<Application>): void {
  if (!application.studentId) {
    throw new ValidationError('Student ID is required')
  }
  if (!application.internshipId) {
    throw new ValidationError('Internship ID is required')
  }
  if (!application.status || !['pending', 'accepted', 'rejected'].includes(application.status)) {
    throw new ValidationError('Invalid application status')
  }
} 