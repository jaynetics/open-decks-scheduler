import { parseIntOrZero } from './numberUtils'

describe('numberUtils', () => {
  describe('parseIntOrZero', () => {
    it('should parse valid integer strings', () => {
      expect(parseIntOrZero('42')).toBe(42)
      expect(parseIntOrZero('0')).toBe(0)
      expect(parseIntOrZero('-10')).toBe(-10)
    })

    it('should parse floating point strings to integers', () => {
      expect(parseIntOrZero('3.14')).toBe(3)
      expect(parseIntOrZero('9.99')).toBe(9)
      expect(parseIntOrZero('-5.5')).toBe(-5)
    })

    it('should return 0 for invalid strings', () => {
      expect(parseIntOrZero('')).toBe(0)
      expect(parseIntOrZero('abc')).toBe(0)
      expect(parseIntOrZero('abc12')).toBe(0)
      expect(parseIntOrZero('12abc')).toBe(12)
    })
  })
})
