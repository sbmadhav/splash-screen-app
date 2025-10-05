"use client"

import { useEffect, useRef } from 'react'
import { getBasePath } from '@/lib/static-utils'
import { debugLog } from '@/lib/debug-utils'

// Global flag to prevent multiple initializations across component re-mounts
let globalHasInitialized = false

export function DynamicHead() {
  const componentInitialized = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations both globally and per component instance
    if (globalHasInitialized || componentInitialized.current) {
      return
    }

    // Check if DOM methods are available (for SSR compatibility)
    if (typeof document === 'undefined' || !document.createElement || !document.querySelector || !document.head) {
      return
    }

    const basePath = getBasePath()
    
    try {
      // Only update manifest link
      const existingManifest = document.querySelector('link[rel="manifest"]')
      if (existingManifest && existingManifest.parentNode) {
        existingManifest.parentNode.removeChild(existingManifest)
      }

      const manifestPath = `${basePath}/manifest.json`
      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = manifestPath
      document.head.appendChild(link)

      debugLog('[DynamicHead] Manifest link set to:', manifestPath)

      // Only update favicon/icon links if basePath is not empty (i.e., we're on GitHub Pages)
      if (basePath) {
        const faviconSizes = [
          { rel: 'shortcut icon', type: 'image/x-icon', href: `${basePath}/favicon.ico` },
          { rel: 'icon', type: 'image/x-icon', href: `${basePath}/favicon.ico` },
          { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${basePath}/icon-16x16.png` },
          { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${basePath}/icon-32x32.png` },
          { rel: 'apple-touch-icon', sizes: '128x128', href: `${basePath}/icon-128x128.png` },
          { rel: 'apple-touch-icon', sizes: '256x256', href: `${basePath}/icon-256x256.png` },
        ]

        // Remove existing favicon/icon links safely (only dynamic ones)
        const existingIcons = document.querySelectorAll('link[rel*="icon"][href*="/splash-screen-app/"]')
        existingIcons.forEach(icon => {
          try {
            if (icon && icon.parentNode) {
              icon.parentNode.removeChild(icon)
            }
          } catch (error) {
            debugLog('[DynamicHead] Error removing icon:', error)
          }
        })

        // Add new favicon/icon links with correct paths
        faviconSizes.forEach(iconConfig => {
          try {
            const iconLink = document.createElement('link')
            iconLink.rel = iconConfig.rel
            if (iconConfig.type) iconLink.type = iconConfig.type
            if (iconConfig.sizes) iconLink.sizes = iconConfig.sizes
            iconLink.href = iconConfig.href
            document.head.appendChild(iconLink)
          } catch (error) {
            debugLog('[DynamicHead] Error adding icon:', error)
          }
        })

        debugLog('[DynamicHead] Icon links updated for base path:', basePath)
      }

      globalHasInitialized = true
      componentInitialized.current = true
    } catch (error) {
      debugLog('[DynamicHead] Error during initialization:', error)
    }
  }, [])

  return null
}
