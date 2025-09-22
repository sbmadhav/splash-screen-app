"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimerSettings {
  showTimer: boolean
  timerMinutes: number
  theme: 'light' | 'dark' | 'system'
  hideHeaderWhenFinished: boolean
  timerTitle: string
}

const defaultSettings: TimerSettings = {
  showTimer: true,
  timerMinutes: 5, // Changed to 5 minutes default
  theme: 'system',
  hideHeaderWhenFinished: false,
  timerTitle: 'Focus time',
}

export function TimerDisplay() {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings)
  const [timeLeft, setTimeLeft] = useState<number>(0) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Resolve theme for UI
  useEffect(() => {
    const resolveTheme = () => {
      if (settings.theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      } else {
        setResolvedTheme(settings.theme)
      }
    }

    resolveTheme()

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', resolveTheme)
      return () => mediaQuery.removeEventListener('change', resolveTheme)
    }
  }, [settings.theme])

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          const newSettings = {
            showTimer: parsed.showTimer ?? defaultSettings.showTimer,
            timerMinutes: parsed.timerMinutes ?? defaultSettings.timerMinutes,
            theme: parsed.theme ?? defaultSettings.theme,
            hideHeaderWhenFinished: parsed.hideHeaderWhenFinished ?? defaultSettings.hideHeaderWhenFinished,
            timerTitle: parsed.timerTitle ?? defaultSettings.timerTitle,
          }
          setSettings(newSettings)
          // Initialize timer with the loaded minutes
          if (!isRunning && timeLeft === 0) {
            setTimeLeft(newSettings.timerMinutes * 60)
          }
        } else {
          // No saved settings, initialize with default
          if (!isRunning && timeLeft === 0) {
            setTimeLeft(defaultSettings.timerMinutes * 60)
          }
        }
      } catch (error) {
        console.error("Failed to load timer settings:", error)
      }
    }

    loadSettings()

    // Listen for settings changes
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const newSettings = customEvent.detail
      const timerSettings = {
        showTimer: newSettings.showTimer ?? defaultSettings.showTimer,
        timerMinutes: newSettings.timerMinutes ?? defaultSettings.timerMinutes,
        theme: newSettings.theme ?? defaultSettings.theme,
        hideHeaderWhenFinished: newSettings.hideHeaderWhenFinished ?? defaultSettings.hideHeaderWhenFinished,
        timerTitle: newSettings.timerTitle ?? defaultSettings.timerTitle,
      }
      setSettings(timerSettings)
      
      // Reset timer if duration changed and timer is not running
      if (!isRunning && timerSettings.timerMinutes !== settings.timerMinutes) {
        setTimeLeft(timerSettings.timerMinutes * 60)
        setIsFinished(false)
      }
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate)
    
    // Listen for music player events to sync timer state
    const handleMusicStarted = () => {
      console.log('[Timer] Music started - starting timer if it has time')
      if (timeLeft > 0 && !isFinished) {
        setIsRunning(true)
      }
    }
    
    const handleMusicPaused = () => {
      console.log('[Timer] Music paused - pausing timer')
      setIsRunning(false)
    }
    
    window.addEventListener("musicStarted", handleMusicStarted)
    window.addEventListener("musicPaused", handleMusicPaused)
    
    return () => {
      window.removeEventListener("settingsChanged", handleSettingsUpdate)
      window.removeEventListener("musicStarted", handleMusicStarted)
      window.removeEventListener("musicPaused", handleMusicPaused)
    }
  }, [isRunning, settings.timerMinutes, timeLeft])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false)
            setIsFinished(true)
            // Stop music when timer finishes
            window.dispatchEvent(new CustomEvent('timerFinished'))
            // Dispatch timer state for text display
            window.dispatchEvent(new CustomEvent('timerStateChanged', { 
              detail: { isFinished: true }
            }))
            // Play notification sound or show notification
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(settings.timerMinutes * 60)
      setIsFinished(false)
    }
    setIsRunning(true)
    
    // Dispatch timer state change
    window.dispatchEvent(new CustomEvent('timerStateChanged', { 
      detail: { isFinished: false }
    }))
    
    // Start music when timer starts
    window.dispatchEvent(new CustomEvent('timerStarted'))
  }

  const handlePause = () => {
    setIsRunning(false)
    
    // Pause music when timer pauses
    window.dispatchEvent(new CustomEvent('timerPaused'))
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsFinished(false)
    setTimeLeft(settings.timerMinutes * 60)
    
    // Dispatch timer state change
    window.dispatchEvent(new CustomEvent('timerStateChanged', { 
      detail: { isFinished: false }
    }))
    
    // Stop music when timer resets
    window.dispatchEvent(new CustomEvent('timerReset'))
  }

  // Don't render if timer is disabled in settings
  if (!settings.showTimer) {
    return null
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
      <div className={`pointer-events-auto transition-all duration-300 ${
        isFinished 
          ? 'animate-pulse' 
          : ''
      }`}>
        {/* Circular Timer Container */}
        <div className="relative">
          {/* Background Circle - removed outer circle, keeping content area */}
          <div className="w-64 h-64 rounded-full m-6 relative">
            {/* Progress Ring */}
            <svg 
              className="absolute inset-0 w-full h-full transform -rotate-90" 
              viewBox="0 0 100 100"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={resolvedTheme === 'light' ? 'rgb(229 231 235)' : 'rgb(75 85 99)'}
                strokeWidth="2"
                opacity="0.3"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  isFinished 
                    ? 'rgb(239 68 68)' 
                    : isRunning 
                      ? 'rgb(59 130 246)'
                      : resolvedTheme === 'light' 
                        ? 'rgb(75 85 99)' 
                        : 'rgb(229 231 235)'
                }
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - (timeLeft / (settings.timerMinutes * 60)))}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              {/* Timer Display */}
              <div className={`text-4xl font-mono font-bold mb-2 transition-colors ${
                isFinished 
                  ? 'text-red-400' 
                  : resolvedTheme === 'light'
                    ? 'text-gray-900'
                    : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>

              {/* Status Text */}
              {(!isFinished || !settings.hideHeaderWhenFinished) && (
                <div className={`text-xs mb-4 text-center ${
                  resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {isFinished 
                    ? 'Time\'s up!' 
                    : isRunning 
                      ? (settings.timerTitle || 'Focus time')
                      : 'Ready to start'
                  }
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-2">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    size="sm"
                    className={`text-xs px-3 py-1 ${
                      resolvedTheme === 'light'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    size="sm"
                    variant="outline"
                    className={`text-xs px-3 py-1 ${
                      resolvedTheme === 'light'
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="outline"
                  className={`text-xs px-3 py-1 ${
                    resolvedTheme === 'light'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
