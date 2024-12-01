import { actionStartSimulators, actionUpdateSettingsSimulator } from '@store/index'
import {simulatorMethodList} from '@containers/Simulator/constants'
import {filterFolderTerms} from '@containers/Simulator/helpers'
import {ClientSettingsData} from '@entities/ClientSettings'
import {ClientFolderData} from '@entities/ClientFolder'
import CardEmpty from '@containers/Simulator/CardEmpty'
import Button, { ButtonSkin } from '@components/Button'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function SingleQueueStart(
  { process = false, folder }:
  { process?: boolean, folder?: ClientFolderData | null }
) {
  const settings = useSelector(({ settings }: { settings: ClientSettingsData }) => settings)
  const playTerms = useMemo(() => {
    return filterFolderTerms(folder)
  }, [folder])

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
        <div className="flex flex-col justify-center text-center gap-4 w-full p-8">

          <div className="text-gray-300 text-lg font-bold">
            Simulators
          </div>

          <div className="text-gray-500 text-sm divide-y divide-gray-800 divide-dashed">
            {simulatorMethodList.map(({ id, method, name, inverted }) => {
              return (
                <label
                  key={id}
                  className={clsx('h-8 flex gap-2 w-full items-center justify-between hover:bg-gray-500/30 px-2 cursor-pointer text-sm', {
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
            skin={ButtonSkin.WHITE}
            disabled={!settings.simulator.id || playTerms.length === 0}
            onClick={() => {
              if (playTerms.length > 0) {
                const termIds = playTerms.map(({id}) => id)
                actionStartSimulators({folderId: folder.id, termIds})
              }
            }}
          >
            Start
          </Button>
        </div>
      }
    </CardEmpty>
  )
}
