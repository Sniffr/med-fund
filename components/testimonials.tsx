"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        
        // Fetch testimonials from API
        const response = await fetch('/api/testimonials')
        
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data)
          } else {
            // Fallback to sample data if API returns empty array
            setTestimonials(sampleTestimonials)
          }
        } else {
          // Fallback to sample data if API fails
          setTestimonials(sampleTestimonials)
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        // Fallback to sample data on error
        setTestimonials(sampleTestimonials)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTestimonials()
  }, [])
  
  // Sample testimonials as fallback
  const sampleTestimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      role: "Campaign Recipient",
      avatar: "/placeholder.svg?height=40&width=40",
      quote:
        "Thanks to the generous donors on this platform, I was able to afford my heart surgery. The verification process made me feel secure, and the regular updates kept my donors engaged throughout my recovery journey.",
      type: "recipient",
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Donor",
      avatar: "/placeholder.svg?height=40&width=40",
      quote:
        "I've donated to several campaigns on this platform, and I appreciate the transparency. Being able to see medical documentation and follow the patient's journey gives me confidence that my contributions are making a real difference.",
      type: "donor",
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      role: "Healthcare Provider",
      avatar: "/placeholder.svg?height=40&width=40",
      quote:
        "As a healthcare provider, I've seen firsthand how this platform has helped my patients access treatments they couldn't otherwise afford. The verification process is thorough, and the milestone-based fund release ensures proper use of donations.",
      type: "healthcare",
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recipient":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "donor":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "healthcare":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Success Stories</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from patients, donors, and healthcare providers who have experienced the impact of our platform.
            </p>
          </div>
        </div>

        <div className="mt-12 relative">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 md:p-12">
                <Quote className="h-12 w-12 text-primary/20 mb-6" />
                <p className="text-xl md:text-2xl font-medium mb-8">{testimonials[currentIndex].quote}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                    <AvatarFallback>{testimonials[currentIndex].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                    <div
                      className={`text-sm px-2 py-1 rounded-full inline-block mt-1 ${getTypeColor(testimonials[currentIndex].type)}`}
                    >
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No success stories found.</p>
            </div>
          )}

          {!loading && testimonials.length > 0 && (
            <div className="flex justify-center mt-8 space-x-2">
              <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
              {testimonials.map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full p-0 ${
                    currentIndex === index ? "bg-primary border-primary" : "bg-transparent"
                  }`}
                >
                  <span className="sr-only">Go to slide {index + 1}</span>
                </Button>
              ))}
              <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

