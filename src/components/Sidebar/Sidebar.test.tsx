import { fireEvent, render, screen } from '@testing-library/react'

import { useApp } from '@/context/AppContext'
import { createMockAppContext } from '@/utils/testUtils'

import Sidebar from './Sidebar'

jest.mock('@/context/AppContext', () => ({
  useApp: jest.fn(),
}))

describe('Sidebar Component', () => {
  const mockContext = createMockAppContext()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useApp as jest.Mock).mockReturnValue(mockContext)
  })

  // Mock window.print inside the component interaction test if needed
  // But Sidebar calls window.print() directly in the onClick.
  // We can spy on window.print
  const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {})

  it('should render sidebar title', () => {
    render(<Sidebar />)
    expect(screen.getByText('Open Decks Scheduler')).toBeInTheDocument()
  })

  it('should render all control inputs', () => {
    render(<Sidebar />)
    expect(screen.getByLabelText('Start hour')).toBeInTheDocument()
    expect(screen.getByLabelText('Start minute')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Slots')).toBeInTheDocument()
    expect(screen.getByLabelText('Default Duration (min)')).toBeInTheDocument()
    expect(screen.getByLabelText('Slot Print Height (mm)')).toBeInTheDocument()
  })

  it('should display current values in inputs', () => {
    render(<Sidebar />)
    expect(screen.getByLabelText('Start hour')).toHaveValue(18)
    expect(screen.getByLabelText('Start minute')).toHaveValue(20)
    expect(screen.getByLabelText('Number of Slots')).toHaveValue(14)
    expect(screen.getByLabelText('Default Duration (min)')).toHaveValue(20)
    expect(screen.getByLabelText('Slot Print Height (mm)')).toHaveValue(40)
  })

  it('should call setStartHour when start hour is changed', () => {
    render(<Sidebar />)
    const hourInput = screen.getByLabelText('Start hour')
    fireEvent.change(hourInput, { target: { value: 19 } })
    expect(mockContext.setStartHour).toHaveBeenCalledWith(19)
  })

  it('should call setStartMinute when start minute is changed', () => {
    render(<Sidebar />)
    const minuteInput = screen.getByLabelText('Start minute')
    fireEvent.change(minuteInput, { target: { value: 30 } })
    expect(mockContext.setStartMinute).toHaveBeenCalledWith(30)
  })

  it('should call setSlotDefaultDuration when duration is changed', () => {
    render(<Sidebar />)
    const durationInput = screen.getByLabelText('Default Duration (min)')
    fireEvent.change(durationInput, { target: { value: '30' } })
    expect(mockContext.setSlotDefaultDuration).toHaveBeenCalledWith(30)
  })

  it('should call setSlotBorder when slot border is changed', () => {
    render(<Sidebar />)
    const borderInput = screen.getByLabelText('Slot Border Thickness')
    fireEvent.change(borderInput, { target: { value: '10' } })
    expect(mockContext.setSlotBorder).toHaveBeenCalledWith(10)
  })

  it('should call setSlotBorderBrightness when slot border brightness is changed', () => {
    render(<Sidebar />)
    const brightnessInput = screen.getByLabelText('Slot Border Brightness')
    fireEvent.change(brightnessInput, { target: { value: '12' } })
    expect(mockContext.setSlotBorderBrightness).toHaveBeenCalledWith(12)
  })

  it('should call setSlotHeight when slot height is changed', () => {
    render(<Sidebar />)
    const heightInput = screen.getByLabelText('Slot Print Height (mm)')
    fireEvent.change(heightInput, { target: { value: '50' } })
    expect(mockContext.setSlotHeight).toHaveBeenCalledWith(50)
  })

  it('should call setSlotRoundness when slot roundness is changed', () => {
    render(<Sidebar />)
    const roundnessInput = screen.getByLabelText('Slot Roundness')
    fireEvent.change(roundnessInput, { target: { value: '10' } })
    expect(mockContext.setSlotRoundness).toHaveBeenCalledWith(10)
  })

  it('should use fallback value when a number is invalid', () => {
    render(<Sidebar />)
    const durationInput = screen.getByLabelText('Default Duration (min)')
    fireEvent.change(durationInput, { target: { value: '' } })
    expect(mockContext.setSlotDefaultDuration).toHaveBeenCalledWith(0)
  })

  it('should call autoAssignRaffles when Auto-assign Raffles is clicked', () => {
    render(<Sidebar />)
    const autoUpdateButton = screen.getByText('🎲 Auto-assign Raffles')
    fireEvent.click(autoUpdateButton)
    expect(mockContext.autoAssignRaffles).toHaveBeenCalledTimes(1)
  })

  it('should call window.print when Print Schedule is clicked', () => {
    render(<Sidebar />)
    const printButton = screen.getByText('🖨️ Print Schedule')
    fireEvent.click(printButton)
    expect(printSpy).toHaveBeenCalledTimes(1)
  })

  it('should call setShowSettings(false) when Hide Settings is clicked', () => {
    render(<Sidebar />)
    const hideButton = screen.getByText('Hide Settings')
    fireEvent.click(hideButton)
    expect(mockContext.setShowSettings).toHaveBeenCalledWith(false)
  })

  it('should render time format selector with 24h selected by default', () => {
    render(<Sidebar />)
    const formatSelector = screen.getByLabelText('Time format')
    expect(formatSelector).toHaveValue('24h')
  })

  it('should call setTimeFormat when format is changed', () => {
    render(<Sidebar />)
    const formatSelector = screen.getByLabelText('Time format')
    fireEvent.change(formatSelector, { target: { value: '12h' } })
    expect(mockContext.setTimeFormat).toHaveBeenCalledWith('12h')
  })

  it('should call handleShare when Share Schedule is clicked', () => {
    render(<Sidebar />)
    const shareButton = screen.getByText('🔗 Share Schedule')
    fireEvent.click(shareButton)
    expect(mockContext.handleShare).toHaveBeenCalledTimes(1)
  })
})
