import { debugLog, setDebugEnabled, getDebugEnabled } from '@/lib/debug-utils'

// Mock URLSearchParams
const mockURLSearchParams = {
  get: jest.fn()
}

global.URLSearchParams = jest.fn().mockImplementation(() => mockURLSearchParams)

describe('debug-utils', () => {
  let originalConsoleDebug: typeof console.debug
  let consoleDebugSpy: jest.SpyInstance
  let originalProcessEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Reset module state by requiring a fresh copy
    jest.resetModules()
    
    // Mock console.debug
    originalConsoleDebug = console.debug
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()

    // Mock process.env
    originalProcessEnv = process.env
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      configurable: true,
      value: {
        search: '',
      },
    })

    // Reset URL params mock
    mockURLSearchParams.get.mockReturnValue(null)
  })

  afterEach(() => {
    console.debug = originalConsoleDebug
    process.env = originalProcessEnv
    jest.clearAllMocks()
  })

  describe('debugLog', () => {
    it('logs in development environment', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue(null)

      const { debugLog } = require('@/lib/debug-utils')
      debugLog('Test message', 'arg1', 'arg2')

      expect(consoleDebugSpy).toHaveBeenCalledWith('Test message', 'arg1', 'arg2')
    })

    it('does not log in production environment by default', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue(null)

      const { debugLog } = require('@/lib/debug-utils')
      debugLog('Test message')

      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })

    it('logs in production when debug=true URL parameter is set', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue('true')

      const { debugLog } = require('@/lib/debug-utils')
      debugLog('Test message')

      expect(consoleDebugSpy).toHaveBeenCalledWith('Test message')
    })

    it('logs in production when debug=1 URL parameter is set', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue('1')

      const { debugLog } = require('@/lib/debug-utils')
      debugLog('Test message')

      expect(consoleDebugSpy).toHaveBeenCalledWith('Test message')
    })

    it('does not log when debug=false URL parameter is set', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue('false')

      const { debugLog } = require('@/lib/debug-utils')
      debugLog('Test message')

      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })

    it('handles server-side environment without window', () => {
      // Mock server environment
      const originalWindow = global.window
      delete (global as any).window

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      })

      const { debugLog } = require('@/lib/debug-utils')
      debugLog('Server message')

      expect(consoleDebugSpy).toHaveBeenCalledWith('Server message')

      // Restore window
      global.window = originalWindow
    })
  })

  describe('setDebugEnabled', () => {
    it('manually enables debug logging', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue(null)

      const { debugLog, setDebugEnabled } = require('@/lib/debug-utils')
      
      setDebugEnabled(true)
      debugLog('Test message')

      expect(consoleDebugSpy).toHaveBeenCalledWith('Test message')
    })

    it('manually disables debug logging', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      })

      const { debugLog, setDebugEnabled } = require('@/lib/debug-utils')
      
      setDebugEnabled(false)
      debugLog('Test message')

      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })
  })

  describe('getDebugEnabled', () => {
    it('returns true in development environment', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue(null)

      const { getDebugEnabled } = require('@/lib/debug-utils')
      expect(getDebugEnabled()).toBe(true)
    })

    it('returns false in production environment', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue(null)

      const { getDebugEnabled } = require('@/lib/debug-utils')
      expect(getDebugEnabled()).toBe(false)
    })

    it('returns true when debug URL parameter is set', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true
      })
      mockURLSearchParams.get.mockReturnValue('true')

      const { getDebugEnabled } = require('@/lib/debug-utils')
      expect(getDebugEnabled()).toBe(true)
    })
  })
})
