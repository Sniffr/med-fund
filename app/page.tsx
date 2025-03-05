import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Shield, Users } from "lucide-react"
import FeaturedCampaigns from "@/components/featured-campaigns"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
                  Connecting Hearts, Healing Lives
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Fund Medical Needs, <span className="text-primary">Change Lives</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our platform connects those in need of medical funding with compassionate donors ready to help. Every
                  contribution makes a difference.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild size="lg">
                  <Link href="/campaigns/create">Start a Campaign</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/campaigns">Donate Now</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob dark:bg-purple-800 dark:opacity-30"></div>
                <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 dark:bg-blue-800 dark:opacity-30"></div>
                <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-800 dark:opacity-30"></div>
                <Card className="relative bg-white dark:bg-gray-950 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Medical support"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge>Medical Treatment</Badge>
                        <div className="text-sm text-gray-500 dark:text-gray-400">73% Funded</div>
                      </div>
                      <h3 className="font-semibold text-lg">Sarah's Cancer Treatment Fund</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: "73%" }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>$36,500 raised</span>
                        <span>$50,000 goal</span>
                      </div>
                      <Button className="w-full mt-2">Donate Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">$12M+</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Funds Raised</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">5,000+</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Campaigns Funded</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">50,000+</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Donors</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-primary">98%</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verification Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Our Platform Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We've built a transparent, secure, and effective way to connect medical needs with generous donors.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card className="bg-white dark:bg-gray-950">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Create Your Campaign</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Share your medical journey, upload documentation, and set your funding goal.
                </p>
                <Link href="/how-it-works" className="text-primary inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-950">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Verification Process</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our team verifies medical documentation to ensure transparency and trust.
                </p>
                <Link href="/verification" className="text-primary inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-950">
              <CardContent className="p-6 space-y-4">
                <div className="p-2 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Receive Donations</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Donors contribute to your campaign and receive updates on your progress.
                </p>
                <Link href="/donation-process" className="text-primary inline-flex items-center">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <FeaturedCampaigns />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Make a Difference?
              </h2>
              <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community of donors and help someone in need today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/campaigns/create">Start a Campaign</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/campaigns">Browse Campaigns</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

