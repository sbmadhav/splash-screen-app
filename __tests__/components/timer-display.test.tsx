import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { TimerDisplay } from '@/components/timer-display'

describe('TimerDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    localStorage.clear()
    localStorage.setItem('appSettings', JSON.stringify({
      showTimer: true,
      timerMinutes: 5,
      timerTitle: 'Focus time',
      theme: 'dark',
    }))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders timer when showTimer is true', async () => {
    render(<TimerDisplay />)
    
    await waitFor(() => {
      expect(screen.getByText('Ready to start')).toBeInTheDocument()
      expect(screen.getByText('05:00')).toBeInTheDocument()
    })
  })

  it('does not render when showTimer is false', async () => {
    localStorage.setItem('appSettings', JSON.stringify({
      showTimer: false,
    }))

    render(<TimerDisplay />)
    
    expect(screen.queryByText('Focus time')).not.toBeInTheDocument()
  })

  it('starts countdown when start button is clicked', async () => {
    render(<TimerDisplay />)
    
    const startButton = screen.getByText('Start')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText('Pause')).toBeInTheDocument()
      expect(screen.getByText('Focus time')).toBeInTheDocument()
    })

    // Fast forward 1 second
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(screen.getByText('04:59')).toBeInTheDocument()
    })
  })

  it('pauses timer when pause button is clicked', async () => {
    render(<TimerDisplay />)
    
    const startButton = screen.getByText('Start')
    fireEvent.click(startButton)

    await waitFor(() => {
      const pauseButton = screen.getByText('Pause')
      fireEvent.click(pauseButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Start')).toBeInTheDocument()
      expect(screen.getByText('Ready to start')).toBeInTheDocument()
    })
  })

  it('resets timer when reset button is clicked', async () => {
    render(<TimerDisplay />)
    
    const startButton = screen.getByText('Start')
    fireEvent.click(startButton)

    await act(async () => {
      jest.advanceTimersByTime(10000) // 10 seconds
    })

    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(screen.getByText('05:00')).toBeInTheDocument()
      expect(screen.getByText('Start')).toBeInTheDocument()
    })
  })

  it('broadcasts timer state changes', async () => {
    const eventSpy = jest.spyOn(window, 'dispatchEvent')
    
    render(<TimerDisplay />)
    
    const startButton = screen.getByText('Start')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'timerStateChanged',
          detail: expect.objectContaining({
            isFinished: false
          })
        })
      )
    })
  })
})
