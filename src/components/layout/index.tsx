import { ReactNode } from 'react'
import { Footer } from '../footer'
import { Header } from '../header'

export const Layout = ({
  children,
  mainClassName = '',
}: {
  children: ReactNode
  mainClassName?: string
}) => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 bg-secondary-light ${mainClassName}`}>{children}</main>
      <Footer />
    </div>
  )
}
