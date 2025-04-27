"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, LogOut, Plus, User } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getApplicationsByStartupId, getInternshipsByStartupId } from "@/lib/local-storage"

export default function StartupDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [internships, setInternships] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    // Get current user from local storage
    const user = localStorage.getItem("currentUser")
    if (user) {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)

      // Check if user is a startup and onboarding is complete
      if (parsedUser.userType !== "startup" || !parsedUser.onboardingComplete) {
        toast({
          title: "Access denied",
          description: "Please complete the onboarding process first.",
          variant: "destructive",
        })
        router.push("/onboarding")
        return
      }

      // Load internships and applications for the current startup only
      const allInternships = JSON.parse(localStorage.getItem("internships") || "[]")
      const startupInternships = allInternships.filter((i: any) => i.startupId === parsedUser.id)
      setInternships(startupInternships)
      setApplications(getApplicationsByStartupId(parsedUser.id))
    } else {
      // Redirect to sign in if no user is found
      router.push("/auth/signin")
    }
  }, [router, toast])

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleUpdateApplicationStatus = (
    applicationId: string,
    status: "pending" | "accepted" | "rejected" | "waitlisted",
  ) => {
    // Update application status in local storage
    const apps = JSON.parse(localStorage.getItem("applications") || "[]")
    const updatedApps = apps.map((app: any) => (app.id === applicationId ? { ...app, status } : app))
    localStorage.setItem("applications", JSON.stringify(updatedApps))

    // Update applications state
    setApplications(applications.map((app) => (app.id === applicationId ? { ...app, status } : app)))

    toast({
      title: "Status updated",
      description: `Application status updated to ${status}.`,
    })
  }

  const handleDeleteInternship = (internshipId: string) => {
    if (!currentUser) return

    // Remove internship from local storage
    const internships = JSON.parse(localStorage.getItem("internships") || "[]")
    const updatedInternships = internships.filter((i: any) => i.id !== internshipId)
    localStorage.setItem("internships", JSON.stringify(updatedInternships))

    // Update state
    setInternships(updatedInternships)

    toast({
      title: "Internship deleted",
      description: "The internship has been deleted successfully.",
    })
  }

  const handleToggleStatus = (internshipId: string) => {
    if (!currentUser) return

    // Update internship status in local storage
    const internships = JSON.parse(localStorage.getItem("internships") || "[]")
    const updatedInternships = internships.map((i: any) => 
      i.id === internshipId ? { ...i, status: i.status === "open" ? "closed" : "open" } : i
    )
    localStorage.setItem("internships", JSON.stringify(updatedInternships))

    // Update state - only show internships from current startup
    const startupInternships = updatedInternships.filter((i: any) => i.startupId === currentUser.id)
    setInternships(startupInternships)

    toast({
      title: "Status updated",
      description: `Internship status has been ${updatedInternships.find((i: any) => i.id === internshipId)?.status === "open" ? "opened" : "closed"}.`,
    })
  }

  if (!currentUser) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    )
  }

  // Calculate analytics
  const totalInternships = internships.length
  const totalApplications = applications.length
  const pendingApplications = applications.filter((app) => app.status === "pending").length
  const acceptedApplications = applications.filter((app) => app.status === "accepted").length
  const waitlistedApplications = applications.filter((app) => app.status === "waitlisted").length
  const rejectedApplications = applications.filter((app) => app.status === "rejected").length

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Welcome, {currentUser.name}</h2>
          <p className="text-sm text-muted-foreground">
            {currentUser.startupData?.official_name || currentUser.companyName} • {currentUser.startupData?.domain || currentUser.industry}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/startup/profile">
            <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-primary/10 hover:text-primary">
              <User className="h-4 w-4" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <DashboardHeader 
          heading="Startup Dashboard"
          text="Manage your internships and applications"
          user={currentUser}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border bg-muted/20 pb-2">
            <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalInternships}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border bg-muted/20 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border bg-muted/20 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{pendingApplications}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border bg-muted/20 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Applications</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{acceptedApplications}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="internships" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-64 grid-cols-2 gap-4 rounded-md bg-muted p-1">
            <TabsTrigger value="internships" className="rounded-sm">
              Internships
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-sm">
              Applications
            </TabsTrigger>
          </TabsList>
          <Link href="/dashboard/startup/internships/new">
            <Button className="shadow-sm transition-all hover:shadow">
              <Plus className="mr-2 h-4 w-4" />
              Post Internship
            </Button>
          </Link>
        </div>

        <TabsContent value="internships" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internships.length > 0 ? (
              internships.map((internship) => (
                <Card key={internship.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="border-b border-border bg-muted/20 pb-2 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <CardTitle className="text-base sm:text-lg line-clamp-1">{internship.title}</CardTitle>
                          <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                            internship.status === "open"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}>
                            {internship.status === "open" ? "Open" : "Closed"}
                          </span>
                        </div>
                        <CardDescription className="text-xs sm:text-sm line-clamp-1">
                          {internship.campus} • {internship.mode}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium text-primary">
                          {applications.filter((app) => app.internshipId === internship.id).length} Applications
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">
                          Posted: {new Date(internship.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 sm:pt-4">
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{internship.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-muted-foreground">{internship.duration} {internship.durationUnit}</p>
                        </div>
                        <div>
                          <p className="font-medium">Stipend</p>
                          <p className="text-muted-foreground">{internship.stipend}</p>
                        </div>
                        <div>
                          <p className="font-medium">Openings</p>
                          <p className="text-muted-foreground">{internship.numberOfOpenings} positions</p>
                        </div>
                        <div>
                          <p className="font-medium">Deadline</p>
                          <p className="text-muted-foreground">
                            {new Date(internship.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Joining Date</p>
                          <p className="text-muted-foreground">
                            {new Date(internship.joiningDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Certificate</p>
                          <p className="text-muted-foreground">
                            {internship.certificateProvision ? "Will be provided" : "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-medium">Required Skills</p>
                        <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                          {internship.skills.split(",").map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-xs sm:text-sm font-medium">Custom Tasks/Questions</p>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm text-muted-foreground">1. {internship.customTask1}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">2. {internship.customTask2}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t border-border bg-muted/10 pt-2 sm:pt-3">
                    <div className="flex gap-1.5 sm:gap-2">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm shadow-sm hover:shadow" asChild>
                        <Link href={`/dashboard/startup/internships/${internship.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm shadow-sm hover:shadow" asChild>
                        <Link href={`/dashboard/startup/internships/${internship.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`text-xs sm:text-sm shadow-sm hover:shadow ${
                          internship.status === "open"
                            ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50"
                            : "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                        }`}
                        onClick={() => handleToggleStatus(internship.id)}
                      >
                        {internship.status === "open" ? "Close" : "Open"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm shadow-sm hover:shadow hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteInternship(internship.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                <div className="text-center">
                  <p className="mb-4 text-muted-foreground">You haven't posted any internships yet.</p>
                  <Link href="/dashboard/startup/internships/new">
                    <Button className="shadow-sm transition-all hover:shadow">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Your First Internship
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid gap-6">
            {applications.length > 0 ? (
              applications.map((application) => {
                const internship = internships.find((i) => i.id === application.internshipId)
                const student = JSON.parse(localStorage.getItem("users") || "[]").find(
                  (u: any) => u.id === application.studentId
                )

                return (
                  <Card key={application.id} className="overflow-hidden">
                    <CardHeader className="border-b border-border bg-muted/20">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
                            {student?.studentData?.profile_pic ? (
                              <img
                                src={student.studentData.profile_pic}
                                alt={`${student?.studentData?.full_name || student?.name}'s profile picture`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <User className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {student?.studentData?.full_name || student?.name}
                            </CardTitle>
                            <CardDescription>
                              Applied for {internship?.title}
                            </CardDescription>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            application.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : application.status === "waitlisted"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Student Information */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-medium mb-3">Student Information</h3>
                            <div className="grid gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground w-24">ID Number:</span>
                                <span>{student?.studentData?.id_number}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground w-24">Campus:</span>
                                <span>{student?.studentData?.campus}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground w-24">Birth Year:</span>
                                <span>{student?.studentData?.birth_year}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground w-24">Degree:</span>
                                <div className="flex flex-col">
                                  {student?.studentData?.btech_branch && (
                                    <span>B.Tech: {student.studentData.btech_branch}</span>
                                  )}
                                  {student?.studentData?.msc_branch && (
                                    <span>M.Sc: {student.studentData.msc_branch}</span>
                                  )}
                                  {student?.studentData?.minor_degree && (
                                    <span>Minor: {student.studentData.minor_degree}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                            <div className="grid gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground w-24">Email:</span>
                                <a
                                  href={`mailto:${student?.studentData?.personal_mail_id || student?.email}`}
                                  className="text-primary hover:underline"
                                >
                                  {student?.studentData?.personal_mail_id || student?.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground w-24">WhatsApp:</span>
                                <a
                                  href={`https://wa.me/${student?.studentData?.whatsapp_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {student?.studentData?.whatsapp_number}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-3">Professional Links</h3>
                            <div className="flex flex-wrap gap-2">
                              {student?.studentData?.linkedin_profile_link && (
                                <a
                                  href={student.studentData.linkedin_profile_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-sm font-medium hover:bg-muted"
                                >
                                  LinkedIn
                                </a>
                              )}
                              {student?.studentData?.portfolio_link && (
                                <a
                                  href={student.studentData.portfolio_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-sm font-medium hover:bg-muted"
                                >
                                  Portfolio
                                </a>
                              )}
                              {student?.studentData?.resume_url && (
                                <a
                                  href={student.studentData.resume_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-sm font-medium hover:bg-muted"
                                >
                                  Resume
                                </a>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-3">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                              {student?.studentData?.interests?.map((interest: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Application Responses */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-medium mb-3">Application Responses</h3>
                            <div className="space-y-4">
                              {application.answers?.map((answer: any, index: number) => (
                                <div key={index} className="space-y-1">
                                  <p className="text-sm font-medium">{answer.question}</p>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{answer.answer}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-3">Resume & Documents</h3>
                            <div className="space-y-3">
                              {student?.studentData?.resume_url && (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={student.studentData.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-sm font-medium hover:bg-muted"
                                  >
                                    View Resume
                                  </a>
                                  <span className="text-xs text-muted-foreground">
                                    Last updated: {new Date(student.studentData.resume_updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {application.additional_documents?.map((doc: any, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1 text-sm font-medium hover:bg-muted"
                                  >
                                    {doc.name || `Document ${index + 1}`}
                                  </a>
                                  <span className="text-xs text-muted-foreground">
                                    {doc.type} • {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-3">Application Status</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleUpdateApplicationStatus(application.id, "rejected")}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleUpdateApplicationStatus(application.id, "waitlisted")}
                              >
                                Waitlist
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs"
                                onClick={() => handleUpdateApplicationStatus(application.id, "accepted")}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">No applications received yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
