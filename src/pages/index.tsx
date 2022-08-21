import { useUser } from '@auth0/nextjs-auth0'
import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext } from 'react'
import {
  Header,
  Footer,
  AnimatedBackground,
  TaskModal,
  HomeLoginPage,
  HomeNotLoginPage,
} from '../components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChronoActionTypes, ChronoContext } from '../context'

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'task-modal',
        'task-form',
        'main',
        'header',
      ])),
      // Will be passed to the page component as props
    },
  }
}

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
        <Header />
        <main className={`${isNotLoggedIn ? 'flex' : ''} flex-1 z-10 relative bg-secondary-light`}>
          {isNotLoggedIn && (
            <>
              <HomeNotLoginPage />
              <AnimatedBackground />
            </>
          )}
          {isLoggedIn && <HomeLoginPage />}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
