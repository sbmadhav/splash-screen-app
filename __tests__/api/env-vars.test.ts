import { GET } from '@/app/api/env-vars/route'

describe('/api/env-vars', () => {
  it('returns environment variables information', async () => {
    // Set test environment variables
    process.env.UNSPLASH_ACCESS_KEY = 'test-key-1234'
    process.env.NEXT_PUBLIC_VERCEL_URL = 'https://test.vercel.app'

    const response = await GET()
    const data = await response.json()

    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('envVars')
    expect(Array.isArray(data.envVars)).toBe(true)
    
    // Check for UNSPLASH_ACCESS_KEY (masked)
    const unsplashVar = data.envVars.find((env: any) => env.key === 'UNSPLASH_ACCESS_KEY')
    expect(unsplashVar).toBeDefined()
    expect(unsplashVar.value).toMatch(/••••••••••••1234/)
    expect(unsplashVar.isPublic).toBe(false)
    
    // Check for NEXT_PUBLIC_VERCEL_URL
    const vercelVar = data.envVars.find((env: any) => env.key === 'NEXT_PUBLIC_VERCEL_URL')
    expect(vercelVar).toBeDefined()
    expect(vercelVar.value).toBe('https://test.vercel.app')
    expect(vercelVar.isPublic).toBe(true)
  })

  it('handles missing environment variables', async () => {
    // Clear environment variables
    delete process.env.UNSPLASH_ACCESS_KEY
    delete process.env.NEXT_PUBLIC_VERCEL_URL

    const response = await GET()
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.envVars).toEqual([])
  })
})
