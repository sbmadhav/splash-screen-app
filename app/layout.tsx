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
import StructuredData from "./structured-data"
import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sbmadhav.github.io/splash-screen-app/'),
  title: {
    default: "Splash Screen App - Focus, Relaxation, Beautiful Backgrounds",
    template: "%s | Splash Screen App"
  },
  description: "A beautiful, customizable splash screen app for focus sessions, relaxation, or meetings. Features stunning seasonal backgrounds, ambient music, and Pomodoro timer. Free, open-source PWA with offline support.",
  applicationName: "Splash Screen App",
  generator: "Next.js",
  keywords: [
    "splash screen",
    "focus timer",
    "pomodoro timer",
    "pomodoro technique",
    "relaxation app",
    "ambient music",
    "beautiful backgrounds",
    "productivity app",
    "meditation timer",
    "concentration tool",
    "work timer",
    "study timer",
    "meeting timer",
    "background images",
    "PWA",
    "progressive web app",
    "offline app",
    "free productivity tool",
    "open source",
    "customizable timer"
  ],
  authors: [
    { name: "Splash Screen App Team" },
    { name: "sbmadhav", url: "https://github.com/sbmadhav" }
  ],
  creator: "Splash Screen App Team",
  publisher: "Splash Screen App",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // manifest: "/manifest.json", // Removed - will be handled dynamically
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Splash Screen App",
    startupImage: [
      {
        url: '/icon-512x512.png',
        media: '(device-width: 375px) and (device-height: 812px)',
      },
    ],
  },
  // Basic favicon fallback - DynamicHead component will enhance with proper paths
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icon-256x256.png', sizes: '256x256', type: 'image/png' },
    ],
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
        url: '/splash-screen-app/og-image.jpg',
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
    images: ['/splash-screen-app/og-image.jpg'],
    creator: '@splashscreenapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'productivity',
  classification: 'Productivity, Focus, Relaxation',
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
        <StructuredData />
        <PWAProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </PWAProvider>
        <ConditionalAnalytics />
      </body>
    </html>
  )
}
