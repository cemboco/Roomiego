"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import styles from './onboarding/onboarding.module.css'
import { useState, useEffect } from "react"
import Link from "next/link"
import { LogIn, CheckCircle, MessageCircle, ShoppingBag, Trophy, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-b from-[#F0ECC9] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#4A3E4C] to-[#65C3BA] bg-clip-text text-transparent">
            Roomie
          </div>
          <Link href="/dashboard">
            <Button className="bg-[#65C3BA] hover:bg-[#4A3E4C] transition-all duration-300">
              <LogIn className="mr-2 h-4 w-4" />
              Anmelden
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 pt-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#4A3E4C] mb-6 leading-tight">
              Organisiere deinen Haushalt <span className="text-[#65C3BA]">einfach & effektiv</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Roomie macht es Familien und Mitbewohnern leichter, Aufgaben zu teilen, sich zu organisieren und sich gegenseitig zu unterstützen.
            </p>
            <Button 
              onClick={handleStart} 
              className="bg-[#65C3BA] hover:bg-[#4A3E4C] text-white px-8 py-6 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-[#F0ECC9] p-3 rounded-full w-fit mb-6">
                <CheckCircle className="h-6 w-6 text-[#65C3BA]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3E4C] mb-4">Organisierte Aufgabenteilung</h2>
              <p className="text-gray-600 leading-relaxed">Durch faire und übersichtliche Aufgabenteilung bleibt es in deinem Haushalt immer organisiert. Plane und verteile Aufgaben einfach und effektiv.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-[#F0ECC9] p-3 rounded-full w-fit mb-6">
                <MessageCircle className="h-6 w-6 text-[#65C3BA]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3E4C] mb-4">Integrierte Chatfunktion</h2>
              <p className="text-gray-600 leading-relaxed">Bleib mit deinen Mitbewohnern immer in Kontakt. Koordiniere Aktivitäten und teile wichtige Informationen in Echtzeit.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-[#F0ECC9] p-3 rounded-full w-fit mb-6">
                <ShoppingBag className="h-6 w-6 text-[#65C3BA]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3E4C] mb-4">Digitale Einkaufsliste</h2>
              <p className="text-gray-600 leading-relaxed">Deine Einkaufsliste immer griffbereit. Teile sie mit deinen Mitbewohnern und vergesse nie wieder einen wichtigen Artikel.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="bg-[#F0ECC9] p-3 rounded-full w-fit mb-6">
                <Trophy className="h-6 w-6 text-[#65C3BA]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A3E4C] mb-4">Belohnungssystem</h2>
              <p className="text-gray-600 leading-relaxed">Sammle Punkte für erledigte Aufgaben und erhalte Anerkennung für deinen Beitrag zum Haushalt. Motiviere dich und andere durch Wertschätzung.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-16 bg-[#4A3E4C] rounded-3xl mb-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bereit für ein besseres Zusammenleben?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Starte jetzt kostenlos und erlebe, wie einfach Haushaltsorganisation sein kann.
            </p>
            <Button 
              onClick={handleStart} 
              className="bg-[#65C3BA] hover:bg-white hover:text-[#4A3E4C] text-white px-8 py-6 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Jetzt loslegen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4A3E4C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-[#65C3BA] bg-clip-text text-transparent mb-4">
            Roomie
          </div>
          <p className="text-gray-300">&copy; 2024 Roomie. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
