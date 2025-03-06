"use client"

import * as React from "react"
import AuthForm from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AuthForm type="login" />
          </div>
        </div>
      </section>
    </div>
  )
}
