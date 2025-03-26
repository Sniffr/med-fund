"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCampaigns } from "@/lib/api.js"

export default function FeaturedCampaigns() {
  const [activeTab, setActiveTab] = useState("urgent")
  const [campaignsData, setCampaignsData] = useState<{
    urgent: any[];
    trending: any[];
    recent: any[];
  }>({
    urgent: [],
    trending: [],
    recent: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true)
        
        // Try using the API helper first
        if (typeof fetchCampaigns === 'function') {
          // Fetch urgent campaigns (those with close deadlines)
          const urgentResponse = await fetchCampaigns({ 
            page: 1,
            limit: 3,
            category: '',
            sort: 'timeline.endDate',
            status: 'active'
          })
          
          // Fetch trending campaigns (those with highest percentage funded)
          const trendingResponse = await fetchCampaigns({ 
            page: 1,
            limit: 3,
            category: '',
            sort: 'raised',
            status: 'active'
          })
          
          // Fetch recent campaigns
          const recentResponse = await fetchCampaigns({ 
            page: 1,
            limit: 3,
            category: '',
            sort: 'createdAt',
            status: 'active'
          })
          
          setCampaignsData({
            urgent: (urgentResponse as any).campaigns?.map(formatCampaign) || [],
            trending: (trendingResponse as any).campaigns?.map(formatCampaign) || [],
            recent: (recentResponse as any).campaigns?.map(formatCampaign) || []
          })
        } else {
          // Fallback to direct fetch if API helper is not available
          // Fetch urgent campaigns (those with close deadlines)
          const urgentResponse = await fetch('/api/campaigns?featured=true&limit=3')
          const urgentData = await urgentResponse.json()
          
          // Fetch trending campaigns (those with highest amount raised)
          const trendingResponse = await fetch('/api/campaigns?sort=currentAmount&limit=3')
          const trendingData = await trendingResponse.json()
          
          // Fetch recent campaigns
          const recentResponse = await fetch('/api/campaigns?limit=3')
          const recentData = await recentResponse.json()
          
          setCampaignsData({
            urgent: formatCampaigns(urgentData),
            trending: formatCampaigns(trendingData.campaigns || []),
            recent: formatCampaigns(recentData.campaigns || [])
          })
        }
      } catch (error) {
        console.error("Error loading campaigns:", error)
        setCampaignsData(sampleCampaigns)
      } finally {
        setLoading(false)
      }
    }
    
    loadCampaigns()
  }, [])
  
  // Helper function to format campaign data
  const formatCampaign = (campaign: any) => {
    const percentFunded = campaign.goal > 0 
      ? Math.round((campaign.amountRaised / campaign.goal) * 100) 
      : 0
      
    // Calculate days left (default 30 days from creation)
    const createdAt = new Date(campaign.createdAt)
    const endDate = new Date(createdAt)
    endDate.setDate(endDate.getDate() + 30)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    
    return {
      id: campaign._id,
      title: campaign.title,
      category: campaign.category,
      image: campaign.imageUrl || "/placeholder.svg?height=200&width=300", // Default image
      raised: campaign.raised || campaign.currentAmount || 0,
      goal: campaign.goal || 0,
      daysLeft,
      percentFunded
    }
  }
  
  // Helper function to format campaign data from direct API
  const formatCampaigns = (campaigns: any[]) => {
    if (!Array.isArray(campaigns)) return []
    
    return campaigns.map((campaign) => {
      const percentFunded = campaign.goal > 0 
        ? Math.round((campaign.currentAmount / campaign.goal) * 100) 
        : 0
        
      // Calculate days left (default 30 days from creation)
      const createdAt = new Date(campaign.createdAt)
      const endDate = new Date(createdAt)
      endDate.setDate(endDate.getDate() + 30)
      const today = new Date()
      const diffTime = endDate.getTime() - today.getTime()
      const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
      
      return {
        id: campaign._id,
        title: campaign.title,
        category: campaign.category,
        image: campaign.imageUrl || "/placeholder.svg?height=200&width=300",
        raised: campaign.currentAmount || 0,
        goal: campaign.goal || 0,
        daysLeft,
        percentFunded
      }
    })
  }
  
  // Sample data as fallback
  const sampleCampaigns = {
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
      <div className="container mx-auto px-4 md:px-6">
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            Object.keys(campaignsData).map((tabKey) => (
              <TabsContent key={tabKey} value={tabKey} className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {campaignsData[tabKey as keyof typeof campaignsData].length > 0 ? (
                    campaignsData[tabKey as keyof typeof campaignsData].map((campaign: any) => (
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
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p className="text-gray-500">No campaigns found in this category.</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href={`/campaigns?category=${activeTab}`}>
                      View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Campaigns
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            ))
          )}
        </Tabs>
      </div>
    </section>
  )
}
