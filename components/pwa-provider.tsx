"use client"

import { useEffect, useState } from "react"
import { PWASplashScreen } from "@/components/pwa-splash-screen"
import { debugLog } from "@/lib/debug-utils"

const SPLASH_COMPLETED_KEY = 'splash-screen-completed'
const SESSION_STORAGE_KEY = 'splash-session-id'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = () => {
      // Check if splash has been completed in this session
      const currentSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY)
      const splashCompleted = localStorage.getItem(SPLASH_COMPLETED_KEY)
      const newSessionId = Date.now().toString()

      // If no session ID or splash was completed in a previous session, show splash
      if (!currentSessionId || splashCompleted !== currentSessionId) {
        // Set new session ID
        sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
        setIsLoading(true)
      } else {
        // Splash already completed in this session
        setIsLoading(false)
      }

      setIsInitialized(true)
    }

    initializeApp()

    // Register service worker
    if ('serviceWorker' in navigator) {
      // Use different path for GitHub Pages vs local development
      const isGitHubPages = window.location.hostname.includes('github.io') || 
                           window.location.pathname.startsWith('/splash-screen-app/')
      const swPath = process.env.NODE_ENV === 'production' && isGitHubPages
        ? '/splash-screen-app/sw.js' 
        : '/sw.js'
        
      navigator.serviceWorker
        .register(swPath)
        .then((registration) => {
          debugLog('[PWA] Service worker registered:', registration)
        })
        .catch((error) => {
          console.error('[PWA] Service worker registration failed:', error)
        })
    }
  }, [])

  const handleSplashComplete = () => {
    const currentSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (currentSessionId) {
      // Mark splash as completed for this session
      localStorage.setItem(SPLASH_COMPLETED_KEY, currentSessionId)
    }
    setIsLoading(false)
  }

  // Don't render anything until we've determined if splash should show
  if (!isInitialized) {
    return null
  }

  if (isLoading) {
    return <PWASplashScreen onComplete={handleSplashComplete} />
  }

  return children
}
