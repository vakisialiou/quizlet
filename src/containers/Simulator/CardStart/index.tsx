import { findSimulatorMethodById, simulatorMethodList } from '@containers/Simulator/constants'
import { randomizeTermIds, selectRandomTermId } from '@helper/simulators/general'
import { actionSaveSimulator, actionUpdateSettings } from '@store/action-main'
import { findSimulators, findTerms, RelationProps } from '@helper/relation'
import { actionExtraParamsUpdate } from '@helper/simulators/actions'
import Simulator, { SimulatorStatus } from '@entities/Simulator'
import RelationSimulator from '@entities/RelationSimulator'
import SimulatorSettings from '@entities/SimulatorSettings'
import Button, {ButtonVariant} from '@components/Button'
import { useMainSelector } from '@hooks/useMainSelector'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { filterEmptyTerms } from '@helper/terms'
import Achievement from '@entities/Achievement'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function SingleStart(
  {
    process,
    editable,
    relation
  }:
  {
    process?: boolean,
    editable: boolean,
    relation: RelationProps
  }
) {
  const terms = useMainSelector(({ terms }) => terms)
  const settings = useMainSelector(({ settings }) => settings)
  const simulators = useMainSelector(({ simulators }) => simulators)
  const relationTerms = useMainSelector(({ relationTerms }) => relationTerms)
  const relationSimulators = useMainSelector(({ relationSimulators }) => relationSimulators)

  const playTerms = useMemo(() => {
    const relatedTerms = findTerms(relationTerms, terms, relation)
    return filterEmptyTerms(relatedTerms)
  }, [relationTerms, terms, relation])

  const relatedSimulators = useMemo(() => {
    return findSimulators(relationSimulators, simulators, relation)
  }, [relationSimulators, simulators, relation])

  const t = useTranslations('Simulators')

  return (
    <CardEmpty
      classNameContent="relative"
    >
      {(process) &&
        <div className="animate-pulse flex w-full">
          <div className="flex flex-col w-full gap-2 items-center">
            <div className="h-3 bg-gray-500 opacity-40 w-1/3 rounded"></div>
            <div className="h-3 bg-gray-500 opacity-40 w-1/2 rounded"></div>
          </div>
        </div>
      }

      {(!process) &&
        <div className="flex flex-col justify-center text-center gap-4 w-full p-4">

          <div className="text-gray-300 text-lg font-bold">
            {t('simulatorStartTitle')}
          </div>

          <div className="text-gray-500 text-sm divide-y divide-gray-800 divide-dashed">
            {simulatorMethodList.map(({ id, method, name, inverted }) => {
              const achievement = new Achievement()
              const methodRate = achievement.getMethodRate(relatedSimulators, { method, inverted })
              const simulators = achievement.findSimulators(relatedSimulators, { method, inverted })

              const roundedRate = Number(methodRate).toFixed(1)

              return (
                <label
                  key={id}
                  className={clsx('relative h-10 flex gap-2 w-full items-center justify-between hover:bg-gray-500/30 px-3 cursor-pointer text-sm', {
                    ['bg-gray-500/20 pointer-events-none']: settings.simulator.id === id
                  })}
                >
                  <div className="absolute left-[8px] top-[4px] h-[calc(100%-8px)] w-[4px] overflow-hidden bg-white/5 rounded-full">
                    <div
                      className={clsx(`absolute left-0 bottom-0 w-full bg-white/50`)}
                      style={{ height: `${methodRate}%` }}
                    />
                  </div>

                  <div className="px-2 flex flex-col text-start">
                    <span className="leading-4">
                      {name}
                    </span>
                    <div
                      className="flex gap-2 text-[10px] leading-3 text-white/25"
                    >
                      <span>
                        {t('simulatorRepeat', { count: simulators.length })}
                      </span>
                      <span>
                        {t('simulatorRate', { rate: roundedRate })}
                      </span>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="method"
                    className="h-4 w-4"
                    value={settings.simulator.method}
                    checked={settings.simulator.id === id}
                    onChange={() => {
                      actionUpdateSettings({
                        editable,
                        settings: {
                          ...settings,
                          simulator: { ...settings.simulator, method, inverted, id }
                        },
                      })
                    }}
                  />
                </label>
              )
            })}
          </div>

          <Button
            variant={ButtonVariant.WHITE}
            disabled={!findSimulatorMethodById(settings.simulator.id) || playTerms.length === 0}
            onClick={() => {
              if (playTerms.length > 0) {
                const termIds = randomizeTermIds(playTerms.map(({id}) => id))

                const simulatorSettings = new SimulatorSettings()
                  .setId(settings.simulator.id)
                  .setMethod(settings.simulator.method)
                  .setInverted(settings.simulator.inverted)

                const simulator = new Simulator(SimulatorStatus.PROCESSING)
                  .setTermId(selectRandomTermId(termIds))
                  .setSettings(simulatorSettings)
                  .setTermIds(termIds)
                  .setActive(true)
                  .serialize()

                const relationSimulator = new RelationSimulator()
                  .setSimulatorId(simulator.id)
                  .setFolderId(relation.folderId || null)
                  .setModuleId(relation.moduleId || null)
                  .serialize()

                actionSaveSimulator({
                  editable,
                  relationSimulator,
                  simulator: actionExtraParamsUpdate(simulator),
                })
              }
            }}
          >
            {t('simulatorStartBtnStart')}
          </Button>
        </div>
      }
    </CardEmpty>
  )
}
