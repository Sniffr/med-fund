"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    MoreHorizontal,
    Pencil,
    Search,
    Trash2,
    XCircle
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {useQuery} from "@tanstack/react-query";
import {fetchCampaigns} from "@/lib/api";

const AllCampaigns = () => {

    // get all campaigns from server
    const {data} = useQuery({
        queryKey: ["campaigns"],
        queryFn: () => fetchCampaigns({
            limit: 10,
            page: 1,
        })
    })

    return (
            <Card>
                <CardHeader>
                    <CardTitle>All Campaigns</CardTitle>
                    <CardDescription>View and manage all campaigns on the platform</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
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
                            <Table className="h-[70vh]">
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
                                    {data?.campaigns.map((campaign) => (
                                        <TableRow key={campaign._id}>
                                            <TableCell className="font-medium">{campaign._id}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{campaign.title}</span>
                                                    <span className="text-xs text-muted-foreground">{campaign.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{campaign.creator}</TableCell>
                                            <TableCell>{campaign.createdAt}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={campaign.status} verified={campaign.status} />
                                            </TableCell>
                                            <TableCell className="text-right">${campaign.goalAmount?.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                ${campaign.currentAmount?.toLocaleString()}
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
    );
};

function StatusBadge({ status, verified }: { status: string; verified: boolean }) {
    if (status === "verified") {
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

export default AllCampaigns;