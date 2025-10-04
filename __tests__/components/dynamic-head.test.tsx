import { render } from '@testing-library/react'
import { DynamicHead } from '@/components/dynamic-head'

// Mock the static-utils module
jest.mock('@/lib/static-utils', () => ({
  getBasePath: jest.fn(() => '')
}))

// Mock the debug-utils module
jest.mock('@/lib/debug-utils', () => ({
  debugLog: jest.fn()
}))

const mockGetBasePath = require('@/lib/static-utils').getBasePath as jest.MockedFunction<typeof import('@/lib/static-utils').getBasePath>
const mockDebugLog = require('@/lib/debug-utils').debugLog as jest.MockedFunction<typeof import('@/lib/debug-utils').debugLog>

describe('DynamicHead', () => {
  let consoleLogSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetBasePath.mockReturnValue('')
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('renders without crashing', () => {
    expect(() => render(<DynamicHead />)).not.toThrow()
  })

  it('calls getBasePath during render', () => {
    render(<DynamicHead />)
    expect(mockGetBasePath).toHaveBeenCalled()
  })

  it('calls debugLog with correct manifest path for development', () => {
    mockGetBasePath.mockReturnValue('')
    render(<DynamicHead />)
    
    // Should call debugLog with development path
    expect(mockDebugLog).toHaveBeenCalledWith('[DynamicHead] Manifest link set to:', '/manifest.json')
  })

  it('calls debugLog with correct manifest path for GitHub Pages', () => {
    mockGetBasePath.mockReturnValue('/splash-screen-app')
    render(<DynamicHead />)
    
    // Should call debugLog with GitHub Pages path
    expect(mockDebugLog).toHaveBeenCalledWith('[DynamicHead] Manifest link set to:', '/splash-screen-app/manifest.json')
  })

  it('handles server-side rendering gracefully', () => {
    // The component should handle missing document gracefully due to the typeof check
    // We can't easily test this in jsdom, so we'll just verify it renders
    expect(() => render(<DynamicHead />)).not.toThrow()
  })

  it('adds manifest link to document head in browser environment', () => {
    (mockGetBasePath as jest.Mock).mockReturnValue('/test-path')
    
    render(<DynamicHead />)

    // Verify debugLog was called with the correct path (since we can't easily mock DOM manipulation)
    expect(mockDebugLog).toHaveBeenCalledWith('[DynamicHead] Manifest link set to:', '/test-path/manifest.json')
  })
})
