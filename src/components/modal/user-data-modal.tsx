import { useTranslation } from 'next-i18next'
import Image from 'next/image'

export type UserDataModalProps = {
  picture: string
  nickname?: string | null
  name?: string
  timezone: string
}

export const UserDataModal = ({
  picture,
  name,
  nickname,
  timezone,
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
          <span className="block text-gray-400 text-xxs truncate">
            {t('userData.timezone')}: {timezone}
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
