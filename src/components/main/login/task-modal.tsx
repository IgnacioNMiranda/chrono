import { useMemo } from 'react'
import { getDateData } from '../../../utils'
import { TaskForm } from './task-form'

export type TaskModalProps = {
  timezone: string
  onClose: () => void
  className?: string
  isCreatingEntry?: boolean
}

export const TaskModal = ({
  isCreatingEntry = false,
  timezone,
  onClose,
  className = '',
}: TaskModalProps) => {
  const dateData = useMemo(() => getDateData(timezone), [timezone])

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-screen z-30 flex justify-center transition-opacity ${className}`}
    >
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed left-0 top-0 h-full w-full  bg-gray-modal`}
      />
      <div className="modal-styling" role="dialog">
        <div className="bg-gray-light rounded-t-base border-b border-gray-400">
          <p
            className="text-center py-2 font-medium text-gray-dark text-15 leading-5.6"
            style={{ lineHeight: 1.4 }}
          >
            New time entry for {dateData.dayName}, {dateData.day} {dateData.monthName}
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <p className="font-medium text-gray-dark text-15 leading-5.6 mb-2">Project / Task</p>
          <TaskForm isCreatingEntry={isCreatingEntry} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
