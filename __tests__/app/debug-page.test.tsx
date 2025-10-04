import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DebugPage from '@/app/debug/page'

// Mock the static-utils module
jest.mock('@/lib/static-utils', () => ({
  shouldUseLocalImages: jest.fn(() => false),
  isStaticEnvironment: jest.fn(() => false),
}))

// Mock fetch for API testing
global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('DebugPage', () => {
  const originalLocation = window.location
  const originalLocalStorage = window.localStorage
  const originalProcess = process.env

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock window.location
    delete (window as any).location
    window.location = {
      hostname: 'localhost',
      protocol: 'http:',
      pathname: '/debug',
      search: '',
    } as any

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    // Mock process.env
    process.env = {
      ...originalProcess,
      GITHUB_PAGES: undefined,
      NODE_ENV: 'test',
    }

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    // Restore window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    })
    process.env = originalProcess
    jest.restoreAllMocks()
  })

  it('renders debug page with initial state', () => {
    render(<DebugPage />)
    
    expect(screen.getByText('Debug Information')).toBeInTheDocument()
    expect(screen.getByText('Refresh Debug Info')).toBeInTheDocument()
    expect(screen.getByText('Clear LocalStorage')).toBeInTheDocument()
    expect(screen.getByText('Test API Call')).toBeInTheDocument()
  })

  it('displays debug information on load', async () => {
    const mockGetItem = window.localStorage.getItem as jest.Mock
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'appSettings') return '{"offlineImageMode":true}'
      if (key === 'lastImage') return 'test-image.jpg'
      return null
    })

    render(<DebugPage />)

    await waitFor(() => {
      expect(screen.getByText(/localhost/)).toBeInTheDocument()
      expect(screen.getByText(/http:/)).toBeInTheDocument()
      expect(screen.getByText(/debug/)).toBeInTheDocument()
    })
  })

  it('clears localStorage when clear button is clicked', () => {
    render(<DebugPage />)
    
    const clearButton = screen.getByText('Clear LocalStorage')
    fireEvent.click(clearButton)

    expect(localStorage.clear).toHaveBeenCalled()
  })

  it('makes API call when test button is clicked', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<DebugPage />)
    
    const testButton = screen.getByText('Test API Call')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/random-image')
    })
  })

  it('handles API call errors gracefully', async () => {
    const mockError = new Error('API Error')
    mockFetch.mockRejectedValue(mockError)

    render(<DebugPage />)
    
    const testButton = screen.getByText('Test API Call')
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('API error:', mockError)
    })
  })

  it('refreshes debug info when refresh button is clicked', () => {
    render(<DebugPage />)
    
    const refreshButton = screen.getByText('Refresh Debug Info')
    fireEvent.click(refreshButton)

    expect(console.log).toHaveBeenCalledWith('Debug info:', expect.any(Object))
  })

  it('handles missing localStorage data gracefully', () => {
    const mockGetItem = window.localStorage.getItem as jest.Mock
    mockGetItem.mockReturnValue(null)

    render(<DebugPage />)
    
    // Should not crash when localStorage items are null
    expect(screen.getByText('Debug Information')).toBeInTheDocument()
  })

  it('shows loading state during API call', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<DebugPage />)
    
    const testButton = screen.getByText('Test API Call')
    fireEvent.click(testButton)

    expect(console.log).toHaveBeenCalledWith('Testing API call...')

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('API response:', 200, true)
    })
  })
})
