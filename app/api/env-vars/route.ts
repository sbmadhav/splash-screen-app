import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all environment variables that are safe to display
    const envVars = [
      {
        key: "UNSPLASH_ACCESS_KEY",
        value: process.env.UNSPLASH_ACCESS_KEY ? "••••••••••••" + process.env.UNSPLASH_ACCESS_KEY.slice(-4) : "Not set",
        isPublic: false,
      },
      // Add other environment variables as needed
      ...(process.env.NEXT_PUBLIC_VERCEL_URL
        ? [
            {
              key: "NEXT_PUBLIC_VERCEL_URL",
              value: process.env.NEXT_PUBLIC_VERCEL_URL,
              isPublic: true,
            },
          ]
        : []),
    ]

    // Filter out variables that are not set
    const configuredVars = envVars.filter((env) => env.value !== "Not set")

    return NextResponse.json({
      success: true,
      envVars: configuredVars,
    })
  } catch (error) {
    console.error("Error fetching environment variables:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch environment variables" }, { status: 500 })
  }
}
