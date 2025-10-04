import { isStaticEnvironment, shouldUseLocalImages, getBasePath } from '@/lib/static-utils'

// Mock window.location
const mockLocation = {
  hostname: 'localhost',
  protocol: 'http:',
  pathname: '/'
}

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

describe('static-utils', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    // Reset location mock
    mockLocation.hostname = 'localhost'
    mockLocation.protocol = 'http:'
    mockLocation.pathname = '/'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('isStaticEnvironment', () => {
    it('returns true for GitHub Pages hostname', () => {
      mockLocation.hostname = 'sbmadhav.github.io'
      expect(isStaticEnvironment()).toBe(true)
    })

    it('returns true for file protocol', () => {
      mockLocation.protocol = 'file:'
      expect(isStaticEnvironment()).toBe(true)
    })

    it('returns false for localhost', () => {
      mockLocation.hostname = 'localhost'
      mockLocation.protocol = 'http:'
      expect(isStaticEnvironment()).toBe(false)
    })

    it('returns true when GITHUB_PAGES env is set', () => {
      // Mock being in a server environment by temporarily removing window
      const originalWindow = global.window
      delete (global as any).window
      
      process.env.GITHUB_PAGES = 'true'
      expect(isStaticEnvironment()).toBe(true)
      
      // Restore window
      global.window = originalWindow
    })
  })

  describe('shouldUseLocalImages', () => {
    it('returns true for GitHub Pages environment', () => {
      mockLocation.hostname = 'sbmadhav.github.io'
      expect(shouldUseLocalImages()).toBe(true)
    })

    it('returns false for development environment', () => {
      mockLocation.hostname = 'localhost'
      expect(shouldUseLocalImages()).toBe(false)
    })

    it('returns true when GITHUB_PAGES env is set', () => {
      // Mock being in a server environment by temporarily removing window
      const originalWindow = global.window
      delete (global as any).window
      
      process.env.GITHUB_PAGES = 'true'
      expect(shouldUseLocalImages()).toBe(true)
      
      // Restore window
      global.window = originalWindow
    })
  })

  describe('getBasePath', () => {
    it('returns empty string for localhost development', () => {
      mockLocation.hostname = 'localhost'
      mockLocation.pathname = '/'
      expect(getBasePath()).toBe('')
    })

    it('returns splash-screen-app path for GitHub Pages', () => {
      mockLocation.hostname = 'sbmadhav.github.io'
      expect(getBasePath()).toBe('/splash-screen-app')
    })

    it('returns splash-screen-app path when pathname starts with splash-screen-app', () => {
      mockLocation.hostname = 'example.com'
      mockLocation.pathname = '/splash-screen-app/settings'
      expect(getBasePath()).toBe('/splash-screen-app')
    })

    it('returns splash-screen-app path for production build with GITHUB_PAGES env', () => {
      // Mock being in a server environment by temporarily removing window
      const originalWindow = global.window
      delete (global as any).window
      
      // Mock process.env for this test
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true
      })
      process.env.GITHUB_PAGES = 'true'
      
      expect(getBasePath()).toBe('/splash-screen-app')
      
      // Restore original values
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
      global.window = originalWindow
    })

    it('returns empty string for production without GITHUB_PAGES env', () => {
      // Mock being in a server environment by temporarily removing window
      const originalWindow = global.window
      delete (global as any).window
      
      // Mock process.env for this test
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true
      })
      delete process.env.GITHUB_PAGES
      
      expect(getBasePath()).toBe('')
      
      // Restore original values
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true
      })
      global.window = originalWindow
    })
  })
})
