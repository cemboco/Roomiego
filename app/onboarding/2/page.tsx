"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import styles from '../onboarding.module.css'

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
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Art des Haushalts</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select 
          value={householdType} 
          onChange={(e) => setHouseholdType(e.target.value)}
          required
          className={styles.select}
        >
          <option value="">Wähle eine Option</option>
          <option value="wg">WG</option>
          <option value="family">Familie</option>
        </select>
        <button type="submit" className={styles.button}>Weiter</button>
        <button type="button" onClick={() => router.push("/onboarding/1")} className={`${styles.button} ${styles.backButton}`}>Zurück</button>
      </form>
      <div className={styles.progress}>Schritt 2 von 3</div>
    </div>
  )
}
