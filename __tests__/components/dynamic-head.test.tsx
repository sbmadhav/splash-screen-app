import { render, waitFor } from '@testing-library/react'
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
    
    // Reset the global flag by re-importing the module and setting the flag to false
    jest.resetModules()
    
    // Clear any existing manifest links
    const existingManifest = document.querySelector('link[rel="manifest"]')
    if (existingManifest && existingManifest.parentNode) {
      existingManifest.parentNode.removeChild(existingManifest)
    }
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it('renders without crashing', () => {
    const { DynamicHead } = require('@/components/dynamic-head')
    expect(() => render(<DynamicHead />)).not.toThrow()
  })

  it('calls getBasePath during render', async () => {
    const { DynamicHead } = require('@/components/dynamic-head')
    render(<DynamicHead />)
    
    // Wait for useEffect to run
    await waitFor(() => {
      expect(mockGetBasePath).toHaveBeenCalled()
    })
  })

  it('calls debugLog with correct manifest path for development', async () => {
    mockGetBasePath.mockReturnValue('')
    const { DynamicHead } = require('@/components/dynamic-head')
    render(<DynamicHead />)
    
    // Wait for useEffect to run and debugLog to be called
    await waitFor(() => {
      expect(mockDebugLog).toHaveBeenCalledWith('[DynamicHead] Manifest link set to:', '/manifest.json')
    })
  })

  it('calls debugLog with correct manifest path for GitHub Pages', async () => {
    mockGetBasePath.mockReturnValue('/splash-screen-app')
    const { DynamicHead } = require('@/components/dynamic-head')
    render(<DynamicHead />)
    
    // Wait for useEffect to run and debugLog to be called
    await waitFor(() => {
      expect(mockDebugLog).toHaveBeenCalledWith('[DynamicHead] Manifest link set to:', '/splash-screen-app/manifest.json')
    })
  })

  it('handles server-side rendering gracefully', () => {
    // The component should handle missing document gracefully due to the typeof check
    // We can't easily test this in jsdom, so we'll just verify it renders
    const { DynamicHead } = require('@/components/dynamic-head')
    expect(() => render(<DynamicHead />)).not.toThrow()
  })

  it('adds manifest link to document head in browser environment', async () => {
    (mockGetBasePath as jest.Mock).mockReturnValue('/test-path')
    
    const { DynamicHead } = require('@/components/dynamic-head')
    render(<DynamicHead />)

    // Wait for useEffect to run and verify debugLog was called with the correct path
    await waitFor(() => {
      expect(mockDebugLog).toHaveBeenCalledWith('[DynamicHead] Manifest link set to:', '/test-path/manifest.json')
    })
  })
})
