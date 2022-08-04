import { useUser } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header, Footer, AnimatedBackground } from '../components'
import { MainLogin, MainNotLogin } from '../components'

const Home: NextPage = () => {
  const { user, isLoading } = useUser()

  return (
    <div className="bg-white flex flex-col h-screen">
      <Head>
        <title>Chrono</title>
        <meta name="description" content="Chrono app to manage your time!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-1 z-10 relative bg-[#FFF8F1]">
        {!isLoading && !user && (
          <>
            <MainNotLogin />
            <AnimatedBackground />
          </>
        )}
        {!isLoading && !!user && <MainLogin />}
      </main>
      <Footer />
    </div>
  )
}

export default Home
