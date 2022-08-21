import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext } from 'react'
import {
  Header,
  Footer,
  AnimatedBackground,
  TaskModal,
  HomeLoginPage,
  HomeNotLoginPage,
} from 'components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { TaskActionTypes, TaskContext } from 'context'
import { ChronoUserContext } from '../context/chrono-user'

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
  const chronoUser = useContext(ChronoUserContext)
  const { state, dispatch } = useContext(TaskContext)

  return (
    <>
      {chronoUser && chronoUser.databaseData?.timezone && (
        <TaskModal
          isCreatingEntry={!state.editedTask}
          className={state.isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
          timezone={chronoUser.databaseData.timezone}
          onClose={() => {
            dispatch({
              type: TaskActionTypes.TOGGLE_MODAL,
              payload: false,
            })
            dispatch({
              type: TaskActionTypes.SET_EDITED_TASK,
              payload: undefined,
            })
          }}
        />
      )}

      <div className="bg-white flex flex-col min-h-screen">
        <Header />
        <main
          className={`${
            chronoUser?.isNotLoggedIn ? 'flex' : ''
          } flex-1 z-10 relative bg-secondary-light`}
        >
          {chronoUser?.isNotLoggedIn && (
            <>
              <HomeNotLoginPage />
              <AnimatedBackground />
            </>
          )}
          {chronoUser?.isLoggedIn && <HomeLoginPage />}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
