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
  XL = 'xl',
}

const roundClasses: Record<ButtonRound, string> = {
  [ButtonRound.LG]: 'rounded-lg',
  [ButtonRound.XL]: 'rounded-xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant
  round: ButtonRound
}

export const Button = ({
  onClick,
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
      className={`${roundClasses[round]} ${variantClasses[variant]} transition-colors flex justify-center items-center ${className}`}
    >
      {children}
    </button>
  )
}
