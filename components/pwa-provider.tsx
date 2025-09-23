"use client"

import { useEffect, useState } from "react"
import { PWASplashScreen } from "@/components/pwa-splash-screen"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      // Use different path for GitHub Pages vs local development
      // Check if we're running in the /splash-screen-app/ subdirectory
      const isGitHubPages = window.location.hostname.includes('github.io') || 
                           window.location.pathname.startsWith('/splash-screen-app/')
      const swPath = process.env.NODE_ENV === 'production' && isGitHubPages
        ? '/splash-screen-app/sw.js' 
        : '/sw.js'
        
      navigator.serviceWorker
        .register(swPath)
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
