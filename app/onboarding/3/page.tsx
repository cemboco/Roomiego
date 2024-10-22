"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <main className={styles.container}>
      <div className={styles.logo}>Roomie</div>
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
  )
}
