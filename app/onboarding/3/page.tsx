"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import styles from '../onboarding.module.css'

export default function OnboardingStep3() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop()
        const fileName = `${user.id}${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, profilePicture)

        if (uploadError) throw uploadError

        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        if (urlError) throw urlError

        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error:", error.message)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>Roomie</div>
      <h1 className={styles.title}>Dein Profil</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Los geht's</button>
        <button type="button" onClick={() => router.push("/onboarding/2")} className={`${styles.button} ${styles.backButton}`}>Zurück</button>
      </form>
      <div className={styles.progress}>Schritt 3 von 3</div>
    </div>
  )
}
