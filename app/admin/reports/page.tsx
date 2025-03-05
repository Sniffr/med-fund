import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Printer } from "lucide-react"
import { DonationChart } from "@/components/admin/donation-chart"
import { CampaignCategoryChart } from "@/components/admin/campaign-category-chart"
import { UserGrowthChart } from "@/components/admin/user-growth-chart"
import { DonationsByLocationChart } from "@/components/admin/donations-by-location-chart"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Donations" value="$1.2M" change="+12%" isPositive={true} />
            <StatsCard title="Active Campaigns" value="5,231" change="+8%" isPositive={true} />
            <StatsCard title="New Users" value="1,543" change="+18%" isPositive={true} />
            <StatsCard title="Avg. Donation" value="$85" change="-3%" isPositive={false} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
                <CardDescription>Daily donation volume for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <DonationChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Campaigns by Category</CardTitle>
                <CardDescription>Distribution of campaigns across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <CampaignCategoryChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <UserGrowthChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Donations by Location</CardTitle>
                <CardDescription>Geographic distribution of donations</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationsByLocationChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Donation Analytics</CardTitle>
              <CardDescription>Detailed analysis of donation patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Donation analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Performance metrics for campaigns across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>User growth, engagement, and demographic data</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({
  title,
  value,
  change,
  isPositive,
}: {
  title: string
  value: string
  change: string
  isPositive: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{value}</p>
            <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

