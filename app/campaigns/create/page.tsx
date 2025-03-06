"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowRight, CheckCircle, FileUp, Info, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('campaignFormData')
      return savedData ? JSON.parse(savedData) : {
        title: "",
        category: "",
        patientName: "",
        patientAge: "",
        relationship: "",
        goal: "",
        story: "",
        treatmentPlan: "",
        files: [],
      }
    }
    return {
      title: "",
      category: "",
      patientName: "",
      patientAge: "",
      relationship: "",
      goal: "",
      story: "",
      treatmentPlan: "",
      files: [],
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)
    localStorage.setItem('campaignFormData', JSON.stringify(updatedData))
  }

  const handleSelectChange = (name: string, value: string) => {
    const updatedData = { ...formData, [name]: value }
    setFormData(updatedData)
    localStorage.setItem('campaignFormData', JSON.stringify(updatedData))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      // Note: Files can't be stored in localStorage, so we'll just update the state
      setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }))
      // We can store file metadata in localStorage if needed
      const updatedFormData = { ...formData }
      updatedFormData.files = [...formData.files, ...newFiles].map((file: File) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }))
      localStorage.setItem('campaignFormData', JSON.stringify(updatedFormData))
    }
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = formData.files.filter((_: any, i: number) => i !== index)
    const updatedData = {
      ...formData,
      files: updatedFiles
    }
    setFormData(updatedData)
    
    // Update localStorage with file metadata
    const filesMetadata = updatedFiles.map((file: File) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }))
    
    const storageData = { ...formData, files: filesMetadata }
    localStorage.setItem('campaignFormData', JSON.stringify(storageData))
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Create FormData for file uploads
      const formDataObj = new FormData()
      formDataObj.append('title', formData.title)
      formDataObj.append('category', formData.category)
      formDataObj.append('patientName', formData.patientName)
      formDataObj.append('patientAge', formData.patientAge)
      formDataObj.append('relationship', formData.relationship)
      formDataObj.append('goal', formData.goal)
      formDataObj.append('story', formData.story)
      formDataObj.append('treatmentPlan', formData.treatmentPlan)
      
      // Add files to FormData
      formData.files.forEach((file: File, index: number) => {
        formDataObj.append(`files`, file)
      })
      
      // Submit to API
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: formDataObj,
      })
      
      if (response.ok) {
        // Clear localStorage on successful submission
        localStorage.removeItem('campaignFormData')
        alert("Campaign submitted for review!")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || 'Failed to submit campaign'}`)
      }
    } catch (error: any) {
      console.error('Error submitting campaign:', error)
      alert('An error occurred while submitting your campaign')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Create Your Campaign</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Share your medical journey and connect with donors who want to help.
              </p>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep === step
                          ? "bg-primary text-primary-foreground"
                          : currentStep > step
                            ? "bg-primary/20 text-primary"
                            : "bg-gray-200 text-gray-500 dark:bg-gray-800"
                      }`}
                    >
                      {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                    </div>
                    <span className="text-xs mt-1">
                      {step === 1 && "Basic Info"}
                      {step === 2 && "Your Story"}
                      {step === 3 && "Documentation"}
                      {step === 4 && "Review"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full dark:bg-gray-800">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Basic Information"}
                  {currentStep === 2 && "Tell Your Story"}
                  {currentStep === 3 && "Upload Documentation"}
                  {currentStep === 4 && "Review Your Campaign"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Provide basic details about your campaign and the patient."}
                  {currentStep === 2 && "Share your medical journey and treatment plan."}
                  {currentStep === 3 && "Upload medical documentation to verify your campaign."}
                  {currentStep === 4 && "Review all information before submitting."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Campaign Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="E.g., Heart Surgery for David"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Medical Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="cancer">Cancer Treatment</SelectItem>
                            <SelectItem value="transplant">Transplant</SelectItem>
                            <SelectItem value="therapy">Therapy</SelectItem>
                            <SelectItem value="equipment">Medical Equipment</SelectItem>
                            <SelectItem value="chronic">Chronic Condition</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientName">Patient Name</Label>
                          <Input
                            id="patientName"
                            name="patientName"
                            placeholder="Full name"
                            value={formData.patientName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientAge">Patient Age</Label>
                          <Input
                            id="patientAge"
                            name="patientAge"
                            type="number"
                            placeholder="Age"
                            value={formData.patientAge}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="relationship">Your Relationship to Patient</Label>
                        <Select
                          value={formData.relationship}
                          onValueChange={(value) => handleSelectChange("relationship", value)}
                        >
                          <SelectTrigger id="relationship">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="goal">Funding Goal ($)</Label>
                        <Input
                          id="goal"
                          name="goal"
                          type="number"
                          placeholder="Amount needed"
                          value={formData.goal}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Set a realistic goal based on your medical expenses.
                        </p>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          All campaigns undergo verification to ensure authenticity. Be prepared to provide supporting
                          documentation.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="story">Your Medical Journey</Label>
                        <Textarea
                          id="story"
                          name="story"
                          placeholder="Share your medical story in detail..."
                          className="min-h-[200px]"
                          value={formData.story}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Be detailed and authentic. Explain the medical condition, how it has affected your life, and
                          why you need support.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                        <Textarea
                          id="treatmentPlan"
                          name="treatmentPlan"
                          placeholder="Describe your treatment plan, timeline, and expected outcomes..."
                          className="min-h-[150px]"
                          value={formData.treatmentPlan}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Accuracy Matters</AlertTitle>
                        <AlertDescription>
                          Ensure all medical information is accurate. Misrepresentation may result in campaign removal.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Documentation Required</AlertTitle>
                        <AlertDescription>
                          Upload medical documents to verify your campaign. This helps build trust with potential
                          donors.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <Label>Required Documents</Label>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">Medical diagnosis or doctor's note</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">Cost estimate or medical bills</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">Insurance information (if applicable)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                            <span className="text-sm">ID verification (will be requested separately)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="file-upload">Upload Documents</Label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                          <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-8 w-8 text-gray-400" />
                              <p className="font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF, JPG, or PNG (max 10MB per file)
                              </p>
                            </div>
                          </Label>
                        </div>
                      </div>

                      {formData.files && formData.files.length > 0 && (
                        <div className="space-y-2">
                          <Label>Uploaded Files</Label>
                          <div className="space-y-2">
                            {formData.files.map((file: File, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-800"
                              >
                                <div className="flex items-center gap-2">
                                  <FileUp className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        All documents are securely stored and only used for verification purposes. They will not be
                        publicly visible.
                      </p>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Almost Done!</AlertTitle>
                        <AlertDescription>
                          Review your campaign details before submitting for verification.
                        </AlertDescription>
                      </Alert>

                      <Tabs defaultValue="basic">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="basic">Basic Info</TabsTrigger>
                          <TabsTrigger value="story">Your Story</TabsTrigger>
                          <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basic" className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Campaign Title</h4>
                              <p>{formData.title || "Not provided"}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Category</h4>
                              <p>{formData.category || "Not selected"}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Patient Name</h4>
                              <p>{formData.patientName || "Not provided"}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Patient Age</h4>
                              <p>{formData.patientAge || "Not provided"}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Relationship</h4>
                              <p>{formData.relationship || "Not selected"}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Funding Goal</h4>
                              <p>${formData.goal || "0"}</p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="story" className="space-y-4 py-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                              Your Medical Journey
                            </h4>
                            <p className="mt-1 whitespace-pre-line">{formData.story || "Not provided"}</p>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">Treatment Plan</h4>
                            <p className="mt-1 whitespace-pre-line">{formData.treatmentPlan || "Not provided"}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="documents" className="space-y-4 py-4">
                          {formData.files && formData.files.length > 0 ? (
                            <div>
                              <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                                Uploaded Documents
                              </h4>
                              <ul className="mt-2 space-y-1">
                                {formData.files.map((file: File, index: number) => (
                                  <li key={index} className="text-sm">
                                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p>No documents uploaded yet.</p>
                          )}
                        </TabsContent>
                      </Tabs>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary focus:ring-primary" required />
                          <span className="text-sm">
                            I confirm that all information provided is accurate and truthful.
                          </span>
                        </Label>
                        <Label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary focus:ring-primary" required />
                          <span className="text-sm">
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </Label>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                )}

                {currentStep < 4 ? (
                  <Button onClick={nextStep}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" onClick={handleSubmit}>
                    Submit Campaign
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

