import { Types } from 'mongoose'

export type UpdateUserDto = {
  name: string
  nick: string
  email: string
  backgroundImage: string
  thumbnailImage: string
  provider: string
  id: Types.ObjectId
}
