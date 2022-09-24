import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'database/connection'
import { Task, User } from 'database/models'
import { TaskStatus } from 'database/enums'
import { Record } from 'database/models'
import { getDateData, isValidTime } from 'utils'
import { NewTaskDto } from 'database/dtos'
import { withMiddleware } from '../_utils'

const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (
    !body.title ||
    !body.selectedDay ||
    (body.time !== '' && !isValidTime(body.time)) ||
    !body.locale ||
    !body.userId
  ) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { title, time, notes, userId, selectedDay, locale }: NewTaskDto = body

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

  const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const { date } = getDateData(locale, serverTimezone)

  let selectedDayRecord = await Record.findOne({
    day: selectedDay.day,
    week: selectedDay.week,
    month: selectedDay.month,
    year: selectedDay.year,
    user: userId,
  }).exec()

  if (!selectedDayRecord) {
    selectedDayRecord = new Record({
      day: selectedDay.day,
      week: selectedDay.week,
      month: selectedDay.month,
      year: selectedDay.year,
      tasks: [],
      user: userId,
    })
    await selectedDayRecord.save()
    user.records.push(selectedDayRecord.id)
    await user.save()
  }

  const normTime = time || '0:00'
  const [hours, minutes] = normTime.split(':')
  const accTimeSecs = Number(hours) * 60 * 60 + Number(minutes) * 60

  const taskAlreadyRunning = user.records
    .find((record) => record.hasTaskRunning)
    ?.tasks.find((task) => task.status === TaskStatus.RUNNING)

  const newTask = new Task({
    title,
    notes: notes ?? '',
    lastRun: taskAlreadyRunning ? null : date,
    accTimeSecs,
    record: selectedDayRecord._id,
    status: taskAlreadyRunning ? TaskStatus.IDLE : TaskStatus.RUNNING,
  })

  const hasTaskRunningQuery = taskAlreadyRunning ? {} : { $set: { hasTaskRunning: true } }

  await newTask.save()
  await selectedDayRecord
    .updateOne({ ...hasTaskRunningQuery, $push: { tasks: newTask._id } })
    .exec()
  return res.status(200).json(newTask)
}

export default withMiddleware('canMakeRequest')(createTask)
