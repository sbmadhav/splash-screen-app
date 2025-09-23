/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuration for GitHub Pages deployment
  ...(isProd && isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    basePath: '/splash-screen-app',
    assetPrefix: '/splash-screen-app',
  }),
}

export default nextConfig
