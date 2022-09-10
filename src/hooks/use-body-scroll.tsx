import { useEffect } from 'react'

export const useBodyScroll = (isDisable: boolean) => {
  useEffect(() => {
    if (isDisable) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isDisable])
}
