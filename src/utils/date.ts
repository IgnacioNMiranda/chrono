import { HydratedDocument, Types } from 'mongoose'
import { IRecord } from '../database/models'

export type DateData = {
  year: number
  month: string
  monthName: string
  week: number
  day: string
  dayName: string
  shortDayName: string
  date: Date
}

export const getDateData = (locale: string, timeZone?: string, existingDate?: Date): DateData => {
  let datetime_str = existingDate
    ? new Date(existingDate).toLocaleString(locale, { timeZone })
    : new Date().toLocaleString(locale, { timeZone })

  if (!locale.startsWith('en')) {
    const [dates, time] = datetime_str.split(' ')
    const splittedDates = dates.split('/')
    const aux = splittedDates[0]
    splittedDates[0] = splittedDates[1]
    splittedDates[1] = aux
    datetime_str = [splittedDates.join('/'), time].join(',')
  }

  // create new Date object
  const date = new Date(datetime_str)

  const dateValues = datetime_str.split(',')[0].split('/')

  // year as (YYYY) format
  const year = Number(dateValues[2].split(' ')[0])

  // month as (MM) format
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const monthName = date.toLocaleString(locale, { month: 'short' })

  const week = Math.ceil((date.getDate() - 1 - date.getDay()) / 7)

  // date as (DD) format
  const day = ('0' + date.getDate()).slice(-2)

  const dayName = date.toLocaleString(locale, { weekday: 'long' })
  const shortDayName = date.toLocaleString(locale, { weekday: 'short' })

  return { year, month, monthName, week, day, dayName, shortDayName, date }
}

export const getWeekDateData = (locale: string, timeZone?: string) => {
  let datetime_str = new Date().toLocaleString(locale, { timeZone })

  if (!locale.startsWith('en')) {
    const [dates, time] = datetime_str.split(' ')
    const splittedDates = dates.split('/')
    const aux = splittedDates[0]
    splittedDates[0] = splittedDates[1]
    splittedDates[1] = aux
    datetime_str = [splittedDates.join('/'), time].join(',')
  }

  // create new Date object
  const todayDate = new Date(datetime_str)

  const dayAsNumber = todayDate.getDay()
  const diff = todayDate.getDate() - dayAsNumber + (dayAsNumber === 0 ? -6 : 1)
  const mondayDate = new Date(todayDate).setDate(diff)
  const tuesdayDate = new Date(todayDate).setDate(diff + 1)
  const wednesdayDate = new Date(todayDate).setDate(diff + 2)
  const thursdayDate = new Date(todayDate).setDate(diff + 3)
  const fridayDate = new Date(todayDate).setDate(diff + 4)
  const saturdayDate = new Date(todayDate).setDate(diff + 5)
  const sundayDate = new Date(todayDate).setDate(diff + 6)

  return [
    getDateData(locale, timeZone, new Date(mondayDate)),
    getDateData(locale, timeZone, new Date(tuesdayDate)),
    getDateData(locale, timeZone, new Date(wednesdayDate)),
    getDateData(locale, timeZone, new Date(thursdayDate)),
    getDateData(locale, timeZone, new Date(fridayDate)),
    getDateData(locale, timeZone, new Date(saturdayDate)),
    getDateData(locale, timeZone, new Date(sundayDate)),
  ]
}

export const getSecondsDiff = (date: Date, prevDate?: Date | string) => {
  const dateTime = date.getTime()
  const prevDateTime =
    (typeof prevDate === 'string' ? new Date(prevDate) : (prevDate as Date))?.getTime() ?? 0

  const secondsDiff = (dateTime - prevDateTime) / 1000

  // Check for Date discrepancies that provoques negative seconds
  return secondsDiff >= 0 ? secondsDiff : 0
}

export const getHoursFromSecs = (accTimeSecs: number) => {
  const minutes = Math.floor(accTimeSecs / 60) % 60
  const hours = Math.floor(accTimeSecs / 3600)

  return `${hours.toString().length < 2 ? '0' : ''}${hours}:${
    minutes.toString().length < 2 ? '0' : ''
  }${minutes}`
}

export const getSecsFromHours = (hoursString: string) => {
  const [hours, minutes] = hoursString.split(':')
  return Number(hours) * 3600 + Number(minutes) * 60
}

export const getAccTimeFromRecord = (
  record?: HydratedDocument<IRecord>,
  runningTaskId?: Types.ObjectId,
  runningTaskAccTimeSecs?: number,
) => {
  if (!record) return '00:00'
  const [hours, minutes] = record?.tasks.reduce(
    (acc, cur) => {
      const hoursFromSecs =
        runningTaskId && runningTaskAccTimeSecs && cur._id === runningTaskId
          ? getHoursFromSecs(runningTaskAccTimeSecs)
          : getHoursFromSecs(cur.accTimeSecs)
      acc[0] = acc[0] + Number(hoursFromSecs.split(':')[0])
      acc[1] = acc[1] + Number(hoursFromSecs.split(':')[1])
      return acc
    },
    [0, 0],
  )
  return getHoursFromSecs(hours * 3600 + minutes * 60)
}
