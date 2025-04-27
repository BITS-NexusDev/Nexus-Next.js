"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateUser } from "@/lib/local-storage"
import { Checkbox } from "@/components/ui/checkbox"

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

// Add interests options after other enums
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

// Add domain options enum
const DOMAIN_OPTIONS = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "E-commerce",
  "Manufacturing",
  "Sustainability",
  "AI/ML",
  "Blockchain",
  "IoT",
  "Other"
];

// Add this function near the top of the file, after the imports
const compressImage = (base64String: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Compress as JPEG with 0.8 quality
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
  });
};

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<"student" | "startup">("student")
  const [studentData, setStudentData] = useState<Partial<StudentData>>({
    interests: []
  })
  const [startupData, setStartupData] = useState<Partial<StartupData>>({})
  const [startupStep, setStartupStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    if (!user) {
      router.push("/auth/signin")
      return
    }
    setCurrentUser(user)
    setUserType(user.userType)
    setStep(2) // Skip user type selection since we already have it

    // Load any saved onboarding data
    const savedStartupData = localStorage.getItem("onboarding_startupData")
    const savedStartupStep = localStorage.getItem("onboarding_startupStep")
    if (savedStartupData) {
      setStartupData(JSON.parse(savedStartupData))
    }
    if (savedStartupStep) {
      setStartupStep(parseInt(savedStartupStep))
    }
  }, [router])

  const handleStudentDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setStudentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStartupDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setStartupData((prev) => ({ ...prev, [name]: value }))
  }

  // Modify the handleImageUpload function
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      reader.onloadend = async () => {
        const compressedImage = await compressImage(reader.result as string);
        setStudentData(prev => ({
          ...prev,
          profile_photo: compressedImage
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Modify the handleLogoUpload function
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const compressedImage = await compressImage(reader.result as string);
        setStartupData(prev => ({
          ...prev,
          logo_image: compressedImage
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Add function to handle interests selection
  const handleInterestsChange = (interest: string) => {
    setStudentData(prev => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate required fields for students
    if (userType === "student") {
      if (!studentData.full_name.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your full name.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!studentData.birth_year || 
          parseInt(studentData.birth_year) < 1980 || 
          parseInt(studentData.birth_year) > 2025) {
        toast({
          title: "Invalid Birth Year",
          description: "Please enter a valid birth year between 1980 and 2025.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!studentData.id_number.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your BITS ID number.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!studentData.campus) {
        toast({
          title: "Missing Information",
          description: "Please select your campus.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate URL fields if they are provided
      const urlFields = {
        linkedin_profile_link: "LinkedIn Profile",
        portfolio_link: "Portfolio",
        resume_url: "Resume URL",
      }

      for (const [field, label] of Object.entries(urlFields)) {
        if (studentData[field as keyof typeof studentData] && 
            !isValidUrl(studentData[field as keyof typeof studentData])) {
          toast({
            title: "Invalid URL",
            description: `Please enter a valid URL for your ${label}.`,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      // Validate email if provided
      if (studentData.personal_mail_id && 
          !isValidEmail(studentData.personal_mail_id)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate WhatsApp number if provided
      if (studentData.whatsapp_number && 
          !isValidPhoneNumber(studentData.whatsapp_number)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid WhatsApp number.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Add validation for profile photo
      if (!studentData.profile_photo) {
        toast({
          title: "Missing Information",
          description: "Please upload a profile photo.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Add validation for interests
      if (studentData.interests.length === 0) {
        toast({
          title: "Missing Information",
          description: "Please select at least one interest.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }

    // Simulate API call
    setTimeout(() => {
      if (!currentUser) {
        toast({
          title: "Error",
          description: "User not found. Please sign in again.",
          variant: "destructive",
        })
        router.push("/auth/signin")
        return
      }

      try {
        // Store images separately
        if (userType === "student" && studentData.profile_photo) {
          localStorage.setItem("user_profile_photo", studentData.profile_photo)
        } else if (userType === "startup" && startupData.logo_image) {
          localStorage.setItem("startup_logo_image", startupData.logo_image)
        }

        const updatedUser = {
          ...currentUser,
          userType,
          onboardingComplete: true,
          ...(userType === "student" ? {
            studentData: {
              ...studentData,
              profile_photo: "stored_separately", // Reference only
              birth_year: parseInt(studentData.birth_year),
              linkedin_profile_link: formatUrl(studentData.linkedin_profile_link),
              portfolio_link: formatUrl(studentData.portfolio_link),
              resume_url: formatUrl(studentData.resume_url),
              full_name: studentData.full_name.trim(),
              id_number: studentData.id_number.trim(),
              personal_mail_id: studentData.personal_mail_id.trim(),
              whatsapp_number: studentData.whatsapp_number.trim(),
            }
          } : {
            startupData: {
              ...startupData,
              logo_image: "stored_separately", // Reference only
            }
          }),
        }

        // Update user in local storage
        updateUser(updatedUser)
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))

        toast({
          title: "Onboarding complete",
          description: "Your profile has been set up successfully.",
        })

        // Redirect to dashboard based on user type
        router.push(userType === "student" ? "/dashboard/student" : "/dashboard/startup")
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1000)
  }

  const validateStartupData = () => {
    // Validate company details
    if (startupStep === 1) {
      if (!startupData.official_name.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your company's official name.",
          variant: "destructive",
        })
        return false
      }

      if (!startupData.website_link || !isValidUrl(startupData.website_link)) {
        toast({
          title: "Invalid Website",
          description: "Please enter a valid website URL.",
          variant: "destructive",
        })
        return false
      }

      const year = parseInt(startupData.year_of_incorporation)
      if (!year || year < 1900 || year > new Date().getFullYear()) {
        toast({
          title: "Invalid Year",
          description: "Please enter a valid incorporation year.",
          variant: "destructive",
        })
        return false
      }

      if (!startupData.logo_image) {
        toast({
          title: "Missing Logo",
          description: "Please upload your company logo.",
          variant: "destructive",
        })
        return false
      }

      if (!startupData.summary.trim()) {
        toast({
          title: "Missing Information",
          description: "Please provide a company summary.",
          variant: "destructive",
        })
        return false
      }

      if (!startupData.domain) {
        toast({
          title: "Missing Information",
          description: "Please select your company domain.",
          variant: "destructive",
        })
        return false
      }

      if (!isValidEmail(startupData.contact_mail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid contact email.",
          variant: "destructive",
        })
        return false
      }

      if (!isValidPhoneNumber(startupData.contact_number)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid contact number.",
          variant: "destructive",
        })
        return false
      }

      return true
    }

    // Validate founder details
    if (startupStep === 2) {
      if (!startupData.founders_name.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter founder's name.",
          variant: "destructive",
        })
        return false
      }

      const birthYear = parseInt(startupData.founders_birth_year)
      if (!birthYear || birthYear < 1940 || birthYear > 2005) {
        toast({
          title: "Invalid Birth Year",
          description: "Please enter a valid birth year.",
          variant: "destructive",
        })
        return false
      }

      if (!isValidEmail(startupData.founders_email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email for the founder.",
          variant: "destructive",
        })
        return false
      }

      if (!isValidPhoneNumber(startupData.founders_whatsapp)) {
        toast({
          title: "Invalid WhatsApp Number",
          description: "Please enter a valid WhatsApp number.",
          variant: "destructive",
        })
        return false
      }

      if (!startupData.founders_linkedin || !isValidUrl(startupData.founders_linkedin)) {
        toast({
          title: "Invalid LinkedIn URL",
          description: "Please enter a valid LinkedIn profile URL.",
          variant: "destructive",
        })
        return false
      }

      return true
    }

    return false
  }

  const handleStartupStepNext = () => {
    if (validateStartupData()) {
      setStartupStep(2)
    }
  }

  const handleStartupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStartupData()) {
      handleSubmit(e)
      // Clear onboarding data after successful submission
      localStorage.removeItem("onboarding_step")
      localStorage.removeItem("onboarding_userType")
      localStorage.removeItem("onboarding_startupData")
      localStorage.removeItem("onboarding_startupStep")
    }
  }

  // Helper functions for validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPhoneNumber = (phone: string): boolean => {
    // Basic phone number validation (allows international format)
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    return phoneRegex.test(phone)
  }

  const formatUrl = (url: string): string => {
    if (!url) return ""
    try {
      const formattedUrl = new URL(url)
      return formattedUrl.toString()
    } catch {
      // If the URL is invalid or empty, return as is
      return url
    }
  }

  if (!currentUser) {
    return <div className="container flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to BITS Nexus</h1>
          <p className="text-muted-foreground">Let's set up your profile</p>
        </div>

        {step === 1 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>I am a...</CardTitle>
              <CardDescription>Select your role on the platform</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex h-24 flex-col items-center justify-center gap-2 p-6"
                onClick={() => setUserType("student")}
              >
                <GraduationCap className="h-8 w-8" />
                <span>Student</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-24 flex-col items-center justify-center gap-2 p-6"
                onClick={() => setUserType("startup")}
              >
                <Briefcase className="h-8 w-8" />
                <span>Startup</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && userType === "student" && (
          <Card className="w-full">
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-8 relative">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-muted/20">
                    {studentData.profile_photo ? (
                      <img
                        src={studentData.profile_photo}
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
                <CardTitle className="text-2xl">Student Profile</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">Tell us more about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name*</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={studentData.full_name}
                      onChange={handleStudentDataChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth_year">Birth Year*</Label>
                    <Input
                      id="birth_year"
                      name="birth_year"
                      type="number"
                      min="1980"
                      max="2025"
                      value={studentData.birth_year}
                      onChange={handleStudentDataChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="id_number">ID Number*</Label>
                    <Input
                      id="id_number"
                      name="id_number"
                      value={studentData.id_number}
                      onChange={handleStudentDataChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campus">Campus*</Label>
                    <Select
                      name="campus"
                      value={studentData.campus}
                      onValueChange={(value) => setStudentData((prev) => ({ ...prev, campus: value }))}
                      required
                    >
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="btech_branch">B.Tech Branch</Label>
                    <Select
                      name="btech_branch"
                      value={studentData.btech_branch}
                      onValueChange={(value) => setStudentData((prev) => ({ ...prev, btech_branch: value }))}
                    >
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
                    <Label htmlFor="msc_branch">M.Sc Branch</Label>
                    <Select
                      name="msc_branch"
                      value={studentData.msc_branch}
                      onValueChange={(value) => setStudentData((prev) => ({ ...prev, msc_branch: value }))}
                    >
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minor_degree">Minor Degree</Label>
                    <Select
                      name="minor_degree"
                      value={studentData.minor_degree}
                      onValueChange={(value) => setStudentData((prev) => ({ ...prev, minor_degree: value }))}
                    >
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
                    <Label htmlFor="personal_mail_id">Personal Email</Label>
                    <Input
                      id="personal_mail_id"
                      name="personal_mail_id"
                      type="email"
                      value={studentData.personal_mail_id}
                      onChange={handleStudentDataChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      value={studentData.whatsapp_number}
                      onChange={handleStudentDataChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_profile_link">LinkedIn Profile Link</Label>
                    <Input
                      id="linkedin_profile_link"
                      name="linkedin_profile_link"
                      value={studentData.linkedin_profile_link}
                      onChange={handleStudentDataChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio_link">Portfolio Link</Label>
                    <Input
                      id="portfolio_link"
                      name="portfolio_link"
                      value={studentData.portfolio_link}
                      onChange={handleStudentDataChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume_url">Resume URL</Label>
                    <Input
                      id="resume_url"
                      name="resume_url"
                      value={studentData.resume_url}
                      onChange={handleStudentDataChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Interests (Select up to 3)</Label>
                  <div className="flex flex-wrap gap-3">
                    {INTERESTS_OPTIONS.map((interest) => {
                      const isSelected = studentData.interests.includes(interest);
                      const isDisabled = studentData.interests.length >= 3 && !isSelected;
                      
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
                    Selected: {studentData.interests.length}/3
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Setting up your profile..." : "Complete Setup"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {step === 2 && userType === "startup" && (
          <Card className="w-full max-w-2xl">
            <form onSubmit={startupStep === 1 ? handleStartupStepNext : handleStartupSubmit}>
              <CardHeader>
                <CardTitle>{startupStep === 1 ? "Company Details" : "Founder Details"}</CardTitle>
                <CardDescription>
                  {startupStep === 1 
                    ? "Tell us about your startup" 
                    : "Tell us about the founder"}
                </CardDescription>
              </CardHeader>

              {startupStep === 1 ? (
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="mb-6 relative mx-auto">
                      <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-muted/20">
                        {startupData.logo_image ? (
                          <img
                            src={startupData.logo_image}
                            alt="Company logo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <div className="text-4xl mb-2">🏢</div>
                            <div className="text-xs text-muted-foreground">Upload Logo</div>
                          </div>
                        )}
                      </div>
                      <label 
                        htmlFor="logo_image" 
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </label>
                      <input
                        id="logo_image"
                        name="logo_image"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="official_name">Official Name</Label>
                      <Input
                        id="official_name"
                        name="official_name"
                        value={startupData.official_name}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website_link">Website</Label>
                      <Input
                        id="website_link"
                        name="website_link"
                        type="url"
                        value={startupData.website_link}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year_of_incorporation">Year of Incorporation</Label>
                      <Input
                        id="year_of_incorporation"
                        name="year_of_incorporation"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={startupData.year_of_incorporation}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location_city">City</Label>
                      <Input
                        id="location_city"
                        name="location_city"
                        value={startupData.location_city}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_mail">Contact Email</Label>
                      <Input
                        id="contact_mail"
                        name="contact_mail"
                        type="email"
                        value={startupData.contact_mail}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_number">Contact Number</Label>
                      <Input
                        id="contact_number"
                        name="contact_number"
                        type="tel"
                        value={startupData.contact_number}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Select 
                        name="domain" 
                        value={startupData.domain}
                        onValueChange={(value) => setStartupData(prev => ({ ...prev, domain: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAIN_OPTIONS.map((domain) => (
                            <SelectItem key={domain} value={domain}>
                              {domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="summary">Company Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={startupData.summary}
                        onChange={handleStartupDataChange}
                        className="h-32"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="founders_name">Full Name</Label>
                      <Input
                        id="founders_name"
                        name="founders_name"
                        value={startupData.founders_name}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="founders_birth_year">Birth Year</Label>
                      <Input
                        id="founders_birth_year"
                        name="founders_birth_year"
                        type="number"
                        min="1940"
                        max="2005"
                        value={startupData.founders_birth_year}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="founders_email">Email</Label>
                      <Input
                        id="founders_email"
                        name="founders_email"
                        type="email"
                        value={startupData.founders_email}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="founders_whatsapp">WhatsApp Number</Label>
                      <Input
                        id="founders_whatsapp"
                        name="founders_whatsapp"
                        type="tel"
                        value={startupData.founders_whatsapp}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="founders_linkedin">LinkedIn Profile</Label>
                      <Input
                        id="founders_linkedin"
                        name="founders_linkedin"
                        type="url"
                        value={startupData.founders_linkedin}
                        onChange={handleStartupDataChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              )}

              <CardFooter>
                {startupStep === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => setStartupStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button className="flex-1" type="submit" disabled={isLoading}>
                  {isLoading 
                    ? "Completing Setup..." 
                    : startupStep === 1 
                      ? "Next" 
                      : "Complete Setup"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
