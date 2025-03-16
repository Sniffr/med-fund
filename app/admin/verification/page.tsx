"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, Filter, Search, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function VerificationPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({ priority: 'all', category: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  
  useEffect(() => {
    fetchCampaigns()
  }, [activeTab, filter])
  
  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      // Build query parameters based on active tab and filters
      const queryParams = new URLSearchParams()
      
      if (activeTab === 'pending') {
        queryParams.append('status', 'pending')
        queryParams.append('submittedForVerification', 'true')
      } else if (activeTab === 'urgent') {
        queryParams.append('status', 'pending')
        queryParams.append('priority', 'urgent')
        queryParams.append('submittedForVerification', 'true')
      } else if (activeTab === 'approved') {
        queryParams.append('status', 'verified')
      } else if (activeTab === 'rejected') {
        queryParams.append('status', 'rejected')
      }
      
      if (filter.priority !== 'all') {
        queryParams.append('priority', filter.priority)
      }
      
      if (filter.category !== 'all') {
        queryParams.append('category', filter.category)
      }
      
      if (searchQuery) {
        queryParams.append('search', searchQuery)
      }
      
      const response = await fetch(`/api/admin/campaigns?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }
      
      const data = await response.json()
      setCampaigns(data.campaigns || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching campaigns:', err)
      setError('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }
  
  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to verify campaign')
      }
      
      // Refresh campaigns after successful verification
      fetchCampaigns()
    } catch (err) {
      console.error('Error verifying campaign:', err)
      alert('Failed to verify campaign. Please try again.')
    }
  }
  
  const handleReject = async (id: string) => {
    try {
      const reason = prompt('Please provide a reason for rejection:')
      
      if (reason === null) {
        return // User cancelled
      }
      
      const response = await fetch(`/api/admin/campaigns/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
      
      if (!response.ok) {
        throw new Error('Failed to reject campaign')
      }
      
      // Refresh campaigns after successful rejection
      fetchCampaigns()
    } catch (err) {
      console.error('Error rejecting campaign:', err)
      alert('Failed to reject campaign. Please try again.')
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Verification Queue</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">Process Next</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search campaigns..." className="w-full pl-8" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent" className="relative">
            Urgent
            <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">8</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No pending campaigns found</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <VerificationCard
                  key={campaign._id}
                  _id={campaign._id}
                  title={campaign.title}
                  category={campaign.category}
                  creator={campaign.creator}
                  createdAt={campaign.createdAt}
                  priority={campaign.priority || 'normal'}
                  documents={campaign.verificationStatus?.documents || []}
                  handleVerify={handleVerify}
                  handleReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No urgent campaigns found</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <VerificationCard
                  key={campaign._id}
                  _id={campaign._id}
                  title={campaign.title}
                  category={campaign.category}
                  creator={campaign.creator}
                  createdAt={campaign.createdAt}
                  priority={campaign.priority || 'normal'}
                  documents={campaign.verificationStatus?.documents || []}
                  handleVerify={handleVerify}
                  handleReject={handleReject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No approved campaigns found</div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign._id}>
                  <CardHeader>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>Approved on {new Date(campaign.verifiedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Campaign details will be displayed here.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No rejected campaigns found</div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign._id}>
                  <CardHeader>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>Rejected on {new Date(campaign.rejectedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Rejection reason: {campaign.rejectionReason || 'No reason provided'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VerificationCard({
  _id,
  title,
  category,
  creator,
  createdAt,
  priority,
  documents,
  handleVerify,
  handleReject
}: {
  _id: string;
  title: string;
  category: string;
  creator: any;
  createdAt: string;
  priority: string;
  documents: any[];
  handleVerify: (id: string) => void;
  handleReject: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge
            className={
              priority === "urgent"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                : priority === "high"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            }
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
          <div className="text-sm text-muted-foreground">{_id}</div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {category} • Created by {creator?.name || 'Unknown'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Submitted {createdAt ? new Date(createdAt).toLocaleDateString() : 'recently'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <FileText className="h-4 w-4" />
          <span>{documents?.length || 0} documents to review</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/campaigns/${_id}`}>Review</Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/20"
            onClick={() => handleVerify(_id)}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/20"
            onClick={() => handleReject(_id)}
          >
            <XCircle className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
