import { SimulatorMethod } from '@entities/ClientSettingsSimulator'
import { filterFolderTerms } from '@containers/Simulator/helpers'
import { ClientSettingsData } from '@entities/ClientSettings'
import { actionUpdateSettingsSimulator } from '@store/index'
import { ClientFolderData } from '@entities/ClientFolder'
import CardEmpty from '@containers/Simulator/CardEmpty'
import { actionStartSimulators } from '@store/index'
import ButtonSquare from '@components/ButtonSquare'
import SVGSettings from '@public/svg/settings.svg'
import Dropdown from '@components/Dropdown'
import { useSelector } from 'react-redux'
import Button from '@components/Button'
import clsx from 'clsx'

export default function SingleQueueStart(
  { process = false, folder }:
  { process?: boolean, folder?: ClientFolderData | null }
) {
  const settings = useSelector(({ settings }: { settings: ClientSettingsData }) => settings)

  const simulatorMethods = [
    { method: SimulatorMethod.single, name: 'Single' },
  ]

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
        <div className="absolute top-2 right-2">
          <Dropdown
            menu={(
              <div className="flex flex-col gap-2 p-2 w-44 text-gray-500">
                <div
                  className="flex flex-col"
                >
                  <div
                    className="text-gray-700 font-bold text-sm"
                  >
                    Flip rule
                  </div>
                  {simulatorMethods.map(({ method, name }) => {
                    return (
                      <label
                        key={method}
                        className={clsx('flex gap-2 w-full items-center justify-between hover:bg-gray-900 py-2 px-3 cursor-pointer text-xs', {
                          ['bg-gray-800 pointer-events-none']: settings.simulator.method === method
                        })}
                      >
                        {name}
                        <input
                          type="radio"
                          name="method"
                          value={settings.simulator.method}
                          checked={settings.simulator.method === method}
                          onChange={() => {
                            actionUpdateSettingsSimulator({ method })
                          }}
                        />
                      </label>
                    )
                  })}
                </div>

                <div
                  className="flex flex-col"
                >
                  <div
                    className="text-gray-700 font-bold text-sm"
                  >
                    Flip sides
                  </div>
                  <label
                    className={clsx('flex gap-2 w-full items-center justify-between hover:bg-gray-900 py-2 px-3 text-xs', {
                      ['bg-gray-800']: settings.simulator.inverted
                    })}
                  >
                    {settings.simulator.inverted ? 'On' : 'Off'}
                    <input
                      type="checkbox"
                      checked={settings.simulator.inverted}
                      onChange={() => {
                        actionUpdateSettingsSimulator({ inverted: !settings.simulator.inverted })
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          >
            <ButtonSquare
              size={24}
              icon={SVGSettings}
              onClick={() => {

              }}
            />
          </Dropdown>
        </div>
      }

      {(!process && folder) &&
        <div className="flex flex-col justify-center text-center gap-2">

          <div className="text-gray-300 text-lg">
          Time to learn!
          </div>

          <br/>

          <div className="text-gray-500 text-sm">
            Ready to get started?
          </div>

          <Button
            onClick={() => {
              const terms = filterFolderTerms(folder)
              if (terms.length > 0) {
                const termIds = terms.map(({id}) => id)
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
