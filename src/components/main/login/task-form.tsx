import { FocusEventHandler, FormEventHandler, useContext, useState } from 'react'
import { ChronoContext } from '../../../context'
import { createNewTask } from '../../../services/task'
import { capitalizeFirstLetter, isValidTime } from '../../../utils'
import { Button, ButtonRound, ButtonVariant } from '../../button'
import { Input } from '../../input'

export type TaskFormProps = {
  onClose: () => void
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

export const TaskForm = ({ onClose }: TaskFormProps) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [titleVisited, setTitleVisited] = useState(false)
  const [timeVisited, setTimeVisited] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { state } = useContext(ChronoContext)

  const setProperties: FocusEventHandler<HTMLInputElement> = (e) => {
    setErrors(getErrors(errors, e))
    if (e.target.id === 'title' && !titleVisited) setTitleVisited(true)
    else if (e.target.id === 'time' && !timeVisited) setTimeVisited(true)
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const values = Object.fromEntries(formData)
    const { title, notes, time } = values as Record<string, string>

    try {
      await createNewTask({ title, notes, time, userId: state.user! })
      await state.refetch?.()
      setTimeVisited(false)
      setTitleVisited(false)
      form.reset()
      onClose()
    } catch (error: any) {
      console.log({ error })

      setSubmitError(error.message)
      setTimeout(() => {
        setSubmitError('')
      }, 2500)
    }
  }

  return (
    <form className="flex space-y-2 flex-col" onSubmit={onSubmit}>
      <Input
        placeholder="Title (*)"
        id="title"
        onChange={setProperties}
        onBlur={setProperties}
        submitOnEnter={false}
        name="title"
        required
        type="text"
      />
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <Input
          type="textarea"
          submitOnEnter={false}
          placeholder="Notes (optional)"
          onBlur={setProperties}
          id="notes"
          name="notes"
          className="h-13 w-full md:w-9/12"
        />
        <Input
          isTimeInput
          onBlur={setProperties}
          id="time"
          name="time"
          className="h-13 w-full md:w-3/12"
        />
      </div>
      {!!Object.values(errors).length && (
        <ul>
          {Object.keys(errors).map((fieldKey, idx) => (
            <li key={`${fieldKey}-${idx}`} className="text-red-400 list-disc list-inside">
              {capitalizeFirstLetter(fieldKey)} is required
            </li>
          ))}
        </ul>
      )}
      {!!submitError && <span className="text-red-400">{submitError}</span>}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
        <Button
          disabled={(!timeVisited && !titleVisited) || !!Object.values(errors).length}
          round={ButtonRound.LG}
          className="px-4 py-1.5 w-full sm:w-auto"
          variant={ButtonVariant.PRIMARY}
          type="submit"
        >
          <span className="text-white font-medium text-15">Start timer</span>
        </Button>
        <Button
          round={ButtonRound.LG}
          className="px-4 py-1.5 w-full sm:w-auto"
          variant={ButtonVariant.WHITE}
          onClick={onClose}
          type="button"
        >
          <span className="font-normal text-15">Cancel</span>
        </Button>
      </div>
    </form>
  )
}
