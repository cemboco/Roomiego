"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export default function OnboardingStep2() {
  const [householdType, setHouseholdType] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from('user_households')
        .select('household_id')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      await supabase
        .from('households')
        .update({ type: householdType })
        .eq('id', data.household_id)

      router.push("/onboarding/3")
    } catch (error: any) {
      console.error("Error:", error.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-4xl font-bold text-primary mb-4 text-center">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6 text-center">
          Art des Haushalts
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select onValueChange={setHouseholdType} required>
            <SelectTrigger>
              <SelectValue placeholder="Wähle eine Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wg">WG</SelectItem>
              <SelectItem value="family">Familie</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">Weiter</Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/onboarding/1")}>
            Zurück
          </Button>
        </form>
        <div className="mt-6 text-sm text-primary text-center">
          Schritt 2 von 3
        </div>
      </div>
    </main>
  )
}
