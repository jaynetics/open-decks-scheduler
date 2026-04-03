import { fireEvent, render, screen } from '@testing-library/react'

import { useApp } from '@/context/AppContext'
import { createMockAppContext, createMockSlot } from '@/utils/testUtils'

import SlotEditor from './SlotEditor'

jest.mock('@/context/AppContext', () => ({
  useApp: jest.fn(),
}))

describe('SlotEditor Component', () => {
  const mockSlot = createMockSlot()
  const mockContext = createMockAppContext({ editingSlot: 0, slots: [mockSlot] })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useApp as jest.Mock).mockReturnValue(mockContext)
  })

  it('should render the slot time in title', () => {
    render(<SlotEditor />)
    expect(screen.getByText(/18:20/)).toBeInTheDocument()
  })

  it('should initialize inputs with slot values', () => {
    const customSlot = { ...mockSlot, special: 'Special Guest', raffles: 2, duration: 45 }
    ;(useApp as jest.Mock).mockReturnValue({
      ...mockContext,
      slots: [customSlot],
    })

    render(<SlotEditor />)

    expect(screen.getByLabelText(/Special Content/i)).toHaveValue('Special Guest')
    expect(screen.getByLabelText(/Number of Raffles/i)).toHaveValue(2)
    expect(screen.getByLabelText(/Duration/i)).toHaveValue(45)
  })

  it('should call updateSlotConfig on save', () => {
    render(<SlotEditor />)

    const specialInput = screen.getByLabelText(/Special Content/i)
    fireEvent.change(specialInput, { target: { value: 'Updated Content' } })

    const form = screen.getByText('Save').closest('form')
    fireEvent.submit(form!)

    expect(mockContext.updateSlotConfig).toHaveBeenCalledWith(
      0,
      expect.objectContaining({
        special: 'Updated Content',
        raffles: 0,
        duration: 20,
      })
    )
  })

  it('should call updateSlotConfig with empty object on clear', () => {
    render(<SlotEditor />)

    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    expect(mockContext.updateSlotConfig).toHaveBeenCalledWith(0, {})
  })

  it('should call deleteSlot on delete confirmation', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)

    render(<SlotEditor />)
    const deleteButton = screen.getByText('Delete Slot')
    fireEvent.click(deleteButton)

    expect(mockContext.deleteSlot).toHaveBeenCalledWith(0)
    confirmSpy.mockRestore()
  })

  it('should call setEditingSlot(null) on close', () => {
    render(<SlotEditor />)
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockContext.setEditingSlot).toHaveBeenCalledWith(null)
  })

  it('should close on escape key', () => {
    render(<SlotEditor />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockContext.setEditingSlot).toHaveBeenCalledWith(null)
  })

  it('should call insertSlot above', () => {
    render(<SlotEditor />)
    const insertButton = screen.getByText('Add Slot Above')
    fireEvent.click(insertButton)
    expect(mockContext.insertSlot).toHaveBeenCalledWith(0, 'above')
  })

  it('should call insertSlot below', () => {
    render(<SlotEditor />)
    const insertButton = screen.getByText('Add Slot Below')
    fireEvent.click(insertButton)
    expect(mockContext.insertSlot).toHaveBeenCalledWith(0, 'below')
  })

  it('should render nothing when editingSlot is null', () => {
    ;(useApp as jest.Mock).mockReturnValue({
      ...mockContext,
      editingSlot: null,
    })

    const { container } = render(<SlotEditor />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render nothing when slot does not exist', () => {
    ;(useApp as jest.Mock).mockReturnValue({
      ...mockContext,
      editingSlot: 5, // Index out of bounds
      slots: [mockSlot], // Only one slot exists
    })

    const { container } = render(<SlotEditor />)
    expect(container).toBeEmptyDOMElement()
  })
})
