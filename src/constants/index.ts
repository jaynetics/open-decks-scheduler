import { TimeFormat } from '@/types'

const DEFAULT_SLOT_COUNT = 14

export const DEFAULTS = {
  slotBorder: 2,
  slotBorderBrightness: 9,
  slotConfigs: Array.from({ length: DEFAULT_SLOT_COUNT }, () => ({})),
  slotDefaultDuration: 20, // minutes
  slotHeight: 44, // mm
  slotRoundness: 0,
  startHour: 18,
  startMinute: 20,
  timeFormat: '24h' as TimeFormat,
}

export const MM_TO_REM_RATIO = 5.4 // Conversion ratio for screen display
