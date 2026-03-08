import type { Member, Expense, Settlement } from '../types/models'
import type { Balance } from '../types/api'

export const computeBalances = (
  members: Member[],
  expenses: Expense[],
  settlements: Settlement[]
): Balance[] => {
  const balances = new Map<string, Balance>()

  // Initialize all members with zero balances
  members.forEach((member) => {
    balances.set(member.id, {
      memberId: member.id,
      totalPaid: 0,
      totalOwed: 0,
      net: 0,
    })
  })

  // Calculate total paid and total owed from expenses
  expenses.forEach((expense) => {
    const balance = balances.get(expense.payerId)
    if (balance) {
      balance.totalPaid += expense.amount
    }

    expense.participants.forEach((participant) => {
      const balance = balances.get(participant.memberId)
      if (balance) {
        balance.totalOwed += participant.share
      }
    })
  })

  // Apply settlements
  settlements.forEach((settlement) => {
    const fromBalance = balances.get(settlement.fromId)
    const toBalance = balances.get(settlement.toId)

    if (fromBalance && toBalance) {
      // Settlement reduces debt: fromId paid toId
      // This reduces what fromId owes, increases what toId received
      fromBalance.totalPaid += settlement.amount
      toBalance.totalOwed -= settlement.amount
    }
  })

  // Calculate net balances (positive = owed money, negative = owes money)
  balances.forEach((balance) => {
    balance.net = balance.totalPaid - balance.totalOwed
  })

  return Array.from(balances.values())
}
