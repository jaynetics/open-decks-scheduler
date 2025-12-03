import { SlotConfig } from '@/types'

import { calculateSlotTimes, formatTime } from './timeUtils'

describe('timeUtils', () => {
  describe('calculateSlotTimes', () => {
    it('should calculate slot times correctly', () => {
      const slotConfigs: SlotConfig[] = [{}, { special: 'Featured DJ' }, { raffles: 2 }]
      const slotDefaultDuration = 20
      const startHour = 18
      const startMinute = 20

      const result = calculateSlotTimes(slotConfigs, slotDefaultDuration, startHour, startMinute)

      expect(result).toHaveLength(3)
      expect(result[0].hour).toBe(18)
      expect(result[0].minute).toBe(20)
      expect(result[1].hour).toBe(18)
      expect(result[1].minute).toBe(40)
      expect(result[2].hour).toBe(19)
      expect(result[2].minute).toBe(0)
    })

    it('should handle custom durations', () => {
      const slotConfigs: SlotConfig[] = [{ duration: 30 }, { duration: 15 }, {}]
      const slotDefaultDuration = 20
      const startHour = 10
      const startMinute = 0

      const result = calculateSlotTimes(slotConfigs, slotDefaultDuration, startHour, startMinute)

      expect(result[0].hour).toBe(10)
      expect(result[0].minute).toBe(0)
      expect(result[0].duration).toBe(30)
      expect(result[1].hour).toBe(10)
      expect(result[1].minute).toBe(30)
      expect(result[1].duration).toBe(15)
      expect(result[2].hour).toBe(10)
      expect(result[2].minute).toBe(45)
      expect(result[2].duration).toBe(20)
    })

    it('should handle time rollover past midnight', () => {
      const slotConfigs: SlotConfig[] = [{}, {}]
      const slotDefaultDuration = 60
      const startHour = 23
      const startMinute = 30

      const result = calculateSlotTimes(slotConfigs, slotDefaultDuration, startHour, startMinute)

      expect(result[0].hour).toBe(23)
      expect(result[0].minute).toBe(30)
      expect(result[1].hour).toBe(0)
      expect(result[1].minute).toBe(30)
    })

    it('should set correct index for each slot', () => {
      const slotConfigs: SlotConfig[] = [{}, {}, {}]
      const slotDefaultDuration = 20
      const startHour = 18
      const startMinute = 20

      const result = calculateSlotTimes(slotConfigs, slotDefaultDuration, startHour, startMinute)

      expect(result[0].index).toBe(0)
      expect(result[1].index).toBe(1)
      expect(result[2].index).toBe(2)
    })

    it('should preserve slot config properties', () => {
      const slotConfigs: SlotConfig[] = [{ special: 'DJ Test', raffles: 2 }]
      const slotDefaultDuration = 20
      const startHour = 18
      const startMinute = 20

      const result = calculateSlotTimes(slotConfigs, slotDefaultDuration, startHour, startMinute)

      expect(result[0].special).toBe('DJ Test')
      expect(result[0].raffles).toBe(2)
    })
  })

  describe('formatTime', () => {
    it('should pad single digit hours and minutes', () => {
      expect(formatTime(5, 9)).toBe('05:09')
    })

    it('should not pad double digit hours and minutes', () => {
      expect(formatTime(12, 30)).toBe('12:30')
    })

    it('should handle hour 0', () => {
      expect(formatTime(0, 0)).toBe('00:00')
    })

    describe('12-hour format', () => {
      it('should convert midnight (0:00) to 12:00', () => {
        expect(formatTime(0, 0, '12h')).toBe('12:00')
      })

      it('should keep morning hours (1-11) as is', () => {
        expect(formatTime(9, 30, '12h')).toBe('09:30')
        expect(formatTime(11, 45, '12h')).toBe('11:45')
      })

      it('should keep noon (12:00) as 12:00', () => {
        expect(formatTime(12, 0, '12h')).toBe('12:00')
      })

      it('should convert afternoon/evening hours (13-23)', () => {
        expect(formatTime(13, 0, '12h')).toBe('01:00')
        expect(formatTime(18, 30, '12h')).toBe('06:30')
        expect(formatTime(23, 59, '12h')).toBe('11:59')
      })

      it('should pad single digits in 12h format', () => {
        expect(formatTime(1, 5, '12h')).toBe('01:05')
        expect(formatTime(13, 5, '12h')).toBe('01:05')
      })
    })
  })
})
