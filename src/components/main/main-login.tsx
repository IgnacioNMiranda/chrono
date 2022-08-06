import { useUser } from '@auth0/nextjs-auth0'
import { useQuery } from '@tanstack/react-query'
import { getUserData } from '../../services'

export const MainLogin = () => {
  const { user } = useUser()
  const { data, isLoading, isError } = useQuery(['userData'], () => getUserData(user), {
    enabled: !!user,
  })

  return (
    <section className="container mx-auto flex justify-center py-3 px-4 relative z-10">
      {JSON.stringify(data)}
    </section>
  )
}
