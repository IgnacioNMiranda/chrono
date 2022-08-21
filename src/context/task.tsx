import { HydratedDocument } from 'mongoose'
import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'
import { ITask } from '../database/models'

const INITIAL_TASK_MODAL_STATE: TaskState = {
  isOpen: false,
  editedTask: undefined,
}

type TaskState = {
  isOpen: boolean
  editedTask?: HydratedDocument<ITask>
  dynamicAccTimeSecs?: number
}

/* Action */
export enum TaskActionTypes {
  TOGGLE_MODAL = '@toggle-modal',
  SET_EDITED_TASK = '@set-edited-task',
  SET_DYNAMIC_ACC_TIME_SECS = '@set-dynamic-acc-time-secs',
}
export interface TaskAction {
  type: TaskActionTypes
  payload: boolean | number | HydratedDocument<ITask> | undefined
}

/** Reducer */
const TaskReducer: (state: TaskState, action: TaskAction) => TaskState = (
  state = INITIAL_TASK_MODAL_STATE,
  action: TaskAction,
): TaskState => {
  switch (action.type) {
    case TaskActionTypes.TOGGLE_MODAL: {
      const isOpen = action.payload as boolean
      if (isOpen) document.body.style.overflow = 'hidden'
      else document.body.style.overflow = 'auto'

      return {
        ...state,
        isOpen,
        editedTask: !isOpen ? undefined : state.editedTask,
      }
    }
    case TaskActionTypes.SET_EDITED_TASK: {
      return {
        ...state,
        editedTask: action.payload as HydratedDocument<ITask>,
      }
    }
    case TaskActionTypes.SET_DYNAMIC_ACC_TIME_SECS: {
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
export type TaskContextType = {
  state: TaskState
  dispatch: Dispatch<TaskAction>
}
export const TaskContext = createContext<TaskContextType>({
  state: INITIAL_TASK_MODAL_STATE,
  dispatch: () => ({}),
})

/** Provider */
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(TaskReducer, INITIAL_TASK_MODAL_STATE)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
