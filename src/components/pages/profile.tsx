import { useContext } from 'react'
import { ChronoUserContext } from '../../context'
import { Tabs } from '../tabs'

export const ProfilePage = () => {
  const chronoUser = useContext(ChronoUserContext)

  return (
    <section className="container mx-auto my-auto flex px-4">
      <Tabs user={chronoUser} />
    </section>
  )
}
