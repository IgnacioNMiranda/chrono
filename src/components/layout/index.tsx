import { ReactNode, useContext } from 'react'
import { ChronoUserContext } from '../../context'
import { Footer } from '../footer'
import { Header } from '../header'

export const Layout = ({
  children,
  mainClassName = '',
}: {
  children: ReactNode
  mainClassName?: string
}) => {
  const chronoUser = useContext(ChronoUserContext)

  return (
    <div className={`bg-white flex flex-col min-h-screen`}>
      <Header />
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
  )
}
