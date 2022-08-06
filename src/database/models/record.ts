import { Schema, model, models, Model, SchemaTypes } from 'mongoose'
import { ITask } from './task'
import { IUser } from './user'

export enum RecordStatus {
  IDLE = 'idle',
  RUNNING = 'running',
}

export interface IRecord {
  day: number
  week: number
  month: number
  year: number
  tasks: ITask[]
  user: IUser
  status: RecordStatus
}

export const RecordSchema = new Schema<IRecord>({
  day: { type: Number, required: true },
  week: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  tasks: {
    type: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Task',
      },
    ],
    required: true,
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(RecordStatus),
    default: RecordStatus.IDLE,
    required: true,
  },
})

RecordSchema.index({ day: 1, week: 1, month: 1, year: -1 })

export const Record = (models.Record as Model<IRecord>) || model<IRecord>('Record', RecordSchema)
