import { Schema, model, models, Model, SchemaTypes, HydratedDocument } from 'mongoose'
import { IRecord } from './record'

export interface IUser {
  email: string
  timezone: string
  provider: string
  records: HydratedDocument<IRecord>[]
  backgroundImage?: string
  thumbnailImage?: string
  thumbnailImagePosition?: string
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
  backgroundImage: { type: String, required: false },
  thumbnailImage: { type: String, required: false },
  thumbnailImagePosition: { type: String, required: false },
})

export const User = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)
