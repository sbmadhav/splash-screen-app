import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('PWAInstallPrompt', () => {
  let consoleLogSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance
  
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    // Reset window.matchMedia for each test
    ;(window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: query === '(display-mode: standalone)' ? false : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    // Mock addEventListener and removeEventListener
    jest.spyOn(window, 'addEventListener').mockImplementation()
    jest.spyOn(window, 'removeEventListener').mockImplementation()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    jest.restoreAllMocks()
  })

  describe('when app is already installed', () => {
    beforeEach(() => {
      ;(window.matchMedia as jest.Mock).mockImplementation(query => ({
        matches: query === '(display-mode: standalone)' ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    })

    it('shows app installed status with dark theme', () => {
      render(<PWAInstallPrompt theme="dark" />)
      
      expect(screen.getByText('App Installed')).toBeInTheDocument()
      expect(screen.getByText('This app is already installed on your device')).toBeInTheDocument()
      expect(screen.getByText('PWA Status')).toBeInTheDocument()
    })

    it('shows app installed status with light theme', () => {
      render(<PWAInstallPrompt theme="light" />)
      
      expect(screen.getByText('App Installed')).toBeInTheDocument()
      expect(screen.getByText('This app is already installed on your device')).toBeInTheDocument()
      expect(screen.getByText('PWA Status')).toBeInTheDocument()
    })
  })

  describe('PWA not installable scenarios', () => {
    it('shows installation available status with dark theme', () => {
      // Mock that we've checked capability and it's not installable
      jest.useFakeTimers()
      render(<PWAInstallPrompt theme="dark" />)
      
      // Fast-forward past the timeout
      act(() => {
        jest.advanceTimersByTime(4000)
      })
      
      expect(screen.getByText('Installation Available')).toBeInTheDocument()
      jest.useRealTimers()
    })

    it('shows installation available status with light theme', () => {
      // Mock that we've checked capability and it's not installable
      jest.useFakeTimers()
      render(<PWAInstallPrompt theme="light" />)
      
      // Fast-forward past the timeout
      act(() => {
        jest.advanceTimersByTime(4000)
      })
      
      expect(screen.getByText('Installation Available')).toBeInTheDocument()
      jest.useRealTimers()
    })
  })

  describe('basic functionality', () => {
    it('renders without crashing', () => {
      render(<PWAInstallPrompt />)
      expect(screen.getByText('Install App')).toBeInTheDocument()
    })

    it('adds event listeners on mount', () => {
      render(<PWAInstallPrompt />)
      
      expect(window.addEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
      expect(window.addEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function))
    })

    it('removes event listeners on unmount', () => {
      const { unmount } = render(<PWAInstallPrompt />)
      
      unmount()
      
      expect(window.removeEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
      expect(window.removeEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function))
    })
  })

  describe('theme variants', () => {
    it('applies correct CSS classes for dark theme', () => {
      const { container } = render(<PWAInstallPrompt theme="dark" />)
      
      // Check for dark theme specific classes
      expect(container.querySelector('.bg-gray-900')).toBeInTheDocument()
      expect(container.querySelector('.text-white')).toBeInTheDocument()
    })

    it('applies correct CSS classes for light theme', () => {
      const { container } = render(<PWAInstallPrompt theme="light" />)
      
      // Check for light theme specific classes
      expect(container.querySelector('.bg-white')).toBeInTheDocument()
      expect(container.querySelector('.text-gray-900')).toBeInTheDocument()
    })

    it('defaults to dark theme when no theme specified', () => {
      const { container } = render(<PWAInstallPrompt />)
      
      expect(container.querySelector('.bg-gray-900')).toBeInTheDocument()
    })
  })
})
