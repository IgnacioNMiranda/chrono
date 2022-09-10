import { useTranslation } from 'next-i18next'
import { useContext } from 'react'
import { ChronoUserContext, TaskActionTypes, TaskContext } from 'context'
import { Records } from './records'
import { TrackTaskButton, PlusIcon } from 'components'
import { getMainSectionClasses } from 'utils'

export const HomeLoginPage = () => {
  const chronoUser = useContext(ChronoUserContext)
  const { dispatch } = useContext(TaskContext)

  const { t } = useTranslation('main')

  return (
    <section
      className={`container mx-auto flex flex-col justify-center py-8 px-4 relative z-10 ${getMainSectionClasses(
        chronoUser?.databaseData?.backgroundImage,
      )}`}
    >
      <div className="flex flex-row sm:space-x-4">
        {chronoUser?.databaseData && (
          <>
            <TrackTaskButton
              className="mt-13 hidden sm:block"
              buttonClassName="w-16 h-16"
              onClick={() => {
                dispatch({
                  type: TaskActionTypes.TOGGLE_MODAL,
                  payload: true,
                })
              }}
            >
              <PlusIcon color="white" width={48} height={48} className="font-bold" />
            </TrackTaskButton>
            <Records chronoUser={chronoUser} />
          </>
        )}
        {!!chronoUser?.hasError && (
          <p className="font-bold text-center sm:text-left">{t('login.errorMessage')}</p>
        )}
      </div>
    </section>
  )
}
