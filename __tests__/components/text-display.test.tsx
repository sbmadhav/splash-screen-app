import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TextDisplay } from '@/components/text-display'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('TextDisplay', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    
    // Mock default settings
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      showText: false,
      textToShow: "We'll be starting soon!",
      enableHeadingAnimation: false,
      theme: 'system',
      hideHeaderWhenFinished: false,
      showTimer: false,
    }))
  })

  it('does not render text when showText is false (default)', async () => {
    render(<TextDisplay />)
    
    await waitFor(() => {
      expect(screen.queryByText("We'll be starting soon!")).not.toBeInTheDocument()
    })
  })

  it('renders text when showText is true', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      showText: true,
      textToShow: "We'll be starting soon!",
    }))

    render(<TextDisplay />)
    
    await waitFor(() => {
      expect(screen.getByText("We'll be starting soon!")).toBeInTheDocument()
    })
  })

  it('hides text when timer is finished and hideHeaderWhenFinished is true', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      showText: true,
      textToShow: "We'll be starting soon!",
      hideHeaderWhenFinished: true,
      showTimer: true, // Need to enable timer for the hide logic to work
    }))

    render(<TextDisplay />)

    // Initially text should be visible
    expect(screen.getByText("We'll be starting soon!")).toBeInTheDocument()

    // Simulate timer finished event
    fireEvent(window, new CustomEvent('timerStateChanged', {
      detail: { isFinished: true }
    }))

    await waitFor(() => {
      // Component should return null, so text should not be in the document
      expect(screen.queryByText("We'll be starting soon!")).not.toBeInTheDocument()
    })
  })

  it('responds to settings changes', async () => {
    render(<TextDisplay />)

    // Simulate settings change
    fireEvent(window, new CustomEvent('settingsChanged', {
      detail: {
        showText: true,
        textToShow: "New text content",
      }
    }))

    await waitFor(() => {
      expect(screen.getByText("New text content")).toBeInTheDocument()
    })
  })

  it('applies correct theme styles', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      showText: true,
      textToShow: "Test text",
      theme: 'light',
    }))

    render(<TextDisplay />)

    await waitFor(() => {
      const textElement = screen.getByText("Test text")
      expect(textElement).toHaveStyle({ color: '#374151' })
    })
  })
})
