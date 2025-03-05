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
  ArrowUpDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  XCircle,
} from "lucide-react"

export default function DonationsPage() {
  // This would normally come from a database
  const donations = [
    {
      id: "DON-001",
      donor: "John Smith",
      email: "john.smith@example.com",
      campaign: "Heart Surgery for David",
      amount: 500,
      date: "2023-10-16",
      status: "completed",
      paymentMethod: "credit_card",
    },
    {
      id: "DON-002",
      donor: "Anonymous",
      email: "anonymous@example.com",
      campaign: "Leukemia Treatment for Emma",
      amount: 1000,
      date: "2023-10-18",
      status: "completed",
      paymentMethod: "paypal",
    },
    {
      id: "DON-003",
      donor: "Emily Wilson",
      email: "emily.wilson@example.com",
      campaign: "Kidney Transplant for Michael",
      amount: 250,
      date: "2023-10-20",
      status: "completed",
      paymentMethod: "credit_card",
    },
    {
      id: "DON-004",
      donor: "Michael Brown",
      email: "michael.brown@example.com",
      campaign: "Specialized Therapy for Autism",
      amount: 100,
      date: "2023-10-22",
      status: "completed",
      paymentMethod: "credit_card",
    },
    {
      id: "DON-005",
      donor: "Anonymous",
      email: "anonymous@example.com",
      campaign: "Prosthetic Leg for War Veteran",
      amount: 50,
      date: "2023-10-24",
      status: "completed",
      paymentMethod: "paypal",
    },
    {
      id: "DON-006",
      donor: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      campaign: "Rare Disease Treatment Fund",
      amount: 300,
      date: "2023-10-25",
      status: "processing",
      paymentMethod: "credit_card",
    },
    {
      id: "DON-007",
      donor: "Robert Davis",
      email: "robert.davis@example.com",
      campaign: "Medical Equipment for Home Care",
      amount: 150,
      date: "2023-10-26",
      status: "completed",
      paymentMethod: "paypal",
    },
    {
      id: "DON-008",
      donor: "Jessica Lee",
      email: "jessica.lee@example.com",
      campaign: "Diabetes Management for Children",
      amount: 200,
      date: "2023-10-27",
      status: "failed",
      paymentMethod: "credit_card",
    },
    {
      id: "DON-009",
      donor: "Thomas Wilson",
      email: "thomas.wilson@example.com",
      campaign: "Mental Health Support Program",
      amount: 75,
      date: "2023-10-28",
      status: "completed",
      paymentMethod: "credit_card",
    },
    {
      id: "DON-010",
      donor: "Amanda Clark",
      email: "amanda.clark@example.com",
      campaign: "Heart Surgery for David",
      amount: 125,
      date: "2023-10-29",
      status: "processing",
      paymentMethod: "paypal",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Donation Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">Generate Report</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
          <CardDescription>View and manage all donations on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search donations..." className="w-full pl-8" />
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{donation.donor}</span>
                          <span className="text-xs text-muted-foreground">{donation.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{donation.campaign}</TableCell>
                      <TableCell className="font-medium">${donation.amount.toLocaleString()}</TableCell>
                      <TableCell>{donation.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={donation.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentMethodBadge method={donation.paymentMethod} />
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
                            {donation.status === "processing" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark as Failed
                                </DropdownMenuItem>
                              </>
                            )}
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

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
        Completed
      </Badge>
    )
  }

  if (status === "processing") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">
        Processing
      </Badge>
    )
  }

  if (status === "failed") {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">Failed</Badge>
  }

  return null
}

function PaymentMethodBadge({ method }: { method: string }) {
  if (method === "credit_card") {
    return (
      <Badge variant="outline" className="font-normal">
        Credit Card
      </Badge>
    )
  }

  if (method === "paypal") {
    return (
      <Badge variant="outline" className="font-normal">
        PayPal
      </Badge>
    )
  }

  return null
}

