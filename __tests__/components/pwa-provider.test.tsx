import { render, screen, waitFor, act } from '@testing-library/react'
import { PWAProvider } from '@/components/pwa-provider'

// Mock the PWASplashScreen component
jest.mock('@/components/pwa-splash-screen', () => ({
  PWASplashScreen: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="splash-screen">
      <button onClick={onComplete} data-testid="complete-button">Complete</button>
    </div>
  ),
}))

describe('PWAProvider', () => {
  const mockSessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }

  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }

  const mockNavigator = {
    serviceWorker: {
      register: jest.fn().mockResolvedValue({}),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock storage
    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    })

    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    // Mock navigator
    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
    })

    // Reset storage mocks
    mockSessionStorage.getItem.mockReturnValue(null)
    mockLocalStorage.getItem.mockReturnValue(null)
    
    // Mock window.location
    delete (window as any).location
    window.location = {
      hostname: 'localhost',
      pathname: '/',
    } as any
  })

  it('shows splash screen on first visit', async () => {
    await act(async () => {
      render(
        <PWAProvider>
          <div data-testid="main-content">Main Content</div>
        </PWAProvider>
      )
    })

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('main-content')).not.toBeInTheDocument()
  })

  it('skips splash screen on subsequent navigation in same session', async () => {
    const sessionId = '1234567890'
    mockSessionStorage.getItem.mockReturnValue(sessionId)
    mockLocalStorage.getItem.mockReturnValue(sessionId)

    await act(async () => {
      render(
        <PWAProvider>
          <div data-testid="main-content">Main Content</div>
        </PWAProvider>
      )
    })

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })
  })

  it('completes splash screen and shows main content', async () => {
    // Mock the session ID generation
    const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1234567890)
    const sessionId = '1234567890'
    
    await act(async () => {
      render(
        <PWAProvider>
          <div data-testid="main-content">Main Content</div>
        </PWAProvider>
      )
    })

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument()

    // Mock sessionStorage to return the session ID for the completion handler
    mockSessionStorage.getItem.mockReturnValue(sessionId)

    // Complete the splash screen
    await act(async () => {
      screen.getByTestId('complete-button').click()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('splash-screen')).not.toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })

    // Verify localStorage was updated with completion status
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'splash-screen-completed',
      sessionId
    )

    mockDateNow.mockRestore()
  })

  it('registers service worker', async () => {
    await act(async () => {
      render(
        <PWAProvider>
          <div>Content</div>
        </PWAProvider>
      )
    })

    expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')
  })

  it('uses GitHub Pages service worker path when on GitHub Pages', async () => {
    // Mock GitHub Pages environment
    delete (window as any).location
    window.location = {
      hostname: 'user.github.io',
      pathname: '/splash-screen-app/',
    } as any

    // Mock production environment
    const originalEnv = process.env
    process.env = { ...process.env, NODE_ENV: 'production' }

    await act(async () => {
      render(
        <PWAProvider>
          <div>Content</div>
        </PWAProvider>
      )
    })

    expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/splash-screen-app/sw.js')

    process.env = originalEnv
  })

  describe('GitHub Pages detection', () => {
    it('detects GitHub Pages via hostname', async () => {
      // Mock production environment
      const originalEnv = process.env
      process.env = { ...process.env, NODE_ENV: 'production' }

      // Mock window.location for GitHub Pages hostname
      delete (window as any).location
      window.location = {
        hostname: 'username.github.io',
        pathname: '/some-repo/',
      } as any

      await act(async () => {
        render(
          <PWAProvider>
            <div>Content</div>
          </PWAProvider>
        )
      })

      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/splash-screen-app/sw.js')

      process.env = originalEnv
    })

    it('detects GitHub Pages via pathname', async () => {
      // Mock production environment
      const originalEnv = process.env
      process.env = { ...process.env, NODE_ENV: 'production' }

      // Mock window.location for GitHub Pages pathname
      delete (window as any).location
      window.location = {
        hostname: 'example.com',
        pathname: '/splash-screen-app/some-page',
      } as any

      await act(async () => {
        render(
          <PWAProvider>
            <div>Content</div>
          </PWAProvider>
        )
      })

      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/splash-screen-app/sw.js')

      process.env = originalEnv
    })

    it('uses local service worker path for non-GitHub Pages', async () => {
      // Mock production environment
      const originalEnv = process.env
      process.env = { ...process.env, NODE_ENV: 'production' }

      // Mock window.location for non-GitHub Pages
      delete (window as any).location
      window.location = {
        hostname: 'mydomain.com',
        pathname: '/app/',
      } as any

      await act(async () => {
        render(
          <PWAProvider>
            <div>Content</div>
          </PWAProvider>
        )
      })

      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')

      process.env = originalEnv
    })

    it('uses local service worker path in development', async () => {
      // Mock development environment
      const originalEnv = process.env
      process.env = { ...process.env, NODE_ENV: 'development' }

      // Mock window.location for GitHub Pages (should still use local path in dev)
      delete (window as any).location
      window.location = {
        hostname: 'username.github.io',
        pathname: '/splash-screen-app/',
      } as any

      await act(async () => {
        render(
          <PWAProvider>
            <div>Content</div>
          </PWAProvider>
        )
      })

      expect(mockNavigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')

      process.env = originalEnv
    })
  })

  describe('service worker registration error handling', () => {
    it('handles service worker registration failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockError = new Error('Registration failed')
      mockNavigator.serviceWorker.register.mockRejectedValueOnce(mockError)

      await act(async () => {
        render(
          <PWAProvider>
            <div>Content</div>
          </PWAProvider>
        )
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('[PWA] Service worker registration failed:', mockError)
      })

      consoleSpy.mockRestore()
    })

    it('logs successful service worker registration', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      const mockRegistration = { scope: 'test-scope' }
      mockNavigator.serviceWorker.register.mockResolvedValueOnce(mockRegistration)

      await act(async () => {
        render(
          <PWAProvider>
            <div>Content</div>
          </PWAProvider>
        )
      })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('[PWA] Service worker registered:', mockRegistration)
      })

      consoleSpy.mockRestore()
    })
  })
})
