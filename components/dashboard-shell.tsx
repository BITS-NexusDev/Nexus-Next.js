import type React from "react"
interface DashboardShellProps {
  children?: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <div className="container flex-1 space-y-3 p-3 pt-4 sm:space-y-4 sm:p-4 sm:pt-6 md:space-y-6 md:p-6 md:pt-8">
        <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-6">{children}</div>
      </div>
    </div>
  )
}
