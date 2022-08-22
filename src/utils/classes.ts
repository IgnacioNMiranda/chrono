export const getMainSectionClasses = (backgroundImage?: string) => {
  if (backgroundImage) return 'bg-secondary-light shadow-lg shadow-secondary-light mt-8'
  return ''
}
