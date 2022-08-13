import { useTranslation } from 'next-i18next'
import { FocusEventHandler, FormEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { ChronoContext } from '../../../context'
import { TaskStatus } from '../../../database/enums'
import { createNewTask, deleteTask, editTask } from '../../../services/task'
import { capitalizeFirstLetter, getHoursFromSecs, isValidTime } from '../../../utils'
import { Button, ButtonRound, ButtonVariant } from '../../button'
import { Input } from '../../input'

export type TaskFormProps = {
  onClose: () => void
  isCreatingEntry?: boolean
}

const getErrors = (
  currentErrors: Record<string, boolean>,
  e: { target: { id: string; value: string } },
) => {
  const newErrors: Record<string, boolean> = { ...currentErrors }
  if (e.target.id === 'title') {
    if (!e.target.value) newErrors.title = true
    else delete newErrors.title
  } else if (e.target.id === 'time') {
    if (e.target.value !== '' && !isValidTime(e.target.value)) newErrors.time = true
    else delete newErrors.time
  }
  return newErrors
}

export const TaskForm = ({ isCreatingEntry = false, onClose }: TaskFormProps) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [titleVisited, setTitleVisited] = useState(false)
  const [timeVisited, setTimeVisited] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [waitingDeleteTaskConfirmation, setWaitingDeleteConfirmation] = useState(false)

  const { state } = useContext(ChronoContext)

  const formRef = useRef<HTMLFormElement>(null)

  const setProperties: FocusEventHandler<HTMLInputElement> = (e) => {
    setErrors(getErrors(errors, e))
    if (e.target.id === 'title' && !titleVisited) setTitleVisited(true)
    else if (e.target.id === 'time' && !timeVisited) setTimeVisited(true)
  }

  const handleClose = () => {
    onClose?.()
    setWaitingDeleteConfirmation(false)
  }

  const handleDeleteEntry = async () => {
    if (state.editedTask) {
      await deleteTask({
        userId: state.user!,
        taskId: state.editedTask._id,
      })
    }
    await state.refetch?.()
    setTimeVisited(false)
    setTitleVisited(false)
    handleClose()
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const values = Object.fromEntries(formData)
    const { title, notes, time } = values as Record<string, string>

    try {
      if (state.editedTask) {
        try {
          await editTask({
            title,
            notes,
            time:
              state.editedTask.status === TaskStatus.RUNNING
                ? getHoursFromSecs(state.editedTask.accTimeSecs)
                : time,
            userId: state.user!,
            taskId: state.editedTask._id,
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        await createNewTask({ title, notes, time, userId: state.user! })
      }
      await state.refetch?.()
      setTimeVisited(false)
      setTitleVisited(false)
      form.reset()
      handleClose()
    } catch (error: any) {
      setSubmitError(error.message)
      setTimeout(() => {
        setSubmitError('')
      }, 2500)
    }
  }

  useEffect(() => {
    // If we're editing a task these 2 fields has been already visited
    if (state.editedTask) {
      setTimeVisited(true)
      setTitleVisited(true)
    }

    const effectRef = formRef.current

    return () => {
      // When modal is closed
      setWaitingDeleteConfirmation(false)
      setTimeVisited(false)
      setTitleVisited(false)
      effectRef?.reset()
    }
  }, [state.editedTask])

  const { t } = useTranslation('task-form')

  return (
    <form className="flex space-y-2 flex-col" ref={formRef} onSubmit={onSubmit}>
      <Input
        placeholder={t('titleInputPlaceholder')}
        id="title"
        onChange={setProperties}
        onBlur={setProperties}
        defaultValue={state.editedTask ? state.editedTask.title : ''}
        submitOnEnter={false}
        name="title"
        required
        type="text"
      />
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <Input
          type="textarea"
          submitOnEnter={false}
          placeholder={t('notesInputPlaceholder')}
          defaultValue={state.editedTask ? state.editedTask.notes : ''}
          onBlur={setProperties}
          id="notes"
          name="notes"
          className="h-13 w-full md:w-9/12"
        />
        <Input
          isTimeInput
          disabled={state.editedTask?.status === TaskStatus.RUNNING}
          onBlur={setProperties}
          defaultValue={
            state.editedTask?.status === TaskStatus.RUNNING && state.dynamicAccTimeSecs
              ? getHoursFromSecs(state.dynamicAccTimeSecs)
              : state.editedTask && !state.dynamicAccTimeSecs
              ? getHoursFromSecs(state.editedTask?.accTimeSecs)
              : ''
          }
          id="time"
          name="time"
          className="h-13 w-full md:w-3/12"
        />
      </div>
      {!!Object.values(errors).length && (
        <ul>
          {Object.keys(errors).map((fieldKey, idx) => (
            <li key={`${fieldKey}-${idx}`} className="text-red-400 list-disc list-inside">
              {capitalizeFirstLetter(fieldKey)} {t('errors.required')}
            </li>
          ))}
        </ul>
      )}
      {!!submitError && <span className="text-red-400">{submitError}</span>}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {!waitingDeleteTaskConfirmation && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2 w-full">
            <Button
              disabled={(!timeVisited && !titleVisited) || !!Object.values(errors).length}
              round={ButtonRound.LG}
              className="px-4 py-1.5 w-full sm:w-auto"
              variant={ButtonVariant.PRIMARY}
              type="submit"
            >
              <span className="text-white font-medium text-15">
                {state.editedTask ? t('updateEntryButtonLabel') : t('startTimerButtonLabel')}
              </span>
            </Button>
            <Button
              round={ButtonRound.LG}
              className="px-4 py-1.5 w-full sm:w-auto"
              variant={ButtonVariant.WHITE}
              onClick={handleClose}
              type="button"
            >
              <span className="font-normal text-15">{t('cancelButtonLabel')}</span>
            </Button>
          </div>
        )}
        {!waitingDeleteTaskConfirmation && !isCreatingEntry && (
          <button
            onClick={() => setWaitingDeleteConfirmation(true)}
            type="button"
            className="self-end sm:self-center mt-4 sm:mt-0 cursor-pointer underline text-warning h-fit"
          >
            {t('deleteButtonLabel')}
          </button>
        )}
      </div>
      {!!waitingDeleteTaskConfirmation && (
        <div className="flex flex-col sm:flex-row justify-end items-center space-x-0 sm:space-x-2 space-y-1 sm:space-y-0 pt-1.5 pb-1">
          <p className="text-right w-full sm:w-auto text-13 leading-5.6 text-gray-dark font-normal">
            {t('deleteConfirmationMessage')}
          </p>
          <Button
            round={ButtonRound.LG}
            className="px-2 py-1 w-full sm:w-auto"
            variant={ButtonVariant.WARNING}
            type="button"
            onClick={handleDeleteEntry}
          >
            <span className="text-white font-medium text-13">
              {t('deleteTimeEntryButtonLabel')}
            </span>
          </Button>
          <Button
            round={ButtonRound.LG}
            className="px-2 py-0.5 sm:py-1 w-full sm:w-auto"
            variant={ButtonVariant.WHITE}
            onClick={() => setWaitingDeleteConfirmation(false)}
            type="button"
          >
            <span className="font-normal text-13">{t('cancelButtonLabel')}</span>
          </Button>
        </div>
      )}
    </form>
  )
}
