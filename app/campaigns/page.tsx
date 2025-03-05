import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

export default function CampaignsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Browse Campaigns</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover medical campaigns that need your support and make a difference in someone's life.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input placeholder="Search campaigns..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="cancer">Cancer Treatment</SelectItem>
                    <SelectItem value="transplant">Transplant</SelectItem>
                    <SelectItem value="therapy">Therapy</SelectItem>
                    <SelectItem value="equipment">Medical Equipment</SelectItem>
                    <SelectItem value="chronic">Chronic Conditions</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer">
                Urgent
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Trending
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Recently Added
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Nearly Funded
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Children
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Elderly
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={`/placeholder.svg?height=200&width=300`}
                    alt="Campaign"
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">
                    {["Surgery", "Cancer Treatment", "Transplant", "Therapy", "Equipment", "Chronic Condition"][i % 6]}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    {
                      [
                        "Heart Surgery for David",
                        "Leukemia Treatment for Emma",
                        "Kidney Transplant for Michael",
                        "Specialized Therapy for Autism",
                        "Prosthetic Leg for War Veteran",
                        "Rare Disease Treatment Fund",
                        "Medical Equipment for Home Care",
                        "Diabetes Management for Children",
                        "Mental Health Support Program",
                      ][i]
                    }
                  </h3>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${[60, 64, 75, 30, 53, 70, 30, 42, 47][i]}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>
                        ${[15000, 32000, 45000, 12000, 8000, 28000, 3000, 5000, 7000][i].toLocaleString()} raised
                      </span>
                      <span>
                        ${[25000, 50000, 60000, 20000, 15000, 40000, 10000, 12000, 15000][i].toLocaleString()} goal
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {[5, 12, 8, 15, 20, 18, 25, 22, 30][i]} days left
                      </span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {[60, 64, 75, 30, 53, 70, 30, 42, 47][i]}% Funded
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/campaigns/${i + 1}`}>Donate Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                5
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

