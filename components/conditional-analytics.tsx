"use client"

import { Analytics } from "@vercel/analytics/next"

export function ConditionalAnalytics() {
  // Check if we're in a GitHub Pages environment
  // This can be detected by checking if we're on github.io domain or if GITHUB_PAGES env was set during build
  const isGitHubPages = typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.pathname.startsWith('/splash-screen-app'))

  // Only render Vercel Analytics if NOT on GitHub Pages
  if (isGitHubPages) {
    return null
  }

  return <Analytics />
}
