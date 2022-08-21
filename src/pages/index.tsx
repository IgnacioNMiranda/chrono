import type { GetStaticPropsContext, NextPage } from 'next'
import { useContext } from 'react'
import { AnimatedBackground, TaskModal, HomeLoginPage, HomeNotLoginPage } from 'components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { TaskActionTypes, TaskContext } from 'context'
import { ChronoUserContext } from '../context/chrono-user'
import { Layout } from '../components/layout'

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

      <Layout mainClassName={`${chronoUser?.isNotLoggedIn ? 'flex' : ''} z-10`}>
        {chronoUser?.isNotLoggedIn && (
          <>
            <HomeNotLoginPage />
            <AnimatedBackground />
          </>
        )}
        {chronoUser?.isLoggedIn && <HomeLoginPage />}
      </Layout>
    </>
  )
}

export default Home
