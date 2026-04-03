import { useApp } from '@/context/AppContext'
import { TimeFormat } from '@/types'
import { parseIntOrZero } from '@/utils/numberUtils'
import { RaffleWarning } from '@/utils/raffleUtils'

import Button from '../Button/Button'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  const app = useApp()

  return (
    <div className="ui sidebar">
      <h3>Open Decks Scheduler</h3>

      <div className="control-group">
        <label>Start Time</label>
        <div className="inline-inputs">
          <input
            type="number"
            min="0"
            max={app.timeFormat === '24h' ? 23 : 12}
            value={app.startHour}
            onChange={(e) => app.setStartHour(parseInt(e.target.value))}
            className="time-input"
            aria-label="Start hour"
          />
          <span className="time-separator">:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={app.startMinute}
            onChange={(e) => app.setStartMinute(parseInt(e.target.value))}
            className="time-input"
            aria-label="Start minute"
          />
          @
          <select
            value={app.timeFormat}
            onChange={(e) => app.setTimeFormat(e.target.value as TimeFormat)}
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
          value={app.slotConfigs.length}
          onChange={(e) => app.handleNumSlotsChange(parseIntOrZero(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="duration">Default Duration (min)</label>
        <input
          id="duration"
          type="number"
          min="0"
          max="120"
          value={app.slotDefaultDuration}
          onChange={(e) => app.setSlotDefaultDuration(parseIntOrZero(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="slotHeight">Slot Print Height (mm)</label>
        <input
          id="slotHeight"
          type="number"
          min="10"
          max="300"
          value={app.slotHeight}
          onChange={(e) => app.setSlotHeight(parseIntOrZero(e.target.value))}
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
            value={app.slotBorder}
            onChange={(e) => app.setSlotBorder(parseIntOrZero(e.target.value))}
          />
          ╭
          <input
            aria-label="Slot Roundness"
            id="slotRoundness"
            type="number"
            min="0"
            max="1000"
            value={app.slotRoundness}
            onChange={(e) => app.setSlotRoundness(parseIntOrZero(e.target.value))}
          />
          ☼
          <input
            aria-label="Slot Border Brightness"
            id="slotBorderBrightness"
            type="number"
            min="0"
            max="15"
            value={app.slotBorderBrightness}
            onChange={(e) => app.setSlotBorderBrightness(parseIntOrZero(e.target.value))}
          />
        </div>
      </div>

      <Button color="pink" text="🎲 Auto-assign Raffles" onClick={app.autoAssignRaffles} />
      <Button color="purple" text="🖨️ Print Schedule" onClick={() => window.print()} />
      <Button color="purple" text="🔗 Share Schedule" onClick={app.handleShare} />
      <Button color="orange" text="🔄 Reset to Defaults" onClick={app.handleReset} />
      <Button color="gray" text="Hide Settings" onClick={() => app.setShowSettings(false)} />

      <RaffleWarning slots={app.slots} />

      <a href="http://github.com/jaynetics/open-decks-scheduler">Source code</a>
    </div>
  )
}

export default Sidebar
