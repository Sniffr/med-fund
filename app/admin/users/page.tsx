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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Lock,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  Unlock,
  UserCog,
} from "lucide-react"

export default function UsersPage() {
  // This would normally come from a database
  const users = [
    {
      id: "USR-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "admin",
      status: "active",
      campaigns: 3,
      donations: 12,
      joinedAt: "2023-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-002",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "user",
      status: "active",
      campaigns: 1,
      donations: 8,
      joinedAt: "2023-02-20",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-003",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      role: "user",
      status: "active",
      campaigns: 2,
      donations: 5,
      joinedAt: "2023-03-10",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-004",
      name: "Robert Brown",
      email: "robert.brown@example.com",
      role: "moderator",
      status: "active",
      campaigns: 0,
      donations: 15,
      joinedAt: "2023-04-05",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-005",
      name: "Michael Davis",
      email: "michael.davis@example.com",
      role: "user",
      status: "suspended",
      campaigns: 1,
      donations: 3,
      joinedAt: "2023-05-12",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-006",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "user",
      status: "active",
      campaigns: 1,
      donations: 7,
      joinedAt: "2023-06-18",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-007",
      name: "Thomas Wilson",
      email: "thomas.wilson@example.com",
      role: "user",
      status: "active",
      campaigns: 1,
      donations: 2,
      joinedAt: "2023-07-22",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-008",
      name: "Amanda Clark",
      email: "amanda.clark@example.com",
      role: "user",
      status: "active",
      campaigns: 1,
      donations: 4,
      joinedAt: "2023-08-30",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-009",
      name: "David Miller",
      email: "david.miller@example.com",
      role: "user",
      status: "inactive",
      campaigns: 0,
      donations: 0,
      joinedAt: "2023-09-05",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "USR-010",
      name: "Mary Johnson",
      email: "mary.johnson@example.com",
      role: "user",
      status: "active",
      campaigns: 1,
      donations: 6,
      joinedAt: "2023-10-01",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">Add User</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search users..." className="w-full pl-8" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-center">Campaigns</TableHead>
                    <TableHead className="text-center">Donations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>{user.joinedAt}</TableCell>
                      <TableCell className="text-center">{user.campaigns}</TableCell>
                      <TableCell className="text-center">{user.donations}</TableCell>
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
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-orange-600">
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : user.status === "suspended" ? (
                              <DropdownMenuItem className="text-green-600">
                                <Unlock className="mr-2 h-4 w-4" />
                                Reactivate User
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
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

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">
        <Shield className="mr-1 h-3 w-3" />
        Admin
      </Badge>
    )
  }

  if (role === "moderator") {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
        <Shield className="mr-1 h-3 w-3" />
        Moderator
      </Badge>
    )
  }

  return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300">User</Badge>
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
        Active
      </Badge>
    )
  }

  if (status === "suspended") {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">Suspended</Badge>
    )
  }

  if (status === "inactive") {
    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
        Inactive
      </Badge>
    )
  }

  return null
}

