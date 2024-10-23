"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, LogOut, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }
        setUser(user)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user:", error)
        setLoading(false)
      }
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
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
            <h1 className="text-2xl font-bold text-[#4A3E4C]">Profil</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center mb-8">
            {user.user_metadata.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white">
                  {user.user_metadata.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-primary">
              {user.user_metadata.full_name || 'Unnamed User'}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          {/* Points Section */}
          <div className="bg-accent rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-[#F2B05E]" />
              <h3 className="text-xl font-semibold text-primary">Punkte</h3>
            </div>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-gray-500">Gesammelte Punkte für erledigte Aufgaben</p>
          </div>

          {/* Completed Tasks History */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary mb-4">Erledigte Aufgaben</h3>
            <div className="text-gray-500 text-center py-4">
              Noch keine Aufgaben erledigt
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Logout Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={handleSignOut} 
          className="bg-[#4A3E4C] hover:bg-[#65C3BA] text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </div>
    </div>
  )
}
