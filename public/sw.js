// Version should be updated whenever JS/CSS changes to force cache refresh
const APP_VERSION = '1.3.0'; // Bumped for lossless/near-lossless quality images
const CACHE_NAME = `splash-app-v${APP_VERSION}`;
const STATIC_CACHE = `splash-app-static-v${APP_VERSION}`;
const DYNAMIC_CACHE = `splash-app-dynamic-v${APP_VERSION}`;
const IMAGE_CACHE = `splash-app-images-v${APP_VERSION}`;

// Optimized WebP thumbnails to cache immediately (tiny, used for blur-up)
const OPTIMIZED_THUMBNAILS = [
  './background/optimized/thumbnail/Beach-Summer.webp',
  './background/optimized/thumbnail/Beach-Summer2.webp',
  './background/optimized/thumbnail/City-Spring.webp',
  './background/optimized/thumbnail/City-Winter.webp',
  './background/optimized/thumbnail/Dessert-Summer.webp',
  './background/optimized/thumbnail/Dessert-Winter.webp',
  './background/optimized/thumbnail/Forrest-Summer.webp',
  './background/optimized/thumbnail/Lake-Spring.webp',
  './background/optimized/thumbnail/Lake-Spring2.webp',
  './background/optimized/thumbnail/Lake-Sumer.webp',
  './background/optimized/thumbnail/Lake-Winter.webp',
  './background/optimized/thumbnail/Lake-Winter2.webp',
  './background/optimized/thumbnail/Lake-Winter3.webp',
  './background/optimized/thumbnail/Mountain-Fall.webp',
  './background/optimized/thumbnail/Mountain-Fall2.webp',
  './background/optimized/thumbnail/Mountain-Spring.webp',
  './background/optimized/thumbnail/Mountain-Summer.webp',
  './background/optimized/thumbnail/Mountain-Summer2.webp',
  './background/optimized/thumbnail/Mountain-Summer3.webp',
  './background/optimized/thumbnail/Mountain-Winter.webp',
  './background/optimized/thumbnail/Mountain-Winter2.webp',
  './background/optimized/thumbnail/Mountain-Winter3.webp',
  './background/optimized/thumbnail/Mountain-Winter4.webp',
  './background/optimized/thumbnail/Mountain-Winter5.webp',
  './background/optimized/thumbnail/Mountain-Winter6.webp',
  './background/optimized/thumbnail/River-Fall.webp',
  './background/optimized/thumbnail/Sea-Summer.webp',
  './background/optimized/thumbnail/Sea-Summer2.webp',
  './background/optimized/thumbnail/Sky-Winter.webp',
];

// Legacy thumbnails (for settings page)
const LEGACY_THUMBNAILS = [
  './background/thumbnails/Beach-Summer.webp',
  './background/thumbnails/Beach-Summer2.webp',
  './background/thumbnails/City-Spring.webp',
  './background/thumbnails/City-Winter.webp',
  './background/thumbnails/Dessert-Summer.webp',
  './background/thumbnails/Dessert-Winter.webp',
  './background/thumbnails/Forrest-Summer.webp',
  './background/thumbnails/Lake-Spring.webp',
  './background/thumbnails/Lake-Spring2.webp',
  './background/thumbnails/Lake-Sumer.webp',
  './background/thumbnails/Lake-Winter.webp',
  './background/thumbnails/Lake-Winter2.webp',
  './background/thumbnails/Lake-Winter3.webp',
  './background/thumbnails/Mountain-Fall.webp',
  './background/thumbnails/Mountain-Fall2.webp',
  './background/thumbnails/Mountain-Spring.webp',
  './background/thumbnails/Mountain-Summer.webp',
  './background/thumbnails/Mountain-Summer2.webp',
  './background/thumbnails/Mountain-Summer3.webp',
  './background/thumbnails/Mountain-Winter.webp',
  './background/thumbnails/Mountain-Winter2.webp',
  './background/thumbnails/Mountain-Winter3.webp',
  './background/thumbnails/Mountain-Winter4.webp',
  './background/thumbnails/Mountain-Winter5.webp',
  './background/thumbnails/Mountain-Winter6.webp',
  './background/thumbnails/River-Fall.webp',
  './background/thumbnails/Sea-Summer.webp',
  './background/thumbnails/Sea-Summer2.webp',
  './background/thumbnails/Sky-Winter.webp',
  './background/thumbnails/manifest.json'
];

