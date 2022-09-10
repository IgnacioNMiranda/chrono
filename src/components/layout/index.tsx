import { ReactNode, useContext, useState } from 'react'
import { ChronoUserContext } from 'context'
import { useBodyScroll, useIsLoading } from 'hooks'
import { Footer } from '../footer'
import { Header } from '../header'
import { SpinnerIcon } from '../icons'
import { NavigationModal } from '../modal'

export const Layout = ({
  children,
  mainClassName = '',
}: {
  children: ReactNode
  mainClassName?: string
}) => {
  const chronoUser = useContext(ChronoUserContext)
  const isLoading = useIsLoading()

  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false)
  const toggleNavigationModal = () => {
    setIsNavigationModalOpen((prev) => !prev)
  }

  useBodyScroll(isNavigationModalOpen)

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerIcon width={100} height={100} color="#9f5fd4" />
      </div>
    )

  return (
    <>
      <NavigationModal
        isOpen={isNavigationModalOpen}
        toggleNavigationModal={toggleNavigationModal}
      />
      <div className={`bg-white flex flex-col min-h-screen`}>
        <Header toggleNavigationModal={toggleNavigationModal} />
        <main
          style={
            chronoUser?.databaseData?.backgroundImage
              ? {
                  backgroundImage: `url(${chronoUser?.databaseData?.backgroundImage})`,
                  objectFit: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                }
              : undefined
          }
          className={`relative flex-1 bg-secondary-ligh bg-white ${mainClassName}`}
        >
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
