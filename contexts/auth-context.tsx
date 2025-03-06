"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getCurrentUser, logoutUser } from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch current user
  const refreshUser = async () => {
    try {
      setLoading(true)
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth state
  useEffect(() => {
    refreshUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Login function
  const login = (userData: User) => {
    setUser(userData)
  }

  // Logout function
  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
