// Utility to detect if we're running in a static environment (like GitHub Pages)
export const isStaticEnvironment = () => {
  // Check if we're in a browser environment with no API support
  if (typeof window !== 'undefined') {
    // For GitHub Pages, check if the hostname contains github.io
    return window.location.hostname.includes('github.io') || 
           // Or if running from file:// protocol
           window.location.protocol === 'file:'
  }
  // Server-side: check for build-time static generation specifically for GitHub Pages
  return process.env.GITHUB_PAGES === 'true'
}

export const shouldUseLocalImages = () => {
  const staticEnv = isStaticEnvironment()
  console.log('[static-utils] shouldUseLocalImages check:', {
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'server-side',
    GITHUB_PAGES: process.env.GITHUB_PAGES,
    staticEnv
  })
  return staticEnv
}

// Get the correct base path for assets in GitHub Pages
export const getBasePath = () => {
  if (typeof window !== 'undefined') {
    // In browser: check if we're on GitHub Pages
    if (window.location.hostname === 'sbmadhav.github.io') {
      return '/splash-screen-app'
    }
    // Or if we're already in the splash-screen-app path (for local testing)
    if (window.location.pathname.startsWith('/splash-screen-app/')) {
      return '/splash-screen-app'
    }
    // Local development
    return ''
  }
  // Server-side: check build environment
  return (process.env.GITHUB_PAGES === 'true' && process.env.NODE_ENV === 'production')
    ? '/splash-screen-app'
    : ''
}
