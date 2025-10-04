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
  const [hasCheckedCapability, setHasCheckedCapability] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      setHasCheckedCapability(true)
      return
    }

    // Check if running in mobile/PWA context
    const isInWebAppiOS = (window.navigator as any).standalone === true
    const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches
    
    if (isInWebAppiOS || isInWebAppChrome) {
      setIsInstalled(true)
      setHasCheckedCapability(true)
      return
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setIsInstallable(true)
      setHasCheckedCapability(true)
      console.log('[PWA] Install prompt available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle app installed
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed')
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      setHasCheckedCapability(true)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // Set a timeout to mark that we've checked for install capability
    // Some browsers might not fire the beforeinstallprompt event immediately
    const timeoutId = setTimeout(() => {
      if (!hasCheckedCapability) {
        setHasCheckedCapability(true)
        // Check if we have any signs that installation might be possible
        const isSecureContext = window.isSecureContext
        const hasServiceWorker = 'serviceWorker' in navigator
        const isHTTPS = window.location.protocol === 'https:'
        const isLocalhost = window.location.hostname === 'localhost'
        
        if ((isHTTPS || isLocalhost) && isSecureContext && hasServiceWorker) {
          // These are good signs that PWA installation should be possible
          // but if we haven't received the beforeinstallprompt event,
          // we might be in a browser that supports it but hasn't triggered it yet
          console.log('[PWA] PWA installation may be available, but prompt not triggered yet')
          setIsInstallable(true) // Show the install option anyway
        }
      }
    }, 3000) // Wait 3 seconds for the event

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timeoutId)
    }
  }, [hasCheckedCapability])

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
    } else {
      // If no deferred prompt, provide manual installation instructions
      console.log('[PWA] No deferred prompt available, showing manual instructions')
      
      // Check browser type and provide appropriate instructions
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)
      
      let instructions = 'To install this app:\n\n'
      
      if (isChrome) {
        instructions += '1. Click the three dots (⋮) in the top right corner\n2. Select "Install Splash Screen App" or "Add to Home screen"\n3. Click "Install" when prompted'
      } else if (isFirefox) {
        instructions += '1. Click the address bar\n2. Look for the "Install" icon (📦)\n3. Click it and follow the prompts'
      } else if (isSafari) {
        instructions += '1. Click the Share button (📤)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm'
      } else {
        instructions += '1. Look for an "Install" or "Add to Home Screen" option in your browser menu\n2. This is usually found in the address bar or browser menu\n3. Follow the prompts to install'
      }
      
      alert(instructions)
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

  if (!isInstallable && hasCheckedCapability) {
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
            Progressive Web App installation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-yellow-200' : 'bg-yellow-900'
              }`}>
                <Download className={`w-4 h-4 ${
                  theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'
                }`} />
              </div>
            </div>
            <div>
              <p className={`font-medium ${
                theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'
              }`}>
                Installation Available
              </p>
              <p className={`text-sm ${
                theme === 'light' ? 'text-yellow-600' : 'text-yellow-500'
              }`}>
                Look for an install icon in your browser's address bar or menu
              </p>
            </div>
          </div>
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Show Install Instructions
          </Button>
          <p className="text-xs text-center text-gray-400">
            Manual installation instructions for your browser
          </p>
        </CardContent>
      </Card>
    )
  }

  // Show loading state while checking
  if (!hasCheckedCapability) {
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
            Checking installation capability...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                theme === 'light' ? 'bg-blue-200' : 'bg-blue-900'
              }`}>
                <div className={`w-4 h-4 animate-spin rounded-full border-2 border-transparent border-t-current ${
                  theme === 'light' ? 'text-blue-700' : 'text-blue-400'
                }`} />
              </div>
            </div>
            <div>
              <p className={`font-medium ${
                theme === 'light' ? 'text-blue-700' : 'text-blue-400'
              }`}>
                Checking Installation...
              </p>
              <p className={`text-sm ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-500'
              }`}>
                Please wait while we check if this app can be installed
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
