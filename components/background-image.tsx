"use client"

import { useState, useEffect } from "react"
import type { ImageData } from "@/types/image"
import { debugLog } from "@/lib/debug-utils"
import { getBasePath } from "@/lib/static-utils"

interface BackgroundImageProps {
  imageData: ImageData | null
}

// Helper to get optimized image path for local images
function getOptimizedImagePath(url: string, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' = 'large'): string {
  // Only optimize local background images
  if (!url.includes('/background/')) {
    return url
  }

  // Extract filename from URL
  const fileName = url.split('/').pop()
  if (!fileName) return url

  // Replace .jpg with .webp and add size path
  const webpFileName = fileName.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  const basePath = getBasePath()
  
  return `${basePath}/background/optimized/${size}/${webpFileName}`
}

// Helper to check if browser supports WebP
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const elem = document.createElement('canvas')
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  return false
}

// Get responsive image size based on viewport
function getResponsiveSize(): 'small' | 'medium' | 'large' | 'xlarge' {
  if (typeof window === 'undefined') return 'large'
  
  const width = window.innerWidth
  const pixelRatio = window.devicePixelRatio || 1
  const effectiveWidth = width * pixelRatio

  if (effectiveWidth >= 2560) return 'xlarge'
  if (effectiveWidth >= 1920) return 'large'
  if (effectiveWidth >= 1280) return 'medium'
  return 'small'
}

export function BackgroundImage({ imageData }: BackgroundImageProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(false)
  const [webpSupported] = useState(() => supportsWebP())

  debugLog("[v0] BackgroundImage rendering with:", imageData)

  useEffect(() => {
    if (imageData?.url && imageData.url !== currentImageUrl) {
      const isLocalImage = imageData.url.includes('/background/') && imageData.isLocal
      
      // If this is the first image or a new local image, use progressive loading
      if (isLocalImage && webpSupported) {
        // Step 1: Load thumbnail immediately for blur effect
        const thumbnail = getOptimizedImagePath(imageData.url, 'thumbnail')
        const thumbImg = new Image()
        
        thumbImg.onload = () => {
          setThumbnailUrl(thumbnail)
          setShowThumbnail(true)
          debugLog("[v0] Thumbnail loaded:", thumbnail)
        }
        thumbImg.src = thumbnail

        // Step 2: Load full-size image in background
        const size = getResponsiveSize()
        const optimizedUrl = getOptimizedImagePath(imageData.url, size)
        
        const fullImg = new Image()
        fullImg.onload = () => {
          setCurrentImageUrl(optimizedUrl)
          setIsLoaded(true)
          // Keep thumbnail visible briefly for smooth transition
          setTimeout(() => setShowThumbnail(false), 300)
          debugLog("[v0] Full image loaded:", optimizedUrl)
        }
        fullImg.onerror = () => {
          // Fallback to original image
          debugLog("[v0] Optimized image failed, using original")
          setCurrentImageUrl(imageData.url)
          setIsLoaded(true)
          setShowThumbnail(false)
        }
        fullImg.src = optimizedUrl
      } else {
        // For external images (Unsplash), load directly
        setIsLoaded(false)
        const img = new Image()
        
        img.onload = () => {
          setCurrentImageUrl(imageData.url)
          setTimeout(() => setIsLoaded(true), 50)
          debugLog("[v0] External image loaded:", imageData.url)
        }
        img.onerror = () => {
          setIsLoaded(true)
          debugLog("[v0] Image load error")
        }
        img.src = imageData.url
      }
    }
  }, [imageData?.url, currentImageUrl, webpSupported])

  if (!imageData?.url && !currentImageUrl && !thumbnailUrl) {
    debugLog("[v0] No image data available, showing fallback")
    return (
      <>
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 bg-black/20" />
      </>
    )
  }

  return (
    <>
      {/* Thumbnail layer (blurred) - only shown during loading */}
      {showThumbnail && thumbnailUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
          style={{
            backgroundImage: `url('${thumbnailUrl}')`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)', // Prevent blur edge artifacts
          }}
        />
      )}
      
      {/* Main background image */}
      {currentImageUrl && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${currentImageUrl}')`,
          }}
        />
      )}
      
      {/* Fallback background - only show when no image is loaded */}
      {!currentImageUrl && !thumbnailUrl && (
        <div className="absolute inset-0 bg-gray-900" />
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </>
  )
}
