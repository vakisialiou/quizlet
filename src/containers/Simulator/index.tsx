'use client'

import {DataStateSimulatorsType, useSimulatorActions} from '@store/reducers/simulators'
import {getSimulatorStatus, SimulatorStatus} from '@containers/Simulator/status'
import {getAllTermItems} from '@containers/Simulator/helpers'
import {filterActiveTerm, filterTerms} from '@containers/Simulator/filter'
import {DataStateFoldersType} from '@store/reducers/folders'
import {DataStateTermsType} from '@store/reducers/terms'
import SVGRightArrow from '@public/svg/rightarrow.svg'
import SVGLoopBack from '@public/svg/loop_back.svg'
import {useSelector} from 'react-redux'
import Button from '@components/Button'
import Card from '@components/Card'
import {useEffect, useMemo, useRef} from 'react'
import Link from 'next/link'
import {randomArrayElement} from '@lib/random'

export default function Simulator({ folderUUID }: { folderUUID: string }) {
  const actions = useSimulatorActions()

  const simulators = useSelector(({ simulators }: { simulators: DataStateSimulatorsType }) => simulators)
  const folders = useSelector(({ folders }: { folders: DataStateFoldersType }) => folders)
  const terms = useSelector(({ terms }: { terms: DataStateTermsType }) => terms)

  const allTermItems = getAllTermItems(terms, folderUUID)

  const folder = useMemo(() => {
    return folders.items.find(({ uuid }) => uuid === folderUUID)
  }, [folders, folderUUID])

  const { activeTerm, termItems } = useMemo(() => {
    const termItems = filterTerms(allTermItems, simulators[folderUUID])
    return {
      termItems,
      activeTerm: termItems.find((item) => {
        return item.uuid === simulators[folderUUID]?.termUUID
      }) || termItems[0] || null
    }
  }, [folders, simulators])

  const status = getSimulatorStatus(simulators, folderUUID)
  const tailTermItems = filterActiveTerm(termItems, activeTerm?.uuid)

  const ref = useRef<HTMLDivElement|null>(null)
  const refIntervalId = useRef<NodeJS.Timeout|number|undefined>(undefined)

  useEffect(() => {
    if (status === SimulatorStatus.FINISHING && simulators[folderUUID].continueUUIDs.length > 0) {
      let i = 0
      refIntervalId.current = setInterval(() => {
        i++

        if (ref.current) {
          ref.current.innerText = `${5 - i}`
        }

        if (i >= 5) {
          clearInterval(refIntervalId.current)
          actions.restart({ folderUUID })
        }
      }, 1000)
      return
    }

    clearInterval(refIntervalId.current)
  }, [status])

  return (
    <div
      className="flex flex-col px-4 gap-2"
    >
      <div className="flex items-center text-gray-400 font-semibold gap-1">
        <Link href="/" className="text-gray-400 hover:text-gray-500">
          Folders
        </Link>

        <SVGRightArrow
          width={24}
          height={24}
          className="text-gray-600"
        />

        <span className="text-gray-600">{folder?.name}</span>
      </div>

      <div
        className="relative flex items-center justify-center w-full"
      >
        {status === SimulatorStatus.PROCESSING &&
          <div
            className="absolute flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 cursor-pointer w-8 h-8 left-2"
          >
            <SVGLoopBack
              width={24}
              height={24}
              className="text-gray-600"
            />
          </div>
        }
        <div
          className="absolute flex items-center justify-center rounded-full border border-gray-600 text-gray-600 px-4 h-12 right-2"
        >
          Learned: {simulators[folderUUID]?.rememberUUIDs.length || 0}:{ allTermItems.length }
        </div>
      </div>

      {status === SimulatorStatus.WAITING &&
        <div className="flex justify-center w-full py-20">
          <div
            className="flex flex-col w-72 h-96 gap-4 items-center justify-center p-6 border border-gray-600 rounded bg-gray-900"
          >
            <div className="text-lg">
              Are you ready?
            </div>

            <Button
              onClick={() => {
                if (allTermItems.length > 0) {
                  const termItem = randomArrayElement(allTermItems)
                  actions.start({folderUUID, termUUID: termItem.uuid})
                }
              }}
            >
              Start learn
            </Button>
          </div>
        </div>
      }

      {status === SimulatorStatus.FINISHING &&
        <div className="flex justify-center w-full py-20">
          <div
            className="flex flex-col w-72 h-96 gap-4 items-center justify-center p-6 border border-gray-600 rounded bg-gray-900"
          >
            <div className="text-lg">
              Great job
            </div>

            {simulators[folderUUID].continueUUIDs.length === 0 &&
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => {
                    if (allTermItems.length > 0) {
                      const termItem = randomArrayElement(allTermItems)
                      actions.start({folderUUID, termUUID: termItem.uuid})
                    }
                  }}
                >
                  Start again
                </Button>
              </div>
            }

            {simulators[folderUUID].continueUUIDs.length > 0 &&
              <div ref={ref}>
                5
              </div>
            }
          </div>
        </div>
      }

      {status === SimulatorStatus.PROCESSING &&
        <div className="flex justify-center w-full py-20">
          <div className="flex flex-col">
            <Card
              answer={activeTerm?.answer}
              question={activeTerm?.question}
            />

            <div className="flex gap-2 justify-between grid grid-cols-2 py-6">
              <div>
                <Button
                  className="flex items-center justify-center"
                  onClick={() => {
                    if (tailTermItems.length === 0) {
                      actions.rememberAndFinish({ folderUUID })
                    } else {
                      const termItem = randomArrayElement(tailTermItems)
                      actions.remember({ folderUUID, termUUID: termItem.uuid })
                    }
                  }}
                >
                  Remembered
                </Button>
              </div>
              <div>
                <Button
                  className="flex items-center justify-center"
                  onClick={() => {
                    if (tailTermItems.length === 0) {
                      actions.continueAndFinish({ folderUUID })
                    } else {
                      const termItem = randomArrayElement(tailTermItems)
                      actions.continue({ folderUUID, termUUID: termItem.uuid })
                    }
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}
