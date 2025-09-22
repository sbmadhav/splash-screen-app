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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usedImages = searchParams.get("usedImages")?.split(",") || []

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
