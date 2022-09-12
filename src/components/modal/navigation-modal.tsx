import { useUser } from '@auth0/nextjs-auth0'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useHeaderLinks } from 'hooks'
import { CloseIcon } from '../icons'

export const NavigationModal = ({
  isOpen = false,
  toggleNavigationModal,
}: {
  isOpen: boolean
  toggleNavigationModal: () => void
}) => {
  const { HEADER_LINKS } = useHeaderLinks()
  const { user } = useUser()
  const { locale, pathname } = useRouter()
  const { t } = useTranslation('common')

  return (
    <div
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col sm:hidden space-y-4 fixed h-full w-screen transition-transform ease-in-out origin-right bg-gray-dark z-30 p-4`}
    >
      <button
        onClick={toggleNavigationModal}
        className="text-white w-fit flex space-x-1 p-2 items-center rounded-base bg-gray-medium"
      >
        <CloseIcon width={16} height={16} color="currentColor" className="font-medium text-15" />
        <span className="text-15 font-medium">{t('navigationModal.closeMenuLabel')}</span>
      </button>
      <ul className="flex flex-col text-white">
        {!!user &&
          HEADER_LINKS.map(({ href, label }, idx) => (
            <li
              key={`link-${href}-${idx}`}
              className={`text-xl border-b border-b-gray-medium ${
                pathname === href ? 'bg-gray-medium' : ''
              }`}
            >
              <Link href={href} locale={locale}>
                <a className="h-full flex items-center px-2 py-2" onClick={toggleNavigationModal}>
                  {label}
                </a>
              </Link>
            </li>
          ))}
        <li></li>
      </ul>
    </div>
  )
}
