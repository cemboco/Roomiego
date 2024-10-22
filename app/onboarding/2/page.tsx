"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OnboardingStep2() {
  const [householdType, setHouseholdType] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('householdType', householdType)
    router.push("/onboarding/3")
  }

  const handleBack = () => {
    router.push("/onboarding/1")
  }

  return (
    <main className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Schritt 2: Art des Haushalts</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Select onValueChange={setHouseholdType} required>
          <SelectTrigger>
            <SelectValue placeholder="Wähle eine Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wg">WG</SelectItem>
            <SelectItem value="family">Familie</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className={styles.button}>Weiter</Button>
        <Button type="button" onClick={handleBack} variant="outline" className="mt-2">
          Zurück
        </Button>
      </form>
      <div className={styles.progress}>Schritt 2 von 3</div>
    </main>
  )
}
