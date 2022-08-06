import { Schema, model } from 'mongoose'
import { IRecord, RecordSchema } from './record'

interface IUser {
  email: string
  timezone: string
  provider: string
  records: IRecord[]
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true },
  timezone: { type: String, required: true },
  provider: { type: String, required: true },
  records: { type: [RecordSchema], required: true },
})

export const User = model<IUser>('User', UserSchema)
