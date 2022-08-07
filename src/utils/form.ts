import { InputProps } from '../components'

export const getInitialValues = (controls: InputProps[]) =>
  controls.reduce<Record<string, string>>((prevValue, control) => {
    return {
      ...prevValue,
      [control.id as string]: '',
    }
  }, {})

export const getValidateFunction = (controls: InputProps[]) => {
  return (values: Record<string, string>) => {
    const errors: Record<string, string> = {}
    Object.keys(values).forEach((key) => {
      const control = controls.find((c) => c.id === key)

      if (control) {
        if (!values[key] && control.required) {
          errors[key] = control.errorMessage || 'Required'
        } else if (
          control.type === 'email' &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[key])
        ) {
          errors[key] = control.errorMessage || 'Invalid email address'
        } else if (
          control.maxLength &&
          typeof values[key] === 'string' &&
          values[key].length > control.maxLength
        ) {
          errors[key] = `Cannot contain more than ${control.maxLength} characters`
        } else if (
          control.maxLength &&
          typeof values[key] === 'number' &&
          String(values[key]).length > control.maxLength
        ) {
          errors[key] = `Must be lower than ${control.maxLength} digits`
        } else if (
          control.minLength &&
          typeof values[key] === 'number' &&
          String(values[key]).length < control.minLength
        ) {
          errors[key] = `Must be greater than ${control.minLength} digits`
        }
      }
    })

    return errors
  }
}
