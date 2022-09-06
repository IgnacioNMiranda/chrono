import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'
import { UserData } from './user-data'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

export const Header = () => {
  const { user } = useUser()
  const { locale, pathname } = useRouter()
  const { t } = useTranslation('header')

  const HEADER_LINKS = useMemo(
    () => [
      {
        href: '/',
        label: t('homeLink'),
      },
      {
        href: '/changelog',
        label: t('changelogLink'),
      },
    ],
    [t],
  )

  return (
    <header className="bg-primary h-12 z-20">
      <div className="container mx-auto h-full flex justify-between font-medium text-white px-4">
        <ul className="flex items-center h-full">
          {!!user &&
            HEADER_LINKS.map(({ href, label }, idx) => (
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
        {!!user && <UserData />}
      </div>
    </header>
  )
}
