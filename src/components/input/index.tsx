import { InputHTMLAttributes, useState } from 'react'
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
  visited = false,
  submitOnEnter = false,
  id,
  required,
  isTimeInput = false,
  className,
}: InputProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const onBlur = () => setIsFocus(false)
  const onFocus = () => setIsFocus(true)

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
        onFocus={onFocus}
        onBlur={onBlur}
        className={baseClassName}
      />
    )

  switch (type) {
    case 'textarea':
      return (
        <textarea
          placeholder={placeholder}
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
          id={id}
          className={`resize-none ${baseClassName}`}
        />
      )

    default:
      return (
        <input
          type="text"
          onFocus={onFocus}
          onKeyPress={(e) => {
            e.key === 'Enter' && !submitOnEnter && e.preventDefault()
          }}
          onBlur={onBlur}
          required={required}
          name={name}
          id={id}
          placeholder={placeholder}
          className={baseClassName}
        />
      )
  }
}
