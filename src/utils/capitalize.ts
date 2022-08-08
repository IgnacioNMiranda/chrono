export const capitalizeFirstLetter = (value: string) => {
  const lowercase = value.toLowerCase()
  return `${lowercase.substring(0, 1).toUpperCase()}${lowercase.substring(1)}`
}
