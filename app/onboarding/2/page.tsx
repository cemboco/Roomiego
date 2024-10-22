"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'

export default function OnboardingStep2() {
  const [householdType, setHouseholdType] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('householdType', householdType)
    router.push("/onboarding/3")
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Schritt 2: Art des Haushalts</h1>
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
