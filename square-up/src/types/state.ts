import type { Member, Expense, Settlement } from './models'

export interface AppState {
  members: Member[]
  expenses: Expense[]
  settlements: Settlement[]
}

export type Action =
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'REMOVE_MEMBER'; payload: { id: string } }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'EDIT_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }
  | { type: 'ADD_SETTLEMENT'; payload: Settlement }
  | { type: 'LOAD_STATE'; payload: AppState }
