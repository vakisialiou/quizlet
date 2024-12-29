'use client'

import SimulatorBody from '@containers/Simulator/SimulatorBody'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import Button, {ButtonVariant} from '@components/Button'
import Dialog, {DialogType} from '@components/Dialog'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import FolderTitle from '@containers/FolderTitle'
import ContentPage from '@containers/ContentPage'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import React, { useState } from 'react'
import {useRouter} from '@i18n/routing'
import {
  actionDeactivateSimulators,
} from '@store/index'

export default function Simulator({ folderId }: { folderId: string }) {
  const router = useRouter()

  const [stopFolderId, setStopFolderId] = useState<string | null>(null)
  const [showUserHelp, setShowUserHelp] = useState(false)
  const t = useTranslations('Simulators')

  return (
    <ContentPage
      showHeader
      title={(
        <HeaderPageTitle
          title={t('headTitle')}
        />
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
              router.push(`/private`)
            }}
          />
        </>
      )}
    >
      <div className="p-2">
        <FolderTitle
          folderId={folderId}
        />
      </div>

      <div
        className="w-full flex flex-col items-center justify-center overflow-hidden mt-4"
      >
        <SimulatorBody
          folderId={folderId}
          onDeactivateAction={(folder) => {
            setStopFolderId(folder.id)
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

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection5Title')}</div>
                  {t('userHelpSection5Text')}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-bold">{t('userHelpSection6Title')}</div>
                  {t('userHelpSection6Text')}
                </div>
              </div>
            )}
          >
            <Button
              className="min-w-28 px-4"
              variant={ButtonVariant.GRAY}
              onClick={() => {
                setShowUserHelp(false)
              }}
            >
              {t('userHelpButtonClose')}
            </Button>
          </Dialog>
        }

        {stopFolderId &&
          <Dialog
            title={t('removeDialogTitle')}
            text={t('removeDialogText')}
            type={DialogType.warning}
          >
            <Button
              className="min-w-28 px-4"
              variant={ButtonVariant.GRAY}
              onClick={() => {
                actionDeactivateSimulators({ folderId: stopFolderId }, () => {
                  setStopFolderId(null)
                })
              }}
            >
              {t('removeDialogButtonApprove')}
            </Button>

            <Button
              className="min-w-28 px-4"
              variant={ButtonVariant.WHITE}
              onClick={() => setStopFolderId(null)}
            >
              {t('removeDialogButtonCancel')}
            </Button>
          </Dialog>
        }
      </div>
    </ContentPage>
  )
}
