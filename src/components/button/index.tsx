import { ButtonHTMLAttributes, MouseEventHandler } from 'react'

export * from './track-task-button'

export enum ButtonVariant {
  PRIMARY = 'primary',
  WHITE = 'white',
  GRAY_DARK = 'gray-dark',
  WARNING = 'warning',
}

const variantClasses: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'bg-primary hover:bg-primary-dark',
  [ButtonVariant.WHITE]: 'bg-white border border-gray-border text-gray hover:border-gray-dark',
  [ButtonVariant.GRAY_DARK]: 'bg-gray-dark border border-gray-border text-white hover:border-gray',
  [ButtonVariant.WARNING]: 'bg-warning hover:bg-warning-dark text-white',
}

export enum ButtonRound {
  LG = 'lg',
  LGXL = 'lgxl',
  XL = 'xl',
}

const roundClasses: Record<ButtonRound, string> = {
  [ButtonRound.LG]: 'rounded-lg',
  [ButtonRound.LGXL]: 'rounded-lgxl',
  [ButtonRound.XL]: 'rounded-xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant
  round: ButtonRound
  actionValue?: string
}

export const Button = ({
  onClick,
  disabled,
  type,
  actionValue,
  round,
  variant,
  className = '',
  children,
}: ButtonProps) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e)
    if (actionValue) {
      window.location.href = actionValue
    }
  }

  return (
    <button
      onClick={handleClick}
      type={type}
      disabled={disabled}
      className={`${roundClasses[round]} ${variantClasses[variant]} ${
        disabled ? 'opacity-30 cursor-default pointer-events-none' : ''
      } transition-colors flex justify-center items-center ${className}`}
    >
      {children}
    </button>
  )
}
