"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturedCampaigns() {
  const [activeTab, setActiveTab] = useState("urgent")

  const campaigns = {
    urgent: [
      {
        id: 1,
        title: "Emergency Heart Surgery for David",
        category: "Surgery",
        image: "/placeholder.svg?height=200&width=300",
        raised: 15000,
        goal: 25000,
        daysLeft: 5,
        percentFunded: 60,
      },
      {
        id: 2,
        title: "Leukemia Treatment for Emma",
        category: "Cancer Treatment",
        image: "/placeholder.svg?height=200&width=300",
        raised: 32000,
        goal: 50000,
        daysLeft: 12,
        percentFunded: 64,
      },
      {
        id: 3,
        title: "Kidney Transplant for Michael",
        category: "Transplant",
        image: "/placeholder.svg?height=200&width=300",
        raised: 45000,
        goal: 60000,
        daysLeft: 8,
        percentFunded: 75,
      },
    ],
    trending: [
      {
        id: 4,
        title: "Specialized Therapy for Autism",
        category: "Therapy",
        image: "/placeholder.svg?height=200&width=300",
        raised: 12000,
        goal: 20000,
        daysLeft: 15,
        percentFunded: 60,
      },
      {
        id: 5,
        title: "Prosthetic Leg for War Veteran",
        category: "Prosthetics",
        image: "/placeholder.svg?height=200&width=300",
        raised: 8000,
        goal: 15000,
        daysLeft: 20,
        percentFunded: 53,
      },
      {
        id: 6,
        title: "Rare Disease Treatment Fund",
        category: "Rare Disease",
        image: "/placeholder.svg?height=200&width=300",
        raised: 28000,
        goal: 40000,
        daysLeft: 18,
        percentFunded: 70,
      },
    ],
    recent: [
      {
        id: 7,
        title: "Medical Equipment for Home Care",
        category: "Equipment",
        image: "/placeholder.svg?height=200&width=300",
        raised: 3000,
        goal: 10000,
        daysLeft: 25,
        percentFunded: 30,
      },
      {
        id: 8,
        title: "Diabetes Management for Children",
        category: "Chronic Condition",
        image: "/placeholder.svg?height=200&width=300",
        raised: 5000,
        goal: 12000,
        daysLeft: 22,
        percentFunded: 42,
      },
      {
        id: 9,
        title: "Mental Health Support Program",
        category: "Mental Health",
        image: "/placeholder.svg?height=200&width=300",
        raised: 7000,
        goal: 15000,
        daysLeft: 30,
        percentFunded: 47,
      },
    ],
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Campaigns</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Browse through campaigns that need your support right now.
            </p>
          </div>
        </div>

        <Tabs defaultValue="urgent" className="mt-8">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="urgent" onClick={() => setActiveTab("urgent")}>
                Urgent Needs
              </TabsTrigger>
              <TabsTrigger value="trending" onClick={() => setActiveTab("trending")}>
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" onClick={() => setActiveTab("recent")}>
                Recently Added
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.keys(campaigns).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {campaigns[tabKey as keyof typeof campaigns].map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={campaign.image || "/placeholder.svg"}
                        alt={campaign.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2">{campaign.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${campaign.percentFunded}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>${campaign.raised.toLocaleString()} raised</span>
                          <span>${campaign.goal.toLocaleString()} goal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {campaign.daysLeft} days left
                          </span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {campaign.percentFunded}% Funded
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/campaigns/${campaign.id}`}>Donate Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link href={`/campaigns?category=${activeTab}`}>
                    View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Campaigns
                  </Link>
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

