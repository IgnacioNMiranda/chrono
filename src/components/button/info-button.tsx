import { ButtonHTMLAttributes } from 'react'

export interface InfoButtonProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  label?: string
}

export const InfoButton = ({ onClick, label }: InfoButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-info hover:text-primary-dark transition-colors underline text-15 font-normal leading-5.6"
    >
      {label}
    </button>
  )
}
