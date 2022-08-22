import { useContext } from 'react'
import { ChronoUser, TaskActionTypes, TaskContext } from 'context'
import { getHoursFromSecs } from 'utils'
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

export const Records = ({ chronoUser }: RecordsProps) => {
  const { dispatch } = useContext(TaskContext)

  const {
    onEditTask,
    onToggleTaskStatus,
    toggledTaskId,
    dateData,
    todayRecord,
    runningTaskId,
    runningTaskAccTimeSecs,
  } = useTaskManager(chronoUser)

  const { t } = useTranslation('main')
  const { t: commonT } = useTranslation('common')

  return (
    <div className="flex flex-col sm:space-y-4 w-full">
      <section>
        <h1 className="font-medium text-3xl">
          {t('login.records.todayLabel')}:{' '}
          <span className="font-normal">
            {dateData.dayName}, {dateData.day} {dateData.monthName}
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
      {!!todayRecord?.tasks.length && (
        <section className="w-full">
          {todayRecord?.tasks.map((task, idx) => {
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
              {getHoursFromSecs(
                (() => {
                  const [hours, minutes] = todayRecord?.tasks.reduce(
                    (acc, cur) => {
                      const hoursFromSecs =
                        runningTaskId && cur._id === runningTaskId
                          ? getHoursFromSecs(runningTaskAccTimeSecs)
                          : getHoursFromSecs(cur.accTimeSecs)
                      acc[0] = acc[0] + Number(hoursFromSecs.split(':')[0])
                      acc[1] = acc[1] + Number(hoursFromSecs.split(':')[1])
                      return acc
                    },
                    [0, 0],
                  )
                  return hours * 3600 + minutes * 60
                })(),
              )}
            </span>
            <div className="w-auto sm:w-4/12 lg:w-3/12 xl:w-2/12 py-4 pr-4" />
          </div>
        </section>
      )}
      {!todayRecord?.tasks.length && (
        <section className="bg-gray-light w-full h-72 flex justify-center px-2">
          <p className="text-center text-gray-dark font-medium text-base self-center justify-self-center ">
            {t('login.records.baseQuote')} <br /> - {t('login.records.baseQuoteAuthor')}
          </p>
        </section>
      )}
    </div>
  )
}
