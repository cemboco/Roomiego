"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import styles from './onboarding/onboarding.module.css'
import { useState, useEffect } from "react"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    router.push("/onboarding/1")
  }

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.logo}>Roomie</div>
        <p className={styles.description}>Loading...</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0ECC9]">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold text-[#4A3E4C]">Roomie</div>
          <Link href="/dashboard">
            <Button className="bg-[#65C3BA] hover:bg-[#4A3E4C]">
              <LogIn className="mr-2 h-4 w-4" />
              Anmelden
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A3E4C] mb-4 max-w-3xl mx-auto">
            Roomie ist eine praktische und gemeinschaftliche App, die es Familien und Mitbewohnern einfacher macht, Aufgaben zu teilen, sich zu organisieren und sich gegenseitig zu unterstützen.
          </h1>
          <Button 
            onClick={handleStart} 
            className="bg-[#65C3BA] hover:bg-[#4A3E4C] text-white px-8 py-4 text-xl mt-4"
          >
            Loslegen
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#4A3E4C] mb-4">Organisierte Aufgabenteilung</h2>
            <p className="text-gray-600">Durch faire und übersichtliche Aufgabenteilung bleibt es in deinem Haushalt immer organisiert. Plane und verteile Aufgaben einfach und effektiv.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#4A3E4C] mb-4">Integrierte Chatfunktion</h2>
            <p className="text-gray-600">Bleib mit deinen Mitbewohnern immer in Kontakt. Koordiniere Aktivitäten und teile wichtige Informationen in Echtzeit.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#4A3E4C] mb-4">Digitale Einkaufsliste</h2>
            <p className="text-gray-600">Deine Einkaufsliste immer griffbereit. Teile sie mit deinen Mitbewohnern und vergesse nie wieder einen wichtigen Artikel.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#4A3E4C] mb-4">Belohnungssystem</h2>
            <p className="text-gray-600">Sammle Punkte für erledigte Aufgaben und erhalte Anerkennung für deinen Beitrag zum Haushalt. Motiviere dich und andere durch Wertschätzung.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4A3E4C] text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Roomie. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
