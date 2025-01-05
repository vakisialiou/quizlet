import { findSimulatorMethodById, simulatorMethodList } from '@containers/Simulator/constants'
import { actionSaveSimulator, actionUpdateSettingsSimulator } from '@store/index'
import SimulatorSettings, { SimulatorMethod } from '@entities/SimulatorSettings'
import { randomizeTermIds, selectRandomTermId } from '@helper/simulators/general'
import { findSimulators, findTerms, RelationProps } from '@helper/relation'
import { filterDeletedTerms, filterEmptyTerms } from '@helper/terms'
import Simulator, { SimulatorStatus } from '@entities/Simulator'
import { useSimulatorSelect } from '@hooks/useSimulatorSelect'
import RelationSimulator from '@entities/RelationSimulator'
import Button, {ButtonVariant} from '@components/Button'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { useTermSelect } from '@hooks/useTermSelect'
import { SettingsData } from '@entities/Settings'
import Achievement from '@entities/Achievement'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
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

  const { relationTerms, terms } = useTermSelect()
  const { relationSimulators, simulators } = useSimulatorSelect()
  const settings = useSelector(({ settings }: { settings: SettingsData }) => settings)

  const playTerms = useMemo(() => {
    const relatedTerms = findTerms(relationTerms, terms, relation)
    return filterDeletedTerms(filterEmptyTerms(relatedTerms))
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
                    <span className="text-[10px] leading-3 text-white/25">
                      {t('simulatorRepeat', { count: simulators.length })}
                    </span>
                  </div>

                  <input
                    type="radio"
                    name="method"
                    className="h-4 w-4"
                    value={settings.simulator.method}
                    checked={settings.simulator.id === id}
                    onChange={() => {
                      actionUpdateSettingsSimulator({
                        simulatorSettings: { method, inverted, id },
                        editable
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

                let termId
                if (simulatorSettings.method === SimulatorMethod.PICK) {
                  const extraTermIds = termIds.length > 4 ? randomizeTermIds(termIds).splice(0, 4) : termIds
                  simulatorSettings.setExtraTermIds(extraTermIds)
                  termId = selectRandomTermId(extraTermIds)
                } else {
                  termId = selectRandomTermId(termIds)
                }

                const simulator = new Simulator(SimulatorStatus.PROCESSING)
                  .setSettings(simulatorSettings)
                  .setTermIds(termIds)
                  .setTermId(termId)
                  .setActive(true)
                  .serialize()

                const relationSimulator = new RelationSimulator()
                  .setSimulatorId(simulator.id)
                  .setFolderId(relation.folderId || null)
                  .setModuleId(relation.moduleId || null)
                  .serialize()

                actionSaveSimulator({
                  editable,
                  simulator,
                  relationSimulator,
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
