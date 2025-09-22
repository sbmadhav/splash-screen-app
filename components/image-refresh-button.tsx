"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageRefreshButtonProps {
  onRefresh: () => void
  isTransitioning?: boolean
}

interface AppSettings {
  useCustomImage: boolean
  offlineImageMode: boolean
  theme: 'light' | 'dark' | 'system'
}

export function ImageRefreshButton({ onRefresh, isTransitioning = false }: ImageRefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Load and resolve theme from app settings
    const loadAndResolveTheme = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        let appTheme: 'light' | 'dark' | 'system' = 'system'
        
        if (savedSettings) {
          const settings: AppSettings = JSON.parse(savedSettings)
          appTheme = settings.theme || 'system'
          // Show button unless using custom image, but allow it for offline mode
          setShowButton(!settings.useCustomImage)
        }

        // Resolve theme
        if (appTheme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
        } else {
          setResolvedTheme(appTheme)
        }
        
        console.log('[ImageRefreshButton] Theme resolved:', appTheme, '->', resolvedTheme)
      } catch (error) {
        console.error("Failed to load settings:", error)
        // Fallback to system theme
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      }
    }

    loadAndResolveTheme()

    // Listen for system theme changes (only if using system theme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      // Only respond to system changes if we're using system theme
      const savedSettings = localStorage.getItem("appSettings")
      if (savedSettings) {
        const settings: AppSettings = JSON.parse(savedSettings)
        if ((settings.theme || 'system') === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
        }
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      const newSettings = event.detail
      // Show button unless using custom image, but allow it for offline mode
      setShowButton(!newSettings.useCustomImage)
      
      // Update theme
      const appTheme = newSettings.theme || 'system'
      if (appTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      } else {
        setResolvedTheme(appTheme)
      }
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate as EventListener)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
      window.removeEventListener("settingsChanged", handleSettingsUpdate as EventListener)
    }
  }, [])

  const handleRefresh = async () => {
    if (isRefreshing || isTransitioning) return
    
    setIsRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.error('Error refreshing image:', error)
    } finally {
      // Add a small delay to show the animation
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  if (!showButton) {
    return null
  }

  const isLoading = isRefreshing || isTransitioning

  return (
    <div className="absolute top-6 right-6 z-20">
      <Button
        onClick={handleRefresh}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className={`w-11 h-11 p-0 backdrop-blur-sm transition-all duration-200 ${
          resolvedTheme === 'dark'
            ? 'bg-gray-900/90 border-gray-600/70 hover:bg-gray-800/95 hover:border-gray-500/80 text-gray-100 hover:text-white shadow-xl' 
            : 'bg-white/90 border-gray-300/70 hover:bg-white/95 hover:border-gray-400/80 text-gray-700 hover:text-gray-900 shadow-xl'
        } ${isLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
        title={isTransitioning ? "Loading new image..." : "Refresh background image"}
      >
        <RefreshCw 
          className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} 
        />
      </Button>
    </div>
  )
}
