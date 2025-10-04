import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { PWAProvider } from '@/components/pwa-provider'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn().mockResolvedValue({
      scope: '/',
      active: { state: 'activated' },
      installing: null,
      waiting: null,
    }),
    ready: Promise.resolve({
      scope: '/',
      active: { state: 'activated' },
    }),
  },
  writable: true,
})

// Mock beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

describe('PWA Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    // Mock window.location with all required properties
    delete (window as any).location
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'localhost',
        protocol: 'http:',
        href: 'http://localhost:3000',
        pathname: '/',
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('should register service worker in PWA provider', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    render(
      <PWAProvider>
        <div>Test App</div>
      </PWAProvider>
    )

    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js')
    })

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('[PWA] Service worker registered:'),
      expect.any(Object)
    )

    consoleLogSpy.mockRestore()
  })

  test('should handle PWA install prompt when available', async () => {
    // Mock the install prompt event
    const TestComponent = () => {
      React.useEffect(() => {
        // Use immediate execution instead of setTimeout to avoid timing issues
        const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
        mockEvent.prompt = jest.fn().mockResolvedValue(undefined)
        mockEvent.userChoice = Promise.resolve({ outcome: 'accepted' as const })
        
        // Dispatch event immediately
        setTimeout(() => {
          window.dispatchEvent(mockEvent)
        }, 0)
      }, [])

      return <PWAInstallPrompt />
    }

    render(<TestComponent />)

    // Fast-forward timers to trigger the timeout in PWAInstallPrompt
    jest.advanceTimersByTime(3100)

    // The install prompt should handle the event
    await waitFor(() => {
      // Component should be in the document - look for the install button specifically
      expect(screen.getByRole('button', { name: /show install instructions/i })).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  test('should work on GitHub Pages environment', async () => {
    // Mock GitHub Pages environment
    delete (window as any).location
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'sbmadhav.github.io',
        protocol: 'https:',
        href: 'https://sbmadhav.github.io/splash-screen-app/',
        pathname: '/splash-screen-app/',
      },
      writable: true,
      configurable: true,
    })

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    render(
      <PWAProvider>
        <PWAInstallPrompt />
      </PWAProvider>
    )

    await waitFor(() => {
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/splash-screen-app/sw.js')
    })

    consoleLogSpy.mockRestore()
  })

  test('should handle service worker registration error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Mock service worker registration to fail
    ;(navigator.serviceWorker.register as jest.Mock).mockRejectedValue(
      new Error('Service worker registration failed')
    )

    render(
      <PWAProvider>
        <div>Test App</div>
      </PWAProvider>
    )

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[PWA] Service worker registration failed:'),
        expect.any(Error)
      )
    })

    consoleErrorSpy.mockRestore()
  })

  test('should detect PWA installation capability', async () => {
    jest.useFakeTimers()
    
    // Mock installation capability detection
    const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
    mockEvent.prompt = jest.fn().mockResolvedValue(undefined)
    mockEvent.userChoice = Promise.resolve({ outcome: 'accepted' as const })

    const TestComponent = () => {
      React.useEffect(() => {
        // Simulate the beforeinstallprompt event
        setTimeout(() => {
          window.dispatchEvent(mockEvent)
        }, 100)
      }, [])

      return <PWAInstallPrompt />
    }

    render(<TestComponent />)

    // Advance timers to trigger the event
    jest.advanceTimersByTime(200)

    // Should detect that installation is possible and show install button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show install instructions/i })).toBeInTheDocument()
    }, { timeout: 3000 })
    
    jest.useRealTimers()
  })
})
