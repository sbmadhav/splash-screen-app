"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LocalImage {
  name: string
  title: string
  location: string
}

interface OfflineImageSelectorProps {
  onImageSelect: (imageName: string) => void
  selectedImage?: string
  theme?: 'light' | 'dark'
}

const LOCAL_IMAGES: LocalImage[] = [
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
]

export function OfflineImageSelector({ onImageSelect, selectedImage, theme = 'dark' }: OfflineImageSelectorProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleImageError = (imageName: string) => {
    console.warn('Failed to load image:', imageName)
    setImageErrors(prev => new Set([...prev, imageName]))
  }

  const handleImageLoad = (imageName: string) => {
    console.log('Image loaded successfully:', imageName)
    setImageErrors(prev => {
      const newSet = new Set(prev)
      newSet.delete(imageName)
      return newSet
    })
  }

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

  const getCategoryFromName = (name: string): string => {
    if (name.toLowerCase().includes('beach')) return 'Beach'
    if (name.toLowerCase().includes('city')) return 'City'
    if (name.toLowerCase().includes('dessert')) return 'Desert'
    if (name.toLowerCase().includes('forrest') || name.toLowerCase().includes('forest')) return 'Forest'
    if (name.toLowerCase().includes('lake')) return 'Lake'
    if (name.toLowerCase().includes('mountain')) return 'Mountain'
    return 'Nature'
  }

  const getSeasonFromName = (name: string): string => {
    if (name.toLowerCase().includes('spring')) return 'Spring'
    if (name.toLowerCase().includes('summer')) return 'Summer'
    if (name.toLowerCase().includes('fall')) return 'Fall'
    if (name.toLowerCase().includes('winter')) return 'Winter'
    return 'All Season'
  }

  const groupedImages = LOCAL_IMAGES.reduce((acc, image) => {
    const category = getCategoryFromName(image.name)
    if (!acc[category]) acc[category] = []
    acc[category].push(image)
    return acc
  }, {} as Record<string, LocalImage[]>)

  return (
    <Card className={theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Offline Images
              {isOffline && <Badge variant="destructive">Offline</Badge>}
            </CardTitle>
            <CardDescription className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Beautiful background images available offline
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedImages).map(([category, images]) => (
          <div key={category}>
            <h3 className={`text-lg font-semibold mb-3 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {category}
            </h3>
            {/* Flexible grid container */}
            <div className="grid grid-cols-3 gap-3">
              {images.map((image) => (
                <div
                  key={image.name}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-video ${
                    selectedImage === image.name
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : theme === 'light'
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => onImageSelect(image.name)}
                >
                  {/* Image preview */}
                  <div className={`w-full h-full relative ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'
                  }`}>
                    {imageErrors.has(image.name) ? (
                      <div className={`w-full h-full flex items-center justify-center text-xs ${
                        theme === 'light' ? 'text-gray-500 bg-gray-200' : 'text-gray-400 bg-gray-700'
                      }`}>
                        {image.title}
                      </div>
                    ) : (
                      <img
                        src={`/background/${image.name}`}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={{
                          minWidth: '100%',
                          minHeight: '100%',
                          backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151'
                        }}
                        onError={(e) => {
                          console.warn('Failed to load image:', image.name)
                          handleImageError(image.name)
                        }}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', image.name)
                          handleImageLoad(image.name)
                        }}
                      />
                    )}
                    
                    {/* Selected indicator */}
                    {selectedImage === image.name && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 z-20">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Season badge */}
                    <div className="absolute top-1 left-1 z-20">
                      <Badge variant="secondary" className="text-xs">
                        {getSeasonFromName(image.name)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Image info tooltip on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                    <h4 className="font-medium text-xs truncate">
                      {image.title}
                    </h4>
                    <p className="text-xs opacity-75 truncate">
                      {image.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className={`text-sm p-3 rounded-lg ${
          theme === 'light' 
            ? 'text-gray-500 bg-gray-50' 
            : 'text-gray-400 bg-gray-800'
        }`}>
          <p className="font-medium mb-1">💡 Tip:</p>
          <p>These images are stored locally on your device and work without an internet connection. Perfect for when you're offline or want consistent loading times.</p>
        </div>
      </CardContent>
    </Card>
  )
}
