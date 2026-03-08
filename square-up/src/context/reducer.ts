import type { AppState, Action } from '../types/state'

const STORAGE_KEY = 'squareup_state'

export const appReducer = (state: AppState, action: Action): AppState => {
  let newState: AppState

  switch (action.type) {
    case 'ADD_MEMBER':
      newState = {
        ...state,
        members: [...state.members, action.payload],
      }
      break

    case 'REMOVE_MEMBER':
      newState = {
        ...state,
        members: state.members.filter((m) => m.id !== action.payload.id),
      }
      break

    case 'ADD_EXPENSE':
      newState = {
        ...state,
        expenses: [...state.expenses, action.payload],
      }
      break

    case 'EDIT_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
      break

    case 'DELETE_EXPENSE':
      newState = {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload.id),
      }
      break

    case 'ADD_SETTLEMENT':
      newState = {
        ...state,
        settlements: [...state.settlements, action.payload],
      }
      break

    case 'LOAD_STATE':
      newState = action.payload
      break

    default:
      return state
  }

  // Persist to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))

  return newState
}

export const loadStateFromStorage = (): AppState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
  }
  return null
}
