import { Types } from 'mongoose'

export type NewTaskDto = {
  title: string
  notes?: string
  time: string
  userId: Types.ObjectId
  locale: string
}

export type EditTaskDto = {
  title: string
  notes?: string
  time: string
  userId: Types.ObjectId
  taskId: Types.ObjectId
}

export type DeleteTaskDto = {
  userId: Types.ObjectId
  taskId: Types.ObjectId
}

export type ToggleTaskStatusDto = {
  taskId: Types.ObjectId
  userId: Types.ObjectId
  isRunning: boolean
  locale: string
}
