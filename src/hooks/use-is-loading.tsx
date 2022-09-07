import { useState, useContext, useEffect } from 'react'
import { ChronoUserContext } from '../context'

export const useIsLoading = () => {
  const [globalIsLoading, setGlobalIsLoading] = useState<boolean | undefined>(true)
  const chronoUser = useContext(ChronoUserContext)
  useEffect(() => {
    setGlobalIsLoading(chronoUser?.isLoading)
  }, [chronoUser?.isLoading])

  return chronoUser?.isLoading || globalIsLoading
}
