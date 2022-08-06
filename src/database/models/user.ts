import { Schema, model, models, Model, SchemaTypes } from 'mongoose'
import { IRecord, RecordSchema } from './record'

export interface IUser {
  email: string
  timezone: string
  provider: string
  records: IRecord[]
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true },
  timezone: { type: String, required: true },
  provider: { type: String, required: true },
  records: {
    type: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'Record',
        required: true,
      },
    ],
    required: true,
  },
})

export const User = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)
