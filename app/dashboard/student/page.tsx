"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Building2, Clock, Filter, LogOut, Search, User, Users, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getAllInternships, getAllStartups, getApplicationsByStudentId } from "@/lib/local-storage"
import { mockStartups } from "@/lib/mock-data"

interface StartupCardProps {
  startup: {
    id: string;
    startupData?: {
      official_name: string;
      website_link?: string;
      year_of_incorporation?: string;
      location_city?: string;
      founders_name?: string;
      founders_birth_year?: string;
      founders_email?: string;
      founders_whatsapp?: string;
      founders_linkedin?: string;
      summary?: string;
      domain?: string;
      contact_mail?: string;
      contact_number?: string;
      logo?: string;
      logo_image?: string;
    };
    companyName?: string;
    industry?: string;
  };
}

function StartupCard({ startup }: StartupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const summary = startup.startupData?.summary || startup.companyName || "No description available"
  const shouldShowReadMore = summary.length > 150

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-border">
      <CardHeader className="border-b border-border bg-muted/20 pb-2 sm:pb-3">
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-lg border border-border bg-muted/20">
            {startup.startupData?.logo || startup.startupData?.logo_image ? (
              <Image
                src={startup.startupData.logo || startup.startupData.logo_image || ""}
                alt={`${startup.startupData.official_name} logo`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'flex h-full w-full items-center justify-center';
                    fallback.innerHTML = '<svg class="h-6 w-6 sm:h-8 sm:w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg line-clamp-1">{startup.startupData?.official_name || startup.companyName || "Unknown Company"}</CardTitle>
            <CardDescription className="text-xs sm:text-sm line-clamp-1">
              {startup.startupData?.location_city || "Unknown Location"} • {startup.startupData?.year_of_incorporation ? `Founded ${startup.startupData.year_of_incorporation}` : "Unknown Year"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 sm:pt-4">
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium">About</h3>
            <div className="relative">
              <p className={`text-xs sm:text-sm text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}>
                {summary}
              </p>
              {shouldShowReadMore && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 flex items-center text-xs sm:text-sm text-primary hover:underline"
                >
                  {isExpanded ? (
                    <>
                      Show Less
                      <ChevronUp className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </>
                  ) : (
                    <>
                      Read More
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium">Domain</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2 py-0.5 text-xs font-medium text-primary">
                {startup.startupData?.domain || startup.industry || "Unknown Domain"}
              </span>
            </div>
          </div>

          {startup.startupData?.founders_name && (
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-medium">Founder Details</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground">{startup.startupData.founders_name}</p>
                </div>
                {startup.startupData.founders_birth_year && (
                  <div>
                    <p className="font-medium">Birth Year</p>
                    <p className="text-muted-foreground">{startup.startupData.founders_birth_year}</p>
                  </div>
                )}
                {startup.startupData.founders_email && (
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${startup.startupData.founders_email}`} className="text-primary hover:underline">
                      {startup.startupData.founders_email}
                    </a>
                  </div>
                )}
                {startup.startupData.founders_whatsapp && (
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a href={`https://wa.me/${startup.startupData.founders_whatsapp}`} className="text-primary hover:underline">
                      {startup.startupData.founders_whatsapp}
                    </a>
                  </div>
                )}
                {startup.startupData.founders_linkedin && (
                  <div className="col-span-2">
                    <p className="font-medium">LinkedIn</p>
                    <a href={startup.startupData.founders_linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {(startup.startupData?.contact_mail || startup.startupData?.contact_number) && (
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-medium">Contact Information</h3>
              <div className="space-y-1">
                {startup.startupData.contact_mail && (
                  <a
                    href={`mailto:${startup.startupData.contact_mail}`}
                    className="block text-xs sm:text-sm text-primary hover:underline"
                  >
                    {startup.startupData.contact_mail}
                  </a>
                )}
                {startup.startupData.contact_number && (
                  <a
                    href={`tel:${startup.startupData.contact_number}`}
                    className="block text-xs sm:text-sm text-primary hover:underline"
                  >
                    {startup.startupData.contact_number}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {startup.startupData?.website_link && (
        <CardFooter className="border-t border-border bg-muted/20 pt-2 sm:pt-3">
          <Button 
            variant="outline" 
            className="w-full text-xs sm:text-sm shadow-sm transition-all hover:shadow hover:bg-primary hover:text-primary-foreground" 
            asChild
          >
            <Link 
              href={startup.startupData.website_link} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Visit Website
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

const mockInternships = [
  {
    id: "1",
    startupId: "1",
    title: "Backend Developer Intern",
    duration: "6",
    durationUnit: "Months",
    numberOfOpenings: 2,
    description: "Join our backend team to develop robust APIs and services for our AI platform. You'll work with modern technologies and gain hands-on experience in building scalable systems.",
    skills: "Node.js, Express, MongoDB, REST APIs, Git",
    stipend: "₹25,000/month",
    campus: "All",
    mode: "Remote",
    deadline: "2024-04-30",
    joiningDate: "2024-06-01",
    contactMail: "careers@technova.ai",
    certificateProvision: true,
    customTask1: "Please share a link to your GitHub profile or portfolio",
    customTask2: "Why are you interested in this internship?",
    status: "open",
  },
  {
    id: "2",
    startupId: "2",
    title: "Frontend Developer Intern",
    duration: "3",
    durationUnit: "Months",
    numberOfOpenings: 3,
    description: "Help us build engaging user interfaces for our educational platform. Work with React and modern frontend tools to create responsive and accessible web applications.",
    skills: "React.js, TypeScript, Tailwind CSS, HTML5, CSS3",
    stipend: "₹20,000/month",
    campus: "Pilani",
    mode: "On-site",
    deadline: "2024-04-15",
    joiningDate: "2024-05-15",
    contactMail: "hr@edutech.in",
    certificateProvision: true,
    customTask1: "Share a link to your best frontend project",
    customTask2: "What is your preferred tech stack and why?",
    status: "open",
  }
];

export default function StudentDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [internships, setInternships] = useState<any[]>([])
  const [startups, setStartups] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState<string[]>([])
  const [filteredStartups, setFilteredStartups] = useState<any[]>([])

  useEffect(() => {
    // Get current user from local storage
    const user = localStorage.getItem("currentUser")
    if (user) {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)

      // Check if user is a student and onboarding is complete
      if (parsedUser.userType !== "student" || !parsedUser.onboardingComplete) {
        toast({
          title: "Access denied",
          description: "Please complete the onboarding process first.",
          variant: "destructive",
        })
        router.push("/onboarding")
        return
      }

      // Load internships, startups, and applications from local storage
      const allInternships = getAllInternships().filter(i => i.status === "open")  // Only show open internships
      setInternships(allInternships)
      setStartups(getAllStartups())
      setApplications(getApplicationsByStudentId(parsedUser.id))
    } else {
      // Redirect to sign in if no user is found
      router.push("/auth/signin")
    }
  }, [router, toast])

  useEffect(() => {
    // Filter startups based on search query and industry filter
    let filtered = [...startups]

    if (searchQuery) {
      filtered = filtered.filter(
        (startup) =>
          startup.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          startup.startupData?.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          startup.startupData?.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (industryFilter.length > 0) {
      filtered = filtered.filter((startup) => industryFilter.includes(startup.startupData?.industry))
    }

    setFilteredStartups(filtered)
  }, [startups, searchQuery, industryFilter])

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleApply = (internshipId: string) => {
    if (!currentUser) return

    // Check if already applied
    const alreadyApplied = applications.some((app) => app.internshipId === internshipId)

    if (alreadyApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied for this internship.",
        variant: "destructive",
      })
      return
    }

    // Redirect to application form
    router.push(`/dashboard/student/apply/${internshipId}`)
  }

  const toggleIndustryFilter = (industry: string) => {
    if (industryFilter.includes(industry)) {
      setIndustryFilter(industryFilter.filter((i) => i !== industry))
    } else {
      setIndustryFilter([...industryFilter, industry])
    }
  }

  if (!currentUser) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    )
  }

  // Get unique industries from startups
  const industries = [...new Set(startups.map((startup) => startup.startupData?.industry).filter(Boolean))]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <DashboardHeader 
          heading="Student Dashboard"
          text="Browse internships and apply to your dream roles"
          user={currentUser}
        >
          <Link href="/dashboard/student/profile">
            <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-primary/10 hover:text-primary">
              <User className="h-4 w-4" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign out</span>
          </Button>
        </DashboardHeader>

        <Tabs defaultValue="internships" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-4 rounded-md bg-primary/5 p-1">
            <TabsTrigger value="internships" className="rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Internships
            </TabsTrigger>
            <TabsTrigger value="startups" className="rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Startups
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internships" className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search internships..."
                  className="pl-9 border-primary/20 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shadow-sm hover:bg-primary/10 hover:text-primary">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Internships</SheetTitle>
                    <SheetDescription>Filter internships by industry, duration, etc.</SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <h3 className="mb-3 text-sm font-medium">Industries</h3>
                    <div className="space-y-3">
                      {industries.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`industry-${industry}`}
                            checked={industryFilter.includes(industry)}
                            onChange={() => toggleIndustryFilter(industry)}
                            className="h-4 w-4 rounded border-primary/20 text-primary focus:ring-primary"
                          />
                          <label htmlFor={`industry-${industry}`} className="text-sm">
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="space-y-4">
              {internships.length > 0 ? (
                internships.map((internship) => {
                  const startup = startups.find((s) => s.id === internship.startupId)
                  const hasApplied = applications.some((app) => app.internshipId === internship.id)

                  return (
                    <Card key={internship.id} className="overflow-hidden transition-all hover:shadow-md border-border">
                      <div className="flex">
                        <div className="w-1/3 border-r border-border">
                          <div className="relative aspect-square w-full">
                            {startup?.startupData?.logo ? (
                              <Image
                                src={startup.startupData.logo}
                                alt={`${startup.startupData.official_name} logo`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'flex h-full w-full items-center justify-center bg-muted';
                                    fallback.innerHTML = '<svg class="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <svg className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21 15 16 10 5 21"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 md:p-5">
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <h2 className="text-base sm:text-lg md:text-xl font-semibold">{internship.title}</h2>
                                  <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                    internship.status === "open"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  }`}>
                                    {internship.status === "open" ? "Open" : "Closed"}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground">{startup?.startupData?.official_name || "Unknown Company"} • {internship.campus}</p>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{internship.description}</p>
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
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-5 flex justify-end gap-1.5 sm:gap-2">
                            {hasApplied ? (
                              <Button variant="outline" size="sm" className="text-xs sm:text-sm" disabled>
                                Applied
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs sm:text-sm shadow-sm hover:shadow"
                                asChild
                              >
                                <Link href={`/dashboard/student/apply/${internship.id}`}>
                                  Apply Now
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed border-primary/20 bg-primary/5">
                  <p className="text-center text-muted-foreground">No internships available at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="startups" className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search startups..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shadow-sm hover:shadow">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Startups</SheetTitle>
                    <SheetDescription>Filter startups by industry, size, etc.</SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    <h3 className="mb-3 text-sm font-medium">Industries</h3>
                    <div className="space-y-3">
                      {industries.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`industry-${industry}`}
                            checked={industryFilter.includes(industry)}
                            onChange={() => toggleIndustryFilter(industry)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={`industry-${industry}`} className="text-sm">
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStartups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.length > 0 ? (
                applications.map((application) => {
                  const internship = internships.find((i) => i.id === application.internshipId)
                  const startup = startups.find((s) => s.id === internship?.startupId)

                  return (
                    <Card key={application.id} className="overflow-hidden transition-all hover:shadow-md border-border">
                      <CardHeader className="border-b border-border bg-muted/20 pb-2 sm:pb-3">
                        <div className="flex items-start gap-2 sm:gap-4">
                          <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-lg border border-border bg-muted/20">
                            {startup?.startupData?.logo || startup?.startupData?.logo_image ? (
                              <Image
                                src={startup.startupData.logo || startup.startupData.logo_image || ""}
                                alt={`${startup.startupData.official_name} logo`}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'flex h-full w-full items-center justify-center';
                                    fallback.innerHTML = '<svg class="h-6 w-6 sm:h-8 sm:w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                  <circle cx="8.5" cy="8.5" r="1.5"/>
                                  <polyline points="21 15 16 10 5 21"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base sm:text-lg line-clamp-1">{internship?.title || "Unknown Position"}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm line-clamp-1">
                              {startup?.startupData?.official_name || startup?.companyName || "Unknown Company"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 sm:pt-4">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <h3 className="text-xs sm:text-sm font-medium">Internship Details</h3>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <p className="font-medium">Duration</p>
                                <p className="text-muted-foreground">{internship?.duration} {internship?.durationUnit}</p>
                              </div>
                              <div>
                                <p className="font-medium">Stipend</p>
                                <p className="text-muted-foreground">{internship?.stipend}</p>
                              </div>
                              <div>
                                <p className="font-medium">Mode</p>
                                <p className="text-muted-foreground">{internship?.mode}</p>
                              </div>
                              <div>
                                <p className="font-medium">Campus</p>
                                <p className="text-muted-foreground">{internship?.campus}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <h3 className="text-xs sm:text-sm font-medium">Startup Details</h3>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <p className="font-medium">Location</p>
                                <p className="text-muted-foreground">{startup?.startupData?.location_city || "Unknown Location"}</p>
                              </div>
                              <div>
                                <p className="font-medium">Domain</p>
                                <p className="text-muted-foreground">{startup?.startupData?.domain || startup?.industry || "Unknown Domain"}</p>
                              </div>
                              {startup?.startupData?.website_link && (
                                <div className="col-span-2">
                                  <p className="font-medium">Website</p>
                                  <a 
                                    href={startup.startupData.website_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary hover:underline"
                                  >
                                    Visit Website
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <h3 className="text-xs sm:text-sm font-medium">Application Status</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-medium">Status:</span>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  application.status === "accepted"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : application.status === "rejected"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                      : application.status === "waitlisted"
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                }`}
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-medium">Applied on:</span>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-center text-muted-foreground">You haven't applied to any internships yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
