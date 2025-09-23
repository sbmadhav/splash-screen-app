// This file forces all API routes to be dynamic and excluded from static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// This route should never be called
export async function GET() {
  return new Response('API routes not available in static export', { status: 404 })
}
