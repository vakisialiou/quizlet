'use client'

import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, { ButtonSkin } from '@components/Button'
import SVGNewFolder from '@public/svg/new_folder.svg'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import ClientFolder from '@entities/ClientFolder'
import { actionSaveFolder } from '@store/index'
import Grid from '@containers/Collection/Grid'
import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/routing'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'

export default function Collection() {
  const t = useTranslations('Folders')
  const [ showUserHelp, setShowUserHelp ] = useState(false)
  const [search, setSearch] = useState<string>('')

  const router = useRouter()

  return (
    <ContentPage
      showHeader
      showFooter
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
            skin={ButtonSkin.WHITE}
            className="w-full lg:w-auto px-8 gap-1"
            onClick={() => {
              const folder = new ClientFolder().serialize()
              actionSaveFolder({ folder, editId: folder.id })
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
        <ButtonSquare
          icon={SVGQuestion}
          disabled={showUserHelp}
          onClick={() => setShowUserHelp(true)}
        />
      )}
    >
      <Grid
        search={search}
        onOpen={(folder) => {
          router.push(`/private/folder/${folder.id}`)
        }}
        onPlay={(folder) => {
          router.push(`/private/simulator/${folder.id}`)
        }}
      />

      {showUserHelp &&
        <Dialog
          title={t('userHelpTitle')}
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
            skin={ButtonSkin.GRAY}
            onClick={() => {
              setShowUserHelp(false)
            }}
          >
          {t('userHelpButtonClose')}
          </Button>
        </Dialog>
      }
    </ContentPage>
  )
}
