import { useContext } from 'react'
import { ChronoUserContext } from '../../context'
import { getMainSectionClasses } from '../../utils'
import { Tabs } from '../tabs'

export const ProfilePage = () => {
  const chronoUser = useContext(ChronoUserContext)

  return (
    <section
      className={`container mx-auto flex px-4 ${getMainSectionClasses(
        chronoUser?.databaseData?.backgroundImage,
      )}`}
    >
      <Tabs user={chronoUser} />
    </section>
  )
}
