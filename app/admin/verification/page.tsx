import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, Filter, Search, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VerificationPage() {
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <VerificationCard
                key={i}
                id={`VER-00${i + 1}`}
                title={
                  [
                    "Medical Equipment for Home Care",
                    "Diabetes Management for Children",
                    "Mental Health Support Program",
                    "Cancer Treatment for John",
                    "Specialized Therapy for Autism",
                    "Rare Disease Treatment Fund",
                  ][i]
                }
                category={
                  ["Equipment", "Chronic Condition", "Mental Health", "Cancer Treatment", "Therapy", "Rare Disease"][i]
                }
                creator={
                  ["Thomas Wilson", "Amanda Clark", "David Miller", "Mary Johnson", "Robert Brown", "Jessica Lee"][i]
                }
                createdAt={["2023-10-01", "2023-09-28", "2023-09-25", "2023-09-22", "2023-09-20", "2023-09-18"][i]}
                priority={i < 2 ? "urgent" : i < 4 ? "high" : "normal"}
                documents={Math.floor(Math.random() * 3) + 2}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <VerificationCard
                key={i}
                id={`VER-00${i + 1}`}
                title={
                  [
                    "Emergency Heart Surgery for Child",
                    "Urgent Cancer Treatment",
                    "Critical Medication for Rare Disease",
                  ][i]
                }
                category={["Surgery", "Cancer Treatment", "Rare Disease"][i]}
                creator={["Jane Smith", "Robert Johnson", "Emily Davis"][i]}
                createdAt={["2023-10-02", "2023-10-01", "2023-09-30"][i]}
                priority="urgent"
                documents={Math.floor(Math.random() * 3) + 2}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Verifications</CardTitle>
              <CardDescription>Campaigns that have been verified and approved</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Approved verifications will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Verifications</CardTitle>
              <CardDescription>Campaigns that have been rejected during verification</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Rejected verifications will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VerificationCard({
  id,
  title,
  category,
  creator,
  createdAt,
  priority,
  documents,
}: {
  id: string
  title: string
  category: string
  creator: string
  createdAt: string
  priority: "urgent" | "high" | "normal" | "low"
  documents: number
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
          <div className="text-sm text-muted-foreground">{id}</div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {category} • Created by {creator}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Submitted on {createdAt}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <FileText className="h-4 w-4" />
          <span>{documents} documents to review</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/verification/${id}`}>Review</Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/20"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <XCircle className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

