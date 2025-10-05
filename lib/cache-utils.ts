// Cache busting utility
export const CACHE_VERSION = '1.1.0';

// Add cache busting parameter to static assets
export const getCacheBustedUrl = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${CACHE_VERSION}`;
};

// Force reload of critical JavaScript bundles
export const reloadCriticalAssets = async (): Promise<void> => {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  try {
    // Clear module cache by reloading the page
    // This ensures fresh JavaScript bundles are loaded
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
      }
    }
    
    // Force a hard reload
    window.location.reload();
  } catch (error) {
    console.error('Error reloading critical assets:', error);
  }
};

// Check if app needs cache clear based on version
export const checkCacheVersion = (): boolean => {
  const storedVersion = localStorage.getItem('app-cache-version');
  const currentVersion = CACHE_VERSION;
  
  if (storedVersion !== currentVersion) {
    localStorage.setItem('app-cache-version', currentVersion);
    return true; // Cache needs clearing
  }
  
  return false; // Cache is up to date
};
