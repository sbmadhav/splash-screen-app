import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AudioVisualizer } from '@/components/audio-visualizer'

// Mock the debug-utils to enable debug logging for tests
jest.mock('@/lib/debug-utils', () => ({
  debugLog: jest.fn((message: string, ...args: any[]) => {
    console.debug(message, ...args)
  })
}))

const mockDebugLog = require('@/lib/debug-utils').debugLog as jest.MockedFunction<typeof import('@/lib/debug-utils').debugLog>

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock AudioContext and related APIs
const mockAudioContext = {
  createAnalyser: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 0,
    frequencyBinCount: 128,
    getByteFrequencyData: jest.fn(),
  })),
  createMediaElementSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
  state: 'running',
  resume: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
}

global.AudioContext = jest.fn(() => mockAudioContext) as any
;(global as any).webkitAudioContext = jest.fn(() => mockAudioContext)

// Mock canvas APIs
const mockCanvas = {
  getContext: jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
  })),
  width: 1024,
  height: 768,
}

HTMLCanvasElement.prototype.getContext = mockCanvas.getContext as any

describe('AudioVisualizer - Debug Logging', () => {
  let consoleDebugSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()
    mockDebugLog.mockClear()
  })

  afterEach(() => {
    consoleDebugSpy.mockRestore()
  })

  describe('component initialization', () => {
    it('logs canvas size updates', async () => {
      render(<AudioVisualizer audioUrl="" isPlaying={false} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('[AudioVisualizer] Canvas size updated:', 1024, 'x', 768)
      })
    })

    it('logs props changes', async () => {
      const { rerender } = render(<AudioVisualizer audioUrl="" isPlaying={false} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('[AudioVisualizer] Props changed:', { audioUrl: '', isPlaying: false })
      })

      // Change props
      rerender(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={true} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('[AudioVisualizer] Props changed:', { audioUrl: './music/test.mp3', isPlaying: true })
      })
    })
  })

  describe('audio state changes', () => {
    it('logs when no audio element or URL is present', async () => {
      render(<AudioVisualizer audioUrl="" isPlaying={false} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('[AudioVisualizer] No audio element or URL, skipping play state change')
      })
    })

    it('logs play state changes', async () => {
      render(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={true} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('[AudioVisualizer] Play state prop changed to:', true)
      })
    })

    it('logs audio initialization attempts', async () => {
      render(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={true} />)

      await waitFor(() => {
        // The component should log the context initialization
        expect(mockDebugLog).toHaveBeenCalledWith('Initializing audio context...')
      })
    })
  })

  describe('audio context operations', () => {
    it('logs audio context initialization', async () => {
      render(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={true} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('Initializing audio context...')
        expect(mockDebugLog).toHaveBeenCalledWith('Audio context created, state:', 'running')
      })
    })

    it('logs audio nodes connection', async () => {
      render(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={true} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('Audio nodes connected')
        expect(mockDebugLog).toHaveBeenCalledWith('Audio initialization complete')
      })
    })
  })

  describe('error handling', () => {
    it('logs audio context errors', async () => {
      // Mock AudioContext to throw error
      global.AudioContext = jest.fn(() => {
        throw new Error('Audio context failed')
      }) as any

      const errorSpy = jest.spyOn(console, 'error').mockImplementation()

      render(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={true} />)

      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith('Error initializing audio context:', expect.any(Error))
      })

      errorSpy.mockRestore()
    })
  })

  describe('audio source updates', () => {
    it('logs audio source setting', async () => {
      render(<AudioVisualizer audioUrl="./music/test.mp3" isPlaying={false} />)

      await waitFor(() => {
        expect(mockDebugLog).toHaveBeenCalledWith('🎵 Setting audio source:', './music/test.mp3')
      })
    })
  })
})
