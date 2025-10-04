import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('useIsMobile', () => {
  // Store original window properties
  const originalInnerWidth = global.innerWidth
  const originalMatchMedia = global.matchMedia

  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })

    // Mock window.matchMedia
    global.matchMedia = jest.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    })
    global.matchMedia = originalMatchMedia
  })

  it('returns false for desktop widths (≥768px)', () => {
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('returns true for mobile widths (<768px)', () => {
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('returns true for small mobile widths', () => {
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('handles the breakpoint boundary correctly', () => {
    // Test exactly at 768px (should be false - desktop)
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Test exactly at 767px (should be true - mobile)
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767
    })

    const { result: result767 } = renderHook(() => useIsMobile())
    expect(result767.current).toBe(true)
  })

  it('responds to window resize events via matchMedia', () => {
    let mediaQueryCallback: (() => void) | null = null

    // Mock matchMedia to capture the callback
    global.matchMedia = jest.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change' && typeof callback === 'function') {
          mediaQueryCallback = callback as () => void
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    // Start with desktop width
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Simulate resize to mobile width
    act(() => {
      Object.defineProperty(global, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600
      })
      // Trigger the media query change callback
      if (mediaQueryCallback) {
        mediaQueryCallback()
      }
    })

    expect(result.current).toBe(true)

    // Simulate resize back to desktop width
    act(() => {
      Object.defineProperty(global, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      })
      // Trigger the media query change callback
      if (mediaQueryCallback) {
        mediaQueryCallback()
      }
    })

    expect(result.current).toBe(false)
  })

  it('sets up media query listener with correct breakpoint', () => {
    const mockMatchMedia = jest.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    global.matchMedia = mockMatchMedia

    renderHook(() => useIsMobile())

    // Should call matchMedia with the mobile breakpoint query
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('cleans up media query listener on unmount', () => {
    const mockRemoveEventListener = jest.fn()
    const mockAddEventListener = jest.fn()

    global.matchMedia = jest.fn(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: jest.fn(),
    }))

    const { unmount } = renderHook(() => useIsMobile())

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('properly uses the mobile breakpoint constant', () => {
    // Test just above and below the breakpoint to ensure the constant is used correctly
    
    // Test at 768px (should be desktop/false)
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768
    })

    const { result: result768 } = renderHook(() => useIsMobile())
    expect(result768.current).toBe(false)

    // Test at 767px (should be mobile/true)
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767
    })

    const { result: result767 } = renderHook(() => useIsMobile())
    expect(result767.current).toBe(true)
  })

  it('starts with undefined state and then updates', () => {
    // Since the hook starts with undefined and then sets the actual value,
    // we need to test the initial state behavior
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })

    const { result } = renderHook(() => useIsMobile())

    // The hook should return false for undefined (!!undefined = false)
    // and then the actual boolean value based on screen size
    expect(typeof result.current).toBe('boolean')
    expect(result.current).toBe(false)
  })

  it('handles very large screen sizes', () => {
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 4000
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('handles very small screen sizes', () => {
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 240
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })
})
