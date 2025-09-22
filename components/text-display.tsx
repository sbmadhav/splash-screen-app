"use client"

import { useState, useEffect, useRef } from "react"

interface AppSettings {
  showText: boolean
  textToShow: string
  enableHeadingAnimation: boolean
  theme: 'light' | 'dark' | 'system'
  hideHeaderWhenFinished: boolean
  showTimer: boolean
}

interface TimerState {
  isFinished: boolean
}

const defaultSettings = {
  showText: true,
  textToShow: "We'll be starting soon!",
  enableHeadingAnimation: false,
  theme: 'system' as const,
  hideHeaderWhenFinished: false,
  showTimer: false,
}

export function TextDisplay() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [timerState, setTimerState] = useState<TimerState>({ isFinished: false })
  const textRef = useRef<HTMLHeadingElement>(null)

  // Resolve theme
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

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          setSettings({
            showText: parsed.showText ?? defaultSettings.showText,
            textToShow: parsed.textToShow ?? defaultSettings.textToShow,
            enableHeadingAnimation: parsed.enableHeadingAnimation ?? defaultSettings.enableHeadingAnimation,
            theme: parsed.theme ?? defaultSettings.theme,
            hideHeaderWhenFinished: parsed.hideHeaderWhenFinished ?? defaultSettings.hideHeaderWhenFinished,
            showTimer: parsed.showTimer ?? defaultSettings.showTimer,
          })
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    loadSettings()

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      const newSettings = event.detail
      setSettings({
        showText: newSettings.showText ?? defaultSettings.showText,
        textToShow: newSettings.textToShow ?? defaultSettings.textToShow,
        enableHeadingAnimation: newSettings.enableHeadingAnimation ?? defaultSettings.enableHeadingAnimation,
        theme: newSettings.theme ?? defaultSettings.theme,
        hideHeaderWhenFinished: newSettings.hideHeaderWhenFinished ?? defaultSettings.hideHeaderWhenFinished,
        showTimer: newSettings.showTimer ?? defaultSettings.showTimer,
      })
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate as EventListener)

    return () => {
      window.removeEventListener("settingsChanged", handleSettingsUpdate as EventListener)
    }
  }, [])

  // Listen for timer state changes
  useEffect(() => {
    const handleTimerStateChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setTimerState(customEvent.detail)
    }

    window.addEventListener("timerStateChanged", handleTimerStateChange)
    return () => {
      window.removeEventListener("timerStateChanged", handleTimerStateChange)
    }
  }, [])

  useEffect(() => {
    if (settings.showText && settings.textToShow.trim() && textRef.current) {
      // Clean up any existing animations first
      if ((window as any).anime) {
        ;(window as any).anime.remove(".ml12 .letter")
        ;(window as any).anime.remove(textRef.current)
      }
      
      if (settings.enableHeadingAnimation) {
        // Load and run animation
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"
        script.onload = () => {
          setTimeout(() => {
            if ((window as any).anime && textRef.current && settings.enableHeadingAnimation) {
              const textElement = textRef.current
              const text = textElement.textContent || ""
              textElement.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>")

              ;(window as any).anime
                .timeline({ loop: true })
                .add({
                  targets: ".ml12 .letter",
                  translateX: [40, 0],
                  translateZ: 0,
                  opacity: [0, 1],
                  easing: "easeOutExpo",
                  duration: 1200,
                  delay: (el: any, i: number) => 500 + 30 * i,
                })
                .add({
                  targets: ".ml12 .letter",
                  translateX: [0, -30],
                  opacity: [1, 0],
                  easing: "easeInExpo",
                  duration: 1100,
                  delay: (el: any, i: number) => 100 + 30 * i,
                })
            }
          }, 100)
        }

        // Only add script if it doesn't exist
        if (!document.querySelector('script[src*="anime.min.js"]')) {
          document.head.appendChild(script)
        } else if ((window as any).anime && textRef.current) {
          // If anime.js already loaded, run animation directly
          setTimeout(() => {
            if (textRef.current && settings.enableHeadingAnimation) {
              const textElement = textRef.current
              const text = textElement.textContent || ""
              textElement.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>")

              ;(window as any).anime
                .timeline({ loop: true })
                .add({
                  targets: ".ml12 .letter",
                  translateX: [40, 0],
                  translateZ: 0,
                  opacity: [0, 1],
                  easing: "easeOutExpo",
                  duration: 1200,
                  delay: (el: any, i: number) => 500 + 30 * i,
                })
                .add({
                  targets: ".ml12 .letter",
                  translateX: [0, -30],
                  opacity: [1, 0],
                  easing: "easeInExpo",
                  duration: 1100,
                  delay: (el: any, i: number) => 100 + 30 * i,
                })
            }
          }, 100)
        }
      } else {
        // Reset text content to original without spans and ensure no animation classes
        if (textRef.current) {
          textRef.current.innerHTML = settings.textToShow
          textRef.current.style.transform = ''
          textRef.current.style.opacity = '1'
          // Remove any letter spans that might exist
          const letters = textRef.current.querySelectorAll('.letter')
          letters.forEach(letter => {
            if (letter.parentNode) {
              letter.parentNode.replaceChild(document.createTextNode(letter.textContent || ''), letter)
            }
          })
        }
      }
    }
  }, [settings.showText, settings.textToShow, settings.enableHeadingAnimation])

  if (!settings.showText || !settings.textToShow.trim()) {
    return null
  }

  // Hide text if timer is finished and hideHeaderWhenFinished is enabled and timer is being used
  if (settings.showTimer && timerState.isFinished && settings.hideHeaderWhenFinished) {
    return null
  }

  return (
    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10 max-w-[95vw] px-4">
      <h1
        ref={textRef}
        className="ml12 font-raleway text-center drop-shadow-2xl transition-all duration-500 uppercase rounded-lg break-words"
        style={{
          color: resolvedTheme === 'light' ? '#374151' : '#d3e3e3',
          fontSize: `clamp(1.5rem, 4vw, 3.2rem)`,
          textDecoration: "none",
          fontWeight: 200,
          fontFamily: "'Courier New', Courier, monospace",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          lineHeight: "1.2",
          wordBreak: "normal",
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {settings.textToShow}
      </h1>
    </div>
  )
}
