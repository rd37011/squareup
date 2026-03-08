import type { Balance, DebtSuggestion } from '../types/api'
import type { Member } from '../types/models'

export const computeSimplifiedDebts = (
  balances: Balance[],
  members: Member[]
): DebtSuggestion[] => {
  const suggestions: DebtSuggestion[] = []

  // Create working copies for the algorithm
  const creditors = balances
    .filter((b) => b.net > 0.01) // positive = owed money
    .map((b) => ({ ...b }))
    .sort((a, b) => b.net - a.net)

  const debtors = balances
    .filter((b) => b.net < -0.01) // negative = owes money
    .map((b) => ({ ...b }))
    .sort((a, b) => a.net - b.net)

  // Greedy matching: largest creditor with largest debtor
  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0]
    const debtor = debtors[0]

    const amount = Math.min(
      creditor.net,
      Math.abs(debtor.net)
    )

    // Round to 2 decimal places
    const roundedAmount = Math.round(amount * 100) / 100

    if (roundedAmount > 0.01) {
      suggestions.push({
        fromId: debtor.memberId,
        toId: creditor.memberId,
        amount: roundedAmount,
      })
    }

    creditor.net -= amount
    debtor.net += amount

    // Remove if settled
    if (creditor.net < 0.01) creditors.shift()
    if (debtor.net > -0.01) debtors.shift()
  }

  return suggestions
}
