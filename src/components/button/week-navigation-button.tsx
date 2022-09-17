import { ButtonHTMLAttributes } from 'react'
import { ArrowIcon } from '../icons/arrow'

export interface WeekNavigationButtonProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  iconPosition: 'left' | 'right'
}

export const WeekNavigationButton = ({ onClick, iconPosition }: WeekNavigationButtonProps) => {
  return (
    <button
      className={`border border-gray-border hover:border-gray-modal p-2 ${
        iconPosition === 'left' ? 'rounded-l-lg border-r-transparent' : 'rounded-r-lg -ml-px'
      }`}
      onClick={onClick}
    >
      <ArrowIcon iconPosition={iconPosition} />
    </button>
  )
}
