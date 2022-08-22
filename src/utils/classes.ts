export const getMainSectionClasses = (backgroundImage?: string) => {
  if (backgroundImage) return 'bg-secondary-ligh bg-white shadow-lg shadow-secondary-light mt-8'
  return ''
}
