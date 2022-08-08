import { ButtonHTMLAttributes } from 'react'

export enum ButtonVariant {
  PRIMARY = 'primary',
  WHITE = 'white',
}

const variantClasses: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: 'bg-primary hover:bg-primary-dark',
  [ButtonVariant.WHITE]: 'bg-white border border-gray-border text-gray hover:border-gray-dark',
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
}

export const Button = ({
  onClick,
  disabled,
  type,
  round,
  variant,
  className = '',
  children,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
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
