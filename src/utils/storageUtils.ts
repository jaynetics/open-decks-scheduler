import { useEffect, useMemo } from 'react'

import { gunzipSync, gzipSync, strFromU8, strToU8 } from 'fflate'

import { DEFAULTS } from '@/constants'
import { SlotConfig, TimeFormat } from '@/types'

export interface PersistedAppState {
  d: Partial<PersistedAppData>
  v: number
}

export interface PersistedAppData {
  slotBorder: number
  slotBorderBrightness: number
  slotConfigs: SlotConfig[]
  slotDefaultDuration: number
  slotHeight: number
  slotRoundness: number
  startHour: number
  startMinute: number
  timeFormat: TimeFormat
}

const CURRENT_VERSION = 1

/**
 * Generates a shareable URL with the current app state
 */
export function generateShareableURL(data: PersistedAppData): string {
  try {
    const compressed = compressState({ d: data, v: CURRENT_VERSION })
    // *** Save only non-default values to reduce URL length: ***
    // const dataToSave: Partial<PersistedAppData> = {}
    // Object.entries(data).forEach(([k, v]) => {
    //   if (JSON.stringify(v) !== JSON.stringify(DEFAULTS[k as keyof PersistedAppData])) {
    //     dataToSave[k as keyof PersistedAppData] = v
    //   }
    // })
    // const compressed = compressState({ d: dataToSave, v: CURRENT_VERSION })
    const url = new URL(window.location.origin + window.location.pathname)
    url.hash = compressed
    return url.toString()
  } catch (error) {
    console.error('Failed to generate shareable URL:', error)
    return 'ERROR'
  }
}

export function useAppStateFromURL(): PersistedAppData {
  // load state from URL hash
  const state = useMemo(() => loadAppState(), [])

  // clear hash after state has been loaded
  useEffect(() => {
    window.location.hash = ''
  }, [])

  return state
}

/**
 * Loads the app state from the URL hash, or returns defaults if not found
 */
export function loadAppState(): PersistedAppData {
  try {
    const hash = window.location.hash.slice(1) // Remove the # character
    if (!hash) {
      return DEFAULTS
    }

    const state = decompressState(hash)

    if (!isValidState(state)) {
      console.warn('Invalid state in URL, ignoring')
      return DEFAULTS
    }

    // Handle version migrations here if needed in the future
    if (state.v !== CURRENT_VERSION) {
      console.info(`Migrating state from version ${state.v} to ${CURRENT_VERSION}`)
      // Add migration logic here when needed
    }

    const data: PersistedAppData = {
      ...DEFAULTS,
      ...state.d,
    }

    return data
  } catch (error) {
    console.error('Failed to load app state:', error)
    return DEFAULTS
  }
}

/**
 * Compresses the state object to a base64 string for URL storage using modern compression APIs
 */
export function compressState(state: Partial<PersistedAppState>): string {
  try {
    // Convert state to JSON string, encode to bytes, then compress
    const json = JSON.stringify(state)
    const buf = strToU8(json)
    const compressedData = gzipSync(buf)

    // Convert to base64 for URL-safe storage
    return encodeURIComponent(btoa(String.fromCharCode(...compressedData)))
  } catch (error) {
    throw new Error(`Failed to compress state: ${errorMessage(error)}`)
  }
}

/**
 * Decompresses a base64 string back to the state object
 */
export function decompressState(compressed: string): PersistedAppState {
  try {
    // Convert base64 to bytes, then decompress and parse JSON
    const binaryString = atob(decodeURIComponent(compressed))
    const buf = strToU8(binaryString, true)
    const decompressedData = gunzipSync(buf)
    const str = strFromU8(decompressedData)
    return JSON.parse(str)
  } catch (error) {
    throw new Error(`Failed to decompress state: ${errorMessage(error)}`)
  }
}

/**
 * Validates that a state object has the expected shape
 */
function isValidState(state: Partial<PersistedAppState>): state is PersistedAppState {
  return typeof state.v === 'number' && state.v <= CURRENT_VERSION && typeof state.d === 'object'
}

/**
 * Formats an error message with proper error handling
 */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}
