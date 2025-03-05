import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Clock, DollarSign, FileWarning, Heart, TrendingUp, Users } from "lucide-react"
import { RecentCampaigns } from "@/components/admin/recent-campaigns"
import { DonationChart } from "@/components/admin/donation-chart"
import { VerificationQueue } from "@/components/admin/verification-queue"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">Refresh</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Campaigns" value="5,231" description="+12% from last month" icon={Heart} trend="up" />
        <StatsCard
          title="Total Donations"
          value="$1.2M"
          description="+8% from last month"
          icon={DollarSign}
          trend="up"
        />
        <StatsCard title="Active Users" value="12,234" description="+18% from last month" icon={Users} trend="up" />
        <StatsCard
          title="Pending Verification"
          value="42"
          description="8 urgent reviews needed"
          icon={Clock}
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Donation Overview</CardTitle>
                <CardDescription>Daily donation volume for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DonationChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Verification Queue</CardTitle>
                <CardDescription>Campaigns awaiting verification</CardDescription>
              </CardHeader>
              <CardContent>
                <VerificationQueue />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-7">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Recently created and updated campaigns</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/campaigns">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <RecentCampaigns />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>View and manage all campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign management content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Queue</CardTitle>
              <CardDescription>Review and verify campaign documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Verification queue content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center">
            <FileWarning className="mr-2 h-5 w-5" />
            Attention Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 dark:text-orange-400">
            There are 8 campaigns with urgent verification needs. Please review them as soon as possible.
          </p>
          <Button
            variant="outline"
            className="mt-2 border-orange-200 bg-white text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-gray-800 dark:hover:bg-orange-900/30"
          >
            Review Urgent Cases
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  description: string
  icon: any
  trend: "up" | "down" | "neutral"
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            {trend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
            {trend === "down" && <TrendingUp className="mr-1 h-3 w-3 text-red-500 rotate-180" />}
            <span
              className={
                trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
              }
            >
              {description}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

