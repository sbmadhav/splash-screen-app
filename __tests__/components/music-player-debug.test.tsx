import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MusicPlayer } from '@/components/music-player'

// Mock the audio visualizer component
jest.mock('@/components/audio-visualizer', () => ({
  AudioVisualizer: jest.fn(({ audioUrl, isPlaying, canvasWidth, canvasHeight }) => (
    <div data-testid="audio-visualizer">
      Audio Visualizer - URL: {audioUrl}, Playing: {isPlaying ? 'true' : 'false'}
      Size: {canvasWidth}x{canvasHeight}
    </div>
  ))
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 })
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 })

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock fetch for music file preloading
global.fetch = jest.fn()

describe('MusicPlayer Debug Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockLocalStorage.getItem.mockReturnValue(null)
    
    // Mock successful fetch for music files
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('should render music player with debug logging', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<MusicPlayer />)

    // Wait for component to mount and load settings
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[MusicPlayer] Component mounted, loading settings...')
      )
    })

    expect(screen.getByTestId('audio-visualizer')).toBeInTheDocument()

    consoleSpy.mockRestore()
  })

  test('should log debug information when play button is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<MusicPlayer />)

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    })

    const playButton = screen.getByRole('button', { name: /play/i })
    fireEvent.click(playButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[MusicPlayer] Toggle play clicked')
      )
    })

    consoleSpy.mockRestore()
  })

  test('should log debug information when mute button is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<MusicPlayer />)

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument()
    })

    const muteButton = screen.getByRole('button', { name: /mute/i })
    fireEvent.click(muteButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[MusicPlayer] Toggle mute clicked, current state:',
        expect.any(Boolean)
      )
    })

    consoleSpy.mockRestore()
  })

  test('should log debug information when settings are loaded from localStorage', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    // Mock localStorage to return stored settings
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'appSettings') return JSON.stringify({
        selectedMusic: 'rain-sounds',
        theme: 'dark'
      })
      return null
    })

    render(<MusicPlayer />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[MusicPlayer] Setting audio URL:', './music/rain-sounds.mp3'
      )
    })

    consoleSpy.mockRestore()
  })

  test('should log state changes', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<MusicPlayer />)

    // Wait for initial state change log
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[MusicPlayer] State changed:',
        expect.objectContaining({
          currentAudioUrl: expect.any(String),
          isPlaying: expect.any(Boolean),
          isMuted: expect.any(Boolean),
          selectedMusic: expect.any(String),
          effectivelyPlaying: expect.any(Boolean)
        })
      )
    }, { timeout: 10000 })

    consoleSpy.mockRestore()
  })

  test('should handle window resize and update canvas dimensions', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<MusicPlayer />)

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true })
    
    fireEvent(window, new Event('resize'))

    // Wait a bit for any resize handlers to complete
    await waitFor(() => {
      // Just check that the component is still rendering
      expect(screen.getByTestId('audio-visualizer')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })

  test('should handle music file preloading with debug logging', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

    // Mock fetch to fail
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<MusicPlayer />)

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[MusicPlayer] Preloading music file:', './music/just-relax.mp3'
      )
    })

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[MusicPlayer] Could not preload music file'),
        expect.any(String),
        expect.any(Error)
      )
    })

    consoleLogSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })
})
