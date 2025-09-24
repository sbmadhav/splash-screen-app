"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { shouldUseLocalImages, getBasePath } from "@/lib/static-utils"
import type { ImageData } from "@/types/image"

interface AppSettings {
  useCustomImage: boolean
  customImageUrl: string
  offlineImageMode: boolean
  selectedOfflineImage?: string
}

// Local background images available offline
const LOCAL_BACKGROUND_IMAGES = [
  { name: "Beach-Summer.jpg", title: "Sunny Beach", location: "Beach Paradise" },
  { name: "Beach-Summer2.jpg", title: "Tropical Beach", location: "Ocean View" },
  { name: "City-Spring.jpg", title: "Spring City", location: "Urban Landscape" },
  { name: "City-Winter.jpg", title: "Winter City", location: "Snow-covered Streets" },
  { name: "Dessert-Summer.jpg", title: "Desert Dunes", location: "Sahara Desert" },
  { name: "Dessert-Winter.jpg", title: "Winter Desert", location: "Cold Desert" },
  { name: "Forrest-Summer.jpg", title: "Summer Forest", location: "Green Woods" },
  { name: "Lake-Spring.jpg", title: "Spring Lake", location: "Mountain Lake" },
  { name: "Lake-Spring2.jpg", title: "Peaceful Lake", location: "Serene Waters" },
  { name: "Lake-Sumer.jpg", title: "Summer Lake", location: "Crystal Waters" },
  { name: "Lake-Winter.jpg", title: "Frozen Lake", location: "Winter Landscape" },
  { name: "Lake-Winter2.jpg", title: "Ice Lake", location: "Frozen Paradise" },
  { name: "Lake-Winter3.jpg", title: "Snow Lake", location: "Winter Wonderland" },
  { name: "Mountain-Fall.jpg", title: "Autumn Mountains", location: "Fall Colors" },
  { name: "Mountain-Fall2.jpg", title: "Fall Peaks", location: "Golden Mountains" },
  { name: "Mountain-Spring.jpg", title: "Spring Mountains", location: "Fresh Peaks" },
  { name: "Mountain-Summer.jpg", title: "Summer Mountains", location: "Sunny Peaks" },
  { name: "Mountain-Summer2.jpg", title: "High Mountains", location: "Alpine View" },
  { name: "Mountain-Summer3.jpg", title: "Mountain Range", location: "Scenic Vista" },
  { name: "Mountain-Winter.jpg", title: "Snow Mountains", location: "Winter Peaks" },
  { name: "Mountain-Winter2.jpg", title: "Snowy Range", location: "Alpine Winter" }
];

// Cache keys
const CACHE_KEYS = {
  LAST_IMAGE: "lastLoadedImage",
  CACHED_IMAGES: "cachedImages",
  USED_IMAGES: "usedImages",
  OFFLINE_MODE: "offlineImageMode"
};