// Assets to cache immediately (core assets + optimized thumbnails)
const STATIC_ASSETS = [
  './',
  './settings/',
  './manifest.json',
  // Icons
  './icon-16x16.png',
  './icon-24x24.png',
  './icon-32x32.png',
  './icon-64x64.png',
  './icon-128x128.png',
  './icon-256x256.png',
  './icon-512x512.png',
  './favicon.ico',
  // Include optimized thumbnails in static cache (tiny, essential for blur-up)
  ...OPTIMIZED_THUMBNAILS,
  // Include legacy thumbnails for settings page
  ...LEGACY_THUMBNAILS
];

// Music files to cache on-demand (lazy loading)
const MUSIC_FILES = [
  './music/cinematic-chillhop.mp3',
  './music/dreams.mp3',
  './music/forest-lullaby.mp3',
  './music/in-the-forest-ambience.mp3',
  './music/just-relax.mp3',
  './music/lofi-chill.mp3',
  './music/onceagain.mp3',
  './music/open-sky.mp3',
  './music/rainbow-after-rain.mp3'
];

// Background images to cache on-demand (lazy loading)
const BACKGROUND_IMAGES = [
  './background/Beach-Summer.jpg',
  './background/Beach-Summer2.jpg',
  './background/City-Spring.jpg',
  './background/City-Winter.jpg',
  './background/Dessert-Summer.jpg',
  './background/Dessert-Winter.jpg',
  './background/Forrest-Summer.jpg',
  './background/Lake-Spring.jpg',
  './background/Lake-Spring2.jpg',
  './background/Lake-Sumer.jpg',
  './background/Lake-Winter.jpg',
  './background/Lake-Winter2.jpg',
  './background/Lake-Winter3.jpg',
  './background/Mountain-Fall.jpg',
  './background/Mountain-Fall2.jpg',
  './background/Mountain-Spring.jpg',
  './background/Mountain-Summer.jpg',
  './background/Mountain-Summer2.jpg',
  './background/Mountain-Summer3.jpg',
  './background/Mountain-Winter.jpg',
  './background/Mountain-Winter2.jpg',
  './background/Mountain-Winter3.jpg',
  './background/Mountain-Winter4.jpg',
  './background/Mountain-Winter5.jpg',
  './background/Mountain-Winter6.jpg',
  './background/River-Fall.jpg',
  './background/Sea-Summer.jpg',
  './background/Sea-Summer2.jpg',
  './background/Sky-Winter.jpg'
];

