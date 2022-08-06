import { Schema, model, models, Model } from 'mongoose'
import { ITask, TaskSchema } from './task'

enum RecordStatus {
  IDLE = 'idle',
  RUNNING = 'running',
}

export interface IRecord {
  day: number
  week: number
  month: number
  year: number
  tasks: ITask[]
  status: RecordStatus
}

export const RecordSchema = new Schema<IRecord>({
  day: { type: Number, required: true },
  week: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  tasks: { type: [TaskSchema], required: true },
  status: {
    type: String,
    enum: Object.values(RecordStatus),
    default: RecordStatus.IDLE,
    required: true,
  },
})

export const Record = (models.Record as Model<IRecord>) || model<IRecord>('Record', RecordSchema)
