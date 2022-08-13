import { useTranslation } from 'next-i18next'
import { CronIcon } from '../icons'

export const MainNotLogin = () => {
  const { t } = useTranslation('main')

  return (
    <section className="container mx-auto my-auto flex justify-center items-center px-4 relative z-10">
      <div className="blob-shape flex flex-col items-center justify-center">
        <h1 className="text-white font-bold text-6xl md:text-gargantuar text-center">
          <span className="block">⏱️</span> {t('notLogin.title')}
        </h1>
        <p className="text-white font-medium text-md md:text-xl">{t('notLogin.footer')}</p>
        <a
          href="/api/auth/login"
          className="mt-20 text-center text-white bg-primary transition-colors hover:bg-primary-dark rounded-full px-8 py-3 text-xl md:text-3xl w-64 md:w-80"
        >
          {t('notLogin.link')}
        </a>
      </div>
    </section>
  )
}

export const AnimatedBackground = () => {
  return (
    <ul className="animated-bg">
      {new Array(13).fill(0).map((_, index) => (
        <li key={`index-${index}`}>
          <CronIcon />
        </li>
      ))}
    </ul>
  )
}
