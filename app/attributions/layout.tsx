import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Attributions',
  description: 'Image and music attributions for Splash Screen App. All background images from Unsplash and ambient music from Pixabay.',
  openGraph: {
    title: 'Attributions | Splash Screen App',
    description: 'Credits and licenses for images and music used in Splash Screen App.',
    url: 'https://sbmadhav.github.io/splash-screen-app/attributions',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Attributions | Splash Screen App',
    description: 'Credits for images and music.',
  },
}

export default function AttributionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
