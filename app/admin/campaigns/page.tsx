import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"

export default function CampaignsPage() {
  // This would normally come from a database
  const campaigns = [
    {
      id: "CAM-001",
      title: "Heart Surgery for David",
      category: "Surgery",
      creator: "Sarah Johnson",
      createdAt: "2023-10-15",
      goal: 25000,
      raised: 15000,
      status: "active",
      verified: true,
    },
    {
      id: "CAM-002",
      title: "Leukemia Treatment for Emma",
      category: "Cancer Treatment",
      creator: "John Smith",
      createdAt: "2023-10-12",
      goal: 50000,
      raised: 32000,
      status: "active",
      verified: true,
    },
    {
      id: "CAM-003",
      title: "Kidney Transplant for Michael",
      category: "Transplant",
      creator: "Emily Wilson",
      createdAt: "2023-10-10",
      goal: 60000,
      raised: 45000,
      status: "active",
      verified: true,
    },
    {
      id: "CAM-004",
      title: "Specialized Therapy for Autism",
      category: "Therapy",
      creator: "Robert Brown",
      createdAt: "2023-10-08",
      goal: 20000,
      raised: 12000,
      status: "active",
      verified: true,
    },
    {
      id: "CAM-005",
      title: "Prosthetic Leg for War Veteran",
      category: "Prosthetics",
      creator: "Michael Davis",
      createdAt: "2023-10-05",
      goal: 15000,
      raised: 8000,
      status: "active",
      verified: true,
    },
    {
      id: "CAM-006",
      title: "Rare Disease Treatment Fund",
      category: "Rare Disease",
      creator: "Jessica Lee",
      createdAt: "2023-10-03",
      goal: 40000,
      raised: 28000,
      status: "active",
      verified: true,
    },
    {
      id: "CAM-007",
      title: "Medical Equipment for Home Care",
      category: "Equipment",
      creator: "Thomas Wilson",
      createdAt: "2023-10-01",
      goal: 10000,
      raised: 3000,
      status: "pending",
      verified: false,
    },
    {
      id: "CAM-008",
      title: "Diabetes Management for Children",
      category: "Chronic Condition",
      creator: "Amanda Clark",
      createdAt: "2023-09-28",
      goal: 12000,
      raised: 5000,
      status: "pending",
      verified: false,
    },
    {
      id: "CAM-009",
      title: "Mental Health Support Program",
      category: "Mental Health",
      creator: "David Miller",
      createdAt: "2023-09-25",
      goal: 15000,
      raised: 7000,
      status: "rejected",
      verified: false,
    },
    {
      id: "CAM-010",
      title: "Cancer Treatment for John",
      category: "Cancer Treatment",
      creator: "Mary Johnson",
      createdAt: "2023-09-22",
      goal: 30000,
      raised: 0,
      status: "pending",
      verified: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">Add Campaign</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>View and manage all campaigns on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search campaigns..." className="w-full pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Goal</TableHead>
                    <TableHead className="text-right">Raised</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{campaign.title}</span>
                          <span className="text-xs text-muted-foreground">{campaign.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.creator}</TableCell>
                      <TableCell>{campaign.createdAt}</TableCell>
                      <TableCell>
                        <StatusBadge status={campaign.status} verified={campaign.verified} />
                      </TableCell>
                      <TableCell className="text-right">${campaign.goal.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        ${campaign.raised.toLocaleString()}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Campaign
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {campaign.status === "pending" && (
                              <>
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {campaign.status === "active" && (
                              <DropdownMenuItem className="text-orange-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1</strong> to <strong>10</strong> of <strong>100</strong> results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
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
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status, verified }: { status: string; verified: boolean }) {
  if (status === "active") {
    return (
      <div className="flex flex-col gap-1">
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
          Active
        </Badge>
        {verified && (
          <Badge variant="outline" className="border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>
    )
  }

  if (status === "pending") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">
        Pending Review
      </Badge>
    )
  }

  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">Rejected</Badge>
    )
  }

  if (status === "completed") {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
        Completed
      </Badge>
    )
  }

  return null
}

