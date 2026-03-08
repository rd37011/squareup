import type { Dispatch } from 'react'
import type { Action } from '../types/state'
import type { ApiActions } from '../types/api'
import type { Member, Expense, Settlement } from '../types/models'

export const createApi = (dispatch: Dispatch<Action>): ApiActions => ({
  addMember: (member: Member) =>
    dispatch({ type: 'ADD_MEMBER', payload: member }),

  removeMember: (id: string) =>
    dispatch({ type: 'REMOVE_MEMBER', payload: { id } }),

  addExpense: (expense: Expense) =>
    dispatch({ type: 'ADD_EXPENSE', payload: expense }),

  editExpense: (expense: Expense) =>
    dispatch({ type: 'EDIT_EXPENSE', payload: expense }),

  deleteExpense: (id: string) =>
    dispatch({ type: 'DELETE_EXPENSE', payload: { id } }),

  markSettled: (settlement: Settlement) =>
    dispatch({ type: 'ADD_SETTLEMENT', payload: settlement }),
})
