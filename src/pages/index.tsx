import { useUser } from '@auth0/nextjs-auth0'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext } from 'react'
import { Header, Footer, AnimatedBackground } from '../components'
import { MainLogin, MainNotLogin } from '../components'
import { TaskModal } from '../components/main/task-modal'
import { TaskModalActionTypes, TaskModalContext } from '../context'

const Home: NextPage = () => {
  const { user, isLoading } = useUser()
  const { state, dispatch } = useContext(TaskModalContext)

  return (
    <>
      {state && state.timezone && (
        <TaskModal
          className={state.isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
          timezone={state.timezone}
          onClose={() =>
            dispatch({
              type: TaskModalActionTypes.TOGGLE_MODAL,
              payload: false,
            })
          }
        />
      )}

      <div className="bg-white flex flex-col min-h-screen">
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
    </>
  )
}

export default Home
