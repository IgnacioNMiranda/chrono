import { UserProfile, useUser } from '@auth0/nextjs-auth0'
import { QueryObserverBaseResult, useQuery } from '@tanstack/react-query'
import { HydratedDocument } from 'mongoose'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { IUser } from 'database/models'
import { getUserData } from 'services'

export type ChronoUser = {
  isLoggedIn?: boolean
  isNotLoggedIn?: boolean
  refetch?: () => Promise<QueryObserverBaseResult>
  databaseData?: HydratedDocument<IUser>
  providerData?: UserProfile
  hasError?: boolean
  isLoading?: boolean
}

/** Context */
export const ChronoUserContext = createContext<ChronoUser | undefined>({
  isLoading: true,
})

/** Provider */
export const ChronoUserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useUser()
  const { locale } = useRouter()

  const [hasError, setHasError] = useState(false)
  const { data, refetch } = useQuery<HydratedDocument<IUser>>(
    ['userData'],
    () => getUserData(user, locale),
    {
      enabled: !!user && !!locale,
      onError: (err) => {
        if (err instanceof Error) {
          if (['404'].includes(err.message)) {
            window.location.href = '/api/auth/logout'
          } else if (['500', '504'].includes(err.message)) {
            setHasError(true)
          }
        }
      },
    },
  )

  const [chronoUser, setChronoUser] = useState<ChronoUser>()

  useEffect(() => {
    setChronoUser((prevUser) => ({
      ...prevUser,
      isLoggedIn: !isLoading && !!user,
      isNotLoggedIn: !isLoading && !user,
      isLoading,
      providerData: user,
    }))
  }, [user, isLoading])

  useEffect(() => {
    if (data) {
      setChronoUser((prevUser) => ({
        ...prevUser,
        databaseData: data,
      }))
    }
  }, [data])

  const value = useMemo(
    () => ({ ...chronoUser, refetch, hasError }),
    [chronoUser, refetch, hasError],
  )

  return <ChronoUserContext.Provider value={value}>{children}</ChronoUserContext.Provider>
}
