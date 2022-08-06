export const getDateData = (timeZone: string) => {
  const datetime_str = new Date().toLocaleString('en-US', { timeZone })

  // create new Date object
  const date = new Date(datetime_str)

  // year as (YYYY) format
  const year = date.getFullYear()

  // month as (MM) format
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const monthName = date.toLocaleString('default', { month: 'short' })

  const week = Math.ceil((date.getDate() - 1 - date.getDay()) / 7)

  // date as (DD) format
  const day = ('0' + date.getDate()).slice(-2)
  const dayName = date.toLocaleString('default', { weekday: 'long' })

  return { year, month, monthName, week, day, dayName }
}