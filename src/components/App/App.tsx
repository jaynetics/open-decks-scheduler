import { useEffect, useMemo, useState } from 'react'

import { DEFAULTS } from '@/constants'
import { SlotConfig, Slot as SlotType, TimeFormat } from '@/types'
import { RaffleWarning, autoAssignRaffles as autoAssignRafflesUtil } from '@/utils/raffleUtils'
import { generateShareableURL, useAppStateFromURL } from '@/utils/storageUtils'
import { calculateSlotTimes } from '@/utils/timeUtils'

import Sidebar from '../Sidebar/Sidebar'
import Slot from '../Slot/Slot'
import SlotEditor from '../SlotEditor/SlotEditor'
import Toast from '../Toast/Toast'
import './App.css'

const App: React.FC = () => {
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

  const raffleWarning = <RaffleWarning slots={slots} />

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

  return (
    <div className="app-container">
      {showSettings && (
        <Sidebar
          numSlots={slotConfigs.length}
          onAutoAssignRaffles={autoAssignRaffles}
          onHideSettings={() => setShowSettings(false)}
          onNumSlotsChange={handleNumSlotsChange}
          onPrint={() => window.print()}
          onReset={handleReset}
          onShare={handleShare}
          onSlotBorderChange={setSlotBorder}
          onSlotBorderBrightnessChange={setSlotBorderBrightness}
          onSlotDefaultDurationChange={setSlotDefaultDuration}
          onSlotHeightChange={setSlotHeight}
          onSlotRoundnessChange={setSlotRoundness}
          onStartHourChange={setStartHour}
          onStartMinuteChange={setStartMinute}
          onTimeFormatChange={setTimeFormat}
          raffleWarning={raffleWarning}
          slotBorder={slotBorder}
          slotBorderBrightness={slotBorderBrightness}
          slotDefaultDuration={slotDefaultDuration}
          slotHeight={slotHeight}
          slotRoundness={slotRoundness}
          startHour={startHour}
          startMinute={startMinute}
          timeFormat={timeFormat}
        />
      )}

      {!showSettings && (
        <button
          className="ui show-sidebar-button"
          onClick={() => setShowSettings(true)}
          aria-label="Show settings"
        >
          ⚙️
        </button>
      )}

      <div className="schedule-container">
        {!showSettings && raffleWarning}
        {slots.map((slot) => (
          <Slot
            key={slot.index}
            slot={slot}
            timeFormat={timeFormat}
            onEdit={() => setEditingSlot(slot.index)}
          />
        ))}
        <EndTime slots={slots} timeFormat={timeFormat} />
      </div>

      {editingSlot !== null && (
        <SlotEditor
          slot={slots[editingSlot]}
          slotIndex={editingSlot}
          timeFormat={timeFormat}
          onSave={updateSlotConfig}
          onDelete={deleteSlot}
          onInsert={insertSlot}
          onClose={() => setEditingSlot(null)}
        />
      )}

      <Toast message={toast} />
    </div>
  )
}

const EndTime: React.FC<{
  slots: SlotType[]
  timeFormat: TimeFormat
}> = ({ slots, timeFormat }) => {
  if (slots.length === 0) return null

  const lastSlot = slots[slots.length - 1]
  const endTime = new Date(2000, 1, 1, lastSlot.hour, lastSlot.minute)
  endTime.setMinutes(endTime.getMinutes() + lastSlot.duration)

  return (
    <div className="ui end-time">
      <Slot
        slot={{
          ...lastSlot,
          duration: 0,
          index: NaN,
          hour: endTime.getHours(),
          minute: endTime.getMinutes(),
          special: 'End of last slot',
        }}
        timeFormat={timeFormat}
      />
    </div>
  )
}

export default App