// Install event - cache core static assets + thumbnails immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    // Cache core static assets + thumbnails on install - full background images cached on-demand
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching core static assets and WebP thumbnails...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] Core assets and thumbnails cached successfully. Full background images will be cached on-demand.');
      self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Failed to cache static assets:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first, then cache
    event.respondWith(networkFirstStrategy(request));
  } else if (url.pathname.includes('/optimized/') || url.pathname.includes('/thumbnails/')) {
    // Optimized images and thumbnails - cache first (prioritized for performance)
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (url.pathname.startsWith('/background/') || 
             url.pathname.includes('unsplash.com') || 
             url.pathname.includes('picsum.photos')) {
    // Images - cache first, then network
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (url.pathname.startsWith('/music/')) {
    // Music files - cache first
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Static assets - cache first, then network
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Cache first strategy - improved for offline with music and background image prioritization
async function cacheFirstStrategy(request) {
  try {
    const cacheNames = [CACHE_NAME, STATIC_CACHE];
    let cachedResponse = null;
    
    // Check all caches for the request
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', cacheName, request.url);
        return cachedResponse;
      }
    }
    
    // If not in cache and online, fetch from network
    if (navigator.onLine) {
      console.log('[SW] Fetching from network:', request.url);
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache network response for future use
        const cache = await caches.open(CACHE_NAME);
        
        // Log caching of different asset types
        if (request.url.includes('/music/')) {
          console.log('[SW] Caching music file for future use:', request.url);
        } else if (request.url.includes('/thumbnails/')) {
          console.log('[SW] Caching WebP thumbnail for future use:', request.url);
        } else if (request.url.includes('/background/') || 
                   request.url.includes('unsplash.com') || 
                   request.url.includes('picsum.photos')) {
          console.log('[SW] Caching full background image for future use:', request.url);
        }
        
        cache.put(request, networkResponse.clone());
        console.log('[SW] Cached network response:', request.url);
      }
      
      return networkResponse;
    } else {
      // Offline and not in cache
      console.log('[SW] OFFLINE: Request not in cache:', request.url);
      
      // For music files, check if any other music is cached as fallback
      if (request.url.includes('/music/')) {
        const fallbackCache = await caches.open(CACHE_NAME);
        // Try to find any cached music file as fallback
        for (const musicFile of MUSIC_FILES) {
          const fallback = await fallbackCache.match(musicFile);
          if (fallback) {
            console.log('[SW] Serving fallback music file:', musicFile);
            return fallback;
          }
        }
        // If no music is cached, return an error response
        return new Response('Music not available offline', { 
          status: 404, 
          statusText: 'Music file not cached for offline use' 
        });
      }
      
      // For external images, try to serve a fallback local image
      if (request.url.includes('unsplash') || request.url.includes('picsum')) {
        const fallbackCache = await caches.open(CACHE_NAME);
        // Try to find any cached local background image as fallback
        for (const bgImage of BACKGROUND_IMAGES) {
          const fallback = await fallbackCache.match(bgImage);
          if (fallback) {
            console.log('[SW] Serving fallback background image:', bgImage);
            return fallback;
          }
        }
      }
      
      throw new Error(`Resource not available offline: ${request.url}`);
    }
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    throw error;
  }
}

// Network first strategy
async function networkFirstStrategy(request) {
  try {
    console.log('[SW] Network first for:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Message handling for cache status updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then((status) => {
      event.ports[0].postMessage(status);
    });
  }
});

// Get cache status for progress reporting
async function getCacheStatus() {
  // Only check for core static assets that are actually cached upfront
  const totalAssets = STATIC_ASSETS.length;
  let cachedAssets = 0;
  
  const staticCache = await caches.open(STATIC_CACHE);
  
  // Only check static assets since background images and music are cached on-demand
  for (const asset of STATIC_ASSETS) {
    const cached = await staticCache.match(asset);
    if (cached) {
      cachedAssets++;
    }
  }
  
  return {
    total: totalAssets,
    cached: cachedAssets,
    progress: (cachedAssets / totalAssets) * 100
  };
}

// Message handler for cache operations
self.addEventListener('message', (event) => {
  const { action } = event.data;
  
  switch (action) {
    case 'CLEAR_ALL_CACHE':
      clearAllCache().then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch((error) => {
        console.error('[SW] Error clearing cache:', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        event.ports[0].postMessage({ success: true, status });
      }).catch((error) => {
        console.error('[SW] Error getting cache status:', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    default:
      console.log('[SW] Unknown action:', action);
  }
});

// Clear all app caches
async function clearAllCache() {
  console.log('[SW] Clearing all caches...');
  const cacheNames = await caches.keys();
  
  await Promise.all(
    cacheNames.map(cacheName => {
      console.log('[SW] Deleting cache:', cacheName);
      return caches.delete(cacheName);
    })
  );
  
  console.log('[SW] All caches cleared');
}

// Get detailed cache status
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const cacheInfo = [];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    cacheInfo.push({
      name: cacheName,
      size: keys.length
    });
  }
  
  return {
    caches: cacheInfo,
    totalCaches: cacheNames.length
  };
}
