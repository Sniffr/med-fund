"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface Update {
  _id: string
  title: string
  content: string
  createdAt: string
  userId: string
}

interface UpdateListProps {
  campaignId: string
}

export function UpdateList({ campaignId }: UpdateListProps) {
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()

  const fetchUpdates = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/updates`)
      if (!response.ok) {
        throw new Error("Failed to fetch updates")
      }
      const data = await response.json()
      setUpdates(data)
    } catch (error) {
      console.error("Error fetching updates:", error)
      toast({
        title: "Error",
        description: "Failed to load campaign updates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpdates()
  }, [campaignId])

  if (loading) {
    return <div className="py-4 text-center">Loading updates...</div>
  }

  if (updates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign Updates</CardTitle>
          <CardDescription>No updates have been posted yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Updates</CardTitle>
        <CardDescription>Latest news and progress from this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {updates.map((update, index) => (
            <div key={update._id}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{update.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(update.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  {update.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
              {index < updates.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
