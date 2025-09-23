// Utility to detect if we're running in a static environment (like GitHub Pages)
export const isStaticEnvironment = () => {
  // Check if we're in a browser environment with no API support
  if (typeof window !== 'undefined') {
    // For GitHub Pages, check if the hostname contains github.io
    return window.location.hostname.includes('github.io') || 
           // Or if running from file:// protocol
           window.location.protocol === 'file:'
  }
  // Server-side: check for build-time static generation
  return process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'
}

export const shouldUseLocalImages = () => {
  return isStaticEnvironment()
}

// Get the correct base path for assets in GitHub Pages
export const getBasePath = () => {
  if (typeof window !== 'undefined') {
    // In browser: check if we're on GitHub Pages or using splash-screen-app path
    return window.location.hostname.includes('github.io') || 
           window.location.pathname.startsWith('/splash-screen-app/')
      ? '/splash-screen-app'
      : ''
  }
  // Server-side: check build environment
  return (process.env.GITHUB_PAGES === 'true' && process.env.NODE_ENV === 'production')
    ? '/splash-screen-app'
    : ''
}
