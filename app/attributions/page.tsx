import { Attributions } from '@/components/attributions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Asset Attributions | Splash Screen App',
  description: 'Attribution information for all assets used in the Splash Screen App, including images, music, and other media.',
  keywords: ['attributions', 'credits', 'assets', 'licenses', 'sources'],
}

export default function AttributionsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Attributions />
    </div>
  )
}
