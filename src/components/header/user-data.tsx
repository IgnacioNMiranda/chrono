import { UserProfile, useUser } from '@auth0/nextjs-auth0'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'
import { useClickOutside } from '../../hooks'
import { Auth0GoogleUser } from '../../types'

export type UserDataModalProps = {
  picture: string
  nickname?: string | null
  name?: string
}

const UserDataModal = ({
  picture,
  name,
  nickname,
  className,
}: UserDataModalProps & { className?: string }) => {
  const { t } = useTranslation('header')

  return (
    <div className={`bg-white rounded-md shadow-lg border border-gray-300 pb-3 w-52 ${className}`}>
      <div className="flex items-center gap-x-2 px-4 pt-3">
        <Image
          width={40}
          height={40}
          className="rounded-3xl"
          src={picture}
          alt="user profile photo"
        />
        <div className="flex-col inline-flex gap-y-1 text-black">
          <span className="block font-medium text-sm">{name}</span>
          <span className="block text-gray-400 text-xxs truncate">
            {t('userData.nickLabel')}: {nickname}
          </span>
        </div>
      </div>
      <hr className="my-3 border-gray-300" />
      <a
        href="/api/auth/logout"
        className="text-black hover:text-white px-4 w-full block py-2 hover:bg-primary"
      >
        {t('userData.logoutLink')}
      </a>
    </div>
  )
}

export const UserData = () => {
  const { user } = useUser()

  const [showUserModal, setShowUserModal] = useState(false)
  const userData = useMemo(
    () => ({
      name:
        user && 'given_name' in user
          ? (user as Auth0GoogleUser).given_name
          : user?.nickname ?? 'none',
      picture: user?.picture ?? '/images/no-image-available.avif',
      nickname: user?.nickname,
    }),
    [user],
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
