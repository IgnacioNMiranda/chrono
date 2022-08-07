import { FocusEventHandler, InputHTMLAttributes } from 'react'
import { isNumber } from '../../utils'

export interface TimeInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TimeInput = ({ onFocus, onBlur, required, name, id, className }: TimeInputProps) => {
  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur?.(e)
    const timeValues = e.target.value.split(':')
    if (timeValues.length === 1) {
      if (!timeValues[0]) return

      if (isNumber(e.target.value))
        e.target.value = `${Number(e.target.value) <= 24 ? Number(e.target.value) : 24}:00`
      else e.target.value = `0:00`
    } else if (timeValues.length === 2) {
      let [hour, minutes] = timeValues
      if (!isNumber(hour)) hour = '0'
      if (!isNumber(minutes)) minutes = '00'

      if (isNumber(hour) && isNumber(minutes)) {
        if (minutes.length === 1) minutes = `0${minutes}`
        else if (minutes.length > 2) {
          if (Number(minutes) > 59) minutes = '59'
          else minutes = minutes.slice(minutes.length - 2, minutes.length)
        }
        e.target.value = `${Number(hour) <= 24 ? hour : 24}:${Number(minutes) <= 59 ? minutes : 59}`
      } else e.target.value = `0:00`
    } else if (timeValues.length >= 3) {
      let [hour] = timeValues
      if (!isNumber(hour)) hour = '0'
      e.target.value = `${Number(hour) <= 24 ? hour : 24}:00`
    }
  }

  return (
    <input
      type="text"
      onFocus={onFocus}
      onBlur={handleBlur}
      pattern="^([0-9]+(:[0-9]{2})?)$"
      required={required}
      name={name}
      id={id}
      placeholder="0:00"
      className={`text-2.5xl text-right leading-8 ${className}`}
    />
  )
}
