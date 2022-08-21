import { useUser } from '@auth0/nextjs-auth0'
import { useContext, useMemo, useRef, useState } from 'react'
import { ChronoContext } from 'context'
import { useClickOutside } from 'hooks'
import { Auth0GoogleUser } from 'types'
import Image from 'next/image'
import { UserDataModal } from '../modal'

export const UserData = () => {
  const { user } = useUser()

  const [showUserModal, setShowUserModal] = useState(false)
  const { state } = useContext(ChronoContext)
  const userData = useMemo(
    () => ({
      name:
        user && 'given_name' in user
          ? (user as Auth0GoogleUser).given_name
          : user?.nickname ?? 'none',
      picture: user?.picture ?? '/images/no-image-available.avif',
      nickname: user?.nickname,
      timezone: state.timezone,
    }),
    [user, state.timezone],
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
        {user?.picture && (
          <Image
            width={28}
            height={28}
            className="rounded-3xl"
            src={user.picture}
            alt={user.nickname ?? 'user profile photo'}
          />
        )}
        <span className="block">{userData.name}</span>
      </button>
      {!!showUserModal && <UserDataModal {...userData} className="absolute top-14 right-0" />}
    </div>
  )
}
