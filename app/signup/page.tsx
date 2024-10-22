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
    const householdName = localStorage.getItem('householdName')
    const householdType = localStorage.getItem('householdType')
    if (!householdName || !householdType) {
      router.push('/onboarding/1')
    }
  }, [router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setNotification(null)

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
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

      if (data.user) {
        // Create household and user_household entries
        const householdName = localStorage.getItem('householdName')
        const householdType = localStorage.getItem('householdType')
        
        // Use RPC to create household and user_household entries
        const { data: rpcData, error: rpcError } = await supabase.rpc('create_household_and_link_user', {
          p_user_id: data.user.id,
          p_household_name: householdName,
          p_household_type: householdType
        })

        if (rpcError) throw rpcError

        // Upload profile picture if exists
        const profilePictureUrl = localStorage.getItem('profilePicture')
        if (profilePictureUrl) {
          try {
            const response = await fetch(profilePictureUrl)
            const blob = await response.blob()
            const fileName = `${data.user.id}${Date.now()}.${blob.type.split('/')[1]}`
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
          } catch (storageError) {
            console.error("Error uploading profile picture:", storageError)
            // Don't throw the error, just log it and continue
          }
        }

        setNotification({
          message: "Konto erfolgreich erstellt! Bitte überprüfen Sie Ihre E-Mails für den Bestätigungslink.",
          type: 'success'
        })
        
        // Redirect to email confirmation page instead of dashboard
        router.push("/email-confirmation")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.")
      setNotification({
        message: error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
