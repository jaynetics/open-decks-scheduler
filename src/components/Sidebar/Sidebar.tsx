import { SidebarProps, TimeFormat } from '@/types'
import { parseIntOrZero } from '@/utils/numberUtils'

import Button from '../Button/Button'
import './Sidebar.css'

const Sidebar: React.FC<SidebarProps> = ({
  numSlots,
  onAutoAssignRaffles,
  onSlotDefaultDurationChange,
  onHideSettings,
  onNumSlotsChange,
  onPrint,
  onReset,
  onShare,
  onSlotBorderChange,
  onSlotBorderBrightnessChange,
  onSlotHeightChange,
  onSlotRoundnessChange,
  onStartHourChange,
  onStartMinuteChange,
  onTimeFormatChange,
  raffleWarning,
  slotBorder,
  slotBorderBrightness,
  slotDefaultDuration,
  slotHeight,
  slotRoundness,
  startHour,
  startMinute,
  timeFormat,
}) => {
  return (
    <div className="ui sidebar">
      <h3>Open Decks Scheduler</h3>

      <div className="control-group">
        <label>Start Time</label>
        <div className="inline-inputs">
          <input
            type="number"
            min="0"
            max={timeFormat === '24h' ? 23 : 12}
            value={startHour}
            onChange={(e) => onStartHourChange(parseInt(e.target.value))}
            className="time-input"
            aria-label="Start hour"
          />
          <span className="time-separator">:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={startMinute}
            onChange={(e) => onStartMinuteChange(parseInt(e.target.value))}
            className="time-input"
            aria-label="Start minute"
          />
          @
          <select
            value={timeFormat}
            onChange={(e) => onTimeFormatChange(e.target.value as TimeFormat)}
            className="time-format-select"
            aria-label="Time format"
          >
            <option value="24h">24h</option>
            <option value="12h">AM/PM</option>
          </select>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="numSlots">Number of Slots</label>
        <input
          id="numSlots"
          type="number"
          min="1"
          max="30"
          value={numSlots}
          onChange={(e) => onNumSlotsChange(parseIntOrZero(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="duration">Default Duration (min)</label>
        <input
          id="duration"
          type="number"
          min="0"
          max="120"
          value={slotDefaultDuration}
          onChange={(e) => onSlotDefaultDurationChange(parseIntOrZero(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="slotHeight">Slot Print Height (mm)</label>
        <input
          id="slotHeight"
          type="number"
          min="10"
          max="300"
          value={slotHeight}
          onChange={(e) => onSlotHeightChange(parseIntOrZero(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>Slot Style</label>
        <div className="inline-inputs">
          ❘&#8239;❙&#8239;❚
          <input
            aria-label="Slot Border Thickness"
            id="slotBorder"
            type="number"
            min="0"
            max="1000"
            value={slotBorder}
            onChange={(e) => onSlotBorderChange(parseIntOrZero(e.target.value))}
          />
          ╭
          <input
            aria-label="Slot Roundness"
            id="slotRoundness"
            type="number"
            min="0"
            max="1000"
            value={slotRoundness}
            onChange={(e) => onSlotRoundnessChange(parseIntOrZero(e.target.value))}
          />
          ☼
          <input
            aria-label="Slot Border Brightness"
            id="slotBorderBrightness"
            type="number"
            min="0"
            max="15"
            value={slotBorderBrightness}
            onChange={(e) => onSlotBorderBrightnessChange(parseIntOrZero(e.target.value))}
          />
        </div>
      </div>

      <Button color="pink" text="🎲 Auto-assign Raffles" onClick={onAutoAssignRaffles} />
      <Button color="purple" text="🖨️ Print Schedule" onClick={onPrint} />
      <Button color="purple" text="🔗 Share Schedule" onClick={onShare} />
      <Button color="orange" text="🔄 Reset to Defaults" onClick={onReset} />
      <Button color="gray" text="Hide Settings" onClick={onHideSettings} />

      {raffleWarning}
    </div>
  )
}

export default Sidebar
