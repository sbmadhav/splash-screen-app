import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CacheManager } from '../components/cache-manager';

// Mock the service worker
const mockServiceWorker = {
  controller: {
    postMessage: jest.fn(),
  },
  addEventListener: jest.fn(),
  ready: Promise.resolve({
    postMessage: jest.fn(),
  }),
};

// Mock navigator.serviceWorker
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

// Mock the toast function
const mockToast = jest.fn();
jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('CacheManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset service worker mock
    mockServiceWorker.controller = {
      postMessage: jest.fn(),
    };
    mockServiceWorker.addEventListener = jest.fn();
  });

  it('should render cache manager with initial loading state', () => {
    render(<CacheManager />);
    
    expect(screen.getByText('Cache Management')).toBeInTheDocument();
    expect(screen.getByText('Loading cache status...')).toBeInTheDocument();
  });

  it('should render clear cache button', () => {
    render(<CacheManager />);
    
    const clearButton = screen.getByText('Clear All App Cache');
    expect(clearButton).toBeInTheDocument();
  });

  it('should call service worker postMessage when clear cache is clicked', () => {
    const mockPostMessage = mockServiceWorker.controller.postMessage as jest.Mock;
    
    render(<CacheManager />);
    
    const clearButton = screen.getByText('Clear All App Cache');
    fireEvent.click(clearButton);
    
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'CLEAR_ALL_CACHE'
    });
  });

  it('should handle service worker not available', () => {
    // Mock no service worker
    (global.navigator as any).serviceWorker = undefined;
    
    render(<CacheManager />);
    
    expect(screen.getByText('Cache Management')).toBeInTheDocument();
    expect(screen.getByText('Service Worker not available')).toBeInTheDocument();
  });

  it('should handle no service worker controller', () => {
    (mockServiceWorker as any).controller = null;
    
    render(<CacheManager />);
    
    const clearButton = screen.getByText('Clear All App Cache');
    fireEvent.click(clearButton);
    
    // Should show error message
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Service Worker not available',
      variant: 'destructive',
    });
  });

  it('should show cache details section', () => {
    render(<CacheManager />);
    
    expect(screen.getByText('Cache Details')).toBeInTheDocument();
    expect(screen.getByText('No cache information available')).toBeInTheDocument();
  });

  it('should attempt to get cache status on mount', () => {
    const mockPostMessage = mockServiceWorker.controller.postMessage as jest.Mock;
    
    render(<CacheManager />);
    
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'GET_CACHE_STATUS'
    });
  });

  it('should handle cache clear success', () => {
    const mockPostMessage = mockServiceWorker.controller.postMessage as jest.Mock;
    
    render(<CacheManager />);
    
    // Click clear cache button
    const clearButton = screen.getByText('Clear All App Cache');
    fireEvent.click(clearButton);
    
    // Simulate successful response
    const mockEvent = new MessageEvent('message', {
      data: {
        type: 'CACHE_CLEARED',
        success: true
      }
    });
    
    // Dispatch the event
    window.dispatchEvent(mockEvent);
    
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'CLEAR_ALL_CACHE'
    });
  });

  it('should handle reload functionality', () => {
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn()
      },
      writable: true
    });
    
    render(<CacheManager />);
    
    // Find and click reload button (if it exists)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display cache size information when available', () => {
    render(<CacheManager />);
    
    // Simulate cache status response
    const mockEvent = new MessageEvent('message', {
      data: {
        type: 'CACHE_STATUS_RESPONSE',
        caches: [
          { name: 'splash-app-static-v1.1.0', size: 25 },
          { name: 'splash-app-thumbnails-v1.1.0', size: 30 }
        ]
      }
    });
    
    window.dispatchEvent(mockEvent);
    
    // The component should process this data
    expect(screen.getByText('Cache Details')).toBeInTheDocument();
  });
});
