"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [householdName, setHouseholdName] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client not initialized")
          router.push("/login")
          return
        }

        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          throw error
        }

        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
        setHouseholdName(user?.user_metadata?.household_name || "")
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user:", error)
        setLoading(false)
        router.push("/login")
      }
    }
    getUser()
  }, [router])

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!supabase) {
        console.error("Supabase client not initialized")
        return
      }

      const { error } = await supabase.auth.updateUser({
        data: { household_name: householdName }
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error) {
      console.error("Error updating settings:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0ECC9] p-4">
      {/* Header */}
      <header className="bg-white shadow-md p-4 fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="h-6 w-6 text-[#4A3E4C] hover:text-[#65C3BA]" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#4A3E4C]">Einstellungen</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div>
              <label htmlFor="householdName" className="block text-sm font-medium text-gray-700 mb-2">
                Haushaltsname
              </label>
              <Input
                id="householdName"
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail-Adresse
              </label>
              <Input
                id="email"
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-gray-50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Änderungen speichern
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
