import { useContext, useMemo, useRef, useState } from 'react'
import { useClickOutside } from 'hooks'
import { Auth0GoogleUser } from 'types'
import Image from 'next/image'
import { UserDataModal } from '../modal'
import { ChronoUserContext } from 'context'

export const UserData = () => {
  const chronoUser = useContext(ChronoUserContext)

  const [showUserModal, setShowUserModal] = useState(false)
  const userData = useMemo(
    () => ({
      name:
        chronoUser?.providerData && 'given_name' in chronoUser.providerData
          ? (chronoUser.providerData as Auth0GoogleUser).given_name
          : chronoUser?.providerData?.nickname ?? 'none',
      picture: chronoUser?.providerData?.picture ?? '/images/no-image-available.avif',
      nickname: chronoUser?.providerData?.nickname,
      timezone: chronoUser?.databaseData?.timezone,
    }),
    [chronoUser],
  )

  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setShowUserModal(false))

  return (
    <div
      ref={ref}
      className={`relative hover:bg-primary-light ${
        showUserModal ? 'bg-primary-light' : ''
      } h-full flex items-center`}
    >
      <button
        className="flex justify-center gap-x-2 h-full items-center px-2"
        onClick={() => setShowUserModal(!showUserModal)}
      >
        {chronoUser?.providerData?.picture && (
          <Image
            width={28}
            height={28}
            className="rounded-3xl"
            src={chronoUser?.providerData?.picture}
            alt={chronoUser?.providerData?.nickname ?? 'user profile photo'}
          />
        )}
        <span className="block">{userData.name}</span>
      </button>
      {!!showUserModal && <UserDataModal {...userData} className="absolute top-14 right-0" />}
    </div>
  )
}
