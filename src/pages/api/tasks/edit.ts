import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../database/connection'
import { Task, User } from '../../../database/models'
import { isValidTime } from '../../../utils'

const editTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (
    !body.title ||
    !body.taskId ||
    (body.time !== '' && !isValidTime(body.time)) ||
    !body.userId
  ) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { title, time, notes, taskId, userId } = body

  const user = await User.findById(userId)
    .populate({
      path: 'records',
      populate: {
        path: 'tasks',
        model: 'Task',
      },
    })
    .exec()
  if (!user) return res.status(401).end('Forbidden. You have no credentials to perform this action')

  const task = await Task.findById(taskId).exec()
  if (!task) return res.status(400).end('Bad request. Cannot find task')

  const normTime = time || '0:00'
  const [hours, minutes] = normTime.split(':')
  const accTimeSecs = Number(hours) * 60 * 60 + Number(minutes) * 60

  task.title = title
  task.accTimeSecs = accTimeSecs
  task.notes = notes

  await task.save()

  return res.status(200).json(task)
}

export default editTask
