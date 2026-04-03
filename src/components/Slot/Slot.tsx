import { MM_TO_REM_RATIO } from '@/constants'
import { useApp } from '@/context/AppContext'
import { SlotProps } from '@/types'
import { formatTime } from '@/utils/timeUtils'

import './Slot.css'

const Slot: React.FC<SlotProps> = ({ slot }) => {
  const { timeFormat, setEditingSlot } = useApp()

  return (
    <div
      className={`slot ${slot.special ? 'special' : ''}`}
      style={{
        height: `${slot.height / MM_TO_REM_RATIO}em`,
        borderRadius: `${slot.roundness / MM_TO_REM_RATIO}em`,
        borderWidth: `${(slot.special ? 0.15 : 0.1) * slot.border}em`,
        borderColor: htmlBorderColor(slot),
      }}
    >
      <div className="time-container">
        {slot.raffles ? <div className="raffle-info">{slot.raffles}x Raffle</div> : null}
        <div className="time">{formatTime(slot.hour, slot.minute, timeFormat)}</div>
      </div>
      <div className="event-container">
        <div className="dj-set">
          {slot.special ? <span>{slot.special}</span> : <div className="write-space"></div>}
        </div>
      </div>
      {!isNaN(slot.index) && (
        <button
          className="ui edit-slot-button"
          onClick={() => setEditingSlot(slot.index)}
          title="Edit slot"
          aria-label={`Edit slot ${slot.index + 1}`}
        >
          ✏️
        </button>
      )}
    </div>
  )
}

const htmlBorderColor = (slot: SlotProps['slot']): string => {
  const n = slot.special ? slot.borderBrightness - 5 : slot.borderBrightness
  const hex = Math.max(0, Math.min(n, 15)).toString(16)
  return `#${hex}${hex}${hex}`
}

export default Slot
