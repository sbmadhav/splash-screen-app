"use client"

import { useEffect, useState } from 'react'
import { getBasePath } from '@/lib/static-utils'

export default function FaviconDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const basePath = getBasePath()
    const faviconLinks = Array.from(document.querySelectorAll('link[rel*="icon"]'))
    
    setDebugInfo({
      basePath,
      currentHost: window.location.hostname,
      currentPath: window.location.pathname,
      currentProtocol: window.location.protocol,
      githubPagesEnv: process.env.GITHUB_PAGES,
      nodeEnv: process.env.NODE_ENV,
      faviconLinks: faviconLinks.map(link => ({
        rel: link.getAttribute('rel'),
        href: link.getAttribute('href'),
        sizes: link.getAttribute('sizes'),
        type: link.getAttribute('type'),
      }))
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Favicon Debug Information</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Expected Favicon Paths</h2>
        <div className="space-y-1 text-sm">
          <p>Base Path: <code>{debugInfo.basePath || 'empty'}</code></p>
          <p>Favicon: <code>{debugInfo.basePath || ''}/favicon.ico</code></p>
          <p>16x16: <code>{debugInfo.basePath || ''}/icon-16x16.png</code></p>
          <p>32x32: <code>{debugInfo.basePath || ''}/icon-32x32.png</code></p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Test Favicon Links</h2>
        <div className="space-y-2">
          <div>
            <a href={`${debugInfo.basePath || ''}/favicon.ico`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Test /favicon.ico
            </a>
          </div>
          <div>
            <a href={`${debugInfo.basePath || ''}/icon-16x16.png`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Test /icon-16x16.png
            </a>
          </div>
          <div>
            <a href={`${debugInfo.basePath || ''}/icon-32x32.png`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Test /icon-32x32.png
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
