import { ButtonHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useClickOutside } from 'hooks'
import { DateData, dateDataAreEquals, getDateData, getWeekDateData } from 'utils'
import { CalendarIcon } from '../icons'
import { CalendarNavigationButton } from './calendar-navigation-button'

export interface CalendarButtonProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  className?: string
  handleSelectDay: (selectedDayDate: DateData) => void
  selectedDayDateData: DateData
  todayDateData: DateData
  locale: string
  timezone?: string
}

export const CalendarButton = ({
  handleSelectDay,
  selectedDayDateData,
  todayDateData,
  locale,
  timezone = 'America/Santiago',
  className = '',
}: CalendarButtonProps) => {
  const [selectedMonthDate, setSelectedMonthDate] = useState(selectedDayDateData)
  useEffect(() => {
    // Update calendar month date if selected day changes
    setSelectedMonthDate(selectedDayDateData)
  }, [selectedDayDateData])

  const monthDayDates = (() => {
    const firstWeekDate = new Date(selectedMonthDate.date).setDate(0)
    const secondWeekDate = new Date(selectedMonthDate.date).setDate(7)
    const thirdWeekDate = new Date(selectedMonthDate.date).setDate(14)
    const fourthWeekDate = new Date(selectedMonthDate.date).setDate(21)
    const fifthWeekDate = new Date(selectedMonthDate.date).setDate(28)
    const sixthWeekDate = new Date(selectedMonthDate.date).setDate(35)
    return [
      getWeekDateData(locale, timezone, new Date(firstWeekDate)),
      getWeekDateData(locale, timezone, new Date(secondWeekDate)),
      getWeekDateData(locale, timezone, new Date(thirdWeekDate)),
      getWeekDateData(locale, timezone, new Date(fourthWeekDate)),
      getWeekDateData(locale, timezone, new Date(fifthWeekDate)),
      getWeekDateData(locale, timezone, new Date(sixthWeekDate)),
    ]
  })()

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarPopoverRef = useRef<HTMLDivElement>(null)
  useClickOutside(calendarPopoverRef, () => setIsCalendarOpen(false))

  const navigateMonth = (direction: 'left' | 'right') => {
    const newSelectedMonthDate = new Date(selectedMonthDate.date).setMonth(
      selectedMonthDate.date.getMonth() - (direction === 'left' ? 1 : -1),
    )
    setSelectedMonthDate(getDateData(locale, timezone, new Date(newSelectedMonthDate)))
  }

  const onDayButtonClick = (selectedDayDate: DateData) => {
    handleSelectDay(selectedDayDate)
    setIsCalendarOpen(false)
  }

  return (
    <div className="relative flex justify-start sm:justify-end" ref={calendarPopoverRef}>
      <button
        onClick={() => setIsCalendarOpen((prev) => !prev)}
        className={`border border-gray-border hover:border-gray-modal rounded-lg p-2 ${
          isCalendarOpen ? 'bg-gray-light cursor-default pointer-events-none' : 'bg-white'
        } ${className}`}
      >
        <CalendarIcon width={16} height={16} color="currentColor" />
      </button>
      {isCalendarOpen && (
        <div className="flex flex-col justify-center absolute top-10 px-3.752 w-60 py-2.5 bg-white border border-gray-border rounded-base shadow-lg">
          <nav className="w-full flex items-center justify-between">
            <CalendarNavigationButton iconPosition="left" onClick={() => navigateMonth('left')} />
            <span className="font-medium text-gray-dark text-15">
              {selectedMonthDate?.monthName} {selectedMonthDate?.year}
            </span>
            <CalendarNavigationButton iconPosition="right" onClick={() => navigateMonth('right')} />
          </nav>
          <div className="mt-2">
            <ul className="grid grid-cols-7 place-items-center">
              {getWeekDateData(locale, timezone, selectedMonthDate.date).map((weekDay, idx) => {
                return (
                  <li key={`${weekDay.day}-${idx}`}>
                    <span className="font-medium text-gray-dark">
                      {weekDay.shortDayName.slice(0, -1)}
                    </span>
                  </li>
                )
              })}
            </ul>
            <hr className="text-gray-divider-border mb-1" />
            <div className="grid grid-cols-7 place-items-center grid-flow-row auto-cols-max">
              {monthDayDates.map((weekDateData) =>
                weekDateData.map((weekDay, idx) => {
                  const isTodayClasses = dateDataAreEquals(todayDateData, weekDay)
                    ? 'bg-primary-lighter border-primary-light'
                    : ''

                  const isSelectedAndNotTodayClasses =
                    !dateDataAreEquals(selectedDayDateData, todayDateData) &&
                    dateDataAreEquals(selectedDayDateData, weekDay)
                      ? 'border-gray-dark'
                      : 'border-transparent'

                  const belongsToSelectedMonthClasses =
                    weekDay.date.getMonth() === selectedMonthDate.date.getMonth()
                      ? 'text-gray-dark'
                      : 'text-gray-divider-border'

                  return (
                    <button
                      key={`${weekDay.day}-${weekDay.week}-${idx}`}
                      className={`w-full rounded-base border hover:bg-gray-dark hover:border-transparent hover:text-white ${isTodayClasses} ${isSelectedAndNotTodayClasses} ${belongsToSelectedMonthClasses}`}
                      onClick={() => onDayButtonClick(weekDay)}
                    >
                      <span>{Number(weekDay.day)}</span>
                    </button>
                  )
                }),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
