import { ChangeEventHandler, FocusEventHandler, InputHTMLAttributes, useState } from 'react'
import { TimeInput } from './time-input'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isTimeInput?: boolean
  id: string
  submitOnEnter?: boolean
  visited?: boolean
  errorMessage?: string
}

export const Input = ({
  placeholder,
  type = 'text',
  name,
  submitOnEnter = false,
  id,
  onFocus,
  onBlur,
  onChange,
  required,
  isTimeInput = false,
  className,
}: InputProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur?.(e)
    setIsFocus(false)
  }
  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    onFocus?.(e)
    setIsFocus(true)
  }

  const baseClassName = `rounded-base bg-white border border-gray-border text-gray-dark p-1.5 leading-5.6 text-15 w-full h-full hover:border-primary transition-colors focus:outline-none ${
    isFocus ? 'border-primary' : ''
  } ${className}`

  if (isTimeInput)
    return (
      <TimeInput
        onKeyPress={(e) => {
          e.key === 'Enter' && !submitOnEnter && e.preventDefault()
        }}
        name={name}
        id={id}
        required={required}
        onFocus={handleFocus}
        onChange={onChange}
        onBlur={handleBlur}
        className={baseClassName}
      />
    )

  switch (type) {
    case 'textarea':
      return (
        <textarea
          placeholder={placeholder}
          name={name}
          onChange={onChange as unknown as ChangeEventHandler<HTMLTextAreaElement>}
          onFocus={handleFocus as unknown as FocusEventHandler<HTMLTextAreaElement>}
          onBlur={handleBlur as unknown as FocusEventHandler<HTMLTextAreaElement>}
          id={id}
          className={`resize-none ${baseClassName}`}
        />
      )

    default:
      return (
        <input
          type="text"
          onFocus={handleFocus}
          onKeyPress={(e) => {
            e.key === 'Enter' && !submitOnEnter && e.preventDefault()
          }}
          onBlur={handleBlur}
          required={required}
          onChange={onChange}
          name={name}
          id={id}
          placeholder={placeholder}
          className={baseClassName}
        />
      )
  }
}
