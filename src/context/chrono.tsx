import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'

const INITIAL_TASK_MODAL_STATE = { isOpen: false, timezone: '', user: '' }

type ChronoState = {
  isOpen: boolean
  timezone: string
  user: string
}

/* Action */
export enum ChronoActionTypes {
  TOGGLE_MODAL = '@toggle-modal',
  SET_TIMEZONE = '@set-timezone',
  SET_USER = '@set-user',
}
export interface ChronoAction {
  type: ChronoActionTypes
  payload: boolean | string
}

/** Reducer */
const chronoReducer: (state: ChronoState, action: ChronoAction) => ChronoState = (
  state = INITIAL_TASK_MODAL_STATE,
  action: ChronoAction,
): ChronoState => {
  switch (action.type) {
    case ChronoActionTypes.TOGGLE_MODAL: {
      return {
        ...state,
        isOpen: action.payload as boolean,
      }
    }
    case ChronoActionTypes.SET_TIMEZONE: {
      return {
        ...state,
        timezone: action.payload as string,
      }
    }
    case ChronoActionTypes.SET_USER: {
      return {
        ...state,
        user: action.payload as string,
      }
    }
    default:
      return state
  }
}

/** Context */
export type ChronoContextType = {
  state: ChronoState
  dispatch: Dispatch<ChronoAction>
}
export const ChronoContext = createContext<ChronoContextType>({
  state: INITIAL_TASK_MODAL_STATE,
  dispatch: () => ({}),
})

/** Provider */
export const ChronoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chronoReducer, INITIAL_TASK_MODAL_STATE)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <ChronoContext.Provider value={value}>{children}</ChronoContext.Provider>
}
