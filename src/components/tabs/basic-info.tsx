import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { UserData } from '.'
import { Button, ButtonRound, ButtonVariant } from '../button'
import { SpinnerIcon } from '../icons'
import { Input } from '../input'

const BasicInfoInput = ({
  label,
  defaultValue,
  id,
  name,
  placeholder,
}: {
  label: string
  defaultValue?: string
  id: string
  name: string
  placeholder?: string
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <label
        htmlFor={name}
        className="inline w-full sm:w-3/12 pr-8 font-medium text-gray-dark text-15"
      >
        {label}
      </label>
      <Input
        placeholder={placeholder}
        id={id}
        name={name}
        className="w-full sm:w-9/12"
        defaultValue={defaultValue}
      />
    </div>
  )
}

export const BasicInfoContent = ({
  userData,
  onSubmit,
  isSubmitting = false,
}: {
  userData: UserData
  onSubmit?: FormEventHandler<HTMLFormElement>
  isSubmitting?: boolean
}) => {
  const { t } = useTranslation('profile')
  return (
    <div>
      <h1 className="text-30 font-medium text-gray-dark leading-6">
        {t('basicInfoContent.yourBasicInfoLabel')}
      </h1>
      <hr className="my-4 bg-gray-dark border-b" />
      <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
        <BasicInfoInput
          id="name"
          name="name"
          label={t('basicInfoContent.nameInputLabel')}
          defaultValue={userData.name}
        />
        <BasicInfoInput
          id="nick"
          name="nick"
          label={t('basicInfoContent.nickInputLabel')}
          defaultValue={userData.nickname ?? ''}
        />
        <BasicInfoInput
          id="backgroundImage"
          name="backgroundImage"
          label={t('basicInfoContent.bgImageInputLabel')}
          defaultValue={userData.backgroundImageUrl}
          placeholder={t('basicInfoContent.imagesInputPlaceholder')}
        />
        <BasicInfoInput
          id="thumbnailImage"
          name="thumbnailImage"
          label={t('basicInfoContent.thumbnailInputLabel')}
          defaultValue={userData.thumbnailImageUrl}
          placeholder={t('basicInfoContent.imagesInputPlaceholder')}
        />
        <div className="flex justify-between items-center">
          <div className="w-0 sm:w-3/12 sm:pr-8" />
          <div className="w-full sm:w-9/12">
            <Button
              className="px-4 py-1.5 w-full sm:w-auto"
              variant={ButtonVariant.PRIMARY}
              round={ButtonRound.LG}
              disabled={isSubmitting}
            >
              <div className="text-white flex space-x-0 md:space-x-3 items-center">
                {isSubmitting && <SpinnerIcon width={20} height={20} color="currentColor" />}
                <span className="font-medium text-15 text-white">
                  {t('basicInfoContent.updateInfoButtonLabel')}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
