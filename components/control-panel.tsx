"use client"

import { useState, useEffect } from "react"
import { Settings, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"

interface ControlPanelProps {
  onRefresh: () => void
  isTransitioning?: boolean
  showInfoButton?: boolean
  onInfoClick?: () => void
}

interface AppSettings {
  useCustomImage: boolean
  offlineImageMode: boolean
  theme: 'light' | 'dark' | 'system'
}

export function ControlPanel({ 
  onRefresh, 
  isTransitioning = false,
  showInfoButton = false,
  onInfoClick
}: ControlPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showRefreshButton, setShowRefreshButton] = useState(true)
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
          // Show button unless using custom image
          setShowRefreshButton(!settings.useCustomImage)
        }

        // Resolve theme
        if (appTheme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
        } else {
          setResolvedTheme(appTheme)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      }
    }

    loadAndResolveTheme()

    // Listen for settings changes
    const handleSettingsChange = () => {
      loadAndResolveTheme()
    }

    window.addEventListener("settingsChanged", handleSettingsChange)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => {
      loadAndResolveTheme()
    }
    mediaQuery.addEventListener('change', handleThemeChange)

    return () => {
      window.removeEventListener("settingsChanged", handleSettingsChange)
      mediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.error('Error refreshing image:', error)
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  const isLoading = isRefreshing || isTransitioning

  const buttonBaseClass = `backdrop-blur-sm transition-all duration-200 ${
    resolvedTheme === 'dark'
      ? 'bg-gray-900/90 border-gray-600/70 hover:bg-gray-800/95 hover:border-gray-500/80 text-gray-100 hover:text-white shadow-xl' 
      : 'bg-white/90 border-gray-300/70 hover:bg-white/95 hover:border-gray-400/80 text-gray-700 hover:text-gray-900 shadow-xl'
  }`

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
        {/* Info Button - Mobile Only */}
        {showInfoButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onInfoClick}
                variant="outline"
                size="sm"
                className={`h-9 sm:h-10 px-2 sm:px-3 ${buttonBaseClass}`}
                aria-label="Show image and music information"
              >
                <Info className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-sm font-medium">Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>View image details and music controls</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Refresh Button */}
        {showRefreshButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className={`h-9 sm:h-10 px-2 sm:px-3 ${buttonBaseClass} ${
                  isLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                }`}
                aria-label={isTransitioning ? "Loading new image..." : "Refresh background image"}
              >
                <RefreshCw className={`h-4 w-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-sm font-medium">
                  {isLoading ? 'Loading...' : 'New Image'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p>{isTransitioning ? 'Loading a new background image...' : 'Get a new random background image'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Settings Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 sm:h-10 px-2 sm:px-3 ${buttonBaseClass}`}
                aria-label="Open settings"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-sm font-medium">Settings</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p>Customize timer, background, music, and theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
