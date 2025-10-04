import { renderHook, act } from '@testing-library/react'
import { useCountdown } from '@/hooks/use-countdown'

describe('useCountdown', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.useFakeTimers()
    // Mock Date.now to return a consistent value
    jest.spyOn(Date, 'now').mockImplementation(() => 1000000)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('returns placeholder values when no target is provided', () => {
    const { result } = renderHook(() => useCountdown())

    expect(result.current.remaining).toBeUndefined()
    expect(result.current.formatted).toBe('--:--:--')
  })

  it('calculates remaining time correctly', () => {
    const targetTime = 1000000 + 3665000 // 1 hour, 1 minute, 5 seconds from now
    const { result } = renderHook(() => useCountdown(targetTime))

    expect(result.current.remaining).toBe(3665000)
    expect(result.current.formatted).toBe('01:01:05')
  })

  it('formats time correctly for different durations', () => {
    // Test various time formats
    const testCases = [
      { offset: 0, expected: '00:00:00' }, // No time left
      { offset: 1000, expected: '00:00:01' }, // 1 second
      { offset: 60000, expected: '00:01:00' }, // 1 minute
      { offset: 3600000, expected: '01:00:00' }, // 1 hour
      { offset: 3661000, expected: '01:01:01' }, // 1 hour, 1 minute, 1 second
      { offset: 86399000, expected: '23:59:59' }, // 23 hours, 59 minutes, 59 seconds
    ]

    testCases.forEach(({ offset, expected }, index) => {
      const targetTime = 1000000 + offset
      const { result } = renderHook(() => useCountdown(targetTime), {
        initialProps: { key: index } // Ensure fresh hook instance
      })

      expect(result.current.formatted).toBe(expected)
    })
  })

  it('calls onEnd callback when countdown reaches zero', () => {
    const onEnd = jest.fn()
    const targetTime = 1000000 + 2000 // 2 seconds from now

    const { result } = renderHook(() => useCountdown(targetTime, onEnd))

    // Fast-forward to just before the target time
    act(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 1500)
      jest.advanceTimersByTime(1000)
    })

    expect(onEnd).not.toHaveBeenCalled()

    // Fast-forward past the target time
    act(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 2500)
      jest.advanceTimersByTime(1000)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('only calls onEnd callback once even after multiple ticks', () => {
    const onEnd = jest.fn()
    const targetTime = 1000000 + 1000 // 1 second from now

    renderHook(() => useCountdown(targetTime, onEnd))

    // Fast-forward past the target time
    act(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 2000)
      jest.advanceTimersByTime(1000)
    })

    // Advance more timers to simulate additional ticks
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('updates remaining time as time progresses', () => {
    const targetTime = 1000000 + 5000 // 5 seconds from now
    const { result } = renderHook(() => useCountdown(targetTime))

    // Initial state
    expect(result.current.remaining).toBe(5000)
    expect(result.current.formatted).toBe('00:00:05')

    // After 1 second
    act(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 1000)
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.remaining).toBe(4000)
    expect(result.current.formatted).toBe('00:00:04')

    // After 3 more seconds
    act(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 4000)
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.remaining).toBe(1000)
    expect(result.current.formatted).toBe('00:00:01')
  })

  it('returns zero remaining time when past target time', () => {
    const targetTime = 1000000 - 1000 // 1 second in the past
    const { result } = renderHook(() => useCountdown(targetTime))

    expect(result.current.remaining).toBe(0)
    expect(result.current.formatted).toBe('00:00:00')
  })

  it('handles changing target time correctly', () => {
    const onEnd1 = jest.fn()
    const onEnd2 = jest.fn()
    
    const { result, rerender } = renderHook(
      (props: { target?: number; onEnd?: () => void }) => useCountdown(props.target, props.onEnd),
      {
        initialProps: { target: 1000000 + 3000, onEnd: onEnd1 }
      }
    )

    expect(result.current.remaining).toBe(3000)

    // Change target to a different time
    rerender({ target: 1000000 + 5000, onEnd: onEnd2 })

    expect(result.current.remaining).toBe(5000)
    expect(result.current.formatted).toBe('00:00:05')
  })

  it('cleans up timers when component unmounts', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const targetTime = 1000000 + 10000

    const { unmount } = renderHook(() => useCountdown(targetTime))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('handles undefined onEnd callback gracefully', () => {
    const targetTime = 1000000 + 1000

    expect(() => {
      const { result } = renderHook(() => useCountdown(targetTime, undefined))
      
      // Fast-forward past target time
      act(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 2000)
        jest.advanceTimersByTime(1000)
      })
    }).not.toThrow()
  })

  it('stops ticking after countdown ends', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    const targetTime = 1000000 + 1000

    renderHook(() => useCountdown(targetTime))

    // Clear the spy calls from initial setup
    setTimeoutSpy.mockClear()

    // Fast-forward past target time
    act(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1000000 + 2000)
      jest.advanceTimersByTime(1000)
    })

    // Clear the spy again and advance more time
    setTimeoutSpy.mockClear()
    
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Should not schedule any more timeouts after countdown ends
    expect(setTimeoutSpy).not.toHaveBeenCalled()
  })
})
