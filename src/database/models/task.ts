import { Schema, model } from 'mongoose'

export interface ITask {
  title: string
  notes?: string
  last_run: Date
  acc_time_secs: number
}

export const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  notes: String,
  last_run: { type: Date, required: true },
  acc_time_secs: { type: Number, required: true },
})

export const Task = model<ITask>('Task', TaskSchema)
