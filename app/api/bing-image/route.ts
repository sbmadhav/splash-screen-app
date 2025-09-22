import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US")
    const data = await response.json()

    if (data.images && data.images.length > 0) {
      const image = data.images[0]
      const imageUrl = `https://www.bing.com${image.url}`

      // Extract location from copyright text
      const copyright = image.copyright || ""
      const location = extractLocationFromCopyright(copyright)

      return NextResponse.json({
        url: imageUrl,
        title: image.title || "Bing Daily Image",
        copyright: copyright,
        location: location,
      })
    }

    return NextResponse.json({ error: "No image found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching Bing image:", error)
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}

function extractLocationFromCopyright(copyright: string): string {
  // Try to extract location from common patterns in Bing copyright text
  const patterns = [
    /,\s*([^,]+,\s*[^,]+)$/, // Last two comma-separated parts
    /,\s*([^,]+)$/, // Last comma-separated part
    /$$([^)]+)$$/, // Text in parentheses
  ]

  for (const pattern of patterns) {
    const match = copyright.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }

  return "Unknown Location"
}
