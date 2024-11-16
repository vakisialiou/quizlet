'use client'

import SVGLoopBack from '@public/svg/loop_back.svg'
import { useEffect, useMemo, useRef } from 'react'
import Breadcrumbs from '@components/Breadcrumbs'
import RoundInfo from '@components/RoundInfo'
import CardEmpty from '@components/CardEmpty'
import {useSelector} from 'react-redux'
import Button from '@components/Button'
import { shuffle } from '@lib/array'
import Card from '@components/Card'
import {
  actionContinueSimulators,
  actionRememberSimulators,
  actionRestartSimulators,
  actionFetchSimulators,
  actionStartSimulators,
  actionBackSimulators,
} from '@store/index'
import {
  FoldersType,
  SimulatorsType,
  SimulatorStatus
} from '@store/initial-state'

export default function Simulator({ folderId }: { folderId: string }) {
  useEffect(actionFetchSimulators, [])

  const simulator = useSelector(({ simulators }: { simulators: SimulatorsType }) => simulators[folderId]) || {
    status: SimulatorStatus.WAITING,
    termId: null,
    terms: [],
    historyIds: [],
    rememberIds: [],
    continueIds: []
  }

  const folders = useSelector(({ folders }: { folders: FoldersType }) => folders)

  const folder = useMemo(() => {
    return folders.items.find(({ id }) => id === folderId)
  }, [folders, folderId])

  const activeTerm = useMemo(() => {
    return (folder?.terms || []).find(({ id }) => id === simulator.termId)
  }, [folder, simulator.termId])

  const ref = useRef<HTMLDivElement|null>(null)
  const refIntervalId = useRef<NodeJS.Timeout|number|undefined>(undefined)

  useEffect(() => {
    if (simulator.status === SimulatorStatus.FINISHING && simulator.continueIds.length > 0) {
      let i = 0
      refIntervalId.current = setInterval(() => {
        i++

        if (ref.current) {
          ref.current.innerText = `${5 - i}`
        }

        if (i >= 5) {
          clearInterval(refIntervalId.current)
          actionRestartSimulators({ folderId })
        }
      }, 1000)
      return
    }

    clearInterval(refIntervalId.current)
  }, [simulator.status])

  return (
    <div
      className="flex flex-col px-4 gap-2"
    >
      <Breadcrumbs
        items={[
          { id: 1, name: 'Home', href: '/' },
          { id: 2, name: 'Folders', href: '/private' },
          { id: 3, name: folder?.name },
        ]}
      />

      <div
        className="flex items-center justify-center w-full h-14"
      >
        {(simulator.status === SimulatorStatus.PROCESSING && simulator.historyIds.length > 0) &&
          <div
            className="flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 cursor-pointer w-8 h-8"
            onClick={() => {
              actionBackSimulators({ folderId })
            }}
          >
            <SVGLoopBack
              width={24}
              height={24}
              className="text-gray-600"
            />
          </div>
        }
      </div>

      {simulator.status === SimulatorStatus.WAITING &&
        <div className="flex justify-center w-full">
          <CardEmpty>
            <div className="text-lg">
              Are you ready?
            </div>

            <Button
              onClick={() => {
                const items = [...folder?.terms || []]
                if (items.length > 0) {
                  actionStartSimulators({ folderId, items: shuffle(items) })
                }
              }}
            >
              Start learn
            </Button>
          </CardEmpty>
        </div>
      }

      {simulator.status === SimulatorStatus.FINISHING &&
        <div className="flex justify-center w-full">
          <CardEmpty>
            {simulator.continueIds.length === 0 &&
              <>
                <div className="text-lg">
                  Every thinks is done!
                </div>

                <div className="flex gap-2 w-full items-center justify-center">
                  <Button
                    onClick={() => {
                      const items = [...folder?.terms || []]
                      if (items.length > 0) {
                        actionStartSimulators({ folderId, items: shuffle(items) })
                      }
                    }}
                  >
                    Start again
                  </Button>
                </div>
              </>
            }

            {simulator.continueIds.length > 0 &&
              <>
                <div className="text-lg">
                  Prepare to continue.
                </div>

                <div ref={ref}>
                  5
                </div>
              </>
            }
          </CardEmpty>
        </div>
      }

      {simulator.status === SimulatorStatus.PROCESSING && activeTerm &&

          <div className="flex items-center justify-center gap-4 w-full">

            <div className="flex flex-col gap-4">

              <div className="flex items-center justify-around w-full">
                <RoundInfo
                  title="Total"
                  value={simulator.terms.length}
                />

                <RoundInfo
                  title="Call"
                  value={simulator.terms.length - simulator.continueIds.length - simulator.rememberIds.length - 1}
                />

                <RoundInfo
                  title="Done"
                  value={simulator.rememberIds.length}
                />
              </div>

              <Card
                key={activeTerm.id}
                answer={activeTerm.answer || ''}
                question={activeTerm.question || ''}
              />

              <div className="gap-4 justify-between grid grid-cols-2">
                <div>
                  <Button
                    className="flex items-center justify-center"
                    onClick={() => {
                      actionRememberSimulators({folderId})
                    }}
                  >
                    Remembered
                  </Button>
                </div>
                <div>
                  <Button
                    className="flex items-center justify-center"
                    onClick={() => {
                      actionContinueSimulators({folderId})
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
