// Simplified version of use-toast.ts
import { useState } from "react"

export interface Toast {
  title: string
  description?: string
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (newToast: Toast) => {
    setToast(newToast)
    setTimeout(() => setToast(null), 3000) // Hide toast after 3 seconds
  }

  return { toast, showToast }
}
