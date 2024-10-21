"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toast"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast, showToast } = useToast()

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
      showToast({
        title: "Account created successfully!",
        description: "Please complete the onboarding process.",
      })
      router.push("/onboarding/1")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl font-bold text-primary mb-4 text-center">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
          Join Roomie and Make Home Management a Breeze!
        </h1>
        <form className="w-full" onSubmit={handleSignUp}>
          <Input 
            className="mb-4" 
            type="text" 
            placeholder="Full Name" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="password" 
            placeholder="Create Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            className="mb-4" 
            type="password" 
            placeholder="Confirm Password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-danger mb-4">{error}</p>}
          <Button className="w-full bg-secondary hover:bg-secondary/90 text-white" type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </form>
        <div className="mt-6 text-sm text-primary text-center">
          Already have an account? <Link href="/login" className="text-secondary hover:underline">Log in here</Link>
        </div>
      </div>
      <Toaster toast={toast} />
    </main>
  )
}
