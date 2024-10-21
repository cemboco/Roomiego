"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(true)
  const [updateMessage, setUpdateMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setFullName(user?.user_metadata?.full_name || "")
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      if (error) throw error
      setUpdateMessage("Profile updated successfully!")
    } catch (error: any) {
      setUpdateMessage(`Error updating profile: ${error.message}`)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-accent p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome to your Dashboard, {user.user_metadata.full_name}!</h1>
        
        {user.user_metadata.avatar_url && (
          <div className="mb-4">
            <Image 
              src={user.user_metadata.avatar_url} 
              alt="Profile Picture" 
              width={100} 
              height={100} 
              className="rounded-full"
            />
          </div>
        )}
        
        <p className="text-lg text-primary mb-4">Email: {user.email}</p>
        
        <form onSubmit={handleUpdateProfile} className="mb-6">
          <Input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            placeholder="Full Name" 
            className="mb-4"
          />
          <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white mr-4">
            Update Profile
          </Button>
          {updateMessage && <span className="text-sm text-primary">{updateMessage}</span>}
        </form>

        <Button onClick={handleSignOut} className="bg-danger hover:bg-danger/90 text-white">
          Sign Out
        </Button>
      </div>
    </div>
  )
}
