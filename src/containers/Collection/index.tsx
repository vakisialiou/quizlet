'use client'

import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import SVGNewPreset from '@public/svg/preset_new.svg'
import { ConfigEditType } from '@store/initial-state'
import Modules from '@containers/Collection/Modules'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import { useRouter } from '@i18n/routing'
import { useSelector } from 'react-redux'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'
import Module from '@entities/Module'

export default function Collection() {
  const editable = true
  const t = useTranslations('Modules')

  const edit = useSelector(({ edit }: { edit: ConfigEditType }) => edit)

  const [ showUserHelp, setShowUserHelp ] = useState(false)
  const [search, setSearch] = useState<string>('')

  const router = useRouter()

  return (
    <ContentPage
      showHeader
      showFooter
      options={{
        padding: true,
        scrollbarGutter: true,
      }}
      title={(
        <HeaderPageTitle
          title={t('headTitle')}
          search={{
            value: search || '',
            onClear: () => setSearch(''),
            placeholder: t('searchPlaceholder'),
            onChange: ({ formattedValue }) => setSearch(formattedValue)
          }}
        />
      )}
      footer={(
        <div className="flex w-full justify-center text-center">
          <div className="flex gap-2 w-full max-w-96">
            <Button
              disabled={!editable}
              variant={ButtonVariant.WHITE}
              className="w-full"
              onClick={() => {
                const module = new Module().serialize()
                router.push(`/private/modules/${module.id}`)
              }}
            >
              <SVGNewPreset
                width={28}
                height={28}
              />

              {t('footButtonCreateModule')}
            </Button>
          </div>
        </div>
      )}
      rightControls={(
        <>
          <ButtonSquare
            icon={SVGQuestion}
            disabled={showUserHelp}
            onClick={() => setShowUserHelp(true)}
          />

          <ButtonSquare
            icon={SVGBack}
            onClick={() => {
              router.push(`/`)
            }}
          />
        </>
      )}
    >
      <Modules
        filter={{ search }}
        editable={editable}
        editId={edit.moduleId}
      />

      {showUserHelp &&
        <Dialog
          title={t('userHelpTitle')}
          onClose={() => setShowUserHelp(false)}
          text={(
            <div className="flex flex-col gap-4 text-gray-800">
              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection1Title')}
                </div>
                {t('userHelpSection1Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection2Title')}
                </div>
                {t('userHelpSection2Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection3Title')}
                </div>
                {t('userHelpSection3Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection4Title')}
                </div>
                {t('userHelpSection4Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection5Title')}
                </div>
                {t('userHelpSection5Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection6Title')}
                </div>
                {t('userHelpSection6Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection7Title')}
                </div>
                {t('userHelpSection7Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection8Title')}
                </div>
                {t('userHelpSection8Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">
                  {t('userHelpSection9Title')}
                </div>
                {t('userHelpSection9Text')}
              </div>
            </div>
          )}
        >
          <Button
            className="min-w-28 px-4"
            variant={ButtonVariant.GRAY}
            onClick={() => setShowUserHelp(false)}
          >
          {t('userHelpButtonClose')}
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
