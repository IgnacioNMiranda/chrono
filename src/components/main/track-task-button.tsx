import { ButtonHTMLAttributes } from 'react'
import { Button, ButtonRound, ButtonVariant } from '../button'

export interface TrackTaskButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonClassName?: string
  buttonRound?: ButtonRound
}

export const TrackTaskButton = ({
  onClick,
  className = '',
  buttonRound = ButtonRound.XL,
  buttonClassName = '',
  children,
}: TrackTaskButtonProps) => {
  return (
    <div className={className}>
      <Button
        round={buttonRound}
        className={buttonClassName}
        variant={ButtonVariant.PRIMARY}
        onClick={onClick}
      >
        {children}
      </Button>
      <span className="text-13 mt-2 leading-5 font-normal hidden sm:block">Track Task</span>
    </div>
  )
}
