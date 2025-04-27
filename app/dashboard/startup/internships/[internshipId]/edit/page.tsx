"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getInternshipById } from "@/lib/local-storage"

export default function EditInternshipPage({ params }: { params: { internshipId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    durationUnit: "",
    stipend: "",
    skills: "",
    numberOfOpenings: "",
    campus: "",
    mode: "",
    deadline: "",
    joiningDate: "",
    contactMail: "",
    certificateProvision: true,
    customTask1: "",
    customTask2: "",
    status: "open",
  })

  useEffect(() => {
    // Get current user from local storage
    const user = localStorage.getItem("currentUser")
    if (user) {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)

      // Check if user is a startup
      if (parsedUser.userType !== "startup") {
        toast({
          title: "Access denied",
          description: "Only startups can edit internships.",
          variant: "destructive",
        })
        router.push("/dashboard/student")
        return
      }

      // Get internship details
      const internship = getInternshipById(params.internshipId)
      if (!internship) {
        toast({
          title: "Internship not found",
          description: "The internship you're trying to edit doesn't exist.",
          variant: "destructive",
        })
        router.push("/dashboard/startup")
        return
      }

      // Check if the internship belongs to the current startup
      if (internship.startupId !== parsedUser.id) {
        toast({
          title: "Access denied",
          description: "You can only edit your own internships.",
          variant: "destructive",
        })
        router.push("/dashboard/startup")
        return
      }

      // Set form data
      setFormData({
        title: internship.title,
        description: internship.description,
        duration: internship.duration,
        durationUnit: internship.durationUnit,
        stipend: internship.stipend,
        skills: internship.skills,
        numberOfOpenings: internship.numberOfOpenings,
        campus: internship.campus,
        mode: internship.mode,
        deadline: internship.deadline,
        joiningDate: internship.joiningDate,
        contactMail: internship.contactMail,
        certificateProvision: internship.certificateProvision,
        customTask1: internship.customTask1,
        customTask2: internship.customTask2,
        status: internship.status,
      })
    } else {
      // Redirect to sign in if no user is found
      router.push("/auth/signin")
    }
  }, [params.internshipId, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!currentUser) {
      toast({
        title: "Error",
        description: "User not found. Please sign in again.",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    // Update internship in local storage
    const internships = JSON.parse(localStorage.getItem("internships") || "[]")
    const updatedInternships = internships.map((i: any) =>
      i.id === params.internshipId
        ? {
            ...i,
            ...formData,
            updatedAt: new Date().toISOString(),
          }
        : i
    )
    localStorage.setItem("internships", JSON.stringify(updatedInternships))

    toast({
      title: "Internship updated",
      description: "Your internship has been updated successfully.",
    })

    // Redirect to dashboard
    router.push("/dashboard/startup")
  }

  if (!currentUser) {
    return <div className="container flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Internship" text="Update your internship listing.">
        <Link href="/dashboard/startup">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </DashboardHeader>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Internship Details</CardTitle>
            <CardDescription>Update the details of your internship posting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Internship Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Frontend Developer Intern"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex gap-2">
                  <Select
                    name="duration"
                    value={formData.duration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                    required
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    name="durationUnit"
                    value={formData.durationUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, durationUnit: value }))}
                    required
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Days">Days</SelectItem>
                      <SelectItem value="Weeks">Weeks</SelectItem>
                      <SelectItem value="Months">Months</SelectItem>
                      <SelectItem value="Years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stipend">Stipend</Label>
                <Input
                  id="stipend"
                  name="stipend"
                  placeholder="e.g. ₹15,000/month"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfOpenings">Number of Openings</Label>
                <Input
                  id="numberOfOpenings"
                  name="numberOfOpenings"
                  type="number"
                  min="1"
                  value={formData.numberOfOpenings}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="campus">Campus</Label>
                <Select
                  name="campus"
                  value={formData.campus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, campus: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pilani">Pilani</SelectItem>
                    <SelectItem value="Goa">Goa</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Dubai">Dubai</SelectItem>
                    <SelectItem value="All">All Campuses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Mode</Label>
                <Select
                  name="mode"
                  value={formData.mode}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactMail">Contact Email</Label>
                <Input
                  id="contactMail"
                  name="contactMail"
                  type="email"
                  placeholder="e.g. careers@startup.com"
                  value={formData.contactMail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="certificateProvision"
                  name="certificateProvision"
                  checked={formData.certificateProvision}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificateProvision: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled
                />
                <Label htmlFor="certificateProvision">Internship certificate will be provided</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="List the required skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Role Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the internship role and responsibilities"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Tasks/Questions for Applicants</Label>
                <p className="text-sm text-muted-foreground">
                  These tasks/questions will be shown to students when they apply for this internship.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customTask1">Task/Question 1</Label>
                <Textarea
                  id="customTask1"
                  name="customTask1"
                  placeholder="e.g. Please share a link to your GitHub profile or portfolio"
                  value={formData.customTask1}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customTask2">Task/Question 2</Label>
                <Textarea
                  id="customTask2"
                  name="customTask2"
                  placeholder="e.g. Why are you interested in this internship?"
                  value={formData.customTask2}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
} 