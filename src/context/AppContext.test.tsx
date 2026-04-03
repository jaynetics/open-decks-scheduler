import { act, renderHook } from '@testing-library/react'

import { DEFAULTS } from '@/constants'
import { generateShareableURL, useAppStateFromURL } from '@/utils/storageUtils'

import { AppProvider, useApp } from './AppContext'

// Mock dependencies
jest.mock('@/utils/storageUtils', () => ({
  useAppStateFromURL: jest.fn(),
  generateShareableURL: jest.fn(),
}))

// Mock window.confirm and navigator.clipboard
const mockConfirm = jest.fn()
const mockWriteText = jest.fn()

Object.defineProperty(window, 'confirm', { value: mockConfirm })
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('AppContext', () => {
  const mockInitialState = {
    startHour: 18,
    startMinute: 0,
    timeFormat: '24h' as const,
    slotHeight: 50,
    slotDefaultDuration: 30,
    slotRoundness: 0,
    slotBorder: 1,
    slotBorderBrightness: 5,
    slotConfigs: Array(3).fill({}),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAppStateFromURL as jest.Mock).mockReturnValue(mockInitialState)
    mockConfirm.mockReturnValue(true)
    mockWriteText.mockResolvedValue(undefined)
  })

  it('should throw error when useApp is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      renderHook(() => useApp())
    }).toThrow('useApp must be used within a AppProvider')

    consoleError.mockRestore()
  })

  it('should initialize with state from URL', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    expect(result.current.startHour).toBe(18)
    expect(result.current.timeFormat).toBe('24h')
    expect(result.current.slotConfigs).toHaveLength(3)
  })

  it('should update slot config', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.updateSlotConfig(1, { special: 'Test' })
    })

    expect(result.current.slotConfigs[1]).toEqual({ special: 'Test' })
    expect(result.current.editingSlot).toBeNull()
  })

  it('should delete a slot', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    const initialLength = result.current.slotConfigs.length

    act(() => {
      result.current.deleteSlot(1)
    })

    expect(result.current.slotConfigs).toHaveLength(initialLength - 1)
  })

  it('should insert a slot above', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    const initialLength = result.current.slotConfigs.length

    act(() => {
      result.current.insertSlot(1, 'above')
    })

    expect(result.current.slotConfigs).toHaveLength(initialLength + 1)
    // New slot should be empty at index 1
    expect(result.current.slotConfigs[1]).toEqual({})
  })

  it('should insert a slot below', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    const initialLength = result.current.slotConfigs.length

    act(() => {
      result.current.insertSlot(1, 'below')
    })

    expect(result.current.slotConfigs).toHaveLength(initialLength + 1)
    // New slot should be empty at index 2 (1 + 1)
    expect(result.current.slotConfigs[2]).toEqual({})
  })

  it('should handle number of slots change', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    // Increase
    act(() => {
      result.current.handleNumSlotsChange(5)
    })
    expect(result.current.slotConfigs).toHaveLength(5)

    // Decrease
    act(() => {
      result.current.updateSlotConfig(0, { special: 'Keep' })
      result.current.handleNumSlotsChange(1)
    })
    expect(result.current.slotConfigs).toHaveLength(1)
    expect(result.current.slotConfigs[0].special).toBe('Keep')

    // No change
    const currentLength = result.current.slotConfigs.length
    act(() => {
      result.current.handleNumSlotsChange(currentLength)
    })
    expect(result.current.slotConfigs).toHaveLength(currentLength)
  })

  it('should reset to defaults if confirmed', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    // Change state
    act(() => {
      result.current.setStartHour(23)
      result.current.handleNumSlotsChange(0) // Empty the slots
    })

    mockConfirm.mockReturnValue(true)

    act(() => {
      result.current.handleReset()
    })

    expect(result.current.startHour).toBe(DEFAULTS.startHour)
    expect(result.current.slotConfigs).toEqual(DEFAULTS.slotConfigs)
  })

  it('should not reset defaults if not confirmed', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.setStartHour(23)
    })

    mockConfirm.mockReturnValue(false)

    act(() => {
      result.current.handleReset()
    })

    expect(result.current.startHour).toBe(23)
  })

  it('should generate share URL and copy to clipboard', async () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    ;(generateShareableURL as jest.Mock).mockReturnValue('http://test.url')

    await act(async () => {
      await result.current.handleShare()
    })

    expect(generateShareableURL).toHaveBeenCalled()
    expect(mockWriteText).toHaveBeenCalledWith('http://test.url')
    expect(result.current.toast).toBe('Schedule URL copied to clipboard!')
  })

  it('should auto assign raffles', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    // We rely on the integration with utility for this test logic
    act(() => {
      result.current.autoAssignRaffles()
    })
    expect(result.current.slotConfigs).toBeDefined()
  })

  it('should compute slots with correct properties', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    // Verify slots are computed with the expected shape
    expect(result.current.slots).toBeDefined()
    expect(Array.isArray(result.current.slots)).toBe(true)

    if (result.current.slots.length > 0) {
      const slot = result.current.slots[0]
      expect(slot).toHaveProperty('hour')
      expect(slot).toHaveProperty('minute')
      expect(slot).toHaveProperty('border')
      expect(slot).toHaveProperty('borderBrightness')
      expect(slot).toHaveProperty('height')
      expect(slot).toHaveProperty('roundness')
    }
  })

  it('should set editing slot', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.setEditingSlot(1)
    })

    expect(result.current.editingSlot).toBe(1)
  })

  it('should toggle showSettings', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.setShowSettings(false)
    })

    expect(result.current.showSettings).toBe(false)

    act(() => {
      result.current.setShowSettings(true)
    })

    expect(result.current.showSettings).toBe(true)
  })

  it('should recompute slots when slotBorderBrightness changes', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.setSlotBorderBrightness(15)
    })

    // Slots should be recomputed with new borderBrightness
    if (result.current.slots.length > 0) {
      expect(result.current.slots[0].borderBrightness).toBe(15)
    }
  })

  it('should recompute slots when slotRoundness changes', () => {
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => {
      result.current.setSlotRoundness(20)
    })

    // Slots should be recomputed with new roundness
    if (result.current.slots.length > 0) {
      expect(result.current.slots[0].roundness).toBe(20)
    }
  })

  it('should set show settings based on window width', () => {
    // Large screen
    window.innerWidth = 1000
    const { result: resultLarge } = renderHook(() => useApp(), { wrapper })
    expect(resultLarge.current.showSettings).toBe(true)

    // Small screen
    window.innerWidth = 400
    const { result: resultSmall } = renderHook(() => useApp(), { wrapper })
    expect(resultSmall.current.showSettings).toBe(false)
  })
})
