import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Customize your Splash Screen App experience. Configure timer settings, choose backgrounds, select music, and personalize your productivity environment.',
  openGraph: {
    title: 'Settings | Splash Screen App',
    description: 'Customize your Splash Screen App experience with timer, background, and music settings.',
    url: 'https://sbmadhav.github.io/splash-screen-app/settings',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Settings | Splash Screen App',
    description: 'Customize your productivity experience.',
  },
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
