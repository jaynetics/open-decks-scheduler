import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { DEFAULTS } from '@/constants'
import { SlotConfig, Slot as SlotType, TimeFormat } from '@/types'
import { autoAssignRaffles as autoAssignRafflesUtil } from '@/utils/raffleUtils'
import { generateShareableURL, useAppStateFromURL } from '@/utils/storageUtils'
import { calculateSlotTimes } from '@/utils/timeUtils'

const useAppLogic = () => {
  // Load saved state from URL hash on mount
  const initialState = useAppStateFromURL()

  const [startHour, setStartHour] = useState(initialState.startHour)
  const [startMinute, setStartMinute] = useState(initialState.startMinute)
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(initialState.timeFormat)
  const [slotHeight, setSlotHeight] = useState(initialState.slotHeight)
  const [slotDefaultDuration, setSlotDefaultDuration] = useState(initialState.slotDefaultDuration)
  const [slotRoundness, setSlotRoundness] = useState(initialState.slotRoundness)
  const [slotBorder, setSlotBorder] = useState(initialState.slotBorder)
  const [slotBorderBrightness, setSlotBorderBrightness] = useState(
    initialState.slotBorderBrightness
  )
  const [showSettings, setShowSettings] = useState(true)
  const [slotConfigs, setSlotConfigs] = useState<SlotConfig[]>(initialState.slotConfigs)
  const [editingSlot, setEditingSlot] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Hide settings sidebar on small screens initially (only if not loaded from saved state)
  useEffect(() => {
    setShowSettings(window.innerWidth > 500)
  }, [])

  const slots: SlotType[] = useMemo(() => {
    const slotsWithTimes = calculateSlotTimes(
      slotConfigs,
      slotDefaultDuration,
      startHour,
      startMinute
    )
    return slotsWithTimes.map((slot) => ({
      ...slot,
      border: slotBorder,
      borderBrightness: slotBorderBrightness,
      height: slotHeight,
      roundness: slotRoundness,
    }))
  }, [
    slotBorder,
    slotBorderBrightness,
    slotConfigs,
    slotDefaultDuration,
    slotHeight,
    slotRoundness,
    startHour,
    startMinute,
  ])

  const updateSlotConfig = (index: number, config: SlotConfig) => {
    setSlotConfigs((prev) => {
      const newConfigs = [...prev]
      newConfigs[index] = config
      return newConfigs
    })
    setEditingSlot(null)
  }

  const deleteSlot = (index: number) => {
    setSlotConfigs((prev) => {
      const newConfigs = [...prev]
      newConfigs.splice(index, 1)
      return newConfigs
    })
    setEditingSlot(null)
  }

  const insertSlot = (index: number, position: 'above' | 'below') => {
    setSlotConfigs((prev) => {
      const newConfigs = [...prev]
      const insertIndex = position === 'above' ? index : index + 1
      newConfigs.splice(insertIndex, 0, {})
      return newConfigs
    })
    setEditingSlot(null)
  }

  const autoAssignRaffles = () => {
    setSlotConfigs(autoAssignRafflesUtil(slotConfigs))
  }

  const handleNumSlotsChange = (n: number) => {
    setSlotConfigs((prev) => {
      return [...prev.slice(0, n), ...Array.from({ length: n - prev.length }, () => ({}))]
    })
  }

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset all settings?')) return

    // Reset all state to defaults
    setSlotBorder(DEFAULTS.slotBorder)
    setSlotBorderBrightness(DEFAULTS.slotBorderBrightness)
    setSlotDefaultDuration(DEFAULTS.slotDefaultDuration)
    setSlotHeight(DEFAULTS.slotHeight)
    setSlotRoundness(DEFAULTS.slotRoundness)
    setStartHour(DEFAULTS.startHour)
    setStartMinute(DEFAULTS.startMinute)
    setTimeFormat(DEFAULTS.timeFormat)
    // Reset slots last to pick up the new defaults
    setSlotConfigs(DEFAULTS.slotConfigs)
  }

  const handleShare = async () => {
    const url = generateShareableURL({
      slotBorder,
      slotBorderBrightness,
      slotConfigs,
      slotDefaultDuration,
      slotHeight,
      slotRoundness,
      startHour,
      startMinute,
      timeFormat,
    })
    await navigator.clipboard.writeText(url)
    setToast('Schedule URL copied to clipboard!')
  }

  return {
    startHour,
    setStartHour,
    startMinute,
    setStartMinute,
    timeFormat,
    setTimeFormat,
    slotHeight,
    setSlotHeight,
    slotDefaultDuration,
    setSlotDefaultDuration,
    slotRoundness,
    setSlotRoundness,
    slotBorder,
    setSlotBorder,
    slotBorderBrightness,
    setSlotBorderBrightness,
    showSettings,
    setShowSettings,
    slotConfigs,
    editingSlot,
    setEditingSlot,
    toast,
    slots,
    updateSlotConfig,
    deleteSlot,
    insertSlot,
    autoAssignRaffles,
    handleNumSlotsChange,
    handleReset,
    handleShare,
  }
}

type AppContextType = ReturnType<typeof useAppLogic>

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useAppLogic()

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within a AppProvider')
  }
  return context
}
