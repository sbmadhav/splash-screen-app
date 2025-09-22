"use client"

import { useState, useEffect } from "react"
import type { ImageData } from "@/types/image"

interface BackgroundImageProps {
  imageData: ImageData | null
}

export function BackgroundImage({ imageData }: BackgroundImageProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  console.log("[v0] BackgroundImage rendering with:", imageData)

  useEffect(() => {
    if (imageData?.url && imageData.url !== currentImageUrl) {
      // If this is the first image, set it directly
      if (!currentImageUrl) {
        const img = new Image()
        img.onload = () => {
          setCurrentImageUrl(imageData.url)
          setIsLoaded(true)
        }
        img.src = imageData.url
        return
      }
      
      // For subsequent images, preload and transition smoothly
      setIsLoaded(false)
      
      // Preload the new image
      const img = new Image()
      img.onload = () => {
        // Switch to new image after preload
        setCurrentImageUrl(imageData.url)
        setTimeout(() => setIsLoaded(true), 50) // Small delay for smooth transition
      }
      img.onerror = () => {
        // Handle error case - keep current image
        setIsLoaded(true)
      }
      img.src = imageData.url
    }
  }, [imageData?.url, currentImageUrl])

  if (!imageData?.url && !currentImageUrl) {
    console.log("[v0] No image data available, showing fallback")
    return (
      <>
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 bg-black/20" />
      </>
    )
  }

  return (
    <>
      {/* Main background image */}
      {currentImageUrl && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-80'
          }`}
          style={{
            backgroundImage: `url('${currentImageUrl}')`,
          }}
        />
      )}
      
      {/* Fallback background - only show when no image is loaded */}
      {!currentImageUrl && (
        <div className="absolute inset-0 bg-gray-900" />
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </>
  )
}
