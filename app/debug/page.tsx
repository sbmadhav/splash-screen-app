"use client"

import { useEffect, useState } from "react"
import { shouldUseLocalImages, isStaticEnvironment } from "@/lib/static-utils"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  const loadDebugInfo = () => {
    const info = {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      pathname: window.location.pathname,
      isStaticEnvironment: isStaticEnvironment(),
      shouldUseLocalImages: shouldUseLocalImages(),
      appSettings: localStorage.getItem("appSettings"),
      parsedAppSettings: localStorage.getItem("appSettings") ? JSON.parse(localStorage.getItem("appSettings") || "{}") : null,
      lastImage: localStorage.getItem("lastImage"),
      GITHUB_PAGES: process.env.GITHUB_PAGES,
      NODE_ENV: process.env.NODE_ENV
    }
    setDebugInfo(info)
    console.log("Debug info:", info)
  }

  useEffect(() => {
    loadDebugInfo()
  }, [])

  const clearLocalStorage = () => {
    localStorage.clear()
    loadDebugInfo()
  }

  const testApiCall = async () => {
    try {
      console.log("Testing API call...")
      const response = await fetch('/api/random-image')
      console.log("API response:", response.status, response.ok)
      const data = await response.json()
      console.log("API data:", data)
    } catch (error) {
      console.error("API error:", error)
    }
  }

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-6">Debug Information</h1>
      
      <div className="mb-6 space-x-4">
        <Button onClick={loadDebugInfo} className="bg-blue-600 hover:bg-blue-700">
          Refresh Debug Info
        </Button>
        <Button onClick={clearLocalStorage} className="bg-red-600 hover:bg-red-700">
          Clear LocalStorage
        </Button>
        <Button onClick={testApiCall} className="bg-green-600 hover:bg-green-700">
          Test API Call
        </Button>
      </div>
      
      <pre className="text-sm whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
