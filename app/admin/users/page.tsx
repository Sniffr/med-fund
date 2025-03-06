"use client"

import { useState, useEffect } from "react"
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

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  campaigns?: number;
  donations?: number;
  createdAt: string;
  joinedAt?: string;
  avatar?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Placeholder users for initial render or fallback
  const placeholderUsers: User[] = [
    {
      _id: "USR-001",
      id: "USR-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "admin",
      status: "active",
      campaigns: 3,
      donations: 12,
      createdAt: "2023-01-15T00:00:00.000Z",
      joinedAt: "2023-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      _id: "USR-002",
      id: "USR-002",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "user",
      status: "active",
      campaigns: 1,
      donations: 8,
      createdAt: "2023-02-20T00:00:00.000Z",
      joinedAt: "2023-02-20",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      _id: "USR-003",
      id: "USR-003",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      role: "user",
      status: "active",
      campaigns: 2,
      donations: 5,
      createdAt: "2023-03-10T00:00:00.000Z",
      joinedAt: "2023-03-10",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      _id: "USR-004",
      id: "USR-004",
      name: "Robert Brown",
      email: "robert.brown@example.com",
      role: "moderator",
      status: "active",
      campaigns: 0,
      donations: 15,
      createdAt: "2023-04-05T00:00:00.000Z",
      joinedAt: "2023-04-05",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      _id: "USR-005",
      id: "USR-005",
      name: "Michael Davis",
      email: "michael.davis@example.com",
      role: "user",
      status: "suspended",
      campaigns: 1,
      donations: 3,
      createdAt: "2023-05-12T00:00:00.000Z",
      joinedAt: "2023-05-12",
      avatar: "/placeholder.svg?height=32&width=32",
    }
  ]
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      if (roleFilter !== 'all') {
        queryParams.append('role', roleFilter);
      }
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        setTotalUsers(data.total || 0);
      } else {
        console.error('Error fetching users: API returned non-OK status');
        // Set placeholder data as fallback
        setUsers(placeholderUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Set placeholder data as fallback
      setUsers(placeholderUsers);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };
  
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const handleEditUser = (userId: string | undefined) => {
    if (!userId) return;
    // This would navigate to an edit user page or open a modal
    console.log(`Edit user with ID: ${userId}`);
  };
  
  const handleDeleteUser = (userId: string | undefined) => {
    if (!userId) return;
    // This would show a confirmation dialog before deleting
    if (confirm('Are you sure you want to delete this user?')) {
      console.log(`Delete user with ID: ${userId}`);
      // After successful deletion, refresh the user list
      fetchUsers();
    }
  };
  
  const handleChangeRole = (userId: string | undefined, newRole: string) => {
    if (!userId) return;
    // This would update the user's role
    console.log(`Change role of user ${userId} to ${newRole}`);
    // After successful update, refresh the user list
    fetchUsers();
  };
  
  const handleChangeStatus = (userId: string | undefined, newStatus: string) => {
    if (!userId) return;
    // This would update the user's status
    console.log(`Change status of user ${userId} to ${newStatus}`);
    // After successful update, refresh the user list
    fetchUsers();
  };

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
                <form onSubmit={handleSearch} className="flex w-full sm:w-auto items-center gap-2">
                  <div className="relative w-full sm:w-[300px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search users..." 
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>
              </div>
              <div className="flex items-center gap-2">
                <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
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
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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

            {loading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No users found</p>
                {searchQuery && (
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('');
                      fetchUsers();
                    }}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <>
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
                        <TableRow key={user._id || user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || `/placeholder.svg?height=32&width=32`} alt={user.name} />
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
                          <TableCell>{user.joinedAt || new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">{user.campaigns || 0}</TableCell>
                          <TableCell className="text-center">{user.donations || 0}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleEditUser(user._id || user.id)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem 
                                    className="text-orange-600"
                                    onClick={() => handleChangeStatus(user._id || user.id, 'suspended')}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : user.status === "suspended" ? (
                                  <DropdownMenuItem 
                                    className="text-green-600"
                                    onClick={() => handleChangeStatus(user._id || user.id, 'active')}
                                  >
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
                    Showing <strong>{(currentPage - 1) * 10 + 1}</strong> to{" "}
                    <strong>{Math.min(currentPage * 10, totalUsers)}</strong> of{" "}
                    <strong>{totalUsers}</strong> results
                  </div>
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button 
                          key={pageNumber}
                          variant="outline" 
                          size="sm" 
                          className={pageNumber === currentPage ? "bg-primary text-primary-foreground" : ""}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
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
              </>
            )}
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

