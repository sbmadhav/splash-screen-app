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

    // Remove any existing manifest link
    const existingManifest = document.querySelector('link[rel="manifest"]')
    if (existingManifest) {
      existingManifest.remove()
    }

    // Add the correct manifest link based on the current environment
    const basePath = getBasePath()
    const manifestPath = `${basePath}/manifest.json`
    
    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = manifestPath
    document.head.appendChild(link)

    debugLog('[DynamicHead] Manifest link set to:', manifestPath)
  }, [])

  return null
}
