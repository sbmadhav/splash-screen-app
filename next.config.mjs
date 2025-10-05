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
  output: isProd && isGitHubPages ? 'export' : undefined,
  trailingSlash: isProd && isGitHubPages ? true : undefined,
  basePath: isProd && isGitHubPages ? '/splash-screen-app' : '',
  assetPrefix: isProd && isGitHubPages ? '/splash-screen-app' : '',
}

export default nextConfig
