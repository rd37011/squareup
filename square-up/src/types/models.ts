export type SplitType = 'equal' | 'amount' | 'percent'

export interface Participant {
  memberId: string
  share: number  // dollar amount owed
}

export interface Member {
  id: string
  name: string
  createdAt: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  payerId: string
  date: string  // ISO date string
  splitType: SplitType
  participants: Participant[]
  createdAt: string
}

export interface Settlement {
  id: string
  fromId: string
  toId: string
  amount: number
  settledAt: string
  createdAt: string
}
