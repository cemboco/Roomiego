"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { LogOut, Trophy, Edit2, Save, X } from "lucide-react"
import Image from "next/image"
import DashboardHeader from "@/components/shared/DashboardHeader"
import DashboardFooter from "@/components/shared/DashboardFooter"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.replace("/login")
          return
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.replace("/login")
          return
        }

        setUser(user)
        setFullName(user.user_metadata.full_name || '')
        setPreviewUrl(user.user_metadata.avatar_url || '')
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user:", error)
        setLoading(false)
        router.replace("/login")
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      let avatarUrl = user.user_metadata.avatar_url

      if (newProfilePicture) {
        const fileExt = newProfilePicture.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, newProfilePicture)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        avatarUrl = publicUrl
      }

      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          avatar_url: avatarUrl
        }
      })

      if (error) throw error

      setIsEditing(false)
      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser()
      setUser(updatedUser)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProfilePicture(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0ECC9] to-white flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0ECC9] to-white">
      <DashboardHeader />

      <main className="pt-24 pb-20 px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#4A3E4C]">Dein Profil</h1>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="text-[#65C3BA] hover:text-[#4A3E4C]"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleProfileUpdate}
                  className="bg-[#65C3BA] hover:bg-[#4A3E4C]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Speichern
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Abbrechen
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-[#65C3BA] rounded-full flex items-center justify-center">
                  <span className="text-3xl text-white">
                    {fullName[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-4"
                />
              )}
            </div>
            {isEditing ? (
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="max-w-xs text-center"
                placeholder="Dein Name"
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#4A3E4C]">{fullName}</h2>
                <p className="text-gray-500">{user.email}</p>
              </>
            )}
          </div>

          {/* Points Section */}
          <div className="bg-[#F0ECC9] rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-[#F2B05E]" />
              <h3 className="text-xl font-semibold text-[#4A3E4C]">Punkte</h3>
            </div>
            <p className="text-3xl font-bold text-[#65C3BA]">{user.user_metadata.points || 0}</p>
            <p className="text-sm text-gray-600">Gesammelte Punkte für erledigte Aufgaben</p>
          </div>

          {/* Sign Out Button */}
          <Button 
            onClick={handleSignOut} 
            className="w-full bg-[#4A3E4C] hover:bg-[#65C3BA] transition-all duration-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
