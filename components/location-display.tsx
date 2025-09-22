"use client"

import { useState, useEffect } from "react"
import type { ImageData } from "@/types/image"

interface LocationDisplayProps {
  imageData: ImageData | null
}

export function LocationDisplay({ imageData }: LocationDisplayProps) {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Load and resolve theme from app settings
    const loadAndResolveTheme = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        let appTheme: 'light' | 'dark' | 'system' = 'system'
        
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          appTheme = settings.theme || 'system'
        }

        // Resolve theme
        if (appTheme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
        } else {
          setResolvedTheme(appTheme)
        }
      } catch (error) {
        console.error("Failed to load theme:", error)
        // Fallback to system theme
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      }
    }

    loadAndResolveTheme()

    // Listen for system theme changes (only if using system theme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      const savedSettings = localStorage.getItem("appSettings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
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

  if (!imageData) {
    return null
  }

  // Don't show info for custom uploaded images
  if (imageData.isCustom) {
    return null
  }

  // Only show if we have meaningful information
  const hasLocation = imageData.location && imageData.location !== "Unknown" && imageData.location.trim() !== ""
  const hasTitle = imageData.title && imageData.title !== "Unknown" && imageData.title.trim() !== ""
  const hasCopyright = imageData.copyright && imageData.copyright !== "Unknown" && imageData.copyright.trim() !== ""

  if (!hasLocation && !hasTitle && !hasCopyright) {
    return null
  }

  return (
    <div className={`absolute bottom-3 right-3 z-20 rounded-md px-2 py-1.5 backdrop-blur-sm transition-opacity hover:opacity-90 ${
      resolvedTheme === 'dark'
        ? 'bg-black/30 text-white hover:bg-black/50'
        : 'bg-white/30 text-gray-900 hover:bg-white/50'
    }`}>
      <div className="text-xs text-right space-y-0.5 max-w-xs">
        {hasLocation && (
          <div className="font-medium opacity-90">{imageData.location}</div>
        )}
        {hasTitle && (
          <div className="opacity-70 text-[10px] leading-tight">{imageData.title}</div>
        )}
        {hasCopyright && (
          <div className="opacity-60 text-[9px] leading-tight">© {imageData.copyright}</div>
        )}
      </div>
    </div>
  )
}
