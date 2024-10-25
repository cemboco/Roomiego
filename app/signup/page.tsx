"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein")
      return
    }

    try {
      // 1. Registriere den Benutzer
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            household_name: localStorage.getItem('householdName'),
            household_type: localStorage.getItem('householdType'),
            profile_picture: localStorage.getItem('profilePicture'),
          }
        }
      })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error("Benutzer konnte nicht erstellt werden")

      // 2. Erstelle den Haushalt
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .insert([{
          name: localStorage.getItem('householdName') || 'Mein Haushalt',
          type: localStorage.getItem('householdType') || 'wg'
        }])
        .select()
        .single()

      if (householdError) throw householdError

      // 3. Erstelle das Profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: email,
          full_name: localStorage.getItem('fullName'),
          avatar_url: localStorage.getItem('profilePicture'),
          household_id: householdData.id,
          points: 0
        }])

      if (profileError) throw profileError

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message)
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
    </main>
  )
}
