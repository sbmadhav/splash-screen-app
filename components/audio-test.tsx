"use client"

import { useRef, useEffect } from "react"

export function AudioTest() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const testAudio = async () => {
    const testUrls = [
      '/music/lofi-chill.mp3',
      '/music/just-relax.mp3',
      '/music/cinematic-chillhop.mp3'
    ]

    for (const url of testUrls) {
      console.log(`Testing audio URL: ${url}`)
      try {
        const response = await fetch(url, { method: 'HEAD' })
        console.log(`${url} - Status: ${response.status} - ${response.ok ? '✅' : '❌'}`)
      } catch (error) {
        console.error(`${url} - Error:`, error)
      }
    }
  }

  const playTestAudio = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.src = '/music/lofi-chill.mp3'
        await audioRef.current.play()
        console.log('Test audio playing!')
      } catch (error) {
        console.error('Test audio failed:', error)
      }
    }
  }

  useEffect(() => {
    testAudio()
  }, [])

  return (
    <div className="fixed top-4 left-4 z-50 bg-red-500/80 text-white p-4 rounded">
      <h3 className="font-bold mb-2">Audio Test</h3>
      <button 
        onClick={playTestAudio}
        className="bg-blue-600 px-3 py-1 rounded text-sm"
      >
        Test Play Audio
      </button>
      <audio ref={audioRef} controls className="mt-2 w-full" />
      <div className="text-xs mt-2">Check console for test results</div>
    </div>
  )
}
