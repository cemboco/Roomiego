"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import styles from './onboarding.module.css'

export default function OnboardingStep1() {
  const [householdOption, setHouseholdOption] = useState("")
  const [householdName, setHouseholdName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

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
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Willkommen bei Roomie!</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select 
          value={householdOption}
          onChange={(e) => setHouseholdOption(e.target.value)}
          required
          className={styles.select}
        >
          <option value="">Wähle eine Option</option>
          <option value="create">Neuen Haushalt erstellen</option>
          <option value="join">Bestehendem Haushalt beitreten</option>
        </select>
        <input
          type="text"
          placeholder="Haushaltsname"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Weiter</button>
      </form>
      <div className={styles.progress}>Schritt 1 von 3</div>
    </div>
  )
}
