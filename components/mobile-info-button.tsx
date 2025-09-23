"use client"

import { useState, useEffect } from "react"
import { Info, X, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ImageData } from "@/types/image"

interface MobileInfoButtonProps {
  imageData: ImageData | null
}

interface MusicSettings {
  selectedMusic: string
  theme: 'light' | 'dark' | 'system'
}

const defaultSettings: MusicSettings = {
  selectedMusic: "lofi-chill",
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

export function MobileInfoButton({ imageData }: MobileInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [settings, setSettings] = useState<MusicSettings>(defaultSettings)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Resolve theme
  useEffect(() => {
    const loadAndResolveTheme = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        let appTheme: 'light' | 'dark' | 'system' = 'system'
        
        if (savedSettings) {
          const settingsData = JSON.parse(savedSettings)
          appTheme = settingsData.theme || 'system'
          setSettings({
            selectedMusic: settingsData.selectedMusic || defaultSettings.selectedMusic,
            theme: appTheme,
          })
        }

        if (appTheme === 'system') {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
        } else {
          setResolvedTheme(appTheme)
        }
      } catch (error) {
        console.error("Failed to load theme:", error)
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
      }
    }

    loadAndResolveTheme()

    // Listen for settings changes
    const handleSettingsUpdate = () => {
      loadAndResolveTheme()
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate)
    return () => window.removeEventListener("settingsChanged", handleSettingsUpdate)
  }, [])

  // Initialize audio for mobile
  useEffect(() => {
    if (!isSmallScreen) return

    const audioUrl = `./music/${settings.selectedMusic}.mp3`
    const audio = new Audio(audioUrl)
    audio.loop = true
    audio.volume = 0.5
    setCurrentAudio(audio)

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [settings.selectedMusic, isSmallScreen])

  const togglePlay = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause()
      } else {
        currentAudio.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (currentAudio) {
      currentAudio.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const getCurrentMusicLabel = () => {
    const option = musicOptions.find(opt => opt.value === settings.selectedMusic)
    return option?.label || settings.selectedMusic
  }

  const getCurrentMusicAttribution = () => {
    const option = musicOptions.find(opt => opt.value === settings.selectedMusic)
    return option?.attribution
  }

  if (!isSmallScreen) return null

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-30 lg:hidden p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
          resolvedTheme === 'dark'
            ? 'bg-black/40 text-white hover:bg-black/60'
            : 'bg-white/40 text-gray-900 hover:bg-white/60'
        }`}
      >
        <Info className="h-5 w-5" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto">
            <div className={`mx-4 mb-4 rounded-t-xl backdrop-blur-md ${
              resolvedTheme === 'dark'
                ? 'bg-black/80 text-white'
                : 'bg-white/80 text-gray-900'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300/20">
                <h3 className="font-semibold">Information</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-300/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-6">
                {/* Image Information */}
                {imageData && !imageData.isCustom && (
                  <div>
                    <h4 className="font-medium mb-3">Image Information</h4>
                    <div className="space-y-2 text-sm">
                      {imageData.location && imageData.location !== "Unknown" && imageData.location.trim() !== "" && (
                        <div>
                          <span className="opacity-70">Location: </span>
                          <span className="font-medium">{imageData.location}</span>
                        </div>
                      )}
                      {imageData.title && imageData.title !== "Unknown" && imageData.title.trim() !== "" && (
                        <div>
                          <span className="opacity-70">Title: </span>
                          <span>{imageData.title}</span>
                        </div>
                      )}
                      {imageData.copyright && imageData.copyright !== "Unknown" && imageData.copyright.trim() !== "" && (
                        <div>
                          <span className="opacity-70">Copyright: </span>
                          <span className="text-xs">© {imageData.copyright}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Music Player */}
                <div>
                  <h4 className="font-medium mb-3">Now Playing</h4>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="opacity-70">Track: </span>
                      <span className="font-medium">{getCurrentMusicLabel()}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={togglePlay}
                        size="sm"
                        className={`${
                          resolvedTheme === 'light'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 mr-1" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      
                      <Button
                        onClick={toggleMute}
                        size="sm"
                        variant="outline"
                        className={`${
                          resolvedTheme === 'light'
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4 mr-1" />
                        ) : (
                          <Volume2 className="h-4 w-4 mr-1" />
                        )}
                        {isMuted ? 'Unmute' : 'Mute'}
                      </Button>
                    </div>

                    {getCurrentMusicAttribution() && (
                      <div className="text-xs opacity-60 mt-2">
                        {getCurrentMusicAttribution()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
