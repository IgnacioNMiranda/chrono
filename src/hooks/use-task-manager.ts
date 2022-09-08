import { Types, HydratedDocument } from 'mongoose'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { TaskActionTypes, TaskContext } from '../context'
import { TaskStatus } from '../database/enums'
import { ITask } from '../database/models'
import { toggleTaskStatus } from '../services'
import { DateData, getDateData, getSecondsDiff, getWeekDateData } from '../utils'
import { ChronoUser } from '../context/chrono-user'
import { useOnMount } from './use-on-mount'

const INTERVAL_SECONDS = 1

export const useTaskManager = (chronoUser: ChronoUser) => {
  const { locale } = useRouter()

  const todayDateData = getDateData(locale ?? 'en', chronoUser.databaseData?.timezone)
  const weekDateData = getWeekDateData(locale ?? 'en', chronoUser.databaseData?.timezone)
  const [runningTaskAccTimeSecs, setRunningTaskAccTimeSecs] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>()
  const [runningTaskId, setRunningTaskId] = useState<Types.ObjectId>()
  const { isMounted } = useOnMount()
  const [toggledTaskId, setToggledTaskId] = useState<Types.ObjectId>()

  const findRecord = (dateData: Pick<DateData, 'day' | 'week' | 'month' | 'year'>) => {
    return chronoUser.databaseData?.records.find(
      (record) =>
        record.day === Number(dateData.day) &&
        record.month === Number(dateData.month) &&
        record.year === Number(dateData.year) &&
        record.week === Number(dateData.week),
    )
  }

  const [selectedRecord, setSelectedRecord] = useState(() => findRecord(todayDateData))

  const handleSelectRecord = ({ day, week, month, year }: DateData) =>
    setSelectedRecord(findRecord({ day, week, month, year }))

  const { state, dispatch } = useContext(TaskContext)

  const createInterval = (runningTaskAccTimeSecs: number, runningTaskId: Types.ObjectId) => {
    const interval = setInterval(() => {
      setRunningTaskAccTimeSecs((acc) => acc + INTERVAL_SECONDS)
    }, 1000 * INTERVAL_SECONDS)
    setIntervalId(interval)
    setRunningTaskAccTimeSecs(runningTaskAccTimeSecs)
    setRunningTaskId(runningTaskId)
  }

  const handleClearInterval = () => {
    clearInterval(intervalId)
    setIntervalId(undefined)
  }

  const onToggleTaskStatus = async (isRunning: boolean, task: HydratedDocument<ITask>) => {
    setToggledTaskId(task._id)
    await toggleTaskStatus({
      isRunning,
      userId: chronoUser.databaseData?._id!,
      taskId: task._id,
      locale: locale ?? 'en',
    })

    await chronoUser.refetch?.()
    setToggledTaskId(undefined)
    if (intervalId && runningTaskId) {
      // When a task has been started and another one is already running
      handleClearInterval()
    }
    if (!isRunning) {
      createInterval(task.accTimeSecs, task._id)
    } else {
      handleClearInterval()
      setRunningTaskId(undefined)
    }
  }

  const onEditTask = (task: HydratedDocument<ITask>) => {
    dispatch({
      type: TaskActionTypes.SET_EDITED_TASK,
      payload: task,
    })
    dispatch({
      type: TaskActionTypes.TOGGLE_MODAL,
      payload: true,
    })
  }

  /**
   * 1. Effect
   * Clear interval when task that was running has been deleted
   */
  useEffect(() => {
    if (
      !state.editedTask &&
      !chronoUser.databaseData?.records.find((record) => record.hasTaskRunning)
    ) {
      handleClearInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editedTask])

  /**
   * 2. Effect
   * Set interval if the modal has been closed, there is no task running on client
   * but a new task has been created and is running on server
   */
  useEffect(() => {
    if (!state.isOpen && selectedRecord?.hasTaskRunning && !runningTaskId && isMounted) {
      const newRunningTask = selectedRecord.tasks.find((task) => task.status === TaskStatus.RUNNING)
      createInterval(newRunningTask?.accTimeSecs!, newRunningTask?._id!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  /**
   * 3. Effect
   * Set interval when page has been refreshed and some task is running
   */
  useEffect(() => {
    const runningTask = selectedRecord?.tasks.find((task) => task.status === TaskStatus.RUNNING)
    if (runningTask && !intervalId && !runningTaskAccTimeSecs && isMounted) {
      createInterval(
        runningTask.accTimeSecs + getSecondsDiff(todayDateData.date, runningTask.lastRun),
        runningTask._id,
      )
    }

    return handleClearInterval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  /**
   * 4. Effect
   * Update dynamic seconds when runningTaskAccTimeSecs has been updated
   * on each interval execution
   */
  useEffect(() => {
    dispatch({
      type: TaskActionTypes.SET_DYNAMIC_ACC_TIME_SECS,
      payload: runningTaskAccTimeSecs,
    })
  }, [runningTaskAccTimeSecs, dispatch])

  return {
    onEditTask,
    findRecord,
    onToggleTaskStatus,
    toggledTaskId,
    todayDateData,
    weekDateData,
    selectedRecord,
    handleSelectRecord,
    runningTaskAccTimeSecs,
    runningTaskId,
  }
}
