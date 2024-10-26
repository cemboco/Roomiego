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
  const [householdName, setHouseholdName] = useState(localStorage.getItem('householdName') || '')
  const [householdType, setHouseholdType] = useState(localStorage.getItem('householdType') || '')
  const [fullName, setFullName] = useState(localStorage.getItem('fullName') || '')
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '')
  const router = useRouter()

  const handleHouseholdData = (e: React.FormEvent) => {
    e.preventDefault()
    // Speichern der Haushaltsdaten im Local Storage
    localStorage.setItem('householdName', householdName)
    localStorage.setItem('householdType', householdType)
    localStorage.setItem('fullName', fullName)
    localStorage.setItem('profilePicture', profilePicture)
    // Weiterleitung zur Registrierungsseite
    router.push('/signup-register')
  }

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
            household_name: householdName,
            household_type: householdType,
            profile_picture: profilePicture,
            full_name: fullName
          }
        }
      })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error("Benutzer konnte nicht erstellt werden")

      // 2. Erstelle den Haushalt
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .insert([{
          name: householdName,
          type: householdType
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
          full_name: fullName,
          avatar_url: profilePicture,
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
        {/* Haushaltsdaten eingeben */}
        <form className="w-full" onSubmit={handleHouseholdData}>
          <Input 
            className="mb-4" 
            type="text" 
            placeholder="Haushaltsname" 
            required 
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="text" 
            placeholder="Haushaltstyp" 
            required 
            value={householdType}
            onChange={(e) => setHouseholdType(e.target.value)}
          />
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
            type="text" 
            placeholder="Profilbild-URL" 
            required 
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white" type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            Weiter zur Registrierung
          </Button>
        </form>
        {/* Registrierungsform */}
        <form className="w-full mt-8" onSubmit={handleSignUp}>
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

export default Signup;
