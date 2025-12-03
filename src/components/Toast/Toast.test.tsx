import { act } from 'react'

import { render, screen } from '@testing-library/react'

import Toast from './Toast'

describe('Toast Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should display the message', async () => {
    render(<Toast message="Test message" />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('should hide itself after a while', async () => {
    render(<Toast message="Test message" />)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.queryByText('Test message')).toBeNull()
  })
})
