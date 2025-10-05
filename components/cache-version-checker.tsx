"use client"

import { useEffect } from 'react';
import { checkCacheVersion } from '@/lib/cache-utils';
import { debugLog } from '@/lib/debug-utils';

export function CacheVersionChecker() {
  useEffect(() => {
    // Check cache version on app load
    const needsCacheClearing = checkCacheVersion();
    
    if (needsCacheClearing) {
      debugLog('[CacheVersionChecker] App version updated, cache may be stale');
      
      // Optionally show a notification that the app has been updated
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.active) {
            debugLog('[CacheVersionChecker] Service worker ready, cache will be refreshed');
          }
        });
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
