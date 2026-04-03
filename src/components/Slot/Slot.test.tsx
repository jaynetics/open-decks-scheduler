import { fireEvent, render, screen } from '@testing-library/react'

import { useApp } from '@/context/AppContext'
import { createMockAppContext, createMockSlot } from '@/utils/testUtils'

import Slot from './Slot'

jest.mock('@/context/AppContext', () => ({
  useApp: jest.fn(),
}))

describe('Slot Component', () => {
  const mockSlot = createMockSlot({ index: 5, hour: 20, minute: 30, duration: 30 })
  const mockContext = createMockAppContext()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useApp as jest.Mock).mockReturnValue(mockContext)
  })

  it('should render time formatted correctly', () => {
    render(<Slot slot={mockSlot} />)
    expect(screen.getByText('20:30')).toBeInTheDocument()
  })

  it('should render special content if present', () => {
    const specialSlot = { ...mockSlot, special: 'Special Guest' }
    render(<Slot slot={specialSlot} />)
    expect(screen.getByText('Special Guest')).toBeInTheDocument()
  })

  it('should render raffle info if present', () => {
    const raffleSlot = { ...mockSlot, raffles: 2 }
    render(<Slot slot={raffleSlot} />)
    expect(screen.getByText('2x Raffle')).toBeInTheDocument()
  })

  it('should call setEditingSlot when update button is clicked', () => {
    render(<Slot slot={mockSlot} />)
    const editButton = screen.getByTitle('Edit slot')
    fireEvent.click(editButton)
    expect(mockContext.setEditingSlot).toHaveBeenCalledWith(5)
  })

  it('should not render edit button for end time slot (index NaN)', () => {
    const endSlot = { ...mockSlot, index: NaN, special: 'End of last slot' }
    render(<Slot slot={endSlot} />)
    expect(screen.queryByTitle('Edit slot')).not.toBeInTheDocument()
  })

  it('should use 12h format when specified in context', () => {
    ;(useApp as jest.Mock).mockReturnValue({ ...mockContext, timeFormat: '12h' })
    // 20:30 is 8:30 PM
    render(<Slot slot={mockSlot} />)
    expect(screen.getByText('08:30')).toBeInTheDocument()
  })
})
