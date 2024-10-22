"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import styles from './onboarding.module.css'
import { useState, useEffect } from "react"

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
        <div className={styles.logo}>Roomiego</div>
        <p className={styles.description}>Loading...</p>
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <div className={styles.logo}>Roomiego</div>
      <h1 className={`${styles.title} text-5xl mb-6`}>Willkommen bei Roomie, Amigo!</h1>
      <p className={styles.description}>Mach dein Zuhause zum perfekten Ort.</p>
      <Button onClick={handleStart} className={styles.button}>Loslegen</Button>
    </main>
  )
}
