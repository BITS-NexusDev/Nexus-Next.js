import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  user?: {
    name: string
    userType: "student" | "startup"
    studentData?: {
      college?: string
      degree?: string
    }
    startupData?: {
      official_name?: string
      domain?: string
    }
    companyName?: string
    industry?: string
  }
}

export function DashboardHeader({ heading, text, children, user }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-2 border-b border-border pb-3 sm:gap-3 sm:pb-4 md:flex-row md:items-center md:gap-4 md:pb-4">
      <div className="grid gap-1">
        {user && (
          <div className="mb-2">
            <h2 className="text-2xl font-semibold text-primary">Welcome, {user.name}</h2>
            <p className="text-sm text-muted-foreground">
              {user.userType === "student" 
                ? `${user.studentData?.college || ""} • ${user.studentData?.degree || ""}`
                : `${user.startupData?.official_name || user.companyName || ""} • ${user.startupData?.domain || user.industry || ""}`
              }
            </p>
          </div>
        )}
        <h1 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl lg:text-3xl">{heading}</h1>
        {text && <p className="text-xs sm:text-sm text-muted-foreground">{text}</p>}
      </div>
      <div className="flex w-full flex-wrap gap-1.5 sm:gap-2 sm:w-auto">
        {children}
      </div>
    </div>
  )
}
