"use client"

import { useEffect } from 'react'
import { getBasePath } from '@/lib/static-utils'
import { debugLog } from '@/lib/debug-utils'

export function DynamicHead() {
  useEffect(() => {
    // Check if DOM methods are available (for SSR compatibility)
    if (typeof document === 'undefined' || !document.createElement || !document.querySelector) {
      return
    }

    const basePath = getBasePath()
    
    // Remove any existing manifest link
    const existingManifest = document.querySelector('link[rel="manifest"]')
    if (existingManifest) {
      existingManifest.remove()
    }

    // Add the correct manifest link based on the current environment
    const manifestPath = `${basePath}/manifest.json`
    
    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = manifestPath
    document.head.appendChild(link)

    debugLog('[DynamicHead] Manifest link set to:', manifestPath)

    // Update favicon and icon links for GitHub Pages
    const faviconSizes = [
      { rel: 'shortcut icon', type: 'image/x-icon', href: `${basePath}/favicon.ico` },
      { rel: 'icon', type: 'image/x-icon', href: `${basePath}/favicon.ico` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${basePath}/icon-16x16.png` },
      { rel: 'icon', type: 'image/png', sizes: '24x24', href: `${basePath}/icon-24x24.png` },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${basePath}/icon-32x32.png` },
      { rel: 'icon', type: 'image/png', sizes: '64x64', href: `${basePath}/icon-64x64.png` },
      { rel: 'icon', type: 'image/png', sizes: '128x128', href: `${basePath}/icon-128x128.png` },
      { rel: 'icon', type: 'image/png', sizes: '256x256', href: `${basePath}/icon-256x256.png` },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: `${basePath}/icon-512x512.png` },
      { rel: 'apple-touch-icon', sizes: '128x128', href: `${basePath}/icon-128x128.png` },
      { rel: 'apple-touch-icon', sizes: '256x256', href: `${basePath}/icon-256x256.png` },
      { rel: 'apple-touch-icon', sizes: '512x512', href: `${basePath}/icon-512x512.png` },
    ]

    // Remove existing favicon/icon links (be more specific to avoid removing other links)
    const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]')
    existingIcons.forEach(icon => {
      debugLog('[DynamicHead] Removing existing icon:', icon.getAttribute('href'))
      icon.remove()
    })

    // Add new favicon/icon links with correct paths
    faviconSizes.forEach(iconConfig => {
      const iconLink = document.createElement('link')
      iconLink.rel = iconConfig.rel
      if (iconConfig.type) iconLink.type = iconConfig.type
      if (iconConfig.sizes) iconLink.sizes = iconConfig.sizes
      iconLink.href = iconConfig.href
      document.head.appendChild(iconLink)
      debugLog('[DynamicHead] Added icon:', iconConfig.href)
    })

    debugLog('[DynamicHead] Icon links updated for base path:', basePath)
  }, [])

  return null
}
