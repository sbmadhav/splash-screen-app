import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Raleway } from "next/font/google"
import { Suspense } from "react"
import { PWAProvider } from "@/components/pwa-provider"
import { DynamicHead } from "@/components/dynamic-head"
import { GoogleAnalytics } from "@/components/google-analytics"
import { ConditionalAnalytics } from "@/components/conditional-analytics"
import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

export const metadata: Metadata = {
  title: "Splash Screen App - Focus, Relaxation, Beautiful Backgrounds",
  description: "A beautiful, customizable splash screen app for focus sessions, relaxation, or meetings. Features stunning seasonal backgrounds, ambient music, and Pomodoro timer.",
  generator: "v0.app",
  keywords: ["splash screen", "focus timer", "pomodoro", "relaxation", "ambient music", "beautiful backgrounds", "productivity"],
  authors: [{ name: "Splash Screen App Team" }],
  // manifest: "/manifest.json", // Removed - will be handled dynamically
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Splash Screen App",
  },
  // Basic favicon fallback - DynamicHead component will enhance with proper paths
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sbmadhav.github.io/splash-screen-app/',
    title: "Splash Screen App - Focus, Relaxation, Beautiful Backgrounds",
    description: "A beautiful, customizable splash screen app for focus sessions, relaxation, or meetings. Features stunning seasonal backgrounds, ambient music, and Pomodoro timer.",
    siteName: "Splash Screen App",
    images: [
      {
        url: '/og-image.jpg',
        width: 1920,
        height: 1080,
        alt: 'Splash Screen App - Beautiful Mountain Landscape',
      },
    ],
  },
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: "Splash Screen App - Focus, Relaxation, Beautiful Backgrounds",
    description: "A beautiful, customizable splash screen app for focus sessions, relaxation, or meetings. Features stunning seasonal backgrounds, ambient music, and Pomodoro timer.",
    images: ['/og-image.jpg'],
    creator: '@splashscreenapp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${raleway.variable}`}>
        <GoogleAnalytics />
        <DynamicHead />
        <PWAProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </PWAProvider>
        <ConditionalAnalytics />
      </body>
    </html>
  )
}
