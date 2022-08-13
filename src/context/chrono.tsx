import { QueryObserverBaseResult } from '@tanstack/react-query'
import { HydratedDocument, Types } from 'mongoose'
import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'
import { ITask } from '../database/models'

const INITIAL_TASK_MODAL_STATE: ChronoState = {
  isOpen: false,
  timezone: '',
  user: undefined,
  editedTask: undefined,
  refetch: undefined,
}

type ChronoState = {
  isOpen: boolean
  timezone: string
  user?: Types.ObjectId
  editedTask?: HydratedDocument<ITask>
  dynamicAccTimeSecs?: number
  refetch?: () => Promise<QueryObserverBaseResult>
}

/* Action */
export enum ChronoActionTypes {
  TOGGLE_MODAL = '@toggle-modal',
  SET_TIMEZONE = '@set-timezone',
  SET_USER = '@set-user',
  SET_REFETCH_USER = '@set-refetch-user',
  SET_EDITED_TASK = '@set-edited-task',
  SET_DYNAMIC_ACC_TIME_SECS = '@set-dynamic-acc-time-secs',
}
export interface ChronoAction {
  type: ChronoActionTypes
  payload:
    | boolean
    | number
    | string
    | HydratedDocument<ITask>
    | Types.ObjectId
    | ChronoState['refetch']
}

/** Reducer */
const chronoReducer: (state: ChronoState, action: ChronoAction) => ChronoState = (
  state = INITIAL_TASK_MODAL_STATE,
  action: ChronoAction,
): ChronoState => {
  switch (action.type) {
    case ChronoActionTypes.TOGGLE_MODAL: {
      const isOpen = action.payload as boolean
      if (isOpen) document.body.style.overflow = 'hidden'
      else document.body.style.overflow = 'auto'

      return {
        ...state,
        isOpen,
        editedTask: !isOpen ? undefined : state.editedTask,
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
        user: action.payload as Types.ObjectId,
      }
    }
    case ChronoActionTypes.SET_REFETCH_USER: {
      return {
        ...state,
        refetch: action.payload as ChronoState['refetch'],
      }
    }
    case ChronoActionTypes.SET_EDITED_TASK: {
      return {
        ...state,
        editedTask: action.payload as HydratedDocument<ITask>,
      }
    }
    case ChronoActionTypes.SET_DYNAMIC_ACC_TIME_SECS: {
      return {
        ...state,
        dynamicAccTimeSecs: action.payload as number,
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
