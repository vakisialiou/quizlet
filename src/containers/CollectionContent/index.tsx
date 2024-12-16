'use client'

import Button, { ButtonSkin } from '@components/Button'
import CollectionGrid from '@containers/CollectionGrid'
import SVGNewFolder from '@public/svg/new_folder.svg'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import ContentPage from '@containers/ContentPage'
import ClientFolder from '@entities/ClientFolder'
import { actionSaveFolder } from '@store/index'
import { useTranslations } from 'next-intl'
import { useRouter } from '@i18n/routing'
import Dialog from '@components/Dialog'
import Search from '@components/Search'
import { useState } from 'react'

export default function Collections() {
  const t = useTranslations('Folders')
  const [ showUserHelp, setShowUserHelp ] = useState(false)
  const [ search, setSearch ] = useState<string | null>(null)

  const router = useRouter()

  return (
    <ContentPage
      showHeader
      showFooter
      title={t('headTitle')}
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
      <div
        className="flex gap-2 w-full items-center justify-between px-2 pt-2 md:px-4 md:pt-4"
      >
        <Search
          rounded
          bordered
          value={search || ''}
          className="w-full md:w-96"
          onClear={() => setSearch(null)}
          placeholder={t('searchPlaceholder')}
          onChange={(e) => {
            setSearch(e.target.value ? `${e.target.value}`.toLocaleLowerCase() : null)
          }}
        />

        <ButtonSquare
          bordered
          icon={SVGNewFolder}
          onClick={() => {
            const folder = new ClientFolder().serialize()
            actionSaveFolder({ folder, editId: folder.id })
          }}
        />
      </div>

      <CollectionGrid
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
                <div className="font-bold">{t('userHelpSection1Title')}</div>
                {t('userHelpSection1Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection2Title')}</div>
                {t('userHelpSection2Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection3Title')}</div>
                {t('userHelpSection3Text')}
              </div>

              <div className="flex flex-col gap-1">
                <div className="font-bold">{t('userHelpSection4Title')}</div>
                {t('userHelpSection4Text')}
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
