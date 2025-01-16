'use client'

import SimulatorBody from '@containers/Simulator/SimulatorBody'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import { actionDeactivate } from '@helper/simulators/actions'
import { getSimulatorById } from '@helper/simulators/general'
import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import { actionUpdateSimulator } from '@store/index'
import ButtonSquare from '@components/ButtonSquare'
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
            icon={SVGBack}
            onClick={() => router.back()}
          />
        </>
      )}
    >
      <FolderTitle
        relation={relation}
      />

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
