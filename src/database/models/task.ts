import { Schema, model, models, Model, SchemaTypes } from 'mongoose'
import { IRecord } from './record'

export interface ITask {
  title: string
  notes?: string
  last_run: Date
  acc_time_secs: number
  record: IRecord
}

export const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  notes: String,
  last_run: { type: Date, required: true },
  acc_time_secs: { type: Number, required: true },
  record: {
    type: SchemaTypes.ObjectId,
    ref: 'Record',
    required: true,
  },
})

export const Task = (models.Task as Model<ITask>) || model<ITask>('Task', TaskSchema)
