"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface UpdateFormProps {
  campaignId: string
  onUpdateCreated?: () => void
}

export function UpdateForm({ campaignId, onUpdateCreated }: UpdateFormProps) {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [notifySubscribers, setNotifySubscribers] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your update",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          notifySubscribers,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create update")
      }
      
      toast({
        title: "Update posted",
        description: notifySubscribers 
          ? "Your update has been posted and subscribers have been notified" 
          : "Your update has been posted",
      })
      
      // Reset form
      setTitle("")
      setContent("")
      setNotifySubscribers(true)
      
      // Call callback if provided
      if (onUpdateCreated) {
        onUpdateCreated()
      }
    } catch (error) {
      console.error("Error creating update:", error)
      toast({
        title: "Failed to post update",
        description: error instanceof Error ? error.message : "An error occurred while posting your update",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Post an Update</CardTitle>
          <CardDescription>
            Share progress, thank donors, or provide new information about your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-title">Title</Label>
            <Input
              id="update-title"
              placeholder="Update title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="update-content">Content</Label>
            <Textarea
              id="update-content"
              placeholder="Share your update..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-subscribers"
              checked={notifySubscribers}
              onCheckedChange={(checked) => setNotifySubscribers(checked as boolean)}
            />
            <Label htmlFor="notify-subscribers" className="text-sm font-normal">
              Notify subscribers via email
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
