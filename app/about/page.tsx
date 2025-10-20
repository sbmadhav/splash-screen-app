"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Github, Heart, Music, Image as ImageIcon, Code, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          const theme = settings.theme || 'system'
          
          if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setResolvedTheme(systemPrefersDark ? 'dark' : 'light')
          } else {
            setResolvedTheme(theme)
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error)
      }
    }

    loadTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', loadTheme)
    return () => mediaQuery.removeEventListener('change', loadTheme)
  }, [])

  const musicAttributions = [
    {
      title: "Dreams",
      attribution: "Music from Bensound.com/royalty-free-music License code: YWU05QVAFZK7DMBN",
      url: "https://www.bensound.com"
    },
    {
      title: "Cinematic Chillhop",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "Forest Lullaby",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "In the Forest Ambience",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "Just Relax",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "Lofi Chill",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "Once Again",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "Open Sky",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    },
    {
      title: "Rainbow After Rain",
      source: "Royalty Free Music",
      license: "Free for non-commercial use"
    }
  ]

  return (
    <div className={`min-h-screen p-6 ${
      resolvedTheme === 'light' 
        ? 'bg-gray-50' 
        : 'bg-gray-950'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className={`cursor-pointer ${resolvedTheme === 'light' 
                ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                : 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>About Splash Screen App</h1>
            <p className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Licenses, attributions, and project information
            </p>
          </div>
        </div>

        {/* Overview */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Heart className="h-5 w-5 text-red-500" />
              About This Project
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              A beautiful, open-source splash screen application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
              Splash Screen App is a customizable web application designed to enhance your focus sessions, 
              relaxation time, or meetings with beautiful seasonal backgrounds and ambient music. Perfect 
              for Pomodoro timers, meditation, or simply creating an inspiring atmosphere.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${
                resolvedTheme === 'light' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gray-800 border-gray-700'
              }`}>
                <ImageIcon className={`h-8 w-8 mb-2 ${
                  resolvedTheme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`} />
                <h3 className={`font-semibold mb-1 ${
                  resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  29 Local Images
                </h3>
                <p className={`text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Stunning seasonal backgrounds optimized for offline use
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                resolvedTheme === 'light' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gray-800 border-gray-700'
              }`}>
                <Music className={`h-8 w-8 mb-2 ${
                  resolvedTheme === 'light' ? 'text-purple-600' : 'text-purple-400'
                }`} />
                <h3 className={`font-semibold mb-1 ${
                  resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  9 Music Tracks
                </h3>
                <p className={`text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Ambient music to enhance your focus and relaxation
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                resolvedTheme === 'light' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gray-800 border-gray-700'
              }`}>
                <Code className={`h-8 w-8 mb-2 ${
                  resolvedTheme === 'light' ? 'text-green-600' : 'text-green-400'
                }`} />
                <h3 className={`font-semibold mb-1 ${
                  resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Open Source
                </h3>
                <p className={`text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Built with Next.js, TypeScript, and Tailwind CSS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Shield className="h-5 w-5 text-blue-500" />
              License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              resolvedTheme === 'light' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-blue-950/30 border-blue-900'
            }`}>
              <Badge className="mb-2">MIT License</Badge>
              <p className={`text-sm ${
                resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                This application is open source and available under the MIT License. 
                You are free to use, modify, and distribute this software for personal 
                and commercial purposes.
              </p>
            </div>
            
            <p className={`text-sm ${
              resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Please note that while the application code is MIT licensed, individual 
              assets (images and music) may have their own licenses as detailed below.
            </p>
          </CardContent>
        </Card>

        {/* Music Attributions */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Music className="h-5 w-5 text-purple-500" />
              Music Attributions
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              Credits for ambient music tracks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {musicAttributions.map((music, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    resolvedTheme === 'light' 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className={`font-semibold ${
                        resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {music.title}
                      </h4>
                      {music.attribution && (
                        <p className={`text-sm ${
                          resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {music.attribution}
                        </p>
                      )}
                      {music.source && (
                        <p className={`text-sm ${
                          resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          Source: {music.source}
                        </p>
                      )}
                      {music.license && (
                        <Badge variant="outline" className="text-xs">
                          {music.license}
                        </Badge>
                      )}
                    </div>
                    {music.url && (
                      <a
                        href={music.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={resolvedTheme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Background Images */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <ImageIcon className="h-5 w-5 text-blue-500" />
              Background Images
            </CardTitle>
            <CardDescription className={resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              29 beautiful seasonal backgrounds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={resolvedTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
              The application includes 29 stunning background images across various categories:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Beach', 'City', 'Desert', 'Forest', 'Lake', 'Mountain', 'River', 'Sea', 'Sky'].map((category) => (
                <div
                  key={category}
                  className={`p-3 rounded-lg border text-center ${
                    resolvedTheme === 'light' 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {category}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className={`p-4 rounded-lg border ${
              resolvedTheme === 'light' 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-yellow-950/30 border-yellow-900'
            }`}>
              <p className={`text-sm ${
                resolvedTheme === 'light' ? 'text-yellow-800' : 'text-yellow-200'
              }`}>
                <strong>Note:</strong> Attribution details for individual images are being researched and updated. 
                If you are the creator of any image used in this project, please contact us to ensure proper attribution.
              </p>
            </div>

            <p className={`text-sm ${
              resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Images are optimized using WebP format with near-lossless compression for the best 
              quality and performance. Multiple sizes are generated for responsive loading.
            </p>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Code className="h-5 w-5 text-green-500" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-semibold mb-2 ${
                  resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Framework & Libraries
                </h4>
                <ul className={`space-y-1 text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <li>• Next.js 15 - React Framework</li>
                  <li>• TypeScript - Type Safety</li>
                  <li>• Tailwind CSS - Styling</li>
                  <li>• Radix UI - Component Library</li>
                  <li>• Sharp - Image Optimization</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 ${
                  resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Features
                </h4>
                <ul className={`space-y-1 text-sm ${
                  resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <li>• Progressive Web App (PWA)</li>
                  <li>• Offline Support</li>
                  <li>• Audio Visualizer</li>
                  <li>• Custom Themes</li>
                  <li>• Pomodoro Timer</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card className={resolvedTheme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-900 border-gray-700'
        }>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              resolvedTheme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              <Github className="h-5 w-5" />
              Project Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/attributions">
              <Button
                variant="outline"
                className={`w-full justify-start cursor-pointer ${
                  resolvedTheme === 'light'
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                View Detailed Attributions
              </Button>
            </Link>
            
            <a
              href="https://github.com/sbmadhav/splash-screen-app"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className={`w-full justify-start cursor-pointer ${
                  resolvedTheme === 'light'
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
              >
                <Github className="h-4 w-4 mr-2" />
                View Source Code on GitHub
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className={`text-center py-8 ${
          resolvedTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <p className="text-sm">
            Made with <Heart className="inline h-4 w-4 text-red-500" /> by the Splash Screen App Team
          </p>
          <p className="text-xs mt-2">
            Version 1.3.0 • Last updated October 2025
          </p>
        </div>
      </div>
    </div>
  )
}
