"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DocumentUploadProps {
  campaignId: string
  onUploadComplete?: () => void
}

export function DocumentUpload({ campaignId, onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!file || !documentType) {
      toast({
        title: "Missing information",
        description: "Please select a file and document type",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", documentType)
      if (description) {
        formData.append("description", description)
      }

      const response = await fetch(`/api/campaigns/${campaignId}/documents/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to upload document")
      }

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      })

      // Reset form
      setFile(null)
      setDocumentType("")
      setDescription("")

      // Call callback if provided
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleUpload}>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload medical documents, ID proof, or other supporting documents for your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical_report">Medical Report</SelectItem>
                <SelectItem value="id_proof">ID Proof</SelectItem>
                <SelectItem value="proof_of_treatment">Proof of Treatment</SelectItem>
                <SelectItem value="cost_estimate">Cost Estimate</SelectItem>
                <SelectItem value="insurance_document">Insurance Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide a brief description of this document"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX (max 10MB)</p>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  type="button"
                >
                  Select File
                </Button>
              </div>
            ) : (
              <div className="border rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading || !file || !documentType}>
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
