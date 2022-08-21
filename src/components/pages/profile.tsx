import { useTranslation } from 'next-i18next'

export const ProfilePage = () => {
  const { t } = useTranslation('profile')

  return (
    <section className="container mx-auto my-auto flex justify-center items-center px-4 relative z-10">
      Profile page
    </section>
  )
}
