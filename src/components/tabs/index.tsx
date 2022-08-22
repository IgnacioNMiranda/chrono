import { FormEventHandler, useMemo, useState } from 'react'
import Image from 'next/image'
import { ChronoUser } from '../../context'
import { BasicInfoContent } from './basic-info'
import { Auth0GoogleUser } from '../../types'
import { updateUserData } from '../../services'
import { useTranslation } from 'next-i18next'
import { CheckIcon, CloseIcon } from '../icons'

export type UserData = {
  name?: string
  picture: string
  nickname?: string | null
  email?: string | null
  timezone?: string
  backgroundImageUrl?: string
  thumbnailImageUrl?: string
}

export const Tabs = ({ user }: { user?: ChronoUser }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successfulUpdate, setSuccessfulUpdate] = useState(false)
  const [hasUpdateError, setHasUpdateError] = useState(false)
  const { t } = useTranslation('profile')

  const tabLinks = useMemo(
    () => [
      {
        label: t('basicInfoTabLabel'),
        id: 'basic-info',
      },
      {
        label: t('comingSoonTabLabel'),
        id: 'coming-soon-1',
      },
      {
        label: t('comingSoonTabLabel'),
        id: 'coming-soon-2',
      },
    ],
    [t],
  )

  const onBasicInfoSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const values = Object.fromEntries(formData)
    const { name, nick, backgroundImage, thumbnailImage } = values as Record<string, string>

    try {
      setIsSubmitting(true)
      await updateUserData({
        name,
        nick,
        backgroundImage,
        email: user?.providerData?.email!,
        id: user?.databaseData?._id!,
        thumbnailImage,
        provider: user?.databaseData?.provider!,
      })
      setIsSubmitting(false)
      setSuccessfulUpdate(true)
      setTimeout(() => {
        setSuccessfulUpdate(false)
      }, 3000)
      await user?.refetch?.()
    } catch (error: any) {
      setIsSubmitting(false)
      setHasUpdateError(true)
      setTimeout(() => {
        setHasUpdateError(false)
      }, 3000)
    }
  }

  const userData = useMemo(
    () => ({
      name:
        user?.providerData && 'given_name' in user.providerData
          ? (user.providerData as Auth0GoogleUser).given_name
          : user?.providerData?.nickname ?? 'none',
      picture: user?.providerData?.picture ?? '/images/no-image-available.png',
      nickname: user?.providerData?.nickname,
      email: user?.providerData?.email,
      timezone: user?.databaseData?.timezone,
      backgroundImageUrl: user?.databaseData?.backgroundImage,
      thumbnailImageUrl: user?.databaseData?.thumbnailImage,
    }),
    [user],
  )

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between h-full my-8 space-y-8 lg:space-y-0">
      <div className="w-full lg:w-3/12 lg:pr-8">
        <div className="flex items-center gap-x-2 mb-6">
          <Image
            width={64}
            height={64}
            className="rounded-full"
            src={userData.picture}
            alt="user profile photo"
          />
          <div className="flex-col inline-flex gap-y-1 text-black">
            <span className="block font-medium text-xl break-words">{userData.name}</span>
            <span className="block text-gray-dark text-13 truncate break-words">
              {userData.email}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <ul className="flex flex-col gap-y-0.5">
          {tabLinks.map((tabLink, idx) => (
            <li tabIndex={1} key={`${idx}-${tabLink.label}`}>
              <a
                href={`#${tabLink.id}`}
                onClick={() => setSelectedTabIndex(idx)}
                className={`${
                  selectedTabIndex === idx
                    ? 'bg-primary-lighter border-primary font-medium'
                    : 'border-gray-300 hover:bg-gray-light font-normal'
                } block text-gray-dark border-l-2 px-4 py-2`}
              >
                {tabLink.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full lg:w-9/12">
        {successfulUpdate && (
          <div className="bg-green-light p-4 border border-green-dark flex space-x-2 sm:items-center w-full mb-4">
            <CheckIcon color="#76bc82" />
            <span className="block font-medium text-gray-dark text-15 break-words">
              {t('basicInfoContent.successfulUpdateLabel')}
            </span>
          </div>
        )}

        {hasUpdateError && (
          <div className="bg-red-light p-4 border border-red-dark flex space-x-2 sm:items-center w-full mb-4">
            <CloseIcon color="#B91C1C" />
            <span className="block font-medium text-gray-dark text-15 break-words">
              {t('basicInfoContent.unsuccessfulUpdateLabel')}
            </span>
          </div>
        )}

        {!!(selectedTabIndex === 0) && (
          <BasicInfoContent
            onSubmit={onBasicInfoSubmit}
            userData={userData}
            isSubmitting={isSubmitting}
          />
        )}
        {!!(selectedTabIndex !== 0) && <p>Coming soon...</p>}
      </div>
    </div>
  )
}
