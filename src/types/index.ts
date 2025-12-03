import React from 'react'

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

export interface RaffleWarning {
  hasWarning: boolean
  nonSpecialSlots: number
  totalRaffles: number
}

export type TimeFormat = '24h' | '12h'

export interface SlotEditorProps {
  onClose: () => void
  onDelete: (index: number) => void
  onInsert: (index: number, position: 'above' | 'below') => void
  onSave: (index: number, config: SlotConfig) => void
  slot: Slot
  slotIndex: number
  timeFormat: TimeFormat
}

export interface SlotProps {
  onEdit?: () => void
  slot: Slot
  timeFormat: TimeFormat
}

export interface SidebarProps {
  numSlots: number
  onAutoAssignRaffles: () => void
  onSlotDefaultDurationChange: (value: number) => void
  onHideSettings: () => void
  onNumSlotsChange: (value: number) => void
  onPrint: () => void
  onReset: () => void
  onShare: () => void
  onSlotBorderChange: (value: number) => void
  onSlotBorderBrightnessChange: (value: number) => void
  onSlotHeightChange: (value: number) => void
  onSlotRoundnessChange: (value: number) => void
  onStartHourChange: (value: number) => void
  onStartMinuteChange: (value: number) => void
  onTimeFormatChange: (format: TimeFormat) => void
  raffleWarning?: React.ReactNode
  slotBorder: number
  slotBorderBrightness: number
  slotDefaultDuration: number
  slotHeight: number
  slotRoundness: number
  startHour: number
  startMinute: number
  timeFormat: TimeFormat
}
