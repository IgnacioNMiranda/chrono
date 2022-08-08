import { Schema, model, models, Model, SchemaTypes } from 'mongoose'
import { IRecord } from './record'

export interface ITask {
  title: string
  notes?: string
  lastRun: Date
  accTimeSecs: number
  record: IRecord
}

export const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  notes: String,
  lastRun: { type: Date, required: true },
  accTimeSecs: { type: Number, required: true },
  record: {
    type: SchemaTypes.ObjectId,
    ref: 'Record',
    required: true,
  },
})

export const Task = (models.Task as Model<ITask>) || model<ITask>('Task', TaskSchema)
