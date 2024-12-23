"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError("System ist nicht verfügbar. Bitte später erneut versuchen.")
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setMessage("Link zum Zurücksetzen des Passworts wurde an deine E-Mail-Adresse gesendet.")
      setError("")
    } catch (error: any) {
      setError(error.message)
      setMessage("")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl font-bold text-primary mb-4 text-center">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
          Passwort vergessen?
        </h1>
        <form className="w-full" onSubmit={handleResetPassword}>
          <Input 
            className="mb-4" 
            type="email" 
            placeholder="Gib deine E-Mail-Adresse ein" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white" type="submit">
            <KeyRound className="mr-2 h-4 w-4" />
            Passwort zurücksetzen
          </Button>
        </form>
        <div className="mt-6 text-sm text-primary text-center">
          <Link href="/login" className="text-secondary hover:underline">Zurück zum Login</Link>
        </div>
      </div>
    </main>
  )
}
