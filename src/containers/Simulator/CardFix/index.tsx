import { actionDeactivate } from '@helper/simulators/actions'
import Button, { ButtonVariant } from '@components/Button'
import { actionUpdateSimulator } from '@store/action-main'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { SimulatorData } from '@entities/Simulator'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function CardFix(
  {
    editable,
    simulator
  }:
  {
    editable: boolean,
    simulator: SimulatorData
  }
) {
  const t = useTranslations('Simulators')

  return (
    <CardEmpty
      classNameContent="p-6"
    >
      <div className="text-xl font-bold text-white/75 mb-4">
        {t('cardFixTitle')}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-sm text-white/50 px-4">
          {t('cardFixText')}
        </div>
      </div>

      <Button
        className="w-full px-4"
        variant={ButtonVariant.GREEN}
        onClick={() => {
          actionUpdateSimulator({simulator: actionDeactivate(simulator), editable})
        }}
      >
        {t('cardFixBtn')}
      </Button>
  </CardEmpty>
)
}
