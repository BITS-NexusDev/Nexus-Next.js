"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building2, Calendar, Clock, MapPin, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getAllInternships, getAllStartups } from "@/lib/local-storage"

export default function InternshipDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [internship, setInternship] = useState<any>(null)
  const [startup, setStartup] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      try {
        const allInternships = getAllInternships()
        const foundInternship = allInternships.find((i) => i.id === params.id)
        
        if (!foundInternship) {
          toast({
            title: "Internship not found",
            description: "The internship you're looking for doesn't exist.",
            variant: "destructive",
          })
          router.push("/dashboard/student")
          return
        }

        const allStartups = getAllStartups()
        const foundStartup = allStartups.find((s) => s.id === foundInternship.startupId)

        setInternship(foundInternship)
        setStartup(foundStartup)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load internship details.",
          variant: "destructive",
        })
        router.push("/dashboard/student")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router, toast])

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex h-40 items-center justify-center">
          <div className="animate-pulse text-lg font-medium">Loading...</div>
        </div>
      </DashboardShell>
    )
  }

  if (!internship || !startup) {
    return null
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <DashboardHeader
          heading={internship.title}
          text={`${startup.startupData?.official_name || "Unknown Company"} • ${internship.campus}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/20 pb-3">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-muted/20">
                  {startup.startupData?.logo ? (
                    <Image
                      src={startup.startupData.logo}
                      alt={`${startup.startupData.official_name} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{startup.startupData?.official_name}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {startup.startupData?.location_city} • Founded {startup.startupData?.year_of_incorporation}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-sm font-medium">About the Internship</h3>
                  <p className="text-sm text-muted-foreground">{internship.description}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.split(",").map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Custom Tasks/Questions</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">1. {internship.customTask1}</p>
                    <p className="text-sm text-muted-foreground">2. {internship.customTask2}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-border bg-muted/20 pb-3">
              <CardTitle className="text-lg">Internship Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {internship.duration} {internship.durationUnit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joining Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(internship.joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{internship.campus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Openings</p>
                    <p className="text-sm text-muted-foreground">
                      {internship.numberOfOpenings} positions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 pt-3">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/student/apply/${internship.id}`}>Apply Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="border-b border-border bg-muted/20 pb-3">
              <CardTitle className="text-lg">About the Company</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{startup.startupData?.summary}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Domain</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {startup.startupData?.domain}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Contact Information</h3>
                  <div className="space-y-1">
                    <a
                      href={`mailto:${startup.startupData?.contact_mail}`}
                      className="block text-sm text-primary hover:underline"
                    >
                      {startup.startupData?.contact_mail}
                    </a>
                    <a
                      href={`tel:${startup.startupData?.contact_number}`}
                      className="block text-sm text-primary hover:underline"
                    >
                      {startup.startupData?.contact_number}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 pt-3">
              <Button variant="outline" className="w-full" asChild>
                <Link
                  href={startup.startupData?.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
} 