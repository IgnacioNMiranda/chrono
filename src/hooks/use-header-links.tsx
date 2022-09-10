import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

export const useHeaderLinks = () => {
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

  return { HEADER_LINKS }
}
