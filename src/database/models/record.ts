import { Schema, model, models, Model, SchemaTypes, HydratedDocument } from 'mongoose'
import { ITask } from './task'
import { IUser } from './user'

export interface IRecord {
  day: number
  week: number
  month: number
  year: number
  tasks: HydratedDocument<ITask>[]
  user: HydratedDocument<IUser>
  hasTaskRunning: boolean
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
    default: [],
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  hasTaskRunning: { type: Boolean, required: true, default: false },
})

RecordSchema.index({ day: 1, week: 1, month: 1, year: -1 })

export const Record = (models.Record as Model<IRecord>) || model<IRecord>('Record', RecordSchema)
