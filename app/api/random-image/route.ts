import { type NextRequest, NextResponse } from "next/server"

const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return "spring"
  if (month >= 6 && month <= 8) return "summer"
  if (month >= 9 && month <= 11) return "autumn"
  return "winter"
}

const getTimeOfDay = (): string => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "morning"
  if (hour >= 12 && hour < 17) return "afternoon"
  if (hour >= 17 && hour < 21) return "evening"
  return "night"
}

const getSeasonalKeywords = (season: string): string[] => {
  const keywords = {
    spring: ["spring", "cherry blossom", "flowers", "green", "fresh", "bloom"],
    summer: ["summer", "sunny", "bright", "beach", "clear sky", "vibrant"],
    autumn: ["autumn", "fall", "golden", "orange", "leaves", "harvest"],
    winter: ["winter", "snow", "frost", "cold", "ice", "cozy"],
  }
  return keywords[season as keyof typeof keywords] || []
}

const getTimeKeywords = (timeOfDay: string): string[] => {
  const keywords = {
    morning: ["sunrise", "dawn", "morning light", "golden hour", "early"],
    afternoon: ["daylight", "bright", "clear", "sunny", "midday"],
    evening: ["sunset", "dusk", "golden hour", "warm light", "evening"],
    night: ["night", "stars", "moonlight", "dark", "twilight"],
  }
  return keywords[timeOfDay as keyof typeof keywords] || []
}

// Local images array - matches the ones in offline-image-selector
const LOCAL_IMAGES = [
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
  { name: "Mountain-Winter2.jpg", title: "Snowy Range", location: "Alpine Winter" },
  { name: "Mountain-Winter3.jpg", title: "Icy Peaks", location: "Frozen Heights" },
  { name: "Mountain-Winter4.jpg", title: "White Mountains", location: "Snow Valley" },
  { name: "Mountain-Winter5.jpg", title: "Arctic Peaks", location: "Polar Vista" },
  { name: "Mountain-Winter6.jpg", title: "Glacier Mountains", location: "Ice Kingdom" },
  { name: "River-Fall.jpg", title: "Autumn River", location: "Fall Stream" },
  { name: "Sea-Summer.jpg", title: "Summer Sea", location: "Ocean Blue" },
  { name: "Sea-Summer2.jpg", title: "Tropical Sea", location: "Paradise Waters" },
  { name: "Sky-Winter.jpg", title: "Winter Sky", location: "Cloudy Horizon" }
]

export async function GET(request: NextRequest) {
  try {
    // Handle searchParams safely for static generation
    let usedImages: string[] = []
    let offlineImageMode = false
    
    try {
      const { searchParams } = new URL(request.url)
      usedImages = searchParams.get("usedImages")?.split(",").filter(Boolean) || []
      offlineImageMode = searchParams.get("offlineImageMode") === "true"
    } catch (error) {
      // Fallback for static generation
      usedImages = []
    }

    // If offline image mode is enabled, return a random local image
    if (offlineImageMode) {
      console.log("[v0] Offline image mode enabled, selecting local image")
      console.log("[v0] Used images:", usedImages)
      
      // Filter out used images
      const availableImages = LOCAL_IMAGES.filter(img => {
        const imgUrl = `/background/${img.name}`
        return !usedImages.includes(imgUrl)
      })
      
      console.log("[v0] Available local images:", availableImages.length)
      
      // If all images have been used, reset and use all images
      const imagesToChooseFrom = availableImages.length > 0 ? availableImages : LOCAL_IMAGES
      
      // Select random image
      const selectedImage = imagesToChooseFrom[Math.floor(Math.random() * imagesToChooseFrom.length)]
      
      return NextResponse.json({
        url: `/background/${selectedImage.name}`,
        title: selectedImage.title,
        copyright: selectedImage.title,
        location: selectedImage.location,
        isLocal: true,
      })
    }

    const season = getCurrentSeason()
    const timeOfDay = getTimeOfDay()
    const seasonalKeywords = getSeasonalKeywords(season)
    const timeKeywords = getTimeKeywords(timeOfDay)

    const baseTopics = ["nature", "landscape", "mountain", "ocean", "forest", "desert", "beach"]
    const contextualKeywords = [...seasonalKeywords, ...timeKeywords]

    // Combine base topic with contextual keywords
    const randomBaseTopic = baseTopics[Math.floor(Math.random() * baseTopics.length)]
    const randomContextual = contextualKeywords[Math.floor(Math.random() * contextualKeywords.length)]
    const searchQuery = `${randomBaseTopic} ${randomContextual} ${season}`

    console.log("[v0] Server-side contextual search - Season:", season, "Time:", timeOfDay, "Query:", searchQuery)

    // Try Unsplash API if key is available
    if (process.env.UNSPLASH_ACCESS_KEY) {
      console.log("[v0] Unsplash API key found, making request...")
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&w=1920&h=1080`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        },
      )

      console.log("[v0] Unsplash API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Unsplash response received:", data.urls?.full ? "success" : "no url")

        if (data.urls?.full && !usedImages.includes(data.urls.full)) {
          let location = "Unknown"

          // Try to extract location from various sources
          if (data.location?.name) {
            location = data.location.name
          } else if (data.user?.location) {
            location = data.user.location
          } else if (data.tags && data.tags.length > 0) {
            // Use relevant tags as location hints
            const locationTags = data.tags.filter(
              (tag: any) =>
                tag.title &&
                (tag.title.includes("mountain") ||
                  tag.title.includes("beach") ||
                  tag.title.includes("forest") ||
                  tag.title.includes("desert") ||
                  tag.title.includes("lake") ||
                  tag.title.includes("valley") ||
                  tag.title.includes("national park") ||
                  tag.title.includes("city") ||
                  tag.title.includes("country")),
            )
            if (locationTags.length > 0) {
              location = locationTags[0].title
            }
          } else if (data.description) {
            // Try to extract location from description
            const locationMatch = data.description.match(/in ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i)
            if (locationMatch) {
              location = locationMatch[1]
            }
          }

          const finalLocation = location === "Unknown" ? null : location

          return NextResponse.json({
            url: data.urls.full,
            title: data.alt_description || `Beautiful ${season} ${timeOfDay} landscape`,
            copyright: data.description || data.alt_description || `Stunning ${season} scenery`,
            location: finalLocation,
          })
        }
      } else {
        console.log("[v0] Unsplash API error:", response.statusText)
      }
    } else {
      console.log("[v0] No Unsplash API key found, using fallback")
    }

    // Fallback to Lorem Picsum
    const seed = Math.floor(Math.random() * 10000)
    const fallbackUrl = `https://picsum.photos/seed/${seed}/1920/1080`
    console.log("[v0] Using fallback image:", fallbackUrl)

    return NextResponse.json({
      url: fallbackUrl,
      title: `${season} ${timeOfDay} landscape`,
      copyright: `Beautiful ${season} natural scenery`,
      location: null,
    })
  } catch (error) {
    console.error("[v0] Error in random-image API:", error)

    // Emergency fallback
    const seed = Math.floor(Math.random() * 10000)
    return NextResponse.json({
      url: `https://picsum.photos/seed/${seed}/1920/1080`,
      title: "Beautiful landscape",
      copyright: "Scenic view",
      location: null,
    })
  }
}
