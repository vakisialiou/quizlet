import { findTerms, RelationProps } from '@helper/relation'
import { useMainSelector } from '@hooks/useMainSelector'
import { SimulatorData } from '@entities/Simulator'
import RoundInfo from '@components/RoundInfo'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'

export default function PanelInfo(
  {
    process = false,
    simulator,
    className = '',
    relation
  }:
  {
    process?: boolean,
    relation: RelationProps,
    simulator?: SimulatorData | null,
    className?: string
  }
) {
  const terms = useMainSelector(({ terms }) => terms)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)
  const simulatorTerms = findTerms(relationTerms, terms, relation)

  const continueIds = simulator && !process ? simulator?.continueIds : []
  const rememberIds = simulator && !process ? simulator?.rememberIds : []

  const t = useTranslations('Simulators')

  return (
    <div
      className={clsx('flex items-center justify-center select-none gap-4 w-full', {
        [className]: className
      })}
    >
      <RoundInfo
        title={t('simulatorPanelTotal')}
        value={simulatorTerms.length}
      />

      <RoundInfo
        title={t('simulatorPanelDone')}
        value={rememberIds.length}
      />

      <RoundInfo
        title={t('simulatorPanelWait')}
        value={Math.max(continueIds.length, 0)}
      />

    </div>
  )
}
