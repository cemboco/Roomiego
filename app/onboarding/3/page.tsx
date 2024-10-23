"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogIn } from "lucide-react"
import Link from "next/link"

export default function OnboardingStep3() {
  const [fullName, setFullName] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (profilePicture) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          localStorage.setItem('profilePicture', e.target.result as string)
        }
      }
      reader.readAsDataURL(profilePicture)
    }
    
    router.push("/signup")
  }

  const handleBack = () => {
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
        <h1 className={styles.title}>Schritt 3: Dein Profil</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            placeholder="Vollständiger Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="mb-4"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
            className="mb-4"
          />
          <Button type="submit" className={styles.button}>Weiter zur Registrierung</Button>
          <Button type="button" onClick={handleBack} variant="outline" className="mt-2">
            Zurück
          </Button>
        </form>
        <div className={styles.progress}>Schritt 3 von 3</div>
      </main>
    </div>
  )
}
