"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogIn, Users } from "lucide-react"
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
        <h1 className={styles.title}>Art des Haushalts</h1>
        <p className={styles.description}>
          Was beschreibt am besten deinen Haushalt? Dies hilft uns, die App optimal auf deine Bedürfnisse anzupassen.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Select onValueChange={setHouseholdType} required>
            <SelectTrigger className="mb-6">
              <SelectValue placeholder="Wähle eine Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wg">WG</SelectItem>
              <SelectItem value="family">Familie</SelectItem>
              <SelectItem value="couple">Paar</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300"
            >
              <Users className="mr-2 h-4 w-4" />
              Weiter
            </Button>
            <Button 
              type="button" 
              onClick={handleBack} 
              variant="outline" 
              className="w-full"
            >
              Zurück
            </Button>
          </div>
        </form>
        <div className={styles.progress}>Schritt 2 von 3</div>
      </main>
    </>
  )
}
