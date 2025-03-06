"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CheckCircle2, Clock, FileText, Heart, Share2, Shield, User } from "lucide-react"
import DonationForm from "@/components/donation-form"
import UpdatesTimeline from "@/components/updates-timeline"
import DocumentVerification from "@/components/document-verification"
import { fetchCampaignById } from "@/lib/api"

export default function CampaignPage({ params }: { params: { id: string } }) {
  interface Campaign {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    category: string;
    image: string;
    raised: number;
    goal: number;
    daysLeft: number;
    percentFunded: number;
    createdAt: string;
    creator: {
      name: string;
      avatar: string;
      relationship: string;
    };
    updates: Array<{
      date: string;
      title: string;
      content: string;
    }>;
    documents: Array<{
      title: string;
      type: string;
      verified: boolean;
      date: string;
    }>;
    donors: Array<{
      name: string;
      amount: number;
      date: string;
      message: string | null;
    }>;
    patient?: any;
    treatmentPlan?: string;
    verificationStatus?: {
      isVerified: boolean;
      verifiedBy: string | null;
      verifiedAt: string | null;
    };
  }
  
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true)
        
        // Fetch campaign data from API
        const response = await fetch(`/api/campaigns/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch campaign: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data) {
          // Calculate percentage funded
          const percentFunded = data.goal > 0 
            ? Math.round((data.amountRaised / data.goal) * 100) 
            : 0
            
          // Calculate days left if end date exists
          let daysLeft = 30 // Default
          if (data.createdAt) {
            const createdAt = new Date(data.createdAt)
            const endDate = new Date(createdAt)
            endDate.setDate(endDate.getDate() + 30)
            const today = new Date()
            const diffTime = endDate.getTime() - today.getTime()
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            daysLeft = daysLeft > 0 ? daysLeft : 0
          }
          
          // Format the campaign data
          setCampaign({
            id: data._id,
            title: data.title,
            description: data.description || '',
            longDescription: data.story || '',
            category: data.category || 'Medical',
            image: data.imageUrl || "/placeholder.svg?height=400&width=800",
            raised: data.amountRaised || 0,
            goal: data.goal || 0,
            daysLeft,
            percentFunded,
            createdAt: new Date(data.createdAt).toLocaleDateString(),
            creator: {
              name: data.userName || "Campaign Creator",
              avatar: "/placeholder.svg?height=40&width=40",
              relationship: data.relationship || "Creator",
            },
            updates: data.updates || [],
            documents: data.documents || [],
            donors: data.donations || [],
            verificationStatus: {
              isVerified: data.status === 'verified',
              verifiedBy: data.verifiedBy || null,
              verifiedAt: data.verifiedAt || null
            }
          })
        } else {
          setError("Campaign not found")
        }
      } catch (err) {
        console.error("Error loading campaign:", err)
        setError("Failed to load campaign details")
      } finally {
        setLoading(false)
      }
    }
    
    loadCampaign()
  }, [params.id])
  
  // Fallback campaign data for development or if API fails
  const fallbackCampaign = {
    id: params.id,
    title: "Heart Surgery for David",
    description:
      "David needs an urgent heart surgery to repair a congenital heart defect. The surgery will improve his quality of life and prevent further complications.",
    longDescription:
      "David was diagnosed with a congenital heart defect at the age of 5. He has been managing with medication, but his condition has worsened in the past year. His doctors have recommended surgery to repair the defect and prevent further complications. The surgery is not fully covered by insurance, and David's family needs help to cover the remaining costs. Your support will help David get the life-saving surgery he needs and give him a chance at a normal, healthy life.",
    category: "Surgery",
    image: "/placeholder.svg?height=400&width=800",
    raised: 15000,
    goal: 25000,
    daysLeft: 5,
    percentFunded: 60,
    createdAt: "2023-10-15",
    creator: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      relationship: "Mother",
    },
    updates: [
      {
        date: "2023-10-15",
        title: "Campaign Created",
        content: "We've started this campaign to help fund David's heart surgery. Thank you for your support!",
      },
      {
        date: "2023-10-20",
        title: "First Doctor Appointment",
        content:
          "David had his first appointment with the cardiac surgeon today. The surgery is scheduled for next month.",
      },
      {
        date: "2023-10-25",
        title: "Pre-Surgery Tests",
        content: "David completed all pre-surgery tests today. Everything looks good for the upcoming procedure.",
      },
    ],
    documents: [
      {
        title: "Medical Diagnosis",
        type: "PDF",
        verified: true,
        date: "2023-09-30",
      },
      {
        title: "Surgery Cost Estimate",
        type: "PDF",
        verified: true,
        date: "2023-10-05",
      },
      {
        title: "Insurance Coverage Details",
        type: "PDF",
        verified: true,
        date: "2023-10-10",
      },
    ],
    donors: [
      {
        name: "John Smith",
        amount: 500,
        date: "2023-10-16",
        message: "Wishing David a speedy recovery!",
      },
      {
        name: "Anonymous",
        amount: 1000,
        date: "2023-10-18",
        message: "Stay strong, David!",
      },
      {
        name: "Emily Wilson",
        amount: 250,
        date: "2023-10-20",
        message: "Sending prayers for a successful surgery.",
      },
      {
        name: "Michael Brown",
        amount: 100,
        date: "2023-10-22",
        message: null,
      },
      {
        name: "Anonymous",
        amount: 50,
        date: "2023-10-24",
        message: "Every bit helps!",
      },
    ],
  }
  
  // Use fallback data if loading or error
  const displayCampaign = campaign || fallbackCampaign

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Campaign Not Found</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  {error}
                </p>
                <Button asChild className="mt-4">
                  <a href="/campaigns">Browse Other Campaigns</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>{displayCampaign.category}</Badge>
                  {displayCampaign.verificationStatus?.isVerified && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Verified
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{displayCampaign.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Created on {displayCampaign.createdAt}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4" />
                  <span>{displayCampaign.daysLeft} days left</span>
                </div>
              </div>

              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={displayCampaign.image || "/placeholder.svg"}
                  alt={displayCampaign.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={displayCampaign.creator?.avatar} alt={displayCampaign.creator?.name || 'Creator'} />
                    <AvatarFallback>{displayCampaign.creator?.name ? displayCampaign.creator.name.charAt(0) : 'C'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{displayCampaign.creator?.name || 'Campaign Creator'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Campaign Creator ({displayCampaign.creator?.relationship || 'Creator'})
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="story">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="story">Story</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="donors">Donors</TabsTrigger>
                </TabsList>
                <TabsContent value="story" className="space-y-4 py-4">
                  <p className="text-gray-500 dark:text-gray-400">{displayCampaign.longDescription}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Patient Information</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {displayCampaign.patient?.description || 
                              `${displayCampaign.patientName || 'Patient'} is a ${displayCampaign.patientAge || ''} year-old 
                              diagnosed with a medical condition that requires treatment.`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Treatment Plan</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {displayCampaign.treatmentPlan || 
                              "The treatment plan includes necessary medical procedures and recovery time."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="updates" className="py-4">
                  <UpdatesTimeline updates={displayCampaign.updates} />
                </TabsContent>
                <TabsContent value="documents" className="py-4">
                  <DocumentVerification documents={displayCampaign.documents} />
                </TabsContent>
                <TabsContent value="donors" className="py-4">
                  <div className="space-y-4">
                    {displayCampaign.donors.map((donor, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>{donor.name === "Anonymous" ? "A" : donor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{donor.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{donor.date}</div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                            >
                              ${donor.amount}
                            </Badge>
                          </div>
                          {donor.message && <p className="mt-2 text-gray-600 dark:text-gray-300">"{donor.message}"</p>}
                        </div>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button variant="outline">View All Donors</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Funding Progress</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {displayCampaign.percentFunded}% Funded
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${displayCampaign.percentFunded}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>${displayCampaign.raised.toLocaleString()} raised</span>
                      <span>${displayCampaign.goal.toLocaleString()} goal</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{displayCampaign.donors.length} donors</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-4 w-4" />
                      <span>{displayCampaign.daysLeft} days left</span>
                    </div>
                  </div>

                  <DonationForm campaignId={displayCampaign.id} />

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Verification Status</h3>
                    </div>
                    <div className="space-y-2">
                      {displayCampaign.verificationStatus?.isVerified ? (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">Medical documentation verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">Healthcare provider confirmed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">Identity verification complete</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-amber-600 dark:text-amber-500">
                          This campaign is pending verification
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Share This Campaign</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Twitter
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" className="w-full">
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.17 5.7l.028 9.2 8.26-4.6z" />
                        <path d="M2.5 2.5h19v19h-19zm9.5 3.25L5.5 12l6.5 6.25L18.5 12z" />
                      </svg>
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Need Help?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    If you have questions about this campaign or how to donate, please contact our support team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
