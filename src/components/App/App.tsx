import { useApp } from '@/context/AppContext'
import { Slot as SlotType } from '@/types'
import { RaffleWarning } from '@/utils/raffleUtils'

import Sidebar from '../Sidebar/Sidebar'
import Slot from '../Slot/Slot'
import SlotEditor from '../SlotEditor/SlotEditor'
import Toast from '../Toast/Toast'
import './App.css'

const App: React.FC = () => {
  const { showSettings, setShowSettings, slots, editingSlot, toast } = useApp()

  return (
    <div className="app-container">
      {showSettings && <Sidebar />}

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
        {!showSettings && <RaffleWarning slots={slots} />}
        {slots.map((slot) => (
          <Slot key={slot.index} slot={slot} />
        ))}
        <EndTime slots={slots} />
      </div>

      {editingSlot !== null && <SlotEditor />}

      <Toast message={toast} />
    </div>
  )
}

const EndTime: React.FC<{
  slots: SlotType[]
}> = ({ slots }) => {
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
      />
    </div>
  )
}

export default App
