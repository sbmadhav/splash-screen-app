"use client"

import { useEffect, useState } from "react"
import { PWASplashScreen } from "@/components/pwa-splash-screen"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service worker registered:', registration)
        })
        .catch((error) => {
          console.error('[PWA] Service worker registration failed:', error)
        })
    }
  }, [])

  const handleSplashComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <PWASplashScreen onComplete={handleSplashComplete} />
  }

  return children
}
