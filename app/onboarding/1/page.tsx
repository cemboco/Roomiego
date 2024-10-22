"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function OnboardingStep1() {
  const [householdOption, setHouseholdOption] = useState("")
  const [householdName, setHouseholdName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('householdName', householdName)
    router.push("/onboarding/2")
  }

  return (
    <main className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Schritt 1: Dein Haushalt</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
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
          className="mt-4"
          type="text"
          placeholder="Haushaltsname"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          required
        />
        <Button type="submit" className={styles.button}>Weiter</Button>
      </form>
      <div className={styles.progress}>Schritt 1 von 3</div>
    </main>
  )
}
