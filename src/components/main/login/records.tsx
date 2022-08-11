import { useContext, useEffect, useMemo, useState } from 'react'
import { ChronoActionTypes, ChronoContext } from '../../../context'
import { IRecord, ITask, IUser } from '../../../database/models'
import { TaskStatus } from '../../../database/enums'
import { getDateData, getSecondsDiff, getHoursFromSecs } from '../../../utils'
import { Button, ButtonRound, ButtonVariant } from '../../button'
import { ClockAnimated, ClockIcon, PlusIcon } from '../../icons'
import { TrackTaskButton } from './track-task-button'
import { toggleTaskStatus } from '../../../services'
import { HydratedDocument, Types } from 'mongoose'
import { useOnMount } from '../../../hooks'

export type RecordsProps = {
  timezone: string
  records: IRecord[]
  userData: HydratedDocument<IUser>
}

export const Records = ({ timezone, records, userData }: RecordsProps) => {
  const dateData = useMemo(() => getDateData(timezone), [timezone])

  const { state, dispatch } = useContext(ChronoContext)

  const todayRecord = records.find(
    (record) =>
      record.day === Number(dateData.day) &&
      record.month === Number(dateData.month) &&
      record.year === Number(dateData.year) &&
      record.week === Number(dateData.week),
  )

  const [runningTaskAccTimeSecs, setRunningTaskAccTimeSecs] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>()
  const [runningTaskId, setRunningTaskId] = useState<Types.ObjectId>()
  const { isMounted } = useOnMount()

  const onToggleTaskStatus = async (isRunning: boolean, task: HydratedDocument<ITask>) => {
    await toggleTaskStatus({
      isRunning,
      userId: userData._id,
      taskId: task._id,
      timezone,
    })
    await state.refetch?.()
    if (!isRunning) {
      const intervalId = setInterval(() => {
        setRunningTaskAccTimeSecs((acc) => acc + 60)
        console.log('toggle interval')
      }, 1000 * 60)
      setIntervalId(intervalId)
      setRunningTaskAccTimeSecs(task.accTimeSecs)
      dispatch({
        type: ChronoActionTypes.SET_DYNAMIC_ACC_TIME_SECS,
        payload: task.accTimeSecs,
      })
      setRunningTaskId(task._id)
    } else {
      clearInterval(intervalId)
      setIntervalId(undefined)
      setRunningTaskId(undefined)
      dispatch({
        type: ChronoActionTypes.SET_DYNAMIC_ACC_TIME_SECS,
        payload: undefined,
      })
    }
  }

  const onEditTask = (task: HydratedDocument<ITask>) => {
    dispatch({
      type: ChronoActionTypes.SET_EDITED_TASK,
      payload: task,
    })
    dispatch({
      type: ChronoActionTypes.TOGGLE_MODAL,
      payload: true,
    })
  }

  useEffect(() => {
    if (isMounted) {
      const runningTask = todayRecord?.tasks.find((task) => task.status === TaskStatus.RUNNING)

      if (runningTask) {
        if (!intervalId) {
          const intervalId = setInterval(() => {
            console.log('effect interval')

            setRunningTaskAccTimeSecs((acc) => acc + 60)
          }, 1000 * 60)
          setIntervalId(intervalId)
        }
        const datetime_str = new Date().toLocaleString('en-US', { timeZone: timezone })
        const dynamicAccTimeSecs =
          runningTask.accTimeSecs + getSecondsDiff(new Date(datetime_str), runningTask.lastRun)
        setRunningTaskAccTimeSecs(dynamicAccTimeSecs)
        dispatch({
          type: ChronoActionTypes.SET_DYNAMIC_ACC_TIME_SECS,
          payload: dynamicAccTimeSecs,
        })
        setRunningTaskId(runningTask._id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  useEffect(() => {
    dispatch({
      type: ChronoActionTypes.SET_DYNAMIC_ACC_TIME_SECS,
      payload: runningTaskAccTimeSecs,
    })
  }, [runningTaskAccTimeSecs, dispatch])

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
            const timeHours = getHoursFromSecs(task.accTimeSecs)
            const isRunning = task._id === runningTaskId

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
                  {isRunning ? getHoursFromSecs(runningTaskAccTimeSecs) : timeHours}
                </span>
                <div className="w-auto sm:w-4/12 lg:w-3/12 xl:w-2/12 py-4 pr-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 justify-center items-center space-x-0 sm:space-x-2">
                  <Button
                    variant={isRunning ? ButtonVariant.GRAY_DARK : ButtonVariant.WHITE}
                    onClick={() => onToggleTaskStatus(isRunning, task)}
                    round={ButtonRound.LGXL}
                    className="px-2 md:px-4 w-full sm:w-auto py-2 md:py-1"
                  >
                    <div className="flex space-x-0 md:space-x-3 items-center">
                      {isRunning ? <ClockAnimated /> : <ClockIcon />}
                      <span className="hidden md:block text-17 text-gra font-normal">
                        {isRunning ? 'Stop' : 'Start'}
                      </span>
                    </div>
                  </Button>
                  <Button
                    variant={ButtonVariant.WHITE}
                    round={ButtonRound.LG}
                    onClick={() => onEditTask(task)}
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
              {getHoursFromSecs(
                (() => {
                  const [hours, minutes] = todayRecord?.tasks.reduce(
                    (acc, cur, idx) => {
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
            Time is as valuable as you (: <br /> - Anonymous
          </p>
        </section>
      )}
    </div>
  )
}
