import { User, Internship, Application, BaseEntity } from './types'
import { validateUser, validateInternship, validateApplication, ValidationError } from './validation'

export class DataService {
  private static instance: DataService
  private readonly STORAGE_KEYS = {
    USERS: 'users',
    INTERNSHIPS: 'internships',
    APPLICATIONS: 'applications',
    LAST_CLEANUP: 'lastCleanup'
  }
  private readonly CLEANUP_INTERVAL = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeStorage()
      this.scheduleCleanup()
    }
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  private initializeStorage(): void {
    const keys = Object.values(this.STORAGE_KEYS)
    keys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]))
      }
    })
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getData<T>(key: string): T[] {
    if (typeof window === 'undefined') {
      return []
    }
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return []
    }
  }

  private setData<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') {
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error writing to ${key} in localStorage:`, error)
      throw new Error(`Failed to save data to ${key}`)
    }
  }

  private addTimestamps<T extends BaseEntity>(entity: Omit<T, keyof BaseEntity>): T {
    const now = new Date().toISOString()
    return {
      ...entity,
      id: this.generateId(entity.userType || 'entity'),
      createdAt: now,
      updatedAt: now
    } as T
  }

  // User operations
  public createUser(userData: Omit<User, keyof BaseEntity>): User {
    validateUser(userData)
    const users = this.getData<User>(this.STORAGE_KEYS.USERS)
    const newUser = this.addTimestamps<User>(userData)
    users.push(newUser)
    this.setData(this.STORAGE_KEYS.USERS, users)
    return newUser
  }

  public getUserByEmail(email: string): User | undefined {
    const users = this.getData<User>(this.STORAGE_KEYS.USERS)
    return users.find(user => user.email === email)
  }

  public getUserById(id: string): User | undefined {
    const users = this.getData<User>(this.STORAGE_KEYS.USERS)
    return users.find(user => user.id === id)
  }

  // Internship operations
  public createInternship(internshipData: Omit<Internship, keyof BaseEntity>): Internship {
    validateInternship(internshipData)
    const internships = this.getData<Internship>(this.STORAGE_KEYS.INTERNSHIPS)
    const newInternship = this.addTimestamps<Internship>(internshipData)
    internships.push(newInternship)
    this.setData(this.STORAGE_KEYS.INTERNSHIPS, internships)
    return newInternship
  }

  public getInternshipById(id: string): Internship | undefined {
    const internships = this.getData<Internship>(this.STORAGE_KEYS.INTERNSHIPS)
    return internships.find(internship => internship.id === id)
  }

  public getInternshipsByStartupId(startupId: string): Internship[] {
    const internships = this.getData<Internship>(this.STORAGE_KEYS.INTERNSHIPS)
    return internships.filter(internship => internship.startupId === startupId)
  }

  // Application operations
  public createApplication(applicationData: Omit<Application, keyof BaseEntity>): Application {
    validateApplication(applicationData)
    const applications = this.getData<Application>(this.STORAGE_KEYS.APPLICATIONS)
    const newApplication = this.addTimestamps<Application>(applicationData)
    applications.push(newApplication)
    this.setData(this.STORAGE_KEYS.APPLICATIONS, applications)
    return newApplication
  }

  public getApplicationById(id: string): Application | undefined {
    const applications = this.getData<Application>(this.STORAGE_KEYS.APPLICATIONS)
    return applications.find(application => application.id === id)
  }

  // Cleanup operations
  private scheduleCleanup(): void {
    if (typeof window === 'undefined') {
      return
    }
    const lastCleanup = localStorage.getItem(this.STORAGE_KEYS.LAST_CLEANUP)
    const now = Date.now()

    if (!lastCleanup || now - parseInt(lastCleanup) > this.CLEANUP_INTERVAL) {
      this.cleanup()
      localStorage.setItem(this.STORAGE_KEYS.LAST_CLEANUP, now.toString())
    }
  }

  private cleanup(): void {
    if (typeof window === 'undefined') {
      return
    }
    try {
      // Remove closed internships older than 6 months
      const internships = this.getData<Internship>(this.STORAGE_KEYS.INTERNSHIPS)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const activeInternships = internships.filter(internship => {
        const createdDate = new Date(internship.createdAt)
        return internship.status === 'active' || createdDate > sixMonthsAgo
      })

      this.setData(this.STORAGE_KEYS.INTERNSHIPS, activeInternships)

      // Remove applications for deleted internships
      const applications = this.getData<Application>(this.STORAGE_KEYS.APPLICATIONS)
      const activeInternshipIds = new Set(activeInternships.map(i => i.id))
      const activeApplications = applications.filter(app => activeInternshipIds.has(app.internshipId))

      this.setData(this.STORAGE_KEYS.APPLICATIONS, activeApplications)
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  }
} 