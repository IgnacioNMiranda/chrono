import { useUser } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext } from 'react'
import { Header, Footer, AnimatedBackground } from '../components'
import { MainLogin, MainNotLogin } from '../components'
import { TaskModal } from '../components/main'
import { ChronoActionTypes, ChronoContext } from '../context'

const Home: NextPage = () => {
  const { user, isLoading } = useUser()
  const { state, dispatch } = useContext(ChronoContext)

  const isLoggedIn = !isLoading && !!user
  const isNotLoggedIn = !isLoading && !user

  return (
    <>
      {state && state.timezone && (
        <TaskModal
          isCreatingEntry={!state.editedTask}
          className={state.isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
          timezone={state.timezone}
          onClose={() => {
            dispatch({
              type: ChronoActionTypes.TOGGLE_MODAL,
              payload: false,
            })
            dispatch({
              type: ChronoActionTypes.SET_EDITED_TASK,
              payload: undefined,
            })
          }}
        />
      )}

      <div className="bg-white flex flex-col min-h-screen">
        <Head>
          <title>Chrono</title>
          <meta name="description" content="Chrono app to manage your time!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className={`${isNotLoggedIn ? 'flex' : ''} flex-1 z-10 relative bg-secondary-light`}>
          {isNotLoggedIn && (
            <>
              <MainNotLogin />
              <AnimatedBackground />
            </>
          )}
          {isLoggedIn && <MainLogin />}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
