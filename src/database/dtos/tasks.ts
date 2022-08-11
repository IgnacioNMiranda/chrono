import { Types } from 'mongoose'

export type NewTaskDto = {
  title: string
  notes?: string
  time: string
  userId: Types.ObjectId
}

export type ToggleTaskStatusDto = {
  taskId: Types.ObjectId
  timezone?: string
  userId: Types.ObjectId
  isRunning: boolean
}
