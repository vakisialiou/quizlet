'use client'

import SimulatorBody from '@containers/Simulator/SimulatorBody'
import { actionDeactivate } from '@helper/simulators/actions'
import { getSimulatorById } from '@helper/simulators/general'
import { actionUpdateSimulator } from '@store/action-main'
import Button, { ButtonVariant } from '@components/Button'
import HeaderPageTitle from '@containers/HeaderPageTitle'
import { useMainSelector } from '@hooks/useMainSelector'
import TitleSimulator from '@containers/TitleSimulator'
import ButtonSquare from '@components/ButtonSquare'
import ContentPage from '@containers/ContentPage'
import { RelationProps } from '@helper/relation'
import { useTranslations } from 'next-intl'
import SVGBack from '@public/svg/back.svg'
import { useRouter } from '@i18n/routing'
import Dialog from '@components/Dialog'
import React, { useState } from 'react'

export default function Simulator(
  {
    relation,
    editable,
  }:
  {
    relation: RelationProps
    editable: boolean
  }
) {
  const router = useRouter()

  const [ deactivateSimulatorId, setDeactivateSimulatorId] = useState<string | null>(null)
  const simulators = useMainSelector(({ simulators }) => simulators)
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
      <TitleSimulator
        relation={relation}
      />

      <div
        className="w-full h-[calc(100%-48px)] flex flex-col items-center justify-center overflow-hidden"
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
