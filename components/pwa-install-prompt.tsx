"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Smartphone, Monitor } from "lucide-react"

interface PWAInstallPromptProps {
  theme?: 'light' | 'dark'
}

export function PWAInstallPrompt({ theme = 'dark' }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setIsInstallable(true)
      console.log('[PWA] Install prompt available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle app installed
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed')
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Show the install prompt
        deferredPrompt.prompt()
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        console.log(`[PWA] User response to the install prompt: ${outcome}`)
        
        if (outcome === 'accepted') {
          setIsInstallable(false)
        }
        
        // We no longer need the prompt
        setDeferredPrompt(null)
      } catch (error) {
        console.error('[PWA] Error showing install prompt:', error)
      }
    }
  }

  if (isInstalled) {
    return (
      <Card className={theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <Download className="h-5 w-5" />
            PWA Status
          </CardTitle>
          <CardDescription className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Progressive Web App installation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <p className={`font-medium ${
                theme === 'light' ? 'text-green-700' : 'text-green-400'
              }`}>
                App Installed
              </p>
              <p className={`text-sm ${
                theme === 'light' ? 'text-green-600' : 'text-green-500'
              }`}>
                This app is already installed on your device
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isInstallable) {
    return (
      <Card className={theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            <Download className="h-5 w-5" />
            Install App
          </CardTitle>
          <CardDescription className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Install this app for a better experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
              }`}>
                <Download className={`w-4 h-4 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`} />
              </div>
            </div>
            <div>
              <p className={`font-medium ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-400'
              }`}>
                Install Not Available
              </p>
              <p className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-500'
              }`}>
                This browser doesn't support app installation or the app is already installed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          <Download className="h-5 w-5" />
          Install App
        </CardTitle>
        <CardDescription className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
          Install this app for a better, native-like experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Smartphone className={`h-4 w-4 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} />
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Works offline and loads faster
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Monitor className={`h-4 w-4 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} />
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Native app experience
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Download className={`h-4 w-4 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`} />
            <span className={`text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Quick access from home screen
            </span>
          </div>
        </div>

        {/* Install Button */}
        <Button 
          onClick={handleInstallClick}
          className={`w-full ${
            theme === 'light'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>

        <p className={`text-xs text-center ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Installation is optional and can be uninstalled anytime
        </p>
      </CardContent>
    </Card>
  )
}
