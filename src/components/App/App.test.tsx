import { fireEvent, render, screen } from '@/utils/testUtils'

import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the App with sidebar visible by default', () => {
    render(<App />)
    expect(screen.getByText('Open Decks Scheduler')).toBeInTheDocument()
  })

  it('should render the schedule container', () => {
    const { container } = render(<App />)
    expect(container.querySelector('.schedule-container')).toBeInTheDocument()
  })

  it('should render default number of slots', () => {
    render(<App />)
    // Check for the first slot time (18:20)
    const timeElements = screen.getAllByText(/^\d{2}:\d{2}$/)
    expect(timeElements.length).toBeGreaterThan(0)
  })

  it('should hide sidebar when Hide Settings is clicked', () => {
    render(<App />)
    const hideButton = screen.getByText('Hide Settings')
    fireEvent.click(hideButton)

    expect(screen.queryByText('Open Decks Scheduler')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Show settings')).toBeInTheDocument()
  })

  it('should show sidebar when settings button is clicked', () => {
    render(<App />)
    const hideButton = screen.getByText('Hide Settings')
    fireEvent.click(hideButton)

    const showButton = screen.getByLabelText('Show settings')
    fireEvent.click(showButton)

    expect(screen.getByText('Open Decks Scheduler')).toBeInTheDocument()
  })

  it('should update number of slots when changed', () => {
    render(<App />)
    const slotsInput = screen.getByLabelText('Number of Slots')

    fireEvent.change(slotsInput, { target: { value: '5' } })

    const timeElements = screen.getAllByText(/^\d{2}:\d{2}$/)
    // 5 slots + 1 end time
    expect(timeElements).toHaveLength(6)
  })

  it('should add new empty slots when number of slots is increased', () => {
    render(<App />)
    const slotsInput = screen.getByLabelText('Number of Slots')

    // First decrease to 5
    fireEvent.change(slotsInput, { target: { value: '5' } })

    // Then increase to 8 - this will trigger the Array.from code
    fireEvent.change(slotsInput, { target: { value: '8' } })

    const timeElements = screen.getAllByText(/^\d{2}:\d{2}$/)
    // 8 slots + 1 end time
    expect(timeElements).toHaveLength(9)
  })

  it('should update start time when changed', () => {
    render(<App />)
    const hourInput = screen.getByLabelText('Start hour')
    const minuteInput = screen.getByLabelText('Start minute')

    fireEvent.change(hourInput, { target: { value: '10' } })
    fireEvent.change(minuteInput, { target: { value: '30' } })

    expect(screen.getByText('10:30')).toBeInTheDocument()
  })

  it('should auto-assign raffles when button is clicked', () => {
    render(<App />)

    const autoUpdateButton = screen.getByText('🎲 Auto-assign Raffles')
    fireEvent.click(autoUpdateButton)

    // Should have raffles distributed
    const raffleElements = screen.queryAllByText(/\dx Raffle/)
    expect(raffleElements.length).toBeGreaterThan(0)
  })

  it('should show raffle warning when mismatch exists and sidebar is hidden', () => {
    render(<App />)

    // First add a raffle to create a mismatch
    const editButtons = screen.getAllByTitle('Edit slot')
    fireEvent.click(editButtons[0])

    const rafflesInput = screen.getByLabelText(/Number of Raffles/i)
    fireEvent.change(rafflesInput, { target: { value: '2' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    // Hide sidebar to see the warning
    const hideButton = screen.getByText('Hide Settings')
    fireEvent.click(hideButton)

    expect(screen.getByText(/ 14 free slot\(s\) but 2 raffle\(s\)/)).toBeInTheDocument()
  })

  it('should update slot height when changed', () => {
    const { container } = render(<App />)
    const heightInput = screen.getByLabelText('Slot Print Height (mm)')

    fireEvent.change(heightInput, { target: { value: '60' } })

    // Check if the slot height has been updated (60 * 3.45 = 207px)
    const slot = container.querySelector('.slot')
    expect(slot).toHaveStyle({ height: '11.11111111111111em' })
  })

  it('should update default duration when changed', () => {
    render(<App />)
    const durationInput = screen.getByLabelText('Default Duration (min)')

    fireEvent.change(durationInput, { target: { value: '30' } })

    // The second slot should now be 30 minutes after the first
    expect(screen.getByText('18:20')).toBeInTheDocument()
    expect(screen.getByText('18:50')).toBeInTheDocument()
  })

  it('should preserve slot configs when number of slots changes', () => {
    render(<App />)

    // Add special content to first slot
    const editButtons = screen.getAllByTitle('Edit slot')
    fireEvent.click(editButtons[0])

    const specialInput = screen.getByLabelText(/Special Content/i)
    fireEvent.change(specialInput, { target: { value: 'Test Content' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    // Change number of slots
    const slotsInput = screen.getByLabelText('Number of Slots')
    fireEvent.change(slotsInput, { target: { value: '10' } })

    // Special content should still be there
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  describe('EndTime component', () => {
    it('should display end time', () => {
      render(<App />)

      // End time should be visible with settings
      expect(screen.getByText('End of last slot')).toBeInTheDocument()

      // With default settings (14 slots * 20 minutes from 18:20)
      // Last slot starts at 22:40, ends at 23:00
      expect(screen.getByText('23:00')).toBeInTheDocument()
    })

    it('should update end time when slot duration changes', () => {
      render(<App />)

      // Change default duration to 30 minutes
      const durationInput = screen.getByLabelText('Default Duration (min)')
      fireEvent.change(durationInput, { target: { value: '30' } })

      // With 14 slots * 30 minutes from 18:20
      // Last slot starts at 00:50, ends at 01:20
      expect(screen.getByText('01:20')).toBeInTheDocument()
    })

    it('should update end time when last slot has custom duration', () => {
      render(<App />)

      // Edit the last slot
      const editButtons = screen.getAllByTitle('Edit slot')
      fireEvent.click(editButtons[editButtons.length - 1])

      // Set custom duration for last slot
      const durationInput = screen.getByLabelText(/Duration \(minutes\)/i)
      fireEvent.change(durationInput, { target: { value: '60' } })

      const saveButton = screen.getByText('Save')
      fireEvent.click(saveButton)

      // Last slot at 22:40 with 60 minute duration ends at 23:40
      expect(screen.getByText('23:40')).toBeInTheDocument()
    })

    it('should update end time when start time changes', () => {
      render(<App />)

      // Change start time to 20:00
      const hourInput = screen.getByLabelText('Start hour')
      const minuteInput = screen.getByLabelText('Start minute')
      fireEvent.change(hourInput, { target: { value: '20' } })
      fireEvent.change(minuteInput, { target: { value: '00' } })

      // With 14 slots * 20 minutes from 20:00
      // Last slot starts at 00:20, ends at 00:40
      expect(screen.getByText('00:40')).toBeInTheDocument()
    })

    it('should handle when there are no slots', () => {
      render(<App />)

      // Set number of slots to 0
      const slotsInput = screen.getByLabelText('Number of Slots')
      fireEvent.change(slotsInput, { target: { value: '0' } })

      // End time should not be displayed
      expect(screen.queryByText('End of last slot')).not.toBeInTheDocument()
    })

    it('should update end time when number of slots changes', () => {
      render(<App />)

      // Change number of slots to 5
      const slotsInput = screen.getByLabelText('Number of Slots')
      fireEvent.change(slotsInput, { target: { value: '5' } })

      // With 5 slots * 20 minutes from 18:20
      // Last slot starts at 19:40, ends at 20:00
      expect(screen.getByText('20:00')).toBeInTheDocument()
    })

    it('should handle midnight crossing correctly', () => {
      render(<App />)

      // Set start time to 23:00
      const hourInput = screen.getByLabelText('Start hour')
      const minuteInput = screen.getByLabelText('Start minute')
      fireEvent.change(hourInput, { target: { value: '23' } })
      fireEvent.change(minuteInput, { target: { value: '00' } })

      // With 14 slots * 20 minutes from 23:00
      // Last slot starts at 03:20, ends at 03:40
      expect(screen.getByText('03:40')).toBeInTheDocument()
    })
  })

  describe('Time format switching', () => {
    it('should keep internal start hour unchanged when switching from 24h to 12h', () => {
      render(<App />)

      // Set start time to 14:00 (2 PM)
      const hourInput = screen.getByLabelText('Start hour')
      fireEvent.change(hourInput, { target: { value: '14' } })

      // Switch to 12h format
      const formatSelector = screen.getByLabelText('Time format')
      fireEvent.change(formatSelector, { target: { value: '12h' } })

      // Start hour should remain 14 (will be displayed as 2 PM)
      expect(hourInput).toHaveValue(14)
    })

    it('should display times in 12h format when selected', () => {
      render(<App />)

      // Set start time to 14:00 (2 PM in 24h)
      const hourInput = screen.getByLabelText('Start hour')
      fireEvent.change(hourInput, { target: { value: '14' } })

      // Switch to 12h format
      const formatSelector = screen.getByLabelText('Time format')
      fireEvent.change(formatSelector, { target: { value: '12h' } })

      // First slot should show 02:20 (14:00 + 20 minutes in 12h format, no AM/PM)
      expect(screen.getByText('02:20')).toBeInTheDocument()
    })
  })
})