export function useBackgroundImage() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [enableRotation, setEnableRotation] = useState(false)

  // Check if image is cached in localStorage
  const getCachedImage = (url: string): string | null => {
    try {
      const cached = localStorage.getItem(`cached_image_${btoa(url)}`)
      return cached
    } catch (error) {
      console.error("[Cache] Error getting cached image:", error)
      return null
    }
  }

  // Cache image in localStorage as base64
  const cacheImage = async (url: string): Promise<string> => {
    try {
      const cacheKey = `cached_image_${btoa(url)}`
      
      // Check if already cached
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        return cached
      }

      // Fetch and cache the image
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const blob = await response.blob()
      
      // Convert to base64 with size limit (5MB)
      if (blob.size > 5 * 1024 * 1024) {
        console.warn("[Cache] Image too large to cache:", url)
        return url
      }
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      localStorage.setItem(cacheKey, base64)
      console.log("[Cache] Image cached successfully:", url)
      return base64
    } catch (error) {
      console.error("[Cache] Error caching image:", error)
      return url // Return original URL as fallback
    }
  }

  // Get specific local background image
  const getSpecificLocalImage = (imageName: string): ImageData => {
    const selectedImage = LOCAL_BACKGROUND_IMAGES.find(img => img.name === imageName)
    if (!selectedImage) {
      // Fallback to random if specified image not found
      return getRandomLocalImage()
    }

    const basePath = getBasePath()
    return {
      url: `${basePath}/background/${selectedImage.name}`,
      title: selectedImage.title,
      location: selectedImage.location,
      copyright: "Local Image",
      isCustom: false,
      isLocal: true
    }
  }

  // Get random local background image
  const getRandomLocalImage = (usedImages: string[] = []): ImageData => {
    const availableImages = LOCAL_BACKGROUND_IMAGES.filter(
      img => !usedImages.includes(img.name)
    )
    
    const selectedImage = availableImages.length > 0 
      ? availableImages[Math.floor(Math.random() * availableImages.length)]
      : LOCAL_BACKGROUND_IMAGES[Math.floor(Math.random() * LOCAL_BACKGROUND_IMAGES.length)]

    const basePath = getBasePath()
    return {
      url: `${basePath}/background/${selectedImage.name}`,
      title: selectedImage.title,
      location: selectedImage.location,
      copyright: "Local Image",
      isCustom: false,
      isLocal: true
    }
  }

  // Fetch random image from API
  const fetchRandomImage = async (usedImages: string[]): Promise<ImageData> => {
    console.log("[v0] Fetching random image from server API, used images:", usedImages.length)

    // Only skip API calls if we're truly in a static environment (like GitHub Pages)
    // Don't skip for regular production builds that still have API support
    const shouldUseLocal = shouldUseLocalImages()
    console.log("[v0] Should use local images?", shouldUseLocal)
    
    if (shouldUseLocal) {
      console.log("[v0] Static environment detected (GitHub Pages), using client-side Unsplash API")
      // Import the client-side Unsplash function
      const { fetchUnsplashImage } = await import("@/lib/unsplash-client")
      return await fetchUnsplashImage(usedImages)
    }

    try {
      const response = await fetch(`/api/random-image?usedImages=${usedImages.join(",")}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Server API response received:", data.url ? "success" : "no url")
        
        if (data.url) {
          // Try to cache the image
          const cachedUrl = await cacheImage(data.url)
          return {
            ...data,
            url: cachedUrl,
            originalUrl: data.url // Keep original for reference
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching from server API:", error)
      setIsOffline(true)
    }

    // If offline or API failed, use local image
    console.log("[v0] API unavailable, using local fallback image")
    return getRandomLocalImage(usedImages)
  }

  const getCustomImageData = (imageUrl: string): ImageData => {
    return {
      url: imageUrl,
      title: "Custom Image",
      copyright: "User uploaded",
      location: null,
      isCustom: true,
    }
  }

  const loadNewImage = async () => {
    console.log("[v0] Loading new image...")
    setLoading(true)

    try {
      // Check app settings
      const savedSettings = localStorage.getItem("appSettings")
      let useCustomImage = false
      let customImageUrl = ""
      let offlineMode = false
      let selectedOfflineImage = ""
      
      if (savedSettings) {
        const settings: AppSettings = JSON.parse(savedSettings)
        useCustomImage = settings.useCustomImage || false
        customImageUrl = settings.customImageUrl || ""
        offlineMode = settings.offlineImageMode || false
        selectedOfflineImage = settings.selectedOfflineImage || ""
      }

      // If custom image is enabled, use it
      if (useCustomImage && customImageUrl) {
        console.log("[v0] Loading custom uploaded image")
        const customImageData = getCustomImageData(customImageUrl)
        setImageData(customImageData)
        localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(customImageData))
        setLoading(false)
        return
      }

      // Get used images for variety
      const usedImagesStr = localStorage.getItem(CACHE_KEYS.USED_IMAGES)
      const usedImages: string[] = usedImagesStr ? JSON.parse(usedImagesStr) : []

      let newImageData: ImageData

      // If offline mode is enabled or we're offline, use local images
      if (offlineMode || isOffline || !navigator.onLine) {
        console.log("[v0] Loading local image (offline mode)")
        
        // Use specific selected offline image if available
        if (selectedOfflineImage) {
          console.log("[v0] Using selected offline image:", selectedOfflineImage)
          newImageData = getSpecificLocalImage(selectedOfflineImage)
        } else {
          newImageData = getRandomLocalImage(usedImages)
        }
      } else {
        // Try to fetch from API, fallback to local
        newImageData = await fetchRandomImage(usedImages)
      }

      // Update used images list
      if (!newImageData.isCustom) {
        const imageId = newImageData.isLocal ? newImageData.url : newImageData.originalUrl || newImageData.url
        const updatedUsedImages = [...usedImages, imageId].slice(-10) // Keep last 10
        localStorage.setItem(CACHE_KEYS.USED_IMAGES, JSON.stringify(updatedUsedImages))
      }

      setImageData(newImageData)
      localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(newImageData))
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error loading new image:", error)
      
      // Ultimate fallback to first local image
      const fallbackImage = getRandomLocalImage()
      setImageData(fallbackImage)
      localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(fallbackImage))
      setLoading(false)
    }
  }

  const loadNewImageWithTransition = async () => {
    setIsTransitioning(true)
    
    try {
      // Check app settings
      const savedSettings = localStorage.getItem("appSettings")
      let useCustomImage = false
      let customImageUrl = ""
      let offlineMode = false
      let selectedOfflineImage = ""
      
      if (savedSettings) {
        const settings: AppSettings = JSON.parse(savedSettings)
        useCustomImage = settings.useCustomImage || false
        customImageUrl = settings.customImageUrl || ""
        offlineMode = settings.offlineImageMode || false
        selectedOfflineImage = settings.selectedOfflineImage || ""
      }

      // If custom image is enabled, use it
      if (useCustomImage && customImageUrl) {
        console.log("[v0] Loading custom uploaded image")
        const customImageData = getCustomImageData(customImageUrl)
        setImageData(customImageData)
        localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(customImageData))
        setTimeout(() => setIsTransitioning(false), 1000)
        return
      }

      // Get used images for variety
      const usedImagesStr = localStorage.getItem(CACHE_KEYS.USED_IMAGES)
      const usedImages: string[] = usedImagesStr ? JSON.parse(usedImagesStr) : []

      let newImageData: ImageData

      // If offline mode is enabled or we're offline, use local images
      if (offlineMode || isOffline || !navigator.onLine) {
        console.log("[v0] Loading local image (offline mode)")
        
        // Enable rotation mode when refresh is triggered in offline mode
        if (!enableRotation) {
          console.log("[v0] Enabling rotation mode for offline images")
          setEnableRotation(true)
        }
        
        // Use random image when rotation is enabled, or when no specific image is selected
        if (enableRotation || !selectedOfflineImage) {
          console.log("[v0] Using random offline image (rotation enabled or no selection)")
          newImageData = getRandomLocalImage(usedImages)
        } else {
          console.log("[v0] Using selected offline image:", selectedOfflineImage)
          newImageData = getSpecificLocalImage(selectedOfflineImage)
        }
      } else {
        // Try to fetch from API, fallback to local
        newImageData = await fetchRandomImage(usedImages)
      }

      // Update used images list
      if (!newImageData.isCustom) {
        const imageId = newImageData.isLocal ? newImageData.url : newImageData.originalUrl || newImageData.url
        const updatedUsedImages = [...usedImages, imageId].slice(-10) // Keep last 10
        localStorage.setItem(CACHE_KEYS.USED_IMAGES, JSON.stringify(updatedUsedImages))
      }

      setImageData(newImageData)
      localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(newImageData))
    } catch (error) {
      console.error("[v0] Error loading new image:", error)
      
      // Ultimate fallback to first local image
      const fallbackImage = getRandomLocalImage()
      setImageData(fallbackImage)
      localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(fallbackImage))
    }
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Load specific offline image
  const loadSpecificOfflineImage = async (imageName: string) => {
    console.log("[v0] Loading specific offline image:", imageName)
    setLoading(true)
    
    try {
      const newImageData = getSpecificLocalImage(imageName)
      
      // Update state
      setImageData(newImageData)
      
      // Cache the image
      localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(newImageData))
      
      console.log("[v0] Specific offline image loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading specific offline image:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load specific image with transition
  const loadSpecificOfflineImageWithTransition = async (imageName: string) => {
    setIsTransitioning(true)
    
    try {
      console.log("[v0] Loading specific offline image:", imageName)
      const newImageData = getSpecificLocalImage(imageName)
      
      // Update state
      setImageData(newImageData)
      
      // Cache the image
      localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(newImageData))
      
      console.log("[v0] Specific offline image loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading specific offline image:", error)
    }
    
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial status
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const loadInitialImage = async () => {
      try {
        // Reset rotation mode on app startup
        setEnableRotation(false)
        console.log("[v0] Reset rotation mode on app startup")
        
        // Check settings first
        const savedSettings = localStorage.getItem("appSettings")
        let useCustomImage = false
        let customImageUrl = ""
        
        if (savedSettings) {
          const settings: AppSettings = JSON.parse(savedSettings)
          useCustomImage = settings.useCustomImage || false
          customImageUrl = settings.customImageUrl || ""
        }

        // If custom image is enabled, use it
        if (useCustomImage && customImageUrl) {
          console.log("[v0] Loading custom uploaded image on startup")
          const customImageData = getCustomImageData(customImageUrl)
          setImageData(customImageData)
          localStorage.setItem(CACHE_KEYS.LAST_IMAGE, JSON.stringify(customImageData))
          setLoading(false)
          return
        }

        // Try to load last image
        const lastImageData = localStorage.getItem(CACHE_KEYS.LAST_IMAGE)
        if (lastImageData) {
          const parsedImageData = JSON.parse(lastImageData)
          if (!parsedImageData.isCustom) {
            console.log("[v0] Loading last used image from localStorage")
            setImageData(parsedImageData)
            setLoading(false)
            return
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load initial image from localStorage:", error)
      }
      
      // Load new image if no valid cached image
      loadNewImage()
    }

    loadInitialImage()

    // Listen for settings changes
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      const newSettings = customEvent.detail
      const currentSettings = localStorage.getItem("appSettings") ? 
        JSON.parse(localStorage.getItem("appSettings") || "{}") : {}
      
      // Reload if switching image modes
      if (currentSettings.useCustomImage !== newSettings.useCustomImage ||
          currentSettings.offlineImageMode !== newSettings.offlineImageMode) {
        loadNewImage()
      }
      
      // Load specific offline image if it changed
      if (newSettings.selectedOfflineImage && 
          currentSettings.selectedOfflineImage !== newSettings.selectedOfflineImage &&
          newSettings.offlineImageMode) {
        // Reset rotation when a specific image is selected in settings
        setEnableRotation(false)
        console.log("[v0] Reset rotation mode due to specific image selection")
        loadSpecificOfflineImageWithTransition(newSettings.selectedOfflineImage)
      }
    }

    window.addEventListener("settingsChanged", handleSettingsUpdate)

    return () => {
      window.removeEventListener("settingsChanged", handleSettingsUpdate)
    }
  }, [])

  // Reset rotation mode (useful when settings change)
  const resetRotation = () => {
    setEnableRotation(false)
    console.log("[v0] Rotation mode reset")
  }

  return { 
    imageData, 
    loading, 
    loadNewImage, 
    loadNewImageWithTransition, 
    loadSpecificOfflineImage,
    loadSpecificOfflineImageWithTransition,
    isTransitioning,
    isOffline,
    resetRotation,
    localImages: LOCAL_BACKGROUND_IMAGES
  }
}
