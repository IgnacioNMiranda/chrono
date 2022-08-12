import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../database/connection'
import { TaskStatus } from '../../../database/enums'
import { Task, User } from '../../../database/models'

const editTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (!body.taskId || !body.userId) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { taskId, userId } = body

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

  const task = await Task.findById(taskId).populate('record').exec()
  if (!task) return res.status(400).end('Bad request. Cannot find task')

  if (task.status === TaskStatus.RUNNING) {
    task.record.hasTaskRunning = false
    await task.record.save()
  }

  await task.delete()

  return res.status(204).end()
}

export default editTask
