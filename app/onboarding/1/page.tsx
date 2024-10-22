"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'

export default function OnboardingStep1() {
  const [householdOption, setHouseholdOption] = useState("")
  const [householdName, setHouseholdName] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('householdOption', householdOption)
    localStorage.setItem('householdName', householdName)
    router.push("/onboarding/2")
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Schritt 1: Dein Haushalt</h1>
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
