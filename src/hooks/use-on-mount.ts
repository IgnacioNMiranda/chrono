import { useEffect, useState } from 'react'

export const useOnMount = () => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])
  return { isMounted }
}
