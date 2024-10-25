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
      // 1. Erstelle den Auth-Benutzer
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error("No user data returned")

      // 2. Erstelle einen neuen Haushalt
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .insert([
          {
            name: localStorage.getItem('householdName'),
            type: localStorage.getItem('householdType')
          }
        ])
        .select()
        .single()

      if (householdError) throw householdError

      // 3. Erstelle das Benutzerprofil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            full_name: localStorage.getItem('fullName'),
            avatar_url: localStorage.getItem('profilePicture'),
            points: 0
          }
        ])

      if (profileError) throw profileError

      // 4. Verknüpfe Benutzer mit Haushalt
      const { error: userHouseholdError } = await supabase
        .from('user_households')
        .insert([
          {
            user_id: authData.user.id,
            household_id: householdData.id,
            role: 'admin' // Erster Benutzer ist Admin
          }
        ])

      if (userHouseholdError) throw userHouseholdError

      // 5. Aktualisiere die Benutzer-Metadaten
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          household_id: householdData.id,
          full_name: localStorage.getItem('fullName'),
          avatar_url: localStorage.getItem('profilePicture')
        }
      })

      if (updateError) throw updateError

      // 6. Füge einige Standard-Einkaufsvorschläge hinzu
      const defaultItems = [
        "Milch", "Brot", "Eier", "Butter", "Käse",
        "Tomaten", "Gurken", "Kartoffeln", "Äpfel", "Bananen"
      ]

      const shoppingItems = defaultItems.map(name => ({
        name,
        created_by: authData.user.id,
        household_id: householdData.id
      }))

      const { error: itemsError } = await supabase
        .from('shopping_items')
        .insert(shoppingItems)

      if (itemsError) console.error("Error adding default shopping items:", itemsError)

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F0ECC9] to-white p-4">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-lg p-8">
        <div className="text-4xl font-bold bg-gradient-to-r from-[#4A3E4C] to-[#65C3BA] bg-clip-text text-transparent mb-4 text-center">
          Roomie
        </div>
        <h1 className="text-2xl font-semibold text-[#4A3E4C] mb-6 text-center">
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
          <Button className="w-full bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300" type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            Registrieren
          </Button>
        </form>
        <div className="mt-6 text-sm text-[#4A3E4C] text-center">
          Bereits ein Konto? <Link href="/login" className="text-[#65C3BA] hover:underline">Hier einloggen</Link>
        </div>
      </div>
    </main>
  )
}
