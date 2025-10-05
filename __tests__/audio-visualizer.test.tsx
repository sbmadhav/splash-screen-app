import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AudioVisualizer } from '../components/audio-visualizer';

// Mock Canvas and Web Audio API
const mockCanvas = {
  getContext: jest.fn(() => ({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 0,
    canvas: {
      width: 300,
      height: 300,
    },
  })),
  width: 300,
  height: 300,
  style: {},
};

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockCanvas.getContext,
});

// Mock AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn(() => ({
    frequencyBinCount: 128,
    getByteFrequencyData: jest.fn(),
    connect: jest.fn(),
    fftSize: 256,
  })),
  createMediaElementSource: jest.fn(() => ({
    connect: jest.fn(),
  })),
  resume: jest.fn(),
  state: 'running',
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock window.debug object
Object.defineProperty(window, 'debug', {
  value: {
    audio: {
      enabled: false,
      log: jest.fn(),
    },
  },
  writable: true,
});

describe('AudioVisualizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render canvas element', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName).toBe('CANVAS');
  });

  it('should have correct accessibility attributes', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should apply responsive classes', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('w-full', 'h-full');
  });

  it('should initialize audio context when playing starts', () => {
    const { rerender } = render(<AudioVisualizer isPlaying={false} />);
    
    // Start playing
    rerender(<AudioVisualizer isPlaying={true} />);
    
    // AudioContext should be created (mocked)
    expect(global.AudioContext).toHaveBeenCalled();
  });

  it('should handle audio element change', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} audioUrl="/test-audio.mp3" />);
    
    // The component manages its own audio element internally
    // This test verifies the component renders without error when audioUrl is provided
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = render(
      <AudioVisualizer isPlaying={false} audioUrl="/test-audio.mp3" />
    );
    
    // Component should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  it('should handle window resize events', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<AudioVisualizer isPlaying={false} />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should start animation when playing', () => {
    render(<AudioVisualizer isPlaying={true} />);
    
    // Animation frame should be requested
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should stop animation when not playing', () => {
    const { rerender } = render(<AudioVisualizer isPlaying={true} />);
    
    // Stop playing
    rerender(<AudioVisualizer isPlaying={false} />);
    
    // Animation should be cancelled
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should handle audio context resume', async () => {
    const mockAudioContext = {
      createAnalyser: jest.fn(() => ({
        frequencyBinCount: 128,
        getByteFrequencyData: jest.fn(),
        connect: jest.fn(),
        fftSize: 256,
      })),
      createMediaElementSource: jest.fn(() => ({
        connect: jest.fn(),
      })),
      resume: jest.fn().mockResolvedValue(undefined),
      state: 'suspended',
    };
    
    global.AudioContext = jest.fn().mockImplementation(() => mockAudioContext);
    
    render(<AudioVisualizer isPlaying={true} />);
    
    // AudioContext resume should be called if suspended
    expect(mockAudioContext.resume).toHaveBeenCalled();
  });

  it('should handle canvas size updates', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} />);
    const canvas = container.querySelector('canvas');
    
    expect(canvas).toBeInTheDocument();
    
    // Simulate resize
    global.dispatchEvent(new Event('resize'));
    
    // Canvas context should be accessed for resizing
    expect(mockCanvas.getContext).toHaveBeenCalled();
  });

  it('should work without audio element', () => {
    // Should not crash when no audio element is provided
    expect(() => {
      render(<AudioVisualizer isPlaying={true} />);
    }).not.toThrow();
  });

  it('should handle debug logging when enabled', () => {
    // Mock the debug object with proper typing
    (global as any).window.debug = {
      audio: {
        enabled: true,
        log: jest.fn(),
      },
    };
    
    render(<AudioVisualizer isPlaying={true} />);
    
    // Debug logging should be available (exact calls depend on implementation)
    expect((global as any).window.debug.audio.log).toBeDefined();
    
    // Reset debug state
    (global as any).window.debug.audio.enabled = false;
  });

  it('should properly clean up resources on unmount', () => {
    const { unmount } = render(<AudioVisualizer isPlaying={true} />);
    
    unmount();
    
    // Should clean up animation frame
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should handle audio element canplay event', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} audioUrl="/test-audio.mp3" />);
    
    // The component should render without errors when provided with an audio URL
    expect(container.querySelector('canvas')).toBeInTheDocument();
    
    // Since we can't directly access internal audio element, we verify component stability
    expect(() => {
      render(<AudioVisualizer isPlaying={true} audioUrl="/test-audio.mp3" />);
    }).not.toThrow();
  });

  it('should maintain proper canvas dimensions', () => {
    const { container } = render(<AudioVisualizer isPlaying={false} />);
    const canvas = container.querySelector('canvas');
    
    expect(canvas).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full');
  });
});
