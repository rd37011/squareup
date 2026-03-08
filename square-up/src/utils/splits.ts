import type { Participant } from '../types/models'

export const calculateEqualSplit = (amount: number, count: number): number => {
  if (count === 0) return 0
  return Math.round((amount / count) * 100) / 100
}

export const validateAmountSplit = (
  participants: Participant[],
  total: number
): { valid: boolean; error?: string } => {
  const sum = participants.reduce((acc, p) => acc + p.share, 0)
  const rounded = Math.round(sum * 100) / 100
  const roundedTotal = Math.round(total * 100) / 100

  if (Math.abs(rounded - roundedTotal) > 0.01) {
    return {
      valid: false,
      error: `Total shares (${rounded.toFixed(2)}) must equal expense amount (${roundedTotal.toFixed(2)})`,
    }
  }

  return { valid: true }
}

export const validatePercentSplit = (
  participants: Participant[]
): { valid: boolean; error?: string } => {
  const sum = participants.reduce((acc, p) => acc + p.share, 0)
  const rounded = Math.round(sum * 100) / 100

  if (Math.abs(rounded - 100) > 0.01) {
    return {
      valid: false,
      error: `Total percentages (${rounded.toFixed(2)}%) must equal 100%`,
    }
  }

  return { valid: true }
}
