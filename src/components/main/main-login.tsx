import { useUser } from '@auth0/nextjs-auth0'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { TaskModalActionTypes, TaskModalContext } from '../../context'
import { IUser } from '../../database'
import { getUserData } from '../../services'
import { Records } from './records'
import { TrackTaskButton } from './track-task-button'

export const MainLogin = () => {
  const { user } = useUser()
  const { data } = useQuery<IUser>(['userData'], () => getUserData(user), {
    enabled: !!user,
  })

  const { state, dispatch } = useContext(TaskModalContext)

  useEffect(() => {
    if (!!data) {
      dispatch({
        type: TaskModalActionTypes.SET_TIMEZONE,
        payload: data?.timezone,
      })
    }
  }, [data, dispatch])

  return (
    <section className="container mx-auto flex flex-col justify-center py-8 px-4 relative z-10">
      <div className="flex flex-row space-x-4">
        {user && data && (
          <>
            <TrackTaskButton
              className="mt-13"
              onClick={() => {
                dispatch({
                  type: TaskModalActionTypes.TOGGLE_MODAL,
                  payload: true,
                })
              }}
            />
            <Records timezone={data.timezone} records={data.records} />
          </>
        )}
      </div>
    </section>
  )
}
