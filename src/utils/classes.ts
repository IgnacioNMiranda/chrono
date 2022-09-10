export const getMainSectionClasses = (backgroundImage?: string) => {
  if (backgroundImage) return 'bg-secondary-ligh bg-white shadow-lg shadow-secondary-light my-8'
  return ''
}
