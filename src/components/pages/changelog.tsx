import { useTranslation } from 'next-i18next'
import { useContext, useMemo } from 'react'
import { ChronoUserContext } from '../../context'
import { getMainSectionClasses } from '../../utils'

export const ChangeLogPage = () => {
  const chronoUser = useContext(ChronoUserContext)
  const { t } = useTranslation('changelog')

  const rows = useMemo(
    () => [
      {
        date: t('17-sept-2022-dateValue'),
        description: t('17-sept-2022-descriptionValue'),
      },
      {
        date: t('12-sept-2022-dateValue'),
        description: t('12-sept-2022-descriptionValue'),
      },
      {
        date: t('10-sept-2022-dateValue'),
        description: t('10-sept-2022-descriptionValue'),
      },
      {
        date: t('05-sept-2022-dateValue'),
        description: t('05-sept-2022-descriptionValue'),
      },
      {
        date: t('22-aug-2022-dateValue'),
        description: t('22-aug-2022-descriptionValue'),
      },
      {
        date: t('14-aug-2022-dateValue'),
        description: t('14-aug-2022-descriptionValue'),
      },
      {
        date: t('12-aug-2022-dateValue'),
        description: t('12-aug-2022-descriptionValue'),
      },
      {
        date: t('10-aug-2022-dateValue'),
        description: t('10-aug-2022-descriptionValue'),
      },
      {
        date: t('07-aug-2022-dateValue'),
        description: t('07-aug-2022-descriptionValue'),
      },
      {
        date: t('06-aug-2022-dateValue'),
        description: t('06-aug-2022-descriptionValue'),
      },
      {
        date: t('03-aug-2022-dateValue'),
        description: t('03-aug-2022-descriptionValue'),
      },
      {
        date: t('02-aug-2022-dateValue'),
        description: t('02-aug-2022-descriptionValue'),
      },
    ],
    [t],
  )

  return (
    <section
      className={`container mx-auto flex px-4 py-8 pt-10 ${getMainSectionClasses(
        chronoUser?.databaseData?.backgroundImage,
      )}`}
    >
      <div className="flex flex-col space-y-4 w-full">
        <h1 className="font-medium text-3xl text-primary-dark leading-8 tracking-wide">
          {t('title')}
        </h1>
        <p className="block text-base tracking-wide">{t('description')}</p>
        <table className="border w-full sm:table-fixed overflow-x-scroll">
          <thead className="text-left font-normal text-primary-dark">
            <tr className="border bg-primary-lighter">
              <th className="w-3/12 px-3 border">{t('dateHeaderLabel')}</th>
              <th className="w-9/12 px-3 border">{t('descriptionHeaderLabel')}</th>
            </tr>
          </thead>
          <tbody className="bg-secondary-light">
            {rows.map(({ date, description }, idx) => (
              <tr className="border" key={`${date}-${idx}`}>
                <td className="px-3 border py-2 w-3/12">{date}</td>
                <td className="px-3 border py-2 w-9/12">{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
