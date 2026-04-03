import React from 'react'

import { RenderOptions, render } from '@testing-library/react'

import { AppProvider } from '@/context/AppContext'
import { Slot } from '@/types'

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppProvider>{children}</AppProvider>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): ReturnType<typeof render> => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }

export const createMockSlot = (overrides: Partial<Slot> = {}): Slot => ({
  index: 0,
  hour: 18,
  minute: 20,
  duration: 20,
  border: 1,
  borderBrightness: 5,
  height: 50,
  roundness: 5,
  special: '',
  raffles: 0,
  ...overrides,
})

export const createMockAppContext = (overrides: Record<string, unknown> = {}) => ({
  slotConfigs: Array(14).fill({}),
  autoAssignRaffles: jest.fn(),
  setSlotDefaultDuration: jest.fn(),
  setShowSettings: jest.fn(),
  handleNumSlotsChange: jest.fn(),
  handleReset: jest.fn(),
  handleShare: jest.fn(),
  setSlotBorder: jest.fn(),
  setSlotBorderBrightness: jest.fn(),
  setSlotHeight: jest.fn(),
  setSlotRoundness: jest.fn(),
  setStartHour: jest.fn(),
  setStartMinute: jest.fn(),
  setTimeFormat: jest.fn(),
  setEditingSlot: jest.fn(),
  updateSlotConfig: jest.fn(),
  deleteSlot: jest.fn(),
  insertSlot: jest.fn(),
  slots: [] as Slot[],
  editingSlot: null as number | null,
  slotBorder: 2,
  slotBorderBrightness: 9,
  slotDefaultDuration: 20,
  slotHeight: 40,
  slotRoundness: 0,
  startHour: 18,
  startMinute: 20,
  timeFormat: '24h' as const,
  showSettings: true,
  toast: null as string | null,
  ...overrides,
})
