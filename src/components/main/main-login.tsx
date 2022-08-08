import { useUser } from '@auth0/nextjs-auth0'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { ChronoActionTypes, ChronoContext } from '../../context'
import { getUserData } from '../../services'
import { PlusIcon } from '../icons'
import { Records } from './records'
import { TrackTaskButton } from './track-task-button'

export const MainLogin = () => {
  const { user } = useUser()
  const { data, refetch } = useQuery(['userData'], () => getUserData(user), {
    enabled: !!user,
  })

  const { dispatch } = useContext(ChronoContext)

  useEffect(() => {
    if (!!data) {
      dispatch({
        type: ChronoActionTypes.SET_TIMEZONE,
        payload: data?.timezone,
      })
      dispatch({
        type: ChronoActionTypes.SET_USER,
        payload: data?._id,
      })
      dispatch({
        type: ChronoActionTypes.SET_REFETCH_USER,
        payload: refetch,
      })
    }
  }, [data, dispatch, refetch])

  return (
    <section className="container mx-auto flex flex-col justify-center py-8 px-4 relative z-10">
      <div className="flex flex-row sm:space-x-4">
        {user && data && (
          <>
            <TrackTaskButton
              className="mt-13 hidden sm:block"
              buttonClassName="w-16 h-16"
              onClick={() => {
                dispatch({
                  type: ChronoActionTypes.TOGGLE_MODAL,
                  payload: true,
                })
              }}
            >
              <PlusIcon color="white" width={48} height={48} className="font-bold" />
            </TrackTaskButton>
            <Records timezone={data.timezone} records={data.records} />
          </>
        )}
      </div>
    </section>
  )
}
