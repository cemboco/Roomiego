"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogIn } from "lucide-react"
import Link from "next/link"

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
        <h1 className={styles.title}>Schritt 2: Art des Haushalts</h1>
        <p className={styles.description}>Was beschreibt am besten deinen Haushalt?</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Select onValueChange={setHouseholdType} required>
            <SelectTrigger>
              <SelectValue placeholder="Wähle eine Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wg">WG</SelectItem>
              <SelectItem value="family">Familie</SelectItem>
              <SelectItem value="couple">Paar</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className={styles.button}>Weiter</Button>
          <Button type="button" onClick={handleBack} variant="outline" className="mt-2">
            Zurück
          </Button>
        </form>
        <div className={styles.progress}>Schritt 2 von 3</div>
      </main>
    </div>
  )
}
