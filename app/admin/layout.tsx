"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  CheckCircle,
  CreditCard,
  FileCheck,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state while checking authentication
  if (loading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Skip authentication check for testing
  console.log("Authentication check disabled for testing")
  
  // We'll use the existing user or continue without authentication
  // This allows us to test the admin panel functionality
  console.log("Admin access granted for testing")
  
  const handleLogout = async () => {
    await logout()
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md dark:bg-gray-800">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Admin Panel</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/admin/campaigns" icon={Heart} label="Campaigns" />
          <NavItem href="/admin/verification" icon={FileCheck} label="Verification Queue" />
          <NavItem href="/admin/users" icon={Users} label="Users" />
          <NavItem href="/admin/donations" icon={CreditCard} label="Donations" />
          <NavItem href="/admin/reports" icon={BarChart3} label="Reports" />
          <NavItem href="/admin/settings" icon={Settings} label="Settings" />

          <div className="pt-4 mt-4 border-t">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Site
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  )
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Button variant="ghost" className="w-full justify-start" asChild>
      <Link href={href}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  )
}

