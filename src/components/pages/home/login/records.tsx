import { memo, useContext, useEffect, useState } from 'react'
import { ChronoUser, TaskActionTypes, TaskContext } from 'context'
import { getAccTimeFromRecord, getHoursFromSecs, getSecsFromHours } from 'utils'
import {
  TrackTaskButton,
  ClockAnimated,
  ClockIcon,
  PlusIcon,
  SpinnerIcon,
  Button,
  ButtonRound,
  ButtonVariant,
} from '../../..'
import { useTranslation } from 'next-i18next'
import { useTaskManager } from 'hooks'

export type RecordsProps = {
  chronoUser: ChronoUser
}

export const Records = memo(({ chronoUser }: RecordsProps) => {
  const { dispatch } = useContext(TaskContext)

  const {
    onEditTask,
    onToggleTaskStatus,
    toggledTaskId,
    handleSelectRecord,
    todayDateData,
    weekDateData,
    selectedWeekDayIndex,
    setSelectedWeekDayIndex,
    selectedRecord,
    findRecord,
    runningTaskId,
    runningTaskAccTimeSecs,
  } = useTaskManager(chronoUser)

  const [recordsAccHours, setRecordsAccHours] = useState(() =>
    weekDateData.map((weekDayDateData) => {
      const record = findRecord(weekDayDateData)
      return getAccTimeFromRecord(record, runningTaskId, runningTaskAccTimeSecs)
    }),
  )

  useEffect(() => {
    setRecordsAccHours(
      weekDateData.map((weekDayDateData) => {
        const record = findRecord(weekDayDateData)
        return getAccTimeFromRecord(record, runningTaskId, runningTaskAccTimeSecs)
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningTaskAccTimeSecs])

  useEffect(() => {
    dispatch({
      type: TaskActionTypes.SET_SELECTED_DAY,
      payload: todayDateData,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { t } = useTranslation('main')
  const { t: commonT } = useTranslation('common')

  return (
    <div className="flex flex-col sm:space-y-4 w-full">
      <section>
        <h1 className="font-medium text-3xl">
          {t('login.records.todayLabel')}:{' '}
          <span className="font-normal">
            {todayDateData.dayName}, {todayDateData.day} {todayDateData.monthName}
          </span>
        </h1>
      </section>
      <TrackTaskButton
        buttonRound={ButtonRound.LG}
        buttonClassName="w-full p-1.5 flex space-x-1"
        className="my-4 sm:hidden"
        onClick={() => {
          dispatch({
            type: TaskActionTypes.TOGGLE_MODAL,
            payload: true,
          })
        }}
      >
        <PlusIcon color="white" width={16} height={16} className="font-bold" />
        <span className="text-white font-medium text-15">{commonT('trackTaskButton.label')}</span>
      </TrackTaskButton>
      <div>
        <div className="w-full flex justify-between items-center text-15 border-b border-b-gray-divider-border">
          <ul className="w-10/12 flex space-x-1">
            {weekDateData.map((weekDay, idx) => {
              const isSelected = selectedWeekDayIndex === idx

              return (
                <li
                  key={`${weekDay.day}-${idx}`}
                  className={`${
                    weekDay.shortDayName === todayDateData.shortDayName && !isSelected
                      ? 'text-primary font-bold border-b-transparent'
                      : isSelected
                      ? 'border-b-primary font-medium'
                      : 'text-gray-dark-opacity hover:text-gray-dark hover:font-medium border-b-transparent '
                  }  w-1/7 border-b-2 hover:border-b-2 hover:border-b-primary `}
                >
                  <button
                    className="flex flex-col w-full px-1 py-2 focus:outline-none"
                    onClick={() => {
                      setSelectedWeekDayIndex(idx)
                      handleSelectRecord(weekDay)
                      dispatch({
                        type: TaskActionTypes.SET_SELECTED_DAY,
                        payload: weekDay,
                      })
                    }}
                  >
                    <span>{weekDay.shortDayName}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-13">{recordsAccHours[idx]}</span>
                      <ClockIcon width={12} height={12} />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-col items-end">
            <span>{t('login.records.weekTotalLabel')}</span>
            <span className="text-13">
              {getHoursFromSecs(
                recordsAccHours.reduce(
                  (prevValue, nextValue) => prevValue + getSecsFromHours(nextValue),
                  0,
                ),
              )}
            </span>
          </div>
        </div>
        {!!selectedRecord?.tasks.length && (
          <section className="w-full">
            {selectedRecord?.tasks.map((task, idx) => {
              const timeHours = getHoursFromSecs(task.accTimeSecs)
              const isRunning = task._id === runningTaskId

              const taskIsToggling = toggledTaskId === task._id

              return (
                <div
                  className="bg-secondary-ligh bg-white border-b border-b-gray-divider-border flex justify-between sm:justify-"
                  key={`${task.title}-${idx}`}
                >
                  <div className="w-7/12 xl:w-9/12 p-4">
                    <p className="font-semibold text-gray-dark text-15 leading-5.6 break-words">
                      {task.title}
                    </p>
                    {!!task.notes && (
                      <p className="text-gray-dark-opacity text-13 leading-5 font-normal">
                        {task.notes}
                      </p>
                    )}
                  </div>
                  <span className="w-auto xl:w-1/12 p-4 flex justify-center items-center text-17 font-medium">
                    {isRunning ? getHoursFromSecs(runningTaskAccTimeSecs) : timeHours}
                  </span>
                  <div className="w-auto sm:w-4/12 lg:w-3/12 xl:w-2/12 py-4 pr-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-center items-center space-x-0 sm:space-x-2">
                    <Button
                      variant={isRunning ? ButtonVariant.GRAY_DARK : ButtonVariant.WHITE}
                      onClick={() => onToggleTaskStatus(isRunning, task)}
                      round={ButtonRound.LGXL}
                      disabled={!!toggledTaskId}
                      className="px-2 md:px-4 w-full sm:w-auto py-2 md:py-1"
                    >
                      <div className="flex space-x-0 md:space-x-3 items-center">
                        {taskIsToggling && (
                          <SpinnerIcon width={20} height={20} color="currentColor" />
                        )}
                        {!!isRunning && !taskIsToggling && <ClockAnimated />}
                        {!isRunning && !taskIsToggling && <ClockIcon />}
                        <span className="hidden md:block text-17 text-gra font-normal">
                          {isRunning
                            ? t('login.records.stopButtonLabel')
                            : t('login.records.startButtonLabel')}
                        </span>
                      </div>
                    </Button>
                    <Button
                      variant={ButtonVariant.WHITE}
                      round={ButtonRound.LG}
                      onClick={() => onEditTask(task)}
                      className="px-2 w-full sm:w-auto"
                    >
                      <span className="text-13 text-gray-dark leading-7 font-normal">
                        {t('login.records.editButtonLabel')}
                      </span>
                    </Button>
                  </div>
                </div>
              )
            })}
            <div className="bg-secondary-ligh bg-white flex mx-auto sm:mx-0 w-fit sm:w-full">
              <div className="w-7/12 xl:w-9/12 p-4 flex justify-end">
                <span className="font-normal text-17 text-gray-dark leading-5.6">
                  {t('login.records.totalLabel')}:
                </span>
              </div>
              <span className="w-1/12 lg:w-2/12 xl:w-1/12 p-4 flex justify-center items-center text-17 font-medium ">
                {getAccTimeFromRecord(selectedRecord, runningTaskId, runningTaskAccTimeSecs)}
              </span>
              <div className="w-auto sm:w-4/12 lg:w-3/12 xl:w-2/12 py-4 pr-4" />
            </div>
          </section>
        )}
        {!selectedRecord?.tasks.length && (
          <section className="bg-gray-light w-full h-72 flex justify-center px-2">
            <p className="text-center text-gray-dark font-medium text-base self-center justify-self-center ">
              {t('login.records.baseQuote')} <br /> - {t('login.records.baseQuoteAuthor')}
            </p>
          </section>
        )}
      </div>
    </div>
  )
})

Records.displayName = 'Records'
