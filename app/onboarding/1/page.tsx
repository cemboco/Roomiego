"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LogIn, Home } from "lucide-react"
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
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <Link href="/">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#4A3E4C] to-[#65C3BA] bg-clip-text text-transparent">
              Roomie
            </div>
          </Link>
          <Link href="/login">
            <Button className="bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300">
              <LogIn className="mr-2 h-4 w-4" />
              Anmelden
            </Button>
          </Link>
        </div>
      </header>

      <main className={styles.container}>
        <h1 className={styles.title}>Willkommen bei Roomie</h1>
        <p className={styles.description}>
          Erstelle deinen Haushalt und lade deine Mitbewohner ein – gemeinsam organisiert ihr euren Alltag.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Select onValueChange={setHouseholdOption} required>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Wähle eine Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create">Neuen Haushalt erstellen</SelectItem>
              <SelectItem value="join">Bestehendem Haushalt beitreten</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-gray-700">Wie soll dein Zuhause heißen?</label>
            <Input
              type="text"
              placeholder="z.B. WG Musterstraße"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300"
          >
            <Home className="mr-2 h-4 w-4" />
            Weiter
          </Button>
        </form>
        <div className={styles.progress}>Schritt 1 von 3</div>
      </main>
    </>
  )
}
