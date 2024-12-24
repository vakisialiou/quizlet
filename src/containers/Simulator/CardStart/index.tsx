import { simulatorMethodList, findSimulatorMethodById } from '@containers/Simulator/constants'
import { actionStartSimulators, actionUpdateSettingsSimulator } from '@store/index'
import { filterDeletedTerms, filterEmptyTerms, findTermsByIds } from '@helper/terms'
import { ClientSettingsData } from '@entities/ClientSettings'
import Button, { ButtonVariant } from '@components/Button'
import { ClientFolderData } from '@entities/ClientFolder'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function SingleStart(
  { process = false, folder }:
  { process?: boolean, folder?: ClientFolderData | null }
) {

  const settings = useSelector(({ settings }: { settings: ClientSettingsData }) => settings)

  const playTerms = useMemo(() => {
    const terms = filterDeletedTerms(filterEmptyTerms([...folder?.terms || []]))
    const termIds = [...folder?.relationTerms || []].map(({ termId }) => termId)
    return findTermsByIds(terms, termIds)
  }, [folder?.terms, folder?.relationTerms])

  const t = useTranslations('Simulators')

  return (
    <CardEmpty
      classNameContent="relative"
    >
      {(process || !folder) &&
        <div className="animate-pulse flex w-full">
          <div className="flex flex-col w-full gap-2 items-center">
            <div className="h-3 bg-gray-500 opacity-40 w-1/3 rounded"></div>
            <div className="h-3 bg-gray-500 opacity-40 w-1/2 rounded"></div>
          </div>
        </div>
      }

      {(!process && folder) &&
        <div className="flex flex-col justify-center text-center gap-4 w-full p-4">

          <div className="text-gray-300 text-lg font-bold">
            {t('simulatorStartTitle')}
          </div>

          <div className="text-gray-500 text-sm divide-y divide-gray-800 divide-dashed">
            {simulatorMethodList.map(({ id, method, name, inverted }) => {
              return (
                <label
                  key={id}
                  className={clsx('h-10 flex gap-2 w-full items-center justify-between hover:bg-gray-500/30 px-3 cursor-pointer text-sm', {
                    ['bg-gray-500/20 pointer-events-none']: settings.simulator.id === id
                  })}
                >
                  {name}
                  <input
                    type="radio"
                    name="method"
                    className="h-4 w-4"
                    value={settings.simulator.method}
                    checked={settings.simulator.id === id}
                    onChange={() => {
                      actionUpdateSettingsSimulator({ method, inverted, id })
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
                const termIds = playTerms.map(({id}) => id)
                actionStartSimulators({
                  termIds,
                  folderId: folder.id,
                  settings: settings.simulator
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
