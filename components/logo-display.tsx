"use client"

import { useState, useEffect } from "react"

interface AppSettings {
  showLogo: boolean
  useCustomLogo: boolean
  customLogoUrl: string
}

const defaultSettings = {
  showLogo: true,
  useCustomLogo: false,
  customLogoUrl: "",
}

export function LogoDisplay() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          setSettings({
            showLogo: parsed.showLogo ?? defaultSettings.showLogo,
            useCustomLogo: parsed.useCustomLogo ?? defaultSettings.useCustomLogo,
            customLogoUrl: parsed.customLogoUrl ?? defaultSettings.customLogoUrl,
          })
        }
      } catch (error) {
        console.error("Failed to load logo settings:", error)
      }
    }

    loadSettings()

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      const newSettings = event.detail
      setSettings({
        showLogo: newSettings.showLogo ?? defaultSettings.showLogo,
        useCustomLogo: newSettings.useCustomLogo ?? defaultSettings.useCustomLogo,
        customLogoUrl: newSettings.customLogoUrl ?? defaultSettings.customLogoUrl,
      })
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate as EventListener)

    return () => {
      window.removeEventListener("settingsChanged", handleSettingsUpdate as EventListener)
    }
  }, [])

  if (!settings.showLogo || !settings.useCustomLogo || !settings.customLogoUrl) {
    return null
  }

  return (
    <div className="absolute top-6 left-6 z-20">
      <div className="h-28 rounded-xl bg-white/40">
        <img
          src={settings.customLogoUrl}
          alt="Custom logo"
          className="w-full h-full object-contain p-4 rounded"
        />
      </div>
    </div>
  )
}
