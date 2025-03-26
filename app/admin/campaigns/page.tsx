import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import AllCampaigns from "@/components/admin/all-campaigns";

export default function CampaignsPage() {

  return (
    <div className="space-y-6 flex flex-col">
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
      <AllCampaigns />
    </div>
  )
}


