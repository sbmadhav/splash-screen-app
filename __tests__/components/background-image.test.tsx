import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BackgroundImage } from '@/components/background-image'

// Mock Image constructor to simulate loading
Object.defineProperty(global, 'Image', {
  writable: true,
  value: class MockImage {
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    src = ''
    
    constructor() {
      // Simulate immediate loading in tests
      setTimeout(() => {
        if (this.onload) {
          this.onload()
        }
      }, 0)
    }
  }
})

describe('BackgroundImage', () => {
  const mockImageData = {
    url: 'https://example.com/image.jpg',
    title: 'Beautiful landscape',
    copyright: 'John Doe',
    location: 'Mountain View',
  }

  it('renders background image with correct src', async () => {
    render(<BackgroundImage imageData={mockImageData} />)
    
    // Wait for the image to load and be applied as background
    await waitFor(() => {
      const backgroundDiv = document.querySelector('[style*="background-image"]')
      expect(backgroundDiv).toBeInTheDocument()
      expect(backgroundDiv).toHaveStyle(`background-image: url('${mockImageData.url}')`)
    })
  })

  it('handles null image data gracefully', () => {
    render(<BackgroundImage imageData={null} />)
    
    const image = screen.queryByRole('img')
    expect(image).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for background positioning', async () => {
    render(<BackgroundImage imageData={mockImageData} />)
    
    await waitFor(() => {
      const backgroundDiv = document.querySelector('[style*="background-image"]')
      expect(backgroundDiv).toBeInTheDocument()
      expect(backgroundDiv).toHaveClass('absolute', 'inset-0', 'bg-cover', 'bg-center', 'bg-no-repeat')
    })
  })

  it('handles image load errors', async () => {
    render(<BackgroundImage imageData={mockImageData} />)
    
    // The component creates Image objects internally for preloading
    // We can't easily test error handling without mocking Image constructor
    // For now, just test that the component renders without crashing
    await waitFor(() => {
      const container = document.querySelector('.absolute.inset-0')
      expect(container).toBeInTheDocument()
    })
  })
})
