"use client"

import type React from "react"

import type { Params } from "next/dist/shared/lib/router/utils/route-matcher"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createApplication, getApplicationsByStudentId, getInternshipById } from "@/lib/local-storage"

export default function ApplyInternshipPage({ params }: { params: Params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [internship, setInternship] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    coverLetter: "",
    customTask1: "",
    customTask2: "",
    resume: null as File | null,
  })

  useEffect(() => {
    // Get current user from local storage
    const user = localStorage.getItem("currentUser")
    if (user) {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)

      // Check if user is a student
      if (parsedUser.userType !== "student") {
        toast({
          title: "Access denied",
          description: "Only students can apply for internships.",
          variant: "destructive",
        })
        router.push("/dashboard/startup")
        return
      }

      // Get internship details
      const internshipData = getInternshipById(params.internshipId)
      if (!internshipData) {
        toast({
          title: "Internship not found",
          description: "The internship you're trying to apply for doesn't exist.",
          variant: "destructive",
        })
        router.push("/dashboard/student")
        return
      }
      setInternship(internshipData)

      // Check if already applied
      const applications = getApplicationsByStudentId(parsedUser.id)
      const alreadyApplied = applications.some((app: any) => app.internshipId === params.internshipId)
      if (alreadyApplied) {
        toast({
          title: "Already applied",
          description: "You have already applied for this internship.",
          variant: "destructive",
        })
        router.push("/dashboard/student")
        return
      }
    } else {
      // Redirect to sign in if no user is found
      router.push("/auth/signin")
    }
  }, [params.internshipId, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files?.[0] || null }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!currentUser || !internship) {
      toast({
        title: "Error",
        description: "Missing user or internship data. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Create new application
    const newApplication = {
      id: Date.now().toString(),
      studentId: currentUser.id,
      internshipId: internship.id,
      status: "pending",
      appliedAt: new Date().toISOString(),
      answers: [
        {
          question: "Cover Letter",
          answer: formData.coverLetter
        },
        {
          question: internship.customTask1,
          answer: formData.customTask1
        },
        {
          question: internship.customTask2,
          answer: formData.customTask2
        }
      ],
      resume: formData.resume ? URL.createObjectURL(formData.resume) : null
    }

    // Save application to local storage
    createApplication(newApplication)

    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully.",
    })

    // Redirect to dashboard
    router.push("/dashboard/student")
  }

  if (!currentUser || !internship) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <Link href="/dashboard/student">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <DashboardHeader
          heading={`Apply for ${internship.title}`}
          text="Submit your application for this internship."
        />
      </div>

      <Card className="mb-6 overflow-hidden border-2 border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/20 pb-3">
          <CardTitle>{internship.title}</CardTitle>
          <CardDescription>
            {internship.location} • {internship.type} • {internship.duration} • {internship.stipend}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">{internship.description}</p>
          <div className="mt-4">
            <h3 className="text-sm font-medium">Required Skills:</h3>
            <div className="mt-2 flex flex-wrap gap-2">
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
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-2 border-border shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-border bg-muted/20 pb-3">
            <CardTitle>Application Form</CardTitle>
            <CardDescription>Please provide the following information to complete your application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label htmlFor="resume">Resume (PDF)</Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                required
                className="min-h-[150px]"
              />
            </div>

            <div>
              <Label htmlFor="customTask1">{internship.customTask1}</Label>
              <Textarea
                id="customTask1"
                name="customTask1"
                value={formData.customTask1}
                onChange={handleChange}
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="customTask2">{internship.customTask2}</Label>
              <Textarea
                id="customTask2"
                name="customTask2"
                value={formData.customTask2}
                onChange={handleChange}
                required
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border bg-muted/10 py-4">
            <Button className="px-8 shadow-sm transition-all hover:shadow" type="submit" disabled={isLoading}>
              {isLoading ? (
                "Submitting Application..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
}
