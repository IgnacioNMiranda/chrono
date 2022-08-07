import { ButtonHTMLAttributes } from 'react'
import { Button, ButtonRound, ButtonVariant } from '../button'
import { PlusIcon } from '../icons'

export interface TrackTaskButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const TrackTaskButton = ({ onClick, className }: TrackTaskButtonProps) => {
  return (
    <div className={className}>
      <Button
        round={ButtonRound.XL}
        className="w-16 h-16"
        variant={ButtonVariant.PRIMARY}
        onClick={onClick}
      >
        <PlusIcon color="white" width={48} height={48} className="font-bold" />
      </Button>
      <span className="text-13 mt-2 block leading-5 font-normal">Track Task</span>
    </div>
  )
}
