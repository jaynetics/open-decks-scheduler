import { fireEvent, render, screen } from '@testing-library/react'

import { Slot as SlotType } from '@/types'

import Slot from './Slot'

describe('Slot Component', () => {
  const mockSlot: SlotType = {
    border: 2,
    borderBrightness: 9,
    duration: 20,
    height: 40,
    hour: 18,
    index: 0,
    minute: 20,
    roundness: 0,
  }

  const mockSlotWithRaffles: SlotType = {
    ...mockSlot,
    raffles: 2,
  }

  const mockSlotWithSpecial: SlotType = {
    ...mockSlot,
    special: 'Featured DJ: Evya',
  }

  it('should render slot with time', () => {
    render(<Slot slot={mockSlot} timeFormat="24h" />)
    expect(screen.getByText('18:20')).toBeInTheDocument()
  })

  it('should render raffle info when slot has raffles', () => {
    render(<Slot slot={mockSlotWithRaffles} timeFormat="24h" />)
    expect(screen.getByText('2x Raffle')).toBeInTheDocument()
  })

  it('should render special content when slot is special', () => {
    render(<Slot slot={mockSlotWithSpecial} timeFormat="24h" />)
    expect(screen.getByText('Featured DJ: Evya')).toBeInTheDocument()
  })

  it('should apply special class when slot has special content', () => {
    const { container } = render(<Slot slot={mockSlotWithSpecial} timeFormat="24h" />)
    const slotDiv = container.querySelector('.slot')
    expect(slotDiv).toHaveClass('special')
  })

  it('should render write-space when slot is not special', () => {
    const { container } = render(<Slot slot={mockSlot} timeFormat="24h" />)
    expect(container.querySelector('.write-space')).toBeInTheDocument()
  })

  it('should set correct height style', () => {
    const { container } = render(<Slot slot={mockSlot} timeFormat="24h" />)
    const slotDiv = container.querySelector('.slot')
    expect(slotDiv).toHaveStyle({ height: '7.4074074074074066em' })
  })

  it('should render edit button when onEdit is provided', () => {
    const mockOnEdit = jest.fn()
    render(<Slot slot={mockSlot} timeFormat="24h" onEdit={mockOnEdit} />)
    const editButton = screen.getByTitle('Edit slot')
    expect(editButton).toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    render(<Slot slot={mockSlot} timeFormat="24h" onEdit={mockOnEdit} />)
    const editButton = screen.getByTitle('Edit slot')
    fireEvent.click(editButton)
    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })

  it('should not render edit button when onEdit is null', () => {
    render(<Slot slot={mockSlot} timeFormat="24h" />)
    const editButton = screen.queryByTitle('Edit slot')
    expect(editButton).not.toBeInTheDocument()
  })

  it('should have correct aria-label on edit button', () => {
    const mockOnEdit = jest.fn()
    render(<Slot slot={mockSlot} timeFormat="24h" onEdit={mockOnEdit} />)
    const editButton = screen.getByTitle('Edit slot')
    expect(editButton).toHaveAttribute('aria-label', 'Edit slot 1')
  })

  describe('12-hour format', () => {
    it('should display time in 12h format when specified', () => {
      const slot12h: SlotType = {
        ...mockSlot,
        hour: 13,
        minute: 30,
      }
      render(<Slot slot={slot12h} timeFormat="12h" />)
      expect(screen.getByText('01:30')).toBeInTheDocument()
    })

    it('should display midnight as 12:00 in 12h format', () => {
      const slotMidnight: SlotType = {
        ...mockSlot,
        hour: 0,
        minute: 0,
      }
      render(<Slot slot={slotMidnight} timeFormat="12h" />)
      expect(screen.getByText('12:00')).toBeInTheDocument()
    })

    it('should display noon as 12:00 in 12h format', () => {
      const slotNoon: SlotType = {
        ...mockSlot,
        hour: 12,
        minute: 0,
      }
      render(<Slot slot={slotNoon} timeFormat="12h" />)
      expect(screen.getByText('12:00')).toBeInTheDocument()
    })
  })
})
