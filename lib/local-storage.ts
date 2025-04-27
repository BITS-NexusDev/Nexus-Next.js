import { DataService } from './data-service'
import { User, Internship, Application } from './types'

const dataService = typeof window !== 'undefined' ? DataService.getInstance() : null

// Helper functions for local storage operations

// Users
export function createUser(user: Omit<User, keyof BaseEntity>): User {
  if (!dataService) {
    throw new Error('Data service is not available in server-side rendering')
  }
  return dataService.createUser(user)
}

export function updateUser(updatedUser: any) {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const updatedUsers = users.map((user: any) => (user.id === updatedUser.id ? updatedUser : user))
  localStorage.setItem("users", JSON.stringify(updatedUsers))
}

export function getUserByEmail(email: string): User | undefined {
  if (!dataService) {
    return undefined
  }
  return dataService.getUserByEmail(email)
}

export function getUserById(id: string): User | undefined {
  if (!dataService) {
    return undefined
  }
  return dataService.getUserById(id)
}

export function getAllUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

export function getAllStartups() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  return users.filter((user: any) => user.userType === "startup")
}

export function getAllStudents() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  return users.filter((user: any) => user.userType === "student")
}

// Internships
export function createInternship(internship: Omit<Internship, keyof BaseEntity>): Internship {
  if (!dataService) {
    throw new Error('Data service is not available in server-side rendering')
  }
  return dataService.createInternship(internship)
}

export function updateInternship(updatedInternship: any) {
  const internships = JSON.parse(localStorage.getItem("internships") || "[]")
  const updatedInternships = internships.map((internship: any) =>
    internship.id === updatedInternship.id ? updatedInternship : internship,
  )
  localStorage.setItem("internships", JSON.stringify(updatedInternships))
}

export function getInternshipById(id: string): Internship | undefined {
  if (!dataService) {
    return undefined
  }
  return dataService.getInternshipById(id)
}

export function getInternshipsByStartupId(startupId: string): Internship[] {
  if (!dataService) {
    return []
  }
  return dataService.getInternshipsByStartupId(startupId)
}

export function getAllInternships() {
  return JSON.parse(localStorage.getItem("internships") || "[]")
}

// Applications
export function createApplication(application: Omit<Application, keyof BaseEntity>): Application {
  if (!dataService) {
    throw new Error('Data service is not available in server-side rendering')
  }
  return dataService.createApplication(application)
}

export function updateApplication(updatedApplication: any) {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]")
  const updatedApplications = applications.map((application: any) =>
    application.id === updatedApplication.id ? updatedApplication : application,
  )
  localStorage.setItem("applications", JSON.stringify(updatedApplications))
}

export function getApplicationById(id: string): Application | undefined {
  if (!dataService) {
    return undefined
  }
  return dataService.getApplicationById(id)
}

export function getApplicationsByStudentId(studentId: string) {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]")
  return applications.filter((application: any) => application.studentId === studentId)
}

export function getApplicationsByInternshipId(internshipId: string) {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]")
  return applications.filter((application: any) => application.internshipId === internshipId)
}

export function getApplicationsByStartupId(startupId: string) {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]")
  const internships = JSON.parse(localStorage.getItem("internships") || "[]")
  const startupInternshipIds = internships
    .filter((internship: any) => internship.startupId === startupId)
    .map((internship: any) => internship.id)

  return applications.filter((application: any) => startupInternshipIds.includes(application.internshipId))
}

export function getAllApplications() {
  return JSON.parse(localStorage.getItem("applications") || "[]")
}

export function getApplicationDetails(applicationId: string) {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]")
  return applications.find((application: any) => application.id === applicationId)
}

// Initialize mock data
export function initializeMockData(): void {
  if (typeof window === 'undefined') {
    return
  }
  import('./mock-data').then(({ initializeMockData }) => {
    initializeMockData()
  })
}

// Initialize mock data when the app loads
if (typeof window !== "undefined") {
  initializeMockData()
}
