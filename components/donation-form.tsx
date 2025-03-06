"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, DollarSign } from "lucide-react"

export default function DonationForm({ campaignId }: { campaignId: string }) {
  const [amount, setAmount] = useState<string>("")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [donorName, setDonorName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [coverFees, setCoverFees] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setAmount("custom")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const donationAmount = amount === "custom" ? parseFloat(customAmount) : parseFloat(amount)
      
      if (isNaN(donationAmount) || donationAmount <= 0) {
        alert("Please enter a valid donation amount")
        setIsSubmitting(false)
        return
      }
      
      // Calculate final amount with fees if selected
      const finalAmount = coverFees ? donationAmount + 2.5 : donationAmount
      
      // Create donation object
      const donationData = {
        campaignId,
        amount: finalAmount,
        paymentMethod,
        donorName: isAnonymous ? null : donorName,
        email,
        message: message.trim() || null,
        anonymous: isAnonymous,
        status: "completed", // In a real app, this would be 'pending' until payment is processed
      }
      
      // Submit to API
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to process donation')
      }
      
      const result = await response.json()
      
      // Show success message
      alert(`Thank you for your donation of $${finalAmount.toFixed(2)}!`)
      
      // Reset form
      setAmount("")
      setCustomAmount("")
      setDonorName("")
      setEmail("")
      setMessage("")
      setIsAnonymous(false)
      setCoverFees(false)
      
    } catch (error) {
      console.error('Error processing donation:', error)
      alert('There was an error processing your donation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Donation Amount</Label>
        <div className="grid grid-cols-3 gap-2">
          {["25", "50", "100", "250", "500", "custom"].map((value) => (
            <Button
              key={value}
              type="button"
              variant={amount === value ? "default" : "outline"}
              className={value === "custom" ? "col-span-3" : ""}
              onClick={() => handleAmountSelect(value)}
            >
              {value === "custom" ? "Custom Amount" : `$${value}`}
            </Button>
          ))}
        </div>

        {amount === "custom" && (
          <div className="mt-2">
            <Label htmlFor="custom-amount">Enter Amount</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                id="custom-amount"
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount"
                className="pl-10"
                value={customAmount}
                onChange={handleCustomAmountChange}
                required={amount === "custom"}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <RadioGroup defaultValue="card" onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit/Debit Card
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.783 4.643h-2.189c-.11 0-.203.077-.219.185l-.113.717-.287 1.82-.989 6.262h4.78c.478 0 .883-.348.958-.82l.04-.202.793-5.019.051-.276a.972.972 0 0 1 .958-.82h.6c3.92 0 6.99-1.59 7.886-6.19.376-1.942.196-3.57-.838-4.814z" />
              </svg>
              PayPal
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="donorName">Your Name</Label>
          <Input 
            id="donorName" 
            placeholder="Enter your name" 
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            disabled={isAnonymous}
            required={!isAnonymous}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Leave a Message (Optional)</Label>
        <Textarea 
          id="message" 
          placeholder="Add a message of support..." 
          className="resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            className="rounded text-primary focus:ring-primary"
            checked={isAnonymous}
            onChange={(e) => {
              setIsAnonymous(e.target.checked);
              if (e.target.checked) {
                setDonorName("");
              }
            }}
          />
          <span className="text-sm">Make this donation anonymous</span>
        </Label>
        <Label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            className="rounded text-primary focus:ring-primary"
            checked={coverFees}
            onChange={(e) => setCoverFees(e.target.checked)}
          />
          <span className="text-sm">Cover transaction fees ($2.50)</span>
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Processing...
          </>
        ) : (
          "Donate Now"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        By donating, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

