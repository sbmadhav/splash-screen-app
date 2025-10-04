/**
 * Debug logging utility
 * - Uses console.debug by default
 * - Can be enabled via URL parameter debug=true
 * - Disabled by default in production builds
 */

let debugEnabled: boolean | null = null

function isDebugEnabled(): boolean {
  if (debugEnabled !== null) {
    return debugEnabled
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    debugEnabled = process.env.NODE_ENV === 'development'
    return debugEnabled
  }

  // Check URL parameters for debug flag
  const urlParams = new URLSearchParams(window.location.search)
  const debugParam = urlParams.get('debug')
  
  if (debugParam === 'true' || debugParam === '1') {
    debugEnabled = true
    return debugEnabled
  }
  
  if (debugParam === 'false' || debugParam === '0') {
    debugEnabled = false
    return debugEnabled
  }

  // Default to development mode only
  debugEnabled = process.env.NODE_ENV === 'development'
  return debugEnabled
}

export function debugLog(message: string, ...args: any[]): void {
  if (isDebugEnabled()) {
    console.debug(message, ...args)
  }
}

// Export function to manually enable/disable debug logging
export function setDebugEnabled(enabled: boolean): void {
  debugEnabled = enabled
}

// Export function to check current debug state
export function getDebugEnabled(): boolean {
  return isDebugEnabled()
}
