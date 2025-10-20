'use client'

/**
 * Structured Data (JSON-LD) component for SEO
 * Provides rich snippets for search engines
 */
export default function StructuredData() {
  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Splash Screen App',
    url: 'https://sbmadhav.github.io/splash-screen-app/',
    logo: 'https://sbmadhav.github.io/splash-screen-app/icon-512x512.png',
    description: 'A beautiful, customizable splash screen app for focus sessions, relaxation, or meetings.',
    sameAs: [
      'https://github.com/sbmadhav/splash-screen-app',
    ],
  }

  // WebApplication schema
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Splash Screen App',
    url: 'https://sbmadhav.github.io/splash-screen-app/',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    browserRequirements: 'Requires JavaScript. Works best with modern browsers.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'A beautiful, customizable splash screen app for focus sessions, relaxation, or meetings. Features stunning seasonal backgrounds, ambient music, and Pomodoro timer. Free, open-source PWA with offline support.',
    screenshot: 'https://sbmadhav.github.io/splash-screen-app/og-image.jpg',
    featureList: [
      'Pomodoro Timer',
      'Beautiful Seasonal Backgrounds',
      'Ambient Music',
      'Offline Support',
      'Customizable Settings',
      'Dark/Light Mode',
      'Progressive Web App',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  }

  // BreadcrumbList schema for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sbmadhav.github.io/splash-screen-app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Settings',
        item: 'https://sbmadhav.github.io/splash-screen-app/settings',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'About',
        item: 'https://sbmadhav.github.io/splash-screen-app/about',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Attributions',
        item: 'https://sbmadhav.github.io/splash-screen-app/attributions',
      },
    ],
  }

  // SoftwareApplication schema (alternative to WebApplication)
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Splash Screen App',
    url: 'https://sbmadhav.github.io/splash-screen-app/',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: '1',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  )
}
