import { useMemo } from 'react'
import { IRecord } from '../../database'
import { getDateData } from '../../utils'

export type RecordsProps = {
  timezone: string
  records: IRecord[]
}

export const Records = ({ timezone, records }: RecordsProps) => {
  const dateData = useMemo(() => getDateData(timezone), [timezone])

  return (
    <div className="flex flex-col space-y-4 w-full">
      <section>
        <h1 className="font-medium text-3xl">
          Today:{' '}
          <span className="font-normal">
            {dateData.dayName}, {dateData.day} {dateData.monthName}
          </span>
        </h1>
      </section>
      <section className="bg-gray-light w-full h-72 flex justify-center items-center">
        <p className="text-center text-gray-dark font-medium text-base">
          Time is as valuable as you (: <br /> - Anonymous
        </p>
      </section>
    </div>
  )
}
