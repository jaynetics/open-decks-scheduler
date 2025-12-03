import { SlotConfig } from '@/types'

import { autoAssignRaffles } from './raffleUtils'

describe('raffleUtils', () => {
  describe('autoAssignRaffles', () => {
    it('should add raffles to odd number of non-special slots with 3x last', () => {
      const slotConfigs: SlotConfig[] = [{}, {}, {}, {}, {}]

      const result = autoAssignRaffles(slotConfigs)

      // For 5 slots: (5-1)/2 = 2 raffles
      // First slot always gets 2x
      expect(result[0].raffles).toBe(2)
      // Last raffle should be 3x
      expect(result[1].raffles).toBe(3)
      // Others should not have raffles
      expect(result[2].raffles).toBeUndefined()
      expect(result[3].raffles).toBeUndefined()
      expect(result[4].raffles).toBeUndefined()
    })

    it('should add raffles to even number of non-special slots', () => {
      const slotConfigs: SlotConfig[] = [{}, {}, {}, {}]

      const result = autoAssignRaffles(slotConfigs)

      // For 4 slots: 4/2 = 2 raffles, all 2x
      expect(result[0].raffles).toBe(2)
      expect(result[1].raffles).toBe(2)
      expect(result[2].raffles).toBeUndefined()
      expect(result[3].raffles).toBeUndefined()
    })

    it('should skip special slots when distributing raffles', () => {
      const slotConfigs: SlotConfig[] = [{}, { special: 'Featured DJ' }, {}, {}, {}]

      const result = autoAssignRaffles(slotConfigs)

      // 4 non-special slots (even): 2 raffles
      expect(result[0].raffles).toBe(2)
      expect(result[1].raffles).toBeUndefined() // Special slot
      expect(result[2].raffles).toBe(2)
      expect(result[3].raffles).toBeUndefined()
      expect(result[4].raffles).toBeUndefined()
    })

    it('should clear existing raffles before redistributing', () => {
      const slotConfigs: SlotConfig[] = [{ raffles: 5 }, { raffles: 3 }, { raffles: 2 }]

      const result = autoAssignRaffles(slotConfigs)

      // For 3 slots (odd): (3-1)/2 = 1 raffle
      // First slot always gets 2x
      expect(result[0].raffles).toBe(2)
      expect(result[1].raffles).toBeUndefined()
      expect(result[2].raffles).toBeUndefined()
    })

    it('should handle single non-special slot', () => {
      const slotConfigs: SlotConfig[] = [{}]

      const result = autoAssignRaffles(slotConfigs)

      // Single slot (odd): (1-1)/2 = 0 raffles, but first slot always gets one
      expect(result[0].raffles).toBe(2)
    })

    it('should handle all special slots', () => {
      const slotConfigs: SlotConfig[] = [{ special: 'DJ 1' }, { special: 'DJ 2' }]

      const result = autoAssignRaffles(slotConfigs)

      expect(result[0].raffles).toBeUndefined()
      expect(result[1].raffles).toBeUndefined()
    })

    it('should handle empty array', () => {
      const slotConfigs: SlotConfig[] = []

      const result = autoAssignRaffles(slotConfigs)

      expect(result).toEqual([])
    })

    it('should preserve special content while clearing raffles', () => {
      const slotConfigs: SlotConfig[] = [{ special: 'Featured DJ', raffles: 2 }, { raffles: 3 }]

      const result = autoAssignRaffles(slotConfigs)

      expect(result[0].special).toBe('Featured DJ')
      expect(result[0].raffles).toBeUndefined()
      expect(result[1].raffles).toBe(2) // Single non-special slot always gets 2x
    })

    it('should handle 7 non-special slots correctly', () => {
      const slotConfigs: SlotConfig[] = [{}, {}, {}, {}, {}, {}, {}]

      const result = autoAssignRaffles(slotConfigs)

      // For 7 slots (odd): (7-1)/2 = 3 raffles
      expect(result[0].raffles).toBe(2) // First slot
      expect(result[1].raffles).toBe(2) // Second raffle
      expect(result[2].raffles).toBeUndefined()
      expect(result[3].raffles).toBe(3) // Last raffle is 3x
      expect(result[4].raffles).toBeUndefined()
      expect(result[5].raffles).toBeUndefined()
      expect(result[6].raffles).toBeUndefined()
    })
  })
})
