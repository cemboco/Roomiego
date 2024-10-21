"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function EmailConfirmation() {
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email_confirmed_at) {
        setIsVerified(true)
        router.push("/onboarding/1")
      }
    }

    const interval = setInterval(checkEmailVerification, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [router])

  const handleResendEmail = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: (await supabase.auth.getUser()).data.user?.email,
    })
    if (error) {
      console.error("Error resending email:", error)
    } else {
      alert("Verification email resent. Please check your inbox.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-accent p-4">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-4xl font-bold text-primary mb-4">Roomie</div>
        <h1 className="text-2xl font-semibold text-primary mb-6">
          Bestätige deine E-Mail-Adresse
        </h1>
        <p className="mb-6">
          Wir haben dir einen Bestätigungslink an deine E-Mail-Adresse gesendet. 
          Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
        </p>
        <p className="mb-6">
          Nachdem du deine E-Mail-Adresse bestätigt hast, wirst du automatisch zum Onboarding-Prozess weitergeleitet.
        </p>
        <Button onClick={handleResendEmail} className="bg-secondary hover:bg-secondary/90 text-white">
          Bestätigungsmail erneut senden
        </Button>
      </div>
    </main>
  )
}
