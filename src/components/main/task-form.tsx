import { FormEventHandler } from 'react'
import { Button, ButtonRound, ButtonVariant } from '../button'
import { Input } from '../input'

export type TaskFormProps = {
  onClose: () => void
}

export const TaskForm = ({ onClose }: TaskFormProps) => {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const values = Object.fromEntries(formData)

    if (!values.title) {
      alert('no title')
    }
    // Considering no file uploads.
    const normValues = values as Record<string, string>
    alert(JSON.stringify(values, null, 2))

    // onSubmit(normValues)
  }

  return (
    <form className="flex space-y-2 flex-col" onSubmit={onSubmit}>
      <Input
        placeholder="Title (*)"
        id="title"
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
          id="notes"
          name="notes"
          className="h-13 w-full md:w-9/12"
        />
        <Input isTimeInput id="time" name="time" required className="h-13 w-full md:w-3/12" />
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
        <Button
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
