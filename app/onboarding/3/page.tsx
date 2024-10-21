"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function OnboardingStep3() {
  const [fullName, setFullName] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Update user's full name
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      // Upload profile picture if selected
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop()
        const fileName = `${user.id}${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, profilePicture)

        if (uploadError) throw uploadError

        // Get public URL of uploaded image
        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        if (urlError) throw urlError

        // Update user's avatar URL
        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error:", error.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl font-bold text-primary mb-4 text-center">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
          Dein Profil
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Vollständiger Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
          />
          <Button type="submit" className="w-full">Los geht's</Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/onboarding/2")}>
            Zurück
          </Button>
        </form>
        <div className="mt-6 text-sm text-primary text-center">
          Schritt 3 von 3
        </div>
      </div>
    </main>
  )
}
