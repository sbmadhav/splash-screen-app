"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { OfflineImageSelector } from "@/components/offline-image-selector"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

interface AppSettings {
  showLogo: boolean
  showText: boolean
  textToShow: string
  showTimer: boolean
  timerMinutes: number
  hideHeaderWhenFinished: boolean
  timerTitle: string
  enableHeadingAnimation: boolean
  selectedMusic: string
  useCustomImage: boolean
  customImageUrl: string
  useCustomLogo: boolean
  customLogoUrl: string
  theme: 'light' | 'dark' | 'system'
  offlineImageMode: boolean
  selectedOfflineImage?: string
}

const musicOptions = [
  { value: "cinematic-chillhop", label: "Cinematic Chillhop" },
  { value: "dreams", label: "Dreams" },
  { value: "forest-lullaby", label: "Forest Lullaby" },
  { value: "in-the-forest-ambience", label: "In the Forest Ambience" },
  { value: "just-relax", label: "Just Relax" },
  { value: "lofi-chill", label: "Lofi Chill" },
  { value: "onceagain", label: "Once Again" },
  { value: "open-sky", label: "Open Sky" },
  { value: "rainbow-after-rain", label: "Rainbow After Rain" },
]

const defaultSettings: AppSettings = {
  showLogo: false,
  showText: false,
  textToShow: "We'll be starting soon!",
  showTimer: true,
  timerMinutes: 5,
  hideHeaderWhenFinished: false,
  timerTitle: "Focus time",
  enableHeadingAnimation: false,
  selectedMusic: "just-relax",
  useCustomImage: false,
  customImageUrl: "",
  useCustomLogo: false,
  customLogoUrl: "",
  theme: 'system',
  offlineImageMode: true, // Default to true for offline images
  selectedOfflineImage: undefined,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [tempSettings, setTempSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Resolve theme for UI
  useEffect(() => {
    const resolveTheme = () => {
      if (tempSettings.theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      } else {
        setResolvedTheme(tempSettings.theme)
      }
    }

    resolveTheme()

    if (tempSettings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', resolveTheme)
      return () => mediaQuery.removeEventListener('change', resolveTheme)
    }
  }, [tempSettings.theme])

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem("appSettings")
      if (savedSettings) {
        const parsed = { ...defaultSettings, ...JSON.parse(savedSettings) }
        setSettings(parsed)
        setTempSettings(parsed)
      } else {
        setTempSettings(defaultSettings)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      setTempSettings(defaultSettings)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      localStorage.setItem("appSettings", JSON.stringify(tempSettings))
      setSettings(tempSettings)
      // Trigger a custom event to notify other components of settings change
      window.dispatchEvent(new CustomEvent("settingsChanged", { detail: tempSettings }))
      
      // Visual feedback - briefly show success state
      setTimeout(() => {
        // Add a success indicator or keep the original text
      }, 100)
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const updateTempSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setTempSettings((prev) => {
      const newSettings = { ...prev, [key]: value }
      
      // For offline image selection, dispatch immediate change event
      if (key === 'selectedOfflineImage' && prev.offlineImageMode) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("settingsChanged", { detail: newSettings }))
        }, 0)
      }
      
      return newSettings
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB')
      return
    }

    setUploading(true)
    try {
      // Convert to base64 and store in localStorage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateTempSetting("customImageUrl", result)
        updateTempSetting("useCustomImage", true)
        setUploading(false)
      }
      reader.onerror = () => {
        alert('Error reading file')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
      setUploading(false)
    }
  }

  const removeCustomImage = () => {
    updateTempSetting("customImageUrl", "")
    updateTempSetting("useCustomImage", false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB for logos)
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file size must be less than 5MB')
      return
    }

    setUploadingLogo(true)
    try {
      // Convert to base64 and store in localStorage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateTempSetting("customLogoUrl", result)
        updateTempSetting("useCustomLogo", true)
        setUploadingLogo(false)
      }
      reader.onerror = () => {
        alert('Error reading file')
        setUploadingLogo(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Error uploading logo')
      setUploadingLogo(false)
    }
  }

  const removeCustomLogo = () => {
    updateTempSetting("customLogoUrl", "")
    if (logoInputRef.current) {
      logoInputRef.current.value = ""
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 ${
      resolvedTheme === 'light' 
        ? 'bg-gray-50' 
        : 'bg-gray-950'
    }`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className={`cursor-pointer ${resolvedTheme === 'light' 
                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                : 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>App Settings</h1>
            <p className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Customize your background experience
            </p>
          </div>
        </div>

        {/* Background Settings */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'}>
              Background Settings
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Configure your background image source
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Use Custom Background
                  </Label>
                  <p className={`text-sm ${
                    resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>Upload your own background image</p>
                </div>
                <Switch
                  checked={tempSettings.useCustomImage}
                  onCheckedChange={(checked) => updateTempSetting("useCustomImage", checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 cursor-pointer"
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`cursor-pointer ${resolvedTheme === 'light' 
                      ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      : 'border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Choose Image"}
                  </Button>
                  
                  {tempSettings.customImageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeCustomImage}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Image Preview */}
                {tempSettings.customImageUrl && (
                  <div className="space-y-2">
                    <Label className="text-gray-200">Preview</Label>
                    <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                      <img
                        src={tempSettings.customImageUrl}
                        alt="Custom background preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, WebP. Maximum size: 10MB
                </p>
              </div>
            </div>

            {/* Offline Images Section */}
            <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Switch
                  id="offline-mode"
                  checked={tempSettings.offlineImageMode}
                  onCheckedChange={(checked) => updateTempSetting("offlineImageMode", checked)}
                />
                <div>
                  <Label 
                    htmlFor="offline-mode" 
                    className={resolvedTheme === 'light' ? 'text-gray-700 cursor-pointer' : 'text-gray-200 cursor-pointer'}
                  >
                    Use Offline Images Only
                  </Label>
                  <p className={`text-sm ${
                    resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>Load images from local storage instead of fetching from internet</p>
                </div>
              </div>

              {tempSettings.offlineImageMode && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <OfflineImageSelector
                    selectedImage={tempSettings.selectedOfflineImage}
                    onImageSelect={(imageName) => updateTempSetting("selectedOfflineImage", imageName)}
                    theme={resolvedTheme}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Music Settings */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'}>
              Music Settings
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Choose background music for your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="music-select" className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                Choose Music
              </Label>
              <Select value={tempSettings.selectedMusic} onValueChange={(value) => updateTempSetting("selectedMusic", value)}>
                <SelectTrigger className={cn(
                  "cursor-pointer",
                  resolvedTheme === 'light' 
                    ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-400 [&_svg]:text-gray-500'
                    : 'bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-400 [&_svg]:text-white-400'
                )}>
                  <SelectValue placeholder="Select background music" />
                </SelectTrigger>
                <SelectContent className={resolvedTheme === 'light' 
                  ? 'bg-white border-gray-300'
                  : 'bg-gray-800 border-gray-600'
                }>
                  {musicOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value} 
                      className={resolvedTheme === 'light' 
                        ? 'text-gray-900 focus:bg-gray-100 cursor-pointer'
                        : 'text-gray-200 focus:bg-gray-700 cursor-pointer'
                      }
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logo Settings */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'}>
              Logo Settings
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Configure your custom logo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show Logo Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                  Show Logo
                </Label>
                <p className={`text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>Display the app logo</p>
              </div>
              <Switch
                checked={tempSettings.showLogo}
                onCheckedChange={(checked) => updateTempSetting("showLogo", checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 cursor-pointer"
              />
            </div>

            {/* Custom Logo Upload - Only show when logo is enabled */}
            {tempSettings.showLogo && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className={resolvedTheme === 'light' 
                      ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 cursor-pointer'
                      : 'border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 cursor-pointer'
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingLogo ? "Uploading..." : "Choose Logo"}
                  </Button>
                  
                  {tempSettings.customLogoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeCustomLogo}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {/* Logo Preview */}
                {tempSettings.customLogoUrl && (
                  <div className="space-y-2">
                    <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Preview</Label>
                    <div className={`relative w-32 h-32 rounded-lg overflow-hidden border mx-auto ${
                      resolvedTheme === 'light' 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      <img
                        src={tempSettings.customLogoUrl}
                        alt="Custom logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <p className={`text-xs ${
                  resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Supported formats: JPG, PNG, WebP, SVG. Maximum size: 5MB. Recommended: Square aspect ratio
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'}>
              General Settings
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Configure the basic appearance and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selector */}
            <div className="space-y-2">
              <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                Theme
              </Label>
              <p className={`text-sm ${
                resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>Choose your preferred theme</p>
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    tempSettings.theme === 'light' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : resolvedTheme === 'light'
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => updateTempSetting("theme", "light")}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300"></div>
                  </div>
                  <p className={`text-sm text-center ${
                    resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>Light</p>
                </div>
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    tempSettings.theme === 'dark' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : resolvedTheme === 'light'
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => updateTempSetting("theme", "dark")}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600"></div>
                  </div>
                  <p className={`text-sm text-center ${
                    resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>Dark</p>
                </div>
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    tempSettings.theme === 'system' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : resolvedTheme === 'light'
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => updateTempSetting("theme", "system")}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-gray-800 border-2 border-gray-500"></div>
                  </div>
                  <p className={`text-sm text-center ${
                    resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>System</p>
                </div>
              </div>
            </div>
            {/* Show Text Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                  Show Text
                </Label>
                <p className={`text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>Display custom text overlay</p>
              </div>
              <Switch
                checked={tempSettings.showText}
                onCheckedChange={(checked) => updateTempSetting("showText", checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 cursor-pointer"
              />
            </div>
            

            {/* Text to Show */}
            {tempSettings.showText && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="text-to-show" className="text-gray-200">
                    Text to Show
                  </Label>
                  <Textarea
                    id="text-to-show"
                    value={tempSettings.textToShow}
                    onChange={(e) => updateTempSetting("textToShow", e.target.value)}
                    placeholder="Enter the text to display"
                    rows={3}
                    className="bg-gray-800 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-blue-400 cursor-text"
                  />
                </div>

                {/* Enable Heading Animation */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                      Enable Heading Animation
                    </Label>
                    <p className={`text-sm ${
                      resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>Animate text with typewriter effect</p>
                  </div>
                  <Switch
                    checked={tempSettings.enableHeadingAnimation}
                    onCheckedChange={(checked) => updateTempSetting("enableHeadingAnimation", checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 cursor-pointer"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Timer Settings */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'}>Timer Settings</CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Configure the focus timer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show Timer Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Show Timer</Label>
                <p className={`text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>Display a focus timer</p>
              </div>
              <Switch
                checked={tempSettings.showTimer}
                onCheckedChange={(checked) => updateTempSetting("showTimer", checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 cursor-pointer"
              />
            </div>

            {/* Timer Duration */}
            {tempSettings.showTimer && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="timer-minutes" className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Timer Duration (minutes)
                  </Label>
                  <Input
                    id="timer-minutes"
                    type="number"
                    min="1"
                    max="120"
                    value={tempSettings.timerMinutes}
                    onChange={(e) => updateTempSetting("timerMinutes", Number.parseInt(e.target.value) || 5)}
                    className={resolvedTheme === 'light' 
                      ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-400 cursor-text'
                      : 'bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-400 cursor-text'
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timer-title" className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                    Timer Title
                  </Label>
                  <Input
                    id="timer-title"
                    type="text"
                    placeholder="Focus time"
                    value={tempSettings.timerTitle}
                    onChange={(e) => updateTempSetting("timerTitle", e.target.value)}
                    className={resolvedTheme === 'light' 
                      ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-400 cursor-text'
                      : 'bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-400 cursor-text'
                    }
                  />
                  <p className={`text-xs ${
                    resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>Leave blank for no title. Shows when timer is running.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-200'}>Hide Main Title When Timer Finished</Label>
                    <p className={`text-sm ${
                      resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>Hide the main page title when timer runs out</p>
                  </div>
                  <Switch
                    checked={tempSettings.hideHeaderWhenFinished}
                    onCheckedChange={(checked) => updateTempSetting("hideHeaderWhenFinished", checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 cursor-pointer"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* PWA Install */}
        <PWAInstallPrompt theme={resolvedTheme} />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={saving} 
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
