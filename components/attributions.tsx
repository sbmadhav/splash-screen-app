'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Image as ImageIcon, Music, Palette } from 'lucide-react'

interface Attribution {
  name: string
  source: string
  creator: string
  license: string
  description: string
  url?: string
}

interface AttributionCategory {
  title: string
  icon: React.ReactNode
  items: Attribution[]
}

export function Attributions() {
  // Note: This data should eventually be loaded from ATTRIBUTIONS.md or a JSON file
  const attributionCategories: AttributionCategory[] = [
    {
      title: 'Background Images',
      icon: <ImageIcon className="h-5 w-5" />,
      items: [
        {
          name: 'Beach-Summer.jpg',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Sunny beach scene with clear blue water',
        },
        {
          name: 'Beach-Summer2.jpg',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Tropical beach with palm trees',
        },
        {
          name: 'City-Spring.jpg',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Urban cityscape in spring',
        },
        {
          name: 'Lake-Winter.jpg',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Frozen lake in winter',
        },
        {
          name: 'Mountain-Summer.jpg',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Summer mountain vista',
        },
        // Add more images as needed
      ],
    },
    {
      title: 'Music Files',
      icon: <Music className="h-5 w-5" />,
      items: [
        {
          name: 'Ambient Track 1',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Relaxing ambient music track',
        },
        {
          name: 'Ambient Track 2',
          source: 'Research needed',
          creator: 'Unknown',
          license: 'To be determined',
          description: 'Peaceful background music',
        },
        // Add more music files as needed
      ],
    },
    {
      title: 'Icons & UI Assets',
      icon: <Palette className="h-5 w-5" />,
      items: [
        {
          name: 'PWA Icons',
          source: 'Custom created',
          creator: 'Splash Screen App Team',
          license: 'Project specific',
          description: 'Progressive Web App icons in various sizes',
        },
        {
          name: 'UI Components',
          source: 'shadcn/ui',
          creator: 'shadcn',
          license: 'MIT License',
          description: 'Reusable UI components library',
          url: 'https://ui.shadcn.com/',
        },
      ],
    },
  ]

  const getLicenseBadgeVariant = (license: string) => {
    if (license.includes('MIT') || license.includes('CC0')) return 'default'
    if (license.includes('CC BY')) return 'secondary'
    if (license.includes('To be determined')) return 'destructive'
    return 'outline'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Asset Attributions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This page lists all the assets used in the Splash Screen App and their respective sources, 
          creators, and licenses. We believe in giving proper credit to content creators.
        </p>
      </div>

      <div className="grid gap-6">
        {attributionCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {category.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge variant={getLicenseBadgeVariant(item.license)}>
                        {item.license}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Creator: </span>
                        <span className="text-muted-foreground">{item.creator}</span>
                      </div>
                      <div>
                        <span className="font-medium">Source: </span>
                        {item.url ? (
                          <a 
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          >
                            {item.source}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">{item.source}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">
            Attribution Status: Incomplete
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 dark:text-amber-300">
          <p className="mb-3">
            This attribution list is currently incomplete and requires research to identify 
            the original sources of all assets.
          </p>
          <div className="space-y-2">
            <p className="font-medium">To complete the attributions:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use reverse image search to find original image sources</li>
              <li>Check music file metadata and common royalty-free sources</li>
              <li>Verify all licenses allow commercial use and distribution</li>
              <li>Update the ATTRIBUTIONS.md file with complete information</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          If you believe any asset is used incorrectly or you are the creator of any unlisted asset, 
          please contact the project maintainer.
        </p>
      </div>
    </div>
  )
}
