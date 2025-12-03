import { useEffect, useState } from 'react'

import { SlotEditorProps } from '@/types'
import { parseIntOrZero } from '@/utils/numberUtils'
import { formatTime } from '@/utils/timeUtils'

import Button from '../Button/Button'
import './SlotEditor.css'

const SlotEditor: React.FC<SlotEditorProps> = ({
  slot,
  slotIndex,
  timeFormat,
  onSave,
  onDelete,
  onInsert,
  onClose,
}) => {
  const [special, setSpecial] = useState(slot.special)
  const [raffles, setRaffles] = useState(slot.raffles)
  const [duration, setDuration] = useState(slot.duration)

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(slotIndex, { special, raffles, duration })
  }

  const handleClear = () => {
    onSave(slotIndex, {})
  }

  const handleDelete = () => {
    confirm('Are you sure you want to delete this slot?') && onDelete(slotIndex)
  }

  const handleInsertAbove = () => {
    onInsert(slotIndex, 'above')
  }

  const handleInsertBelow = () => {
    onInsert(slotIndex, 'below')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>
          Edit Slot {slotIndex + 1} ({formatTime(slot.hour, slot.minute, timeFormat)})
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor={`special-${slotIndex}`}>
              Special Content (leave empty for regular DJ slot)
            </label>
            <input
              id={`special-${slotIndex}`}
              type="text"
              value={special || ''}
              onChange={(e) => setSpecial(e.target.value)}
              placeholder="e.g., Featured DJ: XY / Social Break / ..."
            />
          </div>

          <div className="modal-field">
            <label htmlFor={`raffles-${slotIndex}`}>Number of Raffles</label>
            <input
              id={`raffles-${slotIndex}`}
              type="number"
              value={raffles || 0}
              min="0"
              max="10"
              onChange={(e) => setRaffles(parseIntOrZero(e.target.value))}
            />
          </div>

          <div className="modal-field">
            <label htmlFor={`duration-${slotIndex}`}>Duration (minutes)</label>
            <input
              id={`duration-${slotIndex}`}
              type="number"
              value={duration}
              min="0"
              max="120"
              onChange={(e) => setDuration(parseIntOrZero(e.target.value))}
            />
          </div>

          <div className="modal-actions">
            <Button text="Add Slot Above" color="pink" onClick={handleInsertAbove} />
            <Button text="Add Slot Below" color="pink" onClick={handleInsertBelow} />
            <Button text="Save" color="purple" type="submit" />
            <Button text="Clear" color="orange" onClick={handleClear} />
            <Button text="Delete Slot" color="orange" onClick={handleDelete} />
            <Button text="Cancel" color="gray" onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SlotEditor
