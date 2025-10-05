import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OfflineImageSelector } from '@/components/offline-image-selector'

// Mock the static-utils module
jest.mock('@/lib/static-utils', () => ({
  getBasePath: jest.fn(() => '/splash-screen-app')
}))

// Mock Image constructor to avoid loading actual images in tests
global.Image = class {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  src = ''
  
  constructor() {
    // Simulate successful image load after a short delay
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 10)
  }
} as any

describe('OfflineImageSelector', () => {
  const mockOnImageSelect = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders offline image grid', () => {
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Should display the heading
    expect(screen.getByText('Offline Images')).toBeInTheDocument()
    
    // Should display image cards
    expect(screen.getByText('Sunny Beach')).toBeInTheDocument()
    expect(screen.getByText('Tropical Beach')).toBeInTheDocument()
    expect(screen.getByText('Spring City')).toBeInTheDocument()
  })

  it('uses correct image paths with base path for GitHub Pages', () => {
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Get the first image
    const images = screen.getAllByRole('img')
    const firstImage = images[0]
    
    // Should use the thumbnail WebP version with base path
    expect(firstImage.getAttribute('src')).toBe('/splash-screen-app/background/thumbnails/Beach-Summer.webp')
  })

  it('calls onImageSelect when image is clicked', async () => {
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Click on the first image card (clickable div with cursor-pointer class)
    const imageCard = screen.getByAltText('Sunny Beach').closest('.cursor-pointer')
    expect(imageCard).toBeInTheDocument()
    
    fireEvent.click(imageCard!)
    
    // Should call onImageSelect with the correct image name
    expect(mockOnImageSelect).toHaveBeenCalledWith('Beach-Summer.jpg')
  })

  it('highlights selected image', async () => {
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} selectedImage="Beach-Summer2.jpg" />)
    
    // Find the selected image card
    const selectedCard = screen.getByAltText('Tropical Beach').closest('.cursor-pointer')
    
    // Should have selected styling (ring-2 class)
    expect(selectedCard).toHaveClass('ring-2')
  })

  it('shows correct image titles and locations', () => {
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Check that titles and locations are displayed
    expect(screen.getByText('Sunny Beach')).toBeInTheDocument()
    expect(screen.getByText('Beach Paradise')).toBeInTheDocument()
    
    expect(screen.getByText('Spring City')).toBeInTheDocument()
    expect(screen.getByText('Urban Landscape')).toBeInTheDocument()
  })

  it('renders all available offline images', () => {
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Should render all 29 offline images (the actual count in LOCAL_IMAGES array)
    const imageCards = screen.getAllByRole('img')
    expect(imageCards).toHaveLength(29)
  })

  it('handles image loading errors gracefully', () => {
    // Override Image mock to simulate error
    global.Image = class {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      src = ''
      
      constructor() {
        // Simulate image load error
        setTimeout(() => {
          if (this.onerror) this.onerror()
        }, 10)
      }
    } as any

    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Component should still render without crashing
    expect(screen.getByText('Offline Images')).toBeInTheDocument()
  })

  it('works correctly in development environment', () => {
    // Mock getBasePath to return empty string for development
    const { getBasePath } = require('@/lib/static-utils')
    getBasePath.mockReturnValue('')
    
    render(<OfflineImageSelector onImageSelect={mockOnImageSelect} />)
    
    // Get the first image
    const images = screen.getAllByRole('img')
    const firstImage = images[0]
    
    // Should use relative path for development with thumbnail WebP
    expect(firstImage.getAttribute('src')).toBe('/background/thumbnails/Beach-Summer.webp')
  })

  it('applies correct theme styling', () => {
    const { rerender } = render(<OfflineImageSelector onImageSelect={mockOnImageSelect} theme="light" />)
    
    // Check for light theme styling - look for the card title
    const title = screen.getByText('Offline Images')
    expect(title).toHaveClass('text-gray-900')
    
    // Test dark theme
    rerender(<OfflineImageSelector onImageSelect={mockOnImageSelect} theme="dark" />)
    
    const darkTitle = screen.getByText('Offline Images')
    expect(darkTitle).toHaveClass('text-white')
  })
})
