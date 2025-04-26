"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

type UserProfile = {
  id: string
  user_id: string
  nombre: string
  email: string
  cuerda: string
  role: "member" | "director" | "admin"
  image?: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return
        }

        if (data) {
          setProfile(data as UserProfile)
        } else {
          // If no profile exists, redirect to create profile
          router.push("/profile/create")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setProfileLoading(false)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, router])

  // Show nothing while checking auth
  if (isLoading || !user || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Default to member role if profile doesn't exist yet
  const userWithProfile = {
    name: profile?.nombre || user.email?.split("@")[0] || "Usuario",
    email: profile?.email || user.email || "",
    image: profile?.image || "",
    role: profile?.role || ("member" as const),
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={userWithProfile} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
