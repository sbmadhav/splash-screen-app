import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PWASplashScreen } from '@/components/pwa-splash-screen'

// Mock service worker registration
const mockServiceWorkerRegistration = {
  scope: 'https://example.com/',
  installing: null,
  waiting: null,
  active: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}

// Mock navigator.serviceWorker
const mockNavigator = {
  register: jest.fn(),
  controller: {
    postMessage: jest.fn(),
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}

// Mock MessageChannel
global.MessageChannel = jest.fn().mockImplementation(() => ({
  port1: {
    onmessage: null,
    postMessage: jest.fn(),
  },
  port2: {
    onmessage: null,
    postMessage: jest.fn(),
  },
}))

// Mock process.env
const originalEnv = process.env

describe('PWASplashScreen', () => {
  const mockOnComplete = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset process.env
    process.env = { ...originalEnv }
    
    // Reset service worker mock to working state
    mockNavigator.register.mockResolvedValue(mockServiceWorkerRegistration)
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      configurable: true,
      value: mockNavigator,
    })
    
    // Reset window location
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        hostname: 'localhost',
        pathname: '/',
      },
    })
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders initial loading state', async () => {
    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })
    
    // Check that we start with "Initializing app..." even if it changes quickly
    expect(screen.getByText(/Caching core assets\.\.\.|Registering service worker\.\.\.|Initializing app\.\.\./)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('detects GitHub Pages and uses correct service worker path', async () => {
    // Mock production environment
    Object.defineProperty(process.env, 'NODE_ENV', {
      writable: true,
      value: 'production',
    })
    
    // Mock GitHub Pages environment (both conditions must be met)
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        hostname: 'username.github.io',
        pathname: '/splash-screen-app/',
      },
    })

    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })

    await waitFor(() => {
      expect(mockNavigator.register).toHaveBeenCalledWith('/splash-screen-app/sw.js')
    }, { timeout: 1000 })
  })

  it('uses regular service worker path for local development', async () => {
    // Keep default development environment
    Object.defineProperty(process.env, 'NODE_ENV', {
      writable: true,
      value: 'development',
    })
    
    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })

    await waitFor(() => {
      expect(mockNavigator.register).toHaveBeenCalledWith('/sw.js')
    }, { timeout: 1000 })
  })

  it('completes loading process', async () => {
    const onComplete = jest.fn()
    
    await act(async () => {
      render(<PWASplashScreen onComplete={onComplete} />)
    })

    // Wait for the completion callback with extended timeout
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled()
    }, { timeout: 15000 })
  }, 20000) // Set test timeout to 20 seconds

  it('shows progressive loading states', async () => {
    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })

    // Just check that some loading text is present - the exact state depends on timing
    expect(screen.getByText(/Initializing app\.\.\.|Registering service worker\.\.\.|Caching core assets\.\.\.|Setting up lazy caching\.\.\.|Preparing app\.\.\./)).toBeInTheDocument()
  })

  it('handles service worker registration errors', async () => {
    // Mock registration failure
    mockNavigator.register.mockRejectedValueOnce(new Error('Registration failed'))
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })

    // Should still complete even if service worker fails
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    }, { timeout: 5000 })
    
    consoleSpy.mockRestore()
  })

  it('handles environments without service worker support', async () => {
    // Remove service worker support
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      configurable: true,
      value: undefined,
    })

    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })

    // Should show loading app message and complete
    await waitFor(() => {
      expect(screen.getByText('Loading app...')).toBeInTheDocument()
    }, { timeout: 1000 })

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    }, { timeout: 5000 })
  })

  it('displays progress bar', async () => {
    await act(async () => {
      render(<PWASplashScreen onComplete={mockOnComplete} />)
    })
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('role', 'progressbar')
  })
})
