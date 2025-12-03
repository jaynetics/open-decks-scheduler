import { SlotConfig, TimeFormat } from '@/types'

export function calculateSlotTimes(
  slotConfigs: SlotConfig[],
  slotDefaultDuration: number,
  startHour: number,
  startMinute: number
) {
  const time = new Date(2000, 1, 1, startHour, startMinute)

  return slotConfigs.map((config, index) => {
    const hour = time.getHours()
    const minute = time.getMinutes()

    // Update time with duration of slot for next slot
    const duration = config.duration ?? slotDefaultDuration
    time.setMinutes(time.getMinutes() + duration)

    return {
      duration,
      hour,
      minute,
      index,
      ...config,
    }
  })
}

export function formatTime(hour: number, minute: number, format: TimeFormat = '24h'): string {
  if (format === '12h') {
    // Convert to 12-hour format without AM/PM
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
