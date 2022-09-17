import { ButtonHTMLAttributes } from 'react'
import { ArrowIcon } from '../icons/arrow'

export interface CalendarNavigationButtonProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  iconPosition: 'left' | 'right'
}

export const CalendarNavigationButton = ({
  onClick,
  iconPosition,
}: CalendarNavigationButtonProps) => {
  return (
    <button className={`bg-white hover:bg-gray-light p-2 rounded-base`} onClick={onClick}>
      <ArrowIcon iconPosition={iconPosition} />
    </button>
  )
}
