"use client"

import type React from "react"

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
import { updateUser } from "@/lib/local-storage"

export default function StartupProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    email: "",
    official_name: "",
    website_link: "",
    year_of_incorporation: "",
    location_city: "",
    logo_image: "",
    summary: "",
    domain: "",
    contact_mail: "",
    contact_number: "",
    founders_name: "",
    founders_birth_year: "",
    founders_email: "",
    founders_whatsapp: "",
    founders_linkedin: "",
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
          description: "This page is only accessible to startups.",
          variant: "destructive",
        })
        router.push("/dashboard/student")
        return
      }

      // Set profile data from user
      setProfileData({
        email: parsedUser.email || "",
        official_name: parsedUser.startupData?.official_name || "",
        website_link: parsedUser.startupData?.website_link || "",
        year_of_incorporation: parsedUser.startupData?.year_of_incorporation || "",
        location_city: parsedUser.startupData?.location_city || "",
        logo_image: parsedUser.startupData?.logo_image || "",
        summary: parsedUser.startupData?.summary || "",
        domain: parsedUser.startupData?.domain || "",
        contact_mail: parsedUser.startupData?.contact_mail || "",
        contact_number: parsedUser.startupData?.contact_number || "",
        founders_name: parsedUser.startupData?.founders_name || "",
        founders_birth_year: parsedUser.startupData?.founders_birth_year || "",
        founders_email: parsedUser.startupData?.founders_email || "",
        founders_whatsapp: parsedUser.startupData?.founders_whatsapp || "",
        founders_linkedin: parsedUser.startupData?.founders_linkedin || "",
      })
    } else {
      // Redirect to sign in if no user is found
      router.push("/auth/signin")
    }
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
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

    // Update user data
    const updatedUser = {
      ...currentUser,
      startupData: {
        ...currentUser.startupData,
        official_name: profileData.official_name,
        website_link: profileData.website_link,
        year_of_incorporation: profileData.year_of_incorporation,
        location_city: profileData.location_city,
        logo_image: profileData.logo_image,
        summary: profileData.summary,
        domain: profileData.domain,
        contact_mail: profileData.contact_mail,
        contact_number: profileData.contact_number,
        founders_name: profileData.founders_name,
        founders_birth_year: profileData.founders_birth_year,
        founders_email: profileData.founders_email,
        founders_whatsapp: profileData.founders_whatsapp,
        founders_linkedin: profileData.founders_linkedin,
      },
    }

    // Update user in local storage
    updateUser(updatedUser)

    // Update current user in local storage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    toast({
      title: "Profile updated",
      description: "Your company profile has been updated successfully.",
    })

    setIsLoading(false)
  }

  if (!currentUser) {
    return <div className="container flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Company Profile" text="View and edit your company information.">
        <Link href="/dashboard/startup">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </DashboardHeader>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details and profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-muted/20">
                {profileData.logo_image ? (
                  <img
                    src={profileData.logo_image}
                    alt="Company logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">🏢</div>
                    <div className="text-xs text-muted-foreground">No logo uploaded</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Registered Email</Label>
              <Input id="email" name="email" value={profileData.email} onChange={handleChange} disabled />
              <p className="text-xs text-muted-foreground">This is the email you used to register your account.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="official_name">Official Company Name</Label>
                <Input
                  id="official_name"
                  name="official_name"
                  value={profileData.official_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_link">Website</Label>
                <Input
                  id="website_link"
                  name="website_link"
                  type="url"
                  value={profileData.website_link}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year_of_incorporation">Year of Incorporation</Label>
                <Input
                  id="year_of_incorporation"
                  name="year_of_incorporation"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={profileData.year_of_incorporation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location_city">City</Label>
                <Input
                  id="location_city"
                  name="location_city"
                  value={profileData.location_city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_mail">Contact Email</Label>
                <Input
                  id="contact_mail"
                  name="contact_mail"
                  type="email"
                  value={profileData.contact_mail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  type="tel"
                  value={profileData.contact_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select
                name="domain"
                value={profileData.domain}
                onValueChange={(value) => handleSelectChange("domain", value)}
                required
              >
                <SelectTrigger id="domain">
                  <SelectValue placeholder="Select your domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Company Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                value={profileData.summary}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your company, mission, and vision."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Founder Details</Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="founders_name">Founder Name</Label>
                  <Input
                    id="founders_name"
                    name="founders_name"
                    value={profileData.founders_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founders_birth_year">Founder Birth Year</Label>
                  <Input
                    id="founders_birth_year"
                    name="founders_birth_year"
                    type="number"
                    min="1940"
                    max="2005"
                    value={profileData.founders_birth_year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founders_email">Founder Email</Label>
                  <Input
                    id="founders_email"
                    name="founders_email"
                    type="email"
                    value={profileData.founders_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founders_whatsapp">Founder WhatsApp</Label>
                  <Input
                    id="founders_whatsapp"
                    name="founders_whatsapp"
                    type="tel"
                    value={profileData.founders_whatsapp}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="founders_linkedin">Founder LinkedIn</Label>
                  <Input
                    id="founders_linkedin"
                    name="founders_linkedin"
                    type="url"
                    value={profileData.founders_linkedin}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
}
