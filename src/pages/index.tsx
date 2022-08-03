import type { NextPage } from 'next'
import Head from 'next/head'
import { Header, Footer } from '../components'

const Home: NextPage = () => {
  return (
    <div className="bg-white flex flex-col h-screen">
      <Head>
        <title>Chrono</title>
        <meta name="description" content="Chrono app to manage your time!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-1">
        <div>main content</div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
