"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchCampaigns } from "@/lib/api"

export default function CampaignsPage() {
  interface Campaign {
    _id: string;
    title: string;
    description?: string;
    category: string;
    image?: string;
    raised: number;
    goal: number;
    timeline?: {
      startDate?: string;
      endDate?: string;
    };
  }
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("")
  
  useEffect(() => {
    loadCampaigns()
  }, [currentPage, category, filter])
  
  const loadCampaigns = async () => {
    try {
      setLoading(true)
      
      // Build filter object
      const filterObj: {
        page: number;
        limit: number;
        status: string;
        category?: string;
        search?: string;
        sort?: string;
      } = {
        page: currentPage,
        limit: 9,
        status: 'active'
      }
      
      // Add category filter if not "all"
      if (category !== "all") {
        filterObj.category = category
      }
      
      // Add search term if present
      if (searchTerm) {
        filterObj.search = searchTerm
      }
      
      // Add sort based on filter
      if (filter === "urgent") {
        filterObj.sort = "timeline.endDate"
      } else if (filter === "trending") {
        filterObj.sort = "raised"
      } else if (filter === "recent") {
        filterObj.sort = "createdAt"
      } else if (filter === "nearlyFunded") {
        filterObj.sort = "percentFunded"
      }
      
      const response = await fetchCampaigns(filterObj)
      
      setCampaigns(response.campaigns || [])
      setTotalPages(response.pagination?.pages || 1)
    } catch (error) {
      console.error("Error loading campaigns:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadCampaigns()
  }
  
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setCurrentPage(1) // Reset to first page when changing category
  }
  
  const handleFilterClick = (filterValue: string) => {
    setFilter(filterValue === filter ? "" : filterValue) // Toggle filter
    setCurrentPage(1) // Reset to first page when changing filter
  }
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
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <Input 
                  placeholder="Search campaigns..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Cancer Treatment">Cancer Treatment</SelectItem>
                    <SelectItem value="Transplant">Transplant</SelectItem>
                    <SelectItem value="Therapy">Therapy</SelectItem>
                    <SelectItem value="Equipment">Medical Equipment</SelectItem>
                    <SelectItem value="Chronic Condition">Chronic Conditions</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={filter === "urgent" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => handleFilterClick("urgent")}
              >
                Urgent
              </Badge>
              <Badge 
                variant={filter === "trending" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => handleFilterClick("trending")}
              >
                Trending
              </Badge>
              <Badge 
                variant={filter === "recent" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => handleFilterClick("recent")}
              >
                Recently Added
              </Badge>
              <Badge 
                variant={filter === "nearlyFunded" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => handleFilterClick("nearlyFunded")}
              >
                Nearly Funded
              </Badge>
              <Badge 
                variant={filter === "children" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => handleFilterClick("children")}
              >
                Children
              </Badge>
              <Badge 
                variant={filter === "elderly" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => handleFilterClick("elderly")}
              >
                Elderly
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {campaigns.map((campaign) => {
                // Calculate percentage funded
                const percentFunded = campaign.goal > 0 
                  ? Math.round((campaign.raised / campaign.goal) * 100) 
                  : 0
                
                // Calculate days left if end date exists
                let daysLeft = 30 // Default
                if (campaign.timeline && campaign.timeline.endDate) {
                  const endDate = new Date(campaign.timeline.endDate)
                  const today = new Date()
                  const diffTime = Number(endDate) - Number(today)
                  daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                  daysLeft = daysLeft > 0 ? daysLeft : 0
                }
                
                return (
                  <Card key={campaign._id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={campaign.image || "/placeholder.svg?height=200&width=300"}
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
                            style={{ width: `${percentFunded}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>${(campaign.raised || 0).toLocaleString()} raised</span>
                          <span>${(campaign.goal || 0).toLocaleString()} goal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {daysLeft} days left
                          </span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {percentFunded}% Funded
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/campaigns/${campaign._id}`}>Donate Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">No campaigns found. Try adjusting your filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  // Show pages around current page
                  let pageNum = i + 1
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i)
                  }
                  
                  return (
                    <Button 
                      key={pageNum}
                      variant="outline" 
                      size="sm"
                      className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

