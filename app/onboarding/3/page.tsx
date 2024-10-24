"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from '../onboarding.module.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogIn, UserPlus, Image as ImageIcon } from "lucide-react"
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
        <h1 className={styles.title}>Dein Profil</h1>
        <p className={styles.description}>
          Lass uns dein Profil erstellen. Mit einem personalisierten Profil macht die Zusammenarbeit noch mehr Spaß.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-700">Dein Name</label>
            <Input
              type="text"
              placeholder="Vollständiger Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-gray-700">Profilbild (optional)</label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                className="flex-1"
              />
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Weiter zur Registrierung
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
        <div className={styles.progress}>Schritt 3 von 3</div>
      </main>
    </>
  )
}
