import { InputHTMLAttributes } from 'react'

export interface TimeInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TimeInput = ({ onFocus, onBlur, required, name, id, className }: TimeInputProps) => {
  return (
    <input
      type="text"
      onFocus={onFocus}
      onBlur={onBlur}
      required={required}
      name={name}
      id={id}
      placeholder="0:00"
      className={`text-2.5xl text-right leading-8 ${className}`}
    />
  )
}
