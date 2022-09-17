import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'
import { UserData } from './user-data'
import { useRouter } from 'next/router'
import { HamburgerIcon } from '../icons'
import { useHeaderLinks } from '../../hooks'
import { useTranslation } from 'next-i18next'

export const Header = ({ toggleNavigationModal }: { toggleNavigationModal: () => void }) => {
  const { user } = useUser()
  const { locale, pathname } = useRouter()
  const { HEADER_LINKS } = useHeaderLinks()
  const { t } = useTranslation('header')

  return (
    <header className="bg-primary h-12 z-20">
      <div className="container mx-auto h-full flex justify-between font-medium text-white px-4">
        {!!user && (
          <>
            <button
              onClick={toggleNavigationModal}
              className="flex sm:hidden space-x-2 items-center"
            >
              <HamburgerIcon />
              <span>{t('menuLabel')}</span>
            </button>
            <ul className="hidden sm:flex items-center h-full">
              {HEADER_LINKS.map(({ href, label }, idx) => (
                <li
                  key={`link-${href}-${idx}`}
                  className={`h-full hover:bg-primary-light ${
                    pathname === href ? 'bg-primary-light' : ''
                  }`}
                >
                  <Link href={href} locale={locale}>
                    <a className="h-full flex items-center px-2">{label}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <UserData />
          </>
        )}
      </div>
    </header>
  )
}
