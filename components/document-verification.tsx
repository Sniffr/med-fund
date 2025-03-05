import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle } from "lucide-react"

export default function DocumentVerification({
  documents,
}: {
  documents: Array<{ title: string; type: string; verified: boolean; date: string }>
}) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 text-blue-800 rounded-lg dark:bg-blue-900 dark:text-blue-300">
        <p className="text-sm">
          All medical documents have been verified by our team to ensure the authenticity of this campaign.
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
              <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Uploaded on {doc.date}</div>
                </div>
                {doc.verified && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Verification Process</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Our verification process includes:</p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
            <span>Review of all medical documentation by our team</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
            <span>Confirmation with healthcare providers when possible</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
            <span>Verification of treatment costs and insurance coverage</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
            <span>Identity verification of campaign creator</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

