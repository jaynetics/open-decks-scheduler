import { fireEvent, render, screen } from '@testing-library/react'

import Sidebar from './Sidebar'

describe('Sidebar Component', () => {
  const mockProps = {
    numSlots: 14,
    onAutoAssignRaffles: jest.fn(),
    onSlotDefaultDurationChange: jest.fn(),
    onHideSettings: jest.fn(),
    onNumSlotsChange: jest.fn(),
    onPrint: jest.fn(),
    onReset: jest.fn(),
    onShare: jest.fn(),
    onSlotBorderChange: jest.fn(),
    onSlotBorderBrightnessChange: jest.fn(),
    onSlotHeightChange: jest.fn(),
    onSlotRoundnessChange: jest.fn(),
    onStartHourChange: jest.fn(),
    onStartMinuteChange: jest.fn(),
    onTimeFormatChange: jest.fn(),
    raffleWarning: null,
    slotBorder: 2,
    slotBorderBrightness: 9,
    slotDefaultDuration: 20,
    slotHeight: 40,
    slotRoundness: 0,
    startHour: 18,
    startMinute: 20,
    timeFormat: '24h' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render sidebar title', () => {
    render(<Sidebar {...mockProps} />)
    expect(screen.getByText('Open Decks Scheduler')).toBeInTheDocument()
  })

  it('should render all control inputs', () => {
    render(<Sidebar {...mockProps} />)
    expect(screen.getByLabelText('Start hour')).toBeInTheDocument()
    expect(screen.getByLabelText('Start minute')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Slots')).toBeInTheDocument()
    expect(screen.getByLabelText('Default Duration (min)')).toBeInTheDocument()
    expect(screen.getByLabelText('Slot Print Height (mm)')).toBeInTheDocument()
  })

  it('should display current values in inputs', () => {
    render(<Sidebar {...mockProps} />)
    expect(screen.getByLabelText('Start hour')).toHaveValue(18)
    expect(screen.getByLabelText('Start minute')).toHaveValue(20)
    expect(screen.getByLabelText('Number of Slots')).toHaveValue(14)
    expect(screen.getByLabelText('Default Duration (min)')).toHaveValue(20)
    expect(screen.getByLabelText('Slot Print Height (mm)')).toHaveValue(40)
  })

  it('should call onStartHourChange when start hour is changed', () => {
    render(<Sidebar {...mockProps} />)
    const hourInput = screen.getByLabelText('Start hour')
    fireEvent.change(hourInput, { target: { value: 19 } })
    expect(mockProps.onStartHourChange).toHaveBeenCalledWith(19)
  })

  it('should call onStartMinuteChange when start minute is changed', () => {
    render(<Sidebar {...mockProps} />)
    const minuteInput = screen.getByLabelText('Start minute')
    fireEvent.change(minuteInput, { target: { value: 30 } })
    expect(mockProps.onStartMinuteChange).toHaveBeenCalledWith(30)
  })

  it('should call onSlotDefaultDurationChange when duration is changed', () => {
    render(<Sidebar {...mockProps} />)
    const durationInput = screen.getByLabelText('Default Duration (min)')
    fireEvent.change(durationInput, { target: { value: '30' } })
    expect(mockProps.onSlotDefaultDurationChange).toHaveBeenCalledWith(30)
  })

  it('should call onSlotBorderChange when slot border is changed', () => {
    render(<Sidebar {...mockProps} />)
    const borderInput = screen.getByLabelText('Slot Border Thickness')
    fireEvent.change(borderInput, { target: { value: '10' } })
    expect(mockProps.onSlotBorderChange).toHaveBeenCalledWith(10)
  })

  it('should call onSlotBorderBrightnessChange when slot border brightness is changed', () => {
    render(<Sidebar {...mockProps} />)
    const brightnessInput = screen.getByLabelText('Slot Border Brightness')
    fireEvent.change(brightnessInput, { target: { value: '12' } })
    expect(mockProps.onSlotBorderBrightnessChange).toHaveBeenCalledWith(12)
  })

  it('should call onSlotHeightChange when slot height is changed', () => {
    render(<Sidebar {...mockProps} />)
    const heightInput = screen.getByLabelText('Slot Print Height (mm)')
    fireEvent.change(heightInput, { target: { value: '50' } })
    expect(mockProps.onSlotHeightChange).toHaveBeenCalledWith(50)
  })

  it('should call onSlotRoundnessChange when slot roundness is changed', () => {
    render(<Sidebar {...mockProps} />)
    const roundnessInput = screen.getByLabelText('Slot Roundness')
    fireEvent.change(roundnessInput, { target: { value: '10' } })
    expect(mockProps.onSlotRoundnessChange).toHaveBeenCalledWith(10)
  })

  it('should use fallback value when a number is invalid', () => {
    render(<Sidebar {...mockProps} />)
    const durationInput = screen.getByLabelText('Default Duration (min)')
    fireEvent.change(durationInput, { target: { value: '' } })
    expect(mockProps.onSlotDefaultDurationChange).toHaveBeenCalledWith(0)
  })

  it('should show raffle warning when gives', () => {
    render(<Sidebar {...mockProps} raffleWarning={'mockRaffleWarning'} />)
    expect(screen.getByText(/mockRaffleWarning/)).toBeInTheDocument()
  })

  it('should call onAutoAssignRaffles when Auto-assign Raffles is clicked', () => {
    render(<Sidebar {...mockProps} />)
    const autoUpdateButton = screen.getByText('🎲 Auto-assign Raffles')
    fireEvent.click(autoUpdateButton)
    expect(mockProps.onAutoAssignRaffles).toHaveBeenCalledTimes(1)
  })

  it('should call onPrint when Print Schedule is clicked', () => {
    render(<Sidebar {...mockProps} />)
    const printButton = screen.getByText('🖨️ Print Schedule')
    fireEvent.click(printButton)
    expect(mockProps.onPrint).toHaveBeenCalledTimes(1)
  })

  it('should call onHideSettings when Hide Settings is clicked', () => {
    render(<Sidebar {...mockProps} />)
    const hideButton = screen.getByText('Hide Settings')
    fireEvent.click(hideButton)
    expect(mockProps.onHideSettings).toHaveBeenCalledTimes(1)
  })

  it('should render all buttons with correct classes', () => {
    render(<Sidebar {...mockProps} />)
    expect(screen.getByText('🎲 Auto-assign Raffles')).toBeInTheDocument()
    expect(screen.getByText('🖨️ Print Schedule')).toBeInTheDocument()
    expect(screen.getByText('🔗 Share Schedule')).toBeInTheDocument()
    expect(screen.getByText('Hide Settings')).toBeInTheDocument()
    expect(screen.getByText('🔄 Reset to Defaults')).toBeInTheDocument()
  })

  it('should render time format selector with 24h selected by default', () => {
    render(<Sidebar {...mockProps} />)
    const formatSelector = screen.getByLabelText('Time format')
    expect(formatSelector).toHaveValue('24h')
  })

  it('should call onTimeFormatChange when format is changed', () => {
    render(<Sidebar {...mockProps} />)
    const formatSelector = screen.getByLabelText('Time format')
    fireEvent.change(formatSelector, { target: { value: '12h' } })
    expect(mockProps.onTimeFormatChange).toHaveBeenCalledWith('12h')
  })

  it('should display both 24h and 12h options', () => {
    render(<Sidebar {...mockProps} />)
    expect(screen.getByRole('option', { name: '24h' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'AM/PM' })).toBeInTheDocument()
  })

  it('should call onShare when Share Schedule is clicked', () => {
    render(<Sidebar {...mockProps} />)
    const shareButton = screen.getByText('🔗 Share Schedule')
    fireEvent.click(shareButton)
    expect(mockProps.onShare).toHaveBeenCalledTimes(1)
  })
})
