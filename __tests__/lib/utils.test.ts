import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('bg-red-500', 'text-white', 'p-4')
      expect(result).toBe('bg-red-500 text-white p-4')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toBe('base-class conditional-class')
    })

    it('handles Tailwind class conflicts', () => {
      const result = cn('p-4', 'p-6')
      expect(result).toBe('p-6') // Later class should win
    })

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })
  })
})
