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
  title: "Splash Screen App",
  description: "For Focus, Relaxation, or Meetings, with Beautiful Backgrounds",
  generator: "v0.app",
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
