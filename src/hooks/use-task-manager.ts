import { Types, HydratedDocument } from 'mongoose'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext, useMemo } from 'react'
import { TaskActionTypes, TaskContext } from '../context'
import { TaskStatus } from '../database/enums'
import { IRecord, ITask } from '../database/models'
import { toggleTaskStatus } from '../services'
import {
  DateData,
  getDateData,
  getRunningRecord,
  getSecondsDiff,
  getWeekDateData,
  isRecordRunning,
  recordToDateData,
} from '../utils'
import { ChronoUser } from '../context/chrono-user'
import { useOnMount } from './use-on-mount'

const INTERVAL_SECONDS = 1

export const useTaskManager = (chronoUser: ChronoUser) => {
  const { locale } = useRouter()

  const LOCALE = useMemo(() => locale ?? 'en', [locale])
  const TIMEZONE = useMemo(
    () => chronoUser.databaseData?.timezone,
    [chronoUser.databaseData?.timezone],
  )

  const defineWeekDateData = (baseDate?: Date) => getWeekDateData(LOCALE, TIMEZONE, baseDate)

  const defineDateData = (baseDate?: Date) => getDateData(LOCALE, TIMEZONE, baseDate)

  const todayDateData = defineDateData()
  const currentWeekDateData = defineWeekDateData()
  const [weekDateData, setWeekDateData] = useState(defineWeekDateData)
  const [runningTaskAccTimeSecs, setRunningTaskAccTimeSecs] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>()
  const [runningTaskId, setRunningTaskId] = useState<Types.ObjectId>()
  const { isMounted } = useOnMount()
  const [toggledTaskId, setToggledTaskId] = useState<Types.ObjectId>()
  const [isTodayRunning, setIsTodayRunning] = useState(false)
  const [runningRecord, setRunningRecord] = useState<HydratedDocument<IRecord>>()
  const runningRecordDateData = recordToDateData(LOCALE, runningRecord, TIMEZONE)

  const [selectedWeekDayIndex, setSelectedWeekDayIndex] = useState(
    weekDateData.findIndex((weekDayDateDate) => weekDayDateDate.dayName === todayDateData.dayName),
  )

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
      selectedDay: state.selectedDay!,
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

  useEffect(() => {
    if (runningTaskId) {
      setIsTodayRunning(isRecordRunning(chronoUser, todayDateData.day))
      setRunningRecord(getRunningRecord(chronoUser))
    } else {
      setRunningRecord(undefined)
      setIsTodayRunning(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningTaskId])

  /**
   * 1. Effect
   * When task get updated (created, started, or stopped)
   * update selected record to reflect new tasks times.
   */
  useEffect(() => {
    handleSelectRecord(weekDateData[selectedWeekDayIndex])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chronoUser, runningTaskId])

  /**
   * 2. Effect
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
   * 3. Effect
   * Set interval if the modal has been closed, there is no task running on client
   * but a new task has been created and is running on server
   */

  useEffect(() => {
    const recordWithTaskRunning = chronoUser.databaseData?.records.find(
      (record) => record.hasTaskRunning,
    )
    if (!state.isOpen && recordWithTaskRunning && !runningTaskId && isMounted) {
      const newRunningTask = recordWithTaskRunning.tasks.find(
        (task) => task.status === TaskStatus.RUNNING,
      )
      createInterval(newRunningTask?.accTimeSecs!, newRunningTask?._id!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen])

  /**
   * 4. Effect
   * Set interval when page has been refreshed and some task is running
   */
  useEffect(() => {
    const recordWithTaskRunning = chronoUser.databaseData?.records.find(
      (record) => record.hasTaskRunning,
    )
    const runningTask = recordWithTaskRunning?.tasks.find(
      (task) => task.status === TaskStatus.RUNNING,
    )
    if (runningTask && !intervalId && !runningTaskAccTimeSecs && isMounted) {
      const selectedWeekDayDate = weekDateData[selectedWeekDayIndex].date
      createInterval(
        runningTask.accTimeSecs + getSecondsDiff(selectedWeekDayDate, runningTask.lastRun),
        runningTask._id,
      )
    }

    return handleClearInterval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  /**
   * 5. Effect
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
    currentWeekDateData,
    weekDateData,
    defineWeekDateData,
    setWeekDateData,
    defineDateData,
    selectedWeekDayIndex,
    setSelectedWeekDayIndex,
    selectedRecord,
    handleSelectRecord,
    runningTaskAccTimeSecs,
    runningTaskId,
    isTodayRunning,
    runningRecord,
    runningRecordDateData,
  }
}
