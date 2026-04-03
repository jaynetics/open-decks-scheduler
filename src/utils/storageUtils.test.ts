import { renderHook } from '@testing-library/react'

import { DEFAULTS } from '@/constants'

import {
  PersistedAppData,
  PersistedAppState,
  compressState,
  decompressState,
  errorMessage,
  generateShareableURL,
  loadAppState,
  useAppStateFromURL,
} from './storageUtils'

describe('Storage Utilities', () => {
  describe('generateShareableURL', () => {
    it('should generate URL with state in hash', () => {
      const data: PersistedAppData = {
        startHour: 18,
        startMinute: 20,
        timeFormat: '24h',
        slotHeight: 45,
        slotDefaultDuration: 20,
        slotBorder: 2,
        slotBorderBrightness: 9,
        slotRoundness: 10,
        slotConfigs: [{ raffles: 2 }],
      }

      const url = generateShareableURL(data)
      expect(url).toContain('http://localhost/#')

      // Verify the hash contains valid encoded state in new format
      const hash = url.split('#')[1]
      const decoded = decompressState(hash)
      expect(decoded).toMatchObject({
        v: 1,
        d: data,
      })
    })

    it('should handle complex slot configs', () => {
      const data = {
        slotConfigs: [
          { raffles: 3, special: 'Opening DJ', duration: 45 },
          { raffles: 1 },
          { special: 'Featured Set' },
          { duration: 60 },
        ],
      }

      const url = generateShareableURL(data as unknown as PersistedAppData)

      const hash = url.split('#')[1]
      const decoded = decompressState(hash)
      expect(decoded.d.slotConfigs).toEqual(data.slotConfigs)
    })

    it('should handle errors gracefully and return "ERROR"', () => {
      // Silence console.error output for this test
      jest.spyOn(console, 'error').mockReturnValueOnce(undefined)

      // Mock btoa to throw an error
      jest.spyOn(window, 'btoa').mockImplementationOnce(() => {
        throw new Error('Encoding failed')
      })

      const url = generateShareableURL({} as PersistedAppData)

      expect(url).toBe('ERROR')
    })
  })

  describe('loadAppState', () => {
    it('should load state from URL hash', () => {
      const testData: PersistedAppData = {
        startHour: 18,
        startMinute: 20,
        timeFormat: '24h',
        slotHeight: 45,
        slotDefaultDuration: 20,
        slotBorder: 2,
        slotBorderBrightness: 9,
        slotRoundness: 10,
        slotConfigs: [{ raffles: 2 }],
      }

      const state: PersistedAppState = {
        v: 1,
        d: testData,
      }

      // Set hash with encoded state
      window.location.hash = '#' + compressState(state)

      const loaded = loadAppState()

      expect(loaded).toEqual(testData)
    })

    it('should return defaults for empty hash', () => {
      window.location.hash = ''

      const loaded = loadAppState()

      expect(loaded).toEqual(DEFAULTS)
    })

    it('should handle invalid base64 in hash', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      window.location.hash = '#invalid-base64!'

      const loaded = loadAppState()

      expect(loaded).toEqual(DEFAULTS)
      expect(consoleError).toHaveBeenCalledWith('Failed to load app state:', expect.any(Error))

      consoleError.mockRestore()
    })

    it('should handle invalid JSON in hash', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      window.location.hash = '#' + btoa(encodeURIComponent('not-json'))

      const loaded = loadAppState()

      expect(loaded).toEqual(DEFAULTS)
      expect(consoleError).toHaveBeenCalledWith('Failed to load app state:', expect.any(Error))

      consoleError.mockRestore()
    })

    it('should handle missing fields with defaults', () => {
      // Mock console.error to suppress expected error output
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      // State with only minimal fields
      const state: PersistedAppState = {
        v: 1,
        d: {
          startHour: 18,
        } as PersistedAppData,
      }
      window.location.hash = '#' + btoa(encodeURIComponent(JSON.stringify(state)))

      const loaded = loadAppState()

      // Should load with defaults for missing fields
      expect(loaded.startHour).toBe(18) // from state
      expect(loaded.slotHeight).toBe(44) // from DEFAULTS
      expect(loaded.slotBorderBrightness).toBe(9) // from DEFAULTS

      // Verify error was logged and restore console.error
      expect(consoleError).toHaveBeenCalledWith('Failed to load app state:', expect.any(Error))
      consoleError.mockRestore()
    })

    it('should warn and return defaults for states with too high version', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation()

      const state: PersistedAppState = {
        v: 2, // Version higher than CURRENT_VERSION (1)
        d: { startHour: 18 } as PersistedAppData,
      }
      window.location.hash = '#' + compressState(state)

      const loaded = loadAppState()

      expect(loaded).toEqual(DEFAULTS)
      expect(consoleWarn).toHaveBeenCalledWith('Invalid state in URL, ignoring')

      consoleWarn.mockRestore()
    })

    it('should log migration info for version below current version', () => {
      const consoleInfo = jest.spyOn(console, 'info').mockImplementation()

      const state: PersistedAppState = {
        v: 0, // Old version
        d: { startHour: 23 } as PersistedAppData,
      }
      window.location.hash = '#' + compressState(state)

      const loaded = loadAppState()

      expect(loaded.startHour).toBe(23)
      expect(consoleInfo).toHaveBeenCalledWith('Migrating state from version 0 to 1')

      consoleInfo.mockRestore()
    })
  })

  describe('Round-trip persistence', () => {
    it('should generate and load state correctly', () => {
      const originalState: PersistedAppData = {
        startHour: 22,
        startMinute: 45,
        timeFormat: '24h',
        slotHeight: 55,
        slotDefaultDuration: 15,
        slotBorder: 2,
        slotBorderBrightness: 9,
        slotRoundness: 20,
        slotConfigs: [
          { raffles: 3, special: 'Opening', duration: 30 },
          { raffles: 1 },
          { special: 'Main Event' },
        ],
      }

      // Generate URL
      const url = generateShareableURL(originalState)

      // Extract the hash from the generated URL
      const hash = url.split('#')[1]
      window.location.hash = '#' + hash

      // Load state
      const loaded = loadAppState()

      expect(loaded).toEqual(originalState)
    })

    it('should handle special characters in slot configs', () => {
      const originalState = {
        slotConfigs: [
          { special: 'DJ Set: "Rock & Roll"' },
          { special: 'Live Band <The Rockers>' },
          { special: 'Open Decks @ 9PM' },
        ],
      }

      const url = generateShareableURL(originalState as unknown as PersistedAppData)

      const hash = url.split('#')[1]
      window.location.hash = '#' + hash

      const loaded = loadAppState()

      expect(loaded.slotConfigs).toEqual(originalState.slotConfigs)
    })
  })

  describe('compressState error handling', () => {
    it('should wrap errors with descriptive message', () => {
      const originalStringify = JSON.stringify
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('Test error')
      })

      expect(() => compressState({ v: 1, d: DEFAULTS })).toThrow(
        'Failed to compress state: Test error'
      )

      JSON.stringify = originalStringify
    })
  })

  describe('decompressState error handling', () => {
    it('should wrap errors with descriptive message', () => {
      expect(() => decompressState('invalid-data')).toThrow('Failed to decompress state:')
    })
  })

  describe('errorMessage', () => {
    it('should handle Error instances', () => {
      const error = new Error('Test error message')
      expect(errorMessage(error)).toBe('Test error message')
    })

    it('should handle string errors', () => {
      expect(errorMessage('String error')).toBe('String error')
    })

    it('should handle unknown error types', () => {
      expect(errorMessage(123)).toBe('Unknown error')
      expect(errorMessage(null)).toBe('Unknown error')
      expect(errorMessage(undefined)).toBe('Unknown error')
      expect(errorMessage({ message: 'not an Error instance' })).toBe('Unknown error')
    })
  })

  describe('useAppStateFromURL', () => {
    it('should return default state and clear hash on mount', () => {
      window.location.hash = '#some-hash'
      const state: PersistedAppState = { v: 1, d: { startHour: 10 } as PersistedAppData }
      window.location.hash = '#' + compressState(state)

      const { result } = renderHook(() => useAppStateFromURL())

      expect(result.current.startHour).toBe(10)
      expect(window.location.hash).toBe('')
    })

    it('should memoize the state', () => {
      const { result, rerender } = renderHook(() => useAppStateFromURL())
      const initialResult = result.current

      rerender()

      expect(result.current).toBe(initialResult)
    })
  })
})
