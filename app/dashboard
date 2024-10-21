"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-accent p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome to your Dashboard, {user.user_metadata.full_name}!</h1>
        <p className="text-lg text-primary mb-4">Email: {user.email}</p>
        <Button onClick={handleSignOut} className="bg-secondary hover:bg-secondary/90 text-white">
          Sign Out
        </Button>
      </div>
    </div>
  )
}
