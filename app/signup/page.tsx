"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Notification from "@/components/Notification"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding is complete
    const householdName = localStorage.getItem('householdName')
    const householdType = localStorage.getItem('householdType')
    if (!householdName || !householdType) {
      router.push('/onboarding/1')
    }
  }, [router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })
      if (error) throw error

      // Create household and user_household entries
      const householdName = localStorage.getItem('householdName')
      const householdType = localStorage.getItem('householdType')
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .insert([{ name: householdName, type: householdType, created_by: data.user?.id }])
        .select()
      if (householdError) throw householdError

      await supabase
        .from('user_households')
        .insert([{ user_id: data.user?.id, household_id: householdData[0].id }])

      // Upload profile picture if exists
      const profilePictureUrl = localStorage.getItem('profilePicture')
      if (profilePictureUrl) {
        const response = await fetch(profilePictureUrl)
        const blob = await response.blob()
        const fileName = `${data.user?.id}${Date.now()}.${blob.type.split('/')[1]}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob)
        if (uploadError) throw uploadError

        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
        if (urlError) throw urlError

        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }

      setNotification({
        message: "Account created successfully!",
        type: 'success'
      })
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message)
      setNotification({
        message: error.message,
        type: 'error'
      })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl font-bold text-primary mb-4 text-center">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
          Erstelle dein Konto
        </h1>
        <form className="w-full" onSubmit={handleSignUp}>
          <Input 
            className="mb-4" 
            type="text" 
            placeholder="Vollständiger Name" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="email" 
            placeholder="E-Mail-Adresse" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="password" 
            placeholder="Passwort erstellen" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="password" 
            placeholder="Passwort bestätigen" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-danger mb-4">{error}</p>}
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white" type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            Registrieren
          </Button>
        </form>
        <div className="mt-6 text-sm text-primary text-center">
          Bereits ein Konto? <Link href="/login" className="text-secondary hover:underline">Hier einloggen</Link>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  )
}
