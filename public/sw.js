const CACHE_NAME = 'splash-app-v1';
const STATIC_CACHE = 'splash-app-static-v1';
const DYNAMIC_CACHE = 'splash-app-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/settings',
  '/manifest.json',
  // Icons
  '/icon-16x16.png',
  '/icon-24x24.png',
  '/icon-32x32.png',
  '/icon-64x64.png',
  '/icon-128x128.png',
  '/icon-256x256.png',
  '/icon-512x512.png',
  '/favicon.ico',
  // Music files
  '/music/cinematic-chillhop.mp3',
  '/music/dreams.mp3',
  '/music/forest-lullaby.mp3',
  '/music/in-the-forest-ambience.mp3',
  '/music/just-relax.mp3',
  '/music/lofi-chill.mp3',
  '/music/onceagain.mp3',
  '/music/open-sky.mp3',
  '/music/rainbow-after-rain.mp3'
];

// Background images to cache
const BACKGROUND_IMAGES = [
  '/background/Beach-Summer.jpg',
  '/background/Beach-Summer2.jpg',
  '/background/City-Spring.jpg',
  '/background/City-Winter.jpg',
  '/background/Dessert-Summer.jpg',
  '/background/Dessert-Winter.jpg',
  '/background/Forrest-Summer.jpg',
  '/background/Lake-Spring.jpg',
  '/background/Lake-Spring2.jpg',
  '/background/Lake-Sumer.jpg',
  '/background/Lake-Winter.jpg',
  '/background/Lake-Winter2.jpg',
  '/background/Lake-Winter3.jpg',
  '/background/Mountain-Fall.jpg',
  '/background/Mountain-Fall2.jpg',
  '/background/Mountain-Spring.jpg',
  '/background/Mountain-Summer.jpg',
  '/background/Mountain-Summer2.jpg',
  '/background/Mountain-Summer3.jpg',
  '/background/Mountain-Winter.jpg',
  '/background/Mountain-Winter2.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache background images
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching background images...');
        return cache.addAll(BACKGROUND_IMAGES);
      })
    ]).then(() => {
      console.log('[SW] Assets cached successfully');
      self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Failed to cache assets:', error);
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
  } else if (url.pathname.startsWith('/background/') || 
             url.pathname.includes('unsplash.com') || 
             url.pathname.includes('picsum.photos')) {
    // Images - cache first, then network
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.pathname.startsWith('/music/')) {
    // Music files - cache first
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Static assets - cache first, then network
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Cache first strategy - improved for offline
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
        cache.put(request, networkResponse.clone());
        console.log('[SW] Cached network response:', request.url);
      }
      
      return networkResponse;
    } else {
      // Offline and not in cache
      console.log('[SW] OFFLINE: Request not in cache:', request.url);
      
      // For music files, try to serve a fallback or throw an error
      if (request.url.includes('/music/')) {
        throw new Error(`Music file not available offline: ${request.url}`);
      }
      
      // For images, try to serve a fallback
      if (request.url.includes('unsplash') || request.url.includes('picsum')) {
        const fallbackImages = await caches.match('/background/Mountain-Summer.jpg');
        if (fallbackImages) {
          return fallbackImages;
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
  const totalAssets = STATIC_ASSETS.length + BACKGROUND_IMAGES.length;
  let cachedAssets = 0;
  
  const cache = await caches.open(CACHE_NAME);
  const staticCache = await caches.open(STATIC_CACHE);
  
  const allRequests = [...STATIC_ASSETS, ...BACKGROUND_IMAGES];
  
  for (const asset of allRequests) {
    const cached = await cache.match(asset) || await staticCache.match(asset);
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
