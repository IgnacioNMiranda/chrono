import { useContext, useMemo } from 'react'
import { ChronoActionTypes, ChronoContext } from '../../context'
import { IRecord, ITask } from '../../database'
import { getDateData } from '../../utils'
import { Button, ButtonRound, ButtonVariant } from '../button'
import { ClockIcon, PlusIcon } from '../icons'
import { TrackTaskButton } from './track-task-button'

export type RecordsProps = {
  timezone: string
  records: IRecord[]
}

export const Records = ({ timezone, records }: RecordsProps) => {
  const dateData = useMemo(() => getDateData(timezone), [timezone])

  const { dispatch } = useContext(ChronoContext)

  const todayRecord = records.find(
    (record) =>
      record.day === Number(dateData.day) &&
      record.month === Number(dateData.month) &&
      record.year === Number(dateData.year) &&
      record.week === Number(dateData.week),
  )

  return (
    <div className="flex flex-col sm:space-y-4 w-full">
      <section>
        <h1 className="font-medium text-3xl">
          Today:{' '}
          <span className="font-normal">
            {dateData.dayName}, {dateData.day} {dateData.monthName}
          </span>
        </h1>
      </section>
      <TrackTaskButton
        buttonRound={ButtonRound.LG}
        buttonClassName="w-full p-1.5 flex space-x-1"
        className="mt-13 sm:hidden"
        onClick={() => {
          dispatch({
            type: ChronoActionTypes.TOGGLE_MODAL,
            payload: true,
          })
        }}
      >
        <PlusIcon color="white" width={16} height={16} className="font-bold" />
        <span className="text-white font-medium text-15">Track time</span>
      </TrackTaskButton>
      {!!todayRecord?.tasks.length && (
        <section className="w-full">
          {todayRecord?.tasks.map((task, idx) => {
            const timeHours = new Date(task.accTimeSecs * 1000).toISOString().substring(11, 11 + 5)
            return (
              <div
                className="bg-secondary-light border-b border-b-gray-task-border flex"
                key={`${task.title}-${idx}`}
              >
                <div className="w-8/12 xl:w-9/12 p-4">
                  <p className="font-semibold text-gray-dark text-15 leading-5.6">{task.title}</p>
                  {!!task.notes && (
                    <p className="text-gray-dark-opacity text-13 leading-5 font-normal">
                      {task.notes}
                    </p>
                  )}
                </div>
                <span className="w-auto p-4 flex justify-center items-center text-17 font-medium">
                  {timeHours}
                </span>
                <div className="w-auto sm:w-4/12 lg:w-3/12 xl:w-2/12 py-4 pr-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-center items-center space-x-0 sm:space-x-2">
                  <Button
                    variant={ButtonVariant.WHITE}
                    round={ButtonRound.LGXL}
                    className="px-2 md:px-4 w-full sm:w-auto py-2 md:py-1"
                  >
                    <div className="flex space-x-0 md:space-x-3 items-center">
                      <ClockIcon />
                      <span className="hidden md:block text-17 text-gray-dark font-normal">
                        Start
                      </span>
                    </div>
                  </Button>
                  <Button
                    variant={ButtonVariant.WHITE}
                    round={ButtonRound.LG}
                    className="px-2 w-full sm:w-auto"
                  >
                    <span className="text-13 text-gray-dark leading-7 font-normal">Edit</span>
                  </Button>
                </div>
              </div>
            )
          })}
          <div className="bg-secondary-light flex mx-auto sm:mx-0 w-fit sm:w-full">
            <div className="w-8/12 xl:w-9/12 p-4 flex justify-end">
              <span className="font-normal text-17 text-gray-dark leading-5.6">Total:</span>
            </div>
            <span className="w-auto p-4 flex justify-center items-center text-17 font-medium ">
              {new Date(
                todayRecord?.tasks.reduce(
                  (prev, next) =>
                    typeof prev === 'number'
                      ? prev + next.accTimeSecs
                      : (prev as ITask).accTimeSecs + next.accTimeSecs,
                  0,
                ) * 1000,
              )
                .toISOString()
                .substring(11, 11 + 5)}
            </span>
            <div className="w-auto sm:w-4/12 lg:w-3/12 xl:w-2/12 py-4 pr-4" />
          </div>
        </section>
      )}
      {!todayRecord?.tasks.length && (
        <section className="bg-gray-light w-full h-72 flex justify-center px-2">
          <p className="text-center text-gray-dark font-medium text-base self-center justify-self-center ">
            Time is as valuable as you (: <br /> - Anonymous
          </p>
        </section>
      )}
    </div>
  )
}
// 1:23
