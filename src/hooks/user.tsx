import { useUser } from '@auth0/nextjs-auth0'

export const useChronoUser = () => {
  const { user, isLoading } = useUser()
  const isLoggedIn = !isLoading && !!user
  const isNotLoggedIn = !isLoading && !user

  return { isLoggedIn, isNotLoggedIn }
}
