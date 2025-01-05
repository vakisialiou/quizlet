'use client'

import SimulatorBody from '@containers/Simulator/SimulatorBody'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import { actionDeactivate } from '@helper/simulators/actions'
import { getSimulatorById } from '@helper/simulators/general'
import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import { actionUpdateSimulator } from '@store/index'
import ButtonSquare from '@components/ButtonSquare'
import SVGQuestion from '@public/svg/question.svg'
import FolderTitle from '@containers/FolderTitle'
import ContentPage from '@containers/ContentPage'
import { RelationProps } from '@helper/relation'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import { useRouter } from '@i18n/routing'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'

export default function Simulator({ relation, editable }: { relation: RelationProps, editable: boolean }) {
  const router = useRouter()

  const [ deactivateSimulatorId, setDeactivateSimulatorId] = useState<string | null>(null)
  const [showUserHelp, setShowUserHelp] = useState(false)
  const { simulators } = useSimulatorSelect()
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
          relation={relation}
        />
      </div>

      <div
        className="w-full flex flex-col items-center justify-center overflow-hidden mt-4"
      >
        <SimulatorBody
          editable={editable}
          relation={relation}
          onDeactivateAction={(simulatorId) => {
            setDeactivateSimulatorId(simulatorId)
          }}
        />

        {showUserHelp &&
          <Dialog
            title={t('userHelpTitle')}
            onClose={() => setShowUserHelp(false)}
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
              onClick={() => setShowUserHelp(false)}
            >
              {t('userHelpButtonClose')}
            </Button>
          </Dialog>
        }

        {deactivateSimulatorId &&
          <Dialog
            title={t('removeDialogTitle')}
            text={t('removeDialogText')}
            onClose={() => setDeactivateSimulatorId(null)}
          >
            <Button
              className="min-w-28 px-4"
              variant={ButtonVariant.GRAY}
              onClick={() => {
                const deactivatedSimulator = getSimulatorById(simulators, deactivateSimulatorId)
                if (!deactivatedSimulator) {
                  return
                }

                actionUpdateSimulator({ simulator: actionDeactivate(deactivatedSimulator), editable }, () => {
                  setDeactivateSimulatorId(null)
                })
              }}
            >
              {t('removeDialogButtonApprove')}
            </Button>

            <Button
              className="min-w-28 px-4"
              variant={ButtonVariant.WHITE}
              onClick={() => setDeactivateSimulatorId(null)}
            >
              {t('removeDialogButtonCancel')}
            </Button>
          </Dialog>
        }
      </div>
    </ContentPage>
  )
}
