"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, RefreshCw, Database } from "lucide-react"
import { debugLog } from "@/lib/debug-utils"

interface CacheManagerProps {
  theme?: 'light' | 'dark'
}

interface CacheInfo {
  name: string
  size: number
}

interface CacheStatus {
  caches: CacheInfo[]
  totalCaches: number
}

export function CacheManager({ theme = 'dark' }: CacheManagerProps) {
  const [isClearing, setIsClearing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
  const [lastCleared, setLastCleared] = useState<Date | null>(null)

  // Get cache status
  const getCacheStatus = async () => {
    if (!('serviceWorker' in navigator)) {
      debugLog('[CacheManager] Service Worker not supported')
      return
    }

    try {
      setIsRefreshing(true)
      const registration = await navigator.serviceWorker.ready
      
      if (registration.active) {
        const messageChannel = new MessageChannel()
        
        const response = await new Promise<any>((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              resolve(event.data.status)
            } else {
              reject(new Error(event.data.error))
            }
          }
          
          registration.active!.postMessage(
            { action: 'GET_CACHE_STATUS' },
            [messageChannel.port2]
          )
          
          // Timeout after 5 seconds
          setTimeout(() => reject(new Error('Timeout')), 5000)
        })
        
        setCacheStatus(response)
        debugLog('[CacheManager] Cache status updated:', response)
      }
    } catch (error) {
      console.error('[CacheManager] Error getting cache status:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Clear all caches
  const clearAllCache = async () => {
    if (!('serviceWorker' in navigator)) {
      alert('Service Worker not supported in this browser')
      return
    }

    try {
      setIsClearing(true)
      const registration = await navigator.serviceWorker.ready
      
      if (registration.active) {
        const messageChannel = new MessageChannel()
        
        const response = await new Promise<any>((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              resolve(event.data)
            } else {
              reject(new Error(event.data.error))
            }
          }
          
          registration.active!.postMessage(
            { action: 'CLEAR_ALL_CACHE' },
            [messageChannel.port2]
          )
          
          // Timeout after 10 seconds
          setTimeout(() => reject(new Error('Timeout')), 10000)
        })
        
        setLastCleared(new Date())
        setCacheStatus({ caches: [], totalCaches: 0 })
        debugLog('[CacheManager] All caches cleared')
        
        // Show success message
        alert('App cache cleared successfully! The page will reload to apply changes.')
        
        // Reload the page to ensure fresh content
        window.location.reload()
      }
    } catch (error) {
      console.error('[CacheManager] Error clearing cache:', error)
      alert('Failed to clear cache. Please try again.')
    } finally {
      setIsClearing(false)
    }
  }

  // Load cache status on mount
  useEffect(() => {
    getCacheStatus()
  }, [])

  const getTotalCacheSize = () => {
    if (!cacheStatus) return 0
    return cacheStatus.caches.reduce((total, cache) => total + cache.size, 0)
  }

  return (
    <Card className={theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Database className="h-5 w-5" />
              Cache Management
            </CardTitle>
            <CardDescription className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Manage app cache and storage
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={getCacheStatus}
            disabled={isRefreshing}
            className={`${
              theme === 'light' 
                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
                : 'border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cache Status */}
        <div className="space-y-3">
          <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Cache Status
          </h4>
          
          {cacheStatus ? (
            <div className="space-y-2">
              <div className={`flex justify-between text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                <span>Total Caches:</span>
                <Badge variant="secondary">{cacheStatus.totalCaches}</Badge>
              </div>
              <div className={`flex justify-between text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                <span>Total Cached Items:</span>
                <Badge variant="secondary">{getTotalCacheSize()}</Badge>
              </div>
              
              {cacheStatus.caches.length > 0 && (
                <div className="mt-3">
                  <h5 className={`text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Cache Details:
                  </h5>
                  <div className="space-y-1">
                    {cacheStatus.caches.map((cache, index) => (
                      <div
                        key={index}
                        className={`flex justify-between text-xs p-2 rounded ${
                          theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'
                        }`}
                      >
                        <span className="font-mono truncate">{cache.name}</span>
                        <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                          {cache.size} items
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Loading cache status...
            </div>
          )}
        </div>

        {/* Last Cleared */}
        {lastCleared && (
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Last cleared: {lastCleared.toLocaleString()}
          </div>
        )}

        {/* Clear Cache Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="destructive"
            onClick={clearAllCache}
            disabled={isClearing}
            className="w-full"
          >
            <Trash2 className={`h-4 w-4 mr-2 ${isClearing ? 'animate-pulse' : ''}`} />
            {isClearing ? 'Clearing Cache...' : 'Clear All App Cache'}
          </Button>
          <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            This will clear all cached files and force fresh downloads. The page will reload automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
