"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'

export default function OnboardingStep3() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (profilePicture) {
      localStorage.setItem('profilePicture', URL.createObjectURL(profilePicture))
    }
    router.push("/signup")
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Schritt 3: Dein Profil</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Weiter zur Registrierung</button>
        <button type="button" onClick={() => router.push("/onboarding/2")} className={`${styles.button} ${styles.backButton}`}>Zurück</button>
      </form>
      <div className={styles.progress}>Schritt 3 von 3</div>
    </div>
  )
}
