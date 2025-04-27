import Link from "next/link"
import { ArrowRight, Briefcase, GraduationCap, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-12 sm:h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 font-bold transition-transform hover:scale-105">
            <span className="text-base sm:text-lg md:text-xl tracking-tight">BITS Nexus</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm md:text-base hover:bg-muted/50">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="text-xs sm:text-sm md:text-base shadow-sm transition-all hover:shadow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-6 sm:py-8 md:py-12 lg:py-24 xl:py-32">
          <div className="container px-3 sm:px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6 text-center">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
                  Connect Startups with BITS Talent
                </h1>
                <p className="mx-auto max-w-[700px] text-xs sm:text-sm md:text-base text-muted-foreground">
                  BITS Nexus bridges the gap between innovative startups and talented BITS students. Find your perfect
                  internship or your next star intern.
                </p>
              </div>
              <div className="space-x-3 sm:space-x-4">
                <Link href="/auth/signup">
                  <Button className="px-3 sm:px-4 md:px-8 text-xs sm:text-sm md:text-base shadow-md transition-all hover:shadow-lg">
                    Get Started <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-6 sm:py-8 md:py-12 lg:py-24 xl:py-32 bg-muted/50">
          <div className="container px-3 sm:px-4 md:px-6">
            <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 rounded-lg border border-border bg-background p-3 sm:p-4 md:p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">For Students</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Discover internship opportunities at innovative startups. Build your portfolio and gain real-world
                  experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 rounded-lg border border-border bg-background p-3 sm:p-4 md:p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">For Startups</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Connect with talented BITS students. Find the perfect interns to help grow your business.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4 rounded-lg border border-border bg-background p-3 sm:p-4 md:p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold">Seamless Matching</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Our platform makes it easy to find the perfect match. Apply with a click and track your applications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-muted/20">
        <div className="container flex flex-col gap-3 py-4 sm:py-6 md:flex-row md:gap-6 md:py-8">
          <div className="flex-1 space-y-2 sm:space-y-3">
            <div className="font-bold tracking-tight">BITS Nexus</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connecting BITS students with innovative startups for meaningful internships.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <div className="font-medium">Links</div>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="container py-3 sm:py-4 text-center text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} BITS Nexus. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
