import { GET } from '@/app/api/random-image/route'
import { NextRequest } from 'next/server'

// Mock fetch
global.fetch = jest.fn()

describe('/api/random-image', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns Unsplash image when API key is provided', async () => {
    // Mock environment variable
    process.env.UNSPLASH_ACCESS_KEY = 'test-key'
    
    // Mock successful Unsplash response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        urls: { full: 'https://unsplash.com/test.jpg' },
        alt_description: 'Beautiful landscape',
        description: 'Stunning nature photo',
        location: { name: 'Test Location' },
      }),
    })

    const request = new NextRequest('http://localhost:3000/api/random-image')
    const response = await GET(request)
    const data = await response.json()

    expect(data.url).toBe('https://unsplash.com/test.jpg')
    expect(data.title).toBe('Beautiful landscape')
    expect(data.copyright).toBe('Stunning nature photo')
    expect(data.location).toBe('Test Location')
  })

  it('falls back to Picsum when Unsplash fails', async () => {
    // No API key
    delete process.env.UNSPLASH_ACCESS_KEY

    const request = new NextRequest('http://localhost:3000/api/random-image')
    const response = await GET(request)
    const data = await response.json()

    expect(data.url).toMatch(/picsum\.photos/)
    expect(data.title).toBeDefined()
    expect(data.copyright).toBeDefined()
    expect(data.location).toBeNull()
  })

  it('falls back to Picsum when Unsplash returns error', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-key'
    
    // Mock failed Unsplash response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    })

    const request = new NextRequest('http://localhost:3000/api/random-image')
    const response = await GET(request)
    const data = await response.json()

    expect(data.url).toMatch(/picsum\.photos/)
    expect(data.title).toBeDefined()
    expect(data.copyright).toBeDefined()
    expect(data.location).toBeNull()
  })

  it('avoids used images', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-key'
    
    const usedImages = ['https://unsplash.com/used1.jpg', 'https://unsplash.com/used2.jpg']
    const request = new NextRequest(
      `http://localhost:3000/api/random-image?usedImages=${usedImages.join(',')}`
    )

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        urls: { full: 'https://unsplash.com/new.jpg' },
        alt_description: 'New image',
        description: 'Fresh photo',
        location: { name: 'New Location' },
      }),
    })

    const response = await GET(request)
    const data = await response.json()

    expect(data.url).toBe('https://unsplash.com/new.jpg')
    expect(usedImages).not.toContain(data.url)
  })

  it('handles network errors gracefully', async () => {
    process.env.UNSPLASH_ACCESS_KEY = 'test-key'
    
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const request = new NextRequest('http://localhost:3000/api/random-image')
    const response = await GET(request)
    const data = await response.json()

    // Should fall back to Picsum
    expect(data.url).toMatch(/picsum\.photos/)
    expect(data.title).toBeDefined()
    expect(data.copyright).toBeDefined()
    expect(data.location).toBeNull()
  })
})
