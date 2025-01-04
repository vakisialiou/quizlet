'use client'

import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import SVGNewFolder from '@public/svg/new_folder.svg'
import { ConfigEditType } from '@store/initial-state'
import Module, { ModuleData } from '@entities/Module'
import Modules from '@containers/Collection/Modules'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import { actionSaveModule } from '@store/index'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import { useRouter } from '@i18n/routing'
import { useSelector } from 'react-redux'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'

export default function Collection() {
  const editable = true
  const t = useTranslations('Folders')

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
        <div className="flex w-full justify-center lg:justify-end">
          <Button
            variant={ButtonVariant.WHITE}
            className="w-full lg:w-auto px-8 gap-1"
            onClick={() => {
              const module = new Module().serialize()
              actionSaveModule({ module, editId: module.id, editable })
            }}
          >
            <SVGNewFolder
              width={28}
              height={28}
              className="text-gray-700"
            />

            {t('footButtonCreateModule')}
          </Button>
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
        onOpenModule={(module) => {
          router.push(`/private/module/${module.id}`)
        }}
        onPlayModule={(module) => {
          router.push(`/private/simulator/${module.id}`)
        }}
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
