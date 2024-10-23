"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LogIn } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-[#F0ECC9]">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold text-[#4A3E4C]">Roomie</div>
          <Link href="/login">
            <Button className="bg-[#65C3BA] hover:bg-[#4A3E4C]">
              <LogIn className="mr-2 h-4 w-4" />
              Anmelden
            </Button>
          </Link>
        </div>
      </header>

      <main className={styles.container}>
        <h1 className={styles.title}>Schritt 1: Dein Haushalt</h1>
        <p className={styles.description}>
          Erstelle deinen Haushalt und lade deine Mitbewohner ein – gemeinsam organisiert ihr euren Alltag.
        </p>
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
          <p className="mt-4 mb-2 text-sm text-gray-600">Wie soll dein Zuhause heißen?</p>
          <Input
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
    </div>
  )
}
