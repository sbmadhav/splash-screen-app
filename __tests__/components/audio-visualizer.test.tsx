import { render, screen } from '@testing-library/react'
import { AudioVisualizer } from '@/components/audio-visualizer'

describe('AudioVisualizer', () => {
  const mockProps = {
    audioUrl: './music/test.mp3',
    isPlaying: false,
    onPlayStateChange: jest.fn(),
  }

  beforeEach(() => {
    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      createLinearGradient: jest.fn().mockReturnValue({
        addColorStop: jest.fn(),
      }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    })
  })

  it('renders canvas element', () => {
    const { container } = render(<AudioVisualizer {...mockProps} />)
    
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full')
  })

  it('initializes audio context when playing starts', () => {
    const { rerender } = render(<AudioVisualizer {...mockProps} />)
    
    rerender(<AudioVisualizer {...mockProps} isPlaying={true} />)
    
    // Audio context should be initialized
    expect(global.AudioContext).toHaveBeenCalled()
  })

  it('handles audio context errors gracefully', () => {
    // Mock AudioContext to throw error
    global.AudioContext = jest.fn().mockImplementation(() => {
      throw new Error('Audio context failed')
    })

    const { container } = render(<AudioVisualizer {...mockProps} isPlaying={true} />)
    
    // Should not crash - canvas should still be rendered
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('cleans up audio context on unmount', () => {
    // Just test that unmounting doesn't crash
    const { unmount } = render(<AudioVisualizer {...mockProps} isPlaying={true} />)
    
    // Should not throw error when unmounting
    expect(() => unmount()).not.toThrow()
  })
})
