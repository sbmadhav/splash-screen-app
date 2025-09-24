"use client"

import { useState, useEffect } from "react"
import { AudioVisualizer } from "./audio-visualizer"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MusicSettings {
  selectedMusic: string
  theme: 'light' | 'dark' | 'system'
}

const defaultSettings: MusicSettings = {
  selectedMusic: "just-relax",
  theme: 'system',
}

const musicOptions = [
  { value: "cinematic-chillhop", label: "Cinematic Chillhop", attribution: null },
  { value: "dreams", label: "Dreams", attribution: "Music from Bensound.com/royalty-free-music License code: YWU05QVAFZK7DMBN" },
  { value: "forest-lullaby", label: "Forest Lullaby", attribution: null },
  { value: "in-the-forest-ambience", label: "In the Forest Ambience", attribution: null },
  { value: "just-relax", label: "Just Relax", attribution: null },
  { value: "lofi-chill", label: "Lofi Chill", attribution: null },
  { value: "onceagain", label: "Once Again", attribution: null },
  { value: "open-sky", label: "Open Sky", attribution: null },
  { value: "rainbow-after-rain", label: "Rainbow After Rain", attribution: null },
]

export function MusicPlayer() {
  const [settings, setSettings] = useState<MusicSettings>(defaultSettings)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("")
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [showControls, setShowControls] = useState(false)

  // Preload music file for better performance (lazy caching)
  const preloadMusicFile = async (audioUrl: string) => {
    try {
      console.log('[MusicPlayer] Preloading music file:', audioUrl)
      // Trigger a HEAD request to cache the music file without downloading the entire file
      const response = await fetch(audioUrl, { method: 'HEAD' })
      if (response.ok) {
        console.log('[MusicPlayer] Music file available and cached:', audioUrl)
      } else {
        console.warn('[MusicPlayer] Music file not available:', audioUrl, response.status)
      }
    } catch (error) {
      console.warn('[MusicPlayer] Could not preload music file:', audioUrl, error)
    }
  }

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

  // Load settings from localStorage
  useEffect(() => {
    console.log('[MusicPlayer] Component mounted, loading settings...')
    
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          const newSettings = {
            selectedMusic: parsed.selectedMusic ?? defaultSettings.selectedMusic,
            theme: parsed.theme ?? defaultSettings.theme,
          }
          setSettings(newSettings)
          
          // Set audio URL based on selected music
          if (newSettings.selectedMusic) {
            const audioUrl = `./music/${newSettings.selectedMusic}.mp3`
            console.log('[MusicPlayer] Setting audio URL:', audioUrl)
            setCurrentAudioUrl(audioUrl)
            preloadMusicFile(audioUrl) // Preload for better performance
          }
        } else {
          // Use default settings if no saved settings
          const audioUrl = `./music/${defaultSettings.selectedMusic}.mp3`
          console.log('[MusicPlayer] Using default audio URL:', audioUrl)
          setCurrentAudioUrl(audioUrl)
          preloadMusicFile(audioUrl) // Preload for better performance
        }
      } catch (error) {
        console.error("[MusicPlayer] Failed to load music settings:", error)
        // Fallback to default
        const audioUrl = `./music/${defaultSettings.selectedMusic}.mp3`
        setCurrentAudioUrl(audioUrl)
        preloadMusicFile(audioUrl) // Preload for better performance
      }
    }

    loadSettings()

    // Listen for settings changes
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const newSettings = customEvent.detail
      const musicSettings = {
        selectedMusic: newSettings.selectedMusic ?? defaultSettings.selectedMusic,
        theme: newSettings.theme ?? defaultSettings.theme,
      }
      console.log('[MusicPlayer] Settings updated:', musicSettings)
      
      // Check if music changed before updating settings
      const currentSelectedMusic = settings.selectedMusic
      const newSelectedMusic = musicSettings.selectedMusic
      
      setSettings(musicSettings)
      
      // Update audio URL if music selection changed
      if (newSelectedMusic !== currentSelectedMusic) {
        const audioUrl = `./music/${newSelectedMusic}.mp3`
        console.log('[MusicPlayer] Updating audio URL from settings:', audioUrl)
        setCurrentAudioUrl(audioUrl)
        preloadMusicFile(audioUrl) // Preload new music file for better performance
        setIsPlaying(false) // Stop current music when changing
      }
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate)
    
    // Listen for timer events and sync music playback
    const handleTimerStarted = () => {
      console.log('[MusicPlayer] Timer started - starting music')
      setIsPlaying(true)
    }
    
    const handleTimerPaused = () => {
      console.log('[MusicPlayer] Timer paused - pausing music') 
      setIsPlaying(false)
    }
    
    const handleTimerReset = () => {
      console.log('[MusicPlayer] Timer reset - stopping music')
      setIsPlaying(false)
    }
    
    const handleTimerFinished = () => {
      console.log('[MusicPlayer] Timer finished - stopping music')
      setIsPlaying(false)
    }
    
    window.addEventListener("timerStarted", handleTimerStarted)
    window.addEventListener("timerPaused", handleTimerPaused)
    window.addEventListener("timerReset", handleTimerReset)
    window.addEventListener("timerFinished", handleTimerFinished)
    
    return () => {
      window.removeEventListener("settingsChanged", handleSettingsUpdate)
      window.removeEventListener("timerStarted", handleTimerStarted)
      window.removeEventListener("timerPaused", handleTimerPaused)
      window.removeEventListener("timerReset", handleTimerReset)
      window.removeEventListener("timerFinished", handleTimerFinished)
    }
  }, []) // Remove dependency to prevent infinite loop

  // Debug state changes
  useEffect(() => {
    console.log('[MusicPlayer] State changed:', {
      currentAudioUrl,
      isPlaying,
      isMuted,
      selectedMusic: settings.selectedMusic,
      effectivelyPlaying: isPlaying && !isMuted
    })
  }, [currentAudioUrl, isPlaying, isMuted, settings.selectedMusic])

  const togglePlay = () => {
    const newIsPlaying = !isPlaying
    console.log('[MusicPlayer] Toggle play clicked')
    console.log('[MusicPlayer] Current state:', isPlaying, '-> New state:', newIsPlaying)
    console.log('[MusicPlayer] Current audio URL:', currentAudioUrl)
    console.log('[MusicPlayer] Will pass to AudioVisualizer:', newIsPlaying && !isMuted)
    setIsPlaying(newIsPlaying)
    
    // Dispatch events so timer can sync with music player
    if (newIsPlaying) {
      window.dispatchEvent(new CustomEvent('musicStarted'))
    } else {
      window.dispatchEvent(new CustomEvent('musicPaused'))
    }
  }

  const toggleMute = () => {
    console.log('[MusicPlayer] Toggle mute clicked, current state:', isMuted)
    setIsMuted(!isMuted)
  }

  const getCurrentMusicLabel = () => {
    const option = musicOptions.find(opt => opt.value === settings.selectedMusic)
    return option?.label || "No Music Selected"
  }

  const getCurrentMusicAttribution = () => {
    const option = musicOptions.find(opt => opt.value === settings.selectedMusic)
    return option?.attribution || null
  }

  return (
    <>
      {/* Audio Visualizer */}
      <AudioVisualizer 
        audioUrl={currentAudioUrl}
        isPlaying={isPlaying && !isMuted}
        onPlayStateChange={(playing) => {
          console.log('[MusicPlayer] Audio visualizer play state changed:', playing)
          setIsPlaying(playing)
        }}
      />
      
      {/* Music Controls - Bottom Middle */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className={`${
          showControls ? 'opacity-100' : 'opacity-70 hover:opacity-100'
        } transition-opacity duration-200`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        >
          <div className={`rounded-lg backdrop-blur-md shadow-lg border p-4 ${
            resolvedTheme === 'light'
              ? 'bg-white/80 border-gray-200/50 text-gray-900'
              : 'bg-black/60 border-gray-700/50 text-white'
          }`}>
            {/* Current Track */}
            <div className="text-sm mb-3 font-medium opacity-80 text-center">
              {getCurrentMusicLabel()}
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <Button
                onClick={togglePlay}
                size="lg"
                className={`px-4 py-2 ${
                  resolvedTheme === 'light'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                onClick={toggleMute}
                size="lg"
                variant="outline"
                className={`px-4 py-2 ${
                  resolvedTheme === 'light'
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 mr-2" />
                ) : (
                  <Volume2 className="h-5 w-5 mr-2" />
                )}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </div>
            
            {/* Music Attribution - Now at bottom */}
            {getCurrentMusicAttribution() && (
              <div className="text-xs opacity-40 text-center px-1 leading-tight">
                {getCurrentMusicAttribution()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
