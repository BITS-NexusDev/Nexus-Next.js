"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateUser } from "@/lib/local-storage"

// ENUMS for BITS Pilani
const CAMPUS_OPTIONS = [
  "Pilani",
  "Goa",
  "Hyderabad",
  "Dubai",
];
const BTECH_BRANCH_OPTIONS = [
  "Computer Science",
  "Electrical & Electronics",
  "Electronics & Instrumentation",
  "Mechanical",
  "Chemical",
  "Civil",
  "Manufacturing",
  "Other",
];
const MSC_BRANCH_OPTIONS = [
  "Biological Sciences",
  "Chemistry",
  "Economics",
  "Mathematics",
  "Physics",
  "General Studies",
  "Other",
];
const MINOR_DEGREE_OPTIONS = [
  "Finance",
  "Data Science",
  "Robotics & Automation",
  "Materials Science",
  "None",
  "Other",
];

// Add INTERESTS_OPTIONS after other enums
const INTERESTS_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "IoT",
  "Robotics",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "Entrepreneurship",
  "Finance",
  "Consulting",
  "Research",
  "Open Source",
  "Gaming",
  "AR/VR"
];

export default function StudentProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: "",
    birth_year: "",
    id_number: "",
    campus: "",
    btech_branch: "",
    msc_branch: "",
    minor_degree: "",
    personal_mail_id: "",
    whatsapp_number: "",
    linkedin_profile_link: "",
    portfolio_link: "",
    resume_url: "",
    profile_photo: "",
    interests: [] as string[],
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profile_photo: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInterestsChange = (interest: string) => {
    setProfileData(prev => {
      const currentInterests = prev.interests
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest)
        }
      }
      if (currentInterests.length >= 3) {
        toast({
          title: "Maximum interests reached",
          description: "You can select up to 3 interests",
          variant: "destructive",
        })
        return prev
      }
      return {
        ...prev,
        interests: [...currentInterests, interest]
      }
    })
  }

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
          description: "This page is only accessible to students.",
          variant: "destructive",
        })
        router.push("/dashboard/startup")
        return
      }

      // Set profile data from user
      setProfileData({
        full_name: parsedUser.studentData?.full_name || parsedUser.name || "",
        birth_year: parsedUser.studentData?.birth_year || "",
        id_number: parsedUser.studentData?.id_number || "",
        campus: parsedUser.studentData?.campus || "",
        btech_branch: parsedUser.studentData?.btech_branch || "",
        msc_branch: parsedUser.studentData?.msc_branch || "",
        minor_degree: parsedUser.studentData?.minor_degree || "",
        personal_mail_id: parsedUser.studentData?.personal_mail_id || parsedUser.email || "",
        whatsapp_number: parsedUser.studentData?.whatsapp_number || "",
        linkedin_profile_link: parsedUser.studentData?.linkedin_profile_link || "",
        portfolio_link: parsedUser.studentData?.portfolio_link || "",
        resume_url: parsedUser.studentData?.resume_url || "",
        profile_photo: parsedUser.studentData?.profile_photo || "",
        interests: Array.isArray(parsedUser.studentData?.interests) 
          ? parsedUser.studentData.interests 
          : [],
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
      name: profileData.full_name,
      email: profileData.personal_mail_id,
      studentData: {
        ...currentUser.studentData,
        ...profileData,
      },
    }

    // Update user in local storage
    updateUser(updatedUser)

    // Update current user in local storage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    setIsLoading(false)
  }

  if (!currentUser) {
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
        <DashboardHeader heading="My Profile" text="View and edit your profile information." />
      </div>

      <Card className="overflow-hidden border-2 border-border shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-border bg-muted/20 pb-8 text-center">
            <div className="mx-auto mb-8 relative">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-muted/20">
                {profileData.profile_photo ? (
                  <img
                    src={profileData.profile_photo}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">👤</div>
                    <div className="text-xs text-muted-foreground">Upload Photo</div>
                  </div>
                )}
              </div>
              <label 
                htmlFor="profile_photo" 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </label>
              <input
                id="profile_photo"
                name="profile_photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <CardTitle className="text-2xl">Personal Information</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">Update your personal information and profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">Full Name*</Label>
                <Input id="full_name" name="full_name" value={profileData.full_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_year" className="text-sm font-medium">Birth Year*</Label>
                <Input id="birth_year" name="birth_year" type="number" min="1980" max="2025" value={profileData.birth_year} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="id_number" className="text-sm font-medium">ID Number*</Label>
                <Input id="id_number" name="id_number" value={profileData.id_number} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus" className="text-sm font-medium">Campus*</Label>
                <Select name="campus" value={profileData.campus} onValueChange={(value) => handleSelectChange("campus", value)} required>
                  <SelectTrigger id="campus">
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPUS_OPTIONS.map((campus) => (
                      <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="btech_branch" className="text-sm font-medium">B.Tech Branch</Label>
                <Select name="btech_branch" value={profileData.btech_branch} onValueChange={(value) => handleSelectChange("btech_branch", value)}>
                  <SelectTrigger id="btech_branch">
                    <SelectValue placeholder="Select B.Tech branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BTECH_BRANCH_OPTIONS.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="msc_branch" className="text-sm font-medium">M.Sc Branch</Label>
                <Select name="msc_branch" value={profileData.msc_branch} onValueChange={(value) => handleSelectChange("msc_branch", value)}>
                  <SelectTrigger id="msc_branch">
                    <SelectValue placeholder="Select M.Sc branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {MSC_BRANCH_OPTIONS.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minor_degree" className="text-sm font-medium">Minor Degree</Label>
                <Select name="minor_degree" value={profileData.minor_degree} onValueChange={(value) => handleSelectChange("minor_degree", value)}>
                  <SelectTrigger id="minor_degree">
                    <SelectValue placeholder="Select minor degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {MINOR_DEGREE_OPTIONS.map((minor) => (
                      <SelectItem key={minor} value={minor}>{minor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="personal_mail_id" className="text-sm font-medium">Personal Email</Label>
                <Input id="personal_mail_id" name="personal_mail_id" value={profileData.personal_mail_id} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="text-sm font-medium">WhatsApp Number</Label>
                <Input id="whatsapp_number" name="whatsapp_number" value={profileData.whatsapp_number} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_profile_link" className="text-sm font-medium">LinkedIn Profile Link</Label>
                <Input id="linkedin_profile_link" name="linkedin_profile_link" value={profileData.linkedin_profile_link} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="portfolio_link" className="text-sm font-medium">Portfolio Link</Label>
                <Input id="portfolio_link" name="portfolio_link" value={profileData.portfolio_link} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume_url" className="text-sm font-medium">Resume URL</Label>
                <Input id="resume_url" name="resume_url" value={profileData.resume_url} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-sm font-medium">Interests (Select up to 3)</Label>
              <div className="flex flex-wrap gap-3">
                {INTERESTS_OPTIONS.map((interest) => {
                  const isSelected = profileData.interests.includes(interest);
                  const isDisabled = profileData.interests.length >= 3 && !isSelected;
                  
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestsChange(interest)}
                      disabled={isDisabled}
                      className={`
                        h-8 px-4 rounded-full text-sm font-medium transition-all
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                      `}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-right">
                Selected: {profileData.interests.length}/3
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border bg-muted/20 pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>Saving changes...</>
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
