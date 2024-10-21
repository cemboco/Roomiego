"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import styles from './onboarding.module.css'

export default function OnboardingStep1() {
  const [householdName, setHouseholdName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/")
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from('households')
        .insert([{ name: householdName, created_by: user.id }])
        .select()
      if (error) throw error
      
      await supabase
        .from('user_households')
        .insert([{ user_id: user.id, household_id: data[0].id }])

      router.push("/onboarding/2")
    } catch (error: any) {
      console.error("Error:", error.message)
      // Here you might want to show an error message to the user
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Willkommen bei Roomie!</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Gib deinem Haushalt einen Namen"
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
