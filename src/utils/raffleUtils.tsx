import { Slot, SlotConfig } from '@/types'

export const RaffleWarning: React.FC<{ slots: Slot[] }> = ({ slots }) => {
  const totalRaffles = slots.reduce((sum, slot) => sum + (slot.raffles || 0), 0)
  const nonSpecialSlots = slots.filter((slot) => !slot.special).length

  if (totalRaffles === nonSpecialSlots) return null

  return (
    <div className="ui raffle-warning">
      ⚠️ You have {nonSpecialSlots} free slot(s) but {totalRaffles} raffle(s).
    </div>
  )
}

export function autoAssignRaffles(slotConfigs: SlotConfig[]): SlotConfig[] {
  const newConfigs = [...slotConfigs]

  // First, count total non-special slots
  const nonSpecialIndices: number[] = []
  newConfigs.forEach((config, index) => {
    if (!config.special) {
      nonSpecialIndices.push(index)
    }
  })

  const totalNonSpecial = nonSpecialIndices.length
  const isOdd = totalNonSpecial % 2 === 1

  // Clear all existing raffles first
  newConfigs.forEach((config, index) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { raffles, ...rest } = config
    newConfigs[index] = rest
  })

  if (nonSpecialIndices.length === 0) {
    return newConfigs
  }

  // Always start with a raffle
  newConfigs[nonSpecialIndices[0]] = { ...newConfigs[nonSpecialIndices[0]], raffles: 2 }

  if (isOdd) {
    // For odd number of slots: (n-1)/2 raffles, last one is 3x
    const numRaffles = (totalNonSpecial - 1) / 2
    let raffleCount = 1

    // Add 2x raffles to slots 1, 3, 5, etc.
    for (let i = 1; i < nonSpecialIndices.length && raffleCount < numRaffles; i += 2) {
      const slotIndex = nonSpecialIndices[i]
      raffleCount++

      // Make the last raffle 3x instead of 2x
      if (raffleCount === numRaffles) {
        newConfigs[slotIndex] = { ...newConfigs[slotIndex], raffles: 3 }
      } else {
        newConfigs[slotIndex] = { ...newConfigs[slotIndex], raffles: 2 }
      }
    }
  } else {
    // For even number of slots: n/2 raffles, all 2x
    for (let i = 1; i < nonSpecialIndices.length - 1; i += 2) {
      const slotIndex = nonSpecialIndices[i]
      newConfigs[slotIndex] = { ...newConfigs[slotIndex], raffles: 2 }
    }
  }

  return newConfigs
}
