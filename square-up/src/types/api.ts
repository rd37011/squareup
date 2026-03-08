import type { Member, Expense, Settlement } from './models'

export interface ApiActions {
  addMember: (member: Member) => void
  removeMember: (id: string) => void
  addExpense: (expense: Expense) => void
  editExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  markSettled: (settlement: Settlement) => void
}

export interface Balance {
  memberId: string
  totalPaid: number
  totalOwed: number
  net: number  // positive = owed money, negative = owes money
}

export interface DebtSuggestion {
  fromId: string
  toId: string
  amount: number
}
