import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Splash Screen App - an open-source productivity tool featuring beautiful backgrounds, ambient music, and Pomodoro timer. Built with Next.js and love.',
  openGraph: {
    title: 'About | Splash Screen App',
    description: 'Learn more about Splash Screen App - an open-source productivity tool featuring beautiful backgrounds, ambient music, and Pomodoro timer.',
    url: 'https://sbmadhav.github.io/splash-screen-app/about',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About | Splash Screen App',
    description: 'Learn more about Splash Screen App - an open-source productivity tool.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
