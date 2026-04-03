export interface SlotConfig {
  duration?: number
  raffles?: number
  special?: string
}

export interface Slot extends SlotConfig {
  border: number
  borderBrightness: number
  duration: number
  height: number
  hour: number
  index: number
  minute: number
  roundness: number
}

export type TimeFormat = '24h' | '12h'

export interface SlotProps {
  slot: Slot
}
