"use client"

import { useState, useEffect } from "react"
import { useBackgroundImage } from "@/hooks/use-background-image-enhanced"
import { BackgroundImage } from "@/components/background-image"
import { LocationDisplay } from "@/components/location-display"
import { LoadingScreen } from "@/components/loading-screen"
import { SettingsButton } from "@/components/settings-button"
import { TextDisplay } from "@/components/text-display"
import { LogoDisplay } from "@/components/logo-display"
import { ImageRefreshButton } from "@/components/image-refresh-button"
import { TimerDisplay } from "@/components/timer-display"
import { MusicPlayer } from "@/components/music-player"
import { MobileInfoButton } from "@/components/mobile-info-button"

export default function HomePage() {
  const { imageData, loading, loadNewImageWithTransition, isTransitioning } = useBackgroundImage()
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Load theme from settings
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setCurrentTheme(settings.theme || 'system')
        }
      } catch (error) {
        console.error("Error loading theme:", error)
      }
    }

    loadTheme()

    // Listen for settings changes
    const handleSettingsChange = () => {
      loadTheme()
    }

    window.addEventListener("settingsChanged", handleSettingsChange)
    return () => window.removeEventListener("settingsChanged", handleSettingsChange)
  }, [])

  // Resolve system theme
  useEffect(() => {
    const resolveTheme = () => {
      if (currentTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      } else {
        setResolvedTheme(currentTheme)
      }
    }

    resolveTheme()

    if (currentTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', resolveTheme)
      return () => mediaQuery.removeEventListener('change', resolveTheme)
    }
  }, [currentTheme])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${resolvedTheme === 'light' ? 'bg-gray-50' : ''}`}>
      {/* Audio Visualizer and Music Player (behind everything) - Hidden on mobile */}
      <div className="hidden lg:block">
        <MusicPlayer />
      </div>
      
      {/* Theme-aware overlay */}
      <div className={`absolute inset-0 z-5 ${
        resolvedTheme === 'light' 
          ? 'bg-white/10' 
          : 'bg-black/20'
      }`}></div>
      
      {/* Background Image */}
      <BackgroundImage imageData={imageData} />
      
      {/* UI Components */}
      <div className="hidden lg:block">
        <LocationDisplay imageData={imageData} />
      </div>
      <TextDisplay />
      <LogoDisplay />
      <TimerDisplay />
      <ImageRefreshButton onRefresh={loadNewImageWithTransition} isTransitioning={isTransitioning} />
      <SettingsButton />
      
      {/* Mobile Info Button - Only shown on small screens */}
      <MobileInfoButton imageData={imageData} />
    </div>
  )
}
