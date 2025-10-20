"use client"

import { useState, useEffect } from "react"
import type { ImageData } from "@/types/image"

interface AppSettings {
  useCustomImage: boolean
  customImageUrl: string
  offlineImageMode?: boolean
  selectedOfflineImage?: string
  autoRefreshMinutes?: number
  autoRefreshEnabled?: boolean
}

export function useBackgroundImage() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const fetchRandomImage = async (usedImages: string[], offlineImageMode: boolean = false): Promise<ImageData> => {
    console.log("[v0] Fetching random image from server API, used images:", usedImages.length, "offline mode:", offlineImageMode)

    try {
      const params = new URLSearchParams()
      if (usedImages.length > 0) {
        params.append("usedImages", usedImages.join(","))
      }
      if (offlineImageMode) {
        params.append("offlineImageMode", "true")
      }
      
      const response = await fetch(`/api/random-image?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Server API response received:", data.url ? "success" : "no url")
        console.log("[v0] Full API response data:", data)
        if (data.url) {
          return data
        } else {
          console.warn("[v0] API response missing URL, falling back")
        }
      } else {
        console.error("[v0] API response not ok:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("[v0] Error fetching from server API:", error)
    }

    // Emergency fallback
    const seed = Math.floor(Math.random() * 10000)
    const fallbackUrl = `https://picsum.photos/seed/${seed}/1920/1080`
    console.log("[v0] Using emergency fallback image:", fallbackUrl)

    return {
      url: fallbackUrl,
      title: "Beautiful landscape",
      copyright: "Scenic view",
      location: null,
    }
  }

  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        console.log("[v0] Image preloaded successfully:", url)
        resolve()
      }
      img.onerror = (error) => {
        console.error("[v0] Failed to preload image:", url, error)
        reject(new Error('Failed to load image'))
      }
      
      // Try without CORS first for Unsplash images, as they might not need it
      if (url.includes('unsplash.com')) {
        // Don't set crossOrigin for Unsplash - let the browser handle it naturally
        img.src = url
      } else {
        img.crossOrigin = "anonymous"
        img.src = url
      }
    })
  }

  const getCustomImageData = (customImageUrl: string): ImageData => {
    return {
      url: customImageUrl,
      title: "Custom Background",
      copyright: "User uploaded image",
      location: null,
      isCustom: true,
    }
  }

  const loadNewImageWithTransition = async () => {
    if (isTransitioning) return // Prevent multiple simultaneous transitions
    
    setIsTransitioning(true)
    console.log("[v0] Loading new image with transition...")
    
    try {
      // Check if user has custom image enabled or specific offline image selected
      const savedSettings = localStorage.getItem("appSettings")
      let useCustomImage = false
      let customImageUrl = ""
      let offlineImageMode = false
      let selectedOfflineImage = ""
      
      if (savedSettings) {
        const settings: AppSettings = JSON.parse(savedSettings)
        useCustomImage = settings.useCustomImage || false
        customImageUrl = settings.customImageUrl || ""
        offlineImageMode = settings.offlineImageMode || false
        selectedOfflineImage = settings.selectedOfflineImage || ""
      }

      // Priority 1: Custom uploaded image
      if (useCustomImage && customImageUrl) {
        console.log("[v0] Using custom uploaded image")
        const customImageData = getCustomImageData(customImageUrl)
        
        // Preload the image
        await preloadImage(customImageData.url)
        
        setImageData(customImageData)
        localStorage.setItem("lastLoadedImage", JSON.stringify(customImageData))
        setIsTransitioning(false)
        return
      }

      // Priority 2: Specific offline image selected
      if (offlineImageMode && selectedOfflineImage) {
        console.log("[v0] Using specific selected offline image:", selectedOfflineImage)
        const offlineImageData = {
          url: `/background/${selectedOfflineImage}`,
          title: selectedOfflineImage.replace(/\.(jpg|jpeg|png)$/i, '').replace(/-/g, ' '),
          copyright: "Local image",
          location: null,
          isLocal: true,
        }
        
        await preloadImage(offlineImageData.url)
        
        setImageData(offlineImageData)
        localStorage.setItem("lastLoadedImage", JSON.stringify(offlineImageData))
        setIsTransitioning(false)
        return
      }

      // Priority 3: Random images (offline or online based on settings)
      const usedImages = JSON.parse(localStorage.getItem("usedImages") || "[]")

      let attempts = 0
      let selectedImage = null

      while (attempts < 5 && !selectedImage) {
        const candidate = await fetchRandomImage(usedImages, offlineImageMode)
        if (!usedImages.includes(candidate.url)) {
          selectedImage = candidate
        }
        attempts++
      }

      if (!selectedImage) {
        localStorage.setItem("usedImages", JSON.stringify([]))
        selectedImage = await fetchRandomImage([], offlineImageMode)
      }

      // Preload the new image before setting it
      try {
        console.log("[v0] About to preload image:", selectedImage.url)
        console.log("[v0] Selected image full data:", selectedImage)
        await preloadImage(selectedImage.url)
        console.log("[v0] Successfully preloaded image:", selectedImage.url)
      } catch (preloadError) {
        console.warn("[v0] Preload failed, but continuing with image:", selectedImage.url, preloadError)
        console.log("[v0] Image data despite preload failure:", selectedImage)
        // Continue anyway - the image might still load in the background
        // Don't throw the error as it would trigger the fallback
      }

      const newUsedImages = [...usedImages, selectedImage.url].slice(-10)
      localStorage.setItem("usedImages", JSON.stringify(newUsedImages))

      console.log("[v0] About to set image data:", selectedImage)
      setImageData(selectedImage)
      
      // Store the current image data
      localStorage.setItem("lastLoadedImage", JSON.stringify(selectedImage))
      console.log("[v0] Successfully set new image:", selectedImage.url)

    } catch (error) {
      console.error("[v0] Error loading image:", error)
      const fallbackImage = {
        url: `https://picsum.photos/1920/1080?random=${Date.now()}`,
        title: "Random image",
        copyright: "Beautiful scenery",
        location: null,
      }
      
      try {
        await preloadImage(fallbackImage.url)
      } catch (preloadError) {
        console.error("[v0] Error preloading fallback image:", preloadError)
      }
      
      setImageData(fallbackImage)
      localStorage.setItem("lastLoadedImage", JSON.stringify(fallbackImage))
    } finally {
      setIsTransitioning(false)
    }
  }

  const loadNewImage = async () => {
    console.log("[v0] Loading new image...")
    
    try {
      // Check if user has custom image enabled or specific offline image selected
      const savedSettings = localStorage.getItem("appSettings")
      let useCustomImage = false
      let customImageUrl = ""
      let offlineImageMode = false
      let selectedOfflineImage = ""
      
      if (savedSettings) {
        const settings: AppSettings = JSON.parse(savedSettings)
        useCustomImage = settings.useCustomImage || false
        customImageUrl = settings.customImageUrl || ""
        offlineImageMode = settings.offlineImageMode || false
        selectedOfflineImage = settings.selectedOfflineImage || ""
      }

      // Priority 1: Custom uploaded image
      if (useCustomImage && customImageUrl) {
        console.log("[v0] Using custom uploaded image")
        const customImageData = getCustomImageData(customImageUrl)
        setImageData(customImageData)
        localStorage.setItem("lastLoadedImage", JSON.stringify(customImageData))
        setLoading(false)
        return
      }

      // Priority 2: Specific offline image selected
      if (offlineImageMode && selectedOfflineImage) {
        console.log("[v0] Using specific selected offline image:", selectedOfflineImage)
        const offlineImageData = {
          url: `/background/${selectedOfflineImage}`,
          title: selectedOfflineImage.replace(/\.(jpg|jpeg|png)$/i, '').replace(/-/g, ' '),
          copyright: "Local image",
          location: null,
          isLocal: true,
        }
        setImageData(offlineImageData)
        localStorage.setItem("lastLoadedImage", JSON.stringify(offlineImageData))
        setLoading(false)
        return
      }

      // Priority 3: Random images (offline or online based on settings)
      const usedImages = JSON.parse(localStorage.getItem("usedImages") || "[]")

      let attempts = 0
      let selectedImage = null

      while (attempts < 5 && !selectedImage) {
        const candidate = await fetchRandomImage(usedImages, offlineImageMode)
        if (!usedImages.includes(candidate.url)) {
          selectedImage = candidate
        }
        attempts++
      }

      if (!selectedImage) {
        localStorage.setItem("usedImages", JSON.stringify([]))
        selectedImage = await fetchRandomImage([], offlineImageMode)
      }

      const newUsedImages = [...usedImages, selectedImage.url].slice(-10)
      localStorage.setItem("usedImages", JSON.stringify(newUsedImages))

      console.log("[v0] Selected image:", selectedImage.url)
      setImageData(selectedImage)
      
      // Store the current image data
      localStorage.setItem("lastLoadedImage", JSON.stringify(selectedImage))
    } catch (error) {
      console.error("[v0] Error loading image:", error)
      const fallbackImage = {
        url: `https://picsum.photos/1920/1080?random=${Date.now()}`,
        title: "Random image",
        copyright: "Beautiful scenery",
        location: null,
      }
      setImageData(fallbackImage)
      localStorage.setItem("lastLoadedImage", JSON.stringify(fallbackImage))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load image on component mount
    const loadInitialImage = async () => {
      try {
        // First check if user has custom image enabled
        const savedSettings = localStorage.getItem("appSettings")
        let useCustomImage = false
        let customImageUrl = ""
        
        if (savedSettings) {
          const settings: AppSettings = JSON.parse(savedSettings)
          useCustomImage = settings.useCustomImage || false
          customImageUrl = settings.customImageUrl || ""
        }

        // If custom image is enabled and available, use it
        if (useCustomImage && customImageUrl) {
          console.log("[v0] Loading custom uploaded image on startup")
          const customImageData = getCustomImageData(customImageUrl)
          setImageData(customImageData)
          localStorage.setItem("lastLoadedImage", JSON.stringify(customImageData))
          setLoading(false)
          return
        }

        // Otherwise, try to load last random image or fetch new one
        const lastImageData = localStorage.getItem("lastLoadedImage")
        if (lastImageData) {
          const parsedImageData = JSON.parse(lastImageData)
          // Make sure the last image wasn't a custom image
          if (!parsedImageData.isCustom) {
            console.log("[v0] Loading last used random image from localStorage")
            setImageData(parsedImageData)
            setLoading(false)
            return
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load initial image from localStorage:", error)
      }
      
      // If no valid last image or error, load new random image
      loadNewImage()
    }

    loadInitialImage()

    // Listen for settings changes
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const newSettings = customEvent.detail as AppSettings
      
      const oldSettingsStr = localStorage.getItem("appSettings") || "{}"
      const oldSettings = JSON.parse(oldSettingsStr) as AppSettings
      
      // Check if any background-related settings changed
      const customImageChanged = oldSettings.useCustomImage !== newSettings.useCustomImage || 
                                 oldSettings.customImageUrl !== newSettings.customImageUrl
      const offlineModeChanged = oldSettings.offlineImageMode !== newSettings.offlineImageMode
      const selectedImageChanged = oldSettings.selectedOfflineImage !== newSettings.selectedOfflineImage
      
      console.log("[v0] Settings update detected:", {
        customImageChanged,
        offlineModeChanged,
        selectedImageChanged,
        newSelectedImage: newSettings.selectedOfflineImage
      })
      
      // Reload image if any background setting changed
      if (customImageChanged || offlineModeChanged || selectedImageChanged) {
        console.log("[v0] Background settings changed, reloading image...")
        loadNewImageWithTransition()
      }
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate)

    return () => {
      window.removeEventListener("settingsChanged", handleSettingsUpdate)
    }
  }, [])

  // Auto-refresh timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const setupAutoRefresh = () => {
      // Clear existing interval
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }

      const savedSettings = localStorage.getItem("appSettings")
      if (!savedSettings) return

      const settings: AppSettings = JSON.parse(savedSettings)
      const autoRefreshEnabled = settings.autoRefreshEnabled || false
      const autoRefreshMinutes = settings.autoRefreshMinutes || 5

      if (autoRefreshEnabled && autoRefreshMinutes > 0) {
        console.log(`[v0] Setting up auto-refresh every ${autoRefreshMinutes} minutes`)
        
        intervalId = setInterval(() => {
          console.log("[v0] Auto-refresh triggered")
          loadNewImageWithTransition()
        }, autoRefreshMinutes * 60 * 1000) // Convert minutes to milliseconds
      } else {
        console.log("[v0] Auto-refresh is disabled")
      }
    }

    setupAutoRefresh()

    // Re-setup auto-refresh when settings change
    const handleSettingsChange = () => {
      setupAutoRefresh()
    }

    window.addEventListener("settingsChanged", handleSettingsChange)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      window.removeEventListener("settingsChanged", handleSettingsChange)
    }
  }, [])

  return { imageData, loading, loadNewImage, loadNewImageWithTransition, isTransitioning }
}
