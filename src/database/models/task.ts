import { Schema, model, models, Model, SchemaTypes, HydratedDocument } from 'mongoose'
import { TaskStatus } from '../enums'
import { IRecord } from './record'

export interface ITask {
  title: string
  notes?: string
  lastRun?: Date
  accTimeSecs: number
  record: HydratedDocument<IRecord>
  status: TaskStatus
}

export const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  notes: String,
  lastRun: { type: Date },
  accTimeSecs: { type: Number, required: true },
  record: {
    type: SchemaTypes.ObjectId,
    ref: 'Record',
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.IDLE,
    required: true,
  },
})

export const Task = (models.Task as Model<ITask>) || model<ITask>('Task', TaskSchema)
