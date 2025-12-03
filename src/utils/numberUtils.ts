// Parses a string to an integer, returning 0 if parsing fails.
export function parseIntOrZero(value: string): number {
  return parseInt(value, 10) || 0
}
