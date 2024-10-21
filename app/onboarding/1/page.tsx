"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export default function OnboardingStep1() {
  const [householdOption, setHouseholdOption] = useState("")
  const [householdName, setHouseholdName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      if (householdOption === "create") {
        const { data, error } = await supabase
          .from('households')
          .insert([{ name: householdName, created_by: user.id }])
          .select()
        if (error) throw error
        
        await supabase
          .from('user_households')
          .insert([{ user_id: user.id, household_id: data[0].id }])
      } else {
        // For now, we'll just pretend to join an existing household
        // In a real app, you'd need to implement a way to find and join existing households
      }

      router.push("/onboarding/2")
    } catch (error: any) {
      console.error("Error:", error.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl font-bold text-primary mb-4 text-center">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
          Willkommen bei Roomie!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select onValueChange={setHouseholdOption} required>
            <SelectTrigger>
              <SelectValue placeholder="Wähle eine Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create">Neuen Haushalt erstellen</SelectItem>
              <SelectItem value="join">Bestehendem Haushalt beitreten</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Haushaltsname"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Weiter</Button>
        </form>
        <div className="mt-6 text-sm text-primary text-center">
          Schritt 1 von 3
        </div>
      </div>
    </main>
  )
}
