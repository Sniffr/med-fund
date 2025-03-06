"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { loginUser, registerUser } from "@/lib/api.js"

interface AuthFormProps {
  type: "login" | "register"
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validation
      if (type === "register") {
        if (!formData.name.trim()) {
          throw new Error("Name is required")
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }
      }

      if (!formData.email.trim()) {
        throw new Error("Email is required")
      }
      if (!formData.password.trim()) {
        throw new Error("Password is required")
      }

      // Submit form
      if (type === "login") {
        const response = await loginUser({
          email: formData.email,
          password: formData.password
        })
        
        // Store token in cookie (handled by API)
        router.push("/")
        router.refresh()
      } else {
        const response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        
        // Redirect to login page after successful registration
        router.push("/login?registered=true")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-white dark:bg-gray-950 rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {type === "login" ? "Sign In" : "Create an Account"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {type === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill out the form below to create your account"}
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {type === "login" && (
        <React.Fragment>
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("registered") === "true" && (
            <Alert className="my-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Registration successful! Please log in with your new account.</AlertDescription>
            </Alert>
          )}
        </React.Fragment>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Your full name" 
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === "login" && (
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        {type === "register" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              {type === "login" ? "Signing in..." : "Creating account..."}
            </>
          ) : (
            type === "login" ? "Sign In" : "Create Account"
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        {type === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
