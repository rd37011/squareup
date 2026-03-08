import React, { createContext, useReducer, ReactNode, useMemo } from 'react'
import type { AppState } from '../types/state'
import type { ApiActions } from '../types/api'
import { appReducer, loadStateFromStorage } from './reducer'
import { createApi } from '../api'

interface AppContextValue extends AppState {
  api: ApiActions
}

const initialState: AppState = {
  members: [],
  expenses: [],
  settlements: [],
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)

interface AppContextProviderProps {
  children: ReactNode
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const storedState = useMemo(() => loadStateFromStorage(), [])

  const [state, dispatch] = useReducer(
    appReducer,
    storedState || initialState
  )

  const api = useMemo(() => createApi(dispatch), [])

  const value: AppContextValue = {
    ...state,
    api,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
