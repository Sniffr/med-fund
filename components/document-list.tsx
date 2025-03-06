"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, DownloadIcon, TrashIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Document {
  _id: string
  type: string
  description: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  status: string
  createdAt: string
}

interface DocumentListProps {
  campaignId: string
  canDelete?: boolean
  onDocumentDeleted?: () => void
}

export function DocumentList({ campaignId, canDelete = false, onDocumentDeleted }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/documents`)
      if (!response.ok) {
        throw new Error("Failed to fetch documents")
      }
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [campaignId])

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/documents/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to delete document")
      }

      // Remove document from state
      setDocuments(documents.filter((doc) => doc._id !== documentId))
      
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully",
      })

      // Call callback if provided
      if (onDocumentDeleted) {
        onDocumentDeleted()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      medical_report: "Medical Report",
      id_proof: "ID Proof",
      cost_estimate: "Cost Estimate",
      insurance_document: "Insurance Document",
      other: "Other Document"
    }
    return types[type] || "Document"
  }

  if (loading) {
    return <div className="py-4 text-center">Loading documents...</div>
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>No documents have been uploaded yet</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Supporting documents for this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-start space-x-3">
                <FileIcon className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium">{getDocumentTypeLabel(document.type)}</p>
                  <p className="text-sm text-gray-500">{document.fileName}</p>
                  {document.description && (
                    <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Uploaded on {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
                
                {canDelete && (
                  <AlertDialog open={deleteId === document._id} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteId(document._id)}>
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this document? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(document._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
