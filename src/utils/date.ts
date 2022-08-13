export const getDateData = (locale: string, timeZone?: string) => {
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

  return { year, month, monthName, week, day, dayName, date }
}

export const getSecondsDiff = (date: Date, prevDate?: Date | string) => {
  let secondsDiff = 0
  if (typeof prevDate === 'string')
    secondsDiff = (date.getTime() - (new Date(prevDate)?.getTime() ?? 0)) / 1000
  else secondsDiff = (date.getTime() - ((prevDate as Date)?.getTime() ?? 0)) / 1000

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
