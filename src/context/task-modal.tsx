import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'

const INITIAL_TASK_MODAL_STATE = { isOpen: false, timezone: '' }

type TaskModalState = {
  isOpen: boolean
  timezone: string
}

/* Action */
export enum TaskModalActionTypes {
  TOGGLE_MODAL = '@toggle-modal',
  SET_TIMEZONE = '@set-timezone',
}
export interface TaskModalAction {
  type: TaskModalActionTypes
  payload: boolean | string
}

/** Reducer */
const taskModalReducer: (state: TaskModalState, action: TaskModalAction) => TaskModalState = (
  state = INITIAL_TASK_MODAL_STATE,
  action: TaskModalAction,
): TaskModalState => {
  console.log(action)

  switch (action.type) {
    case TaskModalActionTypes.TOGGLE_MODAL: {
      return {
        ...state,
        isOpen: action.payload as boolean,
      }
    }
    case TaskModalActionTypes.SET_TIMEZONE: {
      return {
        ...state,
        timezone: action.payload as string,
      }
    }
    default:
      return state
  }
}

/** Context */
export type TaskModalContextType = {
  state: TaskModalState
  dispatch: Dispatch<TaskModalAction>
}
export const TaskModalContext = createContext<TaskModalContextType>({
  state: INITIAL_TASK_MODAL_STATE,
  dispatch: () => ({}),
})

/** Provider */
export const TaskModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskModalReducer, INITIAL_TASK_MODAL_STATE)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <TaskModalContext.Provider value={value}>{children}</TaskModalContext.Provider>
}
