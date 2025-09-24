"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

interface SplashScreenProps {
  onComplete: () => void
}

export function PWASplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Initializing app...")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let statusTimeout: NodeJS.Timeout

    const initializeApp = async () => {
      try {
        // Check if service worker is supported
        if ('serviceWorker' in navigator) {
          setStatus("Registering service worker...")
          
          // Use different path for GitHub Pages vs local development
          // Check if we're running in the /splash-screen-app/ subdirectory
          const isGitHubPages = window.location.hostname.includes('github.io') || 
                               window.location.pathname.startsWith('/splash-screen-app/')
          const swPath = process.env.NODE_ENV === 'production' && isGitHubPages
            ? '/splash-screen-app/sw.js' 
            : '/sw.js'
          
          // Register service worker
          const registration = await navigator.serviceWorker.register(swPath)
          console.log('[PWA] Service worker registered:', registration)
          
          setProgress(10)
          setStatus("Caching core assets...")
          
          // Simplified progress monitoring - less dependent on service worker communication
          let currentProgress = 10
          progressInterval = setInterval(async () => {
            try {
              // Try to get cache status but don't rely on it
              let targetProgress = currentProgress + 8
              
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                try {
                  const channel = new MessageChannel()
                  const timeout = new Promise((resolve) => {
                    setTimeout(() => resolve({ progress: targetProgress }), 200)
                  })
                  
                  const cacheStatusPromise = new Promise((resolve) => {
                    channel.port1.onmessage = (event) => {
                      resolve(event.data)
                    }
                    
                    navigator.serviceWorker.controller!.postMessage(
                      { type: 'GET_CACHE_STATUS' },
                      [channel.port2]
                    )
                  })

                  const cacheStatus = await Promise.race([cacheStatusPromise, timeout])
                  if (cacheStatus && (cacheStatus as any).progress) {
                    targetProgress = Math.max(targetProgress, (cacheStatus as any).progress)
                  }
                } catch (error) {
                  console.log('[PWA] Service worker communication failed, using fallback progress')
                }
              }
              
              currentProgress = Math.min(targetProgress, 90)
              setProgress(currentProgress)
              
              if (currentProgress >= 90) {
                setStatus("Preparing app...")
                clearInterval(progressInterval)
                
                statusTimeout = setTimeout(() => {
                  setProgress(100)
                  setStatus("Ready!")
                  setIsComplete(true)
                  
                  setTimeout(() => {
                    onComplete()
                  }, 500)
                }, 800)
              } else if (currentProgress > 50) {
                setStatus("Setting up lazy caching...")
              } else if (currentProgress > 20) {
                setStatus("Caching core assets...")
              }
            } catch (error) {
              console.error('[PWA] Error in progress monitoring:', error)
              // Fallback to simple increment
              currentProgress = Math.min(currentProgress + 10, 90)
              setProgress(currentProgress)
            }
          }, 400)
        } else {
          // No service worker support - simulate loading
          setStatus("Loading app...")
          let currentProgress = 0
          
          progressInterval = setInterval(() => {
            currentProgress += 10
            setProgress(currentProgress)
            
            if (currentProgress >= 100) {
              clearInterval(progressInterval)
              setStatus("Ready!")
              setIsComplete(true)
              setTimeout(onComplete, 500)
            }
          }, 200)
        }
      } catch (error) {
        console.error('[PWA] Error initializing app:', error)
        // Fallback to simple loading
        setStatus("Loading app...")
        setTimeout(() => {
          setProgress(100)
          setIsComplete(true)
          onComplete()
        }, 2000)
      }
    }

    initializeApp()

    return () => {
      if (progressInterval) clearInterval(progressInterval)
      if (statusTimeout) clearTimeout(statusTimeout)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 text-center px-8 max-w-md w-full">
        {/* App icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <img 
              src="./icon-64x64.png" 
              alt="App Icon" 
              className="w-16 h-16"
              onError={(e) => {
                // Fallback to text if icon fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = document.createElement('div')
                fallback.className = 'text-white text-2xl font-bold'
                fallback.textContent = 'SA'
                target.parentNode?.appendChild(fallback)
              }}
            />
          </div>
        </div>
        
        {/* App name */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Splash Screen App
        </h1>
        
        <p className="text-gray-300 mb-8">
          For Focus, Relaxation, or Meetings
        </p>
        
        {/* Progress section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{status}</span>
              <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
            </div>
            
            <Progress 
              value={progress} 
              className="h-2 bg-gray-700"
              style={{
                background: 'rgb(55 65 81)',
              }}
            />
          </div>
          
          {/* Loading indicator */}
          {!isComplete && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            </div>
          )}
          
          {isComplete && (
            <div className="flex justify-center">
              <div className="text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* PWA info */}
        <p className="text-xs text-gray-500 mt-8">
          Installing for offline use...
        </p>
      </div>
    </div>
  )
}
