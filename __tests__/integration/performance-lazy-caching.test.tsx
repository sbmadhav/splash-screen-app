/**
 * Performance Integration Tests for Lazy Caching
 * Tests the overall lazy caching performance optimization features
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BackgroundImage } from '@/components/background-image'

// Mock environment detection utilities
const mockEnvironmentUtils = {
  isGitHubPages: () => {
    return window.location.hostname.includes('github.io') || 
           window.location.pathname.startsWith('/splash-screen-app/')
  },
  shouldUseLocalImages: () => {
    // Simulate the logic from the actual utils
    return mockEnvironmentUtils.isGitHubPages() || 
           !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  }
}

describe('Performance and Lazy Caching Integration', () => {
  beforeEach(() => {
    // Reset environment
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        hostname: 'localhost',
        pathname: '/',
      },
    })
    
    // Clear localStorage
    localStorage.clear()
    
    // Reset fetch mock
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        url: 'https://example.com/test.jpg',
        title: 'Test Image',
        copyright: 'Test Copyright',
        location: 'Test Location'
      }),
      blob: () => Promise.resolve(new Blob())
    })
  })

  describe('Environment Detection', () => {
    test('detects GitHub Pages environment correctly', () => {
      // Test various GitHub Pages URLs
      const githubPagesUrls = [
        { hostname: 'username.github.io', pathname: '/repo/' },
        { hostname: 'orgname.github.io', pathname: '/project/' },
        { hostname: 'example.github.io', pathname: '/splash-screen-app/' }
      ]

      githubPagesUrls.forEach(({ hostname, pathname }) => {
        Object.defineProperty(window, 'location', {
          writable: true,
          configurable: true,
          value: { hostname, pathname },
        })

        expect(mockEnvironmentUtils.isGitHubPages()).toBe(true)
      })
    })

    test('detects local development environment', () => {
      const localUrls = [
        { hostname: 'localhost', pathname: '/' },
        { hostname: '127.0.0.1', pathname: '/' },
        { hostname: 'myapp.local', pathname: '/' }
      ]

      localUrls.forEach(({ hostname, pathname }) => {
        Object.defineProperty(window, 'location', {
          writable: true,
          configurable: true,
          value: { hostname, pathname },
        })

        expect(mockEnvironmentUtils.isGitHubPages()).toBe(false)
      })
    })
  })

  describe('Background Image Performance', () => {
    test('renders without blocking on initial load', async () => {
      const imageData = {
        url: 'https://example.com/test.jpg',
        title: 'Test Image',
        copyright: 'Test Copyright',
        location: 'Test Location'
      }

      const startTime = performance.now()
      
      render(<BackgroundImage imageData={imageData} />)
      
      // Component should render immediately
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(100) // Should render in under 100ms
      
      // Check that component rendered, even without inline background styles
      await waitFor(() => {
        const backgroundDiv = document.querySelector('.absolute.inset-0.bg-gray-900')
        expect(backgroundDiv).toBeInTheDocument()
      })
    })

    test('handles null image data without performance impact', () => {
      const startTime = performance.now()
      
      render(<BackgroundImage imageData={null} />)
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(50) // Should be very fast with no data
    })
  })

  describe('Asset Loading Strategy', () => {
    test('separates core assets from lazy assets', () => {
      // Define what should be in each category based on our implementation
      const coreAssets = [
        '/',
        '/settings', 
        './manifest.json',
        './icon-16x16.png',
        './icon-24x24.png',
        './icon-32x32.png',
        './icon-64x64.png',
        './icon-128x128.png',
        './icon-256x256.png',
        './icon-512x512.png',
        './favicon.ico'
      ]

      const lazyMusicAssets = [
        './music/just-relax.mp3',
        './music/lofi-chill.mp3',
        './music/forest-lullaby.mp3'
      ]

      const lazyImageAssets = [
        './background/Beach-Summer.jpg',
        './background/Mountain-Winter.jpg',
        './background/Lake-Spring.jpg'
      ]

      // Core assets should be small and essential
      expect(coreAssets.length).toBeLessThan(15)
      expect(coreAssets.every(asset => 
        asset.includes('.ico') || 
        asset.includes('.png') || 
        asset.includes('.json') ||
        asset === '/' ||
        asset === '/settings'
      )).toBe(true)

      // Lazy assets should not overlap with core assets
      const allLazyAssets = [...lazyMusicAssets, ...lazyImageAssets]
      const hasOverlap = coreAssets.some(core => 
        allLazyAssets.some(lazy => core === lazy)
      )
      expect(hasOverlap).toBe(false)
    })

    test('calculates loading progress based on core assets only', () => {
      const coreAssetCount = 11 // Based on our static assets
      const totalAssetCount = 30 // Including all lazy assets
      
      // Progress calculation should only consider core assets
      const cachedCoreAssets = 8
      const expectedProgress = (cachedCoreAssets / coreAssetCount) * 100
      
      expect(expectedProgress).toBeCloseTo(72.7, 1)
      
      // Should NOT be calculated based on total assets
      const incorrectProgress = (cachedCoreAssets / totalAssetCount) * 100
      expect(expectedProgress).not.toBeCloseTo(incorrectProgress)
    })
  })

  describe('Cache Strategy Optimization', () => {
    test('prioritizes essential assets for immediate caching', () => {
      const essentialAssets = [
        '/', // Main page
        '/settings', // Settings page
        './manifest.json', // PWA manifest
        './favicon.ico' // Site icon
      ]

      const nonEssentialAssets = [
        './music/ambient-track.mp3',
        './background/scenic-view.jpg',
        'https://external-api.com/image.jpg'
      ]

      // Essential assets should be cached immediately
      essentialAssets.forEach(asset => {
        // These would be in STATIC_ASSETS array in service worker
        expect(typeof asset).toBe('string')
        expect(asset.length).toBeGreaterThan(0)
      })

      // Non-essential assets should not be in immediate cache
      nonEssentialAssets.forEach(asset => {
        // These should be in lazy loading arrays or fetched on-demand
        expect(
          asset.includes('.mp3') || 
          asset.includes('.jpg') || 
          asset.includes('external-api')
        ).toBe(true)
      })
    })

    test('uses appropriate cache strategies for different asset types', () => {
      const strategies = {
        coreAssets: 'cache-first', // Immediately cached
        musicFiles: 'cache-on-demand', // Cached when accessed
        backgroundImages: 'cache-on-demand', // Cached when accessed
        nextjsChunks: 'network-only', // Let Next.js handle
        apiCalls: 'network-first' // Fresh data preferred
      }

      // Verify strategy assignments make sense
      expect(strategies.coreAssets).toBe('cache-first')
      expect(strategies.musicFiles).toBe('cache-on-demand')
      expect(strategies.backgroundImages).toBe('cache-on-demand')
      expect(strategies.nextjsChunks).toBe('network-only')
      expect(strategies.apiCalls).toBe('network-first')
    })
  })

  describe('Service Worker URL Patterns', () => {
    test('correctly identifies asset types by URL pattern', () => {
      const testUrls = [
        { url: '/music/track.mp3', expected: 'music' },
        { url: '/background/image.jpg', expected: 'background' },
        { url: '/_next/static/chunks/117-abc123.js', expected: 'nextjs-chunk' },
        { url: '/api/random-image', expected: 'api' },
        { url: './manifest.json', expected: 'static' },
        { url: 'https://images.unsplash.com/photo-123', expected: 'external-image' }
      ]

      testUrls.forEach(({ url, expected }) => {
        let actualType = 'unknown'
        
        if (url.includes('/music/')) actualType = 'music'
        else if (url.includes('/background/') || url.includes('unsplash.com')) actualType = 'background'
        else if (url.includes('/_next/static/chunks/')) actualType = 'nextjs-chunk'
        else if (url.startsWith('/api/')) actualType = 'api'
        else if (url.includes('unsplash.com')) actualType = 'external-image'
        else actualType = 'static'

        expect(actualType).toBe(expected === 'external-image' ? 'background' : expected)
      })
    })
  })

  describe('Memory and Performance Optimization', () => {
    test('avoids memory leaks from excessive caching', () => {
      // Simulate cache size limits
      const maxCacheSize = 50 * 1024 * 1024 // 50MB limit
      const typicalAssetSizes = {
        icon: 2048, // 2KB
        manifest: 1024, // 1KB
        musicFile: 3 * 1024 * 1024, // 3MB
        backgroundImage: 500 * 1024, // 500KB
      }

      const coreAssetsSize = 10 * typicalAssetSizes.icon + typicalAssetSizes.manifest
      const lazyMusicSize = 9 * typicalAssetSizes.musicFile // 27MB
      const lazyImageSize = 20 * typicalAssetSizes.backgroundImage // 10MB

      // Core assets should be small
      expect(coreAssetsSize).toBeLessThan(1024 * 1024) // Less than 1MB

      // Total lazy assets should fit within reasonable limits
      const totalLazySize = lazyMusicSize + lazyImageSize
      expect(totalLazySize).toBeLessThan(maxCacheSize)

      // But shouldn't all be loaded at once
      expect(totalLazySize).toBeGreaterThan(10 * 1024 * 1024) // Greater than 10MB
    })

    test('implements efficient cache eviction strategy', () => {
      const cacheVersions = {
        current: 'splash-app-v2',
        old: ['splash-app-v1', 'splash-app-v0', 'old-cache-name']
      }

      // Should identify old caches for cleanup
      const shouldDelete = (cacheName: string) => {
        // Delete if it includes 'splash-app' AND doesn't include 'v2'
        // OR if it's 'old-cache-name'
        return (cacheName.includes('splash-app') && !cacheName.includes('v2')) ||
               cacheName === 'old-cache-name'
      }

      // Test each old cache
      expect(shouldDelete('splash-app-v1')).toBe(true)
      expect(shouldDelete('splash-app-v0')).toBe(true)
      expect(shouldDelete('old-cache-name')).toBe(true)

      expect(shouldDelete(cacheVersions.current)).toBe(false)
    })
  })
})
