import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure general platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="MediCare" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-url">Platform URL</Label>
                <Input id="platform-url" defaultValue="https://medicare.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" defaultValue="support@medicare.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Platform Description</Label>
                <Textarea
                  id="platform-description"
                  defaultValue="MediCare is a platform that connects those in need of medical funding with compassionate donors ready to help."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Put the platform in maintenance mode
                  </div>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>
                Configure default settings for campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-fee">Platform Fee (%)</Label>
                <Input id="default-fee" type="number" defaultValue="5" />
                <p className="text-sm text-muted-foreground">
                  Percentage fee applied to each donation to cover platform costs
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-goal">Minimum Campaign Goal ($)</Label>
                <Input id="min-goal" type="number" defaultValue="500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-goal">Maximum Campaign Goal ($)</Label>
                <Input id="max-goal" type="number" defaultValue="1000000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-duration">Default Campaign Duration (days)</Label>
                <Input id="campaign-duration" type="number" defaultValue="90" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-approve">Auto-Approve Campaigns</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically approve campaigns without manual review
                  </div>
                </div>
                <Switch id="auto-approve" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Requirements</CardTitle>
              <CardDescription>
                Configure what documentation is required for campaign verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Medical Diagnosis Document</Label>
                  <div className="text-sm text-muted-foreground">
                    Require a medical diagnosis document
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cost Estimate</Label>
                  <div className="text-sm text-muted-foreground">
                    Require a cost estimate from healthcare provider
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Insurance Information</Label>
                  <div className="text-sm text-muted-foreground">
                    Require insurance information if applicable
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ID Verification</Label>
                  <div className="text-sm text-muted-foreground">
                    Require government-issued ID verification
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Healthcare Provider Contact</Label>
                  <div className="text-sm text-muted-foreground">
                    Require contact information for healthcare provider
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Process</CardTitle>
              <CardDescription>
                Configure the verification workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-timeout">Verification Timeout (hours)</Label>
                <Input id="verification-timeout" type="number" defaultValue="48" />
                <p className="text-sm text-muted-foreground">
                  Maximum time allowed for verification before auto-rejection
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-team">Verification Team</Label>
                <Select defaultValue="medical">
                  <SelectTrigger id="verification-team">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Team</SelectItem>
                    <SelectItem value="general">General Verification Team</SelectItem>
                    <SelectItem value="senior">Senior Reviewers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Step Verification</Label>
                  <div className="text-sm text-muted-foreground">
                    Require two separate reviewers to approve a campaign
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>New Campaign Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email when new campaigns are created
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Donation Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email for large donations (>$1000)
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Verification Queue Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email when verification queue exceeds threshold
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Daily Summary</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive daily summary of platform activity
                    </div>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>
                Configure in-app notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Urgent Verification Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Show alerts for urgent verification needs
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Failed Payment Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Show alerts for failed payments
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>New User Registrations</Label>
                    <div className="text-sm text-muted-foreground">
                      Show notifications for new user registrations
                    </div>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure platform security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically log out inactive admin sessions
                    </div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="timeout-duration">Timeout Duration (minutes)</Label>
                <Input id="timeout-duration" type="number" defaultValue="30" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label>IP Restriction</Label>
                    <div className="text-sm text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </div>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                <Textarea
                  id="allowed-ips"
                  placeholder="Enter IP addresses, one per line"
                  className="h-20"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud Prevention</CardTitle>
              <CardDescription>
                Configure fraud detection and prevention settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automated Fraud Detection</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable AI-powered fraud detection system
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="fraud-threshold">Fraud Detection Threshold</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="fraud-threshold">
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (More False Positives)</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High (More False Negatives)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Block Suspicious Accounts</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically block accounts flagged as suspicious
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API keys and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>API Access</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable or disable API access to the platform
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>API Keys</Label>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Production Key</div>
                      <div className="text-sm text-muted-foreground">
                        Created on 2023-10-01
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Active</Badge>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Input
                      value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                    />
                  </div>
                </div>
                <div className="rounded-md border p-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Test Key</div>
                      <div className="text-sm text-muted-foreground">
                        Created on 2023-10-01
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Active</Badge>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Input
                      value="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <Button>Generate New API Key</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Settings</CardTitle>
              <CardDescription>
                Configure webhook endpoints for real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-server.com/webhook"
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook Events</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="webhook-donation" defaultChecked />
                    <Label htmlFor="webhook-donation">Donation Events</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="webhook-campaign" defaultChecked />
                    <Label htmlFor="webhook-campaign">Campaign Events</Label>
                  </div>
                  <div className

