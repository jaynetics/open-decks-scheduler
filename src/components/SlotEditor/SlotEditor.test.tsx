import { fireEvent, render, screen } from '@testing-library/react'

import { Slot } from '@/types'

import SlotEditor from './SlotEditor'

describe('SlotEditor Component', () => {
  const mockSlot: Slot = {
    border: 2,
    borderBrightness: 9,
    duration: 20,
    height: 40,
    hour: 18,
    index: 0,
    minute: 20,
    roundness: 0,
  }

  const mockSlotZeroDuration: Slot = {
    ...mockSlot,
    duration: 0,
  }

  const mockProps = {
    slot: mockSlot,
    slotIndex: 0,
    timeFormat: '24h' as const,
    slotDefaultDuration: 20,
    onSave: jest.fn(),
    onDelete: jest.fn(),
    onInsert: jest.fn(),
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render slot editor with title', () => {
    render(<SlotEditor {...mockProps} />)
    expect(screen.getByText('Edit Slot 1 (18:20)')).toBeInTheDocument()
  })

  it('should render all input fields', () => {
    render(<SlotEditor {...mockProps} />)
    expect(screen.getByLabelText(/Special Content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Number of Raffles/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument()
  })

  it('should initialize fields with slot values', () => {
    const slotWithData: Slot = {
      ...mockSlot,
      special: 'Featured DJ',
      raffles: 2,
      duration: 30,
    }
    render(<SlotEditor {...mockProps} slot={slotWithData} />)

    expect(screen.getByLabelText(/Special Content/i)).toHaveValue('Featured DJ')
    expect(screen.getByLabelText(/Number of Raffles/i)).toHaveValue(2)
    expect(screen.getByLabelText(/Duration/i)).toHaveValue(30)
  })

  it('should call onSave with correct config when Save is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const specialInput = screen.getByLabelText(/Special Content/i)
    const rafflesInput = screen.getByLabelText(/Number of Raffles/i)

    fireEvent.change(specialInput, { target: { value: 'Test DJ' } })
    fireEvent.change(rafflesInput, { target: { value: '3' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {
      duration: 20,
      special: 'Test DJ',
      raffles: 3,
    })
  })

  it('should call onSave when Enter key is pressed in form', () => {
    render(<SlotEditor {...mockProps} />)

    const specialInput = screen.getByLabelText(/Special Content/i)
    const rafflesInput = screen.getByLabelText(/Number of Raffles/i)

    fireEvent.change(specialInput, { target: { value: 'Enter Test' } })
    fireEvent.change(rafflesInput, { target: { value: '2' } })

    // Submit the form by pressing Enter in an input field
    fireEvent.keyDown(specialInput, { key: 'Enter', code: 'Enter' })
    const form = specialInput.closest('form')
    if (form) fireEvent.submit(form)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {
      duration: 20,
      special: 'Enter Test',
      raffles: 2,
    })
  })

  it('should call onSave with empty config when Clear is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {})
  })

  it('should call onClose when Cancel is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when overlay is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const overlay = screen.getByText('Edit Slot 1 (18:20)').closest('.modal-overlay')
    if (overlay) fireEvent.click(overlay)

    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    render(<SlotEditor {...mockProps} />)

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when modal content is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const modalContent = screen.getByText('Edit Slot 1 (18:20)').closest('.modal-content')
    if (modalContent) fireEvent.click(modalContent)

    expect(mockProps.onClose).not.toHaveBeenCalled()
  })

  it('should call onInsert with correct parameters when Add Slot Above is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const addAboveButton = screen.getByText('Add Slot Above')
    fireEvent.click(addAboveButton)

    expect(mockProps.onInsert).toHaveBeenCalledWith(0, 'above')
  })

  it('should call onInsert with correct parameters when Add Slot Below is clicked', () => {
    render(<SlotEditor {...mockProps} />)

    const addBelowButton = screen.getByText('Add Slot Below')
    fireEvent.click(addBelowButton)

    expect(mockProps.onInsert).toHaveBeenCalledWith(0, 'below')
  })

  it('should call onDelete when delete is confirmed', () => {
    render(<SlotEditor {...mockProps} />)

    jest.spyOn(window, 'confirm').mockReturnValueOnce(true)
    fireEvent.click(screen.getByText('Delete Slot'))

    expect(mockProps.onDelete).toHaveBeenCalledWith(0)
  })

  it('should not call onDelete when delete is cancelled', () => {
    render(<SlotEditor {...mockProps} />)

    jest.spyOn(window, 'confirm').mockReturnValueOnce(false)
    fireEvent.click(screen.getByText('Delete Slot'))

    expect(mockProps.onDelete).not.toHaveBeenCalled()
  })

  it('should handle duration change correctly', () => {
    render(<SlotEditor {...mockProps} />)

    const durationInput = screen.getByLabelText(/Duration/i)
    fireEvent.change(durationInput, { target: { value: '45' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {
      duration: 45,
    })
  })

  it('should use fallback value 0 when raffles input is invalid', () => {
    render(<SlotEditor {...mockProps} />)

    const rafflesInput = screen.getByLabelText(/Number of Raffles/i)
    fireEvent.change(rafflesInput, { target: { value: '' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {
      duration: 20,
      raffles: 0,
    })
  })

  it('should use fallback duration 0 when duration input is invalid', () => {
    render(<SlotEditor {...mockProps} />)

    const durationInput = screen.getByLabelText(/Duration/i)
    fireEvent.change(durationInput, { target: { value: '' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {
      duration: 0,
      raffles: undefined,
      special: undefined,
    })
  })

  it('should use fallback values for both invalid inputs', () => {
    render(<SlotEditor {...mockProps} />)

    const rafflesInput = screen.getByLabelText(/Number of Raffles/i)
    const durationInput = screen.getByLabelText(/Duration/i)

    fireEvent.change(rafflesInput, { target: { value: 'abc' } })
    fireEvent.change(durationInput, { target: { value: 'xyz' } })

    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    expect(mockProps.onSave).toHaveBeenCalledWith(0, {
      duration: 0,
      raffles: 0,
      special: undefined,
    })
  })

  it('should show 0 when slot duration is 0', () => {
    const propsWithZeroDuration = {
      ...mockProps,
      slot: mockSlotZeroDuration,
    }
    render(<SlotEditor {...propsWithZeroDuration} />)

    const durationInput = screen.getByLabelText(/Duration/i)
    expect(durationInput).toHaveValue(0) // Should show actual value when duration is 0
  })
})
